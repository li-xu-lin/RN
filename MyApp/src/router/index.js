import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, AppState } from 'react-native';
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

  useEffect(() => {
    checkToken();
    
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
      subscription?.remove();
      clearInterval(interval);
    };
  }, []);

  if (isLogin === null) return <LoadingScreen />;

  return (
    <NavigationContainer>
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