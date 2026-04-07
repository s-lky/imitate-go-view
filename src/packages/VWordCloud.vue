<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, markRaw } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { useResizeObserver } from '@vueuse/core'
import type { ComponentDataConfig } from '../types/component'

const props = defineProps<{
  propValue: {
    title: string;
  }
  dataConfig?: ComponentDataConfig;
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const getOption = () => {
  let wordCloudData: any[] = []
  
  if (props.dataConfig?.staticData) {
    try {
      const data = JSON.parse(props.dataConfig.staticData)
      if (Array.isArray(data)) {
        wordCloudData = data.map((item: any) => ({
          name: item[props.dataConfig.xField],
          value: item[props.dataConfig.yField]
        }))
      }
    } catch (e) {
      console.error('解析静态数据失败:', e)
    }
  }
  
  return {
    title: { 
      text: props.propValue.title, 
      textStyle: { color: '#fff' } 
    },
    tooltip: {},
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      right: null,
      bottom: null,
      sizeRange: [12, 60],
      rotationRange: [-45, 45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function() {
          return 'rgb(' + [
            Math.round(Math.random() * 160 + 40),
            Math.round(Math.random() * 160 + 40),
            Math.round(Math.random() * 160 + 40)
          ].join(',') + ')';
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: wordCloudData.length > 0 ? wordCloudData : [
        { name: '低代码', value: 100 },
        { name: '可视化', value: 80 },
        { name: '大屏', value: 70 },
        { name: '数据', value: 60 },
        { name: '图表', value: 50 },
        { name: '组件', value: 45 },
        { name: '拖拽', value: 40 },
        { name: '配置', value: 35 },
        { name: 'ECharts', value: 30 },
        { name: 'Vue3', value: 25 }
      ]
    }]
  }
}

onMounted(async () => {
  await nextTick()
  if (chartRef.value) {
    chartInstance = markRaw(echarts.init(chartRef.value))
    chartInstance.setOption(getOption())
  }
})

useResizeObserver(chartRef, () => {
  if (chartInstance) chartInstance.resize()
})

watch(() => props.propValue, () => {
  if (chartInstance) chartInstance.setOption(getOption())
}, { deep: true })

watch(() => props.dataConfig, () => {
  if (chartInstance) chartInstance.setOption(getOption())
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 100%;"></div>
</template>
