<template>
  <n-modal
    v-model:show="isVisible"
    preset="card"
    :title="title"
    :style="{ width: width }"
    :mask-closable="maskClosable"
    :closable="closable"
    @close="handleClose"
  >
    <!-- Slot for any content -->
    <slot></slot>

    <!-- Footer slot for buttons -->
    <template #footer v-if="showFooter">
      <slot name="footer">
        <!-- Default footer with cancel and confirm buttons -->
        <div class="modal-footer">
          <n-button @click="handleCancel" v-if="showCancelButton">
            {{ cancelText }}
          </n-button>
          <n-button
            type="primary"
            @click="handleConfirm"
            v-if="showConfirmButton"
            :loading="confirmLoading"
            :disabled="confirmDisabled"
          >
            {{ confirmText }}
          </n-button>
        </div>
      </slot>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, watch } from "vue";
import { NModal, NButton } from "naive-ui";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "600px",
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:show", "close", "confirm"]);

const isVisible = ref(props.show);

// Watch for prop changes
watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal;
  }
);

// Watch for internal changes and emit
watch(isVisible, (newVal) => {
  emit("update:show", newVal);
  if (!newVal) {
    emit("close");
  }
});

const handleClose = () => {
  isVisible.value = false;
};

const handleCancel = () => {
  handleClose();
};

const handleConfirm = () => {
  emit("confirm");
};
</script>

<style scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
