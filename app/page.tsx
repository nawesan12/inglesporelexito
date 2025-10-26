"use client";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  CheckCircle,
  ClipboardCheck,
  Coffee,
  Instagram,
  Lightbulb,
  Linkedin,
  MessageCircle,
  MessageSquare,
  Minus,
  PlayCircle,
  Plus,
  Puzzle,
  Users,
  X,
  XCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function Page() {
  return (
    <section className="relative bg-white text-gray-900 antialiased overflow-hidden">
      {/* Decorative background blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(closest-side, #FACC15, transparent)",
          }}
          animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(closest-side, #fde68a, transparent)",
          }}
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <header className="relative border-b border-gray-200/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1 //@ts-expect-error bla
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-2xl font-bold text-gray-900"
          >
            Inglés por el Éxito
          </motion.h1>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex items-center gap-3"
          >
            <motion.a //@ts-expect-error bla
              variants={fadeUp}
              href="#precios"
              className="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Acceder <span aria-hidden>→</span>
            </motion.a>
            <motion.a //@ts-expect-error bla
              variants={fadeUp}
              href="#suscripcion"
              className="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:inline-flex"
            >
              Suscribirme
            </motion.a>
          </motion.div>
        </div>
      </header>

      <main className="isolate">
        {/* HERO */}
        <section className="relative py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 //@ts-expect-error bla
                variants={fadeUp}
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              >
                Destrabá tu inglés.{" "}
                <span className="text-accent">Hablá con confianza.</span>
              </motion.h2>
              <motion.p //@ts-expect-error bla
                variants={fadeUp}
                className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
              >
                Clases grupales de{" "}
                <span className="font-semibold">speaking</span> diseñadas para
                que por fin puedas soltarte y tener conversaciones fluidas. Sin
                miedo, sin juicios, solo práctica real.
              </motion.p>
              <motion.div //@ts-expect-error bla
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center justify-center gap-3"
              >
                <a
                  href="#precios"
                  className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-all transform hover:scale-105"
                >
                  Quiero mi lugar ahora
                </a>
                <a
                  href="#whatsapp"
                  className="rounded-md bg-gray-900 text-white px-5 py-3 text-sm font-semibold shadow-sm hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" /> Unirme al grupo de
                  WhatsApp
                </a>
              </motion.div>

              <motion.div //@ts-expect-error bla
                variants={fadeUp}
                className="mt-16 sm:mt-20"
              >
                <motion.div
                  variants={scaleIn}
                  className="w-full max-w-3xl mx-auto aspect-video bg-gray-900 rounded-2xl shadow-2xl flex items-center justify-center ring-1 ring-white/10"
                >
                  <div className="text-center text-gray-400">
                    <PlayCircle className="mx-auto" />
                    <p className="mt-2 font-semibold">
                      Video de Venta (2-4 min)
                    </p>
                    <p className="text-sm">
                      Tu video explicando el método va aquí.
                    </p>
                  </div>
                </motion.div>

                {/* Inline email subscribe CTA (Hero) */}
                <motion.form
                  id="suscripcion"
                  variants={stagger}
                  className="mt-8 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="email-hero" className="sr-only">
                    Tu email
                  </label>
                  <motion.input //@ts-expect-error bla
                    variants={fadeUp}
                    id="email-hero"
                    type="email"
                    required
                    placeholder="Tu email para reservar tu lugar"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent"
                  />
                  <motion.button //@ts-expect-error bla
                    variants={fadeUp}
                    type="submit"
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-accent-hover transition-all"
                    aria-label="Suscribirme a las clases"
                  >
                    Suscribirme
                  </motion.button>
                </motion.form>
              </motion.div>

              {/* Trust badges (no nueva info) */}
              <motion.ul
                variants={stagger}
                className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600"
              >
                <motion.li //@ts-expect-error bla
                  variants={fadeUp}
                  className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200"
                >
                  Grupos reducidos
                </motion.li>
                <motion.li //@ts-expect-error bla
                  variants={fadeUp}
                  className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200"
                >
                  Cupos limitados
                </motion.li>
                <motion.li //@ts-expect-error bla
                  variants={fadeUp}
                  className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200"
                >
                  Garantía 7 días
                </motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* ES PARA VOS / NO ES PARA VOS */}
        <section className="py-24 sm:py-32 bg-gray-50/80">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h3 //@ts-expect-error bla
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                ¿Es para vos este curso?
              </motion.h3>
              <motion.p //@ts-expect-error bla
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-4 text-lg text-gray-600"
              >
                Esto no es para todos. Diseñamos un entorno específico para un
                tipo de alumno. Sé honesto con vos mismo.
              </motion.p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
              >
                <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle /> Es para vos si...
                </h4>
                <ul className="mt-6 space-y-4 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="mt-1" />
                    <span>
                      Ya tenés un nivel B1+ y querés rodearte de gente que, como
                      vos, busca practicar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1" />
                    <span>
                      Querés mejorar tu{" "}
                      <span className="font-semibold">capacidad de hablar</span>{" "}
                      y ganar fluidez real.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1" />
                    <span>
                      Te{" "}
                      <span className="font-semibold">
                        trancás o te quedás congelado
                      </span>{" "}
                      cuando intentás hablar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1" />
                    <span>
                      Estás por{" "}
                      <span className="font-semibold">viajar pronto</span> y
                      necesitás activar el idioma ya.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-1" />
                    <span>
                      Tenés una{" "}
                      <span className="font-semibold">
                        entrevista de trabajo
                      </span>{" "}
                      en inglés y querés prepararte.
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
              >
                <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <XCircle /> NO es para vos si...
                </h4>
                <ul className="mt-6 space-y-4 text-gray-700">
                  <li className="flex items-start gap-2">
                    <X className="mt-1" />
                    <span>
                      Recién estás comenzando (nivel A1/A2) o nunca practicaste
                      inglés antes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-1" />
                    <span>
                      Estás buscando reforzar{" "}
                      <span className="font-semibold">
                        únicamente la gramática
                      </span>{" "}
                      y hacer ejercicios escritos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-1" />
                    <span>
                      No estás dispuesto a{" "}
                      <span className="font-semibold">superar tu miedo</span> y
                      participar activamente.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-1" />
                    <span>
                      Tu objetivo no es mantener conversaciones fluidas, sino
                      solo aprobar un exámen.
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* QUÉ VAS A OBTENER */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center">
              <motion.h3 //@ts-expect-error bla
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                ¿Qué vas a obtener?
              </motion.h3>
              <motion.p //@ts-expect-error bla
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-4 text-lg text-gray-600"
              >
                Todo lo que necesitás para que el{" "}
                <span className="font-semibold">speaking</span> deje de ser un
                problema.
              </motion.p>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div variants={scaleIn} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CalendarDays />
                </div>
                <h4 className="mt-6 text-xl font-semibold">
                  3 Meses de Clases
                </h4>
                <p className="mt-2 text-gray-600">
                  Clases grupales semanales (2 sesiones de 1 hora) con el
                  profesor y otros alumnos con tu mismo objetivo.
                </p>
              </motion.div>
              <motion.div variants={scaleIn} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <MessageCircle />
                </div>
                <h4 className="mt-6 text-xl font-semibold">
                  Soporte por WhatsApp
                </h4>
                <p className="mt-2 text-gray-600">
                  Acompañamiento y soporte directo del profesor para dudas
                  puntuales fuera de clase. Estamos con vos.
                </p>
              </motion.div>
              <motion.div variants={scaleIn} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Coffee />
                </div>
                <h4 className="mt-6 text-xl font-semibold">
                  Práctica Cotidiana
                </h4>
                <p className="mt-2 text-gray-600">
                  Instancias donde hablarás de diversos temas cotidianos y
                  profesionales. Práctica real para la vida real.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* METODOLOGÍA */}
        <section className="py-24 sm:py-32 bg-gray-900 text-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                  NUESTRA METODOLOGÍA
                </span>
                <motion.h3 //@ts-expect-error bla
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="text-3xl font-bold tracking-tight sm:text-4xl mt-3"
                >
                  Clases Dinámicas. Cero Aburrimiento.
                </motion.h3>
                <motion.p //@ts-expect-error bla
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="mt-6 text-lg text-gray-300"
                >
                  Olvidate de la clase tradicional. Aquí, el 90% del tiempo
                  estás hablando. Cada sesión está diseñada para maximizar tu
                  participación.
                </motion.p>
                <motion.p //@ts-expect-error bla
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="mt-4 text-lg text-gray-300"
                >
                  Son{" "}
                  <span className="font-semibold text-white">
                    2 sesiones por semana de 1 hora
                  </span>
                  , enfocadas 100% en la interacción.
                </motion.p>
              </div>
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-gray-800 p-8 rounded-2xl"
              >
                <h4 className="text-xl font-semibold mb-5">
                  Algunas de nuestras actividades:
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Users />
                    <span>
                      Roleplays de situaciones reales (viajes, trabajo).
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Puzzle />
                    <span>Juegos interactivos y adivinanzas.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb />
                    <span>Creación de historias en grupo.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageSquare />
                    <span>Preguntas, respuestas y debates dinámicos.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ClipboardCheck />
                    <span>Y mucho más...</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROFESOR */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto">
              <motion.img
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="w-32 h-32 rounded-full mx-auto shadow-lg"
                src="https://placehold.co/200x200/FACC15/333?text=MI"
                alt="Foto de Martín Ibarra"
              />
              <motion.h3 //@ts-expect-error bla
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-8"
              >
                Conocé a tu profesor
              </motion.h3>
              <motion.p //@ts-expect-error bla
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mt-6 text-xl leading-8 text-gray-700"
              >
                {`"`}Hola, soy{" "}
                <span className="font-semibold">Martín Ibarra</span>. Mi misión
                es que pierdas el miedo y ganes la fluidez que siempre quisiste.
                Pasé por lo mismo que vos: entendía todo, pero me costaba
                hablar. Creé este método para que puedas por fin soltarte en un
                ambiente seguro y de apoyo. No te voy a juzgar, te voy a guiar.{" "}
                {`"`}
              </motion.p>
            </div>
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <motion.h3 //@ts-expect-error bla
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Empezá a hablar sin miedo hoy mismo.
            </motion.h3>
            <motion.p //@ts-expect-error bla
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-4 text-lg text-gray-600"
            >
              Elegí el plan que mejor se adapte a vos y reservá tu lugar.{" "}
              <span className="font-semibold text-accent">
                ¡Los cupos son limitados!
              </span>
            </motion.p>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-12 bg-white p-10 rounded-2xl shadow-2xl border border-accent max-w-lg mx-auto"
            >
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm font-medium text-gray-900">
                Programa Completo
              </span>
              <h4 className="text-4xl font-bold text-gray-900 mt-6">
                $XXX.XXX ARS
              </h4>
              <p className="text-gray-500">Pago único por 3 meses</p>

              <ul className="mt-8 space-y-3 text-left text-gray-700">
                <li className="flex items-center gap-2">
                  <Check />
                  Acceso por 3 meses a clases grupales.
                </li>
                <li className="flex items-center gap-2">
                  <Check />2 sesiones semanales de 1 hora.
                </li>
                <li className="flex items-center gap-2">
                  <Check />
                  Soporte prioritario por WhatsApp.
                </li>
                <li className="flex items-center gap-2">
                  <Check />
                  Grupos reducidos (máx. 6 personas).
                </li>
              </ul>

              <a
                href="#"
                className="mt-10 block w-full rounded-md bg-accent px-5 py-4 text-lg font-semibold text-gray-900 shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-all transform hover:scale-105"
              >
                ¡QUIERO MI LUGAR!
              </a>
              <p className="mt-4 text-xs text-gray-500">
                Garantía de satisfacción de 7 días.
              </p>

              {/* Secondary CTA inside pricing card */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="#whatsapp"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  <MessageCircle className="h-4 w-4" /> Unirme al grupo de
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Reassurance row */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600"
            >
              <motion.li //@ts-expect-error bla
                variants={fadeUp}
                className="px-3 py-1 rounded-full bg-white border"
              >
                Pago único
              </motion.li>
              <motion.li //@ts-expect-error bla
                variants={fadeUp}
                className="px-3 py-1 rounded-full bg-white border"
              >
                3 meses
              </motion.li>
              <motion.li //@ts-expect-error bla
                variants={fadeUp}
                className="px-3 py-1 rounded-full bg-white border"
              >
                Soporte WhatsApp
              </motion.li>
            </motion.ul>

            {/* Email subscribe CTA (section) */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-12"
              id="suscripcion-section"
            >
              <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h5 className="text-lg font-semibold">
                  Reservá prioridad con tu email
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Te avisamos apenas se libera un cupo o abre nueva cohorte.
                </p>
                <form
                  className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="email-pricing" className="sr-only">
                    Tu email
                  </label>
                  <input
                    id="email-pricing"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-accent-hover transition-all"
                  >
                    Quiero prioridad
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.h2
              //@ts-expect-error bla
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-3xl font-bold text-center text-gray-900"
            >
              Preguntas Frecuentes
            </motion.h2>
            <div className="mt-12 space-y-6 divide-y divide-gray-200">
              {[
                {
                  q: "¿Qué nivel de inglés necesito tener?",
                  a: "Recomendamos tener al menos un nivel B1 (intermedio bajo). Debés ser capaz de entender ideas principales y formar oraciones, aunque cometas errores. Este curso no es para principiantes absolutos (A1/A2).",
                },
                {
                  q: "¿Qué pasa si falto a una clase?",
                  a: "¡No hay problema! Todas las clases se graban y tendrás acceso a la grabación durante la duración del curso para que puedas repasarla o verla si no pudiste conectarte en vivo.",
                },
                {
                  q: "¿Cuántos alumnos hay por grupo?",
                  a: "Mantenemos los grupos reducidos (máximo 6 alumnos) para garantizar que todos tengan múltiples oportunidades de hablar y participar en cada sesión.",
                },
                {
                  q: "¿Vamos a ver gramática?",
                  a: "El foco principal es el speaking. Sin embargo, la gramática se corrige de forma contextual. Si cometés un error recurrente, el profesor lo corregirá en el momento o dará una breve explicación para que el error no se fosilice, pero no haremos ejercicios de gramática escritos.",
                },
              ].map((item, idx) => (
                <motion.details
                  key={idx}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="pt-6 group"
                >
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-lg font-medium text-gray-900">
                      {item.q}
                    </span>
                    <span className="text-gray-500 group-open:hidden">
                      <Plus />
                    </span>
                    <span className="text-gray-500 hidden group-open:block">
                      <Minus />
                    </span>
                  </summary>
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.35 }}
                    className="mt-3 text-gray-600"
                  >
                    {item.a}
                  </motion.p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* WHATSAPP ANCHOR */}
        <div id="whatsapp" className="sr-only">
          Grupo de WhatsApp
        </div>
      </main>

      {/* Sticky bottom CTA bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-auto">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-xl px-4 py-3 sm:flex sm:items-center sm:gap-4">
          <p className="text-sm text-gray-800 font-medium hidden sm:block">
            ¿Listo para practicar? Reservá tu lugar o unite al grupo.
          </p>
          <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
            <a
              href="#precios"
              className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-accent-hover transition"
            >
              Reservar lugar
            </a>
            <a
              href="#whatsapp"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button (mobile friendly) */}
      <a
        href="#whatsapp"
        aria-label="Unirme al grupo de WhatsApp"
        className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:scale-105 transition sm:hidden"
      >
        <MessageCircle />
      </a>

      <footer className="bg-gray-900 text-gray-400 relative z-10 mt-24">
        <div className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 items-center">
          {/* Footer subscribe */}
          <div>
            <h4 className="text-white text-lg font-semibold">
              Suscribite para enterarte de nuevos cupos
            </h4>
            <p className="text-sm text-gray-400 mt-1">
              Te avisamos por email cuando abre la próxima cohorte.
            </p>
            <form
              className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="email-footer" className="sr-only">
                Tu email
              </label>
              <input
                id="email-footer"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-transparent bg-gray-800 px-4 py-3 text-base text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-accent/60"
              />
              <button
                type="submit"
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-accent-hover transition-all"
              >
                Quiero enterarme
              </button>
            </form>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-sm">
              © 2025 Inglés por el Éxito. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="#whatsapp"
                className="hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
