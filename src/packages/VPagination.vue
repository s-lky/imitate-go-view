<template>
  <div class="v-pagination-wrapper" :style="wrapperStyle">
    <button 
      class="page-btn" 
      :disabled="currentPage <= 1"
      @click="handlePrev"
    >
      ‹
    </button>
    
    <div class="page-numbers">
      <span 
        v-for="page in displayPages" 
        :key="page"
        class="page-number"
        :class="{ active: currentPage === page }"
        @click="handlePageClick(page)"
      >
        {{ page }}
      </span>
    </div>
    
    <button 
      class="page-btn" 
      :disabled="currentPage >= totalPages"
      @click="handleNext"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const totalPages = computed(() => props.dataConfig?.total || 10)
const currentPage = computed(() => props.dataConfig?.current || 1)

const displayPages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 300) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}))

const emit = defineEmits(['update:dataConfig'])

const handlePrev = () => {
  if (currentPage.value > 1) {
    emit('update:dataConfig', {
      ...props.dataConfig,
      current: currentPage.value - 1
    })
  }
}

const handleNext = () => {
  if (currentPage.value < totalPages.value) {
    emit('update:dataConfig', {
      ...props.dataConfig,
      current: currentPage.value + 1
    })
  }
}

const handlePageClick = (page: number) => {
  emit('update:dataConfig', {
    ...props.dataConfig,
    current: page
  })
}
</script>

<style scoped>
.v-pagination-wrapper {
  background: transparent;
  justify-content: center;
}

.page-btn {
  width: 32px;
  height: 32px;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #00e5ff;
  color: #00e5ff;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  border-color: #00e5ff;
  color: #00e5ff;
}

.page-number.active {
  background: #00e5ff;
  border-color: #00e5ff;
  color: #000;
  font-weight: bold;
}
</style>
