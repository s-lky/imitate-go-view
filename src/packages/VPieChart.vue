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
        seriesData = data.map((item: any) => ({
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
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom',
      textStyle: { color: '#ccc' }
    },
    series: [
      {
        name: '数据',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0f1011',
          borderWidth: 2
        },
        label: {
          show: true,
          color: '#fff'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        data: seriesData.length > 0 ? seriesData : [
          { name: '分类1', value: 335 },
          { name: '分类2', value: 310 },
          { name: '分类3', value: 274 },
          { name: '分类4', value: 235 },
          { name: '分类5', value: 400 }
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
