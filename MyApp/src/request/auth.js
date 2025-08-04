import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API = 'http://10.0.2.2:3010'

// 创建axios实例
const api = axios.create({
    baseURL: API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

// 请求拦截器
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token')
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    res => {
        return res
    },
    error => {
        const status = error.res?.status
        if (status === 401) {
            AsyncStorage.removeItem('token')
        }
        const err = {
            message: error.message,
            code: error.code,
            res: error.res
        }
        
        return Promise.reject(err)
    }
)

export const loginApi = async (data = {}) => {
    try {
        const res = await api.post('/auth/login', data)
        return { success: true, data: res.data }
    } catch (error) {
        return { 
            success: false,
            data: error.res?.data || { msg: error.message },
            message: error.message
        }
    }
}
