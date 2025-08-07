import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

export default function Zodiac() {
    const nav = useNavigation()
    const [selectedZodiac, setSelectedZodiac] = useState('aries')

    const zodiacSigns = [
        { id: 'aries', name: '白羊座', icon: '♈', date: '3.21-4.19', element: '火', color: '#FF6B6B' },
        { id: 'taurus', name: '金牛座', icon: '♉', date: '4.20-5.20', element: '土', color: '#4ECDC4' },
        { id: 'gemini', name: '双子座', icon: '♊', date: '5.21-6.21', element: '风', color: '#45B7D1' },
        { id: 'cancer', name: '巨蟹座', icon: '♋', date: '6.22-7.22', element: '水', color: '#96CEB4' },
        { id: 'leo', name: '狮子座', icon: '♌', date: '7.23-8.22', element: '火', color: '#FECA57' },
        { id: 'virgo', name: '处女座', icon: '♍', date: '8.23-9.22', element: '土', color: '#48CAE4' },
        { id: 'libra', name: '天秤座', icon: '♎', date: '9.23-10.23', element: '风', color: '#FF9F43' },
        { id: 'scorpio', name: '天蝎座', icon: '♏', date: '10.24-11.22', element: '水', color: '#6C5CE7' },
        { id: 'sagittarius', name: '射手座', icon: '♐', date: '11.23-12.21', element: '火', color: '#A29BFE' },
        { id: 'capricorn', name: '摩羯座', icon: '♑', date: '12.22-1.19', element: '土', color: '#6C5CE7' },
        { id: 'aquarius', name: '水瓶座', icon: '♒', date: '1.20-2.18', element: '风', color: '#74B9FF' },
        { id: 'pisces', name: '双鱼座', icon: '♓', date: '2.19-3.20', element: '水', color: '#FD79A8' }
    ]

    const getCurrentZodiac = () => {
        return zodiacSigns.find(sign => sign.id === selectedZodiac)
    }

    const fortuneData = {
        overall: 85,
        love: 78,
        career: 92,
        money: 75,
        health: 88
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 头部 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>⭐ 星座运势</Text>
                <TouchableOpacity style={styles.calendarBtn}>
                    <Text style={styles.calendarIcon}>📅</Text>
                </TouchableOpacity>
            </View>

            {/* 星座选择 */}
            <View style={styles.zodiacSection}>
                <Text style={styles.sectionTitle}>选择你的星座</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.zodiacScroll}>
                    {zodiacSigns.map((sign) => (
                        <TouchableOpacity
                            key={sign.id}
                            style={[
                                styles.zodiacItem,
                                selectedZodiac === sign.id && styles.zodiacSelected,
                                { borderColor: sign.color }
                            ]}
                            onPress={() => setSelectedZodiac(sign.id)}
                        >
                            <Text style={styles.zodiacIcon}>{sign.icon}</Text>
                            <Text style={styles.zodiacName}>{sign.name}</Text>
                            <Text style={styles.zodiacDate}>{sign.date}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 今日运势总览 */}
            <View style={styles.todaySection}>
                <View style={styles.todayCard}>
                    <View style={styles.todayHeader}>
                        <View style={styles.todayLeft}>
                            <Text style={[styles.todayZodiacIcon, { color: getCurrentZodiac()?.color }]}>
                                {getCurrentZodiac()?.icon}
                            </Text>
                            <View>
                                <Text style={styles.todayZodiacName}>{getCurrentZodiac()?.name}</Text>
                                <Text style={styles.todayDate}>
                                    {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} 运势
                                </Text>
                            </View>
                        </View>
                        <View style={styles.todayScore}>
                            <Text style={styles.scoreNumber}>{fortuneData.overall}</Text>
                            <Text style={styles.scoreLabel}>综合指数</Text>
                        </View>
                    </View>
                    <Text style={styles.todayDesc}>
                        今天是充满机遇的一天，保持积极的心态，好运会主动找上你。在人际关系方面要多一些耐心。
                    </Text>
                </View>
            </View>

            {/* 运势详情 */}
            <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>详细运势</Text>
                <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>💕</Text>
                        <Text style={styles.detailLabel}>爱情运势</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${fortuneData.love}%`, backgroundColor: '#FF6B9D' }]} />
                        </View>
                        <Text style={styles.detailScore}>{fortuneData.love}分</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🎯</Text>
                        <Text style={styles.detailLabel}>事业运势</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${fortuneData.career}%`, backgroundColor: '#4ECDC4' }]} />
                        </View>
                        <Text style={styles.detailScore}>{fortuneData.career}分</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>💰</Text>
                        <Text style={styles.detailLabel}>财富运势</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${fortuneData.money}%`, backgroundColor: '#FECA57' }]} />
                        </View>
                        <Text style={styles.detailScore}>{fortuneData.money}分</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>🍀</Text>
                        <Text style={styles.detailLabel}>健康运势</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${fortuneData.health}%`, backgroundColor: '#96CEB4' }]} />
                        </View>
                        <Text style={styles.detailScore}>{fortuneData.health}分</Text>
                    </View>
                </View>
            </View>

            {/* 本周预测 */}
            <View style={styles.weeklySection}>
                <Text style={styles.sectionTitle}>本周运势预测</Text>
                <View style={styles.weeklyCard}>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周一</Text>
                        <Text style={styles.weeklyIcon}>⭐</Text>
                        <Text style={styles.weeklyScore}>85</Text>
                    </View>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周二</Text>
                        <Text style={styles.weeklyIcon}>🌟</Text>
                        <Text style={styles.weeklyScore}>92</Text>
                    </View>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周三</Text>
                        <Text style={styles.weeklyIcon}>✨</Text>
                        <Text style={styles.weeklyScore}>78</Text>
                    </View>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周四</Text>
                        <Text style={styles.weeklyIcon}>💫</Text>
                        <Text style={styles.weeklyScore}>88</Text>
                    </View>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周五</Text>
                        <Text style={styles.weeklyIcon}>🌠</Text>
                        <Text style={styles.weeklyScore}>95</Text>
                    </View>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周六</Text>
                        <Text style={styles.weeklyIcon}>⭐</Text>
                        <Text style={styles.weeklyScore}>82</Text>
                    </View>
                    <View style={styles.weeklyItem}>
                        <Text style={styles.weeklyDay}>周日</Text>
                        <Text style={styles.weeklyIcon}>🌟</Text>
                        <Text style={styles.weeklyScore}>90</Text>
                    </View>
                </View>
            </View>

            {/* 星座配对 */}
            <View style={styles.matchSection}>
                <Text style={styles.sectionTitle}>星座配对</Text>
                <View style={styles.matchCard}>
                    <View style={styles.matchHeader}>
                        <Text style={styles.matchTitle}>本周最佳配对</Text>
                        <Text style={styles.matchPercent}>92%</Text>
                    </View>
                    <View style={styles.matchContent}>
                        <View style={styles.matchZodiac}>
                            <Text style={styles.matchIcon}>{getCurrentZodiac()?.icon}</Text>
                            <Text style={styles.matchName}>{getCurrentZodiac()?.name}</Text>
                        </View>
                        <Text style={styles.matchSymbol}>💕</Text>
                        <View style={styles.matchZodiac}>
                            <Text style={styles.matchIcon}>♎</Text>
                            <Text style={styles.matchName}>天秤座</Text>
                        </View>
                    </View>
                    <Text style={styles.matchDesc}>
                        你们在这周会有很好的互动，彼此的能量非常匹配，适合深入交流。
                    </Text>
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
    // 星座选择
    zodiacSection: {
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    zodiacScroll: {
        paddingHorizontal: 20,
    },
    zodiacItem: {
        width: 80,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    zodiacSelected: {
        backgroundColor: '#f8f5ff',
        borderWidth: 2,
    },
    zodiacIcon: {
        fontSize: 24,
        marginBottom: 6,
    },
    zodiacName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    zodiacDate: {
        fontSize: 10,
        color: '#666',
    },
    // 今日运势
    todaySection: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    todayCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    todayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    todayLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todayZodiacIcon: {
        fontSize: 32,
        marginRight: 15,
    },
    todayZodiacName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    todayDate: {
        fontSize: 14,
        color: '#666',
    },
    todayScore: {
        alignItems: 'center',
    },
    scoreNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B5CF6',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    todayDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    // 详细运势
    detailSection: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    detailGrid: {
        gap: 15,
    },
    detailItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    detailIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: 80,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginHorizontal: 15,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    detailScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        width: 40,
        textAlign: 'right',
    },
    // 本周预测
    weeklySection: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    weeklyCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    weeklyItem: {
        alignItems: 'center',
        flex: 1,
    },
    weeklyDay: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    weeklyIcon: {
        fontSize: 20,
        marginBottom: 8,
    },
    weeklyScore: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8B5CF6',
    },
    // 星座配对
    matchSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    matchCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    matchTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    matchPercent: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B9D',
    },
    matchContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    matchZodiac: {
        alignItems: 'center',
        flex: 1,
    },
    matchIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    matchName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    matchSymbol: {
        fontSize: 24,
        marginHorizontal: 20,
    },
    matchDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        textAlign: 'center',
    },
}) 