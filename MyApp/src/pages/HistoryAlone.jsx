import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CardAloneApi } from '../request/auth';

export default function HistoryAlone() {
  // 导航相关
  const nav = useNavigation();
  const route = useRoute();
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 历史数据     
  const [historyData, setHistoryData] = useState(null);

  // 从路由参数获取历史记录ID
  const { historyId } = route.params;

  useEffect(() => {
    getAloneFn();
  }, []);

  //获取历史占卜详细数据
  const getAloneFn = async () => {
    try {
      setLoading(true);

      // 验证历史记录ID是否存在
      if (!historyId) {
        console.error('历史记录ID为空');
        return;
      }

      // 调用API获取历史详情
      const result = await CardAloneApi(historyId);

      // 处理API响应结果
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

  //获取卡片位置的中文显示
  const getPositionText = (position) => {
    return position === 'upright' ? '正位' : '逆位';
  };

  //根据分数获取对应的颜色
  const getScoreColor = (score) => {
    if (score >= 80) return '#4ECDC4';  // 高分：青色
    if (score >= 60) return '#FECA57';  // 中分：黄色
    return '#FF6B9D';                   // 低分：粉色
  };

  //渲染各方面含义的通用组件
  const renderMeaningItem = (title, content, emoji) => (
    <View style={styles.meaningItem} key={title}>
      <Text style={styles.meaningTitle}>{emoji} {title}</Text>
      <Text style={styles.meaningText}>{content}</Text>
    </View>
  );

  //渲染通用内容容器
  const renderContentSection = (title, content, emoji, containerStyle = 'contentContainer') => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{emoji} {title}</Text>
      <View style={styles[containerStyle]}>
        <Text style={styles.contentText}>{content}</Text>
      </View>
    </View>
  );

  //渲染顶部导航栏
  const renderHeader = () => (
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
  );

  //渲染卡片信息区域
  const renderCardInfo = () => (
    <View style={styles.cardSection}>
      <View style={styles.cardContainer}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardEmoji}>🔮</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>
            {historyData.cardSuit}{historyData.cardName}
          </Text>
          <Text style={styles.cardPosition}>
            {getPositionText(historyData.position)} • {historyData.date} {historyData.time}
          </Text>
        </View>
        <View style={[styles.scoreTag, { backgroundColor: getScoreColor(historyData.score) }]}>
          <Text style={styles.scoreText}>{historyData.score}分</Text>
        </View>
      </View>
    </View>
  );

  //渲染各方面含义区域
  const renderMeanings = () => {
    // 各方面含义配置数组，减少重复代码
    const meanings = [
      { title: '综合运势', content: historyData.interpretation.meaning.general, emoji: '💫' },
      { title: '爱情运势', content: historyData.interpretation.meaning.love, emoji: '💝' },
      { title: '事业运势', content: historyData.interpretation.meaning.career, emoji: '💼' },
      { title: '财运', content: historyData.interpretation.meaning.finance, emoji: '💰' },
      { title: '健康运势', content: historyData.interpretation.meaning.health, emoji: '🍀' },
      { title: '建议', content: historyData.interpretation.meaning.advice, emoji: '💡' }
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 各方面含义</Text>
        {meanings.map(({ title, content, emoji }) =>
          renderMeaningItem(title, content, emoji)
        )}
      </View>
    );
  };

  //主要内容渲染函数
  const renderMainContent = () => (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 顶部导航栏 */}
      {renderHeader()}

      {/* 卡片信息 */}
      {renderCardInfo()}

      {/* 占卜问题 */}
      {renderContentSection(
        '占卜问题',
        `"${historyData.question}"`,
        '💭',
        'questionContainer'
      )}

      {/* 占卜结果 */}
      {renderContentSection(
        '占卜结果',
        historyData.resultSummary,
        '🎯',
        'resultContainer'
      )}

      {/* 详细解释 */}
      {renderContentSection(
        '详细解释',
        historyData.interpretation.detailedDescription,
        '📖',
        'interpretationContainer'
      )}

      {/* 各方面含义 */}
      {renderMeanings()}
    </ScrollView>
  );

  //渲染加载状态
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#8B5CF6" />
      <Text style={styles.loadingText}>正在加载详细信息...</Text>
    </View>
  );

  //渲染错误状态
  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>未找到占卜记录</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => nav.goBack()}>
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
    </View>
  );

  //统一的组件渲染逻辑
  return (() => {
    // 加载中状态
    if (loading) return renderLoadingState();

    // 数据为空状态
    if (!historyData) return renderErrorState();

    // 正常数据状态
    return renderMainContent();
  })();
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