<template>
  <BaseModal
    :show="show"
    title="Select Custom Date Range"
    width="500px"
    :confirm-disabled="false"
    confirm-text="Apply"
    @close="emit('close')"
    @confirm="handleConfirm"
  >
    <div class="date-content">
      <div class="date-row">
        <div class="date-group">
          <label for="fromDate">From Date:</label>
          <n-date-picker
            v-model:value="localFromDate"
            type="date"
            placeholder="Select from date"
            style="width: 100%"
          />
        </div>

        <div class="date-group">
          <label for="toDate">To Date:</label>
          <n-date-picker
            v-model:value="localToDate"
            type="date"
            placeholder="Select to date"
            :is-date-disabled="(date) => localFromDate && date < localFromDate"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="validation-message" v-if="validationError">
        {{ validationError }}
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { NDatePicker } from "naive-ui";
import format from "date-fns/format";
import BaseModal from "./BaseModal.vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  initialFromDate: {
    type: String,
    default: "",
  },
  initialToDate: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "apply"]);

// Convert string dates to timestamp for n-date-picker
const localFromDate = ref(
  props.initialFromDate ? new Date(props.initialFromDate).getTime() : null
);
const localToDate = ref(
  props.initialToDate ? new Date(props.initialToDate).getTime() : null
);

// Validation
const validationError = ref("");

const validateDates = () => {
  if (!localFromDate.value && !localToDate.value) {
    validationError.value = "Both from and to dates are required";
    return false;
  }

  if (!localFromDate.value) {
    validationError.value = "from dates is required";
    return false;
  }

  if (!localToDate.value) {
    validationError.value = "To date is required";
    return false;
  }

  if (localFromDate.value > localToDate.value) {
    validationError.value = "From date must be before or equal to to date";
    return false;
  }

  validationError.value = "";
  return true;
};

const handleConfirm = () => {
  if (validateDates()) {
    emit("apply", {
      from: format(new Date(localFromDate.value), "yyyy-MM-dd"),
      to: format(new Date(localToDate.value), "yyyy-MM-dd"),
    });
  }
};

// Reset form when modal opens
watch(
  () => props.show,
  (isShowing) => {
    if (isShowing) {
      localFromDate.value = null;
      localToDate.value = null;
      validationError.value = "";
    }
  }
);
</script>

<style scoped>
.date-content {
  padding: 16px 0;
}

.date-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.date-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.validation-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
}

@media (max-width: 640px) {
  .date-row {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
