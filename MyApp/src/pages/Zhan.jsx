import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AnimatedTouchable from '../components/common/AnimatedTouchable';

export default function DivinationCenter() {
    const nav = useNavigation()
    
    // 动画相关
    const fadeAnim = useRef(new Animated.Value(0)).current
    const headerSlideAnim = useRef(new Animated.Value(-50)).current
    const cardsStaggerAnim = useRef(new Animated.Value(0)).current

    const divinationTypes = [
        {
            id: 'tarot-love',
            icon: '💕',
            title: '爱情塔罗',
            desc: '探索感情的奥秘',
            action: () => nav.navigate('TarotReading', { spreadType: 'love', question: '我的爱情运势如何？' })
        },
        {
            id: 'tarot-career',
            icon: '🎯',
            title: '事业塔罗',
            desc: '指引职场发展',
            action: () => nav.navigate('TarotReading', { spreadType: 'single', question: '我的事业发展如何？' })
        },
        {
            id: 'tarot-money',
            icon: '💰',
            title: '财富塔罗',
            desc: '揭示财运的秘密',
            action: () => nav.navigate('TarotReading', { spreadType: 'single', question: '我的财运如何？' })
        },
        {
            id: 'tarot-comprehensive',
            icon: '🔮',
            title: '综合占卜',
            desc: '全面了解运势',
            action: () => nav.navigate('TarotReading', { spreadType: 'celtic', question: '我的整体运势如何？' })
        },
        {
            id: 'moon-phase',
            icon: '🌙',
            title: '月相占卜',
            desc: '感受月亮能量',
            action: () => nav.navigate('MoonPhase')
        },
        {
            id: 'crystal',
            icon: '💎',
            title: '水晶占卜',
            desc: '水晶的神秘力量',
            action: () => {}
        }
    ];

    const quickDivination = [
        { icon: '🃏', title: '每日一卡', desc: '今日指引' },
        { icon: '✨', title: '许愿占卜', desc: '愿望实现' },
        { icon: '🔥', title: '直觉占卜', desc: '相信直觉' },
        { icon: '🌟', title: '灵感占卜', desc: '获得灵感' }
    ];

    // 页面动画
    const startPageAnimation = () => {
        Animated.parallel([
            Animated.timing(headerSlideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(cardsStaggerAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start()
    }

    useEffect(() => {
        startPageAnimation()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
            {/* 头部区域 */}
            <Animated.View style={[styles.header, {
                transform: [{ translateY: headerSlideAnim }]
            }]}>
                <Text style={styles.headerTitle}>🔮 占卜中心</Text>
                <Text style={styles.headerSubtitle}>探索命运的奥秘，倾听内心的声音</Text>
            </Animated.View>

            {/* 快速占卜 */}
            <Animated.View style={[styles.quickSection, {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.multiply(cardsStaggerAnim, 20) }]
            }]}>
                <Text style={styles.sectionTitle}>⚡ 快速占卜</Text>
                <View style={styles.quickGrid}>
                    {quickDivination.map((item, index) => (
                        <AnimatedTouchable 
                            key={index} 
                            style={styles.quickCard}
                            animationType="bounce"
                            duration={200}
                        >
                            <Text style={styles.quickIcon}>{item.icon}</Text>
                            <Text style={styles.quickTitle}>{item.title}</Text>
                            <Text style={styles.quickDesc}>{item.desc}</Text>
                        </AnimatedTouchable>
                    ))}
                </View>
            </Animated.View>

            {/* 详细占卜 */}
            <Animated.View style={[styles.detailSection, {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.multiply(cardsStaggerAnim, 30) }]
            }]}>
                <Text style={styles.sectionTitle}>🌟 详细占卜</Text>
                <View style={styles.cardGrid}>
                    {divinationTypes.map((item, index) => (
                        <AnimatedTouchable 
                            key={item.id} 
                            style={styles.card}
                            onPress={item.action}
                            animationType="lift"
                            duration={150}
                        >
                            <Text style={styles.cardIcon}>{item.icon}</Text>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc}>{item.desc}</Text>
                        </AnimatedTouchable>
                    ))}
                </View>
            </Animated.View>

            {/* 今日推荐 */}
            <Animated.View style={[styles.recommendSection, {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.multiply(cardsStaggerAnim, 40) }]
            }]}>
                <Text style={styles.sectionTitle}>💫 今日推荐</Text>
                <AnimatedTouchable 
                    style={styles.recommendCard}
                    animationType="scale"
                    scaleValue={0.98}
                    duration={200}
                >
                    <View style={styles.recommendContent}>
                        <View style={styles.recommendLeft}>
                            <Text style={styles.recommendIcon}>🌈</Text>
                            <View>
                                <Text style={styles.recommendTitle}>幸运能量占卜</Text>
                                <Text style={styles.recommendDesc}>
                                    今日能量特别适合进行综合占卜，获得更准确的指引
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.recommendArrow}>→</Text>
                    </View>
                </AnimatedTouchable>
            </Animated.View>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f5ff",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // 为TabBar留出空间
    },
    header: {
        backgroundColor: '#8B5CF6',
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 5,
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textAlign: 'center',
    },
    quickSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    quickCard: {
        width: 160,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.08)',
        justifyContent: 'center',
    },
    quickIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    quickTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    quickDesc: {
        fontSize: 12,
        color: '#8B5CF6',
        textAlign: 'center',
        fontWeight: '500',
    },
    detailSection: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    card: {
        width: 160,
        height: 140,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.08)',
        justifyContent: 'center',
    },
    cardIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        color: '#8B5CF6',
        textAlign: 'center',
        fontWeight: '500',
    },
    recommendSection: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    recommendCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.08)',
    },
    recommendContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    recommendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    recommendIcon: {
        fontSize: 36,
        marginRight: 16,
    },
    recommendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    recommendDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    recommendArrow: {
        fontSize: 20,
        color: '#8B5CF6',
        fontWeight: '600',
    },
}); 