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
  let xAxisData: string[] = []
  let seriesData: any[] = []
  
  if (props.dataConfig?.staticData) {
    try {
      const data = JSON.parse(props.dataConfig.staticData)
      if (Array.isArray(data)) {
        xAxisData = ['产品A', '产品B', '产品C', '产品D']
        const categories = data.map((item: any) => item[props.dataConfig.xField])
        seriesData = data.map((item: any, index: number) => [
          index % 4,
          Math.floor(index / 4),
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
    tooltip: {
      position: 'top'
    },
    grid: {
      top: '40px',
      left: '15%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: xAxisData.length > 0 ? xAxisData : ['周一', '周二', '周三', '周四', '周五'],
      axisLabel: { color: '#ccc' },
      splitArea: {
        areaStyle: { color: '#0f1011' }
      }
    },
    yAxis: {
      type: 'category',
      data: ['产品A', '产品B', '产品C', '产品D'],
      axisLabel: { color: '#ccc' },
      splitArea: {
        areaStyle: { color: '#0f1011' }
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: { color: '#ccc' },
      inRange: {
        color: ['#0f1011', '#00e5ff']
      }
    },
    series: [
      {
        type: 'heatmap',
        data: seriesData.length > 0 ? seriesData : [
          [0, 0, 10], [0, 1, 20], [0, 2, 30], [0, 3, 40],
          [1, 0, 50], [1, 1, 60], [1, 2, 70], [1, 3, 80],
          [2, 0, 25], [2, 1, 35], [2, 2, 45], [2, 3, 55],
          [3, 0, 15], [3, 1, 25], [3, 2, 35], [3, 3, 45],
          [4, 0, 65], [4, 1, 75], [4, 2, 85], [4, 3, 95]
        ],
        label: {
          show: true,
          color: '#fff'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
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
