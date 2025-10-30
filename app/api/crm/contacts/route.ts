import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@/generated/client";

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        company: true,
        deals: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los contactos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const firstName = sanitizeString(payload.firstName);
    const lastName = sanitizeString(payload.lastName);
    const email = sanitizeString(payload.email);

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Nombre, apellido y email son obligatorios" },
        { status: 400 }
      );
    }

    let companyId: string | undefined = undefined;
    const companyName = sanitizeString(
      payload.company?.name ?? payload.companyName
    );
    const companyIndustry = sanitizeString(
      payload.company?.industry ?? payload.companyIndustry
    );
    const companyWebsite = sanitizeString(
      payload.company?.website ?? payload.companyWebsite
    );

    if (payload.companyId) {
      companyId = payload.companyId;
    } else if (companyName) {
      const existingCompany = await prisma.company.findFirst({
        where: { name: companyName },
      });

      if (existingCompany) {
        companyId = existingCompany.id;

        if (companyIndustry !== undefined || companyWebsite !== undefined) {
          await prisma.company.update({
            where: { id: existingCompany.id },
            data: {
              ...(companyIndustry !== undefined
                ? { industry: companyIndustry }
                : {}),
              ...(companyWebsite !== undefined
                ? { website: companyWebsite }
                : {}),
            },
          });
        }
      } else {
        const company = await prisma.company.create({
          data: {
            name: companyName,
            industry: companyIndustry,
            website: companyWebsite,
          },
        });
        companyId = company.id;
      }
    }

    const status =
      typeof payload.status === "string" && payload.status in ContactStatus
        ? (payload.status as ContactStatus)
        : ContactStatus.LEAD;

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: sanitizeString(payload.phone),
        position: sanitizeString(payload.position),
        source: sanitizeString(payload.source),
        notes: sanitizeString(payload.notes),
        status,
        companyId,
      },
      include: {
        company: true,
        deals: true,
        tasks: true,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact", error);
    return NextResponse.json(
      { error: "No se pudo crear el contacto" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const contactId = sanitizeString(payload.id ?? payload.contactId);

    if (!contactId) {
      return NextResponse.json(
        { error: "No se pudo identificar el contacto" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    const firstName = sanitizeString(payload.firstName);
    const lastName = sanitizeString(payload.lastName);
    const email = sanitizeString(payload.email);
    const phone = sanitizeString(payload.phone);
    const position = sanitizeString(payload.position);
    const source = sanitizeString(payload.source);
    const notes = sanitizeString(payload.notes);

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (position !== undefined) updateData.position = position;
    if (source !== undefined) updateData.source = source;
    if (notes !== undefined) updateData.notes = notes;

    if (
      typeof payload.status === "string" &&
      STATUS_VALUES.has(payload.status as ContactStatus)
    ) {
      updateData.status = payload.status;
    }

    if (payload.companyId === null) {
      updateData.companyId = null;
    } else if (typeof payload.companyId === "string") {
      updateData.companyId = payload.companyId;
    }

    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: updateData,
      include: {
        company: true,
        deals: true,
        tasks: true,
        interactions: true,
      },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Failed to update contact", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el contacto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const contactId =
      payload && typeof payload.id === "string"
        ? sanitizeString(payload.id)
        : payload && typeof payload.contactId === "string"
          ? sanitizeString(payload.contactId)
          : undefined;

    if (!contactId) {
      return NextResponse.json(
        { error: "No se pudo identificar el contacto" },
        { status: 400 }
      );
    }

    await prisma.contact.delete({ where: { id: contactId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete contact", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el contacto" },
      { status: 500 }
    );
  }
}
