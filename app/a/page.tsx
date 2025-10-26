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

export default function Page() {
  return (
    <section className="bg-white text-gray-900 antialiased">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Inglés por el Éxito
          </h1>
          <a
            href="#precios"
            className="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Acceder <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </header>

      <main className="isolate">
        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Destrabá tu inglés.
              <span className="text-accent">Hablá con confianza.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Clases grupales de <span className="font-semibold">speaking</span>{" "}
              diseñadas para que por fin puedas soltarte y tener conversaciones
              fluidas. Sin miedo, sin juicios, solo práctica real.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#precios"
                className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 transition-all transform hover:scale-105"
              >
                Quiero mi lugar ahora
              </a>
            </div>

            <div className="mt-16 sm:mt-20">
              <div className="w-full max-w-3xl mx-auto aspect-video bg-gray-900 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <PlayCircle />
                  <p className="mt-2 font-semibold">Video de Venta (2-4 min)</p>
                  <p className="text-sm">
                    Tu video explicando el método va aquí.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                ¿Es para vos este curso?
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                Esto no es para todos. Diseñamos un entorno específico para un
                tipo de alumno. Sé honesto con vos mismo.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <h4 className="text-2xl font-bold text-gray-900 flex items-center">
                  <CheckCircle />
                  Es para vos si...
                </h4>
                <ul className="mt-6 space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <Check />
                    <span>
                      Ya tenés un nivel B1+ y querés rodearte de gente que, como
                      vos, busca practicar.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check />
                    <span>
                      Querés mejorar tu{" "}
                      <span className="font-semibold">capacidad de hablar</span>{" "}
                      y ganar fluidez real.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check />
                    <span>
                      Te{" "}
                      <span className="font-semibold">
                        {"trancás"} o te quedás congelado
                      </span>{" "}
                      cuando intentás hablar.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check />
                    <span>
                      Estás por{" "}
                      <span className="font-semibold">viajar pronto</span> y
                      necesitás activar el idioma ya.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check />
                    <span>
                      Tenés una{" "}
                      <span className="font-semibold">
                        entrevista de trabajo
                      </span>{" "}
                      en inglés y querés prepararte.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <h4 className="text-2xl font-bold text-gray-900 flex items-center">
                  <XCircle />
                  NO es para vos si...
                </h4>
                <ul className="mt-6 space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <X />
                    <span>
                      Recién estás comenzando (nivel A1/A2) o nunca practicaste
                      inglés antes.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <X />
                    <span>
                      Estás buscando reforzar{" "}
                      <span className="font-semibold">
                        únicamente la gramática
                      </span>{" "}
                      y hacer ejercicios escritos.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <X />
                    <span>
                      No estás dispuesto a{" "}
                      <span className="font-semibold">superar tu miedo</span> y
                      participar activamente.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <X />
                    <span>
                      Tu objetivo no es mantener conversaciones fluidas, sino
                      solo aprobar un exámen.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                ¿Qué vas a obtener?
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                Todo lo que necesitás para que el{" "}
                <span className="font-semibold">speaking</span> deje de ser un
                problema.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
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
              </div>
              <div className="text-center">
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
              </div>
              <div className="text-center">
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
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 bg-gray-900 text-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                  NUESTRA METODOLOGÍA
                </span>
                <h3 className="text-3xl font-bold tracking-tight sm:text-4xl mt-3">
                  Clases Dinámicas. Cero Aburrimiento.
                </h3>
                <p className="mt-6 text-lg text-gray-300">
                  Olvidate de la clase tradicional. Aquí, el 90% del tiempo
                  estás hablando. Cada sesión está diseñada para maximizar tu
                  participación.
                </p>
                <p className="mt-4 text-lg text-gray-300">
                  Son{" "}
                  <span className="font-semibold text-white">
                    2 sesiones por semana de 1 hora
                  </span>
                  , enfocadas 100% en la interacción.
                </p>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl">
                <h4 className="text-xl font-semibold mb-5">
                  Algunas de nuestras actividades:
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Users />
                    <span>
                      Roleplays de situaciones reales (viajes, trabajo).
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Puzzle />
                    <span>Juegos interactivos y adivinanzas.</span>
                  </li>
                  <li className="flex items-center">
                    <Lightbulb />
                    <span>Creación de historias en grupo.</span>
                  </li>
                  <li className="flex items-center">
                    <MessageSquare />
                    <span>Preguntas, respuestas y debates dinámicos.</span>
                  </li>
                  <li className="flex items-center">
                    <ClipboardCheck />
                    <span>Y mucho más...</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto">
              <img
                className="w-32 h-32 rounded-full mx-auto shadow-lg"
                src="https://placehold.co/200x200/FACC15/333?text=MI"
                alt="Foto de Martín Ibarra"
              />
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-8">
                Conocé a tu profesor
              </h3>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                {`"`}Hola, soy{" "}
                <span className="font-semibold">Martín Ibarra</span>. Mi misión
                es que pierdas el miedo y ganes la fluidez que siempre quisiste.
                Pasé por lo mismo que vos: entendía todo, pero me costaba
                hablar. Creé este método para que puedas por fin soltarte en un
                ambiente seguro y de apoyo. No te voy a juzgar, te voy a guiar.{" "}
                {`"`}
              </p>
            </div>
          </div>
        </section>

        <section id="precios" className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Empezá a hablar sin miedo hoy mismo.
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Elegí el plan que mejor se adapte a vos y reservá tu lugar.{" "}
              <span className="font-semibold text-accent">
                ¡Los cupos son limitados!
              </span>
            </p>

            <div className="mt-12 bg-white p-10 rounded-2xl shadow-2xl border border-accent max-w-lg mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm font-medium text-gray-900">
                Programa Completo
              </span>
              <h4 className="text-4xl font-bold text-gray-900 mt-6">
                $XXX.XXX ARS
              </h4>
              <p className="text-gray-500">Pago único por 3 meses</p>

              <ul className="mt-8 space-y-3 text-left text-gray-700">
                <li className="flex items-center">
                  <Check />
                  Acceso por 3 meses a clases grupales.
                </li>
                <li className="flex items-center">
                  <Check />2 sesiones semanales de 1 hora.
                </li>
                <li className="flex items-center">
                  <Check />
                  Soporte prioritario por WhatsApp.
                </li>
                <li className="flex items-center">
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
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Preguntas Frecuentes
            </h2>
            <dl className="mt-12 space-y-6 divide-y divide-gray-200">
              <details className="pt-6 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-lg font-medium text-gray-900">
                    ¿Qué nivel de inglés necesito tener?
                  </span>
                  <span className="text-gray-500 group-open:hidden">
                    <Plus />
                  </span>
                  <span className="text-gray-500 hidden group-open:block">
                    <Minus />
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">
                  Recomendamos tener al menos un nivel B1 (intermedio bajo).
                  Debés ser capaz de entender ideas principales y formar
                  oraciones, aunque cometas errores. Este curso no es para
                  principiantes absolutos (A1/A2).
                </p>
              </details>
              <details className="pt-6 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-lg font-medium text-gray-900">
                    ¿Qué pasa si falto a una clase?
                  </span>
                  <span className="text-gray-500 group-open:hidden">
                    <Plus />
                  </span>
                  <span className="text-gray-500 hidden group-open:block">
                    <Minus />
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">
                  ¡No hay problema! Todas las clases se graban y tendrás acceso
                  a la grabación durante la duración del curso para que puedas
                  repasarla o verla si no pudiste conectarte en vivo.
                </p>
              </details>
              <details className="pt-6 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-lg font-medium text-gray-900">
                    ¿Cuántos alumnos hay por grupo?
                  </span>
                  <span className="text-gray-500 group-open:hidden">
                    <Plus />
                  </span>
                  <span className="text-gray-500 hidden group-open:block">
                    <Minus />
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">
                  Mantenemos los grupos reducidos (máximo 6 alumnos) para
                  garantizar que todos tengan múltiples oportunidades de hablar
                  y participar en cada sesión.
                </p>
              </details>
              <details className="pt-6 group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-lg font-medium text-gray-900">
                    ¿Vamos a ver gramática?
                  </span>
                  <span className="text-gray-500 group-open:hidden">
                    <Plus />
                  </span>
                  <span className="text-gray-500 hidden group-open:block">
                    <Minus />
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">
                  El foco principal es el{" "}
                  <span className="font-semibold">speaking</span>. Sin embargo,
                  la gramática se corrige de forma contextual. Si cometés un
                  error recurrente, el profesor lo corregirá en el momento o
                  dará una breve explicación para que el error no se fosilice,
                  pero no haremos ejercicios de gramática escritos.
                </p>
              </details>
            </dl>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2025 Inglés por el Éxito. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              <Instagram />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <MessageCircle />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin />
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
