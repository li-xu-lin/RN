import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedTouchable from '../components/common/AnimatedTouchable';

export default function My() {
    const nav = useNavigation()
    const [user, setUser] = useState(null)
    
    // 动画相关
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideUpAnim = useRef(new Animated.Value(30)).current
    const profileScaleAnim = useRef(new Animated.Value(0.5)).current
    
    const getUser = async () => {
        try {
            const userObj = await AsyncStorage.getItem('user')
            if (userObj) {
                setUser(JSON.parse(userObj))
            }
        } catch (error) {
            console.log('获取用户信息失败:', error)
        }
    }
    
    // 页面进入动画
    const startPageAnimation = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(profileScaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start()
    }
    
    useEffect(() => {
        getUser()
        startPageAnimation()
    }, [])

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token')
            await AsyncStorage.removeItem('user')
            // 重置到登录页面
            nav.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        } catch (error) {
            console.log('退出登录失败:', error)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
            {/* 头部背景 */}
            <View style={styles.header}>
                <AnimatedTouchable 
                    style={styles.backBtn} 
                    onPress={() => nav.navigate('HomeTab')}
                    animationType="scale"
                    scaleValue={0.85}
                >
                    <Text style={styles.backIcon}>←</Text>
                </AnimatedTouchable>
                <Text style={styles.headerTitle}>个人中心</Text>
                <AnimatedTouchable 
                    style={styles.settingBtn} 
                    onPress={() => nav.navigate('Settings')}
                    animationType="bounce"
                >
                    <Text style={styles.settingIcon}>⚙️</Text>
                </AnimatedTouchable>
            </View>

            {/* 用户信息卡片 */}
            <Animated.View style={[styles.profileSection, {
                opacity: fadeAnim,
                transform: [
                    { translateY: slideUpAnim },
                    { scale: profileScaleAnim }
                ]
            }]}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarSection}>
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.defaultAvatar}>
                                <Text style={styles.avatarEmoji}>✨</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <Text style={styles.editIcon}>📷</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{user?.username || '神秘占卜师'}</Text>
                        <Text style={styles.userDesc}>{user?.content || '探索命运的奥秘'}</Text>
                        <View style={styles.userStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>127</Text>
                                <Text style={styles.statLabel}>占卜次数</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>15</Text>
                                <Text style={styles.statLabel}>连续签到</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>3</Text>
                                <Text style={styles.statLabel}>等级</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* 我的服务 */}
            <Animated.View style={[styles.servicesSection, {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
            }]}>
                <Text style={styles.sectionTitle}>🔮 我的服务</Text>
                <View style={styles.serviceGrid}>
                    <AnimatedTouchable style={styles.serviceItem} animationType="lift">
                        <Text style={styles.serviceIcon}>📊</Text>
                        <Text style={styles.serviceText}>占卜记录</Text>
                    </AnimatedTouchable>
                    <AnimatedTouchable style={styles.serviceItem} animationType="lift">
                        <Text style={styles.serviceIcon}>⭐</Text>
                        <Text style={styles.serviceText}>星座运势</Text>
                    </AnimatedTouchable>
                    <AnimatedTouchable style={styles.serviceItem} animationType="lift">
                        <Text style={styles.serviceIcon}>💫</Text>
                        <Text style={styles.serviceText}>每日签到</Text>
                    </AnimatedTouchable>
                    <AnimatedTouchable style={styles.serviceItem} animationType="lift">
                        <Text style={styles.serviceIcon}>🎁</Text>
                        <Text style={styles.serviceText}>礼品中心</Text>
                    </AnimatedTouchable>
                </View>
            </Animated.View>

            {/* 最近占卜 */}
            <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🌙 最近占卜</Text>
                    <TouchableOpacity>
                        <Text style={styles.moreBtn}>查看全部 {'>'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.recentList}>
                    <TouchableOpacity style={styles.recentItem}>
                        <View style={styles.recentIcon}>
                            <Text style={styles.recentEmoji}>🔮</Text>
                        </View>
                        <View style={styles.recentInfo}>
                            <Text style={styles.recentTitle}>爱情塔罗占卜</Text>
                            <Text style={styles.recentDesc}>你的桃花运即将到来</Text>
                            <Text style={styles.recentTime}>今天 14:30</Text>
                        </View>
                        <Text style={styles.recentScore}>85分</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recentItem}>
                        <View style={styles.recentIcon}>
                            <Text style={styles.recentEmoji}>💰</Text>
                        </View>
                        <View style={styles.recentInfo}>
                            <Text style={styles.recentTitle}>财运预测</Text>
                            <Text style={styles.recentDesc}>近期财运稳中有升</Text>
                            <Text style={styles.recentTime}>昨天 20:15</Text>
                        </View>
                        <Text style={styles.recentScore}>78分</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 功能菜单 */}
            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>🛠️ 更多功能</Text>
                <View style={styles.menuList}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>👤</Text>
                            <Text style={styles.menuText}>个人信息</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🌟</Text>
                            <Text style={styles.menuText}>我的收藏</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>💎</Text>
                            <Text style={styles.menuText}>会员中心</Text>
                        </View>
                        <View style={styles.menuRight}>
                            <Text style={styles.vipBadge}>VIP</Text>
                            <Text style={styles.menuArrow}>{'>'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>📞</Text>
                            <Text style={styles.menuText}>联系客服</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>ℹ️</Text>
                            <Text style={styles.menuText}>关于我们</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <View style={styles.menuLeft}>
                            <Text style={[styles.menuText, { color: '#FF6B9D' }]}>退出登录</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </View>
    );
};

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
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    settingBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingIcon: {
        fontSize: 18,
    },
    // 用户信息
    profileSection: {
        paddingHorizontal: 20,
        marginTop: -10,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#8B5CF6',
    },
    defaultAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f8f5ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#8B5CF6',
    },
    avatarEmoji: {
        fontSize: 32,
        color: '#8B5CF6',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        fontSize: 14,
    },
    userInfo: {
        alignItems: 'center',
    },
    username: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    userDesc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    userStats: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E7EB',
    },
    // 服务区域
    servicesSection: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
    },
    serviceGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    serviceIcon: {
        fontSize: 28,
        marginBottom: 10,
    },
    serviceText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    // 最近占卜
    recentSection: {
        paddingHorizontal: 20,
        marginTop: 25,
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
    recentList: {
        gap: 12,
    },
    recentItem: {
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
    recentIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f8f5ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    recentEmoji: {
        fontSize: 20,
    },
    recentInfo: {
        flex: 1,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    recentDesc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    recentTime: {
        fontSize: 12,
        color: '#999',
    },
    recentScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B9D',
    },
    // 菜单区域
    menuSection: {
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 30,
    },
    menuList: {
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vipBadge: {
        backgroundColor: '#FF6B9D',
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginRight: 8,
    },
    menuArrow: {
        fontSize: 16,
        color: '#999',
    },
})
