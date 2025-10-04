import type { BookingStatus } from "../types";

export const STATUS: { [key: string]: BookingStatus } = {
  ALL: "all",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};
