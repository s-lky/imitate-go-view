<script setup lang="ts">
import { useEidtorStore } from '../../store/editor';
import VBarChart from '../../packages/VBarChart.vue';
import VLineChart from '../../packages/VLineChart.vue';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

const router = useRouter()

// 处理键盘删除事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 1. 判断是否按下了 Delete 或 Backspace
  if (e.key === 'Delete' || e.key === 'Backspace') {
    // 2. 极其关键：判断当前焦点是不是在 input 或 textarea 标签上
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return // 如果正在输入文字，直接跳过删除逻辑
    }

    // 3. 如果当前有选中的组件，执行删除
    if (editorStore.curComponent) {
      editorStore.removeComponent(editorStore.curComponent.id)
    }
  }
}

// 在页面挂载时监听全局键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

// 离开页面时记得销毁监听，防止污染其他页面
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

//保存功能
const saveData = () =>{
    //把pinia里的画布数据变成字符串存进浏览器的本地存储里
    localStorage.setItem('my-go-view-data', JSON.stringify(editorStore.componentData))
    alert('保存成功，点击预览可查看')
}

//跳转预览页
const goToPreview = () =>{
    router.push('/preview')
}

//定义八个方向的控制点，以及他们对应的鼠标光标样式
const pointList = ['t','b','l','r','lt','rt','lb','rb']
const cursorMap: Record<string,string> = {
    t:'n-resize', b:'s-resize', l:'w-resize', r:'e-resize',
    lt:'nw-resize', rt:'ne-resize', lb:'sw-resize', rb:'se-resize'
}

//处理八个控制点的拖拽缩放
const handleResizeMouseDown = (e:MouseEvent,point:string,item:any) => {
    e.stopPropagation()
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = item.style.width
    const startHeight = item.style.height
    const startLeft = item.style.left
    const startTop =  item.style.top
    
    const move = (moveEvent :MouseEvent)=>{
        //计算鼠标移动的距离
        const disX = moveEvent.clientX-startX
        const disY = moveEvent.clientY-startY

        let newWidth = startWidth
        let newHeight = startHeight
        let newLeft = startLeft
        let newTop = startTop

        //核心逻辑-根据拖拽的哪个点来计算对应的宽高和位置
        if(point.includes('b')) newHeight = startHeight+disY // 往下拉，高度增加
        if(point.includes('t')) { //往上拉，高度增加，top减小
            newHeight = startHeight-disY
            newTop = startTop+disY
        }
        if(point.includes('r')) newWidth = startWidth+disX //往右拉，宽度增加
        if(point.includes('l')){ //往左拉，宽度增加，left减小
            newWidth = startWidth - disX
            newLeft = startLeft + disX
        }

        //防止宽高变成负数导致页面崩溃
        if(newWidth > 20){
            item.style.width = Math.round(newWidth / GRID_SIZE) * GRID_SIZE
            item.style.left = Math.round(newLeft / GRID_SIZE) * GRID_SIZE
        }
        if(newHeight >20 ){
            item.style.height = Math.round(newHeight / GRID_SIZE) * GRID_SIZE
            item.style.top = Math.round(newTop / GRID_SIZE) * GRID_SIZE
        }
    }

    const up = () =>{
        document.removeEventListener('mousemove',move)
        document.removeEventListener('mouseup',up)
    }

    document.addEventListener('mousemove',move)
    document.addEventListener('mouseup',up)
}

//处理画布内组件的拖拽移动
const GRID_SIZE = 20 //定义网格步长
const handleMouseDown = (e:MouseEvent,item:any) => {

    e.preventDefault() //阻止选中文等默认行为
    e.stopPropagation() //阻止冒泡

    editorStore.setCurComponent(item)    //鼠标按下时-立即选中

    const startY = e.clientY     //记录鼠标按下的初始屏幕坐标
    const startX = e.clientX
    
    //记录组件当前的初始位置
    const startTop = item.style.top
    const startLeft = item.style.left

    //定义鼠标移动时的函数
    const move = (moveEvent : MouseEvent) =>{
        //计算鼠标移动的距离（当前坐标-初始坐标）
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY

        //实时修改pinia里的组件位置
        item.style.top = startTop + (currY-startY)
        item.style.left = startLeft + (currX-startX)
        
        //算出鼠标真实的偏移位置
        const rawTop = startTop + (moveEvent.clientY-startY)
        const rawLeft = startLeft + (moveEvent.clientX-startX)
        //套用吸附公式使组件吸附在网格上
        item.style.top = Math.round(rawTop / GRID_SIZE)*GRID_SIZE
        item.style.left = Math.round(rawLeft / GRID_SIZE)*GRID_SIZE
    } 

    //定义鼠标松开时的函数
    const up = () =>{
        //鼠标松开，卸载事件监听，结束拖拽
        document.removeEventListener('mousemove',move)
        document.removeEventListener('mouseup',up)
    }

    //把移动和松开事件挂载到全局document上（预防拖拽时鼠标可能移出组件区域的情况）
    document.addEventListener('mousemove',move)
    document.addEventListener('mouseup',up)
}

