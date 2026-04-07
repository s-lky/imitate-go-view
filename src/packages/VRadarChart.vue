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
  let indicator: any[] = []
  let seriesData: number[] = []
  
  if (props.dataConfig?.staticData) {
    try {
      const data = JSON.parse(props.dataConfig.staticData)
      if (Array.isArray(data)) {
        indicator = data.map((item: any) => ({
          name: item[props.dataConfig.xField],
          max: Math.max(...data.map((d: any) => d[props.dataConfig.yField])) * 1.2
        }))
        seriesData = data.map((item: any) => item[props.dataConfig.yField])
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
    radar: {
      indicator: indicator.length > 0 ? indicator : [
        { name: '销售', max: 6500 },
        { name: '管理', max: 16000 },
        { name: '信息技术', max: 30000 },
        { name: '客服', max: 38000 },
        { name: '研发', max: 52000 },
        { name: '市场', max: 25000 }
      ],
      axisName: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: '#333'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(0, 229, 255, 0.1)', 'rgba(0, 229, 255, 0.05)']
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: seriesData.length > 0 ? seriesData : [4200, 3000, 20000, 35000, 50000, 18000],
            name: '预算分配',
            areaStyle: {
              color: 'rgba(0, 229, 255, 0.3)'
            },
            itemStyle: {
              color: '#00e5ff'
            },
            lineStyle: {
              color: '#00e5ff'
            }
          }
        ]
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
