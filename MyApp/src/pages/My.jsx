import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function My() {
    const nav = useNavigation()
    const [user, setUser] = useState(null)
    const getUser = async () => {
        const userObj = JSON.parse(await AsyncStorage.getItem('user'))
        setUser(userObj)
        console.log(userObj);
    }
    useEffect(() => {
        getUser()
    }, [])
    return (
        <ScrollView>
            <View style={{ backgroundColor: "#f2f2f2", width: "100%", height: 1000 }}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerText}>普法宣传</Text>
                        <Text style={styles.geRen} onPress={() => { nav.navigate('Main') }}>首页</Text>
                    </View>
                    <View style={styles.headerBottom}>
                        <View style={styles.headerBottomLeft}>
                            {user ? <Image source={{ uri: user.avatar }} style={{ width: 100, height: 100 }}></Image> : null}
                        </View>
                        <View style={styles.headerBottomRight}>
                            <Text>{user ? user.username : null}</Text>
                            <Text>{user ? user.content : null}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.Main}>
                    <Text>我的收藏</Text>
                </View>
                <View style={styles.Main}>
                    <Text>个人信息</Text>
                </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    //头部样式
    header: {
        width: "100%",
        height: "22%",
        backgroundColor: '#909ffa',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
        right: "5%",
        top: "40%",
        fontSize: 14,
    },
    headerTop: {
        width: "100%",
        height: "30%"
    },
    headerBottom: {
        width: "100%",
        height: "60%",
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerBottomLeft: {
        width: "20%",
        height: "70%",
        backgroundColor: "blue"
    },
    headerBottomRight: {
        width: "65%",
        height: "70%",
        backgroundColor: "yellow",
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    Main: {
        width: "100%",
        height: "8%",
        backgroundColor:'#ffffff',
        marginBottom: '1%'
    }
})
