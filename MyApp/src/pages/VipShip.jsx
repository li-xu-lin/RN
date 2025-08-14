import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles'
import { CreateZhiFu, queryZhiFu } from '../request/auth'

export default function VipShip() {
    const nav = useNavigation()
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState(null)

    // 页面焦点监听 - 当用户返回时检查会员状态
    useFocusEffect(
        React.useCallback(() => {
            checkUserMembershipStatus();
        }, [])
    );

    // 支付成功后会由全局路由处理，这里只需要在页面获得焦点时刷新状态
    useFocusEffect(
        React.useCallback(() => {
            // 页面获得焦点时检查会员状态（可能刚完成支付）
            checkUserMembershipStatus();
        }, [])
    );

    // 会员套餐配置
    const membershipPlans = [
        {
            id: 'monthly',
            type: '月会员',
            price: '¥9.90',
            priceDetail: '/月',
            color: '#8B5CF6',
            bgGradient: ['#F3E8FF', '#E9D5FF'],
            features: [
                '每日10次塔罗占卜',
                '专业解读结果',
                '详细占卜建议'
            ],
            buttonText: '立即开通',
            popular: false
        },
        {
            id: 'quarterly',
            type: '季会员',
            price: '¥29.90',
            priceDetail: '/季',
            color: '#F59E0B',
            bgGradient: ['#FEF3C7', '#FDE68A'],
            features: [
                '无限次塔罗占卜',
                '专业解读结果',
                '详细占卜建议'
            ],
            buttonText: '立即开通',
            popular: true
        }
    ];

    // 检查用户会员状态
    const checkUserMembershipStatus = async () => {
        try {
            const userObj = await AsyncStorage.getItem('user');
            if (userObj) {
                const user = JSON.parse(userObj);
                setUserInfo(user);
                
                if (user.isMember && user.vip && user.vip.type !== '免费') {
                    console.log('✅ 用户当前会员状态:', {
                        isMember: user.isMember,
                        vipType: user.vip.type,
                        endDate: user.membershipEndDate
                    });
                }
            }
        } catch (error) {
            console.error('检查会员状态失败:', error);
        }
    };

    // 处理支付
    const handlePurchase = async (planId, planType) => {
        if (loading) return;
        
        try {
            setLoading(true);
            
            // 获取用户信息
            const userObj = await AsyncStorage.getItem('user');
            if (!userObj) {
                Alert.alert('请先登录', '购买会员需要先登录账号');
                return;
            }
            
            const user = JSON.parse(userObj);
            
            // 创建支付订单
            const paymentRes = await CreateZhiFu(user._id, planType);
            if (!paymentRes.success) {
                Alert.alert('创建支付失败', paymentRes.data.msg || '请稍后重试');
                return;
            }
            
            const { outTradeNo, orderString, amount, planInfo } = paymentRes.data.data;
            
            console.log('📋 支付订单信息:', {
                outTradeNo,
                orderString: orderString ? '已获取' : '未获取',
                amount,
                planInfo
            });
            
            // 保存支付信息供后续使用
            await AsyncStorage.setItem('lastPaymentInfo', JSON.stringify({
                outTradeNo,
                planType: planType,
                amount,
                timestamp: Date.now()
            }));
            
            // 直接跳转支付
            openAlipayPayment(orderString, outTradeNo, planInfo);
            
        } catch (error) {
            console.error('支付处理失败:', error);
            Alert.alert('支付失败', '网络连接异常，请检查网络后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 打开支付宝支付
    const openAlipayPayment = async (paymentParams, outTradeNo, planInfo) => {
        try {
            console.log('🔍 检查支付参数:', {
                paymentParams: paymentParams ? '存在' : '不存在',
                paramsLength: paymentParams ? paymentParams.length : 0,
                outTradeNo
            });
            
            if (!paymentParams) {
                Alert.alert('支付失败', '支付参数错误，请重试');
                return;
            }
            
            // 构建支付宝支付URL
            const paymentUrl = `https://openapi-sandbox.dl.alipaydev.com/gateway.do?${paymentParams}`;
            
            console.log('🌐 准备跳转到支付宝支付...');
            console.log('🔗 支付URL长度:', paymentUrl.length);
            
            // 打开支付页面
            await Linking.openURL(paymentUrl);
            console.log('✅ 支付页面已打开');
            
        } catch (error) {
            console.error('❌ 支付处理失败:', error);
            Alert.alert('支付失败', '无法打开支付页面，请稍后重试');
        }
    };
    
    // 检查支付结果
    const checkPaymentResult = async (outTradeNo) => {
        try {
            Alert.alert('🔍 查询中', '正在查询支付状态，请稍候...');
            
            const result = await queryZhiFu(outTradeNo);
            
            if (result.success && result.data.data && result.data.data.status === 'paid') {
                Alert.alert(
                    '🎉 支付成功！',
                    '恭喜您！会员已成功开通\n\n✅ 会员权益立即生效\n🔮 开始享受无限占卜服务',
                    [{ 
                        text: '开始使用', 
                        onPress: () => nav.goBack()
                    }]
                );
                // 刷新用户状态
                checkUserMembershipStatus();
            } else {
                Alert.alert(
                    '⏳ 支付确认中',
                    '系统正在确认您的支付状态\n\n如果您已完成支付，请稍等片刻\n支付成功会在几分钟内生效',
                    [
                        { text: '稍后再试', style: 'cancel' },
                        { 
                            text: '重新查询', 
                            onPress: () => setTimeout(() => checkPaymentResult(outTradeNo), 1000)
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('查询支付结果失败:', error);
            Alert.alert('查询失败', '网络连接异常，请稍后重试');
        }
    };


    const renderMembershipCard = (plan, index) => {
        return (
            <View 
                key={plan.id} 
                style={[
                    styles.membershipCard,
                    { backgroundColor: plan.bgGradient[0] },
                    plan.popular && styles.popularCard
                ]}
            >
                {plan.popular && (
                    <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                        <Text style={styles.popularText}>推荐</Text>
                    </View>
                )}

                <View style={styles.cardHeader}>
                    <Text style={[styles.planType, { color: plan.color }]}>{plan.type}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: plan.color }]}>{plan.price}</Text>
                        <Text style={[styles.priceDetail, { color: plan.color }]}>{plan.priceDetail}</Text>
                    </View>
                </View>

                <View style={styles.featuresContainer}>
                    {plan.features.map((feature, featureIndex) => (
                        <View key={featureIndex} style={styles.featureRow}>
                            <Text style={styles.featureIcon}>✓</Text>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.subscribeButton, { backgroundColor: plan.color }]}
                    onPress={() => handlePurchase(plan.id, plan.type)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? '处理中...' : plan.buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 渲染主要内容
     * @returns {JSX.Element} 主要内容组件
     */
    const renderMainContent = () => (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* 头部区域 */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => nav.goBack()}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>会员中心</Text>
                        <Text style={styles.headerSubtitle}>解锁更多神秘功能，享受专属占卜体验</Text>
                    </View>
                </View>

                {/* 当前会员状态 */}
                {userInfo && userInfo.isMember && (
                    <View style={styles.currentStatusCard}>
                        <Text style={styles.statusTitle}>✨ 当前会员状态</Text>
                        <Text style={styles.statusText}>
                            {userInfo.vip?.type || '免费用户'} 
                            {userInfo.membershipEndDate && 
                                ` · 到期时间：${new Date(userInfo.membershipEndDate).toLocaleDateString()}`
                            }
                        </Text>
                    </View>
                )}

                {/* 会员套餐卡片 */}
                <View style={styles.plansContainer}>
                    {membershipPlans.map((plan, index) => renderMembershipCard(plan, index))}
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
        backgroundColor: "#f8f5ff",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        backgroundColor: '#8B5CF6',
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 55,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    backIcon: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
    },
    headerContent: {
        alignItems: 'center',
        width: '100%',
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
    plansContainer: {
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    membershipCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
        position: 'relative',
    },
    popularCard: {
        borderWidth: 2,
        borderColor: '#F59E0B',

    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    popularText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    specialBadge: {
        position: 'absolute',
        top: -10,
        left: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    planType: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 32,
        fontWeight: '800',
    },
    priceDetail: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 5,
    },
    featuresContainer: {
        marginBottom: 25,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureIcon: {
        fontSize: 16,
        color: '#10B981',
        fontWeight: '600',
        marginRight: 10,
        width: 20,
    },
    featureText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
        flex: 1,
    },
    subscribeButton: {
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    freeButton: {
        backgroundColor: '#9CA3AF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    freeButtonText: {
        color: '#6B7280',
    },
    currentStatusCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 22,
    },
    // 调试样式
    debugContainer: {
        margin: 20,
        padding: 15,
        backgroundColor: '#FFF3CD',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFC107',
    },
    debugButton: {
        backgroundColor: '#FF6B35',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginBottom: 10,
        alignItems: 'center',
    },
    debugButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
}); 