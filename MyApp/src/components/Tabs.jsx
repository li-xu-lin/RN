import { StyleSheet, View, Image, Text } from 'react-native'
import React,{useState} from 'react'

export default function Tabs() {
    const [value, setValue] = useState('每日运势');
    return (
       <View style={styles.tabsBox}>
        <Text style={[styles.tabs,value==="每日运势"?styles.active:null]} onPress={()=>{setValue("每日运势")}}>每日运势</Text>
        <Text style={[styles.tabs,value==="塔罗牌"?styles.active:null]} onPress={()=>{setValue("塔罗牌")}}>塔罗牌</Text>
        <Text style={[styles.tabs,value==="星座配对"?styles.active:null]} onPress={()=>{setValue("星座配对")}}>星座配对</Text>
       </View>
    );
};


const styles = StyleSheet.create({
    tabsBox:{
        width:"100%",
        height: 50,
        justifyContent:"space-around",
        flexDirection:'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    tabs:{
        flex: 1,
        height: 40,
        lineHeight: 40,
        textAlign:'center',
        borderRadius: 20,
        backgroundColor: '#fff',
        color: '#8B5CF6',
        fontWeight: '500',
        fontSize: 14,
        marginHorizontal: 5,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    active:{
        backgroundColor:"#8B5CF6",
        color:"#ffffff",
        fontWeight: '600'
    }
})
