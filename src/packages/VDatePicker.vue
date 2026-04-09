<template>
  <div class="v-datepicker-wrapper" :style="wrapperStyle">
    <input 
      class="v-datepicker" 
      type="date"
      :value="selectedDate"
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

const selectedDate = computed(() => props.dataConfig?.selected || '')

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 200) + 'px',
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
.v-datepicker-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.v-datepicker-wrapper:hover {
  border-color: #00e5ff;
}

.v-datepicker {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.v-datepicker::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
