import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changePasswordApi } from '../request/auth';

const ChangePassword = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user');
      if (userObj) {
        setUser(JSON.parse(userObj));
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return '密码长度至少6位';
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return '密码须包含字母和数字';
    }
    return null;
  };

  const handleChangePassword = async () => {
    // 验证输入
    if (!formData.oldPassword.trim()) {
      Alert.alert('提示', '请输入当前密码');
      return;
    }

    if (!formData.newPassword.trim()) {
      Alert.alert('提示', '请输入新密码');
      return;
    }

    if (!formData.confirmPassword.trim()) {
      Alert.alert('提示', '请确认新密码');
      return;
    }

    // 验证新密码格式
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      Alert.alert('密码格式错误', passwordError);
      return;
    }

    // 确认密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('提示', '两次输入的新密码不一致');
      return;
    }

    // 检查新旧密码是否相同
    if (formData.oldPassword === formData.newPassword) {
      Alert.alert('提示', '新密码不能与当前密码相同');
      return;
    }

    setLoading(true);
    try {
      const result = await changePasswordApi(user._id, formData.oldPassword, formData.newPassword);
      
      if (result.success) {
        Alert.alert('成功', '密码修改成功', [
          { 
            text: '确定', 
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        Alert.alert('失败', result.data?.msg || '密码修改失败，请稍后重试');
      }
    } catch (error) {
      Alert.alert('错误', '网络异常，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>修改密码</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderPasswordField = (label, field, placeholder) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          secureTextEntry={!showPasswords[field]}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => togglePasswordVisibility(field)}
        >
          <Text style={styles.eyeIcon}>
            {showPasswords[field] ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSecurityTips = () => (
    <View style={styles.tipsContainer}>
      <Text style={styles.tipsTitle}>🛡️ 密码安全提示</Text>
      <Text style={styles.tipItem}>• 密码长度至少6位</Text>
      <Text style={styles.tipItem}>• 包含字母和数字组合</Text>
      <Text style={styles.tipItem}>• 不要使用过于简单的密码</Text>
      <Text style={styles.tipItem}>• 建议定期更换密码</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {renderPasswordField('当前密码', 'oldPassword', '请输入当前密码')}
          {renderPasswordField('新密码', 'newPassword', '请输入新密码')}
          {renderPasswordField('确认新密码', 'confirmPassword', '请再次输入新密码')}
          
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '修改中...' : '修改密码'}
            </Text>
          </TouchableOpacity>
        </View>

        {renderSecurityTips()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 5,
  },
  bottomSpacing: {
    height: 50,
  },
});

export default ChangePassword; 