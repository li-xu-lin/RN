import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CardAloneApi } from '../request/auth';

export default function HistoryAlone({ historyId }) {
  const nav = useNavigation();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 历史数据     
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    getAloneFn();
  }, []);

  //获取历史占卜详细数据
  const getAloneFn = async () => {
    try {
      setLoading(true);

      // 验证历史记录ID是否存在
      if (!historyId) {
        return;
      }

      // 调用API获取历史详情
      const res = await CardAloneApi(historyId);

      // 处理API响应结果
      if (res.success && res.data.data) {
        setHistoryData(res.data.data);
      } else {
        console.error(`获取历史详情失败`);
      }
    } catch (error) {
      console.error('获取详细数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  //获取卡片位置的中文显示
  const getPositionText = (position) => {
    if (!position) return '未知位置';
    return position === 'upright' ? '正位' : '逆位';
  };

  //根据分数获取对应的颜色
  const getScoreColor = (score) => {
    if (!score || typeof score !== 'number') return '#999';
    if (score >= 80) return '#4ECDC4'; 
    if (score >= 60) return '#FECA57';  
    return '#FF6B9D';                  
  };

  return (
    loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>正在加载详细信息...</Text>
    </View>
    ) : !historyData ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>未找到占卜记录</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => nav.goBack()}>
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerBackBtn}
        onPress={() => nav.goBack()}
      >
        <Text style={styles.headerBackText}>← 返回</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>占卜详情</Text>
      <View style={styles.placeholder} />
    </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
    <View style={styles.cardSection}>
      <View style={styles.cardContainer}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardEmoji}>🔮</Text>
        </View>
        <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{historyData.cardName || '未知卡牌'}</Text>
                <Text style={styles.cardDetails}>
                  {historyData.cardSuit || '未知花色'} • {getPositionText(historyData.position)}
          </Text>
        </View>
              <View style={styles.cardScore}>
                <Text style={[styles.scoreText, { color: getScoreColor(historyData.score) }]}>
                  {historyData.score || 0}分
                </Text>
        </View>
      </View>
    </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💭 占卜问题</Text>
            <View style={styles.questionContainer}>
              <Text style={styles.contentText}>"{historyData.question || '未记录问题'}"</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 占卜结果</Text>
            <View style={styles.resultContainer}>
              <Text style={styles.contentText}>{historyData.resultSummary || '暂无解读摘要'}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📖 详细解释</Text>
            <View style={styles.interpretationContainer}>
              <Text style={styles.contentText}>{historyData.interpretation?.detailedDescription || '暂无详细解读'}</Text>
            </View>
          </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 各方面含义</Text>
            <View style={styles.meaningsContainer}>
              <View style={styles.meaningItem}>
                <Text style={styles.meaningTitle}>💝 爱情</Text>
                <Text style={styles.meaningText}>{historyData.interpretation?.meaning?.love || '暂无爱情指引'}</Text>
              </View>

              <View style={styles.meaningItem}>
                <Text style={styles.meaningTitle}>💼 事业</Text>
                <Text style={styles.meaningText}>{historyData.interpretation?.meaning?.career || '暂无事业指引'}</Text>
              </View>

              <View style={styles.meaningItem}>
                <Text style={styles.meaningTitle}>💰 财运</Text>
                <Text style={styles.meaningText}>{historyData.interpretation?.meaning?.finance || '暂无财运指引'}</Text>
              </View>

              {historyData.interpretation?.meaning?.advice && (
                <View style={styles.meaningItem}>
                  <Text style={styles.meaningTitle}>💡 塔罗建议</Text>
                  <Text style={styles.meaningText}>{historyData.interpretation.meaning.advice}</Text>
                </View>
        )}
      </View>
          </View>
    </ScrollView>
    </View>
    )
  );
}

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

  contentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },

  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderLeft: 4,
    borderLeftColor: '#8B5CF6',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  interpretationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },

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