import { NextResponse } from "next/server";
import { ContactStatus } from "@/generated/client";
import {
  DEFAULT_CONTACT_NOTES,
  DEFAULT_CONTACT_SOURCE,
  ensureContactNames,
  hasMeaningfulText,
  sanitizeEmail,
  sanitizeName,
  sanitizeString,
} from "@/lib/contact-utils";
import { prisma } from "@/lib/prisma";

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

    const providedFirstName = sanitizeName(payload?.firstName);
    const providedLastName = sanitizeName(payload?.lastName);

    const { firstName, lastName } = ensureContactNames({
      email,
      firstName: providedFirstName,
      lastName: providedLastName,
    });

    const source = sanitizeString(payload?.source) ?? DEFAULT_CONTACT_SOURCE;
    const notes = sanitizeString(payload?.notes) ?? DEFAULT_CONTACT_NOTES;

    if (!process.env.DATABASE_URL) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "DATABASE_URL is not configured. Skipping landing lead persistence.",
        );
      }

      return NextResponse.json(
        {
          contact: {
            id: `temp-${crypto.randomUUID()}`,
            email,
            firstName,
            lastName,
            source,
            notes,
            status: ContactStatus.LEAD,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          persisted: false,
        },
        { status: 201 },
      );
    }

    const existing = await prisma.contact.findUnique({
      where: { email },
    });

    if (existing) {
      const updateData: Record<string, string> = {};

      if (
        providedFirstName &&
        providedFirstName !== existing.firstName
      ) {
        updateData.firstName = providedFirstName;
      } else if (!hasMeaningfulText(existing.firstName)) {
        updateData.firstName = firstName;
      }

      if (
        providedLastName &&
        providedLastName !== existing.lastName
      ) {
        updateData.lastName = providedLastName;
      } else if (!hasMeaningfulText(existing.lastName)) {
        updateData.lastName = lastName;
      }

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
