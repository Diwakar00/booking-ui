import { defineStore } from "pinia";
import { ref } from "vue";
import { calculateBookingStatuses } from "../utils/bookingUtils.ts";
import type {
  IBookingResponse,
  IBookingFilters,
  IDateRange,
  IPagination,
} from "../types";

export const useBookingStore = defineStore("booking", () => {
  // Booking state
  const bookings = ref<IBookingResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Filters state
  const filters = ref<IBookingFilters>({
    status: "all",
    timeFrame: "all",
  });

  // Custom date range state (for custom timeFrame)
  const customDateRange = ref<IDateRange>({
    from: "",
    to: "",
  });

  // Sorting state
  const sortField = ref<string>("bookingDate");
  const sortOrder = ref<"asc" | "desc">("desc");

  // Pagination state
  const pagination = ref<IPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Revenue state
  const totalRevenue = ref(0);

  // Setter methods for state management
  const setBookings = (newBookings: IBookingResponse[]) => {
    bookings.value = calculateBookingStatuses(newBookings);
  };

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
  };

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage;
  };

  const clearError = () => {
    error.value = null;
  };

  const setPagination = (newPagination: IPagination) => {
    pagination.value = newPagination;
  };

  const setTotalRevenue = (revenue: number) => {
    totalRevenue.value = revenue;
  };

  const updateFilters = (newFilters: Partial<IBookingFilters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const updateCustomDateRange = (dateRange: IDateRange) => {
    customDateRange.value = { ...dateRange };
    filters.value.timeFrame = "custom";
  };

  const updateSort = (field: string, order: "asc" | "desc") => {
    sortField.value = field;
    sortOrder.value = order;
  };

  const updatePagination = (newPage?: number, newLimit?: number) => {
    if (newLimit && newLimit !== pagination.value.limit) {
      pagination.value.limit = newLimit;
      pagination.value.page = 1; // Reset to first page when changing page size
    } else if (newPage) {
      pagination.value.page = newPage;
    }
  };

  const resetFiltersAndSort = () => {
    filters.value.status = "all";
    filters.value.timeFrame = "all";
    customDateRange.value = { from: "", to: "" };
    sortField.value = "bookingDate";
    sortOrder.value = "desc";
    pagination.value.page = 1; // Reset to first page
  };

  const resetPaginationPage = () => {
    pagination.value.page = 1;
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

    // Setters
    setBookings,
    setLoading,
    setError,
    clearError,
    setPagination,
    setTotalRevenue,
    updateFilters,
    updateCustomDateRange,
    updateSort,
    updatePagination,
    resetFiltersAndSort,
    resetPaginationPage,
  };
});
