import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, AppState, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入页面组件
import Login from '../pages/Login';
import Home from '../pages/Home';
import My from '../pages/My';
import TarotReading from '../pages/TarotReading';
import DivinationHistory from '../pages/DivinationHistory';
import DivinationDetail from '../pages/DivinationDetail';

import JinRiYunShi from '../pages/jinRiYunShi';
import QianDao from '../pages/QianDao';
import Membership from '../pages/Membership';
import EditProfile from '../pages/EditProfile';
import ChangePassword from '../pages/ChangePassword';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// 加载状态组件
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#8B5CF6" />
    <Text style={{ marginTop: 10, color: '#8B5CF6', fontSize: 16 }}>加载中...</Text>
  </View>
);

// 主Tab导航器
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          textAlign: 'center',
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={Home}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 22, color }}>
              {focused ? '🏠' : '🏡'}
            </Text>
          ),
        }}
      />

      <Tab.Screen 
        name="DivinationTab" 
        component={TarotReading}
        options={{
          tabBarLabel: '塔罗占卜',
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: '600',
            marginTop: 1,
            textAlign: 'center',
          },
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20, color }}>
              {focused ? '🔮' : '🔷'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="HistoryTab" 
        component={DivinationHistory}
        options={{
          tabBarLabel: '历史',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 22, color }}>
              {focused ? '📚' : '📖'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="MyTab" 
        component={My}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 22, color }}>
              {focused ? '👤' : '👥'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// 主应用导航器（包含Tab和其他页面）
const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={TabNavigator} />
      <RootStack.Screen name="TarotReading" component={TarotReading} />
      <RootStack.Screen name="DivinationDetail" component={DivinationDetail} />
      <RootStack.Screen name="Membership" component={Membership} />
      <RootStack.Screen name="JinRiYunShi" component={JinRiYunShi} />
      <RootStack.Screen name="QianDao" component={QianDao} />
      <RootStack.Screen name="EditProfile" component={EditProfile} />
      <RootStack.Screen name="ChangePassword" component={ChangePassword} />
    </RootStack.Navigator>
  );
};

