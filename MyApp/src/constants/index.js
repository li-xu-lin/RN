// 统一导出所有常量
export { COLORS, THEME, getFortuneColor, getZodiacColor, getElementColor } from './colors';

// API 配置
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://10.0.2.2:3010' : 'https://your-api.com',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
};

// 应用配置
export const APP_CONFIG = {
  APP_NAME: '星占奇缘',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@mysticdivination.com',
  PRIVACY_URL: 'https://mysticdivination.com/privacy',
  TERMS_URL: 'https://mysticdivination.com/terms',
};

// 占卜配置
export const DIVINATION_CONFIG = {
  // 每日免费占卜次数
  DAILY_FREE_COUNT: 3,
  // VIP用户每日占卜次数
  VIP_DAILY_COUNT: 20,
  // 塔罗牌抽取延迟（毫秒）
  CARD_DRAW_DELAY: 1500,
  // 运势计算延迟（毫秒）
  FORTUNE_CALC_DELAY: 800,
};

// 存储键名
export const STORAGE_KEYS = {
  USER_TOKEN: 'token',
  USER_INFO: 'user',
  DAILY_FORTUNE: 'daily_fortune',
  DIVINATION_HISTORY: 'divination_history',
  APP_SETTINGS: 'app_settings',
  ZODIAC_SIGN: 'user_zodiac_sign',
};

// 动画配置
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
}; 