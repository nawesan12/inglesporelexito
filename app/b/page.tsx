"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  Users,
  MessageCircle,
  Gamepad2,
  Plane,
  Briefcase,
} from "lucide-react";

export default function InglesPorElExitoLanding() {
  return (
    <main className="bg-gradient-to-b from-white to-blue-50 text-gray-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-blue-900"
        >
          Clases Grupales de <span className="text-blue-600">Speaking</span>
        </motion.h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Superá tu miedo a hablar inglés y empezá a expresarte con confianza
          junto a personas que tienen tu mismo objetivo.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full"
          >
            Ver Video de Presentación
          </Button>
        </div>
      </section>

      {/* Para quién es */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl font-semibold text-blue-900 mb-4">
            ¿Para quién es?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="text-green-600 mt-1" /> Si ya tenés cierto nivel
              de inglés y querés practicar con otros.
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-600 mt-1" /> Si querés mejorar tu
              fluidez y dejar de trabarte al hablar.
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-600 mt-1" /> Si estás por viajar y
              querés ganar soltura.
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-green-600 mt-1" /> Si tenés una entrevista
              en inglés y querés prepararte mejor.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-blue-900 mb-4">
            ¿Para quién no es?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <X className="text-red-500 mt-1" /> Si recién estás comenzando
              desde cero.
            </li>
            <li className="flex items-start gap-3">
              <X className="text-red-500 mt-1" /> Si solo querés enfocarte en
              gramática.
            </li>
            <li className="flex items-start gap-3">
              <X className="text-red-500 mt-1" /> Si no estás dispuesto a
              superar tu miedo a hablar.
            </li>
            <li className="flex items-start gap-3">
              <X className="text-red-500 mt-1" /> Si no querés mantener
              conversaciones reales en inglés.
            </li>
          </ul>
        </div>
      </section>

      {/* Qué vas a obtener */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-10">
            ¿Qué vas a obtener con estas clases?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-md border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Users className="text-blue-600 w-10 h-10 mb-4" />
                <h3 className="font-semibold text-xl mb-2">
                  3 meses de clases
                </h3>
                <p>
                  Sesiones grupales semanales con el profesor y compañeros de
                  distintos niveles para practicar juntos.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <MessageCircle className="text-blue-600 w-10 h-10 mb-4" />
                <h3 className="font-semibold text-xl mb-2">
                  Acompañamiento constante
                </h3>
                <p>
                  Soporte y comunicación directa por WhatsApp para resolver
                  dudas y seguir aprendiendo fuera de clase.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md border-0">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Gamepad2 className="text-blue-600 w-10 h-10 mb-4" />
                <h3 className="font-semibold text-xl mb-2">
                  Actividades interactivas
                </h3>
                <p>
                  Roleplays, juegos, adivinanzas y creación de historias para
                  hablar inglés de manera natural y divertida.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cómo serán las clases */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            ¿Cómo serán las clases?
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Dos sesiones semanales de una hora, con foco en conversación,
                escucha y práctica real.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="text-green-600 mt-1" /> Roleplays sobre
                  situaciones reales
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-600 mt-1" /> Preguntas y
                  respuestas espontáneas
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-600 mt-1" /> Creación de
                  historias y desafíos
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-600 mt-1" /> Juegos y dinámicas
                  para hablar sin miedo
                </li>
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-xl rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                ¡Hablá inglés con confianza!
              </h3>
              <p className="text-gray-600 mb-6">
                Tu progreso se construye con cada palabra. Sumate a una
                comunidad que quiere lo mismo que vos: hablar inglés de verdad.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full text-lg">
                Unirme Ahora
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Inglés por el Éxito. Todos los derechos
        reservados.
      </footer>
    </main>
  );
}
