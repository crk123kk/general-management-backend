import { defineStore } from 'pinia'

import { ref, computed, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router';

function initState() {
    return {
        isCollapse: false,
        tags: [
            {
                path: '/home',
                name: 'home',
                label: '首页',
                icon: 'home'
            }
        ],
        currentMenu: null,
        menuList: [],
        token: '',
        routerList: [],
    }
}

export const useAllDataStore = defineStore('allData', () => {
    // ref ==> state属性
    // computed ==> getters
    // function ==> actions

    const state = ref(initState())

    // 持久化存储路由等登录信息
    watch(
        state,
        (newObj) => {
            if (!newObj.token) return
            localStorage.setItem('store', JSON.stringify(newObj))
        },
        { deep: true }
    )

    // 新增 tag
    function selectMenu(val) {
        if (val.name == 'home') {
            state.value.currentMenu = null
        } else {
            state.value.currentMenu = val
            let index = state.value.tags.findIndex(item => item.name === val.name)
            index === -1 ? state.value.tags.push(val) : ''
        }
    }

    // 删除 tags 中被关闭的 tag
    function updateTags(tag) {
        let index = state.value.tags.findIndex((item) => item.name === tag.name)
        state.value.tags.splice(index, 1)
    }

    // 根据登录之后获取到的 menuList 去更新路由
    function updateMenuList(val) {
        state.value.menuList = val
    }

    // 动态路由的更新，根据登录之后获取到的menuList，来更新可以访问的module
    // 这样解决的问题就是没有对应路由的用户无法通过直接输入 url 来跳转对应的页面
    function addMenu(router, type) {

        if (type === 'refresh') {
            // 如果页面进行刷新操作（main.js重新进入）
            if (JSON.parse(localStorage.getItem('store'))) {
                state.value = JSON.parse(localStorage.getItem('store'))
                state.value.routerList = []
            } else {
                return
            }
        }

        const menu = state.value.menuList
        const module = import.meta.glob('../views/**/*.vue')
        const routeArr = []
        menu.forEach((item) => {
            if (item.children) {
                item.children.forEach((val) => {
                    let url = `../views/${val.url}.vue`
                    val.component = module[url]
                    routeArr.push(...item.children)
                })
            } else {
                let url = `../views/${item.url}.vue`
                item.component = module[url]
                routeArr.push(item)
            }
        })

        // state.value.routerList = []
        // console.log('router :>> ', router.getRoutes());
        let routers = router.getRoutes()
        // 这是在对路由做一个重置，清空出了 main 和 login 页面外的其他所有路由，然后再进行添加
        routers.forEach(item => {
            if (item.name == 'main' || item.name == 'login' || item.name == '404') {
                return
            } else {
                router.removeRoute(item.name)
            }
        })

        routeArr.forEach(item => {
            state.value.routerList.push(router.addRoute('main', item))
        })
    }

    function clean() {
        state.value.routerList.forEach((item) => {
            // item ==> removeRoute方法，清除当前路由
            if (item) item()
        })
        state.value = initState()
        // 删除我们本地的缓存
        localStorage.removeItem('store')
    }

    return {
        state,
        selectMenu,
        updateTags,
        updateMenuList,
        addMenu,
        clean,
    }
})