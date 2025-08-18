import { StyleSheet } from 'react-native';

// 公共颜色常量
export const COLORS = {
  primary: '#8b5cf6',
  background: '#f5f5f5',
  white: '#fff',
  darkGray: '#666',
  text: '#333',
  border: '#ccc',
};

// 公共尺寸常量
export const SIZES = {
  padding: 15,
  radius: 5,
  headerHeight: 60,
  buttonHeight: 40,
};

// 公共样式
export const commonStyles = StyleSheet.create({
  // 容器相关
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  // 卡片相关
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // 头部相关
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SIZES.headerHeight,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
  },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  
    // 按钮相关
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'normal',
  },

  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'normal',
  },
  
    // 文本相关
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },

  bodyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 18,
  },

  smallText: {
    fontSize: 12,
    color: COLORS.darkGray,
  },

  whiteText: {
    color: COLORS.white,
  },
  
  // 布局相关
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
    marginTop: {
    marginTop: 10,
  },

  marginBottom: {
    marginBottom: 10,
  },
  
  padding: {
    padding: SIZES.padding,
  },
  
  paddingHorizontal: {
    paddingHorizontal: SIZES.padding,
  },
  
    // 输入框相关
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
}); 