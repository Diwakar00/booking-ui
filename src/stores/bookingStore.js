import { defineStore } from "pinia";
import { ref } from "vue";
import { bookingAPI } from "../api/bookingService.js";
import { useNotificationStore } from "./notificationStore.js";
import { calculateBookingStatuses } from "../utils/bookingUtils.js";
import { calculateDateRange } from "../utils/dateRangeUtils.js";

export const useBookingStore = defineStore("booking", () => {
  // Booking state
  const bookings = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Filters state
  const filters = ref({
    status: "all",
    timeFrame: "all",
  });

  // Custom date range state (for custom timeFrame)
  const customDateRange = ref({
    from: "",
    to: "",
  });

  // Sorting state
  const sortField = ref("bookingDate");
  const sortOrder = ref("desc");

  // Pagination state
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Revenue state
  const totalRevenue = ref(0);

  // Actions
  const fetchBookings = async (params = {}) => {
    const notificationStore = useNotificationStore();
    loading.value = true;
    error.value = null;
    try {
      // Build query parameters including filters, sorting, and pagination
      const queryParams = {
        ...params,
        sortBy: sortField.value,
        order: sortOrder.value,
        status:
          filters.value.status !== "all" ? filters.value.status : undefined,
        page: pagination.value.page,
        limit: pagination.value.limit,
      };

      // Add date range parameters if timeFrame is not 'all'
      if (filters.value.timeFrame !== "all") {
        const dateRange = calculateDateRange(
          filters.value.timeFrame,
          filters.value.timeFrame === "custom" ? customDateRange.value : null
        );
        if (dateRange) {
          queryParams.from = dateRange.from;
          queryParams.to = dateRange.to;
        }
      }

      // Remove undefined values
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await bookingAPI.getBookings(queryParams);

      // Calculate status for each booking after receiving response
      bookings.value = calculateBookingStatuses(response.data);

      // Update pagination state from API response
      pagination.value.page = response.pagination.page;
      pagination.value.limit = response.pagination.limit;
      pagination.value.total = response.pagination.total;
      pagination.value.totalPages = response.pagination.totalPages;

      // Update total revenue from API response
      totalRevenue.value = response.totalRevenue || 0;
    } catch (err) {
      error.value = "Failed to fetch bookings";
      notificationStore.showError(
        "Failed to fetch bookings. Please check if the backend server is running."
      );
    } finally {
      loading.value = false;
    }
  };

  const createBooking = async (bookingData) => {
    const notificationStore = useNotificationStore();
    loading.value = true;
    error.value = null;
    try {
      const newBooking = await bookingAPI.createBooking(bookingData);
      // Refresh the current page to show updated data
      await fetchBookings();
      notificationStore.showSuccess("Booking created successfully!");
    } catch (err) {
      error.value = "Failed to create booking";
      notificationStore.showError(
        "Failed to create booking. Please try again."
      );
    } finally {
      loading.value = false;
    }
  };

  const updateBooking = async (bookingId, bookingData) => {
    const notificationStore = useNotificationStore();
    loading.value = true;
    error.value = null;
    try {
      const updatedBooking = await bookingAPI.updateBooking(
        bookingId,
        bookingData
      );
      // Refresh the current page to show updated data
      await fetchBookings();
      notificationStore.showSuccess("Booking updated successfully!");
      return updatedBooking;
    } catch (err) {
      error.value = "Failed to update booking";
      notificationStore.showError(
        "Failed to update booking. Please try again."
      );
    } finally {
      loading.value = false;
    }
  };

  const cancelBooking = async (bookingId, refundAmount = 0) => {
    const notificationStore = useNotificationStore();
    loading.value = true;
    error.value = null;
    try {
      const cancelData = {
        cancelledDate: new Date().toISOString().split("T")[0],
        refundValue: refundAmount,
      };
      const updatedBooking = await bookingAPI.cancelBooking(
        bookingId,
        cancelData
      );
      // Refresh the current page to show updated data
      await fetchBookings();
      notificationStore.showSuccess("Booking cancelled successfully!");
      return updatedBooking;
    } catch (err) {
      error.value = "Failed to cancel booking";
      notificationStore.showError(
        "Failed to cancel booking. Please try again."
      );
    } finally {
      loading.value = false;
    }
  };

  const deleteBooking = async (bookingId) => {
    const notificationStore = useNotificationStore();
    loading.value = true;
    error.value = null;
    try {
      await bookingAPI.deleteBooking(bookingId);
      // Refresh the current page to show updated data
      await fetchBookings();
      notificationStore.showSuccess("Booking deleted successfully!");
    } catch (err) {
      error.value = "Failed to delete booking";
      notificationStore.showError(
        "Failed to delete booking. Please try again."
      );
    } finally {
      loading.value = false;
    }
  };

  // Update filters and trigger backend fetch
  const updateFiltersAndFetch = async (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    pagination.value.page = 1; // Reset to first page when filtering
    await fetchBookings({});
  };

  // Update custom date range and set timeFrame to custom
  const updateCustomDateRange = async (dateRange) => {
    customDateRange.value = { ...dateRange };
    filters.value.timeFrame = "custom";
    pagination.value.page = 1; // Reset to first page when filtering
    await fetchBookings({});
  };

  // Update sort and trigger backend fetch
  const updateSortAndFetch = async (field, order) => {
    sortField.value = field;
    sortOrder.value = order;
    pagination.value.page = 1; // Reset to first page when sorting
    await fetchBookings({});
  };

  // Update pagination and trigger backend fetch
  const updatePagination = async (newPage, newLimit) => {
    if (newLimit && newLimit !== pagination.value.limit) {
      pagination.value.limit = newLimit;
      pagination.value.page = 1; // Reset to first page when changing page size
    } else if (newPage) {
      pagination.value.page = newPage;
    }
    await fetchBookings({});
  };

  // Function to reset both filters and sort
  const resetFiltersAndSort = async () => {
    filters.value.status = "all";
    filters.value.timeFrame = "all";
    customDateRange.value = { from: "", to: "" };
    sortField.value = "bookingDate";
    sortOrder.value = "desc";
    pagination.value.page = 1; // Reset to first page

    await fetchBookings({});
  };

  return {
    // State
    bookings,
    loading,
    error,
    filters,
    customDateRange,
    sortField,
    sortOrder,
    pagination,
    totalRevenue,

    // Actions
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    updateSortAndFetch,
    updateFiltersAndFetch,
    updateCustomDateRange,
    updatePagination,
    resetFiltersAndSort,
  };
});
