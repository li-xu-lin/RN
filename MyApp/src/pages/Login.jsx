import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { Snackbar } from 'react-native-paper';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, COLORS } from '../styles/commonStyles';
import { loginApi } from '../request/auth'



export default function Login() {
  const nav = useNavigation();
  const [phone, setPhone] = useState('')
  const [pwd, setPwd] = useState('')
  const [visible, setVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
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
        AsyncStorage.setItem('user', JSON.stringify(res.data.data))
        setSnackbarText(res.data.msg)
        setVisible(true)
        setPhone("")
        setPwd("")
        // 登录成功后自动切换到主页（通过状态更新）
        // 不需要手动导航，路由会自动处理
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
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f5ff" />

      <View style={styles.header}>
        <Text style={styles.title}>✨ 欢迎来到星占奇缘</Text>
        <Text style={styles.subtitle}>🔮 探索你的命运密码</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>手机号</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号"
            placeholderTextColor="#B8B5FF"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>密码</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入密码"
            placeholderTextColor="#B8B5FF"
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
          <Text style={styles.loginButtonText}>开始占卜之旅</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>还没有账号? </Text>
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
  );
}


const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    ...commonStyles.paddingHorizontal,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
  },
  formContainer: {
    ...commonStyles.paddingHorizontal,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#6B46C1',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  loginButton: {
    height: 50,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
});