const editorStore = useEidtorStore()

// 低代码核心：组件映射表（根据JSON里的字符串，找到对应的vue组件）
const componentMap: Record<string,any> = {
    VBarChart,
    VLineChart,
}

//左侧拖拽开始把“我是谁”这个信息存入包裹里
const handleDragStart = (e:DragEvent,componentName:string) =>{
    //dataTransfer只能装字符串
    e.dataTransfer?.setData('componentName',componentName)
}

//中间-拖拽放下：组装JSON，塞入pinia
const handleDrop = (e:DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    //取出刚才存的信息名字
    const componentName = e.dataTransfer?.getData('componentName')
    if(!componentName) return

    // 计算鼠标在画布上的相对坐标（落点在哪，组件就在哪）
    // 用offsetx、y来获取相对与容器的位置
    const top = e.offsetY
    const left = e.offsetX

    //构造大屏组件的标准JSON结构
    const newComponent = {
        id: 'id_' + Date.now(),
        component:componentName,
        style:{
            top:top,
            left:left,
            width:200,
            height:150,
        },
        propValue: { title:'默认标题' } //用来存业务属性
    }

    //把这个JSON丢给pinia的数据中心
    editorStore.addComponent(newComponent)
}


</script>

<template>
    <div class="workspace-container">
        <!-- 顶部工具栏 -->
         <header class="header">
            <div class="logo"> My Go-View </div>
            <div class="actions">
                <!-- 以后这里放撤销重做保存预览等按钮 -->
                 <button class="btn" @click="goToPreview">预览</button>
                 <button class="btn primary" @click="saveData">保存</button>
            </div>
         </header>

         <!-- 下方主工作区（flex） -->
          <main class="main-content">

            <!-- 左侧：图表物料库 -->
             <aside class="left-panel">
                <div class="panel-title">图表组件库</div>
                <div class="component-list">
                    <!-- 加上draggable="true"并在拖拽时开始塞入包裹 -->
                     <div 
                        class="mock-item"
                        draggable="true"
                        @dragstart="handleDragStart($event,'VBarChart')"
                     >
                     柱状图
                     </div>
                     <div
                        class="mock-item"
                        draggable="true"
                        @dragstart="handleDragStart($event,'VLineChart')"
                     >
                        折线图
                     </div>
                </div>
            </aside>

            <!-- 中间：核心编辑画布区 -->
             <section class="center-board">
                <!-- 真正的画布（以后这里会根据设定的大屏尺寸按比例缩放 -->
                <div 
                    class="canvas-area" 
                    @dragover.prevent 
                    @drop="handleDrop" 
                    @mousedown.self="editorStore.setCurComponent(null)"
                >
                 <!-- 画布区域加上@click="editorStore.setCurComponent(null)"点击空白处取消选中 -->
                <p v-if="editorStore.componentData.length === 0" style="color: #666; text-align: center; margin-top: 200px;">
                    请从左侧拖拽组件到这里
                </p>
                <!-- 数据驱动渲染的核心：遍历pinia里的数组 -->
                 <!-- 用position:absolute才能根据left和top定位 -->
                  <div
                    v-for="item in editorStore.componentData"
                    :key="item.id"
                    class="shape-component"
                    :class="{ active:editorStore.curComponent?.id === item.id }"
                    :style="{
                        left:item.style.left + 'px',
                        top:item.style.top + 'px',
                        width:item.style.width + 'px',
                        height:item.style.height + 'px',
                    }"
                    @mousedown="handleMouseDown($event,item)"
                    @click.stop
                  >
                    <!-- 动态渲染映射表里的组件 -->
                    <component :is="componentMap[item.component]" :propValue="item.propValue" />

                    <!-- 🌟 新增：只有选中时才显示的删除图标 -->
                    <div 
                        v-if="editorStore.curComponent?.id === item.id" 
                        class="delete-icon"
                        title="删除组件"
                        @mousedown.stop="editorStore.removeComponent(item.id)"
                    >
                        ×
                    </div>
                    <!-- 新增八个控制点-只有当前被选中的组件-才显示这八个点 -->
                     <div v-if="editorStore.curComponent?.id === item.id">
                        <div
                            v-for="point in pointList"
                            :key="point"
                            class="shape-point"
                            :class="point"
                            :style="{ cursor:cursorMap[point] }"
                            @mousedown.stop="handleResizeMouseDown($event,point,item)"
                        ></div>
                     </div>
                </div>
            </div>
        </section>

             <!-- 右侧：属性配置面板 -->
              <aside class="right-panel">
                <div class="panel-title">属性配置</div>
                <div class="config-area">
                    <!-- 以后这里放表单，修改组件的颜色、数据等 -->
                    <!-- 如果当前有选中的组件，就展示配置表单 -->
                     <div v-if="editorStore.curComponent" class="form-container">
                        <h3 style="margin-bottom: 20px; color: #00e5ff;">{{ editorStore.curComponent.component }}</h3>

                        <!-- 业务属性配置 -->
                         <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #444;">
                            <h4 style="color: #aaa; margin-bottom: 10px;">业务配置</h4>
                            <div class="form-item">
                                <label>图表标题：</label>
                                <input type="text" v-model="editorStore.curComponent.propValue.title" />
                            </div>
                         </div>

                         <!-- 原来的样式配置区 -->
                        <h4 style="color: #aaa; margin-bottom: 10px;">样式配置</h4>
                        <div class="form-item">
                            <label>X 坐标(Left)</label>
                            <input type="number" v-model.number="editorStore.curComponent.style.left" />
                        </div>
                        <div class="form-item">
                            <label>Y 坐标(Top)</label>
                            <input type="number" v-model.number="editorStore.curComponent.style.top" />
                        </div>
                        <div class="form-item">
                            <label>宽度(Width)</label>
                            <input type="number" v-model.number="editorStore.curComponent.style.width" />
                        </div>
                        <div class="form-item">
                            <label>高度(Height)</label>
                            <input type="number" v-model.number="editorStore.curComponent.style.height" />
                        </div>
                     </div>
                     <!-- 否则提示选中 -->
                     <p style="color: #666; font-size: 14px; text-align: center; margin-top: 50px;">
                        请先在画布中选中组件
                     </p>
                </div>
              </aside>

          </main>
    </div>
