<template>
  <div class="v-progress-wrapper" :style="wrapperStyle">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
    <span class="progress-text" v-if="showText">{{ progressPercent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const progressPercent = computed(() => {
  if (props.dataConfig?.percent !== undefined) {
    return Math.min(100, Math.max(0, props.dataConfig.percent))
  }
  return 60
})
const showText = computed(() => props.dataConfig?.showText !== false)

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 250) + 'px',
  height: (props.style?.height || 30) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}))
</script>

<style scoped>
.v-progress-wrapper {
  background: transparent;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00e5ff 0%, #0066ff 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #00e5ff;
  font-size: 14px;
  font-weight: bold;
  min-width: 40px;
  text-align: right;
}
</style>
