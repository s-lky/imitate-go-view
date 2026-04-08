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
  let xAxisData: string[] = []
  let seriesData1: number[] = []
  let seriesData2: number[] = []
  
  if (props.dataConfig?.staticData) {
    try {
      const data = JSON.parse(props.dataConfig.staticData)
      if (Array.isArray(data) && data.length > 0) {
        xAxisData = data.map((item: any) => item[props.dataConfig.xField])
        seriesData1 = data.map((item: any) => item[props.dataConfig.yField])
        seriesData2 = data.map((item: any) => Math.floor(item[props.dataConfig.yField] * 0.6))
      }
    } catch (e) {
      console.error('解析静态数据失败:', e)
    }
  }
  
  const defaultX = ['周一', '周二', '周三', '周四', '周五']
  const defaultData1 = [320, 332, 301, 334, 390]
  const defaultData2 = [220, 182, 191, 234, 290]
  
  return {
    title: { 
      text: props.propValue.title, 
      textStyle: { color: '#fff', fontSize: 12 } 
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { 
      data: ['系列1', '系列2'],
      textStyle: { color: '#ccc', fontSize: 10 },
      top: 25
    },
    grid: { top: '50px', left: '10%', right: '10%', bottom: '20px', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData.length > 0 ? xAxisData : defaultX,
      axisLabel: { color: '#ccc', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc', fontSize: 10 }
    },
    series: [
      {
        name: '系列1',
        type: 'bar',
        stack: 'total',
        data: seriesData1.length > 0 ? seriesData1 : defaultData1,
        itemStyle: { color: '#00e5ff' }
      },
      {
        name: '系列2',
        type: 'bar',
        stack: 'total',
        data: seriesData2.length > 0 ? seriesData2 : defaultData2,
        itemStyle: { color: '#ff6b6b' }
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
