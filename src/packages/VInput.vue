<template>
  <div class="v-input-wrapper" :style="wrapperStyle">
    <input 
      class="v-input" 
      :placeholder="placeholder" 
      :value="displayValue"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const placeholder = computed(() => props.dataConfig?.placeholder || '请输入内容')
const displayValue = computed(() => {
  if (props.dataConfig?.type === 'static' && props.dataConfig.staticData) {
    return props.dataConfig.staticData
  }
  return ''
})

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 200) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:dataConfig', {
    ...props.dataConfig,
    staticData: target.value
  })
}
</script>

<style scoped>
.v-input-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.v-input-wrapper:hover {
  border-color: #00e5ff;
}

.v-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
}

.v-input::placeholder {
  color: #666;
}
</style>
