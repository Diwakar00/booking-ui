import { STATUS } from "../constants/index.js";

// Utility functions for booking operations
export const calculateStatus = (booking) => {
  if (booking.cancelledDate) return STATUS.CANCELLED;
  const today = new Date();
  const departure = new Date(booking.departureDate);
  return departure < today ? STATUS.COMPLETED : STATUS.CONFIRMED;
};

export const calculateBookingStatuses = (bookings) => {
  return bookings.map((booking) => ({
    ...booking,
    status: calculateStatus(booking),
  }));
};
