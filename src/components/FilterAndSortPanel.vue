<template>
  <div class="filter-sort-section">
    <div class="filter-sort-group">
      <label>Status:</label>
      <n-select
        v-model:value="bookingStore.filters.status"
        :options="statusOptions"
        @update:value="handleFiltersChange"
        style="width: 150px"
      />
    </div>
    <div class="filter-sort-group">
      <label>Booking Date:</label>
      <n-select
        v-model:value="bookingStore.filters.timeFrame"
        :options="timeFrameOptions"
        @update:value="handleFiltersChange"
        style="width: 150px"
      />
    </div>
    <div class="filter-sort-group">
      <label>Sort By:</label>
      <n-select
        :value="`${bookingStore.sortField}-${bookingStore.sortOrder}`"
        :options="sortOptions"
        @update:value="handleSortChange"
        style="width: 200px"
      />
    </div>
    <n-button @click="resetAll" type="default"> Reset All </n-button>

    <!-- Custom Date Range Modal -->
    <CustomDateRangeModal
      :show="showCustomDateModal"
      :initialFromDate="bookingStore.customDateRange.from"
      :initialToDate="bookingStore.customDateRange.to"
      @close="closeCustomDateModal"
      @apply="applyCustomDateRange"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { NSelect, NButton } from "naive-ui";
import { STATUS } from "../constants/index.ts";
import { useBookingStore } from "../stores/bookingStore.ts";
import { getTimeFrameLabel } from "../utils/dateRangeUtils.ts";
import CustomDateRangeModal from "./CustomDateRangeModal.vue";

// Use the global store
const bookingStore = useBookingStore();

// Modal state
const showCustomDateModal = ref(false);

// Sort options
const sortOptions = [
  { label: "Booking Date (Newest First)", value: "bookingDate-desc" },
  { label: "Booking Date (Oldest First)", value: "bookingDate-asc" },
  { label: "Customer Name (A-Z)", value: "name-asc" },
  { label: "Customer Name (Z-A)", value: "name-desc" },
  { label: "Price (Low to High)", value: "value-asc" },
  { label: "Price (High to Low)", value: "value-desc" },
  { label: "Arrival Date (Newest First)", value: "arrivalDate-desc" },
  { label: "Arrival Date (Oldest First)", value: "arrivalDate-asc" },
  { label: "Departure Date (Newest First)", value: "departureDate-desc" },
  { label: "Departure Date (Oldest First)", value: "departureDate-asc" },
  { label: "Status (A-Z)", value: "status-asc" },
  { label: "Status (Z-A)", value: "status-desc" },
];

// Format status label for display
const formatStatusLabel = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1);
};

const statusOptions = computed(() => {
  return Object.entries(STATUS).map(([key, value]) => ({
    label: formatStatusLabel(value),
    value: value,
  }));
});

const timeFrameOptions = [
  { label: getTimeFrameLabel("all"), value: "all" },
  { label: getTimeFrameLabel("lastMonth"), value: "lastMonth" },
  { label: getTimeFrameLabel("lastYear"), value: "lastYear" },
  {
    label: getTimeFrameLabel("custom", bookingStore.customDateRange),
    value: "custom",
  },
];

// Event handlers
const handleFiltersChange = () => {
  // If custom is selected, show modal instead of immediate filter
  if (bookingStore.filters.timeFrame === "custom") {
    showCustomDateModal.value = true;
  } else {
    bookingStore.updateFiltersAndFetch(bookingStore.filters);
  }
};

const handleSortChange = (sortValue) => {
  const [field, order] = sortValue.split("-");
  bookingStore.updateSortAndFetch(field, order);
};

const resetAll = async () => {
  // Reset all values
  bookingStore.resetFiltersAndSort();
};

// Custom date modal handlers
const closeCustomDateModal = () => {
  showCustomDateModal.value = false;
  // If no custom range is set, revert to 'all'
  if (!bookingStore.customDateRange.from || !bookingStore.customDateRange.to) {
    bookingStore.filters.timeFrame = "all";
  }
};

const applyCustomDateRange = async (dateRange) => {
  await bookingStore.updateCustomDateRange(dateRange);
};
</script>

<style scoped>
.filter-sort-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-sort-group {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.filter-sort-group label {
  color: #333;
}
</style>
