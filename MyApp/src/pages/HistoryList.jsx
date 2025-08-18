import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { historyApi } from '../request/auth';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#8b5cf6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 35,
    height: 35,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    margin: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsContainer: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },

  listContainer: {
    paddingHorizontal: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newDivinationBtn: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'normal',
  },
  historyItem: {
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: 15,
    minHeight: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  question: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
    lineHeight: 18,
  },
  interpretation: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 10,
  },
  historyFooter: {
    alignItems: 'flex-end',
  },
  readMore: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'normal',
  },

  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },

  emptyCard: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    margin: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  startBtn: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'normal',
  },

  bottomSpace: {
    height: 100,
  },
});