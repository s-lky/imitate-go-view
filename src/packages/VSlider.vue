<template>
  <div class="v-slider-wrapper" :style="wrapperStyle">
    <div class="slider-header">
      <span class="slider-label">{{ label }}</span>
      <span class="slider-value">{{ currentValue }}</span>
    </div>
    <input 
      class="v-slider" 
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="currentValue"
      @input="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const label = computed(() => props.dataConfig?.label || '滑动条')
const min = computed(() => props.dataConfig?.min || 0)
const max = computed(() => props.dataConfig?.max || 100)
const step = computed(() => props.dataConfig?.step || 1)
const currentValue = computed(() => {
  if (props.dataConfig?.value !== undefined) {
    return props.dataConfig.value
  }
  return Math.round((min.value + max.value) / 2)
})

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 250) + 'px',
  height: (props.style?.height || 60) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:dataConfig', {
    ...props.dataConfig,
    value: Number(target.value)
  })
}
</script>

<style scoped>
.v-slider-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 12px;
  background: #1a1a1c;
  border-radius: 6px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.slider-label {
  color: #ccc;
  font-size: 14px;
}

.slider-value {
  color: #00e5ff;
  font-size: 14px;
  font-weight: bold;
}

.v-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(90deg, #00e5ff 0%, #00e5ff var(--value-percent, 50%), #444 var(--value-percent, 50%), #444 100%);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.v-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #00e5ff;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.v-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.v-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #00e5ff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
