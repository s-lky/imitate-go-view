import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history:createWebHistory(),
    routes:[
    {
        path:'/',
        name:'Workspace',
        component:()=>import('../views/workplace/index.vue')
    },
    {
        path:'/preview',
        name:'Preview',
        component:() => import('../views/proview/index.vue')
        }
    ]
})

export default router