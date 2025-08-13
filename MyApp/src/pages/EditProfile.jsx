import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfileApi } from '../request/auth';

const { width } = Dimensions.get('window');

const EditProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    bio: '',
    gender: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const userObj = await AsyncStorage.getItem('user');
      if (userObj) {
        const userData = JSON.parse(userObj);
        setUser(userData);
        // 处理生日格式转换
        let formattedBirthDate = '';
        if (userData.birthDate) {
          const date = new Date(userData.birthDate);
          if (!isNaN(date.getTime())) {
            formattedBirthDate = date.toISOString().split('T')[0]; // 转为 YYYY-MM-DD 格式
          }
        }

        setFormData({
          nickname: userData.username || userData.nickname || '',
          phone: userData.phone || '',
          bio: userData.content || userData.bio || '',
          gender: userData.sex || userData.gender || '',
          birthDate: formattedBirthDate
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.nickname.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('提示', '手机号不能为空');
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserProfileApi(user._id, formData);
      
      if (result.success) {
        // 更新本地存储的用户信息，映射到正确的字段名
        const updatedUser = { 
          ...user, 
          username: formData.nickname,
          phone: formData.phone,
          content: formData.bio,
          sex: formData.gender,
          birthDate: formData.birthDate
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        Alert.alert('成功', '个人资料已更新', [
          { text: '确定', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('失败', result.data?.msg || '更新失败，请稍后重试');
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

  const renderHeader = () => (
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
  );

  const renderAvatarSection = () => (
    <View style={styles.avatarSection}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.imgs 
              ? { uri: user.imgs }
              : require('../assets/ben1.png')
          }
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.changeAvatarButton}>
          <Text style={styles.changeAvatarText}>更换头像</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFormField = (label, field, placeholder, multiline = false, keyboardType = 'default') => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderGenderSelector = () => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>性别</Text>
      <View style={styles.genderContainer}>
        {['男', '女'].map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.genderOption,
              formData.gender === gender && styles.genderOptionSelected
            ]}
            onPress={() => handleInputChange('gender', gender)}
          >
            <Text style={[
              styles.genderOptionText,
              formData.gender === gender && styles.genderOptionTextSelected
            ]}>
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderAvatarSection()}
        
        <View style={styles.formContainer}>
          {renderFormField('昵称', 'nickname', '请输入昵称')}
          {renderFormField('手机号', 'phone', '请输入手机号', false, 'phone-pad')}
          {renderGenderSelector()}
          {renderFormField('生日', 'birthDate', '请输入生日，如：1995-01-01')}
          {renderFormField('个人简介', 'bio', '介绍一下自己吧...', true)}
        </View>
        
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  changeAvatarButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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

export default EditProfile; 