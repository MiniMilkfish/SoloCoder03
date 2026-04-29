<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      class="page-btn"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      ‹ 上一页
    </button>
    
    <div class="page-numbers">
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="page-ellipsis">...</span>
        <button 
          v-else
          class="page-btn"
          :class="{ 'active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>
    </div>
    
    <button 
      class="page-btn"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      下一页 ›
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['change'])

const visiblePages = computed(() => {
  const pages = []
  const current = props.currentPage
  const total = props.totalPages
  const showPages = 5
  
  if (total <= showPages + 2) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else if (current <= 3) {
    for (let i = 1; i <= showPages; i++) {
      pages.push(i)
    }
    pages.push('...')
    pages.push(total)
  } else if (current >= total - 2) {
    pages.push(1)
    pages.push('...')
    for (let i = total - showPages + 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    pages.push('...')
    for (let i = current - 1; i <= current + 1; i++) {
      pages.push(i)
    }
    pages.push('...')
    pages.push(total)
  }
  
  return pages
})

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 0;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-secondary);
  border-radius: var(--radius);
  font-size: 14px;
  transition: var(--transition);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-ellipsis {
  color: var(--text-light);
  padding: 0 8px;
}

@media (max-width: 768px) {
  .pagination {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .page-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 10px;
    font-size: 13px;
  }
}
</style>
