import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { commonStyles, COLORS } from '../styles/commonStyles';

export default function ZhanBuXiangXi() {
  const nav = useNavigation();
  const route = useRoute();
  
  // 从路由参数获取数据
  const { cards, jieDu, question, isReversed } = route.params || {};

  // 调试信息 - 检查接收到的数据
  console.log('ZhanBuXiangXi 接收到的数据:');
  console.log('cards:', cards);
  console.log('jieDu:', jieDu);
  console.log('question:', question);
  console.log('isReversed:', isReversed);

  return (
    <View style={commonStyles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.backBtnText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>占卜详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 塔罗牌展示 */}
        {cards && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>你的塔罗牌</Text>
            <View style={styles.cardContainer}>
              <View style={styles.cardWrapper}>
                <Text style={styles.cardPosition}>{cards.suit}</Text>
                <Text style={styles.cardPositionStatus}>
                  {isReversed ? '逆位 ↓' : '正位 ↑'}
                </Text>
              </View>
              
              <View style={styles.card}>
                <Text style={styles.cardName}>{cards.name}</Text>
                <Text style={styles.cardElement}>{cards.element}</Text>
              </View>

              {/* 关键词标签 */}
              {jieDu && jieDu.keywords && (
                <View style={styles.cardKeywords}>
                  {jieDu.keywords.slice(0, 3).map((keyword, idx) => (
                    <Text key={idx} style={styles.keyword}>{keyword}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* 详细解读内容 */}
        {jieDu && (
          <View style={styles.detailContent}>
            <Text style={styles.sectionTitle}>🔮 详细解读</Text>
            
            {/* 问题回顾 */}
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>你的问题</Text>
              <Text style={styles.questionText}>"{question || '未设置问题'}"</Text>
            </View>

            {/* 详细牌意解读 */}
            {jieDu.detailedDescription && (
              <View style={styles.meaningSection}>
                <Text style={styles.meaningSectionTitle}>牌意解读</Text>
                <Text style={styles.meaningDescription}>
                  {jieDu.detailedDescription}
                </Text>
              </View>
            )}

            {/* 各领域详细指引 */}
            {jieDu.meaning && (
              <View style={styles.guidanceSection}>
                <Text style={styles.meaningSectionTitle}>详细指引</Text>

                {/* 爱情运势 */}
                {jieDu.meaning.love && (
                  <View style={styles.guidanceItem}>
                    <Text style={styles.guidanceCategory}>💝 爱情运势</Text>
                    <Text style={styles.guidanceText}>
                      {jieDu.meaning.love}
                    </Text>
                  </View>
                )}

                {/* 事业发展 */}
                {jieDu.meaning.career && (
                  <View style={styles.guidanceItem}>
                    <Text style={styles.guidanceCategory}>💼 事业发展</Text>
                    <Text style={styles.guidanceText}>
                      {jieDu.meaning.career}
                    </Text>
                  </View>
                )}

                {/* 财运状况 */}
                {jieDu.meaning.finance && (
                  <View style={styles.guidanceItem}>
                    <Text style={styles.guidanceCategory}>💰 财运状况</Text>
                    <Text style={styles.guidanceText}>
                      {jieDu.meaning.finance}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* 塔罗建议 */}
            {jieDu.meaning?.advice && (
              <View style={styles.adviceSection}>
                <Text style={styles.meaningSectionTitle}>🌟 塔罗建议</Text>
                <Text style={styles.adviceText}>
                  {jieDu.meaning.advice}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 如果没有数据，显示提示 */}
        {!jieDu && (
          <View style={styles.noDataSection}>
            <Text style={styles.noDataText}>
              🔮 暂无解读数据
            </Text>
            <Text style={styles.noDataSubText}>
              请重新进行占卜
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // 头部样式
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 60,
  },

  // 滚动视图样式
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f5ff',
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // 区域标题样式
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
    textAlign: 'center',
  },

  // 卡片区域样式
  cardSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: -10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardContainer: {
    alignItems: 'center',
  },
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  cardPosition: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  cardPositionStatus: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f8f5ff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  cardName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  cardElement: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },

  // 关键词样式
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  keyword: {
    backgroundColor: '#8B5CF6',
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 2,
  },

  // 详细内容区域样式
  detailContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  // 问题回顾样式
  questionSection: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#6B46C1',
    fontStyle: 'italic',
  },

  // 含义解读区域样式
  meaningSection: {
    marginBottom: 20,
  },
  meaningSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
  },
  meaningDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },

  // 指引区域样式
  guidanceSection: {
    marginBottom: 20,
  },
  guidanceItem: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  guidanceCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  // 建议区域样式
  adviceSection: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  adviceText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },

  // 无数据提示样式
  noDataSection: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  noDataText: {
    fontSize: 18,
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  noDataSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})