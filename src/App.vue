<template>
  <div class="booking-app">
    <NotificationContainer />
    <h1>Hotel Booking Management System</h1>
    <DashboardStats />
    <FilterAndSortPanel />
    <DataTable />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useBookingStore } from "./stores/bookingStore.js";
import FilterAndSortPanel from "./components/FilterAndSortPanel.vue";
import DataTable from "./components/DataTable.vue";
import NotificationContainer from "./components/NotificationContainer.vue";
import DashboardStats from "./components/DashboardStats.vue";

// Store
const bookingStore = useBookingStore();

// Load bookings on component mount
onMounted(async () => {
  await bookingStore.fetchBookings();
});
</script>

<style scoped>
.booking-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}
</style>

<style scoped>
.booking-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.app-controls {
  text-align: center;
  margin-bottom: 20px;
}

.toggle-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.toggle-btn:hover {
  background: #2980b9;
}

.form-section,
.filters-section,
.table-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.booking-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions,
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.btn-primary {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #219a52;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.filter-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bookings-table th {
  background: #34495e;
  color: white;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

.bookings-table th:hover {
  background: #2c3e50;
}

.bookings-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.bookings-table tbody tr:hover {
  background: #f8f9fa;
}

.actions {
  display: flex;
  gap: 5px;
}

.btn-edit {
  background: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-cancel {
  background: #f39c12;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-cancel:hover {
  background: #e67e22;
}

.btn-cancel:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete:hover {
  background: #c0392b;
}

.status-confirmed {
  color: #27ae60;
  font-weight: 600;
}

.status-completed {
  color: #95a5a6;
  font-weight: 600;
}

.status-cancelled {
  color: #e74c3c;
  font-weight: 600;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal small {
  color: #7f8c8d;
  font-size: 12px;
}

@media (max-width: 768px) {
  .form-row,
  .filter-row {
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }

  .bookings-table {
    font-size: 14px;
  }

  .bookings-table th,
  .bookings-table td {
    padding: 8px;
  }
}
</style>
