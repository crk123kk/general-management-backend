import axios from 'axios'

import { ElMessage } from 'element-plus'
import config from '@/config'

// 由于我们可能需要对请求做一些路径上的请求，所以一般都是创建axios.create之后再加拦截器，而不是直接在axios上加
const service = axios.create({
    baseURL: config.baseApi
})

const NETWORK_ERROR = 'error...'

// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config
    },
    function (error) {
        // 对请求错所做些什么
        return Promise.reject(error)
    }
)

// 添加相应拦截器
service.interceptors.response.use(

    (res) => {
        // 2xx 范围内的状态码都会触发该函数
        // 对相应数据做点什么
        const { code, data, msg } = res.data
        if (code == 200) {
            return data
        } else {
            ElMessage.error(msg || NETWORK_ERROR)
            return Promise.reject(msg || NETWORK_ERROR)
        }
    },
    // (error) => {
    //     // 超出 2xx 范围的状态码都会触发该函数
    //     // 对响应错误做点什么
    //     return Promise.reject(error)
    // }
)

function request(options) {
    options.method = options.method || 'get'

    // 关于 get 请求参数的调整
    // 这个点好的地方在于,在api.js中不管是get请求还是post请求，都可以统一的用data来传参，在这里进行分发处理
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }

    // 对 mock 的开关做一个处理, 这里允许单个请求有自己的 mock 开关
    let isMock = config.mock;
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock
    }

    // 针对环境做一个处理
    if (config.env === 'prod') {
        // 不能加 mock
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }

    return service(options)
}

export default request