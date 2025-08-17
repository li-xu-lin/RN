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
  // 总占卜次数状态
  const [totalCount, setTotalCount] = useState(0);
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
      const userData = JSON.parse(await AsyncStorage.getItem('user'))

      // 检查用户信息是否存在
      if (!userData) {
        setHistoryData([]);
        setTotalCount(0);
        return;
      }

      // 调用API获取历史记录
      const res = await historyApi(userData._id);

      // 检查API响应是否成功
      if (res) {
        const history = res.data.data.history;
        setHistoryData(history);

        // 更新总占卜次数
        setTotalCount(history.length);
      }
    } catch (error) {
      setHistoryData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  //切换显示全部/部分记录
  const isShowAll = () => {
    setShowAll(!showAll);
  };

  // 组件挂载时获取历史记录
  useEffect(() => {
    getHistory();
  }, []);
  const displayData = showAll ? historyData : historyData.slice(0, 3);

  return (
    <View style={styles.container}>
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
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>我的占卜统计</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>总占卜次数</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>历史记录</Text>
            {historyData.length > 0 && (
              <TouchableOpacity onPress={isShowAll}>
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
                  onPress={() => nav.navigate('LiShiXiangQing', { historyId: item.id })}
                >
                  <View style={styles.historyCard}>
                    <Text style={styles.question} numberOfLines={2}>
                      {item.question || '未记录问题'}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  
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
  statsContainer: {
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