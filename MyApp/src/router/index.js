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
import HistoryList from '../pages/HistoryList';
import HistoryAlone from '../pages/HistoryAlone';

import JinRiYunShi from '../pages/jinRiYunShi';
import QianDao from '../pages/QianDao';
import VipShip from '../pages/VipShip';
import geRen from '../pages/geRen';
import ChangePwd from '../pages/ChangePwd';

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
      <RootStack.Screen name="DivinationDetail" component={HistoryAlone} />
      <RootStack.Screen name="VipShip" component={VipShip} />
      <RootStack.Screen name="JinRiYunShi" component={JinRiYunShi} />
      <RootStack.Screen name="QianDao" component={QianDao} />
      <RootStack.Screen name="geRen" component={geRen} />
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



  // 处理支付成功
  const handlePaymentSuccess = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const token = await AsyncStorage.getItem('token');
      
      const res = await fetch(`http://192.168.100.199:3010/auth/user/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const result = await res.json();
        if (result.code === 200) {
          await AsyncStorage.setItem('user', JSON.stringify(result.data));
          
          if (result.data.vip?.type && result.data.vip.type !== '免费') {
            Alert.alert('🎊 会员开通成功！');
          } else {
            Alert.alert('⚠️ 会员状态异常');
          }
        }
      }
    } catch (error) {
      Alert.alert('支付处理失败');
    }
  };

  useEffect(() => {
    checkToken();
    
    // 处理支付成功链接
    Linking.getInitialURL().then((url) => {
      if (url?.includes('myapp://payment/success')) {
        setTimeout(handlePaymentSuccess, 1000);
      }
    });
    
    const linkingListener = Linking.addEventListener('url', (event) => {
      if (event.url?.includes('myapp://payment/success')) {
        setTimeout(handlePaymentSuccess, 1000);
      }
    });
    
    const interval = setInterval(checkToken, 2000);
    
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
            children={() => <Login onLoginSuccess={checkToken} />}
          />
        )}
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default Router; 