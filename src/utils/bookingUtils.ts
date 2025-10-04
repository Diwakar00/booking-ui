import { STATUS } from "../constants/index.ts";
import type { IBooking, IBookingResponse, BookingStatus } from "../types";

// Utility functions for booking operations
export const calculateStatus = (booking: IBooking): BookingStatus => {
  if (booking.cancelledDate) return STATUS.CANCELLED as BookingStatus;
  const today = new Date();
  const departure = new Date(booking.departureDate);
  return (
    departure < today ? STATUS.COMPLETED : STATUS.CONFIRMED
  ) as BookingStatus;
};

export const calculateBookingStatuses = (
  bookings: IBooking[]
): IBookingResponse[] => {
  return bookings.map((booking) => ({
    ...booking,
    status: calculateStatus(booking),
  }));
};
