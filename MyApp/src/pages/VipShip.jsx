import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CreateZhiFu } from '../request/auth'

export default function VipShip() {
    const nav = useNavigation()
    const [loading, setLoading] = useState(false)


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



    // 处理支付
    const handlePurchase = async (planType) => {
        if (loading) return;
        
        try {
            setLoading(true);
            
            // 获取用户信息
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            
            // 创建支付订单
            const res = await CreateZhiFu(user._id, planType);
            if (!res.success) {
                Alert.alert('创建支付失败', res.data.msg || '请稍后重试');
                return;
            }
            
            const { outTradeNo, orderString } = res.data.data;
            
            // 打开浏览器支付
            zhifu(orderString, outTradeNo);
            
        } catch (error) {
            console.error('支付处理失败:', error);
            Alert.alert('支付失败', '网络连接异常，请检查网络后重试');
        } finally {
            setLoading(false);
        }
    };
    
    // 打开浏览器支付页面
    const zhifu = async (paymentParams) => {
        try {
            if (!paymentParams) {
                Alert.alert('支付失败', '支付参数错误，请重试');
                return;
            }
            
            // 构建支付宝支付URL
            const paymentUrl = `https://openapi-sandbox.dl.alipaydev.com/gateway.do?${paymentParams}`;
            // 打开支付页面
            await Linking.openURL(paymentUrl);
            
        } catch (error) {
            Alert.alert('支付失败', error);
        }
    };
    



    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
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



                <View style={styles.plansContainer}>
                    {membershipPlans.map((plan, index) => (
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
                                style={[
                                    styles.purchaseButton,
                                    { backgroundColor: plan.color },
                                    loading && styles.purchaseButtonDisabled
                                ]}
                                onPress={() => handlePurchase(plan.type)}
                                disabled={loading}
                            >
                                <Text style={styles.purchaseButtonText}>
                                    {loading ? '处理中...' : plan.buttonText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
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
    purchaseButton: {
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    purchaseButtonDisabled: {
        opacity: 0.7,
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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