<template>
  <div class="v-textarea-wrapper" :style="wrapperStyle">
    <textarea 
      class="v-textarea" 
      :placeholder="placeholder" 
      :value="displayValue"
      :rows="rows"
      @input="handleInput"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const placeholder = computed(() => props.dataConfig?.placeholder || '请输入内容')
const rows = computed(() => props.dataConfig?.rows || 4)
const displayValue = computed(() => {
  if (props.dataConfig?.type === 'static' && props.dataConfig.staticData) {
    return props.dataConfig.staticData
  }
  return ''
})

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 250) + 'px',
  height: (props.style?.height || 120) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:dataConfig', {
    ...props.dataConfig,
    staticData: target.value
  })
}
</script>

<style scoped>
.v-textarea-wrapper {
  padding: 8px 12px;
  background: #1a1a1c;
  border: 1px solid #444;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.v-textarea-wrapper:hover {
  border-color: #00e5ff;
}

.v-textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  resize: none;
}

.v-textarea::placeholder {
  color: #666;
}
</style>
