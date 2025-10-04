<template>
  <BaseModal
    :show="show"
    title="Cancel Booking"
    width="450px"
    confirm-text="Confirm Cancel"
    cancel-text="Cancel"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <div class="cancel-content">
      <p>
        Are you sure you want to cancel booking
        <strong>{{ booking?.bookingId }}</strong
        >?
      </p>

      <div class="form-group">
        <label>Refund Amount ($):</label>
        <n-input-number
          v-model:value="refundAmount"
          :min="0"
          style="width: 100%"
          placeholder="Enter refund amount"
          :status="hasError ? 'error' : undefined"
        />
        <small>Maximum: ${{ booking?.value || 0 }}</small>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from "vue";
import { NInputNumber } from "naive-ui";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: Boolean,
  booking: Object,
});

const emit = defineEmits(["close", "cancel"]);

const refundAmount = ref(0);
const hasError = ref(false);

watch(
  () => props.show,
  (newShow) => {
    if (!newShow) {
      hasError.value = false; // Reset error when modal closes
    }
  }
);

const handleConfirm = () => {
  // Validate on confirm click
  if (refundAmount.value > (props.booking?.value || 0)) {
    hasError.value = true;
    return; // Don't proceed if validation fails
  }

  hasError.value = false;

  emit("cancel", {
    bookingId: props.booking?.bookingId,
    refundAmount: refundAmount.value || 0,
  });
};

const handleClose = () => {
  emit("close");
};
</script>

<style scoped>
.cancel-content {
  padding: 20px 0;
}

.form-group {
  margin-top: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 12px;
}
</style>
