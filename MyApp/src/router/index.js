import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入页面组件
import Login from '../pages/Login';
import Home from '../pages/Home';
import My from '../pages/My';
import TarotReading from '../pages/TarotReading';
import Zodiac from '../pages/Zodiac';
import DivinationHistory from '../pages/DivinationHistory';
import MoonPhase from '../pages/MoonPhase';
import Settings from '../pages/Settings';
import Zhanbu from '../pages/Zhan';

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

// 占卜功能页面
const DivinationScreen = () => <Zhanbu />;

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
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
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
        component={DivinationScreen}
        options={{
          tabBarLabel: '占卜',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 22, color }}>
              {focused ? '🔮' : '🔷'}
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="ZodiacTab" 
        component={Zodiac}
        options={{
          tabBarLabel: '运势',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: focused ? 24 : 22, color }}>
              {focused ? '⭐' : '✨'}
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
      <RootStack.Screen name="MoonPhase" component={MoonPhase} />
      <RootStack.Screen name="Settings" component={Settings} />
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
