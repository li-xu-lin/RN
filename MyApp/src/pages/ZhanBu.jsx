import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, COLORS } from '../styles/commonStyles';
import { addCardApi } from '../request/auth';

export default function ZhanBu() {
  const nav = useNavigation();
  const [user, setUser] = useState(null);
  const [val, setVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [cards, setCards] = useState(null);
  
  const [jieDu, setJieDu] = useState(null);

  const [isShow, setIsShow] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const yuShe = [
    '我的爱情运势如何？',
    '我的事业发展方向是什么？',
    '我需要注意什么问题？',
    '我应该如何做出这个决定？'
  ];
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user');
      if (userObj) setUser(JSON.parse(userObj));
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const cardFn = async () => {

    if (!val.trim()) {
      Alert.alert('提示', '请输入你的问题或选择一个预设问题');
      return;
    }

    setIsLoading(true);

    try {
      const result = await addCardApi(user._id, val);

      if (result.success) {
        // 解构获取塔罗牌和解读信息
        const { card, jieDu } = result.data.data.result;

        // 更新状态，显示结果
        setCards(card);
        setJieDu(jieDu);
        setIsShow(true);
      } else {
        // 占卜失败时显示错误信息
        Alert.alert('占卜失败', result.data?.msg || '请稍后重试');
      }
    } catch (error) {
      // 网络错误或其他异常
      Alert.alert('占卜失败', '网络连接异常，请稍后重试');
    } finally {
      // 无论成功失败都要结束加载状态
      setIsLoading(false);
    }
  };

  // ==================== 计算属性 ====================

  /**
   * 判断当前塔罗牌是否为逆位
   * 用于显示不同的样式和文字
   */
  const isReversed = cards?.position === 'reversed';

  // ==================== 组件渲染 ====================

  /**
   * 渲染主要内容
   * @returns {JSX.Element} 主要内容组件
   */
  const renderMainContent = () => (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>

        {/* ==================== 页面头部 ==================== */}
        <View style={styles.header}>
          {/* 返回按钮 */}
          <TouchableOpacity
            style={styles.backButton}
                         onPress={() => nav.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          {/* 头部内容：标题和副标题 */}
          <View style={styles.headerContent}>
            <Text style={styles.title}>塔罗占卜 🔮</Text>
            <Text style={styles.subtitle}>倾听内心的声音，寻找人生的答案</Text>
          </View>
        </View>

        {/* ==================== 问题输入区域 ==================== */}
        {/* 只在未显示结果时显示问题输入界面 */}
        {!isShow && (
          <>
            <View style={styles.questionSection}>
              <Text style={styles.sectionTitle}>你想问什么？</Text>

              {/* 预设问题标签 */}
              <View style={styles.yuShe}>
                <Text style={styles.suggestedTitle}>热门问题：</Text>
                <View style={styles.questionTags}>
                  {yuShe.map((q, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.questionTag,
                        val === q && styles.selectedTag // 选中状态的样式
                      ]}
                      onPress={() => setVal(q)} // 点击设置问题
                    >
                      <Text style={[
                        styles.questionTagText,
                        val === q && styles.selectedTagText // 选中状态的文字样式
                      ]}>
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 自定义问题输入框 */}
              <View style={styles.customQuestion}>
                <Text style={styles.customQuestionTitle}>或者输入你的问题：</Text>
                <TextInput
                  style={styles.questionInput}
                  placeholder="请输入你想要占卜的问题..."
                  placeholderTextColor="#999"
                  value={val}
                  onChangeText={setVal} // 实时更新问题内容
                />
              </View>
            </View>

            {/* ==================== 占卜按钮 ==================== */}
            <View style={styles.drawButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.drawButton,
                  isLoading && styles.drawButtonDisabled // 加载时的禁用样式
                ]}
                onPress={cardFn}
                disabled={isLoading} // 加载时禁用按钮
              >
                <Text style={styles.drawButtonText}>
                  {isLoading ? '占卜中... ✨' : '开始占卜 🎴'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ==================== 塔罗牌结果展示 ==================== */}
        {/* 只在有结果且有塔罗牌数据时显示 */}
        {isShow && cards && (
          <View style={styles.cardContainer}>
            <Text style={styles.cardSectionTitle}>你的塔罗牌</Text>

            {/* 塔罗牌卡片 - 点击可查看详细解读 */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowModal(true)}
            >
              <View style={styles.cardFront}>
                {/* 塔罗牌头部：花色和正逆位 */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardSuit}>{cards.suit}</Text>
                  <Text style={[
                    styles.cardPosition,
                    { color: isReversed ? '#FF6B9D' : '#8B5CF6' } // 根据正逆位显示不同颜色
                  ]}>
                    {isReversed ? '逆位 ↓' : '正位 ↑'}
                  </Text>
                </View>

                {/* 塔罗牌名称 */}
                <Text style={styles.cardName}>{cards.name}</Text>

                {/* 塔罗牌元素 */}
                <Text style={styles.cardElement}>{cards.element}元素</Text>

                {/* 关键词标签 - 显示前3个关键词 */}
                {jieDu && (
                  <View style={styles.cardKeywords}>
                    {jieDu.keywords?.slice(0, 3).map((keyword, idx) => (
                      <Text key={idx} style={styles.keyword}>{keyword}</Text>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* 查看详细解读按钮 */}
            <TouchableOpacity
              style={styles.viewDetailButton}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.viewDetailText}>查看详细解读 →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ==================== 快速解读卡片 ==================== */}
        {/* 显示简要的解读信息 */}
        {isShow && jieDu && (
          <View style={styles.quickInterpretation}>
            <Text style={styles.sectionTitle}>快速解读</Text>
            <View style={styles.interpretationCard}>
              {/* 简短描述 */}
              <Text style={styles.shortDescription}>
                {jieDu.shortDescription}
              </Text>

              {/* 爱情运势预览 */}
              <View style={styles.meaningPreview}>
                <Text style={styles.meaningTitle}>💝 爱情：</Text>
                <Text style={styles.meaningText}>{jieDu.meaning?.love}</Text>
              </View>

              {/* 事业运势预览 */}
              <View style={styles.meaningPreview}>
                <Text style={styles.meaningTitle}>💼 事业：</Text>
                <Text style={styles.meaningText}>{jieDu.meaning?.career}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ==================== 详细解读模态框 ==================== */}
      {/* 全屏模态框显示完整的塔罗牌解读 */}
      {cards && jieDu && (
        <Modal
          visible={showModal}
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            {/* 模态框头部 */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{cards.name}</Text>
                <Text style={styles.modalSubtitle}>
                  {cards.suit} • {isReversed ? '逆位' : '正位'}
                </Text>
              </View>

              {/* 关闭按钮 */}
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 模态框内容 - 可滚动 */}
            <ScrollView style={styles.modalContent}>

              {/* 问题回顾 */}
              <View style={styles.questionReview}>
                <Text style={styles.reviewTitle}>你的问题</Text>
                <Text style={styles.reviewQuestion}>"{val}"</Text>
              </View>

              {/* 详细牌意解读 */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>牌意解读</Text>
                <Text style={styles.detailDescription}>
                  {jieDu.detailedDescription}
                </Text>
              </View>

              {/* 各领域详细指引 */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>详细指引</Text>

                {/* 爱情运势 */}
                <View style={styles.meaningSection}>
                  <Text style={styles.meaningCategory}>💝 爱情运势</Text>
                  <Text style={styles.meaningDetail}>
                    {jieDu.meaning?.love}
                  </Text>
                </View>

                {/* 事业发展 */}
                <View style={styles.meaningSection}>
                  <Text style={styles.meaningCategory}>💼 事业发展</Text>
                  <Text style={styles.meaningDetail}>
                    {jieDu.meaning?.career}
                  </Text>
                </View>

                {/* 财运状况 */}
                <View style={styles.meaningSection}>
                  <Text style={styles.meaningCategory}>💰 财运状况</Text>
                  <Text style={styles.meaningDetail}>
                    {jieDu.meaning?.finance}
                  </Text>
                </View>
              </View>

              {/* 塔罗建议 - 如果有建议内容才显示 */}
              {jieDu.meaning?.advice && (
                <View style={styles.adviceSection}>
                  <Text style={styles.adviceSectionTitle}>🌟 塔罗建议</Text>
                  <Text style={styles.adviceText}>
                    {jieDu.meaning.advice}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      )}
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

// ==================== 样式定义 ====================

const styles = StyleSheet.create({
  // 头部区域样式
  header: {
    ...commonStyles.padding,
    paddingTop: 60, // 为状态栏留出空间
    backgroundColor: '#8B5CF6', // 紫色背景
    position: 'relative',
  },

  // 返回按钮样式
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 999, // 确保按钮在最上层
    backgroundColor: COLORS.white,
    width: 36,
    height: 36,
    borderRadius: 18, // 圆形按钮
    ...commonStyles.centerContainer, // 居中对齐
  },

  // 返回按钮文字样式
  backButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // 头部内容容器样式
  headerContent: {
    alignItems: 'center',
    width: '100%',
  },

  // 主标题样式
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  // 副标题样式
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // 问题输入区域样式
  questionSection: {
    padding: 20,
  },

  // 区域标题样式
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // 预设问题容器样式
  yuShe: {
    marginBottom: 20,
  },

  // 预设问题标题样式
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },

  // 问题标签容器样式
  questionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 允许换行
    gap: 8, // 标签间距
  },

  // 单个问题标签样式
  questionTag: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20, // 圆角标签
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },

  // 选中的问题标签样式
  selectedTag: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },

  // 问题标签文字样式
  questionTagText: {
    fontSize: 14,
    color: '#666',
  },

  // 选中的问题标签文字样式
  selectedTagText: {
    color: '#FFF',
  },

  // 自定义问题输入区域样式
  customQuestion: {
    marginTop: 10,
  },

  // 自定义问题标题样式
  customQuestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },

  // 问题输入框样式
  questionInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80, // 最小高度
    textAlignVertical: 'top', // 文字从顶部开始
  },

  // 占卜按钮容器样式
  drawButtonContainer: {
    padding: 20,
    paddingTop: 0,
  },

  // 占卜按钮样式
  drawButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
  },

  // 占卜按钮禁用状态样式
  drawButtonDisabled: {
    opacity: 0.7, // 半透明表示禁用
  },

  // 占卜按钮文字样式
  drawButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // 塔罗牌容器样式
  cardContainer: {
    padding: 20,
    alignItems: 'center',
  },

  // 塔罗牌区域标题样式
  cardSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },

  // 塔罗牌卡片样式
  card: {
    width: 200,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
  },

  // 塔罗牌正面样式
  cardFront: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },

  // 塔罗牌头部信息样式
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },

  // 塔罗牌花色样式
  cardSuit: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },

  // 塔罗牌正逆位样式
  cardPosition: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // 塔罗牌名称样式
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },

  // 塔罗牌元素样式
  cardElement: {
    fontSize: 16,
    color: '#8B5CF6',
    marginBottom: 20,
  },

  // 关键词容器样式
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },

  // 单个关键词样式
  keyword: {
    fontSize: 12,
    color: '#8B5CF6',
    backgroundColor: '#8B5CF620', // 半透明背景
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  // 查看详细解读按钮样式
  viewDetailButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  // 查看详细解读按钮文字样式
  viewDetailText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 快速解读容器样式
  quickInterpretation: {
    padding: 20,
    paddingTop: 0,
  },

  // 解读卡片样式
  interpretationCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
  },

  // 简短描述样式
  shortDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    fontStyle: 'italic', // 斜体
  },

  // 运势预览容器样式
  meaningPreview: {
    marginBottom: 10,
  },

  // 运势类型标题样式
  meaningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },

  // 运势内容样式
  meaningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // ==================== 模态框样式 ====================

  // 模态框容器样式
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  // 模态框头部样式
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // 为状态栏留出空间
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  // 模态框标题样式
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },

  // 模态框副标题样式
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },

  // 关闭按钮样式
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 关闭按钮文字样式
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },

  // 模态框内容样式
  modalContent: {
    flex: 1,
    padding: 20,
  },

  // 问题回顾卡片样式
  questionReview: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  // 问题回顾标题样式
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },

  // 问题回顾内容样式
  reviewQuestion: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },

  // 详细解读区域样式
  detailSection: {
    marginBottom: 25,
  },

  // 详细解读标题样式
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  // 详细描述内容样式
  detailDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },

  // 运势分类容器样式
  meaningSection: {
    marginBottom: 15,
  },

  // 运势分类标题样式
  meaningCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },

  // 运势详细内容样式
  meaningDetail: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },

  // 建议区域样式
  adviceSection: {
    backgroundColor: '#8B5CF620', // 半透明紫色背景
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },

  // 建议标题样式
  adviceSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },

  // 建议内容样式
  adviceText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
}); 