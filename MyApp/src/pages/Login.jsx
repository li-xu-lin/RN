import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { Snackbar } from 'react-native-paper';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';
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
        <Text style={styles.title}>欢迎来到星占奇缘</Text>
        <Text style={styles.subtitle}>探索你的命运密码</Text>
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

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>开始占卜之旅</Text>
        </TouchableOpacity>
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
    ...commonStyles.title,
    fontSize: 22,
    textAlign: 'center',
  },
  subtitle: {
    ...commonStyles.smallText,
    textAlign: 'center',
  },
  formContainer: {
    ...commonStyles.paddingHorizontal,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    ...commonStyles.bodyText,
    marginBottom: 5,
  },
  input: {
    ...commonStyles.input,
    height: SIZES.buttonHeight,
  },
  loginButton: {
    ...commonStyles.primaryButton,
    marginTop: 20,
  },
  loginButtonText: {
    ...commonStyles.primaryButtonText,
  },
});

