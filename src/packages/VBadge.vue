<template>
  <div class="v-badge-wrapper" :style="wrapperStyle">
    <div class="badge-content">
      <span class="badge-text">{{ badgeText }}</span>
      <span v-if="showDot" class="badge-dot"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const badgeText = computed(() => {
  if (props.dataConfig?.type === 'static' && props.dataConfig.staticData) {
    return props.dataConfig.staticData
  }
  return '99+'
})
const showDot = computed(() => props.dataConfig?.showDot || false)

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 60) + 'px',
  height: (props.style?.height || 30) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))
</script>

<style scoped>
.v-badge-wrapper {
  background: transparent;
}

.badge-content {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.badge-text {
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  border: 2px solid #1a1a1c;
}
</style>
