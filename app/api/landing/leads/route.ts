import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@/generated/client";

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeEmail(value: unknown) {
  const email = sanitizeString(value)?.toLowerCase();
  if (!email) return undefined;

  if (!email.includes("@")) return undefined;

  return email;
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function deriveContactName(email: string) {
  const [localPart] = email.split("@");

  if (!localPart) {
    return { firstName: "Lead", lastName: "Landing" };
  }

  const cleaned = localPart.replace(/[^a-zA-Z0-9]+/g, " ").trim();

  if (!cleaned) {
    return { firstName: "Lead", lastName: "Landing" };
  }

  const parts = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map(capitalize);

  if (parts.length === 0) {
    return { firstName: "Lead", lastName: "Landing" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "Lead" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || "Landing",
  };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const email = sanitizeEmail(payload?.email);

    if (!email) {
      return NextResponse.json(
        { error: "Necesitamos un email válido para guardar tu registro." },
        { status: 400 }
      );
    }

    const source = sanitizeString(payload?.source) ?? "Landing Page";
    const notes =
      sanitizeString(payload?.notes) ??
      "Registro automático desde la landing page";

    const existing = await prisma.contact.findUnique({
      where: { email },
    });

    if (existing) {
      const updateData: Record<string, string> = {};

      if (!existing.source && source) {
        updateData.source = source;
      }

      if (!existing.notes && notes) {
        updateData.notes = notes;
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ contact: existing });
      }

      const contact = await prisma.contact.update({
        where: { id: existing.id },
        data: updateData,
      });

      return NextResponse.json({ contact });
    }

    const { firstName, lastName } = deriveContactName(email);

    const contact = await prisma.contact.create({
      data: {
        email,
        firstName,
        lastName,
        source,
        notes,
        status: ContactStatus.LEAD,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Failed to register landing lead", error);
    return NextResponse.json(
      { error: "No se pudo registrar tu email. Intentalo nuevamente." },
      { status: 500 }
    );
  }
}
