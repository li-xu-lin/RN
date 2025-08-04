import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { Button, Snackbar } from 'react-native-paper';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginApi } from '../request/auth'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
  },
  loginButton: {
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState('')
  const [pwd, setPwd] = useState('')
  const [visible, setVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  const onDismissSnackBar = () => setVisible(false);
  const handleLogin = async () => {
    let params = {
      phone,
      pwd
    }
    if (phone === '' || pwd === '') {
      setSnackbarText("手机号和密码不能为空")
      setVisible(true)
      return
    }
    
    let res = await loginApi(params)
    if (res.success) {
      if (res.data.code === 200) {
        AsyncStorage.setItem('token', "123456")
        console.log(JSON.stringify(res.data.data));
        
        AsyncStorage.setItem('user', JSON.stringify(res.data.data))
        setSnackbarText(res.data.msg)
        setVisible(true)
        setPhone("")
        setPwd("")
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setPhone("")
        setPwd("")
        setSnackbarText(res.data.msg)
        setVisible(true)
      }
    } else {
      setPhone("")
      setPwd("")
      setSnackbarText(res.data.msg)
      setVisible(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <View style={styles.header}>
        <Text style={styles.title}>欢迎登录</Text>
        <Text style={styles.subtitle}>请输入您的账号信息</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>手机号</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>密码</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入密码"
            placeholderTextColor="#999"
            value={pwd}
            onChangeText={setPwd}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>忘记密码?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>没有账号? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>立即注册</Text>
          </TouchableOpacity>
        </View>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={3000}
          action={{
            label: 'Undo',
            onPress: () => {
              setVisible(false)
            }
          }}>
          {snackbarText}
        </Snackbar>
      </View>
    </SafeAreaView>
  )
}

