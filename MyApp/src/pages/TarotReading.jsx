import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Dimensions,
  Modal,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { drawTarotCardApi } from '../request/auth';


const { width, height } = Dimensions.get('window');

const TarotReading = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drawnCard, setDrawnCard] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);


  // 预设问题
  const suggestedQuestions = [
    '我的爱情运势如何？',
    '我的事业发展方向是什么？',
    '我需要注意什么问题？',
    '我应该如何做出这个决定？',
    '我的财运状况怎么样？',
    '我的健康状况如何？'
  ];

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user');
      if (userObj) {
        setUser(JSON.parse(userObj));
      }
    } catch (error) {

    }
  };

  const handleDrawCard = async () => {
    if (!user?._id) {
      Alert.alert('提示', '请先登录账户');
      return;
    }

    if (!question.trim()) {
      Alert.alert('提示', '请输入你的问题或选择一个预设问题');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await drawTarotCardApi(user._id, question);
      
      if (result.success) {
        const { card, interpretation } = result.data.data.result;
        setDrawnCard(card);
        setInterpretation(interpretation);
        setShowResult(true);
        

        
        Alert.alert(
          '占卜完成 ✨',
          `为你抽到了${card.name}（${card.position === 'upright' ? '正位' : '逆位'}）`,
          [{ text: '查看解读', style: 'default' }]
        );
      } else {
        Alert.alert('占卜失败', result.data?.msg || '请稍后重试');
      }
    } catch (error) {
      Alert.alert('占卜失败', '网络连接异常，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const resetReading = () => {
    setDrawnCard(null);
    setInterpretation(null);
    setShowResult(false);
    setQuestion('');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.title}>塔罗占卜 🔮</Text>
        <Text style={styles.subtitle}>倾听内心的声音，寻找人生的答案</Text>
      </View>
    </View>
  );

  const renderQuestionSection = () => (
    <View style={styles.questionSection}>
      <Text style={styles.sectionTitle}>你想问什么？</Text>
      
      {/* 预设问题 */}
      <View style={styles.suggestedQuestions}>
        <Text style={styles.suggestedTitle}>热门问题：</Text>
        <View style={styles.questionTags}>
          {suggestedQuestions.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.questionTag,
                question === q && styles.selectedTag
              ]}
              onPress={() => setQuestion(q)}
            >
              <Text style={[
                styles.questionTagText,
                question === q && styles.selectedTagText
              ]}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 自定义问题输入 */}
      <View style={styles.customQuestion}>
        <Text style={styles.customQuestionTitle}>或者输入你的问题：</Text>
        <TextInput
          style={styles.questionInput}
          placeholder="请输入你想要占卜的问题..."
          placeholderTextColor="#999"
          value={question}
          onChangeText={setQuestion}
        />
        <Text style={styles.charCount}>{question.length}/200</Text>
      </View>
    </View>
  );

  const renderDrawButton = () => (
    <View style={styles.drawButtonContainer}>
      <TouchableOpacity
        style={[styles.drawButton, isLoading && styles.drawButtonDisabled]}
        onPress={handleDrawCard}
        disabled={isLoading}
      >
        <Text style={styles.drawButtonText}>{isLoading ? '占卜中... ✨' : '开始占卜 🎴'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCardBack = () => (
    <View style={styles.cardBack}>
      <Text style={styles.cardBackText}>🔮</Text>
      <Text style={styles.cardBackLabel}>点击翻牌</Text>
    </View>
  );

  const renderCardFront = () => {
    if (!drawnCard) return null;
    
    const isReversed = drawnCard.position === 'reversed';
    
    return (
      <View style={[styles.cardFront, isReversed && styles.cardReversed]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardSuit}>{drawnCard.suit}</Text>
          <Text style={[
            styles.cardPosition,
            { color: isReversed ? '#FF6B9D' : '#8B5CF6' }
          ]}>
            {isReversed ? '逆位 ↓' : '正位 ↑'}
          </Text>
        </View>
        <Text style={styles.cardName}>{drawnCard.name}</Text>
        <Text style={styles.cardElement}>{drawnCard.element}元素</Text>
        
        {interpretation && (
          <View style={styles.cardKeywords}>
            {interpretation.keywords?.slice(0, 3).map((keyword, idx) => (
              <Text key={idx} style={styles.keyword}>{keyword}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCard = () => {
    if (!showResult) return null;

    return (
      <View style={styles.cardContainer}>
        <Text style={styles.cardSectionTitle}>你的塔罗牌</Text>
        
        <TouchableOpacity
          style={styles.card}
          onPress={() => setShowDetailModal(true)}
        >
          {renderCardFront()}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewDetailButton}
          onPress={() => setShowDetailModal(true)}
        >
          <Text style={styles.viewDetailText}>查看详细解读 →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuickInterpretation = () => {
    if (!showResult || !interpretation) return null;

    return (
      <View style={styles.quickInterpretation}>
        <Text style={styles.sectionTitle}>快速解读</Text>
        <View style={styles.interpretationCard}>
          <Text style={styles.shortDescription}>
            {interpretation.shortDescription}
          </Text>
          <View style={styles.meaningPreview}>
            <Text style={styles.meaningTitle}>💝 爱情：</Text>
            <Text style={styles.meaningText}>{interpretation.meaning?.love}</Text>
          </View>
          <View style={styles.meaningPreview}>
            <Text style={styles.meaningTitle}>💼 事业：</Text>
            <Text style={styles.meaningText}>{interpretation.meaning?.career}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderActionButtons = () => {
    if (!showResult) return null;

    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.resetButton} onPress={resetReading}>
          <Text style={styles.resetButtonText}>重新占卜</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.detailButton} 
          onPress={() => setShowDetailModal(true)}
        >
          <Text style={styles.detailButtonText}>详细解读</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDetailModal = () => {
    if (!drawnCard || !interpretation) return null;

    const isReversed = drawnCard.position === 'reversed';

    return (
      <Modal
        visible={showDetailModal}
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{drawnCard.name}</Text>
              <Text style={styles.modalSubtitle}>
                {drawnCard.suit} • {isReversed ? '逆位' : '正位'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setShowDetailModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* 问题回顾 */}
            <View style={styles.questionReview}>
              <Text style={styles.reviewTitle}>你的问题</Text>
              <Text style={styles.reviewQuestion}>"{question}"</Text>
            </View>

            {/* 关键词 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>关键词</Text>
              <View style={styles.keywordsList}>
                {interpretation.keywords?.map((keyword, idx) => (
                  <Text key={idx} style={styles.detailKeyword}>{keyword}</Text>
                ))}
              </View>
            </View>

            {/* 详细描述 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>牌意解读</Text>
              <Text style={styles.detailDescription}>
                {interpretation.detailedDescription}
              </Text>
            </View>

            {/* 各领域解读 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>详细指引</Text>
              
              <View style={styles.meaningSection}>
                <Text style={styles.meaningCategory}>💝 爱情运势</Text>
                <Text style={styles.meaningDetail}>{interpretation.meaning?.love}</Text>
              </View>

              <View style={styles.meaningSection}>
                <Text style={styles.meaningCategory}>💼 事业发展</Text>
                <Text style={styles.meaningDetail}>{interpretation.meaning?.career}</Text>
              </View>

              <View style={styles.meaningSection}>
                <Text style={styles.meaningCategory}>💰 财运状况</Text>
                <Text style={styles.meaningDetail}>{interpretation.meaning?.finance}</Text>
              </View>

              <View style={styles.meaningSection}>
                <Text style={styles.meaningCategory}>🌿 健康状况</Text>
                <Text style={styles.meaningDetail}>{interpretation.meaning?.health}</Text>
              </View>
            </View>

            {/* 建议 */}
            {interpretation.meaning?.advice && (
              <View style={styles.adviceSection}>
                <Text style={styles.adviceSectionTitle}>🌟 塔罗建议</Text>
                <Text style={styles.adviceText}>{interpretation.meaning.advice}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        
        {!showResult && (
          <>
            {renderQuestionSection()}
            {renderDrawButton()}
          </>
        )}

        {renderCard()}
        {renderQuickInterpretation()}
        {renderActionButtons()}
      </ScrollView>

      {renderDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'linear-gradient(135deg, #8B5CF6, #FF6B9D)',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 999,
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonText: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContent: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  questionSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  suggestedQuestions: {
    marginBottom: 20,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  questionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  questionTag: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  questionTagText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTagText: {
    color: '#FFF',
  },
  customQuestion: {
    marginTop: 10,
  },
  customQuestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  questionInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  drawButtonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  drawButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  drawButtonDisabled: {
    opacity: 0.7,
  },
  drawButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: 20,
    alignItems: 'center',
  },
  cardSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    width: width * 0.6,
    height: width * 0.9,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardBack: {
    flex: 1,
    backgroundColor: '#4C1D95',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  cardBackText: {
    fontSize: 60,
    marginBottom: 10,
  },
  cardBackLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  cardReversed: {

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  cardSuit: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  cardPosition: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardElement: {
    fontSize: 16,
    color: '#8B5CF6',
    marginBottom: 20,
  },
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  keyword: {
    fontSize: 12,
    color: '#8B5CF6',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  viewDetailButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewDetailText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickInterpretation: {
    padding: 20,
    paddingTop: 0,
  },
  interpretationCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shortDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  meaningPreview: {
    marginBottom: 10,
  },
  meaningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal 样式
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  questionReview: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  reviewQuestion: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  detailSection: {
    marginBottom: 25,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailKeyword: {
    fontSize: 14,
    color: '#8B5CF6',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detailDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  meaningSection: {
    marginBottom: 15,
  },
  meaningCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  meaningDetail: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  adviceSection: {
    backgroundColor: '#8B5CF620',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  adviceSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  adviceText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default TarotReading; 