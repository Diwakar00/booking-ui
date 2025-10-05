<template>
  <BaseModal
    :show="show"
    :title="isEdit ? 'Edit Booking' : 'Create New Booking'"
    width="600px"
    :confirm-text="isEdit ? 'Update Booking' : 'Create Booking'"
    cancel-text="Cancel"
    @close="emit('close')"
    @confirm="handleSubmit"
  >
    <div class="booking-form">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right-hanging"
      >
        <div class="form-row">
          <div class="form-group">
            <n-form-item label="Customer Name" path="name">
              <n-input
                v-model:value="formData.name"
                placeholder="Enter customer name"
                id="booking-customer-name"
              />
            </n-form-item>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <n-form-item label="Arrival Date" path="arrivalDate">
              <n-date-picker
                v-model:value="formData.arrivalDate"
                type="date"
                placeholder="Select arrival date"
                :is-date-disabled="(ts) => ts < Date.now() - 86400000"
                format="yyyy-MM-dd"
                style="width: 100%"
                id="booking-arrival-date"
              />
            </n-form-item>
          </div>
          <div class="form-group">
            <n-form-item label="Departure Date" path="departureDate">
              <n-date-picker
                v-model:value="formData.departureDate"
                type="date"
                placeholder="Select departure date"
                :is-date-disabled="
                  (ts) => !formData.arrivalDate || ts <= formData.arrivalDate
                "
                format="yyyy-MM-dd"
                :disabled="!formData.arrivalDate"
                style="width: 100%"
                id="booking-departure-date"
              />
            </n-form-item>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <n-form-item label="Price ($)" path="value">
              <n-input-number
                v-model:value="formData.value"
                :min="1"
                :precision="0"
                placeholder="Enter price"
                style="width: 100%"
                id="booking-price"
              />
            </n-form-item>
          </div>
        </div>
      </n-form>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, computed, watch, ref } from "vue";
import { NInput, NInputNumber, NDatePicker, NForm, NFormItem } from "naive-ui";
import BaseModal from "./BaseModal.vue";
import format from "date-fns/format";

const props = defineProps({
  show: Boolean,
  booking: Object,
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "create-booking", "update-booking"]);

const initialFormData = {
  name: "",
  value: null,
  arrivalDate: null,
  departureDate: null,
};

const formData = reactive({ ...initialFormData });
const formRef = ref(null);

const rules = {
  name: {
    required: true,
    message: "Customer name is required",
  },
  arrivalDate: {
    required: true,
    message: "Arrival date is required",
    validator: (rule, value) => {
      if (!value) {
        return new Error("Arrival date is required");
      }
      return true;
    },
  },
  departureDate: [
    {
      required: true,
      message: "Departure date is required",
      validator: (rule, value) => {
        if (!value) {
          return new Error("Departure date is required");
        }
        return true;
      },
    },
    {
      validator: (rule, value) => {
        if (value && formData.arrivalDate && value <= formData.arrivalDate) {
          return new Error("Departure date must be after arrival date");
        }
        return true;
      },
    },
  ],
  value: [
    {
      required: true,
      message: "Price is required",
      validator: (rule, value) => {
        if (!value && value !== 0) {
          return new Error("Price is required");
        }
        return true;
      },
    },
    {
      validator: (rule, value) => {
        if (value !== null && value !== undefined && value <= 0) {
          return new Error("Price must be greater than 0");
        }
        return true;
      },
    },
  ],
};

watch(
  () => props.booking,
  (newBooking) => {
    if (newBooking && props.isEdit) {
      formData.name = newBooking.name || "";
      formData.value = newBooking.value || null;
      formData.arrivalDate = newBooking.arrivalDate
        ? new Date(newBooking.arrivalDate).getTime()
        : null;
      formData.departureDate = newBooking.departureDate
        ? new Date(newBooking.departureDate).getTime()
        : null;
    }
  },
  { immediate: true }
);

watch(
  () => formData.arrivalDate,
  (newArrivalDate) => {
    if (newArrivalDate && formData.departureDate) {
      if (formData.departureDate <= newArrivalDate) {
        formData.departureDate = null;
      }
    }
  }
);

watch(
  () => props.show,
  (newShow) => {
    if (!newShow) {
      resetForm();
    }
  }
);

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    const bookingData = {
      name: formData.name,
      value: formData.value,
      arrivalDate: format(new Date(formData.arrivalDate), "yyyy-MM-dd"),
      departureDate: format(new Date(formData.departureDate), "yyyy-MM-dd"),
    };

    if (props.isEdit) {
      emit("update-booking", bookingData);
    } else {
      emit("create-booking", bookingData);
    }

    emit("close");
  } catch (error) {}
};

const resetForm = () => {
  Object.assign(formData, initialFormData);
  formRef.value?.restoreValidation();
};
</script>

<style scoped>
.booking-form {
  padding: 20px 0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #e74c3c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
