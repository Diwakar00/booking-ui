<template>
  <div class="table-section">
    <n-data-table
      :columns="columns"
      :data="bookings"
      :loading="loading"
      striped
      :scroll-x="1200"
      size="small"
    />
    <Pagination />
    <CancelBookingModal
      :show="showCancelModal"
      :booking="selectedBooking"
      @close="closeCancelModal"
      @cancel="handleCancelConfirm"
    />

    <!-- Edit Booking Modal -->
    <BookingModal
      :show="showEditModal"
      :booking="selectedEditBooking"
      :isEdit="true"
      @close="closeEditModal"
      @update-booking="handleEditSave"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      title="Confirm Delete"
      width="400px"
      confirm-text="Delete"
      cancel-text="Cancel"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    >
      <p>Are you sure you want to delete this booking?</p>
      <p><strong>Booking ID:</strong> {{ selectedDeleteBooking?.bookingId }}</p>
      <p><strong>Customer Name:</strong> {{ selectedDeleteBooking?.name }}</p>
      <p style="color: #e74c3c; font-weight: 500; margin-top: 16px">
        This action cannot be undone.
      </p>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, h, toRefs, ref } from "vue";
import { NDataTable, NButton, NTag } from "naive-ui";
import { format } from "date-fns";
import { useBookingStore } from "../stores/bookingStore.js";
import Pagination from "./Pagination.vue";
import CancelBookingModal from "./CancelBookingModal.vue";
import BookingModal from "./BookingModal.vue";
import BaseModal from "./BaseModal.vue";
import { STATUS } from "../constants/index.js";

const bookingStore = useBookingStore();

const { bookings, loading } = toRefs(bookingStore);

// Cancel modal state
const showCancelModal = ref(false);
const selectedBooking = ref(null);

// Edit modal state
const showEditModal = ref(false);
const selectedEditBooking = ref(null);

// Delete modal state
const showDeleteModal = ref(false);
const selectedDeleteBooking = ref(null);

const handleCancel = (booking) => {
  selectedBooking.value = booking;
  showCancelModal.value = true;
};

const handleCancelConfirm = async (cancelData) => {
  await bookingStore.cancelBooking(
    cancelData.bookingId,
    cancelData.refundAmount
  );
  closeCancelModal();
};

const closeCancelModal = () => {
  showCancelModal.value = false;
  selectedBooking.value = null;
};

const handleEdit = (booking) => {
  selectedEditBooking.value = booking;
  showEditModal.value = true;
};

const handleEditSave = async (editData) => {
  await bookingStore.updateBooking(
    selectedEditBooking.value.bookingId,
    editData
  );
  closeEditModal();
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedEditBooking.value = null;
};

const handleDelete = (booking) => {
  selectedDeleteBooking.value = booking;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (selectedDeleteBooking.value) {
    await bookingStore.deleteBooking(selectedDeleteBooking.value.bookingId);
    closeDeleteModal();
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedDeleteBooking.value = null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "dd/MM/yyyy");
  } catch (error) {
    return "-";
  }
};

const getStatusType = (status) => {
  const statusMap = {
    confirmed: "success",
    completed: "default",
    cancelled: "error",
  };
  return statusMap[status] || "default";
};

const columns = computed(() => [
  {
    title: "Booking ID",
    key: "bookingId",
    width: 150,
    ellipsis: {
      tooltip: true,
    },
    render: (row) => row.bookingId,
  },
  {
    title: "Customer Name",
    key: "name",
    width: 150,
    render: (row) => row.name || "N/A",
  },
  {
    title: "Booking Date",
    key: "bookingDate",
    width: 120,
    render: (row) => formatDate(row.bookingDate),
  },
  {
    title: "Price",
    key: "value",
    width: 100,
    render: (row) => `$${row.value.toFixed(2)}`,
  },
  {
    title: "Arrival",
    key: "arrivalDate",
    width: 120,
    render: (row) => formatDate(row.arrivalDate),
  },
  {
    title: "Departure",
    key: "departureDate",
    width: 120,
    render: (row) => formatDate(row.departureDate),
  },
  {
    title: "Status",
    key: "status",
    width: 100,
    render: (row) => {
      return h(
        NTag,
        {
          type: getStatusType(row.status),
        },
        {
          default: () =>
            row.status?.[0]?.toUpperCase() + row.status?.slice(1) || "N/A",
        }
      );
    },
  },
  {
    title: "Cancelled Date",
    key: "cancelledDate",
    width: 130,
    render: (row) => (row.cancelledDate ? formatDate(row.cancelledDate) : "-"),
  },
  {
    title: "Refund",
    key: "refundValue",
    width: 100,
    render: (row) =>
      row.refundValue > 0 ? `$${row.refundValue.toFixed(2)}` : "-",
  },
  {
    title: "Actions",
    key: "actions",
    width: 200,
    fixed: "right",
    render: (row) => {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "info",
            style: { marginRight: "8px" },
            disabled:
              row.status === STATUS.CANCELLED ||
              row.status === STATUS.COMPLETED,
            onClick: () => handleEdit(row),
          },
          { default: () => "Edit" }
        ),

        h(
          NButton,
          {
            size: "small",
            type: "warning",
            style: { marginRight: "8px" },
            disabled:
              row.status === STATUS.CANCELLED ||
              row.status === STATUS.COMPLETED,
            onClick: () => handleCancel(row),
          },
          { default: () => "Cancel" }
        ),

        h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => handleDelete(row),
          },
          { default: () => "Delete" }
        ),
      ];
    },
  },
]);
</script>

<style scoped>
.table-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>
