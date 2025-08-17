import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { getYunShiApi, xingZuo as xingZuoApi, ZhanBuNums } from '../request/auth'
import { commonStyles, COLORS } from '../styles/commonStyles'
import { getLevelInfo } from '../utils/lvJiSuan'


export default function Home() {
  const nav = useNavigation()
  // 用户信息
  const [user, setUser] = useState(null)
  // 幸运色
  const [color, setColor] = useState('')
  // 幸运数字
  const [num, setNum] = useState('')
  // 幸运色描述
  const [colorDesc, setColorDesc] = useState('')
  // 幸运数字描述
  const [numDesc, setNumDesc] = useState('')
  // 运势指数
  const [zhiShu, setZhishu] = useState(0)
  // 运势建议
  const [yunShi, setYunShi] = useState('')
  // 加载状态
  const [isLoading, setIsLoading] = useState(true)

  // 星座缘分相关状态
  const [xingZuo, setXingZuo] = useState(null)
  // 占卜次数相关状态
  const [ciStatus, setCiStatus] = useState({
    // 当前占卜次数
    currentCount: 0,
    // 最大占卜次数
    maxCount: 3,
    // 剩余占卜次数
    remainingCount: 3,
    // 会员类型
    vipType: '免费',
    // 是否可以占卜
    canDivine: true
  })

  // 刷新占卜次数状态的函数
  const shuaStatus = async (userId) => {
    const divinationRes = await ZhanBuNums(userId);
    if (divinationRes.success) {
      setCiStatus(divinationRes.data.data);
    }
  }

  const getUser = async () => {
    try {
      // 1. 获取用户信息
      const users = JSON.parse(await AsyncStorage.getItem('user'))
      setUser(users)

      // 2. 获取运势数据
      const res = await getYunShiApi(users._id)
      if (res.success && res.data.data.dailyFortune) {
        const fortune = res.data.data.dailyFortune
        setColor(fortune.luckyColor)
        setNum(fortune.luckyNumber)
        setZhishu(fortune.fortuneScore)
        setYunShi(fortune.yunShi)
        setColorDesc(fortune.luckyColorDesc)
        setNumDesc(fortune.luckyNumberDesc)
      }

      // 3. 获取星座缘分
      const zodiacRes = await xingZuoApi(users._id)
      if (zodiacRes.success) {
        setXingZuo(zodiacRes.data.data)
      }

      // 4. 获取占卜次数
      const divinationRes = await ZhanBuNums(users._id)
      if (divinationRes.success) {
        setCiStatus(divinationRes.data.data)
      }

    } catch (error) {
      console.log('获取数据出错:', error)
    } finally {
      setIsLoading(false)
    }
  }



  // 使用useMemo计算等级信息
  const levelInfo = useMemo(() => {
    if (!user || !user.exp) return { level: 1, title: '初学者', expToNext: 100 };
    return getLevelInfo(user.exp);
  }, [user?.exp]);

  useEffect(() => {
    getUser();
  }, [])

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const users = JSON.parse(await AsyncStorage.getItem('user'));
        await shuaStatus(users._id);
      };
      fetchData();
    }, [])
  )

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={commonStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContent}
      >
        <View style={styles.content}>
          <View style={[commonStyles.header, commonStyles.headerRow, { borderBottomRightRadius: 30 }]}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>✨ 你好，{user?.username || '神秘占卜师'}</Text>
              <View style={styles.userLevelInfo}>
                <Text style={styles.subGreeting}>
                  {levelInfo.title} • Lv.{levelInfo.level}
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

          <View style={styles.dailySection}>
            <View style={commonStyles.card}>
              <View style={styles.dailyHeader}>
                <Text style={styles.dailyTitle}>🌟 今日运势</Text>
                <Text style={styles.dailyDate}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</Text>
              </View>

              <View style={styles.fortuneGrid}>
                <View style={styles.fortuneItem}>
                  <Text style={styles.fortuneEmoji}>🎨</Text>
                  <Text style={styles.fortuneLabel}>幸运色</Text>
                  <Text style={styles.fortuneValue}>{isLoading ? '-' : color || '-'}</Text>
                </View>
                <View style={styles.fortuneItem}>
                  <Text style={styles.fortuneEmoji}>🔢</Text>
                  <Text style={styles.fortuneLabel}>幸运数字</Text>
                  <Text style={styles.fortuneValue}>{isLoading ? '-' : num || '-'}</Text>
                </View>
                <View style={styles.fortuneItem}>
                  <Text style={styles.fortuneEmoji}>⭐</Text>
                  <Text style={styles.fortuneLabel}>运势指数</Text>
                  <Text style={styles.fortuneValue}>
                    {isLoading ? '-' : (zhiShu ? `${zhiShu}分` : '-')}
                  </Text>
                </View>
              </View>

              <View style={styles.yunShi}>
                {isLoading ? (
                  <Text style={styles.adviceText}>运势加载中...</Text>
                ): yunShi ? (
                  <View>
                    <Text style={styles.adviceText}>
                      {yunShi.length > 40 ? `${yunShi.substring(0, 40)}...` : yunShi}
                    </Text>
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
                  <Text style={styles.adviceText}>暂无运势建议</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.quickSection}>
            <Text style={styles.sectionTitle}>🔮 开始占卜</Text>
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={[
                  styles.quickCard,
                  !ciStatus.canDivine && styles.disabledCard
                ]}
                onPress={() => {
                  if (ciStatus.canDivine) {
                    // 乐观更新
                    if (ciStatus.vipType !== '季会员') {
                      const newStatus = {
                        ...ciStatus,
                        currentCount: ciStatus.currentCount + 1,
                        remainingCount: ciStatus.remainingCount - 1,
                        canDivine: (ciStatus.currentCount + 1) < ciStatus.maxCount
                      };
                      setCiStatus(newStatus);
                    }
                    nav.navigate('ZhanBu', { spreadType: 'single', question: '我的今日指引' })
                  } else {
                    alert(`${ciStatus.vipType}用户每日最多可进行${ciStatus.maxCount}次占卜，今日次数已用完！\n\n升级会员解锁更多次数~`)
                  }
                }}
              >
                <Text style={styles.quickIcon}>🃏</Text>
                <View style={styles.quickContent}>
                  <Text style={styles.quickTitle}>塔罗占卜</Text>
                  <Text style={[
                    styles.quickDesc,
                    !ciStatus.canDivine && styles.disabledText
                  ]}>
                    {ciStatus.vipType === '季会员'
                      ? `探索内心的声音 (无限次数)`
                      : ciStatus.canDivine
                        ? `探索内心的声音 (${ciStatus.currentCount}/${ciStatus.maxCount})`
                        : `今日次数已用完 (${ciStatus.currentCount}/${ciStatus.maxCount})`
                    }
                  </Text>
                </View>
                {ciStatus.vipType !== '免费' && (
                  <View style={styles.vipBadge}>
                    <Text style={styles.vipText}>{ciStatus.vipType}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.zodiacSection}>
            <Text style={styles.sectionTitle}>💫 今日星座缘分</Text>
            <View style={styles.zodiacCard}>
              <View style={styles.userZodiacContainer}>
                <Text style={styles.userZodiacLabel}>你的星座</Text>
                <Text style={styles.userZodiacText}>
                  {isLoading ? '...' : (xingZuo?.userZodiac || '双鱼座')}
                </Text>
              </View>

              <View style={styles.zodiacHeader}>
                <View style={styles.targetZodiacContainer}>
                  <Text style={styles.zodiacLabel}>今日缘分星座</Text>
                  <Text style={styles.zodiacTarget}>
                    {isLoading ? '加载中...' : (xingZuo?.targetZodiac || '双鱼座')}
                  </Text>
                </View>
                <View style={styles.fateTypeContainer}>
                  <Text style={styles.fateType}>
                    {isLoading ? '-' : (xingZuo?.fateType || '友情')}
                  </Text>
                  <Text style={styles.compatibilityScore}>
                    {isLoading ? '-' : (xingZuo?.compatibilityScore ? `${xingZuo.compatibilityScore}%` : '88%')}
                  </Text>
                </View>
              </View>

              <View style={styles.fateDescription}>
                <Text style={styles.fateDescText}>
                  {isLoading ? '正在为你寻找今日的星座缘分...' :
                    (xingZuo?.fateDescription || '今天与双鱼座的人能建立深厚友谊，你们会发现许多共同话题')
                  }
                </Text>
              </View>

              <View style={styles.fateAdvice}>
                <Text style={styles.adviceLabel}>💡 相处建议</Text>
                <Text style={styles.adviceText}>
                  {isLoading ? '加载中...' :
                    (xingZuo?.advice || '主动邀请对方参加有趣的活动')
                  }
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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

  zodiacSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  zodiacCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  userZodiacContainer: {
    backgroundColor: '#f0f4ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
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
