import { StyleSheet } from 'react-native';

// 公共颜色常量
export const COLORS = {
  primary: '#8B5CF6',
  background: '#f8f5ff',
  white: '#fff',
  lightGray: '#f5f5f5',
  darkGray: '#666',
  text: '#333',
  border: '#e0e0e0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  primaryLight: 'rgba(139, 92, 246, 0.1)',
  whiteTransparent: 'rgba(255, 255, 255, 0.2)',
};

// 公共尺寸常量
export const SIZES = {
  padding: 20,
  radius: 20,
  headerHeight: 50,
  buttonHeight: 45,
  avatarSize: 80,
  smallAvatar: 40,
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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  
  smallCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
  
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.whiteTransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 头像相关
  avatar: {
    width: SIZES.avatarSize,
    height: SIZES.avatarSize,
    borderRadius: SIZES.avatarSize / 2,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  
  smallAvatar: {
    width: SIZES.smallAvatar,
    height: SIZES.smallAvatar,
    borderRadius: SIZES.smallAvatar / 2,
    borderWidth: 2,
    borderColor: COLORS.whiteTransparent,
  },
  
  defaultAvatar: {
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 文本相关
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  
  bodyText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  
  smallText: {
    fontSize: 14,
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
    marginTop: 20,
  },
  
  marginBottom: {
    marginBottom: 20,
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
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  inputFocused: {
    borderColor: COLORS.primary,
  },
});

// 常用的组合样式
export const combineStyles = (...styles) => {
  return StyleSheet.flatten(styles);
}; 