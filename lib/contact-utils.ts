const DEFAULT_FIRST_NAME = "Lead";
const DEFAULT_LAST_NAME = "Landing";

export function sanitizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function sanitizeEmail(value: unknown): string | undefined {
  const email = sanitizeString(value)?.toLowerCase();
  if (!email) return undefined;

  if (!email.includes("@")) return undefined;

  return email;
}

function capitalizeWord(word: string) {
  if (!word) return word;
  const [first, ...rest] = word;
  if (!first) return word;

  const firstChar = first.toLocaleUpperCase("es");
  const restChars = rest.join("").toLocaleLowerCase("es");
  return `${firstChar}${restChars}`;
}

export function sanitizeName(value: unknown): string | undefined {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;

  const parts = normalized
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return undefined;
  }

  return parts.map(capitalizeWord).join(" ");
}

export function deriveContactName(email: string) {
  const [localPart] = email.split("@");

  if (!localPart) {
    return { firstName: DEFAULT_FIRST_NAME, lastName: DEFAULT_LAST_NAME };
  }

  const cleaned = localPart.replace(/[^a-zA-Z0-9]+/g, " ").trim();

  if (!cleaned) {
    return { firstName: DEFAULT_FIRST_NAME, lastName: DEFAULT_LAST_NAME };
  }

  const parts = cleaned.split(/\s+/).filter(Boolean).map(capitalizeWord);

  if (parts.length === 0) {
    return { firstName: DEFAULT_FIRST_NAME, lastName: DEFAULT_LAST_NAME };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: DEFAULT_LAST_NAME };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || DEFAULT_LAST_NAME,
  };
}

export function ensureContactNames({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const derived = deriveContactName(email);

  const finalFirstName = firstName ?? derived.firstName;
  const finalLastName = lastName ?? derived.lastName;

  return {
    firstName: finalFirstName,
    lastName: finalLastName,
  };
}

export function hasMeaningfulText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export const DEFAULT_CONTACT_SOURCE = "Landing Page";
export const DEFAULT_CONTACT_NOTES =
  "Registro automático desde la landing page";

export function getContactDisplayName({
  firstName,
  lastName,
  email,
}: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}) {
  const parts = [firstName, lastName].filter(hasMeaningfulText);

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return email ?? "Contacto sin nombre";
}
