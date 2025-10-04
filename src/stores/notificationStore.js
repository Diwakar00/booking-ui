import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);

  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      show: true,
    };

    notifications.value.push(notification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
  };

  // Helper methods for different types
  const showSuccess = (message, duration = 3000) =>
    addNotification(message, "success", duration);
  const showError = (message, duration = 5000) =>
    addNotification(message, "error", duration);
  const showWarning = (message, duration = 4000) =>
    addNotification(message, "warning", duration);
  const showInfo = (message, duration = 3000) =>
    addNotification(message, "info", duration);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
});
