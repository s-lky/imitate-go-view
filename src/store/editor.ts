import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEidtorStore = defineStore('editor',()=>{
    // 画布上的组件列表
    const componentData = ref<any[]>([])

    // 当前选中的组件
    const curComponent = ref<any>(null)

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
    const addComponent = (component:any) =>{
        componentData.value.push(component)
    }

    //设置当前选中的组件
    const setCurComponent = (component: any | null) => {
        curComponent.value = component
    }

    return{
        componentData,
        curComponent,
        canvasConfig,
        removeComponent,
        addComponent,
        setCurComponent,
    }
})
