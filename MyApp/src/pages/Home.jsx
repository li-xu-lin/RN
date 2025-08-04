import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Swipers from '../components/Swipers'
import Carts from '../components/Carts'
import Titles from '../components/Titles'
import Tabs from '../components/Tabs'
export default function Home() {
  const nav = useNavigation()
  return (
    <ScrollView>
      <View style={{ backgroundColor: "#f2f2f2", width: "100%", height: 1000 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>普法宣传</Text>
          <Text style={styles.geRen} onPress={()=>{nav.navigate('my')}}>个人中心</Text>
        </View>
        <View style={styles.main}>
          <Swipers></Swipers>
          <Carts></Carts>
        </View>
        <View style={styles.mains}>
          <Titles></Titles>
          <Tabs></Tabs>
        </View>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  //头部样式
  header: {
    width: "100%",
    height: "6%",
    backgroundColor: '#909ffa',
  },
  headerText: {
    color: "#ffffff",
    marginTop: "6%",
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 800
  },
  geRen: {
    color: "#ffffff",
    position: 'absolute',
    right: "2%",
    top: "50%",
    fontSize: 14,
  },
  //主体样式配置
  main: {
    width: "90%",
    height: "42%",
    marginLeft: '5%',
    marginTop: '3%'
  },
  //下半主题部分
  mains: {
    width: "90%",
    height: "70%",
    marginLeft: '5%',
    marginTop: '3%',
  }
})
