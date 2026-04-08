<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  propValue: {
    title: string
    fontSize?: number
    color?: string
    textAlign?: string
  }
}>()

const textRef = ref<HTMLElement | null>(null)
let animationId: number | null = null
let position = ref(100)

const animate = () => {
  if (textRef.value) {
    position.value -= 1
    if (position.value < -100) {
      position.value = 100
    }
    textRef.value.style.transform = `translateX(${position.value}%)`
  }
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div 
    class="text-scroll-container"
    :style="{
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    }"
  >
    <p 
      ref="textRef"
      class="scroll-text"
      :style="{
        fontSize: (props.propValue.fontSize || 20) + 'px',
        color: props.propValue.color || '#00e5ff',
        margin: 0,
        whiteSpace: 'nowrap',
        position: 'absolute',
        left: 0
      }"
    >
      {{ props.propValue.title || '弹幕文本' }}
    </p>
  </div>
</template>

<style scoped>
.text-scroll-container {
  user-select: none;
  position: relative;
}

.scroll-text {
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}
</style>
