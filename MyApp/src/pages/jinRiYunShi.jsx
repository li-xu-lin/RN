import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function JinRiYunShi() {
  const nav = useNavigation();
  // 运势数据
  const [yunData, setYunData] = useState(null);
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 获取用户数据
  const getUserData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('user'));
        if (userData.dailyFortune) {
          setYunData({
            yunColor: userData.dailyFortune.luckyColor,
            yunNumber: userData.dailyFortune.luckyNumber,
            zhiShu: userData.dailyFortune.fortuneScore,
            yunShi: userData.dailyFortune.yunShi,
            colorDesc: userData.dailyFortune.luckyColorDesc,
            numberDesc: userData.dailyFortune.luckyNumberDesc
          });
        }
      setLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    loading ? (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>加载中...</Text>
      </View>
    </View>
    ) : !yunData ? (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>运势数据加载失败</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.backButtonText}>返回首页</Text>
        </TouchableOpacity>
      </View>
    </View>
    ) : (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => nav.goBack()}
          >
            <Text style={styles.backBtnText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>今日运势详情</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>🌟 运势概览</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</Text>
          
          <View style={styles.fortuneGrid}>
            <View style={styles.fortuneItem}>
              <Text style={styles.fortuneEmoji}>🎨</Text>
              <Text style={styles.fortuneLabel}>幸运色</Text>
                <Text style={styles.fortuneValue}>{yunData.yunColor}</Text>
            </View>
            <View style={styles.fortuneItem}>
              <Text style={styles.fortuneEmoji}>🔢</Text>
              <Text style={styles.fortuneLabel}>幸运数字</Text>
                <Text style={styles.fortuneValue}>{yunData.yunNumber}</Text>
            </View>
            <View style={styles.fortuneItem}>
              <Text style={styles.fortuneEmoji}>⭐</Text>
              <Text style={styles.fortuneLabel}>运势指数</Text>
                <Text style={styles.fortuneValue}>{yunData.zhiShu}分</Text>
            </View>
          </View>
        </View>

        <View style={styles.adviceCard}>
          <Text style={styles.cardTitle}>💫 今日运势详解</Text>
            <Text style={styles.adviceText}>{yunData.yunShi}</Text>
        </View>

        <View style={styles.elementsCard}>
          <Text style={styles.cardTitle}>🔮 幸运元素解析</Text>
          
          <View style={styles.elementSection}>
            <View style={styles.elementHeader}>
              <Text style={styles.elementIcon}>🎨</Text>
                <Text style={styles.elementTitle}>幸运色：{yunData.yunColor}</Text>
            </View>
              <Text style={styles.elementDesc}>{yunData.colorDesc}</Text>
          </View>

          <View style={styles.elementSection}>
            <View style={styles.elementHeader}>
              <Text style={styles.elementIcon}>🔢</Text>
                <Text style={styles.elementTitle}>幸运数字：{yunData.yunNumber}</Text>
            </View>
              <Text style={styles.elementDesc}>{yunData.numberDesc}</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>温馨提示</Text>
          <Text style={styles.tipText}>
            运势仅供参考，真正的幸运来自于积极的心态和不懈的努力。
            保持乐观，相信自己，每一天都是新的开始！
          </Text>
        </View>
      </ScrollView>
    </View>
    )
  );
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
    paddingBottom: 30,
  },
  
  // 头部样式
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 60,
  },

  // 卡片基础样式
  overviewCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  adviceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  elementsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipCard: {
    backgroundColor: '#f8f5ff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },

  // 卡片标题
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 20,
  },

  // 运势网格
  fortuneGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  // 建议文本
  adviceText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },

  // 元素解析
  elementSection: {
    marginBottom: 20,
  },
  elementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  elementIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  elementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  elementDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 30,
  },

  // 提示卡片
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#8B5CF6',
    lineHeight: 20,
  },

  // 错误状态
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
