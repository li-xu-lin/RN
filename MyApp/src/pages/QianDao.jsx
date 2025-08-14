import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';
import { QianDaoApi, getStatusApi, aloneUser } from '../request/auth';

export default function QianDao() {
    const nav = useNavigation();
    //用户名
    const [user, setUser] = useState(null);
    //今日签到状态
    const [isQian, setQian] = useState(false);

    //总签到天数
    const [totalDay, setTotalDay] = useState(0);
    //签到动画状态


    // 每日签到固定奖励
    const dailyReward = { reward: '经验 +20', icon: '⭐', color: '#FFD700' };

    // 获取用户信息和签到状态（从服务端获取最新状态）
    const getUser = async () => {    
        try {
            // 从本地存储获取基本用户信息
            let users = JSON.parse(await AsyncStorage.getItem('user'))
            setUser(users)
            
            if (users && users._id) {
                // 从服务端获取最新的签到状态
                const statusResult = await getStatusApi(users._id);
                if (statusResult.success) {
                    const serverData = statusResult.data.data;
                    setTotalDay(serverData.leiJiQianDao)
                    setQian(serverData.isQianDao)
                    
                    // 同时更新本地存储的用户数据
                    const updatedUser = {
                        ...users,
                        leiJiQianDao: serverData.leiJiQianDao,
                        isQianDao: serverData.isQianDao,
                        level: serverData.level,
                        levelTitle: serverData.levelTitle,
                        exp: serverData.exp
                    };
                    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                } else {
                    // 如果获取服务端状态失败，使用本地数据作为备用
                    setTotalDay(users.leiJiQianDao || 0)
                    setQian(users.isQianDao || false)
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 执行签到
    const handleSignIn = async () => {
        if (isQian) {
            Alert.alert('提示', '今日已签到，请明日再来！');
            return;
        }
        
        try {
            const userObj = await AsyncStorage.getItem('user');
            if (!userObj) {
                Alert.alert('错误', '用户信息获取失败');
                return;
            }
            
            const userData = JSON.parse(userObj);
            
            if (!userData._id) {
                Alert.alert('错误', '用户ID获取失败，请重新登录');
                return;
            }
            
            const result = await QianDaoApi(userData._id);
            
            if (result.success) {
                // 立即使用签到返回的数据更新界面，确保实时响应
                setTotalDay(result.data.data.totalSignDays);
                setQian(true);
                
                // 然后重新获取最新的用户数据并更新本地存储
                try {
                    const userInfoResult = await aloneUser(userData._id);
                    if (userInfoResult.success) {
                        const latestUserData = userInfoResult.data.data;
                        await AsyncStorage.setItem('user', JSON.stringify(latestUserData));
                    }
                } catch (error) {
                    console.log('获取最新用户信息失败，但签到已成功');
                }
                

                
                // 显示签到成功消息，如果升级了显示特殊提示
                if (result.data.data.isLevelUp) {
                    Alert.alert(
                        '🎉 升级啦！', 
                        `恭喜！你从 ${result.data.data.oldLevel} 级升到了 ${result.data.data.newLevel} 级！\n获得称号：${result.data.data.levelTitle}\n\n签到奖励：${result.data.data.expGained} 经验值`,
                        [{ text: '太棒了！', style: 'default' }]
                    );
                } else {
                    Alert.alert(
                        '签到成功！✨', 
                        `签到成功！\n获得 ${result.data.data.expGained} 经验值\n\n当前等级：${result.data.data.newLevel} 级 (${result.data.data.levelTitle})`,
                        [{ text: '继续加油！', style: 'default' }]
                    );
                }
                
            } else {
                Alert.alert('签到失败', result.data.msg || '网络错误，请重试');
            }
            
        } catch (error) {
            
            Alert.alert('签到失败', '网络错误，请重试');
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    
    /**
     * 渲染主要内容
     * @returns {JSX.Element} 主要内容组件
     */
    const renderMainContent = () => (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => nav.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>每日签到</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* 签到主卡片 */}
                    <View style={styles.signCard}>
                        <Text style={styles.welcomeText}>
                            你好，{user?.username || '占卜师'}！
                        </Text>
                        <Text style={styles.dateText}>
                            {new Date().toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                            })}
                        </Text>

                        {/* 签到按钮 */}
                        <View style={styles.signButtonContainer}>
                            <TouchableOpacity
                                style={[styles.signButton, isQian && styles.signedButton]}
                                onPress={handleSignIn}
                                disabled={isQian}
                            >
                                {/* 签到文字 */}
                                <Text style={[styles.calendarIcon, isQian && styles.signedIcon]}>
                                    签到
                                </Text>
                                
                                {/* 签到文字 */}
                                <Text style={[styles.signText, isQian && styles.signedText]}>
                                    {isQian ? '打卡完成' : '每日打卡'}
                                </Text>
                                
                                {/* 状态图标 */}
                                {isQian && (
                                    <View style={styles.checkMark}>
                                        <Text style={styles.checkIcon}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* 签到统计 */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{totalDay}</Text>
                                <Text style={styles.statLabel}>累计签到</Text>
                            </View>
                        </View>
                    </View>

                    {/* 签到奖励 */}
                    <View style={styles.rewardsSection}>
                        <Text style={styles.sectionTitle}>🎁 每日奖励</Text>
                        <View style={styles.dailyRewardCard}>
                            <Text style={[styles.rewardIcon, { color: dailyReward.color }]}>
                                {dailyReward.icon}
                            </Text>
                            <Text style={styles.dailyRewardText}>{dailyReward.reward}</Text>
                            {isQian && (
                                <View style={styles.completedBadge}>
                                    <Text style={styles.completedText}>今日已领取</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* 签到说明 */}
                    <View style={styles.rulesSection}>
                        <Text style={styles.sectionTitle}>📋 签到说明</Text>
                        <View style={styles.rulesList}>
                            <Text style={styles.ruleItem}>• 每日签到可获得固定经验值奖励</Text>
                            <Text style={styles.ruleItem}>• 每天只能签到一次</Text>
                            <Text style={styles.ruleItem}>• 累计签到天数用于记录总签到次数</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    /**
     * 统一的组件渲染逻辑
     * 根据不同状态返回对应的界面
     */
    return (() => {
        // 正常状态，显示主要内容
        return renderMainContent();
    })();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f5ff',
    },
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
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
        marginBottom: 9,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    placeholder: {
        width: 40,
        height: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    signCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    signButtonContainer: {
        marginBottom: 30,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    signButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 3,
        borderColor: '#8B5CF6',
        position: 'relative',
        zIndex: 1,
    },
    signedButton: {
        backgroundColor: '#f0fdf4',
        borderColor: '#10B981',
    },
    signIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    signText: {
        fontSize: 12,
        color: '#8B5CF6',
        fontWeight: '600',
    },
    signedText: {
        color: '#10B981',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8B5CF6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 20,
    },
    rewardsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
    },
    dailyRewardCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#8B5CF6',
        position: 'relative',
    },
    rewardIcon: {
        fontSize: 24,
        marginBottom: 8,
    },

    dailyRewardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
    },
    completedBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#10B981',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    completedText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },
    rulesSection: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    rulesList: {
        gap: 8,
    },
    ruleItem: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    calendarIcon: {
        fontSize: 20,
        marginBottom: 8,
        fontWeight: '600',
        color: '#8B5CF6',
    },
    signedIcon: {
        color: '#10B981',
    },

    checkMark: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: '#10B981',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    checkIcon: {
        fontSize: 20,
        color: '#fff',
    },
}); 