<template>
  <div class="v-button-wrapper" :style="wrapperStyle">
    <button 
      class="v-button" 
      :class="[buttonType, buttonSize]"
      @click="handleClick"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const buttonText = computed(() => props.dataConfig?.text || '按钮')
const buttonType = computed(() => props.dataConfig?.type || 'primary')
const buttonSize = computed(() => props.dataConfig?.size || 'medium')

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 120) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const emit = defineEmits(['click', 'update:dataConfig'])

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.v-button-wrapper {
  cursor: pointer;
}

.v-button {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

/* 按钮类型 */
.v-button.primary {
  background: #00e5ff;
  color: #000;
}

.v-button.primary:hover {
  background: #00c4e0;
}

.v-button.secondary {
  background: #333;
  color: #fff;
  border: 1px solid #555;
}

.v-button.secondary:hover {
  background: #444;
}

.v-button.danger {
  background: #ff4d4f;
  color: #fff;
}

.v-button.danger:hover {
  background: #ff7875;
}

/* 按钮尺寸 */
.v-button.small {
  font-size: 12px;
}

.v-button.medium {
  font-size: 14px;
}

.v-button.large {
  font-size: 16px;
}
</style>
