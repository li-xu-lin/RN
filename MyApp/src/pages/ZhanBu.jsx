import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, COLORS } from '../styles/commonStyles';
import { addCardApi } from '../request/auth';

export default function ZhanBu() {
  const nav = useNavigation();
  // 用户信息
  const [user, setUser] = useState(null);
  // 问题
  const [wenTi, setWenTi] = useState('');
  // 是否加载中
  const [isLoading, setIsLoading] = useState(false);

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
    setUser(JSON.parse(await AsyncStorage.getItem('user')));
  };



  const cardFn = async () => {

    if (!wenTi.trim()) {
      Alert.alert('提示', '请输入你的问题或选择一个预设问题');
      return;
    }

    setIsLoading(true);

    try {
      const res = await addCardApi(user._id, wenTi);

      if (res.success) {
        // 从 API 返回数据中提取信息
        const apiData = res.data.data.result;
        // 直接使用后端返回的数据
        const card = apiData.card;
        const jieDu = apiData.interpretation;

        // 判断是否为逆位
        const isReversed = card?.position === 'reversed';
        // 直接跳转到详情页面显示结果
        nav.navigate('ZhanBuXiangXi', {
          cards: card,
          jieDu: jieDu,
          question: wenTi,
          isReversed: isReversed
        });
      } else {
        // 占卜失败时显示错误信息
        Alert.alert('占卜失败', res.data?.msg || '请稍后重试');
      }
    } catch (error) {
      // 网络错误或其他异常
      Alert.alert('占卜失败', '网络连接异常，请稍后重试');
    } finally {
      // 无论成功失败都要结束加载状态
      setIsLoading(false);
    }
  };


  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => nav.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>塔罗占卜 🔮</Text>
            <Text style={styles.subtitle}>倾听内心的声音，寻找人生的答案</Text>
          </View>
        </View>

        <>
          <View style={styles.questionSection}>
            <Text style={styles.sectionTitle}>你想问什么？</Text>

            <View style={styles.yuShe}>
              <Text style={styles.suggestedTitle}>热门问题：</Text>
              <View style={styles.questionTags}>
                {yuShe.map((q, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.questionTag,
                      wenTi === q && styles.selectedTag
                    ]}
                    onPress={() => setWenTi(q)}
                  >
                    <Text style={[
                      styles.questionTagText,
                      wenTi === q && styles.selectedTagText
                    ]}>
                      {q}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.customQuestion}>
              <Text style={styles.customQuestionTitle}>或者输入你的问题：</Text>
              <TextInput
                style={styles.questionInput}
                placeholder="请输入你想要占卜的问题..."
                placeholderTextColor="#999"
                value={wenTi}
                onChangeText={setWenTi}
              />
            </View>
          </View>

          <View style={styles.drawButtonContainer}>
            <TouchableOpacity
              style={[
                styles.drawButton,
                isLoading && styles.drawButtonDisabled
              ]}
              onPress={cardFn}
              disabled={isLoading}
            >
              <Text style={styles.drawButtonText}>
                {isLoading ? '占卜中... ✨' : '开始占卜 🎴'}
              </Text>
            </TouchableOpacity>
          </View>
        </>


      </ScrollView>



    </View>
  );
};


const styles = StyleSheet.create({

  header: {
    ...commonStyles.padding,
    paddingTop: 60,
    backgroundColor: '#8B5CF6',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 999,
    backgroundColor: COLORS.white,
    width: 36,
    height: 36,
    borderRadius: 18,
    ...commonStyles.centerContainer,
  },

  backButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
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

  yuShe: {
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

  drawButtonContainer: {
    padding: 20,
    paddingTop: 0,
  },

  drawButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
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
    width: 200,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
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


}); 