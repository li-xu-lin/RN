import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { getYunShiApi, xingZuo, ZhanBuNums } from '../request/auth'
import { commonStyles, COLORS } from '../styles/commonStyles'


export default function Home() {
  const nav = useNavigation()
  const [user, setUser] = useState(null)
  const [color, setColor] = useState('')
  const [num, setNum] = useState('')
  const [colorDesc, setColorDesc] = useState('')
  const [numDesc, setNumDesc] = useState('')
  const [zhiShu, setZhishu] = useState(0)
  const [yunShi, setYunShi] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [err, setErr] = useState(false)
  // 星座缘分相关状态
  const [zodiacFate, setZodiacFate] = useState(null)
  // 占卜次数相关状态
  const [divinationStatus, setDivinationStatus] = useState({
    currentCount: 0,
    maxCount: 3,
    remainingCount: 3,
    vipType: '免费',
    canDivine: true
  })

  // 刷新占卜次数状态的函数
  const refreshDivinationStatus = async (userId) => {
    try {
              const divinationRes = await ZhanBuNums(userId);
      if (divinationRes.success) {
        setDivinationStatus(divinationRes.data.data);
      }
    } catch (error) {
      console.log('刷新占卜状态失败:', error);
    }
  }

  const getUser = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user')
      if (!userObj) {
        setErr(true)
        setIsLoading(false)
        return
      }

      const users = JSON.parse(userObj)
      setUser(users)

      if (!users?._id) {
        setErr(true)
        setIsLoading(false)
        return
      }

      // 并行获取所有数据
      const [fortuneRes, zodiacRes, divinationRes] = await Promise.all([
                    getYunShiApi(users._id),
            xingZuo(users._id),
            ZhanBuNums(users._id)
      ]);

      // 处理运势数据
      if (fortuneRes.success && fortuneRes.data.data.dailyFortune) {
        const fortuneData = fortuneRes.data.data.dailyFortune;
        setColor(fortuneData.luckyColor)
        setNum(fortuneData.luckyNumber)
        setZhishu(fortuneData.fortuneScore)
        setYunShi(fortuneData.yunShi)
        setColorDesc(fortuneData.luckyColorDesc)
        setNumDesc(fortuneData.luckyNumberDesc)

        // 更新用户信息
        const updatedUser = { ...users, ...fortuneRes.data.data };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } else if (users.dailyFortune) {
        // 使用本地数据
        const fortune = users.dailyFortune;
        setColor(fortune.luckyColor)
        setNum(fortune.luckyNumber)
        setZhishu(fortune.fortuneScore)
        setYunShi(fortune.yunShi)
        setColorDesc(fortune.luckyColorDesc)
        setNumDesc(fortune.luckyNumberDesc)
      }

      // 处理星座缘分数据
      if (zodiacRes.success) {
        setZodiacFate(zodiacRes.data.data);
      }

      // 处理占卜次数状态
      if (divinationRes.success) {
        setDivinationStatus(divinationRes.data.data);
      }

      setIsLoading(false)
      setErr(false)
    } catch (error) {
      console.log('getUser error:', error)
      setErr(true)
      setIsLoading(false)
    }
  }






  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setErr(false);

        await getUser();
      } catch (error) {
        setErr(true);
        setIsLoading(false);
      }
    };

    init();
  }, [])

  // 监听页面焦点，当从其他页面返回时刷新占卜状态
  useFocusEffect(
    React.useCallback(() => {
      // 页面获得焦点时，刷新占卜次数状态
      const refreshStatus = async () => {
        try {
          const userObj = await AsyncStorage.getItem('user');
          if (userObj) {
            const users = JSON.parse(userObj);
            if (users && users._id) {
              await refreshDivinationStatus(users._id);
            }
          }
        } catch (error) {
          console.log('刷新状态失败:', error);
        }
      };

      refreshStatus();
    }, [])
  )

  /**
   * 渲染主要内容
   * @returns {JSX.Element} 主要内容组件
   */
  const renderMainContent = () => (
    <View style={commonStyles.container}>
      {/* 主滚动容器 */}
      <ScrollView
        style={commonStyles.scrollView}
        showsVerticalScrollIndicator={false} // 隐藏滚动条
        contentContainerStyle={commonStyles.scrollContent}
      >
        <View style={styles.content}>
          <View style={[commonStyles.header, commonStyles.headerRow, { borderBottomRightRadius: 30 }]}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>✨ 你好，{user?.username || '神秘占卜师'}</Text>
              <View style={styles.userLevelInfo}>
                <Text style={styles.subGreeting}>
                  {user?.levelTitle || '初学者'} • Lv.{user?.level || 1}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => nav.navigate('MyTab')}
            >
              <Text style={styles.avatarText}>✨</Text>
            </TouchableOpacity>
          </View>

          {/* ==================== 今日运势卡片区域 ==================== */}
          <View style={styles.dailySection}>
            <View style={commonStyles.card}>
              {/* 运势卡片头部 */}
              <View style={styles.dailyHeader}>
                <Text style={styles.dailyTitle}>🌟 今日运势</Text>
                <Text style={styles.dailyDate}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</Text>
              </View>

              {/* 运势信息网格 */}
              <View style={styles.fortuneGrid}>
                {/* 幸运色显示 */}
                <View style={styles.fortuneItem}>
                  <Text style={styles.fortuneEmoji}>🎨</Text>
                  <Text style={styles.fortuneLabel}>幸运色</Text>
                  <Text style={styles.fortuneValue}>{isLoading ? '-' : color || '-'}</Text>
                </View>
                {/* 幸运数字显示 */}
                <View style={styles.fortuneItem}>
                  <Text style={styles.fortuneEmoji}>🔢</Text>
                  <Text style={styles.fortuneLabel}>幸运数字</Text>
                  <Text style={styles.fortuneValue}>{isLoading ? '-' : num || '-'}</Text>
                </View>
                {/* 运势指数显示 */}
                <View style={styles.fortuneItem}>
                  <Text style={styles.fortuneEmoji}>⭐</Text>
                  <Text style={styles.fortuneLabel}>运势指数</Text>
                  <Text style={styles.fortuneValue}>
                    {isLoading ? '-' : (zhiShu ? `${zhiShu}分` : '-')}
                  </Text>
                </View>
              </View>

              {/* 运势建议区域 */}
              <View style={styles.yunShi}>
                {isLoading ? (
                  /* 加载状态 */
                  <Text style={styles.adviceText}>运势加载中...</Text>
                ) : err ? (
                  /* 错误状态 */
                  <Text style={styles.adviceText}>运势数据获取失败，请检查网络连接后重试</Text>
                ) : yunShi ? (
                  /* 有建议内容时的显示 */
                  <View>
                    {/* 显示建议文本（限制40字符） */}
                    <Text style={styles.adviceText}>
                      {yunShi.length > 40 ? `${yunShi.substring(0, 40)}...` : yunShi}
                    </Text>
                    {/* 如果内容超过40字符，显示"详细"按钮 */}
                    {yunShi.length > 40 && (
                      <TouchableOpacity
                        style={styles.detailButton}
                        onPress={() => nav.navigate('JinRiYunShi', {
                          fortuneData: {
                            dailyColor: color,
                            dailyNumber: num,
                            fortuneScore: zhiShu,
                            fortuneAdvice: yunShi,
                            dailyColorDesc: colorDesc,
                            dailyNumberDesc: numDesc
                          }
                        })}
                      >
                        <Text style={styles.detailButtonText}>详细 →</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  /* 无建议内容时的显示 */
                  <Text style={styles.adviceText}>暂无运势建议</Text>
                )}
              </View>
            </View>
          </View>

          {/* ==================== 快速占卜区域 ==================== */}
          <View style={styles.quickSection}>
            <Text style={styles.sectionTitle}>🔮 开始占卜</Text>
            {/* 占卜选项网格 */}
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={[
                  styles.quickCard,
                  !divinationStatus.canDivine && styles.disabledCard
                ]}
                onPress={() => {
                  if (divinationStatus.canDivine) {
                    // 立即更新UI显示（乐观更新）
                    if (divinationStatus.vipType !== '季会员') {
                      const newStatus = {
                        ...divinationStatus,
                        currentCount: divinationStatus.currentCount + 1,
                        remainingCount: divinationStatus.remainingCount - 1,
                        canDivine: (divinationStatus.currentCount + 1) < divinationStatus.maxCount
                      };
                      setDivinationStatus(newStatus);
                    }
                    nav.navigate('ZhanBu', { spreadType: 'single', question: '我的今日指引' })
                  } else {
                    alert(`${divinationStatus.vipType}用户每日最多可进行${divinationStatus.maxCount}次占卜，今日次数已用完！\n\n升级会员解锁更多次数~`)
                  }
                }}
              >
                <Text style={styles.quickIcon}>🃏</Text>
                <View style={styles.quickContent}>
                  <Text style={styles.quickTitle}>塔罗占卜</Text>
                  <Text style={[
                    styles.quickDesc,
                    !divinationStatus.canDivine && styles.disabledText
                  ]}>
                    {divinationStatus.vipType === '季会员'
                      ? `探索内心的声音 (无限次数)`
                      : divinationStatus.canDivine
                        ? `探索内心的声音 (${divinationStatus.currentCount}/${divinationStatus.maxCount})`
                        : `今日次数已用完 (${divinationStatus.currentCount}/${divinationStatus.maxCount})`
                    }
                  </Text>
                </View>
                {/* 会员标识 */}
                {divinationStatus.vipType !== '免费' && (
                  <View style={styles.vipBadge}>
                    <Text style={styles.vipText}>{divinationStatus.vipType}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* ==================== 今日星座缘分区域 ==================== */}
          <View style={styles.zodiacSection}>
            <Text style={styles.sectionTitle}>💫 今日星座缘分</Text>
            <View style={styles.zodiacCard}>
              {/* 用户星座显示 */}
              <View style={styles.userZodiacContainer}>
                <Text style={styles.userZodiacLabel}>你的星座</Text>
                <Text style={styles.userZodiacText}>
                  {isLoading ? '...' : (zodiacFate?.userZodiac || '双鱼座')}
                </Text>
              </View>

              {/* 星座缘分头部 */}
              <View style={styles.zodiacHeader}>
                <View style={styles.targetZodiacContainer}>
                  <Text style={styles.zodiacLabel}>今日缘分星座</Text>
                  <Text style={styles.zodiacTarget}>
                    {isLoading ? '加载中...' : (zodiacFate?.targetZodiac || '双鱼座')}
                  </Text>
                </View>
                <View style={styles.fateTypeContainer}>
                  <Text style={styles.fateType}>
                    {isLoading ? '-' : (zodiacFate?.fateType || '友情')}
                  </Text>
                  <Text style={styles.compatibilityScore}>
                    {isLoading ? '-' : (zodiacFate?.compatibilityScore ? `${zodiacFate.compatibilityScore}%` : '88%')}
                  </Text>
                </View>
              </View>

              {/* 缘分描述 */}
              <View style={styles.fateDescription}>
                <Text style={styles.fateDescText}>
                  {isLoading ? '正在为你寻找今日的星座缘分...' :
                    (zodiacFate?.fateDescription || '今天与双鱼座的人能建立深厚友谊，你们会发现许多共同话题')
                  }
                </Text>
              </View>

              {/* 相处建议 */}
              <View style={styles.fateAdvice}>
                <Text style={styles.adviceLabel}>💡 相处建议</Text>
                <Text style={styles.adviceText}>
                  {isLoading ? '加载中...' :
                    (zodiacFate?.advice || '主动邀请对方参加有趣的活动')
                  }
                </Text>
              </View>
            </View>
          </View>


        </View>
      </ScrollView>
    </View>
  );

  /**
   * 统一的组件渲染逻辑
   * 根据不同状态返回对应的界面
   */
  return (() => {
    // 正常状态，显示主要内容
    return renderMainContent();
  })();
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  profileBtn: {
    ...commonStyles.roundButton,
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  avatarText: {
    fontSize: 20,
    color: COLORS.white,
  },
  dailySection: {
    ...commonStyles.paddingHorizontal,
    marginTop: -15,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
  dailyDate: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  fortuneGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fortuneItem: {
    alignItems: 'center',
    flex: 1,
  },
  fortuneEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  fortuneLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  fortuneValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  yunShi: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 12,
  },
  adviceText: {
    fontSize: 14,
    color: '#6B46C1',
    textAlign: 'center',
    lineHeight: 20,
  },
  detailButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  detailButtonText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  quickSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
  },
  quickGrid: {
    gap: 12,
  },
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickIcon: {
    fontSize: 28,
    marginRight: 15,
    width: 35,
    textAlign: 'center',
  },
  quickContent: {
    flex: 1,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quickDesc: {
    fontSize: 12,
    color: '#8B5CF6',
    lineHeight: 16,
  },

  // 星座缘分区域
  zodiacSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  zodiacCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  userZodiacContainer: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  userZodiacLabel: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 4,
  },
  userZodiacText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
  zodiacHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  targetZodiacContainer: {
    flex: 1,
  },
  zodiacLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  zodiacTarget: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B46C1',
  },
  fateTypeContainer: {
    alignItems: 'flex-end',
  },
  fateType: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    backgroundColor: '#f8f5ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  compatibilityScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  fateDescription: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  fateDescText: {
    fontSize: 15,
    color: '#6B46C1',
    lineHeight: 22,
    textAlign: 'center',
  },
  fateAdvice: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
  },
  adviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // 占卜次数限制相关样式
  disabledCard: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  disabledText: {
    color: '#999',
  },
  vipBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vipText: {
    fontSize: 10,
    color: '#000',
    fontWeight: '600',
  },
})
