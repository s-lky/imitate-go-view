import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ComponentDataConfig, EditorComponent } from '../types/component'

export const defaultBarChartConfig = {
  id: 'xxx',
  component: 'VBarChart',
  style: { /* 宽、高、位置等 */ },
  dataConfig: {
    type: 'static',
    staticData: JSON.stringify([
      { name: '周一', value: 120 },
      { name: '周二', value: 200 },
      { name: '周三', value: 150 },
      { name: '周四', value: 80 }
    ], null, 2),
    xField: 'name',
    yField: 'value'
  }
}

export const useEidtorStore = defineStore('editor',()=>{
    // 画布上的组件列表
  // 给 componentData 加上类型约束
    const componentData = ref<Array<EditorComponent>>([])
    // 当前选中的组件
    const curComponent = ref<EditorComponent | null>(null)

    // 历史记录管理
    const history = ref<Array<Array<EditorComponent>>>([])
    const historyIndex = ref(-1)
    const MAX_HISTORY_SIZE = 50

    const canvasConfig = ref({
        width: 1920,
        height: 1080,
        background:'#0f1011'
    })

    const removeComponent = (id: string) =>{
        const index = componentData.value.findIndex(item => item.id === id)
        if(index !== -1){
            componentData.value.splice(index,1)
            //清空选中态
            if(curComponent.value?.id === id){
                curComponent.value = null
            }
        }
    }

    //添加组件的方法
    const addComponent = (component: EditorComponent) => {
        componentData.value.push(component)
    }

    //设置当前选中的组件
    const setCurComponent = (component: any | null) => {
        curComponent.value = component
    }

    // 清空画布数据
    const clearCanvas = () => {
        componentData.value = []
        curComponent.value = null
    }

    // 批量设置画布数据（用于加载模板）
    const setComponentData = (data: Array<EditorComponent>) => {
        componentData.value = data
    }

    // 保存历史快照
    const pushHistory = () => {
        const snapshot = JSON.parse(JSON.stringify(componentData.value))
        // 如果不在历史末尾（撤销后又做了新操作），删除后面的记录
        if (historyIndex.value < history.value.length - 1) {
            history.value.splice(historyIndex.value + 1)
        }
        history.value.push(snapshot)
        // 限制历史记录数量
        if (history.value.length > MAX_HISTORY_SIZE) {
            history.value.shift()
        }
        historyIndex.value = history.value.length - 1
    }

    // 撤销操作
    const undo = () => {
        if (canUndo.value) {
            historyIndex.value--
            componentData.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
            // 清空选中状态
            curComponent.value = null
        }
    }

    // 重做操作
    const redo = () => {
        if (canRedo.value) {
            historyIndex.value++
            componentData.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
            // 清空选中状态
            curComponent.value = null
        }
    }

    // 是否可以撤销
    const canUndo = computed(() => historyIndex.value > 0)

    // 是否可以重做
    const canRedo = computed(() => historyIndex.value < history.value.length - 1)

    // 清空历史记录
    const clearHistory = () => {
        history.value = []
        historyIndex.value = -1
    }

    return{
        componentData,
        curComponent,
        canvasConfig,
        removeComponent,
        addComponent,
        setCurComponent,
        clearCanvas,
        setComponentData,
        // 历史记录相关
        history,
        historyIndex,
        pushHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
    }
})
