// 主题色彩配置
export const COLORS = {
  // 主色调
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#6B46C1',
  
  // 辅助色
  secondary: '#FF6B9D',
  secondaryLight: '#FF8FB3',
  secondaryDark: '#E11D48',
  
  // 功能色
  success: '#4ECDC4',
  warning: '#FECA57',
  error: '#FF6B6B',
  info: '#45B7D1',
  
  // 中性色
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // 背景色
  background: {
    primary: '#F8F5FF',
    secondary: '#FFFFFF',
    tertiary: '#F3F4F6',
  },
  
  // 文字色
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    accent: '#8B5CF6',
  },
  
  // 星座颜色
  zodiac: {
    aries: '#FF6B6B',
    taurus: '#4ECDC4',
    gemini: '#45B7D1',
    cancer: '#96CEB4',
    leo: '#FECA57',
    virgo: '#48CAE4',
    libra: '#FF9F43',
    scorpio: '#6C5CE7',
    sagittarius: '#A29BFE',
    capricorn: '#6C5CE7',
    aquarius: '#74B9FF',
    pisces: '#FD79A8',
  },
  
  // 运势颜色
  fortune: {
    excellent: '#4ECDC4', // 90-100分
    good: '#96CEB4',      // 70-89分
    average: '#FECA57',   // 50-69分
    poor: '#FF9F43',      // 30-49分
    bad: '#FF6B6B',       // 0-29分
  },
  
  // 元素颜色
  elements: {
    fire: '#FF6B6B',
    earth: '#96CEB4',
    air: '#45B7D1',
    water: '#48CAE4',
  },
  
  // 阴影色
  shadow: {
    primary: '#8B5CF6',
    secondary: '#000000',
    light: '#00000010',
    medium: '#00000020',
    heavy: '#00000030',
  },
  
  // 渐变色
  gradients: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    sunset: ['#ff9a9e', '#fecfef'],
    ocean: ['#a8edea', '#fed6e3'],
    purple: ['#8B5CF6', '#6B46C1'],
    pink: ['#FF6B9D', '#E11D48'],
  },
};

// 获取运势颜色
export const getFortuneColor = (score) => {
  if (score >= 90) return COLORS.fortune.excellent;
  if (score >= 70) return COLORS.fortune.good;
  if (score >= 50) return COLORS.fortune.average;
  if (score >= 30) return COLORS.fortune.poor;
  return COLORS.fortune.bad;
};

// 获取星座颜色
export const getZodiacColor = (zodiacSign) => {
  return COLORS.zodiac[zodiacSign] || COLORS.primary;
};

// 获取元素颜色
export const getElementColor = (element) => {
  return COLORS.elements[element] || COLORS.primary;
};

// 主题配置
export const THEME = {
  colors: COLORS,
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadows: {
    small: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  },
};

export default COLORS; 