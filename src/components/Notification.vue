<template>
  <div
    v-if="show"
    :class="['notification', `notification--${type}`]"
    @click="close"
  >
    <div class="notification__content">
      <span class="notification__icon">
        <span v-if="type === 'error'">❌</span>
        <span v-else-if="type === 'success'">✅</span>
        <span v-else-if="type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
      </span>
      <span class="notification__message">{{ message }}</span>
      <button class="notification__close" @click="close">&times;</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "info",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 300px;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
  cursor: pointer;
}

.notification__content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid;
}

.notification--success .notification__content {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.notification--error .notification__content {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.notification--warning .notification__content {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.notification--info .notification__content {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.notification__icon {
  margin-right: 8px;
  font-size: 16px;
}

.notification__message {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.notification__close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  margin-left: 8px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification__close:hover {
  color: #374151;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
