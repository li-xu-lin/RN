import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const nav = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ 设置</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 账户设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 账户设置</Text>
        <View style={styles.settingGroup}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📝</Text>
              <Text style={styles.settingText}>编辑个人资料</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔒</Text>
              <Text style={styles.settingText}>修改密码</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌟</Text>
              <Text style={styles.settingText}>选择星座</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>白羊座</Text>
              <Text style={styles.settingArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 通知设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 通知设置</Text>
        <View style={styles.settingGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📱</Text>
              <Text style={styles.settingText}>推送通知</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: '#8B5CF6' }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⏰</Text>
              <Text style={styles.settingText}>每日运势提醒</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>09:00</Text>
              <Text style={styles.settingArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingText}>月相提醒</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>开启</Text>
              <Text style={styles.settingArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 应用设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 应用设置</Text>
        <View style={styles.settingGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingText}>深色模式</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ccc', true: '#8B5CF6' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingText}>音效</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#ccc', true: '#8B5CF6' }}
              thumbColor={soundEffects ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🗑️</Text>
              <Text style={styles.settingText}>清除缓存</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>156MB</Text>
              <Text style={styles.settingArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ 关于应用</Text>
        <View style={styles.settingGroup}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📖</Text>
              <Text style={styles.settingText}>使用指南</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📞</Text>
              <Text style={styles.settingText}>联系我们</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⭐</Text>
              <Text style={styles.settingText}>评价应用</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📄</Text>
              <Text style={styles.settingText}>隐私政策</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🏷️</Text>
              <Text style={styles.settingText}>版本号</Text>
            </View>
            <Text style={styles.settingValue}>v1.0.0</Text>
          </View>
        </View>
      </View>

      {/* 退出登录 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 退出登录</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ff',
  },
  
  // 头部
  header: {
    backgroundColor: '#8B5CF6',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },

  // 设置区域
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
    marginBottom: 15,
  },
  settingGroup: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#8B5CF6',
    marginRight: 8,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
  },

  // 退出登录
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
}); 