</template>

<style scoped>
.workspace-container{
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #151515;
    color: #fff;
}
.header{
    height: 60px;
    background-color: #222;
    border-bottom: 1px solid #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.main-content{
    display: flex;
    flex: 1;
    overflow: hidden;
}

.left-panel{
    width: 250px;
    background-color: #1d1e1f;
    border-right: 1px solid #000;
    display: flex;
    font-display: column;
}
.center-board{
    flex: 1;
    background-color: #0f1011;
    position: relative; overflow: auto;
    display: flex; justify-content: center; align-items: center;
}
/* 模拟大屏的画布 */
.canvas-area{
    width: 800px; height: 500px;
    background-color: #2a2a2a;
    box-shadow: 0 0 10pa rgba(0, 0, 0, 0.5); position: relative;
}
.right-panel{
    width: 300px; background-color: #1d1e1f;
    border-left: 1px solid #000;
}
.panel-title{
    padding: 10px; font-weight: bold;
    border-bottom: 1px solid #333;
}
.mock-item{
    margin: 10px; padding: 10px;
    background: #333; text-align: center;
    cursor: grab; border-radius: 4px;
}
/* 画布内组件的通用样式 */
/* 颜色交给内部的vue组件了，不用在css里写颜色 */
.shape-component {
    position: absolute; display: flex;
    align-items: center; justify-content: center;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.shape-component:hover {
    cursor: pointer;
    box-shadow: 0 0 10px #409eff;
}
/* 选中时的边框高亮 */
.shape-component.active {
    outline: 2px solid #00e5ff;
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
    z-index: 99; /* 选中时置于顶层 */
}
/* 右侧表单样式 */
.form-container {
    padding: 20px;
}
.form-item {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 15px;
}
.form-label{
    font-size: 14px; color: #aaa;
}
.form-item input{
    width: 100px;
    background: #333; border: 1px solid #555;
    color: #fff; padding: 5px; border-radius: 4px;
}
.form-item input:focus{
    outline: none; border-color: #00e5ff;
}

/* 八个小圆点的通用样式 */
.shape-point{
    position: absolute; background-color: #fff;
    border: 2px solid #00e5ff;  width: 8px;
    height: 8px; border-radius: 50%; z-index: 100;
}
/* 分别把八个点绝对定位到四周边缘 */
.shape-point.t {top: -5px; left: 50%; margin-left: -5px;}
.shape-point.b {bottom: -5px; left: 50%; margin-left: -5px;}
.shape-point.l {left: -5px; top: 50%; margin-top: -5px;}
.shape-point.r {right: -5px; top: 50%; margin-top: -5px;}
.shape-point.lt {top: -5px; left: -5px;}
.shape-point.rt {top: -5px; right: -5px;}
.shape-point.lb {bottom: -5px; left: -5px;}
.shape-point.rb {bottom: -5px; right: -5px;}
.btn{
    background: #333; color: #fff; border: 1px solid #555;
    padding: 5px 15px; margin-left: 10px; border-radius: 4px; cursor: pointer;
}
.btn.primary{
    background-color: #00e5ff; color: #000; font-weight: bold; border: none;
}
.btn:hover{opacity: 0.8;}
.delete-icon{
    position: absolute; top: -10px; right: -10px;
    width: 20px; height: 20px; background-color: #ff4d4f;
    color: #fff; border-radius: 50%; display: flex;
    align-items: center; font-size: 16px; cursor: pointer;
    z-index: 101; /*确保在八个点之上 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); transition: transform 0.2s;    
}
.delete-icon:hover{
    transform: scale(1.2); background-color: #ff7875;
}
/* 改造中间的画布容器 */
.canvas-area{
    width: 1920px; height: 1080px; background-color: #1a1a1a;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); position: relative;
    background-image:
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    overflow: hidden;
}

</style>