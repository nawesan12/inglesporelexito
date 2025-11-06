"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";

import { WHATSAPP_GROUP_URL } from "@/lib/constants";

export default function ThankYouPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = WHATSAPP_GROUP_URL;
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
              Te estamos redirigiendo al grupo de WhatsApp para que puedas
              enterarte primero de las novedades.
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
              Si no ocurre automáticamente, hacé clic en el botón para acceder.
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
