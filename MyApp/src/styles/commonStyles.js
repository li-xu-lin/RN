import { StyleSheet } from 'react-native';

// 公共颜色常量
export const COLORS = {
  primary: '#8B5CF6',
  background: '#f8f5ff',
  white: '#fff',
  darkGray: '#666',
  text: '#333',
  border: '#e0e0e0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// 公共尺寸常量
export const SIZES = {
  padding: 20,
  radius: 15,
  headerHeight: 50,
  buttonHeight: 45,
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
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // 头部相关
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SIZES.headerHeight,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    borderRadius: 12,
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // 文本相关
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  
  bodyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
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
    marginTop: 15,
  },
  
  marginBottom: {
    marginBottom: 15,
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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  inputFocused: {
    borderColor: COLORS.primary,
  },
}); 