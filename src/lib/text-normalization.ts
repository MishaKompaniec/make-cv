export type NormalizeTextOptions = {
  trim?: boolean;
  capitalizeFirst?: boolean;
};

export function normalizeText(
  value: string,
  options: NormalizeTextOptions = {},
): string {
  const { trim = true, capitalizeFirst = true } = options;

  let out = value;
  if (trim) out = out.trim();
  if (!capitalizeFirst) return out;
  if (!out) return out;

  return out[0].toUpperCase() + out.slice(1);
}

const FIELD_NORMALIZATION_OVERRIDES: Record<string, NormalizeTextOptions> = {
  email: { trim: true, capitalizeFirst: false },
  phone: { trim: true, capitalizeFirst: false },
  linkedInUrl: { trim: true, capitalizeFirst: false },
  gitUrl: { trim: true, capitalizeFirst: false },
  linkedIn: { trim: true, capitalizeFirst: false },
  git: { trim: true, capitalizeFirst: false },
  postalCode: { trim: true, capitalizeFirst: false },
  birthdate: { trim: true, capitalizeFirst: false },
  avatar: { trim: true, capitalizeFirst: false },
};

export function normalizeCvFieldValue(
  fieldName: string,
  value: string,
): string {
  const override = FIELD_NORMALIZATION_OVERRIDES[fieldName];
  return normalizeText(
    value,
    override ?? { trim: true, capitalizeFirst: true },
  );
}
