import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inglés para el éxito",
    template: "%s | Inglés para el éxito",
  },
  description:
    "Clases grupales de speaking para destrabar tu inglés, ganar confianza y participar sin miedo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
