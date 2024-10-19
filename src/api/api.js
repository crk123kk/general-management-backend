/**
 * 整个项目 api 的统一管理
 */
import request from "./request";


// 当然如果项目很大的情况下，其实是可以将各个模块的请求放在不同的的文件中
// 然后在这里统一引入导出作为管理


// 请求首页左侧的表格的数据
export default {
    getTableData() {
        return request({
            url: '/home/getTableData',
            method: 'get',
            // 请求上单独的 mock 开关
            // mock: false
        })
    },
    getCountData() {
        return request({
            url: '/home/getCountData',
            method: 'get'
        })
    },
    getChartData() {
        return request({
            url: '/home/getChartData',
            method: 'get'
        })
    },
    getUserData(data) {
        return request({
            url: '/home/getUserData',
            method: 'get',
            data,
        })
    },
    deleteUser(data) {
        return request({
            url: '/user/deleteUser',
            method: 'get',
            data,
        })
    },
    addUser(data) {
        return request({
            url: '/user/addUser',
            method: 'post',
            data,
        })
    },
    editUser(data) {
        return request({
            url: '/user/editUser',
            method: 'post',
            data,
        })
    },
    getMenu(data) {
        return request({
            url: '/permission/getMenu',
            method: 'post',
            data,
        })
    },
}
