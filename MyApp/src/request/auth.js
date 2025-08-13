import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Android模拟器使用 10.0.2.2，真实设备使用实际IP
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

export const loginApi = async (data = {}) => {
    try {

        const res = await api.post('/auth/login', data)
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}





// 每日签到
export const dailySignApi = async (userId) => {
    try {
        const res = await api.post('/auth/daily-sign', { userId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 检查签到状态
export const checkSignStatusApi = async (userId) => {
    try {
        const res = await api.post('/auth/check-sign-status', { userId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 获取每日运势
export const getDailyFortuneApi = async (userId) => {
    try {
        const res = await api.post('/auth/daily-fortune', { userId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 塔罗占卜相关API
// 获取塔罗牌列表
export const getTarotCardsApi = async () => {
    try {
        const res = await api.get('/tarot/cards')
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 抽取塔罗牌进行占卜
export const drawTarotCardApi = async (userId, question = '') => {
    try {
        const res = await api.post('/tarot/draw', { userId, question })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 获取塔罗占卜历史
export const getTarotHistoryApi = async (userId, limit = 10) => {
    try {
        const res = await api.post('/tarot/history', { userId, limit })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 获取单个塔罗占卜历史详情
export const getTarotHistoryDetailApi = async (historyId) => {
    try {
        const res = await api.post('/tarot/history-detail', { historyId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 获取用户信息
export const getUserInfoApi = async (userId) => {
    try {
        const res = await api.get(`/auth/user/${userId}`)
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// ==================== 个人资料相关API ====================

// 更新用户资料
export const updateUserProfileApi = async (userId, profileData) => {
    try {
        const res = await api.put(`/auth/profile/${userId}`, profileData)
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 修改密码
export const changePasswordApi = async (userId, oldPassword, newPassword) => {
    try {
        const res = await api.put(`/auth/change-password/${userId}`, {
            oldPassword,
            newPassword
        })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// ==================== 星座缘分相关API ====================

// 获取每日星座缘分
export const getDailyZodiacFateApi = async (userId) => {
    try {
        const res = await api.post('/zodiac/daily-fate', { userId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// ==================== 占卜次数限制相关API ====================

// 获取用户今日占卜次数状态
export const getDailyDivinationStatusApi = async (userId) => {
    try {
        const res = await api.post('/tarot/daily-status', { userId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// ==================== 支付相关API ====================

// 创建支付订单
export const createPaymentOrderApi = async (userId, productType) => {
    try {
        const res = await api.post('/payment/create-order', { userId, productType })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 查询支付结果
export const queryPaymentStatusApi = async (orderId) => {
    try {
        const res = await api.post('/payment/query-payment', { orderId })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}

// 获取用户订单列表
export const getUserOrdersApi = async (userId, page = 1, limit = 10) => {
    try {
        const res = await api.post('/payment/user-orders', { userId, page, limit })
        return { success: true, data: res.data }
    } catch (error) {
        return {
            success: false,
            data: error.response?.data || { msg: error.message },
            message: error.message
        }
    }
}


