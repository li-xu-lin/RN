import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';

export default function ZhanBuXiangXi() {
  const nav = useNavigation();
  const route = useRoute();
  
  // 从路由参数获取数据
  const { cards, jieDu, question, isReversed } = route.params || {};


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
    backgroundColor: '#8b5cf6',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },

  // 滚动视图样式
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // 区域标题样式
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  // 卡片区域样式
  cardSection: {
    ...commonStyles.card,
    margin: 15,
    marginTop: -10,
  },
  cardContainer: {
    alignItems: 'center',
  },
  cardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  cardPosition: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'normal',
  },
  cardPositionStatus: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'normal',
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardElement: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
  },

  // 关键词样式
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  keyword: {
    backgroundColor: '#8b5cf6',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'normal',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    marginHorizontal: 3,
    marginVertical: 2,
  },

  // 详细内容区域样式
  detailContent: {
    ...commonStyles.card,
    margin: 15,
  },

  // 问题回顾样式
  questionSection: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: SIZES.radius,
    marginBottom: 15,
  },
  questionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'normal',
  },

  // 含义解读区域样式
  meaningSection: {
    marginBottom: 15,
  },
  meaningSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meaningDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    textAlign: 'left',
  },

  // 指引区域样式
  guidanceSection: {
    marginBottom: 15,
  },
  guidanceItem: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: SIZES.radius,
    marginBottom: 8,
  },
  guidanceCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  guidanceText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },

  // 建议区域样式
  adviceSection: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: SIZES.radius,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  adviceText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    textAlign: 'left',
  },

  // 无数据提示样式
  noDataSection: {
    ...commonStyles.card,
    alignItems: 'center',
    padding: 30,
    margin: 15,
  },
  noDataText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  noDataSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})