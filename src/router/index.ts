import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history:createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        // 返回到页面顶部，防止布局错乱
        return { top: 0, left: 0 }
    },
    routes:[
    {
        path:'/editor',
        name:'Workspace',
        component:()=>import('../views/workplace/index.vue')
    },
    {
        path:'/preview',
        name:'Preview',
        component:() => import('../views/proview/index.vue')
    },
    {
        path:'/',
        name:'ProjectList',
        component:() => import('../views/project/index.vue')
    },
    ]
})

export default router