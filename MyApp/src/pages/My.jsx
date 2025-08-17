import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aloneUser } from '../request/auth';
import { commonStyles, COLORS } from '../styles/commonStyles';

export default function My() {
    //跳转
    const nav = useNavigation()
    //用户相关数据
    const [user, setUser] = useState(null)


    const [levelInfo, setLevelInfo] = useState({
        level: 1,
        levelTitle: '初学者',
        exp: 0,
        progress: 0,
        expNeeded: 100
    })

    const getUser = async () => {
        let user = JSON.parse(await AsyncStorage.getItem('user'))
        setUser(user)
        // 设置等级信息
        setLevelInfo({
            // 等级
            level: user.level || 1,
            // 等级标题
            levelTitle: user.levelTitle || '初学者',
            // 经验
            exp: user.exp || 0,
            // 进度
            progress: user.levelProgress || 0,
            // 升级还需经验
            expToNext: user.levelInfo?.expToNext || 0
        })
    }

    // 刷新用户信息（从服务器获取最新数据）
    const shuaUser = async () => {
        try {
            const userData = JSON.parse(await AsyncStorage.getItem('user'));

            const res = await aloneUser(userData._id);
            if (res.success) {
                const latestUserData = res.data.data;
                await AsyncStorage.setItem('user', JSON.stringify(latestUserData));
                setUser(latestUserData);

                // 更新等级信息
                setLevelInfo({
                    level: latestUserData.level || 1,
                    levelTitle: latestUserData.levelTitle || '初学者',
                    exp: latestUserData.exp || 0,
                    progress: latestUserData.levelProgress || 0,
                    expToNext: latestUserData.levelInfo?.expToNext || 0
                });
            } else {
                getUser();
            }
        } catch (error) {
            console.error('刷新用户信息失败:', error);
            getUser();
        }
    };

    useEffect(() => {
        getUser()
    }, [])

    // 当页面聚焦时刷新用户信息
    useFocusEffect(
        useCallback(() => {
            shuaUser();
        }, [])
    );

    const tuiLogin = async () => {
        Alert.alert(
            "退出登录",
            "确定要退出登录吗？",
            [
                {
                    text: "取消",
                    style: "cancel"
                },
                {
                    text: "确定",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove(['token', 'user']);
                        } catch (error) {
                            console.error('退出登录失败:', error);
                            Alert.alert("错误", "退出登录失败，请重试");
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={commonStyles.container}>
            <ScrollView
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={commonStyles.scrollContent}
            >   
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => nav.navigate('HomeTab')}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>个人中心</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.profileSection}>
                    <View style={commonStyles.card}>
                        <View style={styles.avatarSection}>
                            <View style={styles.defaultAvatar}>
                                <Text style={styles.avatarEmoji}>✨</Text>
                            </View>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.username}>{user?.username || '神秘占卜师'}</Text>
                            <Text style={styles.userDesc}>{user?.content || '探索命运的奥秘'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.levelSection}>
                    <View style={styles.levelInfo}>
                        <Text style={styles.levelTitle}>Lv.{levelInfo.level} {levelInfo.levelTitle}</Text>
                        <Text style={styles.expInfo}>
                            还差 <Text style={styles.expNeeded}>{levelInfo.expToNext || 0}</Text> 经验升级
                        </Text>
                    </View>
                </View>

                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>🔮 我的服务</Text>
                    <View style={styles.serviceGrid}>
                        <TouchableOpacity
                            style={styles.serviceItem}
                            onPress={() => nav.navigate('QianDao')}
                        >
                            <Text style={styles.serviceIcon}>💫</Text>
                            <Text style={styles.serviceText}>每日签到</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.serviceItem}
                            onPress={() => nav.navigate('VipShip')}
                        >
                            <Text style={styles.serviceIcon}>💎</Text>
                            <Text style={styles.serviceText}>会员中心</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>🛠️ 更多功能</Text>
                    <View style={styles.menuList}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => nav.navigate('geRen')}
                        >
                            <View style={styles.menuLeft}>
                                <Text style={styles.menuIcon}>📝</Text>
                                <Text style={styles.menuText}>编辑个人资料</Text>
                            </View>
                            <Text style={styles.menuArrow}>{'>'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => nav.navigate('ChangePwd')}
                        >
                            <View style={styles.menuLeft}>
                                <Text style={styles.menuIcon}>🔒</Text>
                                <Text style={styles.menuText}>修改密码</Text>
                            </View>
                            <Text style={styles.menuArrow}>{'>'}</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={tuiLogin}>
                        <Text style={styles.logoutText}>退出登录</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        ...commonStyles.header,
        ...commonStyles.headerRow,
    },
    backBtn: {
        ...commonStyles.roundButton,
    },
    backIcon: {
        fontSize: 20,
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: 9
    },
    headerTitle: {
        ...commonStyles.headerTitle,
    },
    placeholder: {
        width: 40,
    },
    profileSection: {
        ...commonStyles.paddingHorizontal,
        marginTop: -10,
    },
    avatarSection: {
        ...commonStyles.centerContainer,
        marginBottom: 20,
    },
    defaultAvatar: {
        ...commonStyles.avatar,
        ...commonStyles.defaultAvatar,
    },
    avatarEmoji: {
        fontSize: 32,
        color: '#8B5CF6',
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
    serviceItem: {
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
    },
    serviceIcon: {
        fontSize: 28,
        marginBottom: 10,
    },
    serviceText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
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
    menuArrow: {
        fontSize: 16,
        color: '#999',
    },
    logoutSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    logoutButton: {
        backgroundColor: '#FF6B9D',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#FF6B9D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    levelSection: {
        ...commonStyles.paddingHorizontal,
        marginTop: 20,
    },
    levelInfo: {
        ...commonStyles.card,
        padding: 15,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 5,
    },
    expInfo: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    expNeeded: {
        fontWeight: '600',
        color: COLORS.primary,
    },
})
