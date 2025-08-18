import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QianDaoApi, getStatusApi, aloneUser } from '../request/auth';
import { SIZES } from '../styles/commonStyles';

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
                const res = await getStatusApi(users._id);
                if (res.success) {
                    const serverData = res.data.data;
                    setTotalDay(serverData.leiJiQianDao)
                    setQian(serverData.isQianDao)
                    
                    // 同时更新本地存储的用户数据
                    const upUser = {
                        ...users,
                        leiJiQianDao: serverData.leiJiQianDao,
                        isQianDao: serverData.isQianDao,
                        level: serverData.level,
                        levelTitle: serverData.levelTitle,
                        exp: serverData.exp
                    };
                    await AsyncStorage.setItem('user', JSON.stringify(upUser));
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
            const userData = JSON.parse(await AsyncStorage.getItem('user'));
            
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
                        '签到成功！'
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
    
    return (
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

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{totalDay}</Text>
                                <Text style={styles.statLabel}>累计签到</Text>
                        </View>
                    </View>

                        <TouchableOpacity
                            style={[
                                styles.signButton,
                                isQian && styles.signButtonDisabled
                            ]}
                            onPress={handleSignIn}
                            disabled={isQian}
                        >
                            <Text style={styles.signButtonText}>
                                {isQian ? '今日已签到' : '点击签到'}
                            </Text>
                        </TouchableOpacity>
                                </View>

                    <View style={styles.rewardCard}>
                        <Text style={styles.rewardTitle}>每日奖励</Text>
                        <View style={styles.rewardItem}>
                            <Text style={styles.rewardIcon}>{dailyReward.icon}</Text>
                            <Text style={styles.rewardText}>{dailyReward.reward}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>签到说明</Text>
                        <Text style={styles.infoText}>
                            • 每日签到可获得经验值奖励{'\n'}
                            • 经验值用于提升占卜师等级{'\n'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
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
        width: 35,
        height: 35,
        borderRadius: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 18,
        color: '#8b5cf6',
        fontWeight: 'bold',
        marginBottom: 9,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
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
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 80,
    },
    signCard: {
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    signButtonContainer: {
        marginBottom: 20,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    signButton: {
        width: 100,
        height: 100,
        borderRadius: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8b5cf6',
        position: 'relative',
        zIndex: 1,
    },
    signedButton: {
        backgroundColor: '#f5f5f5',
        borderColor: '#8b5cf6',
    },
    signIcon: {
        fontSize: 24,
        marginBottom: 5,
    },
    signText: {
        fontSize: 10,
        color: '#8b5cf6',
        fontWeight: 'normal',
    },
    signedText: {
        color: '#8b5cf6',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8b5cf6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#ccc',
        marginHorizontal: 15,
    },
    rewardsSection: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    dailyRewardCard: {
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'relative',
    },
    rewardIcon: {
        fontSize: 20,
        marginBottom: 5,
    },

    dailyRewardText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },
    completedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#8b5cf6',
        borderRadius: 0,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    completedText: {
        fontSize: 8,
        color: '#fff',
        fontWeight: 'normal',
    },
    rulesSection: {
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    rulesList: {
        gap: 8,
    },
    ruleItem: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    calendarIcon: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'normal',
        color: '#8b5cf6',
    },
    signedIcon: {
        color: '#8b5cf6',
    },

    checkMark: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        backgroundColor: '#10B981',
        borderRadius: SIZES.radius,
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
    signButtonDisabled: {
        backgroundColor: '#E0E0E0',
        borderColor: '#A0A0A0',
        opacity: 0.7,
    },
    signButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8B5CF6',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    rewardCard: {
        backgroundColor: '#fff',
        borderRadius: SIZES.radius,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    rewardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
        textAlign: 'center',
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rewardIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    rewardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    rewardDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: SIZES.radius,
        padding: 15,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
}); 