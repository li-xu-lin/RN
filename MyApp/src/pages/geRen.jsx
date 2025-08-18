import React, { useState, useEffect } from 'react';
import {View,Text,ScrollView,StyleSheet,TouchableOpacity,TextInput,Alert,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpuserApi } from '../request/auth';
import { commonStyles, COLORS, SIZES } from '../styles/commonStyles';

export default function GeRen({ navigation }) {
  //昵称
  const [username, setUsername] = useState('');
  //手机号
  const [phone, setPhone] = useState('');
  //个人简介
  const [content, setContent] = useState('');
  //性别
  const [sex, setSex] = useState('');
  // 加载状态
  const [loading, setLoading] = useState(false);
  //用户信息
  const [user, setUser] = useState({});

  // 获取用户信息
  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('user'));
        setUser(userData);

    setUsername(userData.username || '');
    setPhone(userData.phone || '');
    setContent(userData.content || '');
    setSex(userData.sex || '');
  };

  // 保存用户信息
  const handleSave = async () => {
    if (!username || !username.trim()) {
      Alert.alert('提示', '用户名不能为空');
      return;
    }

    if (!phone || !phone.trim()) {
      Alert.alert('提示', '手机号不能为空');
      return;
    }

    setLoading(true);
    try {
      const formData = {
        username,    
        phone,       
        content,      
        sex,          
      };
      
      const res = await UpuserApi(user._id, formData);
      
      if (res.success) {
        const updatedUser = { 
          ...user, 
          username: username,
          phone: phone,
          content: content,
          sex: sex,
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        Alert.alert('成功', '个人资料已更新', [
          { text: '确定', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('失败','更新失败，请稍后重试');
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑个人资料</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={[styles.saveButtonText, loading && styles.saveButtonDisabled]}>
            {loading ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>用户名</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="请输入用户名"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
          </View>


          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>手机号</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="请输入手机号"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>


          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>性别</Text>
            <View style={styles.genderContainer}>
              {['男', '女'].map((genderOption) => (
                <TouchableOpacity
                  key={genderOption}
                  style={[
                    styles.genderOption,
                    sex === genderOption && styles.genderOptionSelected
                  ]}
                  onPress={() => setSex(genderOption)}
                >
                  <Text style={[
                    styles.genderOptionText,
                    sex === genderOption && styles.genderOptionTextSelected
                  ]}>
                    {genderOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>个人简介</Text>
            <TextInput
              style={[styles.fieldInput, styles.multilineInput]}
              placeholder="介绍一下自己吧..."
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

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
  saveButton: {
    ...commonStyles.primaryButton,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    ...commonStyles.primaryButtonText,
  },
  saveButtonDisabled: {
    opacity: 0.6,
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
  fieldInput: {
    ...commonStyles.input,
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    ...commonStyles.secondaryButton,
    flex: 1,
    paddingVertical: 12,
  },
  genderOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderOptionText: {
    ...commonStyles.secondaryButtonText,
  },
  genderOptionTextSelected: {
    ...commonStyles.primaryButtonText,
  },
  bottomSpacing: {
    height: 50,
  },
}); 