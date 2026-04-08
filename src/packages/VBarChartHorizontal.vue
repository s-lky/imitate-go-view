<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, markRaw } from 'vue'
import * as echarts from 'echarts'
import { useResizeObserver } from '@vueuse/core'
import type { ComponentDataConfig } from '../types/component'

const props = defineProps<{
  propValue: { title: string }
  dataConfig?: ComponentDataConfig
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const getOption = () => {
  let yAxisData: string[] = []
  let seriesData: number[] = []
  
  if (props.dataConfig?.staticData) {
    try {
      const data = JSON.parse(props.dataConfig.staticData)
      if (Array.isArray(data)) {
        yAxisData = data.map((item: any) => item[props.dataConfig.xField])
        seriesData = data.map((item: any) => item[props.dataConfig.yField])
      }
    } catch (e) {
      console.error('解析静态数据失败:', e)
    }
  }
  
  return {
    title: { 
      text: props.propValue.title, 
      textStyle: { color: '#fff', fontSize: 12 } 
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: '30px', left: '15%', right: '10%', bottom: '20px', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#ccc', fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: yAxisData.length > 0 ? yAxisData : ['苹果', '香蕉', '橙子', '葡萄', '西瓜'],
      axisLabel: { color: '#ccc', fontSize: 10 }
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: seriesData.length > 0 ? seriesData : [120, 200, 150, 80, 70],
        itemStyle: { color: '#00e5ff', borderRadius: [0, 4, 4, 0] }
      }
    ]
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
  if (chartInstance) {
    chartInstance.resize()
  }
})

watch(() => props.propValue, () => {
  if (chartInstance) {
    chartInstance.setOption(getOption())
  }
}, { deep: true })

watch(() => props.dataConfig, () => {
  if (chartInstance) {
    chartInstance.setOption(getOption())
  }
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
