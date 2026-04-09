<template>
  <div class="v-timepicker-wrapper" :style="wrapperStyle">
    <input 
      class="v-timepicker" 
      type="time"
      :value="selectedTime"
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

const selectedTime = computed(() => props.dataConfig?.selected || '')

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 150) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:dataConfig', {
    ...props.dataConfig,
    selected: target.value
  })
}
</script>

<style scoped>
.v-timepicker-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.v-timepicker-wrapper:hover {
  border-color: #00e5ff;
}

.v-timepicker {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.v-timepicker::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
