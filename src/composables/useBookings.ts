import { bookingAPI } from "../api/bookingService.ts";
import { useBookingStore } from "../stores/bookingStore.ts";
import { useNotificationStore } from "../stores/notificationStore.ts";
import { calculateDateRange } from "../utils/dateRangeUtils.ts";
import type {
  ICreateBooking,
  IUpdateBooking,
  ICancelBooking,
  IBookingQueryParams,
  IBookingFilters,
  IDateRange,
  TimeFrame,
} from "../types";

// Helper function to extract error message from API error
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const useBookings = () => {
  const bookingStore = useBookingStore();
  const notificationStore = useNotificationStore();

  const fetchBookings = async (params: Partial<IBookingQueryParams> = {}) => {
    bookingStore.setLoading(true);
    bookingStore.clearError();

    try {
      // Build query parameters including filters, sorting, and pagination
      const queryParams: IBookingQueryParams = {
        ...params,
        sortBy: bookingStore.sortField,
        order: bookingStore.sortOrder,
        status:
          bookingStore.filters.status !== "all"
            ? bookingStore.filters.status
            : undefined,
        page: bookingStore.pagination.page,
        limit: bookingStore.pagination.limit,
      };

      // Add date range parameters if timeFrame is not 'all'
      if (bookingStore.filters.timeFrame !== "all") {
        const dateRange = calculateDateRange(
          bookingStore.filters.timeFrame as TimeFrame,
          bookingStore.filters.timeFrame === "custom"
            ? bookingStore.customDateRange
            : null
        );
        if (dateRange) {
          queryParams.from = dateRange.from;
          queryParams.to = dateRange.to;
        }
      }

      const response = await bookingAPI.getBookings(queryParams);
      bookingStore.setBookings(response.data);
      bookingStore.setPagination(response.pagination);
      bookingStore.setTotalRevenue(response.totalRevenue || 0);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      bookingStore.setError(errorMessage);
      notificationStore.showError(errorMessage);
    } finally {
      bookingStore.setLoading(false);
    }
  };

  const createBooking = async (bookingData: ICreateBooking) => {
    bookingStore.setLoading(true);
    bookingStore.clearError();

    try {
      await bookingAPI.createBooking(bookingData);
      notificationStore.showSuccess("Booking created successfully!");
      // Refresh bookings after creation
      await fetchBookings();
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      bookingStore.setError(errorMessage);
      notificationStore.showError(errorMessage);
      return false;
    } finally {
      bookingStore.setLoading(false);
    }
  };

  const updateBooking = async (
    bookingId: string,
    bookingData: IUpdateBooking
  ) => {
    bookingStore.setLoading(true);
    bookingStore.clearError();

    try {
      const updatedBooking = await bookingAPI.updateBooking(
        bookingId,
        bookingData
      );
      notificationStore.showSuccess("Booking updated successfully!");
      // Refresh bookings after update
      await fetchBookings();
      return updatedBooking;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      bookingStore.setError(errorMessage);
      notificationStore.showError(errorMessage);
      return null;
    } finally {
      bookingStore.setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string, refundAmount = 0) => {
    bookingStore.setLoading(true);
    bookingStore.clearError();

    try {
      const cancelData: ICancelBooking = {
        cancelledDate: new Date().toISOString().split("T")[0] as string,
        refundValue: refundAmount,
      };
      const updatedBooking = await bookingAPI.cancelBooking(
        bookingId,
        cancelData
      );
      notificationStore.showSuccess("Booking cancelled successfully!");
      // Refresh bookings after cancellation
      await fetchBookings();
      return updatedBooking;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      bookingStore.setError(errorMessage);
      notificationStore.showError(errorMessage);
      return null;
    } finally {
      bookingStore.setLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    bookingStore.setLoading(true);
    bookingStore.clearError();

    try {
      await bookingAPI.deleteBooking(bookingId);
      notificationStore.showSuccess("Booking deleted successfully!");
      // Refresh bookings after deletion
      await fetchBookings();
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      bookingStore.setError(errorMessage);
      notificationStore.showError(errorMessage);
      return false;
    } finally {
      bookingStore.setLoading(false);
    }
  };

  // Helper functions for managing filters, sorting, and pagination
  const updateFiltersAndFetch = async (
    newFilters: Partial<IBookingFilters>
  ) => {
    bookingStore.updateFilters(newFilters);
    bookingStore.resetPaginationPage(); // Reset to first page when filtering
    await fetchBookings();
  };

  const updateCustomDateRangeAndFetch = async (dateRange: IDateRange) => {
    bookingStore.updateCustomDateRange(dateRange);
    bookingStore.resetPaginationPage(); // Reset to first page when filtering
    await fetchBookings();
  };

  const updateSortAndFetch = async (field: string, order: "asc" | "desc") => {
    bookingStore.updateSort(field, order);
    bookingStore.resetPaginationPage(); // Reset to first page when sorting
    await fetchBookings();
  };

  const updatePaginationAndFetch = async (
    newPage?: number,
    newLimit?: number
  ) => {
    bookingStore.updatePagination(newPage, newLimit);
    await fetchBookings();
  };

  const resetFiltersAndSortAndFetch = async () => {
    bookingStore.resetFiltersAndSort();
    await fetchBookings();
  };

  return {
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    updateFiltersAndFetch,
    updateCustomDateRangeAndFetch,
    updateSortAndFetch,
    updatePaginationAndFetch,
    resetFiltersAndSortAndFetch,
  };
};
