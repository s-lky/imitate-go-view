<template>
  <div class="v-radio-wrapper" :style="wrapperStyle">
    <div class="radio-label">{{ label }}</div>
    <div class="radio-options">
      <label 
        v-for="option in options" 
        :key="option.value" 
        class="radio-item"
      >
        <input 
          type="radio" 
          :value="option.value"
          :checked="selectedValue === option.value"
          @change="handleRadioChange(option.value)"
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

const label = computed(() => props.dataConfig?.label || '单选按钮组')
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
  height: (props.style?.height || 100) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleRadioChange = (value: string) => {
  emit('update:dataConfig', {
    ...props.dataConfig,
    selected: value
  })
}
</script>

<style scoped>
.v-radio-wrapper {
  padding: 8px 12px;
  background: #1a1a1c;
  border-radius: 6px;
}

.radio-label {
  color: #ccc;
  font-size: 14px;
  margin-bottom: 8px;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.radio-item input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #00e5ff;
}
</style>
