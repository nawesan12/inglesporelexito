"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import type {
  CRMContact,
  CRMDeal,
  CRMInteraction,
  CRMOverview,
  CRMTask,
} from "@/lib/crm-service";
import {
  CONTACT_STATUS_OPTIONS,
  DEAL_STAGE_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "@/lib/crm-options";
import {
  Briefcase,
  ClipboardList,
  MessageCircle,
  MessageSquare,
  Target,
  Timer,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CRMClientProps {
  initialData: CRMOverview;
}

type ViewMode = "pipeline" | "contacts" | "tasks" | "interactions";

type ResourceType = "contacts" | "deals" | "tasks" | "interactions";

type DeleteHandler = (
  resource: ResourceType,
  id: string
) => Promise<void> | void;

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

type ActionType = "contact" | "deal" | "task" | "interaction";

export function CRMClient({ initialData }: CRMClientProps) {
  const [contacts, setContacts] = useState<CRMContact[]>(initialData.contacts);
  const [deals, setDeals] = useState<CRMDeal[]>(initialData.deals);
  const [tasks, setTasks] = useState<CRMTask[]>(initialData.tasks);
  const [interactions, setInteractions] = useState<CRMInteraction[]>(
    initialData.interactions
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
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

  const createSubmitHandler = useCallback(
    (onSuccess?: () => void) =>
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback(null);
        setIsSubmitting(true);

        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const endpoint = form.get("endpoint");
        const method = (form.get("method") as string | null) ?? "POST";

        if (typeof endpoint !== "string") {
          setFeedback({ type: "error", message: "No se pudo identificar la acción" });
          setIsSubmitting(false);
          return;
        }

        const payload = Object.fromEntries(
          Array.from(form.entries()).filter(([key]) => !["endpoint", "method"].includes(key))
        ) as Record<string, FormDataEntryValue | undefined>;

        // Clean up empty strings so that the API can handle optional values gracefully
        Object.keys(payload).forEach((key) => {
          if (typeof payload[key] === "string" && payload[key] === "") {
            delete payload[key];
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
          formElement.reset();
          onSuccess?.();
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
      },
    []
  );

  const handleDelete = useCallback(async (resource: ResourceType, id: string) => {
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/${resource}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo eliminar el registro");
      }

      if (resource === "contacts") {
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
        setDeals((prev) => prev.filter((deal) => deal.contactId !== id));
        setTasks((prev) => prev.filter((task) => task.contactId !== id));
      }

      if (resource === "deals") {
        setDeals((prev) => prev.filter((deal) => deal.id !== id));
        setTasks((prev) => prev.filter((task) => task.dealId !== id));
      }

      if (resource === "tasks") {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }

      if (resource === "interactions") {
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
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-12 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
      </div>
      <header className="relative mb-12 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white/95 via-white/80 to-slate-50 p-10 shadow-2xl backdrop-blur">
        <div aria-hidden className="absolute -right-28 -top-32 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div aria-hidden className="absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Panel CRM oficial
            </span>
            <h1 className="mt-4 text-4xl font-black text-slate-900">
              Gestión comercial elegante y enfocada en resultados
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Centralizá contactos, oportunidades y tareas en un espacio diseñado para equipos modernos.
              Visualizá el avance de cada relación en tiempo real y asegurá un seguimiento impecable.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <MetricCard
              Icon={TrendingUp}
              label="Valor del pipeline"
              note="Proyección total"
              value={`$${summary.totalPipelineValue.toLocaleString("es-AR")}`}
            />
            <MetricCard
              Icon={Target}
              label="Deals abiertos"
              note="Seguimiento activo"
              value={summary.openDeals.toString()}
            />
            <MetricCard
              Icon={Users}
              label="Contactos activos"
              note="Relaciones en curso"
              value={summary.activeContacts.toString()}
            />
            <MetricCard
              Icon={Timer}
              highlight={summary.overdueTasks > 0}
              label="Tareas vencidas"
              note={summary.overdueTasks > 0 ? "Prioridad inmediata" : "Todo al día"}
              value={summary.overdueTasks.toString()}
            />
            <MetricCard
              Icon={MessageCircle}
              label="Interacciones 14 días"
              note="Conversaciones recientes"
              value={summary.recentInteractions.toString()}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <nav className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur">
            {[
              { id: "pipeline" as ViewMode, label: "Pipeline" },
              { id: "contacts" as ViewMode, label: "Contactos" },
              { id: "tasks" as ViewMode, label: "Tareas" },
              { id: "interactions" as ViewMode, label: "Interacciones" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                aria-pressed={view === item.id}
                className={`flex-1 rounded-xl px-4 py-2 transition ${
                  view === item.id
                    ? "bg-slate-900 text-white shadow"
                    : "hover:bg-slate-100"
                }`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {feedback ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
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

        <aside className="space-y-5">
          <ActionLauncher
            Icon={UserPlus}
            title="Nuevo contacto"
            description="Registrá leads o estudiantes y mantené la base organizada."
            onClick={() => setActiveAction("contact")}
          />
          <ActionLauncher
            Icon={Briefcase}
            title="Nueva oportunidad"
            description="Crea seguimientos claros para impulsar el pipeline."
            onClick={() => setActiveAction("deal")}
          />
          <ActionLauncher
            Icon={ClipboardList}
            title="Nueva tarea"
            description="Asigná recordatorios claves y asegurá el seguimiento."
            onClick={() => setActiveAction("task")}
          />
          <ActionLauncher
            Icon={MessageSquare}
            title="Nueva interacción"
            description="Dejá registro de cada contacto y próxima acción."
            onClick={() => setActiveAction("interaction")}
          />
        </aside>
      </div>

      <ActionModal
        isOpen={activeAction === "contact"}
        onClose={() => setActiveAction(null)}
        title="Nuevo contacto"
        description="Completá la información del lead para iniciar el relacionamiento."
        onSubmit={createSubmitHandler(() => setActiveAction(null))}
        isSubmitting={isSubmitting}
      >
        <input type="hidden" name="endpoint" value="/api/crm/contacts" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nombre" name="firstName" required />
          <TextField label="Apellido" name="lastName" required />
        </div>
        <TextField label="Email" name="email" type="email" required />
        <TextField label="Teléfono" name="phone" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Cargo / Rol" name="position" />
          <TextField label="Empresa" name="companyName" placeholder="Nombre de la empresa" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Industria" name="companyIndustry" />
          <TextField label="Sitio web" name="companyWebsite" type="url" placeholder="https://" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Estado" name="status" options={CONTACT_STATUS_OPTIONS} />
          <TextField label="Fuente" name="source" placeholder="Instagram, Referido, etc." />
        </div>
        <TextAreaField label="Notas" name="notes" rows={3} />
      </ActionModal>

      <ActionModal
        isOpen={activeAction === "deal"}
        onClose={() => setActiveAction(null)}
        title="Nueva oportunidad"
        description="Definí los datos clave de la oportunidad y sumala al pipeline."
        onSubmit={createSubmitHandler(() => setActiveAction(null))}
        isSubmitting={isSubmitting}
      >
        <input type="hidden" name="endpoint" value="/api/crm/deals" />
        <div className="grid gap-4">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Valor estimado" name="value" type="number" min="0" step="1000" />
            <TextField label="Probabilidad (%)" name="probability" type="number" min="0" max="100" />
          </div>
          <TextField label="Cierre esperado" name="expectedClose" type="date" />
          <TextAreaField label="Notas" name="notes" rows={3} />
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeAction === "task"}
        onClose={() => setActiveAction(null)}
        title="Nueva tarea"
        description="Asigná un recordatorio para que el seguimiento nunca se frene."
        onSubmit={createSubmitHandler(() => setActiveAction(null))}
        isSubmitting={isSubmitting}
      >
        <input type="hidden" name="endpoint" value="/api/crm/tasks" />
        <div className="grid gap-4">
          <TextField label="Título" name="title" required />
          <TextAreaField label="Descripción" name="description" rows={3} />
          <TextField label="Vencimiento" name="dueDate" type="date" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Estado" name="status" options={TASK_STATUS_OPTIONS} />
            <SelectField label="Prioridad" name="priority" options={TASK_PRIORITY_OPTIONS} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </ActionModal>

      <ActionModal
        isOpen={activeAction === "interaction"}
        onClose={() => setActiveAction(null)}
        title="Nueva interacción"
        description="Dejá constancia de la conversación y planificá próximos pasos."
        onSubmit={createSubmitHandler(() => setActiveAction(null))}
        isSubmitting={isSubmitting}
      >
        <input type="hidden" name="endpoint" value="/api/crm/interactions" />
        <div className="grid gap-4">
          <TextField
            label="Canal"
            name="channel"
            placeholder="Email, Llamada, WhatsApp..."
            required
          />
          <TextAreaField label="Resumen" name="summary" rows={3} required />
          <TextField label="Fecha y hora" name="occurredAt" type="datetime-local" />
          <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </ActionModal>
    </section>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  highlight?: boolean;
  note?: string;
  Icon: LucideIcon;
}

function MetricCard({ label, value, highlight = false, note, Icon }: MetricCardProps) {
  const accentLine = highlight
    ? "from-rose-500 via-rose-400 to-orange-300"
    : "from-indigo-500 via-sky-500 to-emerald-400";
  const iconStyles = highlight
    ? "bg-rose-100 text-rose-600"
    : "bg-slate-100 text-indigo-600";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/85 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              highlight ? "text-rose-600" : "text-slate-600"
            }`}
          >
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${iconStyles}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {note ? (
        <p className={`mt-3 text-xs ${highlight ? "text-rose-600" : "text-slate-500"}`}>{note}</p>
      ) : null}
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${accentLine}`} aria-hidden />
    </div>
  );
}

interface ActionLauncherProps {
  title: string;
  description: string;
  onClick: () => void;
  Icon: LucideIcon;
  ctaLabel?: string;
}

function ActionLauncher({ title, description, onClick, Icon, ctaLabel = "Crear registro" }: ActionLauncherProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-200/40 blur-2xl" aria-hidden />
      <div className="relative space-y-4">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

interface ActionModalProps {
  title: string;
  description: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

function ActionModal({
  title,
  description,
  children,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ActionModalProps) {
  const titleId = useId();
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="pr-10">
          <h2 id={titleId} className="text-2xl font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {children}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
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
        className="mt-1 w-full rounded-xl border border-amber-100 bg-white/90 px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      />
    </label>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
        className="mt-1 w-full rounded-xl border border-amber-100 bg-white/90 px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: ReadonlyArray<string | { label: string; value: string }>;
  required?: boolean;
}

function SelectField({ label, name, options, required = false }: SelectFieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <select
        name={name}
        required={required}
        className="mt-1 w-full rounded-xl border border-amber-100 bg-white/90 px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
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
  onDelete: DeleteHandler;
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
        <div
          key={stage}
          className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">{translateLabel(stage)}</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {dealsInStage.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {dealsInStage.length === 0 ? (
              <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-5 text-center text-xs text-amber-700">
                Todavía no hay oportunidades en esta etapa. ¡Momento ideal para prospectar!
              </div>
            ) : (
              dealsInStage.map((deal) => (
                <article
                  key={deal.id}
                  className="rounded-xl border border-amber-50/70 bg-gradient-to-br from-white via-amber-50/50 to-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <header className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{deal.title}</p>
                      <p className="text-xs text-gray-500">
                        {deal.contact.firstName} {deal.contact.lastName}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete("deals", deal.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </header>
                  <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
                    {typeof deal.value === "number" ? (
                      <div>
                        <dt className="font-medium text-gray-500">Valor</dt>
                        <dd>${deal.value.toLocaleString("es-AR")}</dd>
                      </div>
                    ) : null}
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
                    <p className="mt-2 text-xs text-gray-600">{deal.notes}</p>
                  ) : null}
                  <DealProgress stage={deal.stage} />
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
  onDelete: DeleteHandler;
}

function ContactsView({ contacts, onDelete }: ContactsViewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white/80 shadow-sm backdrop-blur">
      <table className="min-w-full divide-y divide-amber-100 text-left text-sm text-gray-700">
        <thead className="bg-amber-50/80 text-xs font-semibold uppercase tracking-wide text-amber-800">
          <tr>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-50/80">
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-600">
                Aún no cargaste contactos.
              </td>
            </tr>
          ) : (
            contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-amber-50/70">
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
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getContactStatusBadgeClasses(
                      contact.status
                    )}`}
                  >
                    {translateLabel(contact.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete("contacts", contact.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
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
  onDelete: DeleteHandler;
}

function TasksView({ tasks, onDelete }: TasksViewProps) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <EmptyState
          description="Sin tareas pendientes. ¡Buen trabajo!"
          icon={Timer}
          title="Todo en orden"
        />
      ) : (
        tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
                {task.description ? (
                  <p className="mt-1 text-xs text-gray-600">{task.description}</p>
                ) : null}
              </div>
              <button
                onClick={() => onDelete("tasks", task.id)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900"
                type="button"
              >
                Completar
              </button>
            </header>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getTaskStatusBadgeClasses(task.status)}`}>
                {translateLabel(task.status)}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${getPriorityBadgeClasses(task.priority)}`}>
                {translateLabel(task.priority)}
              </span>
              {isTaskOverdue(task) ? (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                  Vencida
                </span>
              ) : null}
            </div>
            <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
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
  onDelete: DeleteHandler;
}

function InteractionsView({ interactions, onDelete }: InteractionsViewProps) {
  return (
    <div className="space-y-3">
      {interactions.length === 0 ? (
        <EmptyState
          description="Todavía no registraste interacciones. Sumá la primera para hacer seguimiento."
          icon={MessageCircle}
          title="Comenzá la conversación"
        />
      ) : (
        interactions.map((interaction) => {
          const occurredAt = new Date(interaction.occurredAt);
          return (
            <article
              key={interaction.id}
              className="rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                    {interaction.channel}
                  </span>
                  <p className="mt-2 text-xs text-gray-500">
                    {Number.isNaN(occurredAt.getTime())
                      ? "Fecha no disponible"
                      : occurredAt.toLocaleString("es-AR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                  </p>
                </div>
                <button
                  onClick={() => onDelete("interactions", interaction.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-600"
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

interface DealProgressProps {
  stage: CRMDeal["stage"];
}

function DealProgress({ stage }: DealProgressProps) {
  const currentIndex = PIPELINE_STAGES.indexOf(stage);
  const totalStages = PIPELINE_STAGES.length - 1;
  const progress = totalStages <= 0 || currentIndex < 0 ? 0 : Math.round((currentIndex / totalStages) * 100);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-amber-700/80">
        <span>Progreso</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-amber-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-gray-500">
        En etapa <span className="font-semibold text-gray-700">{translateLabel(stage)}</span>
      </p>
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-white/70 px-6 py-8 text-center shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function getContactStatusBadgeClasses(status: CRMContact["status"]) {
  const dictionary: Partial<Record<CRMContact["status"], string>> = {
    LEAD: "bg-amber-100 text-amber-700",
    ACTIVE: "bg-emerald-100 text-emerald-700",
    CHURNED: "bg-rose-100 text-rose-600",
  };

  return dictionary[status] ?? "bg-amber-100 text-amber-700";
}

function getTaskStatusBadgeClasses(status: CRMTask["status"]) {
  const dictionary: Partial<Record<CRMTask["status"], string>> = {
    OPEN: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-emerald-100 text-emerald-700",
  };

  return dictionary[status] ?? "bg-amber-100 text-amber-700";
}

function getPriorityBadgeClasses(priority: CRMTask["priority"]) {
  const dictionary: Partial<Record<CRMTask["priority"], string>> = {
    LOW: "bg-emerald-100 text-emerald-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH: "bg-rose-100 text-rose-600",
  };

  return dictionary[priority] ?? "bg-amber-100 text-amber-700";
}

function isTaskOverdue(task: CRMTask) {
  if (!task.dueDate) return false;
  if (task.status === "COMPLETED") return false;
  return new Date(task.dueDate).getTime() < Date.now();
}
