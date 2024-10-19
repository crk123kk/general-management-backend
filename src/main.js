import { createApp } from 'vue'
import App from './App.vue'

import '@/assets/less/index.less'

import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconVue from '@element-plus/icons-vue'

import { createPinia } from 'pinia'

import '@/api/mock.js'

import api from '@/api/api'

import { useAllDataStore } from './stores'

const app = createApp(App)

// ElementPlus
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconVue)) {
    app.component(key, component)
}

// api
app.config.globalProperties.$api = api

// pinia
const pinia = createPinia()
app.use(pinia)
const store = useAllDataStore()
// 要在router挂载之前添加，不然挂载上去之后跳转也就没用了
store.addMenu(router, 'refresh')


// 路由
function isRoute(to) {
    return (router.getRoutes().filter(item => item.path == to.path)).length > 0
}
router.beforeEach((to, from) => {
    // 路由守卫
    if (to.path !== '/login' && !store.state.token) {
        return { name: 'login' }
    }
    if (!isRoute(to)) {
        return { name: '404' }
    }
})
app.use(router)


app.mount('#app')

