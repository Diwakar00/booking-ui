import { format, parseISO } from "date-fns";

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDateISOToReadable(iso: string | null) {
  if (!iso) return "-";
  try {
    return format(parseISO(iso), "yyyy-MM-dd");
  } catch {
    return iso;
  }
}
