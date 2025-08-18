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
        backgroundColor: '#8b5cf6',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 15,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 65,
        left: 15,
        width: 35,
        height: 35,
        borderRadius: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    backIcon: {
        fontSize: 18,
        color: '#8b5cf6',
        fontWeight: 'normal',
    },
    headerContent: {
        alignItems: 'center',
        width: '100%',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    headerSubtitle: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    plansContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    membershipCard: {
        borderRadius: 0,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'relative',
    },
    popularCard: {
        borderWidth: 2,
        borderColor: '#8b5cf6',
    },
    popularBadge: {
        position: 'absolute',
        top: -8,
        right: 15,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 3,
    },
    popularText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'normal',
    },
    specialBadge: {
        position: 'absolute',
        top: -8,
        left: 15,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'normal',
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 8,
    },
    planType: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    priceDetail: {
        fontSize: 12,
        fontWeight: 'normal',
        marginLeft: 5,
    },
    featuresContainer: {
        marginBottom: 15,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureIcon: {
        fontSize: 14,
        color: '#8b5cf6',
        fontWeight: 'normal',
        marginRight: 8,
        width: 16,
    },
    featureText: {
        fontSize: 12,
        color: '#333',
        fontWeight: 'normal',
        flex: 1,
    },
    purchaseButton: {
        borderRadius: 0,
        paddingVertical: 10,
        alignItems: 'center',
    },
    purchaseButtonDisabled: {
        opacity: 0.7,
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'normal',
    },
    freeButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'normal',
    },
    freeButtonText: {
        color: '#666',
    },
    debugContainer: {
        margin: 15,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    debugButton: {
        backgroundColor: '#8b5cf6',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 0,
        marginBottom: 8,
        alignItems: 'center',
    },
    debugButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'normal',
    },
}); 