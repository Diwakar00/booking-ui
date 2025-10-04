import api from "./axios.ts";

// Booking API functions
export const bookingAPI = {
  // Get all bookings with optional query parameters
  getBookings: async (params = {}) => {
    try {
      const response = await api.get("/bookings", { params });
      return response.data;
    } catch (error) {}
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {}
  },

  // Update a booking
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {}
  },

  // Delete a booking
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {}
  },

  // Cancel a booking (update with cancellation data)
  cancelBooking: async (bookingId, cancelData) => {
    try {
      const response = await api.put(
        `/bookings/${bookingId}/cancel`,
        cancelData
      );
      return response.data;
    } catch (error) {}
  },
};

export default bookingAPI;
