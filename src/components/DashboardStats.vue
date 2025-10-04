<template>
  <!-- Stats and Actions Row -->
  <div class="dashboard-content">
    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-label">Total Bookings</span>
        <span class="stat-value">{{ bookingStore.pagination.total }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Confirmed Revenue</span>
        <span class="stat-value"
          >${{ bookingStore.totalRevenue.toFixed(2) }}</span
        >
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-section">
      <n-button @click="showCreateModal = true" type="primary" size="medium">
        + Create New Booking
      </n-button>
    </div>
  </div>

  <!-- Create Booking Modal -->
  <BookingModal
    :show="showCreateModal"
    :isEdit="false"
    @close="closeCreateModal"
    @create-booking="handleCreateBooking"
  />
</template>

<script setup>
import { ref } from "vue";
import { NButton } from "naive-ui";
import { useBookingStore } from "../stores/bookingStore.js";
import BookingModal from "./BookingModal.vue";

const bookingStore = useBookingStore();

// Create modal state
const showCreateModal = ref(false);

const handleCreateBooking = async (newBookingData) => {
  await bookingStore.createBooking(newBookingData);
  closeCreateModal();
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};
</script>

<style scoped>
.dashboard-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.stats-section {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
  width: 15rem;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  color: #111827;
  font-weight: 700;
}

.action-section {
  display: flex;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .stats-section {
    justify-content: space-around;
    gap: 20px;
  }

  .stat-item {
    text-align: center;
  }

  .action-section {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-section {
    flex-direction: column;
    gap: 16px;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>
