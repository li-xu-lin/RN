import { StyleSheet, View, Image,Text } from 'react-native'
import React from 'react'
import Ben1 from '../assets/ben1.png'
import Ben2 from '../assets/ben2.png'
import Tuceng from '../assets/tuceng.png'
export default function Carts() {

    return (
        <View style={styles.cartbox}>
            <View style={styles.cart}>
                <Image source={Ben1} style={styles.images} />
                <Text style={styles.cartText}>法律法规</Text>
            </View>
            <View style={styles.cart}>
                <Image source={Tuceng} style={styles.images} />
                <Text style={styles.cartText}>法治百科</Text>
            </View>
            <View style={styles.cart}>
                <Image source={Ben2} style={styles.images} />
                <Text style={styles.cartText}>经典案例</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cartbox: {
        width: "100%",
        height: "40%",
        justifyContent: "space-around",
        alignItems: 'center',
        flexDirection: 'row'
    },
    cart: {
        width: 80,
        height: 90,
        backgroundColor: "#dbdfff"
    },
    images: {
        width: "50%",
        height: "50%",
        marginLeft: "26%",
        marginTop: "9%"
    },
    cartText:{
        textAlign:'center',
        marginTop:"10%",
        fontSize:13,
        fontWeight:700
    }
})
