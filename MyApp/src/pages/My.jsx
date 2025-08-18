import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aloneUser } from '../request/auth';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';
import { getLevelInfo } from '../utils/lvJiSuan';

export default function My() {
    //跳转
    const nav = useNavigation()
    //用户相关数据
    const [user, setUser] = useState(null)


    // 使用useMemo计算等级信息
    const levelInfo = useMemo(() => {
        if (!user || !user.exp) return { level: 1, title: '初学者', expToNext: 100 };
        return getLevelInfo(user.exp);
    }, [user?.exp]);

    const getUser = async () => {
        let user = JSON.parse(await AsyncStorage.getItem('user'))
        setUser(user)
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

                // 等级信息通过useMemo自动计算
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
                    <Text style={styles.headerTitle}>个人中心</Text>
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
                        <Text style={styles.levelTitle}>Lv.{levelInfo.level} {levelInfo.title}</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...commonStyles.headerTitle,
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
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f4ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 28,
        color: COLORS.primary,
    },
    userInfo: {
        alignItems: 'center',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    userDesc: {
        fontSize: 14,
        color: COLORS.darkGray,
        marginBottom: 15,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.darkGray,
    },
    statDivider: {
        width: 1,
        height: 25,
        backgroundColor: COLORS.border,
    },
    servicesSection: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    serviceGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    serviceItem: {
        width: '100%',
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    serviceIcon: {
        fontSize: 24,
        marginBottom: 5,
    },
    serviceText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    menuSection: {
        paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    menuList: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    menuText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: 'normal',
    },
    menuArrow: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    logoutSection: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff4444',
        borderRadius: SIZES.radius,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cc0000',
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'normal',
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
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    expInfo: {
        fontSize: 12,
        color: COLORS.darkGray,
    },
    expNeeded: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
})
