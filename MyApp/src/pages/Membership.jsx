import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createPaymentOrderApi, queryPaymentStatusApi } from '../request/auth'


export default function Membership() {
    const nav = useNavigation()
    const [loading, setLoading] = useState(false)

    const membershipPlans = [
        {
            id: 'free',
            type: '免费用户',
            price: '免费',
            priceDetail: '永久免费',
            color: '#9CA3AF',
            bgGradient: ['#F3F4F6', '#E5E7EB'],
            features: [
                '每天3次占卜',
                '基础占卜结果'
            ],
            buttonText: '当前方案',
            popular: false
        },
        {
            id: 'monthly',
            type: '月会员',
            price: '¥6.99',
            priceDetail: '/月',
            color: '#8B5CF6',
            bgGradient: ['#F3E8FF', '#E9D5FF'],
            features: [
                '每天20次占卜',
                '基础占卜结果',
            ],
            buttonText: '立即开通',
            popular: false
        },
        {
            id: 'quarterly',
            type: '季会员',
            price: '¥16.99',
            priceDetail: '/季',
            color: '#F59E0B',
            bgGradient: ['#FEF3C7', '#FDE68A'],
            features: [
                '月会员所有权益',
                '专属高级解读内容',
                '更详细个性化解释'
            ],
            buttonText: '立即开通',
            popular: true
        }
    ];

    // 处理支付
    const handlePurchase = async (planId, planType) => {
        if (loading) return;
        
        try {
            setLoading(true);
            
            // 获取用户信息
            const userObj = await AsyncStorage.getItem('user');
            if (!userObj) {
                Alert.alert('错误', '请先登录');
                return;
            }
            
            const user = JSON.parse(userObj);
            
            // 创建支付订单
            const orderRes = await createPaymentOrderApi(user._id, planType);
            if (!orderRes.success) {
                Alert.alert('创建订单失败', orderRes.data.msg || '请稍后重试');
                return;
            }
            
            const { orderId, paymentUrl, amount, productName } = orderRes.data.data;
            
            // 显示支付确认对话框
            Alert.alert(
                '确认购买',
                `商品：${productName}\n金额：¥${amount}\n\n点击确认将跳转到支付宝进行支付`,
                [
                    { text: '取消', style: 'cancel' },
                    { 
                        text: '确认支付', 
                        onPress: () => openPayment(paymentUrl, orderId)
                    }
                ]
            );
            
        } catch (error) {
            console.error('支付处理失败:', error);
            Alert.alert('支付失败', '网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 打开支付链接
    const openPayment = async (paymentUrl, orderId) => {
        try {
            // 尝试打开支付宝APP或浏览器
            const supported = await Linking.canOpenURL(paymentUrl);
            if (supported) {
                await Linking.openURL(paymentUrl);
                
                // 延迟查询支付结果
                setTimeout(() => {
                    checkPaymentResult(orderId);
                }, 3000);
            } else {
                Alert.alert('错误', '无法打开支付链接');
            }
        } catch (error) {
            console.error('打开支付链接失败:', error);
            Alert.alert('错误', '无法打开支付页面');
        }
    };
    
    // 检查支付结果
    const checkPaymentResult = async (orderId) => {
        try {
            const result = await queryPaymentStatusApi(orderId);
            if (result.success && result.data.data.status === 'paid') {
                Alert.alert(
                    '支付成功！',
                    '会员购买成功，感谢您的支持！',
                    [
                        { text: '确定', onPress: () => nav.goBack() }
                    ]
                );
            } else {
                // 可以设置定时器继续查询，或者让用户手动查询
                Alert.alert(
                    '支付状态确认',
                    '正在确认支付状态，如果已完成支付但未生效，请稍后重试或联系客服',
                    [
                        { text: '重新查询', onPress: () => checkPaymentResult(orderId) },
                        { text: '稍后再试', style: 'cancel' }
                    ]
                );
            }
        } catch (error) {
            console.error('查询支付结果失败:', error);
            Alert.alert('查询失败', '请稍后重试或联系客服');
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
                
                {plan.badge && (
                    <View style={[styles.specialBadge, { backgroundColor: plan.color }]}>
                        <Text style={styles.badgeText}>{plan.badge}</Text>
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
                    style={[
                        styles.subscribeButton,
                        { backgroundColor: plan.color },
                        plan.id === 'free' && styles.freeButton
                    ]}
                    onPress={() => {
                        if (plan.id !== 'free') {
                            handlePurchase(plan.id, plan.type);
                        }
                    }}
                >
                    <Text style={[
                        styles.buttonText,
                        plan.id === 'free' && styles.freeButtonText
                    ]}>
                        {loading && plan.id !== 'free' ? '处理中...' : plan.buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
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
                        <Text style={styles.headerTitle}>💎 会员中心</Text>
                        <Text style={styles.headerSubtitle}>解锁更多神秘功能，享受专属占卜体验</Text>
                    </View>
                </View>

                {/* 会员套餐卡片 */}
                <View style={styles.plansContainer}>
                    {membershipPlans.map((plan, index) => renderMembershipCard(plan, index))}
                </View>

                {/* 底部说明 */}
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>🔮 会员特权说明</Text>
                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>• 所有付费功能均为一次性付费，无自动续费</Text>
                        <Text style={styles.noteText}>• 季会员和年会员享有不同的专属界面主题</Text>
                        <Text style={styles.noteText}>• 年会员独享年度运势报告和重要日子提醒</Text>
                        <Text style={styles.noteText}>• 如有任何问题，请联系客服获得帮助</Text>
                    </View>
                </View>
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
    footer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    footerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6B46C1',
        marginBottom: 15,
        textAlign: 'center',
    },
    noteContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    noteText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 8,
    },
}); 