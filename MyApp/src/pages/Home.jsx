import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedTouchable from '../components/common/AnimatedTouchable';
import PulseAnimation from '../components/common/PulseAnimation';

export default function Home() {
  const nav = useNavigation()
  const [user, setUser] = useState(null)
  
  // 动画相关
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  const getUser = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user')
      if (userObj) {
        setUser(JSON.parse(userObj))
      }
    } catch (error) {
      console.log('获取用户信息失败:', error)
    }
  }

  // 页面加载动画
  const startLoadAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }

  useEffect(() => {
    getUser()
    startLoadAnimation()
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      <View style={styles.content}>
        {/* 头部问候 */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>✨ 你好，{user?.username || '神秘占卜师'}</Text>
            <Text style={styles.subGreeting}>今天想要探索什么奥秘呢？</Text>
          </View>
          <AnimatedTouchable 
            style={styles.profileBtn} 
            onPress={() => nav.navigate('MyTab')}
            animationType="bounce"
          >
            {user?.avatar ? (
              <Text style={styles.avatarText}>👤</Text>
            ) : (
              <Text style={styles.avatarText}>✨</Text>
            )}
          </AnimatedTouchable>
        </View>

        {/* 今日运势卡片 */}
        <Animated.View style={[styles.dailySection, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <View style={styles.dailyCard}>
            <View style={styles.dailyHeader}>
              <Text style={styles.dailyTitle}>🌟 今日运势</Text>
              <Text style={styles.dailyDate}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</Text>
            </View>
            
            <View style={styles.fortuneGrid}>
              <View style={styles.fortuneItem}>
                <Text style={styles.fortuneEmoji}>🎨</Text>
                <Text style={styles.fortuneLabel}>幸运色</Text>
                <Text style={styles.fortuneValue}>薰衣草紫</Text>
              </View>
              <View style={styles.fortuneItem}>
                <Text style={styles.fortuneEmoji}>🔢</Text>
                <Text style={styles.fortuneLabel}>幸运数字</Text>
                <Text style={styles.fortuneValue}>7</Text>
              </View>
              <View style={styles.fortuneItem}>
                <Text style={styles.fortuneEmoji}>⭐</Text>
                <Text style={styles.fortuneLabel}>运势指数</Text>
                <Text style={styles.fortuneValue}>85分</Text>
              </View>
            </View>

            <View style={styles.fortuneAdvice}>
              <Text style={styles.adviceText}>
                今天是充满灵感的一天，相信你的直觉，它会为你指引正确的方向。
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* 快速占卜区域 */}
        <Animated.View style={[styles.quickSection, {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }]}>
          <Text style={styles.sectionTitle}>🔮 开始占卜</Text>
          <View style={styles.quickGrid}>
            <AnimatedTouchable 
              style={styles.quickCard} 
              onPress={() => nav.navigate('TarotReading', { spreadType: 'single', question: '我的今日指引' })}
              animationType="lift"
            >
              <Text style={styles.quickIcon}>🃏</Text>
              <Text style={styles.quickTitle}>塔罗占卜</Text>
              <Text style={styles.quickDesc}>探索内心的声音</Text>
            </AnimatedTouchable>

            <AnimatedTouchable 
              style={styles.quickCard} 
              onPress={() => nav.navigate('ZodiacTab')}
              animationType="lift"
            >
              <Text style={styles.quickIcon}>⭐</Text>
              <Text style={styles.quickTitle}>星座运势</Text>
              <Text style={styles.quickDesc}>了解今日星象</Text>
            </AnimatedTouchable>

            <AnimatedTouchable 
              style={styles.quickCard} 
              onPress={() => nav.navigate('MoonPhase')}
              animationType="lift"
            >
              <Text style={styles.quickIcon}>🌙</Text>
              <Text style={styles.quickTitle}>月相占卜</Text>
              <Text style={styles.quickDesc}>感受月亮能量</Text>
            </AnimatedTouchable>

            <AnimatedTouchable 
              style={styles.quickCard} 
              onPress={() => nav.navigate('DivinationTab')}
              animationType="lift"
            >
              <Text style={styles.quickIcon}>💎</Text>
              <Text style={styles.quickTitle}>水晶占卜</Text>
              <Text style={styles.quickDesc}>水晶的神秘力量</Text>
            </AnimatedTouchable>
          </View>
        </Animated.View>

        {/* 每日一卡 */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>🎯 每日一卡</Text>
          <View style={styles.dailyCardContainer}>
            <PulseAnimation 
              style={styles.tarotCardDisplay}
              pulseType="scale"
              duration={2000}
              minScale={0.99}
              maxScale={1.01}
            >
              <Text style={styles.cardSymbol}>⭐</Text>
              <Text style={styles.cardName}>星星</Text>
            </PulseAnimation>
            <View style={styles.cardContent}>
              <Text style={styles.cardMeaning}>希望与指引</Text>
              <Text style={styles.cardDescription}>
                星星牌代表希望、灵感和精神指引。今天要保持乐观的心态，
                相信美好的事情即将发生。
              </Text>
              <TouchableOpacity style={styles.detailBtn}>
                <Text style={styles.detailBtnText}>查看详情 →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 运势类型 */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>💫 运势分类</Text>
          <View style={styles.categoryList}>
            <AnimatedTouchable style={styles.categoryItem} animationType="scale" scaleValue={0.98}>
              <Text style={styles.categoryIcon}>💕</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>爱情运势</Text>
                <Text style={styles.categoryDesc}>探索感情的奥秘</Text>
              </View>
              <Text style={styles.categoryArrow}>→</Text>
            </AnimatedTouchable>

            <AnimatedTouchable style={styles.categoryItem} animationType="scale" scaleValue={0.98}>
              <Text style={styles.categoryIcon}>💰</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>财富运势</Text>
                <Text style={styles.categoryDesc}>财运的起伏变化</Text>
              </View>
              <Text style={styles.categoryArrow}>→</Text>
            </AnimatedTouchable>

            <AnimatedTouchable style={styles.categoryItem} animationType="scale" scaleValue={0.98}>
              <Text style={styles.categoryIcon}>🎯</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>事业运势</Text>
                <Text style={styles.categoryDesc}>职场发展方向</Text>
              </View>
              <Text style={styles.categoryArrow}>→</Text>
            </AnimatedTouchable>

            <AnimatedTouchable style={styles.categoryItem} animationType="scale" scaleValue={0.98}>
              <Text style={styles.categoryIcon}>🍀</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>健康运势</Text>
                <Text style={styles.categoryDesc}>身心灵的平衡</Text>
              </View>
              <Text style={styles.categoryArrow}>→</Text>
            </AnimatedTouchable>
          </View>
        </View>

        {/* 最近记录 */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 最近占卜</Text>
            <AnimatedTouchable 
              onPress={() => nav.navigate('HistoryTab')}
              animationType="scale"
              scaleValue={0.9}
            >
              <Text style={styles.moreBtn}>查看全部 →</Text>
            </AnimatedTouchable>
          </View>
          
          <View style={styles.recentList}>
            <TouchableOpacity style={styles.recentItem}>
              <Text style={styles.recentIcon}>🔮</Text>
              <View style={styles.recentInfo}>
                <Text style={styles.recentTitle}>爱情塔罗</Text>
                <Text style={styles.recentTime}>今天 15:30</Text>
              </View>
              <Text style={styles.recentScore}>85分</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recentItem}>
              <Text style={styles.recentIcon}>⭐</Text>
              <View style={styles.recentInfo}>
                <Text style={styles.recentTitle}>星座运势</Text>
                <Text style={styles.recentTime}>昨天 20:15</Text>
              </View>
              <Text style={styles.recentScore}>78分</Text>
            </TouchableOpacity>
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
    paddingBottom: 100, // 为TabBar留出空间
  },
  content: {
    paddingBottom: 30
  },
  
  // 头部区域
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
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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

  // 今日运势
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
  fortuneAdvice: {
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

  // 快速占卜
  quickSection: {
    paddingHorizontal: 0,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  quickCard: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
  },
  quickIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  quickDesc: {
    fontSize: 12,
    color: '#8B5CF6',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },

  // 每日一卡
  cardSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  dailyCardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tarotCardDisplay: {
    width: 80,
    height: 120,
    backgroundColor: '#f8f5ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  cardSymbol: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B46C1',
  },
  cardContent: {
    flex: 1,
  },
  cardMeaning: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  detailBtn: {
    alignSelf: 'flex-start',
  },
  detailBtnText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  // 运势分类
  categorySection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  categoryList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#666',
  },
  categoryArrow: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  // 最近记录
  recentSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  moreBtn: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  recentList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  recentTime: {
    fontSize: 14,
    color: '#666',
  },
  recentScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
})
