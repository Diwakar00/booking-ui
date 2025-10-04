<template>
  <div class="notification-container">
    <Notification
      v-for="notification in notificationStore.notifications"
      :key="notification.id"
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="notificationStore.removeNotification(notification.id)"
    />
  </div>
</template>

<script setup>
import { useNotificationStore } from "../stores/notificationStore.ts";
import Notification from "./Notification.vue";

const notificationStore = useNotificationStore();
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.notification-container > * {
  pointer-events: auto;
  margin-bottom: 10px;
}
</style>
