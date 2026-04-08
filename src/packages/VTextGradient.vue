<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  propValue: {
    title: string
    fontSize?: number
    color?: string
    textAlign?: string
  }
}>()
</script>

<template>
  <div 
    class="text-gradient"
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
      class="gradient-text"
      :style="{
        fontSize: (props.propValue.fontSize || 28) + 'px',
        margin: 0,
        wordBreak: 'break-all',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 'bold'
      }"
    >
      {{ props.propValue.title || '渐变文本' }}
    </p>
  </div>
</template>

<style scoped>
.text-gradient {
  user-select: none;
}

.gradient-text {
  background: linear-gradient(135deg, #00e5ff 0%, #0066ff 50%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
