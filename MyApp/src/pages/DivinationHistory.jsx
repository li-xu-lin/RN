import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import { getTarotHistoryApi } from '../request/auth';

const DivinationHistory = ({ navigation }) => {

  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    thisMonthCount: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [showAll, setShowAll] = useState(false);



  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user');
      if (userObj) {
        const userData = JSON.parse(userObj);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
    return null;
  };

  // 获取占卜历史
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const userData = await getUserInfo();
      
      if (!userData || !userData._id) {
        setHistoryData([]);
        setStats({ totalCount: 0, thisMonthCount: 0, averageScore: 0 });
        return;
      }

      const limit = showAll ? 50 : 5; // 显示全部时获取50条，否则5条
      const result = await getTarotHistoryApi(userData._id, limit);
      
      if (result.success && result.data.data) {
        setHistoryData(result.data.data.history || []);
        setStats(result.data.data.stats || { totalCount: 0, thisMonthCount: 0, averageScore: 0 });
      } else {
        setHistoryData([]);
        setStats({ totalCount: 0, thisMonthCount: 0, averageScore: 0 });
      }
    } catch (error) {
      console.error('获取占卜历史失败:', error);
      setHistoryData([]);
      setStats({ totalCount: 0, thisMonthCount: 0, averageScore: 0 });
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchHistory();
  }, [showAll]);





  const getScoreColor = (score) => {
    if (score >= 80) return '#4ECDC4';
    if (score >= 60) return '#FECA57';
    return '#FF6B9D';
  };

  const renderHistoryItem = (item) => (
    <Card key={item.id} onPress={() => navigation.navigate('DivinationDetail', { historyId: item.id })}>
      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
        
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={styles.historyQuestion}>"{item.question}"</Text>
          <Text style={styles.historyResult}>{item.result}</Text>
          
          <View style={styles.historyMeta}>
            <Text style={styles.historyDate}>{item.date} {item.time}</Text>
            <View style={[styles.scoreTag, { backgroundColor: getScoreColor(item.score) }]}>
              <Text style={styles.scoreText}>{item.score}分</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreBtnText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Header 
        title="📋 占卜记录"
        rightComponent={
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        }
      />

      {/* 统计卡片 */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalCount}</Text>
              <Text style={styles.statLabel}>总占卜次数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.thisMonthCount}</Text>
              <Text style={styles.statLabel}>本月占卜</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.averageScore}</Text>
              <Text style={styles.statLabel}>平均准确度</Text>
            </View>
          </View>
        </Card>
      </View>



      {/* 历史记录列表 */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            📜 全部记录
          </Text>
          <TouchableOpacity onPress={() => {
            setShowAll(!showAll);
          }}>
            <Text style={styles.viewAllText}>{showAll ? '收起' : '查看全部'}</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <Card style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>正在加载占卜记录...</Text>
          </Card>
        ) : (
          <>
            {(showAll ? historyData : historyData.slice(0, 3)).map(renderHistoryItem)}
            
            {historyData.length === 0 && (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🌟</Text>
                <Text style={styles.emptyTitle}>暂无记录</Text>
                <Text style={styles.emptyDesc}>
                  还没有占卜记录
                </Text>
                <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('TarotReading')}>
                  <Text style={styles.startBtnText}>开始占卜</Text>
                </TouchableOpacity>
              </Card>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ff',
  },
  scrollContent: {
    paddingBottom: 120, // 为TabBar留出充足空间
  },
  searchIcon: {
    fontSize: 18,
  },
  
  // 统计区域
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsCard: {
    padding: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  
  // 筛选器
  filterSection: {
    paddingVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  
  // 历史记录
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
  viewAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 120, // 设置具体的最小高度
    paddingVertical: 15, // 添加上下内边距
  },
  historyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyQuestion: {
    fontSize: 14,
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  historyResult: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  scoreTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  moreBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreBtnText: {
    fontSize: 16,
    color: '#999',
  },
  
  // 加载状态
  loadingCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  
  // 空状态
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DivinationHistory; 