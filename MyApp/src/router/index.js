import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入页面组件
import Login from '../pages/Login';
import Home from '../pages/Home';
import My from '../pages/My';
import ZhanBu from '../pages/ZhanBu';
import ZhanBuXiangXi from '../pages/ZhanBuXiangXi';
import HistoryList from '../pages/HistoryList';
import HistoryAlone from '../pages/HistoryAlone';

import JinRiYunShi from '../pages/jinRiYunShi';
import QianDao from '../pages/QianDao';
import VipShip from '../pages/VipShip';
import GeRen from '../pages/geRen';
import ChangePwd from '../pages/ChangePwd';
import { queryZhiFu } from '../request/auth';

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
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>
              🏡
            </Text>
          ),
        }}
      />


      <Tab.Screen 
        name="HistoryTab" 
        component={HistoryList}
        options={{
          tabBarLabel: '历史',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>
              📖
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="MyTab" 
        component={My}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>
              👥
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
      <RootStack.Screen name="ZhanBu" component={ZhanBu} />
      <RootStack.Screen name="ZhanBuXiangXi" component={ZhanBuXiangXi} />
      <RootStack.Screen name="LiShiXiangQing">
        {({ route }) => <HistoryAlone historyId={route.params?.historyId} />}
      </RootStack.Screen>
      <RootStack.Screen name="VipShip" component={VipShip} />
      <RootStack.Screen name="JinRiYunShi" component={JinRiYunShi} />
      <RootStack.Screen name="QianDao" component={QianDao} />
      <RootStack.Screen name="geRen" component={GeRen} />
              <RootStack.Screen name="ChangePwd" component={ChangePwd} />
    </RootStack.Navigator>
  );
};

const Router = () => {
  const [isLogin, setIsLogin] = useState(null);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    setIsLogin(!!token);
  };




    // 更新用户会员状态
  const updateUserStatus = async (outTradeNo) => {
    try {
      
      // 1. 先调用支付查询接口，触发后端状态更新
      const queryResult = await queryZhiFu(outTradeNo);
      
      if (queryResult.success && queryResult.data.data.status === 'paid') {
        
        // 2. 支付成功，获取最新用户信息
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const token = await AsyncStorage.getItem('token');
        
        const res = await fetch(`http://192.168.100.200:3010/auth/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const result = await res.json();
          
          
          if (result.code === 200) {
            await AsyncStorage.setItem('user', JSON.stringify(result.data));
            Alert.alert('会员开通成功！');
          }
        }
      } else if (queryResult.success) {
        
        
        // 如果是pending或unknown状态，都尝试强制更新（测试用）
        if (queryResult.data.data.status === 'pending' || queryResult.data.data.status === 'unknown') {
          
          
          try {
            const user = JSON.parse(await AsyncStorage.getItem('user'));
            const planType = outTradeNo.split('_')[1]; // 从订单号提取套餐类型
            
            const forceUpdateRes = await fetch('http://192.168.100.200:3010/payment/debug-update-vip', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id, planType })
            });
            
            if (forceUpdateRes.ok) {
              
              
              // 重新获取用户信息
              const token = await AsyncStorage.getItem('token');
              const userRes = await fetch(`http://192.168.100.200:3010/auth/user/${user._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              
              if (userRes.ok) {
                const userResult = await userRes.json();
                if (userResult.code === 200) {
                  await AsyncStorage.setItem('user', JSON.stringify(userResult.data));
                  
                  Alert.alert('会员开通成功！');
                }
              }
            }
          } catch (forceError) {
            console.log('强制更新失败:', forceError);
          }
        }
      } else {
        console.log('支付查询失败:', queryResult);
      }
    } catch (error) {
      Alert.alert('状态更新失败', '请稍后重试或联系客服');
    }
  };

  useEffect(() => {
    // 检查用户登录状态
    checkToken();
    
    // 监听支付成功链接
    const handlePaymentLink = (url) => {
      
      if (url?.includes('myapp://payment/success')) {
        
        // 从URL中提取订单号
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const outTradeNo = urlParams.get('out_trade_no');
        
        
        if (outTradeNo) {
          // 延迟更新，确保后端处理完成
          setTimeout(() => updateUserStatus(outTradeNo), 2000);
        } else {
        }
      }
    };
    
    // 处理应用启动时的链接
    Linking.getInitialURL().then(handlePaymentLink);
    
    // 监听运行时的链接跳转
    const linkingListener = Linking.addEventListener('url', (event) => {
      handlePaymentLink(event.url);
    });
    
    // 定期检查登录状态（每2秒）
    const interval = setInterval(checkToken, 2000);
    
    // 清理函数
    return () => {
      linkingListener.remove();
      clearInterval(interval);
    };
  }, []);

  if (isLogin === null) return <LoadingScreen />;

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
            VipShip: 'vipship',
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
            component={Login}
          />
        )}
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default Router; 