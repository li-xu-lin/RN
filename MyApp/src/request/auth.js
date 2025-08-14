import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Android模拟器使用 10.0.2.2，真实设备使用实际IP
const API = 'http://192.168.100.199:3010'

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
        const status = error.response?.status
        if (status === 401) {
            AsyncStorage.removeItem('token')
        }
        const err = {
            message: error.message,
            code: error.code,
            response: error.response
        }

        return Promise.reject(err)
    }
)

// 通用API调用包装器
const apiCall = async (request) => {
    try {
        const res = await request()
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

export const loginApi = async (data = {}) => {
    return apiCall(() => api.post('/auth/login', data))
}

// 每日签到
export const QianDaoApi = async (userId) => {
    return apiCall(() => api.post('/auth/daily-sign', { userId }))
}

// 检查签到状态
export const getStatusApi = async (userId) => {
    return apiCall(() => api.post('/auth/check-sign-status', { userId }))
}

// 获取每日运势
export const getYunShiApi = async (userId) => {
    return apiCall(() => api.post('/auth/daily-fortune', { userId }))
}

// 塔罗占卜相关API
export const getCartApi = async () => {
    return apiCall(() => api.get('/tarot/cards'))
}

// 塔罗占卜
export const addCardApi = async (userId, question = '') => {
    return apiCall(() => api.post('/tarot/draw', { userId, question }))
}

// 塔罗占卜历史
export const historyApi = async (userId, limit = 10) => {
    return apiCall(() => api.post('/tarot/history', { userId, limit }))
}

// 塔罗占卜历史详情
export const CardAloneApi = async (historyId) => {
    return apiCall(() => api.post('/tarot/history-detail', { historyId }))
}

// 获取用户信息
export const aloneUser = async (userId) => {
    return apiCall(() => api.get(`/auth/user/${userId}`))
}

// 修改个人资料
export const UpuserApi = async (userId, profileData) => {
    return apiCall(() => api.put(`/auth/profile/${userId}`, profileData))
}

// 修改密码
export const UpPwd = async (userId, oldPassword, newPassword) => {
    return apiCall(() => api.put(`/auth/change-password/${userId}`, {
        oldPassword,
        newPassword
    }))
}

// 获取每日星座缘分
export const xingZuo = async (userId) => {
    return apiCall(() => api.post('/zodiac/daily-fate', { userId }))
}

// 获取每日占卜次数
export const ZhanBuNums = async (userId) => {
    return apiCall(() => api.post('/tarot/daily-status', { userId }))
}

// 获取支付计划
export const zhiFuApi = async () => {
    return apiCall(() => api.get('/payment/plans'))
}

// 创建支付
export const CreateZhiFu = async (userId, planType) => {
    return apiCall(() => api.post('/payment/create', { userId, planType }))
}

// 查询支付状态
export const queryZhiFu = async (outTradeNo) => {
    return apiCall(() => api.post('/payment/query', { outTradeNo }))
}



