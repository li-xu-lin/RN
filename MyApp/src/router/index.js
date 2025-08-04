import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入页面组件
import Login from '../pages/Login';
import Home from '../pages/Home';
import My from '../pages/My';

const AuthStack = createNativeStackNavigator();

// 加载状态组件
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#3498db" />
    <Text style={{ marginTop: 10 }}>加载中...</Text>
  </View>
);

const MainApp = () => <Home />;

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
          <>
          <AuthStack.Screen name="Main" component={MainApp} />
          <AuthStack.Screen name="my" component={My} />
          </>
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
