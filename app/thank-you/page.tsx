import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";

import { WHATSAPP_GROUP_URL } from "@/lib/constants";

export const metadata = {
  title: "¡Gracias! | Inglés por el Éxito",
  description:
    "Completaste tu registro para Inglés por el Éxito. Unite al grupo de WhatsApp para enterarte de las novedades.",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-yellow-100/40 via-white to-white" />
      <div className="container mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16">
        <div className="flex flex-1 flex-col justify-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              ¡Gracias por reservar tu lugar!
            </h1>
            <p className="text-lg text-gray-600">
              Te enviamos un correo con más información. Mientras tanto, podés
              unirte al grupo de WhatsApp para enterarte primero de las
              novedades.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" /> Ir al grupo de WhatsApp
            </a>
            <p className="text-sm text-gray-500">
              Abriremos el chat en una pestaña nueva para que puedas volver al
              sitio cuando quieras.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
