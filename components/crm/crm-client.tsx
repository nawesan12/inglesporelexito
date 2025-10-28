"use client";

import { useCallback, useMemo, useState, FormEvent } from "react";
import {
  CRMContact,
  CRMDeal,
  CRMInteraction,
  CRMOverview,
  CRMTask,
  CONTACT_STATUS_OPTIONS,
  DEAL_STAGE_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "@/lib/crm-service";

interface CRMClientProps {
  initialData: CRMOverview;
}

type ViewMode = "pipeline" | "contacts" | "tasks" | "interactions";

const PIPELINE_STAGES: Array<CRMDeal["stage"]> = [
  "QUALIFICATION",
  "NEEDS_ANALYSIS",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export function CRMClient({ initialData }: CRMClientProps) {
  const [contacts, setContacts] = useState<CRMContact[]>(initialData.contacts);
  const [deals, setDeals] = useState<CRMDeal[]>(initialData.deals);
  const [tasks, setTasks] = useState<CRMTask[]>(initialData.tasks);
  const [interactions, setInteractions] = useState<CRMInteraction[]>(
    initialData.interactions
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<ViewMode>("pipeline");

  const summary = useMemo(() => {
    const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const openDeals = deals.filter(
      (deal) => deal.stage !== "WON" && deal.stage !== "LOST"
    );
    const activeContacts = contacts.filter((contact) => contact.status === "ACTIVE");
    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      if (task.status === "COMPLETED") return false;
      return new Date(task.dueDate).getTime() < Date.now();
    });
    const recentInteractions = interactions.filter((interaction) => {
      const occurredAt = new Date(interaction.occurredAt);
      if (Number.isNaN(occurredAt.getTime())) return false;
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
      return occurredAt.getTime() >= cutoff;
    });

    return {
      totalPipelineValue,
      openDeals: openDeals.length,
      activeContacts: activeContacts.length,
      overdueTasks: overdueTasks.length,
      recentInteractions: recentInteractions.length,
    };
  }, [contacts, deals, tasks, interactions]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const endpoint = form.get("endpoint");
    const method = (form.get("method") as string | null) ?? "POST";

    if (typeof endpoint !== "string") {
      setFeedback({ type: "error", message: "No se pudo identificar la acción" });
      setIsSubmitting(false);
      return;
    }

    const payload = Object.fromEntries(
      Array.from(form.entries()).filter(([key]) => !["endpoint", "method"].includes(key))
    );

    // Clean up empty strings so that the API can handle optional values gracefully
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] === "string" && payload[key] === "") {
        payload[key] = undefined;
      }
    });

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo completar la acción");
      }

      if ("contact" in data) {
        setContacts((prev) => {
          const otherContacts = prev.filter((contact) => contact.id !== data.contact.id);
          return [data.contact, ...otherContacts];
        });
      }

      if ("deal" in data) {
        setDeals((prev) => {
          const otherDeals = prev.filter((deal) => deal.id !== data.deal.id);
          return [data.deal, ...otherDeals];
        });
      }

      if ("task" in data) {
        setTasks((prev) => {
          const otherTasks = prev.filter((task) => task.id !== data.task.id);
          return [data.task, ...otherTasks];
        });
      }

      if ("interaction" in data) {
        setInteractions((prev) => {
          const otherInteractions = prev.filter(
            (interaction) => interaction.id !== data.interaction.id
          );
          return [data.interaction, ...otherInteractions];
        });
      }

      setFeedback({ type: "success", message: "Cambios guardados con éxito" });
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Ocurrió un problema inesperado",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleDelete = useCallback(async (endpoint: string) => {
    setFeedback(null);
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo eliminar el registro");
      }

      if (endpoint.includes("/contacts/")) {
        const id = endpoint.split("/contacts/")[1];
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
        setDeals((prev) => prev.filter((deal) => deal.contactId !== id));
        setTasks((prev) => prev.filter((task) => task.contactId !== id));
      }

      if (endpoint.includes("/deals/")) {
        const id = endpoint.split("/deals/")[1];
        setDeals((prev) => prev.filter((deal) => deal.id !== id));
        setTasks((prev) => prev.filter((task) => task.dealId !== id));
      }

      if (endpoint.includes("/tasks/")) {
        const id = endpoint.split("/tasks/")[1];
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }

      if (endpoint.includes("/interactions/")) {
        const id = endpoint.split("/interactions/")[1];
        setInteractions((prev) =>
          prev.filter((interaction) => interaction.id !== id)
        );
      }

      setFeedback({ type: "success", message: "Registro eliminado" });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "No se pudo eliminar el registro",
      });
    }
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel CRM</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Centralizá tus contactos, oportunidades y tareas de seguimiento en un mismo
            lugar. Todo lo que necesitás para acompañar a tus estudiantes potenciales.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <MetricCard label="Valor del pipeline" value={`$${summary.totalPipelineValue.toLocaleString("es-AR")}`} />
          <MetricCard label="Deals abiertos" value={summary.openDeals.toString()} />
          <MetricCard label="Contactos activos" value={summary.activeContacts.toString()} />
          <MetricCard label="Tareas vencidas" value={summary.overdueTasks.toString()} highlight={summary.overdueTasks > 0} />
          <MetricCard label="Interacciones 14 días" value={summary.recentInteractions.toString()} />
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <nav className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 text-sm font-medium text-gray-500">
            {[
              { id: "pipeline" as ViewMode, label: "Pipeline" },
              { id: "contacts" as ViewMode, label: "Contactos" },
              { id: "tasks" as ViewMode, label: "Tareas" },
              { id: "interactions" as ViewMode, label: "Interacciones" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex-1 rounded-md px-4 py-2 transition ${
                  view === item.id
                    ? "bg-gray-900 text-white shadow"
                    : "hover:bg-gray-100"
                }`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {feedback ? (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          {view === "pipeline" && <PipelineView deals={deals} onDelete={handleDelete} />}
          {view === "contacts" && <ContactsView contacts={contacts} onDelete={handleDelete} />}
          {view === "tasks" && <TasksView tasks={tasks} onDelete={handleDelete} />}
          {view === "interactions" && (
            <InteractionsView interactions={interactions} onDelete={handleDelete} />
          )}
        </div>

        <aside className="space-y-6">
          <ActionCard title="Nuevo contacto" description="Registra un nuevo lead o estudiante en tu base." onSubmit={handleSubmit} isSubmitting={isSubmitting}>
            <input type="hidden" name="endpoint" value="/api/crm/contacts" />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Nombre" name="firstName" required />
              <TextField label="Apellido" name="lastName" required />
            </div>
            <TextField label="Email" name="email" type="email" required />
            <TextField label="Teléfono" name="phone" />
            <TextField label="Cargo / Rol" name="position" />
            <TextField label="Empresa" name="companyName" placeholder="Nombre de la empresa" />
            <TextField label="Industria" name="companyIndustry" />
            <TextField label="Sitio web" name="companyWebsite" type="url" placeholder="https://" />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField label="Estado" name="status" options={CONTACT_STATUS_OPTIONS} />
              <TextField label="Fuente" name="source" placeholder="Instagram, Referido, etc." />
            </div>
            <TextAreaField label="Notas" name="notes" rows={3} />
          </ActionCard>

          <ActionCard title="Nueva oportunidad" description="Crea un seguimiento dentro del pipeline de ventas." onSubmit={handleSubmit} isSubmitting={isSubmitting}>
            <input type="hidden" name="endpoint" value="/api/crm/deals" />
            <div className="grid gap-3">
              <TextField label="Título" name="title" required />
              <SelectField
                label="Contacto"
                name="contactId"
                required
                options={contacts.map((contact) => ({
                  label: `${contact.firstName} ${contact.lastName}`,
                  value: contact.id,
                }))}
              />
              <SelectField label="Etapa" name="stage" options={DEAL_STAGE_OPTIONS} />
              <TextField label="Valor estimado" name="value" type="number" min="0" step="1000" />
              <TextField label="Probabilidad (%)" name="probability" type="number" min="0" max="100" />
              <TextField label="Cierre esperado" name="expectedClose" type="date" />
              <TextAreaField label="Notas" name="notes" rows={3} />
            </div>
          </ActionCard>

          <ActionCard title="Nueva tarea" description="Asigná recordatorios para que ningún seguimiento quede pendiente." onSubmit={handleSubmit} isSubmitting={isSubmitting}>
            <input type="hidden" name="endpoint" value="/api/crm/tasks" />
            <div className="grid gap-3">
              <TextField label="Título" name="title" required />
              <TextAreaField label="Descripción" name="description" rows={3} />
              <TextField label="Vencimiento" name="dueDate" type="date" />
              <SelectField label="Estado" name="status" options={TASK_STATUS_OPTIONS} />
              <SelectField label="Prioridad" name="priority" options={TASK_PRIORITY_OPTIONS} />
              <SelectField
                label="Contacto"
                name="contactId"
                options={contacts.map((contact) => ({
                  label: `${contact.firstName} ${contact.lastName}`,
                  value: contact.id,
                }))}
              />
              <SelectField
                label="Oportunidad"
                name="dealId"
                options={deals.map((deal) => ({
                  label: deal.title,
                  value: deal.id,
                }))}
              />
            </div>
          </ActionCard>

          <ActionCard
            title="Nueva interacción"
            description="Registrá los últimos contactos con estudiantes o empresas."
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          >
            <input type="hidden" name="endpoint" value="/api/crm/interactions" />
            <div className="grid gap-3">
              <TextField label="Canal" name="channel" placeholder="Email, Llamada, WhatsApp..." required />
              <TextAreaField label="Resumen" name="summary" rows={3} required />
              <TextField label="Fecha y hora" name="occurredAt" type="datetime-local" />
              <SelectField
                label="Contacto"
                name="contactId"
                options={contacts.map((contact) => ({
                  label: `${contact.firstName} ${contact.lastName}`,
                  value: contact.id,
                }))}
              />
              <SelectField
                label="Oportunidad"
                name="dealId"
                options={deals.map((deal) => ({
                  label: deal.title,
                  value: deal.id,
                }))}
              />
            </div>
          </ActionCard>
        </aside>
      </div>
    </section>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function MetricCard({ label, value, highlight = false }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 text-center shadow-sm ${
        highlight ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

function ActionCard({ title, description, children, onSubmit, isSubmitting }: ActionCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        {children}
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function TextField({ label, name, ...props }: TextFieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <input
        {...props}
        name={name}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
      />
    </label>
  );
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

function TextAreaField({ label, name, ...props }: TextAreaFieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <textarea
        {...props}
        name={name}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: Array<string | { label: string; value: string }>;
  required?: boolean;
}

function SelectField({ label, name, options, required = false }: SelectFieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <select
        name={name}
        required={required}
        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
        defaultValue=""
      >
        <option value="" disabled>
          Seleccionar
        </option>
        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {translateLabel(option)}
              </option>
            );
          }

          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

interface PipelineViewProps {
  deals: CRMDeal[];
  onDelete: (endpoint: string) => Promise<void> | void;
}

function PipelineView({ deals, onDelete }: PipelineViewProps) {
  const groupedDeals = useMemo(() => {
    return PIPELINE_STAGES.map((stage) => ({
      stage,
      deals: deals.filter((deal) => deal.stage === stage),
    }));
  }, [deals]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {groupedDeals.map(({ stage, deals: dealsInStage }) => (
        <div key={stage} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">{translateLabel(stage)}</h2>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {dealsInStage.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {dealsInStage.length === 0 ? (
              <p className="text-xs text-gray-400">Todavía no hay oportunidades en esta etapa.</p>
            ) : (
              dealsInStage.map((deal) => (
                <article key={deal.id} className="rounded-lg border border-gray-100 p-3 text-sm shadow-sm">
                  <header className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{deal.title}</p>
                      <p className="text-xs text-gray-500">
                        {deal.contact.firstName} {deal.contact.lastName}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(`/api/crm/deals/${deal.id}`)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </header>
                  <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <div>
                      <dt className="font-medium text-gray-500">Valor</dt>
                      <dd>${deal.value.toLocaleString("es-AR")}</dd>
                    </div>
                    {deal.probability ? (
                      <div>
                        <dt className="font-medium text-gray-500">Prob.</dt>
                        <dd>{deal.probability}%</dd>
                      </div>
                    ) : null}
                    {deal.expectedClose ? (
                      <div>
                        <dt className="font-medium text-gray-500">Cierre</dt>
                        <dd>{new Date(deal.expectedClose).toLocaleDateString("es-AR")}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {deal.notes ? (
                    <p className="mt-2 text-xs text-gray-500">{deal.notes}</p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ContactsViewProps {
  contacts: CRMContact[];
  onDelete: (endpoint: string) => Promise<void> | void;
}

function ContactsView({ contacts, onDelete }: ContactsViewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                Aún no cargaste contactos.
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{contact.phone ?? "Sin teléfono"}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {contact.company?.name ?? "Independiente"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {translateLabel(contact.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(`/api/crm/contacts/${contact.id}`)}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                    type="button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface TasksViewProps {
  tasks: CRMTask[];
  onDelete: (endpoint: string) => Promise<void> | void;
}

function TasksView({ tasks, onDelete }: TasksViewProps) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Sin tareas pendientes. ¡Buen trabajo!
        </div>
      ) : (
        tasks.map((task) => (
          <article key={task.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
                {task.description ? (
                  <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                ) : null}
              </div>
              <button
                onClick={() => onDelete(`/api/crm/tasks/${task.id}`)}
                className="text-xs font-medium text-red-500 hover:text-red-600"
                type="button"
              >
                Completar
              </button>
            </header>
            <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
              <div>
                <dt className="font-medium text-gray-500">Estado</dt>
                <dd>{translateLabel(task.status)}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Prioridad</dt>
                <dd>{translateLabel(task.priority)}</dd>
              </div>
              {task.dueDate ? (
                <div>
                  <dt className="font-medium text-gray-500">Vencimiento</dt>
                  <dd>{new Date(task.dueDate).toLocaleDateString("es-AR")}</dd>
                </div>
              ) : null}
              {task.contact ? (
                <div>
                  <dt className="font-medium text-gray-500">Contacto</dt>
                  <dd>
                    {task.contact.firstName} {task.contact.lastName}
                  </dd>
                </div>
              ) : null}
              {task.deal ? (
                <div>
                  <dt className="font-medium text-gray-500">Oportunidad</dt>
                  <dd>{task.deal.title}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))
      )}
    </div>
  );
}

interface InteractionsViewProps {
  interactions: CRMInteraction[];
  onDelete: (endpoint: string) => Promise<void> | void;
}

function InteractionsView({ interactions, onDelete }: InteractionsViewProps) {
  return (
    <div className="space-y-3">
      {interactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Todavía no registraste interacciones. Sumá la primera para hacer seguimiento.
        </div>
      ) : (
        interactions.map((interaction) => {
          const occurredAt = new Date(interaction.occurredAt);
          return (
            <article
              key={interaction.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {interaction.channel}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {Number.isNaN(occurredAt.getTime())
                      ? "Fecha no disponible"
                      : occurredAt.toLocaleString("es-AR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                  </p>
                </div>
                <button
                  onClick={() =>
                    onDelete(`/api/crm/interactions/${interaction.id}`)
                  }
                  className="text-xs font-medium text-red-500 hover:text-red-600"
                  type="button"
                >
                  Eliminar
                </button>
              </header>
              <p className="mt-3 text-sm text-gray-700">{interaction.summary}</p>
              <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
                {interaction.contact ? (
                  <div>
                    <dt className="font-medium text-gray-500">Contacto</dt>
                    <dd>
                      {interaction.contact.firstName} {interaction.contact.lastName}
                    </dd>
                  </div>
                ) : null}
                {interaction.deal ? (
                  <div>
                    <dt className="font-medium text-gray-500">Oportunidad</dt>
                    <dd>{interaction.deal.title}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          );
        })
      )}
    </div>
  );
}

function translateLabel(value: string) {
  const dictionary: Record<string, string> = {
    LEAD: "Lead",
    ACTIVE: "Activo",
    CHURNED: "Churned",
    QUALIFICATION: "Calificación",
    NEEDS_ANALYSIS: "Detección de necesidades",
    PROPOSAL: "Propuesta",
    NEGOTIATION: "Negociación",
    WON: "Ganado",
    LOST: "Perdido",
    OPEN: "Pendiente",
    IN_PROGRESS: "En proceso",
    COMPLETED: "Completada",
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  return dictionary[value] ?? value;
}
