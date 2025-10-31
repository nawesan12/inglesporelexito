import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inglés por el Éxito",
    template: "%s | Inglés por el Éxito",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
