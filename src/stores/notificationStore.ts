import { defineStore } from "pinia";
import { ref } from "vue";
import type { INotification, NotificationType } from "../types";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<INotification[]>([]);

  const addNotification = (
    message: string,
    type: NotificationType = "info",
    duration: number = 5000
  ) => {
    const id = Date.now() + Math.random();
    const notification: INotification = {
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

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
  };

  // Helper methods for different types
  const showSuccess = (message: string, duration: number = 3000) =>
    addNotification(message, "success", duration);
  const showError = (message: string, duration: number = 5000) =>
    addNotification(message, "error", duration);
  const showWarning = (message: string, duration: number = 4000) =>
    addNotification(message, "warning", duration);
  const showInfo = (message: string, duration: number = 3000) =>
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
