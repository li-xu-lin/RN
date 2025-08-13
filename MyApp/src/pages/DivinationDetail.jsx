import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTarotHistoryDetailApi } from '../request/auth';

const { width } = Dimensions.get('window');

const DivinationDetail = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);
  const { historyId } = route.params;

  useEffect(() => {
    fetchDetailData();
  }, []);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      
      if (!historyId) {
        console.error('历史记录ID为空');
        return;
      }

      const result = await getTarotHistoryDetailApi(historyId);
      
      if (result.success && result.data.data) {
        setHistoryData(result.data.data);
      } else {
        console.error('获取历史详情失败:', result.data?.msg);
      }
    } catch (error) {
      console.error('获取详细数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionText = (position) => {
    return position === 'upright' ? '正位' : '逆位';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4ECDC4';
    if (score >= 60) return '#FECA57';
    return '#FF6B9D';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>正在加载详细信息...</Text>
      </View>
    );
  }

  if (!historyData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>未找到占卜记录</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>占卜详情</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 卡片信息 */}
      <View style={styles.cardSection}>
        <View style={styles.cardContainer}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardEmoji}>🔮</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{historyData.cardSuit}{historyData.cardName}</Text>
            <Text style={styles.cardPosition}>
              {getPositionText(historyData.position)} • {historyData.date} {historyData.time}
            </Text>
          </View>
          <View style={[styles.scoreTag, { backgroundColor: getScoreColor(historyData.score) }]}>
            <Text style={styles.scoreText}>{historyData.score}分</Text>
          </View>
        </View>
      </View>

      {/* 问题 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💭 占卜问题</Text>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>"{historyData.question}"</Text>
        </View>
      </View>

      {/* 结果概述 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 占卜结果</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{historyData.resultSummary}</Text>
        </View>
      </View>



      {/* 详细解释 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📖 详细解释</Text>
        <View style={styles.interpretationContainer}>
          <Text style={styles.interpretationText}>
            {historyData.interpretation.detailedDescription}
          </Text>
        </View>
      </View>

      {/* 各方面含义 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 各方面含义</Text>
        
        <View style={styles.meaningItem}>
          <Text style={styles.meaningTitle}>💫 综合运势</Text>
          <Text style={styles.meaningText}>{historyData.interpretation.meaning.general}</Text>
        </View>

        <View style={styles.meaningItem}>
          <Text style={styles.meaningTitle}>💝 爱情运势</Text>
          <Text style={styles.meaningText}>{historyData.interpretation.meaning.love}</Text>
        </View>

        <View style={styles.meaningItem}>
          <Text style={styles.meaningTitle}>💼 事业运势</Text>
          <Text style={styles.meaningText}>{historyData.interpretation.meaning.career}</Text>
        </View>

        <View style={styles.meaningItem}>
          <Text style={styles.meaningTitle}>💰 财运</Text>
          <Text style={styles.meaningText}>{historyData.interpretation.meaning.finance}</Text>
        </View>

        <View style={styles.meaningItem}>
          <Text style={styles.meaningTitle}>🍀 健康运势</Text>
          <Text style={styles.meaningText}>{historyData.interpretation.meaning.health}</Text>
        </View>

        <View style={styles.meaningItem}>
          <Text style={styles.meaningTitle}>💡 建议</Text>
          <Text style={styles.meaningText}>{historyData.interpretation.meaning.advice}</Text>
        </View>
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
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f5ff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f5ff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // 头部
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#8B5CF6',
  },
  headerBackBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerBackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 60,
  },

  // 卡片信息
  cardSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardEmoji: {
    fontSize: 30,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardPosition: {
    fontSize: 14,
    color: '#666',
  },
  scoreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  scoreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },

  // 通用section
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: 15,
  },

  // 问题
  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderLeft: 4,
    borderLeftColor: '#8B5CF6',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  // 结果
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },



  // 解释
  interpretationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  interpretationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },

  // 各方面含义
  meaningItem: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  meaningText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },


});

export default DivinationDetail; 