<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentDataConfig } from '../types/component'

// 1. 接收父组件传过来的属性
const props = defineProps<{
  propValue: {
    title: string;
    fontSize?: number;
    color?: string;
    textAlign?: string;
  }
  dataConfig?: ComponentDataConfig;
}>()
</script>

<template>
  <div 
    class="text-component"
    :style="{
      display: 'flex',
      alignItems: 'center',
      justifyContent: props.propValue.textAlign || 'center',
      height: '100%',
      width: '100%',
      padding: '10px'
    }"
  >
    <p 
      :style="{
        fontSize: (props.propValue.fontSize || 24) + 'px',
        color: props.propValue.color || '#fff',
        margin: 0,
        wordBreak: 'break-all',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }"
    >
      {{ props.propValue.title || '文本组件' }}
    </p>
  </div>
</template>

<style scoped>
.text-component {
  user-select: none;
}
</style>
