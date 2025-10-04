import api from "./axios.ts";
import type {
  IBooking,
  IBookingResponse,
  ICreateBooking,
  IUpdateBooking,
  ICancelBooking,
  IBookingQueryParams,
  IPaginatedResponse,
} from "../types";

// Booking API functions
export const bookingAPI = {
  // Get all bookings with optional query parameters
  getBookings: async (
    params: IBookingQueryParams = {}
  ): Promise<IPaginatedResponse<IBookingResponse>> => {
    try {
      const response = await api.get<IPaginatedResponse<IBookingResponse>>(
        "/bookings",
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new booking
  createBooking: async (bookingData: ICreateBooking): Promise<IBooking> => {
    try {
      const response = await api.post<IBooking>("/bookings", bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a booking
  updateBooking: async (
    bookingId: string,
    bookingData: IUpdateBooking
  ): Promise<IBooking> => {
    try {
      const response = await api.put<IBooking>(
        `/bookings/${bookingId}`,
        bookingData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a booking
  deleteBooking: async (bookingId: string): Promise<void> => {
    try {
      await api.delete(`/bookings/${bookingId}`);
    } catch (error) {
      throw error;
    }
  },

  // Cancel a booking (update with cancellation data)
  cancelBooking: async (
    bookingId: string,
    cancelData: ICancelBooking
  ): Promise<IBooking> => {
    try {
      const response = await api.put<IBooking>(
        `/bookings/${bookingId}/cancel`,
        cancelData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bookingAPI;
