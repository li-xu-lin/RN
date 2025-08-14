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
export const dailySignApi = async (userId) => {
    return apiCall(() => api.post('/auth/daily-sign', { userId }))
}

// 检查签到状态
export const checkSignStatusApi = async (userId) => {
    return apiCall(() => api.post('/auth/check-sign-status', { userId }))
}

// 获取每日运势
export const getDailyFortuneApi = async (userId) => {
    return apiCall(() => api.post('/auth/daily-fortune', { userId }))
}

// 塔罗占卜相关API
export const getTarotCardsApi = async () => {
    return apiCall(() => api.get('/tarot/cards'))
}

export const drawTarotCardApi = async (userId, question = '') => {
    return apiCall(() => api.post('/tarot/draw', { userId, question }))
}

export const getTarotHistoryApi = async (userId, limit = 10) => {
    return apiCall(() => api.post('/tarot/history', { userId, limit }))
}

export const getTarotHistoryDetailApi = async (historyId) => {
    return apiCall(() => api.post('/tarot/history-detail', { historyId }))
}

// 获取用户信息
export const getUserInfoApi = async (userId) => {
    return apiCall(() => api.get(`/auth/user/${userId}`))
}

// ==================== 个人资料相关API ====================
export const updateUserProfileApi = async (userId, profileData) => {
    return apiCall(() => api.put(`/auth/profile/${userId}`, profileData))
}

export const changePasswordApi = async (userId, oldPassword, newPassword) => {
    return apiCall(() => api.put(`/auth/change-password/${userId}`, {
        oldPassword,
        newPassword
    }))
}

// ==================== 星座缘分相关API ====================
export const getDailyZodiacFateApi = async (userId) => {
    return apiCall(() => api.post('/zodiac/daily-fate', { userId }))
}

// ==================== 占卜次数限制相关API ====================
export const getDailyDivinationStatusApi = async (userId) => {
    return apiCall(() => api.post('/tarot/daily-status', { userId }))
}

// ==================== 支付相关API ====================
export const getPaymentPlansApi = async () => {
    return apiCall(() => api.get('/payment/plans'))
}

export const createPaymentApi = async (userId, planType) => {
    return apiCall(() => api.post('/payment/create', { userId, planType }))
}

export const queryPaymentStatusApi = async (outTradeNo) => {
    return apiCall(() => api.post('/payment/query', { outTradeNo }))
}



