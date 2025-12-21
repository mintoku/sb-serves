export const SERVICE_OPTIONS = [
  "Haircuts",
  "Nails",
  "Lashes",
  "Brows",
  "Makeup",
  "Tailor/hem",
  "Food",
  "Photography",
  "Cleaning",
  "Other",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
