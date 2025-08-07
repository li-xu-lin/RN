import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function Tarot() {
    const nav = useNavigation()
    const [selectedSpread, setSelectedSpread] = useState('single')

    const tarotSpreads = [
        { id: 'single', name: '单张占卜', desc: '简单快速的指引', icon: '🎯' },
        { id: 'love', name: '爱情三角', desc: '情感关系解析', icon: '💕' },
        { id: 'celtic', name: '凯尔特十字', desc: '全面人生指导', icon: '✨' },
        { id: 'career', name: '事业发展', desc: '职场运势分析', icon: '🎯' }
    ]

    const recentReadings = [
        {
            id: 1,
            type: '爱情占卜',
            card: '恋人',
            result: '新的恋情即将到来',
            date: '今天 15:30',
            score: 85
        },
        {
            id: 2,
            type: '事业占卜',
            card: '权杖王牌',
            result: '事业有新的机会',
            date: '昨天 20:15',
            score: 78
        }
    ]

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 头部 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🔮 塔罗占卜</Text>
                <TouchableOpacity style={styles.helpBtn}>
                    <Text style={styles.helpIcon}>❓</Text>
                </TouchableOpacity>
            </View>

            {/* 今日塔罗 */}
            <View style={styles.dailySection}>
                <View style={styles.dailyCard}>
                    <View style={styles.dailyHeader}>
                        <Text style={styles.dailyTitle}>✨ 今日塔罗指引</Text>
                        <Text style={styles.dailyDate}>{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</Text>
                    </View>
                    <View style={styles.dailyContent}>
                        <View style={styles.cardDisplay}>
                            <View style={styles.tarotCard}>
                                <Text style={styles.cardSymbol}>🌟</Text>
                                <Text style={styles.cardName}>星星</Text>
                            </View>
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardMeaning}>希望与指引</Text>
                            <Text style={styles.cardDesc}>今天是充满希望的一天，相信自己的直觉，美好的事情即将发生。</Text>
                            <TouchableOpacity style={styles.detailBtn}>
                                <Text style={styles.detailText}>查看详情</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* 占卜类型选择 */}
            <View style={styles.spreadSection}>
                <Text style={styles.sectionTitle}>🎯 选择占卜方式</Text>
                <View style={styles.spreadGrid}>
                    {tarotSpreads.map((spread) => (
                        <TouchableOpacity 
                            key={spread.id}
                            style={[
                                styles.spreadItem,
                                selectedSpread === spread.id && styles.spreadSelected
                            ]}
                            onPress={() => setSelectedSpread(spread.id)}
                        >
                            <Text style={styles.spreadIcon}>{spread.icon}</Text>
                            <Text style={styles.spreadName}>{spread.name}</Text>
                            <Text style={styles.spreadDesc}>{spread.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* 开始占卜按钮 */}
            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.startBtn}>
                    <Text style={styles.startText}>🔮 开始占卜</Text>
                </TouchableOpacity>
                <Text style={styles.actionNote}>静心思考你的问题，然后点击开始</Text>
            </View>

            {/* 塔罗牌知识 */}
            <View style={styles.knowledgeSection}>
                <Text style={styles.sectionTitle}>📚 塔罗牌知识</Text>
                <View style={styles.knowledgeGrid}>
                    <TouchableOpacity style={styles.knowledgeItem}>
                        <View style={styles.knowledgeIcon}>
                            <Text style={styles.knowledgeEmoji}>🃏</Text>
                        </View>
                        <Text style={styles.knowledgeTitle}>大阿卡纳</Text>
                        <Text style={styles.knowledgeDesc}>22张主牌含义</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.knowledgeItem}>
                        <View style={styles.knowledgeIcon}>
                            <Text style={styles.knowledgeEmoji}>⚔️</Text>
                        </View>
                        <Text style={styles.knowledgeTitle}>小阿卡纳</Text>
                        <Text style={styles.knowledgeDesc}>四大花色解析</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.knowledgeItem}>
                        <View style={styles.knowledgeIcon}>
                            <Text style={styles.knowledgeEmoji}>🔄</Text>
                        </View>
                        <Text style={styles.knowledgeTitle}>牌阵大全</Text>
                        <Text style={styles.knowledgeDesc}>常用牌阵介绍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.knowledgeItem}>
                        <View style={styles.knowledgeIcon}>
                            <Text style={styles.knowledgeEmoji}>📖</Text>
                        </View>
                        <Text style={styles.knowledgeTitle}>解牌技巧</Text>
                        <Text style={styles.knowledgeDesc}>提升解读能力</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 最近占卜记录 */}
            <View style={styles.historySection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>📋 最近占卜</Text>
                    <TouchableOpacity>
                        <Text style={styles.moreBtn}>全部记录 {'>'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.historyList}>
                    {recentReadings.map((reading) => (
                        <TouchableOpacity key={reading.id} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <Text style={styles.historyEmoji}>🔮</Text>
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyType}>{reading.type}</Text>
                                <Text style={styles.historyCard}>抽到：{reading.card}</Text>
                                <Text style={styles.historyResult}>{reading.result}</Text>
                                <Text style={styles.historyDate}>{reading.date}</Text>
                            </View>
                            <View style={styles.historyScore}>
                                <Text style={styles.scoreText}>{reading.score}分</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f5ff",
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
    helpBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpIcon: {
        fontSize: 16,
    },
    // 今日塔罗
    dailySection: {
        paddingHorizontal: 20,
        marginTop: -10,
    },
    dailyCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    dailyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dailyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
    },
    dailyDate: {
        fontSize: 14,
        color: '#8B5CF6',
        fontWeight: '500',
    },
    dailyContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardDisplay: {
        marginRight: 20,
    },
    tarotCard: {
        width: 80,
        height: 120,
        backgroundColor: '#f8f5ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8B5CF6',
    },
    cardSymbol: {
        fontSize: 32,
        marginBottom: 8,
    },
    cardName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B46C1',
    },
    cardInfo: {
        flex: 1,
    },
    cardMeaning: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    detailBtn: {
        alignSelf: 'flex-start',
    },
    detailText: {
        fontSize: 14,
        color: '#8B5CF6',
        fontWeight: '600',
    },
    // 占卜类型
    spreadSection: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
    },
    spreadGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    spreadItem: {
        width: 160,
        height: 140,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        justifyContent: 'center',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    spreadSelected: {
        borderColor: '#8B5CF6',
        backgroundColor: '#f8f5ff',
    },
    spreadIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    spreadName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    spreadDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    // 操作区域
    actionSection: {
        paddingHorizontal: 20,
        marginTop: 25,
        alignItems: 'center',
    },
    startBtn: {
        backgroundColor: '#8B5CF6',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 50,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    startText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    actionNote: {
        fontSize: 14,
        color: '#666',
        marginTop: 12,
        textAlign: 'center',
    },
    // 知识区域
    knowledgeSection: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    knowledgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    knowledgeItem: {
        width: 160,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        justifyContent: 'center',
    },
    knowledgeIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f8f5ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    knowledgeEmoji: {
        fontSize: 24,
    },
    knowledgeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    knowledgeDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    // 历史记录
    historySection: {
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    moreBtn: {
        fontSize: 14,
        color: '#8B5CF6',
        fontWeight: '500',
    },
    historyList: {
        gap: 12,
    },
    historyItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    historyIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f8f5ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    historyEmoji: {
        fontSize: 20,
    },
    historyInfo: {
        flex: 1,
    },
    historyType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    historyCard: {
        fontSize: 14,
        color: '#8B5CF6',
        marginBottom: 4,
        fontWeight: '500',
    },
    historyResult: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    historyDate: {
        fontSize: 12,
        color: '#999',
    },
    historyScore: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B9D',
    },
}) 