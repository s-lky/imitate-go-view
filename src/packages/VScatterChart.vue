<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, markRaw } from 'vue'
import * as echarts from 'echarts'
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
  let seriesData: any[] = []
  
  if (props.dataConfig?.staticData) {
    try {
      const data = JSON.parse(props.dataConfig.staticData)
      if (Array.isArray(data)) {
        seriesData = data.map((item: any) => [
          item[props.dataConfig.xField],
          item[props.dataConfig.yField]
        ])
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
    grid: {
      top: '40px',
      left: '10%',
      right: '10%',
      bottom: '20px',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      splitLine: {
        lineStyle: { color: '#333' }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      splitLine: {
        lineStyle: { color: '#333' }
      }
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 10,
        data: seriesData.length > 0 ? seriesData : [
          [10.0, 8.04], [8.07, 6.95], [13.0, 7.58], [9.05, 8.81],
          [11.0, 8.33], [14.0, 9.96], [13.4, 7.24], [10.0, 6.26],
          [14.0, 8.84], [12.5, 6.95], [9.15, 7.22], [11.5, 7.20]
        ],
        itemStyle: {
          color: '#00e5ff'
        }
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
