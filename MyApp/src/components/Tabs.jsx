import { StyleSheet, View, Image, Text } from 'react-native'
import React,{useState} from 'react'

export default function Tabs() {
    const [value, setValue] = useState('视频');
    return (
       <View style={styles.tabsBox}>
        <Text style={[styles.tabs,value==="视频"?styles.active:null]} onPress={()=>{setValue("视频")}}>视频</Text>
        <Text style={[styles.tabs,value==="图文"?styles.active:null]} onPress={()=>{setValue("图文")}}>视频</Text>
        <Text style={[styles.tabs,value==="音频"?styles.active:null]} onPress={()=>{setValue("音频")}}>视频</Text>
       </View>
    );
};


const styles = StyleSheet.create({
    tabsBox:{
        width:"86%",
        height:"8%",
        justifyContent:"space-between",
        flexDirection:'row'
    },
    tabs:{
        width:"26%",
        height:"50%",
        lineHeight:"26",
        textAlign:'center',
        borderRadius:50
    },
    active:{
        backgroundColor:"#5c79f6",
        color:"#ffffff"
    }
})
