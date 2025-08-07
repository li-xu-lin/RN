import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import Card from '../components/common/Card';

const DivinationHistory = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const historyData = [
    {
      id: 1,
      type: 'tarot',
      title: '爱情塔罗占卜',
      question: '我的爱情何时到来？',
      result: '恋人牌 - 新的爱情即将到来',
      date: '2024-01-15',
      time: '14:30',
      score: 85,
      icon: '🔮'
    },
    {
      id: 2,
      type: 'zodiac',
      title: '白羊座运势',
      question: '今日运势如何？',
      result: '综合运势良好，适合新的开始',
      date: '2024-01-14',
      time: '09:15',
      score: 78,
      icon: '♈'
    },
    {
      id: 3,
      type: 'moon',
      title: '月相占卜',
      question: '本周事业发展如何？',
      result: '满月能量加持，事业有突破',
      date: '2024-01-13',
      time: '20:45',
      score: 92,
      icon: '🌕'
    },
    {
      id: 4,
      type: 'tarot',
      title: '财运塔罗',
      question: '近期财运如何？',
      result: '权杖王牌 - 财运稳步上升',
      date: '2024-01-12',
      time: '16:20',
      score: 73,
      icon: '🔮'
    },
    {
      id: 5,
      type: 'zodiac',
      title: '双子座配对',
      question: '与狮子座的配对如何？',
      result: '匹配度87% - 非常合适',
      date: '2024-01-11',
      time: '11:30',
      score: 87,
      icon: '♊'
    }
  ];

  const filters = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'tarot', name: '塔罗', icon: '🔮' },
    { id: 'zodiac', name: '星座', icon: '⭐' },
    { id: 'moon', name: '月相', icon: '🌙' }
  ];

  const filteredHistory = selectedFilter === 'all' 
    ? historyData 
    : historyData.filter(item => item.type === selectedFilter);

  const getScoreColor = (score) => {
    if (score >= 80) return '#4ECDC4';
    if (score >= 60) return '#FECA57';
    return '#FF6B9D';
  };

  const renderHistoryItem = (item) => (
    <Card key={item.id} onPress={() => navigation.navigate('DivinationDetail', { id: item.id })}>
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>总占卜次数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>本月占卜</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>82</Text>
              <Text style={styles.statLabel}>平均准确度</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* 筛选器 */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterItem,
                  selectedFilter === filter.id && styles.filterActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 历史记录列表 */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            📜 {filters.find(f => f.id === selectedFilter)?.name}记录
          </Text>
          <Text style={styles.recordCount}>共{filteredHistory.length}条</Text>
        </View>
        
        {filteredHistory.map(renderHistoryItem)}
        
        {filteredHistory.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌟</Text>
            <Text style={styles.emptyTitle}>暂无记录</Text>
            <Text style={styles.emptyDesc}>
              还没有{filters.find(f => f.id === selectedFilter)?.name}占卜记录
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.startBtnText}>开始占卜</Text>
            </TouchableOpacity>
          </Card>
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
  recordCount: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
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