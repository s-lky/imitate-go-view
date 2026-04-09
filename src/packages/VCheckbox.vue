<template>
  <div class="v-checkbox-wrapper" :style="wrapperStyle">
    <div class="checkbox-label">{{ label }}</div>
    <div class="checkbox-options">
      <label 
        v-for="option in options" 
        :key="option.value" 
        class="checkbox-item"
      >
        <input 
          type="checkbox" 
          :value="option.value"
          :checked="checkedValues.includes(option.value)"
          @change="handleCheckboxChange(option.value, $event)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const label = computed(() => props.dataConfig?.label || '复选框')
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
const checkedValues = computed(() => props.dataConfig?.checked || [])

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 200) + 'px',
  height: (props.style?.height || 100) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleCheckboxChange = (value: string, event: Event) => {
  const target = event.target as HTMLInputElement
  let newValues = [...checkedValues.value]
  if (target.checked) {
    newValues.push(value)
  } else {
    newValues = newValues.filter(v => v !== value)
  }
  emit('update:dataConfig', {
    ...props.dataConfig,
    checked: newValues
  })
}
</script>

<style scoped>
.v-checkbox-wrapper {
  padding: 8px 12px;
  background: #1a1a1c;
  border-radius: 6px;
}

.checkbox-label {
  color: #ccc;
  font-size: 14px;
  margin-bottom: 8px;
}

.checkbox-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #00e5ff;
}
</style>
