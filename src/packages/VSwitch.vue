<template>
  <div class="v-switch-wrapper" :style="wrapperStyle" @click="toggleSwitch">
    <div class="switch-track" :class="{ active: isChecked }">
      <div class="switch-thumb"></div>
    </div>
    <span class="switch-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const label = computed(() => props.dataConfig?.label || '开关')
const isChecked = computed(() => props.dataConfig?.checked || false)

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 120) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const toggleSwitch = () => {
  emit('update:dataConfig', {
    ...props.dataConfig,
    checked: !isChecked.value
  })
}
</script>

<style scoped>
.v-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.switch-track {
  width: 44px;
  height: 24px;
  background: #444;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
}

.switch-track.active {
  background: #00e5ff;
}

.switch-thumb {
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switch-track.active .switch-thumb {
  transform: translateX(20px);
}

.switch-label {
  color: #ccc;
  font-size: 14px;
}
</style>
