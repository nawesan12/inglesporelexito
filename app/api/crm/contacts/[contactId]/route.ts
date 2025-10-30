import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@/generated/client";

const STATUS_VALUES = new Set(Object.values(ContactStatus));

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function GET(
  _request: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.contactId },
      include: {
        company: true,
        deals: true,
        tasks: true,
        interactions: true,
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Failed to fetch contact", error);
    return NextResponse.json(
      { error: "No se pudo obtener el contacto" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    const payload = await request.json();

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

    if (typeof payload.status === "string" && STATUS_VALUES.has(payload.status as ContactStatus)) {
      updateData.status = payload.status;
    }

    if (payload.companyId === null) {
      updateData.companyId = null;
    } else if (typeof payload.companyId === "string") {
      updateData.companyId = payload.companyId;
    }

    const contact = await prisma.contact.update({
      where: { id: params.contactId },
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

export async function DELETE(
  _request: Request,
  { params }: { params: { contactId: string } }
) {
  try {
    await prisma.contact.delete({ where: { id: params.contactId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete contact", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el contacto" },
      { status: 500 }
    );
  }
}
