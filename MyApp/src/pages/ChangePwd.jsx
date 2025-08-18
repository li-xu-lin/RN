import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UpPwd } from '../request/auth';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';

export default function ChangePwd() {
  // 获取导航对象
  const nav = useNavigation();

  // 用户信息状态
  const [user, setUser] = useState(null);

  //旧密码
  const [oldPwd, setOldPwd] = useState('');
  //新密码
  const [newPwd, setNewPwd] = useState('');
  //确认新密码
  const [pwd, setPwd] = useState('');

  // 加载状态
  const [loading, setLoading] = useState(false);

  // 组件挂载时获取用户信息
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem('user')));
  };

  //密码格式验证
  const yanPwd = (password) => {
    if (password.length < 6) {
      return '密码长度至少6位';
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return '密码须包含字母和数字';
    }
    return null;
  };

  //处理密码修改
  const gaiPwd = async () => {
    // 验证当前密码
    if (!oldPwd.trim()) {
      Alert.alert('提示', '请输入当前密码');
      return;
    }

    // 验证新密码
    if (!newPwd.trim()) {
      Alert.alert('提示', '请输入新密码');
      return;
    }

    // 验证确认密码
    if (!pwd.trim()) {
      Alert.alert('提示', '请确认新密码');
      return;
    }

    // 验证新密码格式
    const pwds = yanPwd(newPwd);
    if (pwds) {
      Alert.alert('密码格式错误', pwds);
      return;
    }

    // 确认密码一致性
    if (newPwd !== pwd) {
      Alert.alert('提示', '两次输入的新密码不一致');
      return;
    }

    // 检查新旧密码是否相同
    if (oldPwd === newPwd) {
      Alert.alert('提示', '新密码不能与当前密码相同');
      return;
    }

    // 开始修改密码
    setLoading(true);
    try {
      const res = await UpPwd(user._id, oldPwd, newPwd);

      if (res.success) {
        Alert.alert('成功', '密码修改成功', [
          {
            text: '确定',
            onPress: () => nav.goBack()
          }
        ]);
      } else {
        Alert.alert('失败', '密码修改失败，请稍后重试');
      }
    } catch (error) {
      Alert.alert('错误', '网络异常，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>修改密码</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>当前密码</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="请输入当前密码"
                placeholderTextColor="#999"
                value={oldPwd}
                onChangeText={setOldPwd}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>新密码</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="请输入新密码"
                placeholderTextColor="#999"
                value={newPwd}
                onChangeText={setNewPwd}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>确认新密码</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="请再次输入新密码"
                placeholderTextColor="#999"
                value={pwd}
                onChangeText={setPwd}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={gaiPwd}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '修改中...' : '修改密码'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  header: {
    ...commonStyles.header,
    ...commonStyles.headerRow,
  },
  backButton: {
    width: SIZES.buttonHeight,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    ...commonStyles.centerContainer,
  },
  backButtonText: {
    ...commonStyles.bodyText,
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  placeholder: {
    width: SIZES.buttonHeight,
  },
  scrollView: {
    ...commonStyles.scrollView,
  },
  formContainer: {
    ...commonStyles.card,
    margin: SIZES.padding,
  },

  formField: {
    ...commonStyles.marginBottom,
    marginBottom: 20,
  },
  fieldLabel: {
    ...commonStyles.subtitle,
    marginBottom: 8,
  },
  passwordContainer: {
    ...commonStyles.input,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  passwordInput: {
    ...commonStyles.input,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  submitButton: {
    ...commonStyles.primaryButton,
    paddingVertical: 15,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: 16,
  },

  bottomSpacing: {
    height: 50,
  },
}); 