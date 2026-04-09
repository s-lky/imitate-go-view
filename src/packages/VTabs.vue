<template>
  <div class="v-tabs-wrapper" :style="wrapperStyle">
    <div class="tabs-header">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @click="handleTabClick(index)"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  style?: Record<string, any>
  dataConfig?: any
}>()

const tabs = computed(() => {
  if (props.dataConfig?.tabs && Array.isArray(props.dataConfig.tabs)) {
    return props.dataConfig.tabs
  }
  return [
    { label: '标签1', key: 'tab1' },
    { label: '标签2', key: 'tab2' },
    { label: '标签3', key: 'tab3' }
  ]
})
const activeTab = computed(() => props.dataConfig?.active || 0)

const wrapperStyle = computed(() => ({
  width: (props.style?.width || 300) + 'px',
  height: (props.style?.height || 40) + 'px',
  position: 'absolute',
  top: props.style?.top + 'px',
  left: props.style?.left + 'px',
}))

const emit = defineEmits(['update:dataConfig'])

const handleTabClick = (index: number) => {
  emit('update:dataConfig', {
    ...props.dataConfig,
    active: index
  })
}
</script>

<style scoped>
.v-tabs-wrapper {
  background: #1a1a1c;
  border-radius: 6px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  height: 100%;
  border-bottom: 2px solid #333;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab-item:hover {
  color: #ccc;
}

.tab-item.active {
  color: #00e5ff;
  border-bottom-color: #00e5ff;
}
</style>
