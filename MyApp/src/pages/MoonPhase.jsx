import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MoonPhase() {
  const nav = useNavigation();
  const [selectedPhase, setSelectedPhase] = useState('waxing_crescent');

  const moonPhases = [
    { id: 'new_moon', name: '新月', emoji: '🌑', energy: '新开始', desc: '种下愿望的种子' },
    { id: 'waxing_crescent', name: '峨眉月', emoji: '🌒', energy: '成长', desc: '努力会有回报' },
    { id: 'first_quarter', name: '上弦月', emoji: '🌓', energy: '决断', desc: '做出重要选择' },
    { id: 'waxing_gibbous', name: '盈凸月', emoji: '🌔', energy: '完善', desc: '细化你的计划' },
    { id: 'full_moon', name: '满月', emoji: '🌕', energy: '圆满', desc: '收获和庆祝' },
    { id: 'waning_gibbous', name: '亏凸月', emoji: '🌖', energy: '感恩', desc: '回顾和反思' },
    { id: 'last_quarter', name: '下弦月', emoji: '🌗', energy: '释放', desc: '放下不需要的' },
    { id: 'waning_crescent', name: '残月', emoji: '🌘', energy: '清理', desc: '为新开始做准备' }
  ];

  const getCurrentPhase = () => {
    return moonPhases.find(phase => phase.id === selectedPhase) || moonPhases[1];
  };

  const currentPhase = getCurrentPhase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🌙 月相占卜</Text>
        <TouchableOpacity style={styles.calendarBtn}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {/* 当前月相 */}
      <View style={styles.currentSection}>
        <View style={styles.currentCard}>
          <Text style={styles.currentTitle}>当前月相</Text>
          <View style={styles.phaseDisplay}>
            <Text style={styles.phaseEmoji}>{currentPhase.emoji}</Text>
            <Text style={styles.phaseName}>{currentPhase.name}</Text>
          </View>
          <Text style={styles.phaseEnergy}>能量：{currentPhase.energy}</Text>
          <Text style={styles.phaseDesc}>{currentPhase.desc}</Text>
        </View>
      </View>

      {/* 月相选择 */}
      <View style={styles.phaseSection}>
        <Text style={styles.sectionTitle}>选择月相</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.phaseGrid}>
            {moonPhases.map((phase) => (
              <TouchableOpacity
                key={phase.id}
                style={[
                  styles.phaseItem,
                  selectedPhase === phase.id && styles.phaseSelected
                ]}
                onPress={() => setSelectedPhase(phase.id)}
              >
                <Text style={styles.phaseItemEmoji}>{phase.emoji}</Text>
                <Text style={styles.phaseItemName}>{phase.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 月相指引 */}
      <View style={styles.guidanceSection}>
        <Text style={styles.sectionTitle}>🌟 月相指引</Text>
        <View style={styles.guidanceCard}>
          <View style={styles.guidanceHeader}>
            <Text style={styles.guidanceTitle}>{currentPhase.name}能量指引</Text>
            <Text style={styles.guidanceEmoji}>{currentPhase.emoji}</Text>
          </View>
          
          <View style={styles.guidanceContent}>
            <View style={styles.guidanceItem}>
              <Text style={styles.guidanceLabel}>💝 适合做的事</Text>
              <Text style={styles.guidanceText}>
                {currentPhase.id === 'new_moon' && '设定新目标、制定计划、冥想反思'}
                {currentPhase.id === 'waxing_crescent' && '采取行动、学习新技能、开始项目'}
                {currentPhase.id === 'first_quarter' && '做出决定、解决问题、克服障碍'}
                {currentPhase.id === 'waxing_gibbous' && '完善细节、调整计划、持续努力'}
                {currentPhase.id === 'full_moon' && '庆祝成就、感恩收获、表达情感'}
                {currentPhase.id === 'waning_gibbous' && '分享智慧、回顾总结、表达感谢'}
                {currentPhase.id === 'last_quarter' && '释放压力、断舍离、原谅和解'}
                {currentPhase.id === 'waning_crescent' && '休息恢复、清理整顿、准备新开始'}
              </Text>
            </View>

            <View style={styles.guidanceItem}>
              <Text style={styles.guidanceLabel}>🚫 避免做的事</Text>
              <Text style={styles.guidanceText}>
                {currentPhase.id === 'new_moon' && '匆忙决定、消极思考、开始争执'}
                {currentPhase.id === 'waxing_crescent' && '拖延懒散、自我怀疑、放弃努力'}
                {currentPhase.id === 'first_quarter' && '犹豫不决、逃避现实、固执己见'}
                {currentPhase.id === 'waxing_gibbous' && '急于求成、忽视细节、缺乏耐心'}
                {currentPhase.id === 'full_moon' && '过度激动、冲动决定、情绪失控'}
                {currentPhase.id === 'waning_gibbous' && '过度批评、保守封闭、拒绝改变'}
                {currentPhase.id === 'last_quarter' && '紧抓不放、怨恨抱怨、消极对待'}
                {currentPhase.id === 'waning_crescent' && '强迫自己、过度活跃、开始新项目'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 水晶推荐 */}
      <View style={styles.crystalSection}>
        <Text style={styles.sectionTitle}>💎 推荐水晶</Text>
        <View style={styles.crystalGrid}>
          <View style={styles.crystalCard}>
            <Text style={styles.crystalEmoji}>🔮</Text>
            <Text style={styles.crystalName}>月光石</Text>
            <Text style={styles.crystalDesc}>增强直觉力</Text>
          </View>
          <View style={styles.crystalCard}>
            <Text style={styles.crystalEmoji}>💜</Text>
            <Text style={styles.crystalName}>紫水晶</Text>
            <Text style={styles.crystalDesc}>平静心灵</Text>
          </View>
          <View style={styles.crystalCard}>
            <Text style={styles.crystalEmoji}>🤍</Text>
            <Text style={styles.crystalName}>白水晶</Text>
            <Text style={styles.crystalDesc}>净化能量</Text>
          </View>
          <View style={styles.crystalCard}>
            <Text style={styles.crystalEmoji}>🖤</Text>
            <Text style={styles.crystalName}>黑曜石</Text>
            <Text style={styles.crystalDesc}>保护屏障</Text>
          </View>
        </View>
      </View>

      {/* 月相仪式 */}
      <View style={styles.ritualSection}>
        <Text style={styles.sectionTitle}>🕯️ 月相仪式</Text>
        <View style={styles.ritualCard}>
          <Text style={styles.ritualTitle}>今晚的月亮仪式</Text>
          <View style={styles.ritualSteps}>
            <View style={styles.ritualStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>找一个安静的地方，点燃一支蜡烛</Text>
            </View>
            <View style={styles.ritualStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>深呼吸三次，感受月亮的能量</Text>
            </View>
            <View style={styles.ritualStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>写下你的愿望或想要释放的事物</Text>
            </View>
            <View style={styles.ritualStep}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>对月亮表达感谢，感受其祝福</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ff',
  },
  
  // 头部
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  calendarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 18,
  },

  // 当前月相
  currentSection: {
    paddingHorizontal: 20,
    marginTop: -10,
  },
  currentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  currentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
  },
  phaseDisplay: {
    alignItems: 'center',
    marginBottom: 15,
  },
  phaseEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  phaseName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  phaseEnergy: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 8,
  },
  phaseDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // 月相选择
  phaseSection: {
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  phaseGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  phaseItem: {
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  phaseSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#f8f5ff',
  },
  phaseItemEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  phaseItemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  // 指引
  guidanceSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  guidanceCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  guidanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  guidanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  guidanceEmoji: {
    fontSize: 32,
  },
  guidanceContent: {
    gap: 20,
  },
  guidanceItem: {
    backgroundColor: '#f8f5ff',
    padding: 15,
    borderRadius: 12,
  },
  guidanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // 水晶推荐
  crystalSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  crystalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  crystalCard: {
    width: 160,
    height: 130,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
  },
  crystalEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  crystalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  crystalDesc: {
    fontSize: 12,
    color: '#8B5CF6',
    textAlign: 'center',
  },

  // 仪式
  ritualSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  ritualCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  ritualTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  ritualSteps: {
    gap: 15,
  },
  ritualStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8B5CF6',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 15,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 30,
  },
}); 