const Router = () => {
  const [isLogin, setIsLogin] = useState(null);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLogin(!!token);
  };

  // 手动触发VIP状态更新的函数
  const tryManualUpdateVipStatus = async (userId) => {
    try {
      console.log('🔧 尝试手动触发VIP状态更新...');
      
      // 从AsyncStorage获取最近的支付信息（如果有的话）
      const lastPaymentInfo = await AsyncStorage.getItem('lastPaymentInfo');
      let planType = '月会员'; // 默认值
      
      if (lastPaymentInfo) {
        const paymentData = JSON.parse(lastPaymentInfo);
        planType = paymentData.planType || '月会员';
        console.log('📋 使用存储的支付信息:', paymentData);
      }
      
      const response = await fetch('http://192.168.100.199:3010/payment/debug-update-vip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          planType: planType
        })
      });
      
      const result = await response.json();
      console.log('🔧 手动更新结果:', result);
      
      if (result.code === 200) {
        // 重新获取用户信息
        const updatedResponse = await fetch(`http://192.168.100.199:3010/auth/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (updatedResponse.ok) {
          const updatedResult = await updatedResponse.json();
          if (updatedResult.code === 200) {
            await AsyncStorage.setItem('user', JSON.stringify(updatedResult.data));
            Alert.alert(
              '🎊 会员开通成功！',
              `恭喜您成功开通${updatedResult.data.vip?.type}！\n\n现在您可以享受更多权益了。`,
              [{ text: '太棒了！', style: 'default' }]
            );
          }
        }
      } else {
        Alert.alert(
          '⚠️ 会员状态异常',
          '支付成功但会员状态未更新，请联系客服或稍后重试。',
          [{ text: '确定', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('❌ 手动更新VIP状态失败:', error);
      Alert.alert(
        '⚠️ 会员状态异常',
        '支付成功但会员状态未更新，请联系客服或稍后重试。',
        [{ text: '确定', style: 'default' }]
      );
    }
  };

  // 处理支付成功后的用户状态更新
  const handlePaymentSuccess = async () => {
    try {
      console.log('💰 检测到支付成功，开始更新用户信息...');
      
      // 获取用户信息
      const userObj = await AsyncStorage.getItem('user');
      if (!userObj) {
        console.log('❌ 未找到用户信息');
        return;
      }
      
      const user = JSON.parse(userObj);
      console.log('📝 当前用户ID:', user._id);
      
      // 显示成功提示，用户点击确定后再查询状态
      Alert.alert(
        '🎉 支付成功！',
        '恭喜您支付成功！\n\n点击确定后将自动更新您的会员状态。',
        [{ 
          text: '确定', 
          onPress: async () => {
            try {
              console.log('🔄 开始查询最新会员状态...');
              
              const token = await AsyncStorage.getItem('token');
              console.log('🔑 Token状态:', token ? '存在' : '不存在');
              
              // 从服务器重新获取用户信息
              console.log('🌐 发送请求到: http://192.168.100.199:3010/auth/user/' + user._id);
              const response = await fetch(`http://192.168.100.199:3010/auth/user/${user._id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              console.log('📡 响应状态:', response.status, response.statusText);
              
              if (response.ok) {
                const result = await response.json();
                console.log('📋 服务器返回结果:', result);
                
                if (result.code === 200) {
                  // 更新本地存储的用户信息
                  await AsyncStorage.setItem('user', JSON.stringify(result.data));
                  console.log('✅ 用户信息更新成功:', {
                    username: result.data.username,
                    vipType: result.data.vip?.type,
                    isMember: result.data.isMember
                  });
                  
                  // 再次显示会员开通结果
                  if (result.data.vip?.type && result.data.vip.type !== '免费') {
                    Alert.alert(
                      '🎊 会员开通成功！',
                      `恭喜您成功开通${result.data.vip.type}！\n\n现在您可以享受更多权益了。`,
                      [{ text: '太棒了！', style: 'default' }]
                    );
                  } else {
                    // 如果会员状态还是免费，尝试手动触发更新
                    console.log('⚠️ 会员状态未更新，尝试手动触发更新...');
                    await tryManualUpdateVipStatus(user._id);
                  }
                } else {
                  Alert.alert('获取会员状态失败', result.msg || '请稍后重试');
                }
              } else {
                console.error('❌ HTTP错误:', response.status, response.statusText);
                Alert.alert('网络错误', `服务器响应错误 (${response.status})，请稍后重试`);
              }
            } catch (error) {
              console.error('❌ 查询会员状态失败:', error);
              if (error.message.includes('Network request failed')) {
                Alert.alert('网络连接失败', '无法连接到服务器，请检查网络连接');
              } else {
                Alert.alert('查询失败', `网络错误: ${error.message}`);
              }
            }
          }
        }]
      );
    } catch (error) {
      console.error('❌ 处理支付回调失败:', error);
      Alert.alert('处理失败', '支付回调处理失败，请联系客服');
    }
  };

  // 处理深度链接
  const handleDeepLink = (url) => {
    console.log('🔗 收到深度链接:', url);
    
    if (url && url.includes('myapp://payment/success')) {
      console.log('💰 支付成功回调');
      // 延迟一下再处理，确保APP完全加载
      setTimeout(() => {
        handlePaymentSuccess();
      }, 1000);
    }
  };

  useEffect(() => {
    checkToken();
    
    // 处理APP启动时的深度链接
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });
    
    // 监听深度链接
    const linkingListener = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });
    
    // 监听应用状态变化，当应用重新激活时检查登录状态
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkToken();
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // 添加定时检查，用于快速响应退出登录
    const interval = setInterval(checkToken, 2000);
    
    return () => {
      linkingListener.remove();
      subscription?.remove();
      clearInterval(interval);
    };
  }, []);

  if (isLogin === null) return <LoadingScreen />;

  // 深度链接配置
  const linking = {
    prefixes: ['myapp://'],
    config: {
      screens: {
        App: {
          screens: {
            Main: {
              screens: {
                HomeTab: 'home',
                MyTab: 'my',
              },
            },
            Membership: 'membership',
          },
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        {isLogin ? (
          <AuthStack.Screen name="App" component={AppNavigator} />
        ) : (
          <AuthStack.Screen 
            name="Login" 
            children={() => <Login onLoginSuccess={checkToken} />}
          />
        )}
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default Router; 