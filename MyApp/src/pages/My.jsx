import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfoApi } from '../request/auth';

import LevelProgressBar from '../components/common/LevelProgressBar';

export default function My() {
    //跳转
    const nav = useNavigation()
    //用户相关数据
    const [user, setUser] = useState(null)


    const [levelInfo,setLevelInfo] = useState({
        level: 1,
        levelTitle: '初学者',
        exp: 0,
        progress: 0,
        expNeeded: 100
    })
    const [lianXuDays,setLianXuDays] = useState(0)
    //连续登录
    const lianXU = async ()=>{
            let shiJian = await AsyncStorage.getItem('shiJian')
            let storedDays = await AsyncStorage.getItem('lianXuDays') || '0'
            
            if (!shiJian) {
                // 第一次登录
                await AsyncStorage.setItem('lianXuDays', '1')
                setLianXuDays(1)
                return
            }
            
            let now = new Date()
            let last = new Date(shiJian)
            let times = now.getTime() - last.getTime()
            let days = Math.floor(times / (1000 * 60 * 60 * 24))
            
            if (days === 0) {
                // 今天已经登录过了，不增加天数
                setLianXuDays(parseInt(storedDays))
            } else if (days === 1) {
                // 连续登录，天数+1
                let newDays = parseInt(storedDays) + 1
                await AsyncStorage.setItem('lianXuDays', newDays.toString())
                setLianXuDays(newDays)
            } else {
                // 中断了，重新开始计算
                await AsyncStorage.setItem('lianXuDays', '1')
                setLianXuDays(1)
            }
    }


    
    const getUser = async () => {
        try {
            const userObj = await AsyncStorage.getItem('user')
            if (userObj) {
                let user = JSON.parse(userObj)
                setUser(user)
                await lianXU()
                AsyncStorage.setItem('shiJian', new Date().toISOString())

                
                // 设置等级信息（使用新的等级系统）
                setLevelInfo({
                    level: user.level || 1,
                    levelTitle: user.levelTitle || '初学者',
                    exp: user.exp || 0,
                    progress: user.levelProgress || 0,
                    expNeeded: user.levelInfo?.expNeeded || 100
                })
            }
        } catch (error) {

        }
    }

    // 刷新用户信息（从服务器获取最新数据）
    const refreshUserInfo = async () => {
        try {
            const userObj = await AsyncStorage.getItem('user');
            if (userObj) {
                const userData = JSON.parse(userObj);
                if (userData._id) {
                    const result = await getUserInfoApi(userData._id);
                    if (result.success) {
                        const latestUserData = result.data.data;
                        await AsyncStorage.setItem('user', JSON.stringify(latestUserData));
                        setUser(latestUserData);
                        
                        // 更新等级信息
                        setLevelInfo({
                            level: latestUserData.level || 1,
                            levelTitle: latestUserData.levelTitle || '初学者',
                            exp: latestUserData.exp || 0,
                            progress: latestUserData.levelProgress || 0,
                            expNeeded: latestUserData.levelInfo?.expNeeded || 100
                        });
                        return;
                    }
                }
            }
            // 如果从服务器获取失败，使用本地数据
            getUser();
        } catch (error) {
            console.error('刷新用户信息失败:', error);
            // 如果出错，使用本地数据
            getUser();
        }
    };
    
    useEffect(() => {
        getUser()
    }, [])

    // 当页面聚焦时刷新用户信息
    useFocusEffect(
        React.useCallback(() => {
            refreshUserInfo();
        }, [])
    );

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
                <TouchableOpacity 
                    style={styles.backBtn} 
                    onPress={() => nav.navigate('HomeTab')}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>个人中心</Text>
                <View style={styles.placeholder} />
            </View>

            {/* 用户信息卡片 */}
            <View style={styles.profileSection}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarSection}>
                        {user?.imgs ? (
                            <Image source={{ uri: user.imgs }} style={styles.avatar} />
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
                                <Text style={styles.statNumber}>{lianXuDays}</Text>
                                <Text style={styles.statLabel}>连续签到</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{levelInfo.level}</Text>
                                <Text style={styles.statLabel}>等级</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* 等级进度条 */}
            <LevelProgressBar 
                level={levelInfo.level}
                levelTitle={levelInfo.levelTitle}
                currentExp={levelInfo.exp}
                progress={levelInfo.progress}
                expNeeded={levelInfo.expNeeded}
                style={styles.levelProgressBar}
            />

            {/* 我的服务 */}
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
                        onPress={() => nav.navigate('Membership')}
                    >
                        <Text style={styles.serviceIcon}>💎</Text>
                        <Text style={styles.serviceText}>会员中心</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 功能菜单 */}
            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>🛠️ 更多功能</Text>
                <View style={styles.menuList}>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => nav.navigate('EditProfile')}
                    >
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>📝</Text>
                            <Text style={styles.menuText}>编辑个人资料</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => nav.navigate('ChangePassword')}
                    >
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🔒</Text>
                            <Text style={styles.menuText}>修改密码</Text>
                        </View>
                        <Text style={styles.menuArrow}>{'>'}</Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* 退出登录 */}
            <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>退出登录</Text>
                </TouchableOpacity>
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
        marginBottom:9
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    placeholder: {
        width: 40, // 保持布局平衡
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
    // 等级进度条样式
    levelProgressBar: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
})
