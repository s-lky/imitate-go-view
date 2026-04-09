<template>
  <div class="v-select-wrapper" :style="wrapperStyle">
    <select 
      class="v-select" 
      :value="selectedValue"
      @change="handleChange"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const placeholder = computed(() => props.dataConfig?.placeholder || '请选择')
const options = computed(() => {
  if (props.dataConfig?.options && Array.isArray(props.dataConfig.options)) {
    return props.dataConfig.options
  }
  return [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
  ]
})
const selectedValue = computed(() => props.dataConfig?.selected || '')

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 200) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  emit('update:dataConfig', {
    ...props.dataConfig,
    selected: target.value
  })
}
</script>

<style scoped>
.v-select-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.v-select-wrapper:hover {
  border-color: #00e5ff;
}

.v-select {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.v-select option {
  background: #1a1a1c;
  color: #fff;
}
</style>
