import React, { useState, useEffect } from 'react';
import {View,Text,ScrollView,StyleSheet,TouchableOpacity,TextInput,Alert,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpuserApi } from '../request/auth';

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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
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
  fieldInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9FAFB',
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
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  genderOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 50,
  },
}); 