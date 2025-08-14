import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { historyApi } from '../request/auth';
export default function HistoryList() {
  // 获取导航对象
  const nav = useNavigation();

  // 历史记录数据状态
  const [historyData, setHistoryData] = useState([]);
  // 统计信息状态
  const [stats, setStats] = useState({
    totalCount: 0,        // 总占卜次数
    thisMonthCount: 0     // 本月占卜次数
  });
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 是否显示全部记录的状态
  const [showAll, setShowAll] = useState(false);

  //获取占卜历史记录
  const getHistory = async () => {
    try {
      // 开始加载
      setLoading(true);

      // 从本地存储获取用户信息
      const userObj = await AsyncStorage.getItem('user');
      const userData = userObj ? JSON.parse(userObj) : null;

      // 检查用户信息是否存在
      if (!userData || !userData._id) {
        // 用户信息不存在，设置空数据
        setHistoryData([]);
        setStats({ totalCount: 0, thisMonthCount: 0 });
        return;
      }

      // 调用API获取历史记录
      const result = await historyApi(userData._id);

      // 检查API响应是否成功
      if (result && (result.code === 200 || result.success === true || result.data)) {
        // 解析历史记录数据，兼容不同的数据结构
        const history = result.data?.data?.history || result.data?.history || result.data || [];
        setHistoryData(history);

        // 计算统计数据
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // 筛选本月的记录
        const thisMonthData = history.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        });

        // 更新统计信息
        setStats({
          totalCount: history.length,           // 总记录数
          thisMonthCount: thisMonthData.length  // 本月记录数
        });
      } else {
        // API调用失败，设置空数据
        setHistoryData([]);
        setStats({ totalCount: 0, thisMonthCount: 0 });
      }
    } catch (error) {
      // 捕获异常，记录错误日志
      console.error('获取历史记录失败:', error);
      setHistoryData([]);
      setStats({ totalCount: 0, thisMonthCount: 0 });
    } finally {
      // 无论成功失败都要停止加载状态
      setLoading(false);
    }
  };

  //切换显示全部/部分记录
  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  // 组件挂载时获取历史记录
  useEffect(() => {
    getHistory();
  }, []);
  const displayData = showAll ? historyData : historyData.slice(0, 3);

  /**
   * 渲染主要内容
   * @returns {JSX.Element} 主要内容组件
   */
  const renderMainContent = () => (
    <View style={styles.container}>
      {/* 头部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>占卜历史</Text>
          <View style={styles.rightContainer} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 统计卡片 */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>我的占卜统计</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalCount}</Text>
              <Text style={styles.statLabel}>总占卜次数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.thisMonthCount}</Text>
              <Text style={styles.statLabel}>本月占卜</Text>
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>历史记录</Text>
            {historyData.length > 0 && (
              <TouchableOpacity onPress={handleToggleShowAll}>
                <Text style={styles.newDivinationBtn}>
                  {showAll ? '收起' : '显示全部'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : historyData.length === 0 ? (
            /* 空状态卡片 */
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>暂无占卜记录</Text>
              <Text style={styles.emptySubText}>开始您的第一次占卜吧</Text>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => nav.navigate('ZhanBu')}
              >
                <Text style={styles.startBtnText}>开始占卜</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {displayData.map((item, index) => (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.historyItem}
                  onPress={() => nav.navigate('DivinationDetail', { historyId: item.id })}
                >
                  {/* 历史记录卡片 */}
                  <View style={styles.historyCard}>
                    <Text style={styles.question} numberOfLines={2}>
                      {item.question || '未记录问题'}
                    </Text>

                    <Text style={styles.interpretation} numberOfLines={3}>
                      {item.result || '暂无解读'}
                    </Text>

                    <View style={styles.historyFooter}>
                      <Text style={styles.readMore}>点击查看详情 →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
        <View style={styles.bottomSpace} />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  
  // === 头部导航栏样式 ===
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#8B5CF6',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#fff',
  },
  rightContainer: {
    width: 40,
    alignItems: 'center',
  },
  
  scrollView: {
    flex: 1,
  },

  // === 卡片样式 ===
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  },

  listContainer: {
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  newDivinationBtn: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  // 历史记录项样式
  historyItem: {
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 20,
    minHeight: 120,
    borderRadius: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 15,
    lineHeight: 24,
  },
  interpretation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  historyFooter: {
    alignItems: 'flex-end',
  },
  readMore: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },

  emptyCard: {
    backgroundColor: '#fff',
    padding: 40,
    alignItems: 'center',
    margin: 20,
    borderRadius: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpace: {
    height: 100,
  },
});