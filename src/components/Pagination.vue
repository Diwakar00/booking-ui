<template>
  <div class="pagination-container">
    <div class="pagination-info">
      <span>
        Showing {{ startItem }} to {{ endItem }} of {{ total }} results
      </span>
    </div>

    <div class="pagination-controls">
      <!-- Page size selector -->
      <div class="page-size-selector">
        <span>Show:</span>
        <n-select
          v-model:value="selectedPageSize"
          :options="pageSizeOptions"
          style="width: 80px"
          @update:value="handlePageSizeChange"
        />
        <span>entries</span>
      </div>

      <!-- Page navigation -->
      <div class="page-navigation">
        <n-button :disabled="page === 1" @click="goToPage(1)" size="small">
          First
        </n-button>

        <n-button
          :disabled="page === 1"
          @click="goToPage(page - 1)"
          size="small"
        >
          Previous
        </n-button>

        <!-- Page numbers -->
        <div class="page-numbers">
          <n-button
            v-for="pageNum in visiblePages"
            :key="pageNum"
            :type="pageNum === page ? 'primary' : 'default'"
            @click="goToPage(pageNum)"
            size="small"
            class="page-number"
          >
            {{ pageNum }}
          </n-button>
        </div>

        <n-button
          :disabled="page === totalPages"
          @click="goToPage(page + 1)"
          size="small"
        >
          Next
        </n-button>

        <n-button
          :disabled="page === totalPages"
          @click="goToPage(totalPages)"
          size="small"
        >
          Last
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, toRefs } from "vue";
import { NButton, NSelect } from "naive-ui";
import { useBookingStore } from "../stores/bookingStore.js";

const bookingStore = useBookingStore();

const { page, limit, total, totalPages } = toRefs(bookingStore.pagination);

// Page size options
const pageSizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
  { label: "40", value: 40 },
  { label: "50", value: 50 },
];

const selectedPageSize = ref(limit.value);

// Watch for store pagination changes
watch(limit, (newSize) => {
  selectedPageSize.value = newSize;
});

const startItem = computed(() => {
  return total.value === 0 ? 0 : (page.value - 1) * limit.value + 1;
});

const endItem = computed(() => {
  const end = page.value * limit.value;
  return end > total.value ? total.value : end;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const goToPage = async (pageNum) => {
  if (pageNum >= 1 && pageNum <= totalPages.value && pageNum !== page.value) {
    await bookingStore.updatePagination(pageNum);
  }
};

const handlePageSizeChange = async (newSize) => {
  selectedPageSize.value = newSize;
  await bookingStore.updatePagination(null, newSize);
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  min-width: 32px;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 16px;
  }

  .page-navigation {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
