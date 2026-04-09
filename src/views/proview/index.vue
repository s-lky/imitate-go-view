<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// 导入所有组件
import VBarChart from '../../packages/VBarChart.vue'
import VBarChartGrouped from '../../packages/VBarChartGrouped.vue'
import VBarChartStacked from '../../packages/VBarChartStacked.vue'
import VBarChartHorizontal from '../../packages/VBarChartHorizontal.vue'
import VBarChartCapsule from '../../packages/VBarChartCapsule.vue'
import VBarChartLine from '../../packages/VBarChartLine.vue'
import VLineChart from '../../packages/VLineChart.vue'
import VLineChartSmooth from '../../packages/VLineChartSmooth.vue'
import VLineChartArea from '../../packages/VLineChartArea.vue'
import VPieChart from '../../packages/VPieChart.vue'
import VPieChartMulti from '../../packages/VPieChartMulti.vue'
import VPieChartDonut from '../../packages/VPieChartDonut.vue'
import VText from '../../packages/VText.vue'
import VTextGradient from '../../packages/VTextGradient.vue'
import VTextScroll from '../../packages/VTextScroll.vue'
import VScatterChart from '../../packages/VScatterChart.vue'
import VWordCloud from '../../packages/VWordCloud.vue'
import VFunnelChart from '../../packages/VFunnelChart.vue'
import VAreaChart from '../../packages/VAreaChart.vue'
import VRadarChart from '../../packages/VRadarChart.vue'
import VHeatmapChart from '../../packages/VHeatmapChart.vue'
import VTreeChart from '../../packages/VTreeChart.vue'
// 导入表单组件
import VInput from '../../packages/VInput.vue'
import VTextarea from '../../packages/VTextarea.vue'
import VSelect from '../../packages/VSelect.vue'
import VDatePicker from '../../packages/VDatePicker.vue'
import VTimePicker from '../../packages/VTimePicker.vue'
import VSlider from '../../packages/VSlider.vue'
import VSwitch from '../../packages/VSwitch.vue'
import VCheckbox from '../../packages/VCheckbox.vue'
import VRadioGroup from '../../packages/VRadioGroup.vue'
import VButton from '../../packages/VButton.vue'
import VBadge from '../../packages/VBadge.vue'
import VProgress from '../../packages/VProgress.vue'
import VTabs from '../../packages/VTabs.vue'
import VPagination from '../../packages/VPagination.vue'
import type { ComponentDataConfig } from '../../types/component'
import './index.css' // 导入独立的 CSS 文件
import '../workplace/index.css' // 导入动画样式

const router = useRouter()
// 注册所有组件到映射表
const componentMap: Record<string, any> = {
  VBarChart, VBarChartGrouped, VBarChartStacked, VBarChartHorizontal, VBarChartCapsule, VBarChartLine,
  VLineChart, VLineChartSmooth, VLineChartArea,
  VPieChart, VPieChartMulti, VPieChartDonut,
  VText, VTextGradient, VTextScroll,
  VScatterChart, VWordCloud, VFunnelChart, VAreaChart, VRadarChart, VHeatmapChart, VTreeChart,
  // 表单组件
  VInput, VTextarea, VSelect, VDatePicker, VTimePicker, VSlider, VSwitch, VCheckbox, VRadioGroup, VButton, VBadge, VProgress, VTabs, VPagination
}

const componentData = ref<any[]>([])
// 假设我们的设计稿就是 1920 * 1080
const canvasWidth = 1920
const canvasHeight = 1080

// 记录当前的缩放比例
const scale = ref(1)

// 计算缩放比例
const updateScale = () => {
  // 获取当前浏览器视口的宽高
  const currentW = window.innerWidth
  const currentH = window.innerHeight

  // 分别计算宽度比例和高度比例
  const wScale = currentW / canvasWidth
  const hScale = currentH / canvasHeight

  // 选用最小的那个比例，保证大屏能完整地、等比例地显示在屏幕里，不被裁剪！
  scale.value = Math.min(wScale, hScale)
}

onMounted(() => {
  const savedData = localStorage.getItem('my-go-view-data')
  if (savedData) componentData.value = JSON.parse(savedData)

  // 进页面时先算一次比例
  updateScale()
  // 监听浏览器窗口大小改变，实时重新计算比例！
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  // 离开页面时销毁监听，保持好习惯
  window.removeEventListener('resize', updateScale)
})
</script>

<template>
  <div class="preview-viewport">
    <button class="back-btn" @click="router.push('/')">🔙 返回编辑器</button>

    <!-- 宽高固定是 1920x1080 -->
    <!-- 利用 scale 进行缩放，利用 translate(-50%, -50%) 把它永远钉在屏幕正中间 -->
    <div 
      class="canvas-screen"
      :style="{
        width: canvasWidth + 'px',
        height: canvasHeight + 'px',
        transform: `translate(-50%, -50%) scale(${scale})`
      }"
    >
      <div
        v-for="item in componentData"
        :key="item.id"
        class="preview-component"
        :class="{ 
          [`anim-${item.animation?.type}-${item.animation?.name}`]: item.animation?.name 
        }"
        :style="{
          left: item.style.left + 'px',
          top: item.style.top + 'px',
          width: item.style.width + 'px',
          height: item.style.height + 'px',
          '--anim-duration': (item.animation?.duration || 1) + 's'
        }"
      >
        <component 
          :is="componentMap[item.component]" 
          :propValue="item.propValue"
          :dataConfig="item.dataConfig"
        />
      </div>
    </div>
  </div>
</template>
