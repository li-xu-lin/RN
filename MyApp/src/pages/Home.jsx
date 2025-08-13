import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { getDailyFortuneApi, getDailyZodiacFateApi, getDailyDivinationStatusApi } from '../request/auth'


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
      const divinationRes = await getDailyDivinationStatusApi(userId);
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

      if (userObj) {
        const users = JSON.parse(userObj)
        setUser(users)

        if (users && users._id) {
          // 从服务端获取最新的每日运势数据
          const res = await getDailyFortuneApi(users._id);
          if (res.success && res.data.data.dailyFortune) {
            const fortuneData = res.data.data.dailyFortune;
            const userData = res.data.data;

            // 更新运势状态
            setColor(fortuneData.luckyColor)
            setNum(fortuneData.luckyNumber)
            setZhishu(fortuneData.fortuneScore)
            setYunShi(fortuneData.yunShi)
            setColorDesc(fortuneData.luckyColorDesc)
            setNumDesc(fortuneData.luckyNumberDesc)

            // 获取星座缘分数据
            const zodiacRes = await getDailyZodiacFateApi(users._id);
            let zodiacData = null;
            if (zodiacRes.success) {
              zodiacData = zodiacRes.data.data;
              setZodiacFate(zodiacData);
            }

            // 获取占卜次数状态
            const divinationRes = await getDailyDivinationStatusApi(users._id);
            if (divinationRes.success) {
              setDivinationStatus(divinationRes.data.data);
            }

            // 更新用户信息
            const updatedUser = {
              ...users,
              dailyFortune: fortuneData,
              level: userData.level,
              levelTitle: userData.levelTitle,
              exp: userData.exp,
              username: userData.username,
              imgs: userData.imgs
            };
            setUser(updatedUser);

            // 同步到本地存储
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

            setIsLoading(false)
            setErr(false)
          } else {
            // 如果获取服务端数据失败，使用本地数据作为备用
            if (users.dailyFortune) {
              setColor(users.dailyFortune.luckyColor)
              setNum(users.dailyFortune.luckyNumber)
              setZhishu(users.dailyFortune.fortuneScore)
              setYunShi(users.dailyFortune.yunShi)
              setColorDesc(users.dailyFortune.luckyColorDesc)
              setNumDesc(users.dailyFortune.luckyNumberDesc)
              setIsLoading(false)
              setErr(false)
            } else {
              setErr(true)
              setIsLoading(false)
            }
          }
        } else {
          setErr(true)
          setIsLoading(false)
        }
      } else {
        setErr(true)
        setIsLoading(false)
      }
    } catch (error) {
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

  return (
    <View style={styles.container}>
      {/* 主滚动容器 */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false} // 隐藏滚动条
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.header}>
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
              {user?.imgs ? (
                <Image source={{ uri: user.imgs }} style={styles.profileAvatar} />
              ) : (
                <Text style={styles.avatarText}>✨</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ==================== 今日运势卡片区域 ==================== */}
          <View style={styles.dailySection}>
            <View style={styles.dailyCard}>
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
                    nav.navigate('TarotReading', { spreadType: 'single', question: '我的今日指引' })
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5ff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingBottom: 30
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  userLevelInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 2,
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
    color: '#fff',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },

  dailySection: {
    paddingHorizontal: 20,
    marginTop: -15,
  },
  dailyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
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
