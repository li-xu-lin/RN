import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const TarotReading = ({ route, navigation }) => {
  const { spreadType = 'single', question } = route.params || {};
  const [revealedCards, setRevealedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const tarotCards = [
    {
      id: 1,
      name: '愚者',
      meaning: '新的开始',
      description: '你正站在人生的新起点，充满无限可能。保持开放的心态，勇敢踏出第一步。',
      keywords: ['新开始', '纯真', '冒险'],
      emoji: '🃏',
      position: 'upright'
    },
    {
      id: 2,
      name: '恋人',
      meaning: '选择与和谐',
      description: '面临重要抉择的时刻。相信你的内心，做出符合价值观的选择。',
      keywords: ['爱情', '选择', '和谐'],
      emoji: '💕',
      position: 'upright'
    },
    {
      id: 3,
      name: '星星',
      meaning: '希望与指引',
      description: '黑暗过后必有光明。保持希望，你的愿望即将实现。',
      keywords: ['希望', '灵感', '治愈'],
      emoji: '⭐',
      position: 'upright'
    }
  ];

  useEffect(() => {
    // 模拟卡牌翻转动画
    const timer = setTimeout(() => {
      setRevealedCards(tarotCards.slice(0, getCardCount()));
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const getCardCount = () => {
    switch (spreadType) {
      case 'single': return 1;
      case 'love': return 3;
      case 'celtic': return 10;
      default: return 1;
    }
  };

  const getSpreadTitle = () => {
    switch (spreadType) {
      case 'single': return '单张指引';
      case 'love': return '爱情三角';
      case 'celtic': return '凯尔特十字';
      default: return '塔罗占卜';
    }
  };

  const renderCard = (card, index) => (
    <TouchableOpacity
      key={card.id}
      onPress={() => setSelectedCard(card)}
      style={[
        styles.cardContainer,
        selectedCard?.id === card.id && styles.selectedCard
      ]}
    >
      <Animated.View style={[styles.tarotCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardMeaning}>{card.meaning}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const renderCardDetail = () => {
    if (!selectedCard) return null;

    return (
      <Card style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailEmoji}>{selectedCard.emoji}</Text>
          <View style={styles.detailInfo}>
            <Text style={styles.detailName}>{selectedCard.name}</Text>
            <Text style={styles.detailMeaning}>{selectedCard.meaning}</Text>
          </View>
        </View>
        
        <Text style={styles.detailDescription}>{selectedCard.description}</Text>
        
        <View style={styles.keywordsContainer}>
          <Text style={styles.keywordsTitle}>关键词：</Text>
          <View style={styles.keywords}>
            {selectedCard.keywords.map((keyword, index) => (
              <View key={index} style={styles.keyword}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header 
        title={`🔮 ${getSpreadTitle()}`}
        rightComponent={
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        }
      />

      {/* 问题显示 */}
      {question && (
        <View style={styles.questionSection}>
          <Card>
            <Text style={styles.questionLabel}>你的问题</Text>
            <Text style={styles.questionText}>"{question}"</Text>
          </Card>
        </View>
      )}

      {/* 卡牌展示 */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>🌟 牌面解读</Text>
        <View style={styles.cardsGrid}>
          {revealedCards.map((card, index) => renderCard(card, index))}
        </View>
        {revealedCards.length === 0 && (
          <View style={styles.loadingCards}>
            <Text style={styles.loadingText}>🔮 正在为你抽取塔罗牌...</Text>
          </View>
        )}
      </View>

      {/* 选中卡牌详情 */}
      {selectedCard && (
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>📖 详细解读</Text>
          {renderCardDetail()}
        </View>
      )}

      {/* 总体建议 */}
      {revealedCards.length > 0 && (
        <View style={styles.adviceSection}>
          <Card>
            <Text style={styles.adviceTitle}>✨ 总体建议</Text>
            <Text style={styles.adviceText}>
              根据你抽到的牌面，现在是一个充满机遇的时期。保持开放的心态，相信自己的直觉，
              勇敢地追求内心真正想要的东西。记住，命运掌握在自己手中。
            </Text>
          </Card>
        </View>
      )}

      {/* 操作按钮 */}
      <View style={styles.actionSection}>
        <Button
          title="💾 保存记录"
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="🔄 重新占卜"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ff',
  },
  questionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  questionLabel: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  cardContainer: {
    marginBottom: 15,
  },
  selectedCard: {
    transform: [{ scale: 1.05 }],
  },
  tarotCard: {
    width: 100,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B46C1',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardMeaning: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingCards: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  detailSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  detailCard: {
    padding: 25,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  detailMeaning: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  keywordsContainer: {
    marginTop: 10,
  },
  keywordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyword: {
    backgroundColor: '#f8f5ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  keywordText: {
    fontSize: 14,
    color: '#6B46C1',
    fontWeight: '500',
  },
  adviceSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
  },
  adviceText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
    gap: 15,
  },
  actionButton: {
    marginBottom: 10,
  },
  shareIcon: {
    fontSize: 18,
  },
});

export default TarotReading; 