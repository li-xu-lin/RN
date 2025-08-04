import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper'
export default function Swipers() {

    return (
        <View style={styles.mainTop}>
            <Swiper
                style={styles.wrapper}
                autoplay={true}
                autoplayTimeout={3}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                paginationStyle={styles.paginationStyle}
                loop={true}
            >
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/p1.jpg')}
                        style={styles.image}
                    />
                </View>

                <View style={styles.slide}>
                    <Image
                        source={require('../assets/p2.jpg')}
                        style={styles.image}
                    />
                </View>

                <View style={styles.slide}>
                    <Image
                        source={require('../assets/p3.jpg')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.slide}>
                    <Image
                        source={require('../assets/p4.jpg')}
                        style={styles.image}
                    />
                </View>
            </Swiper>
        </View>
    )
}

const styles = StyleSheet.create({
    mainTop: {
        width: "100%",
        height: "60%"
    },
    // 轮播图
    wrapper: {
        height: 250,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: "96%",
        height: "96%",
        borderRadius: 10,
    },
    text: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    // 小圆点样式
    dot: {
        backgroundColor: 'rgba(255,255,255,.3)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
    },
    paginationStyle: {
        bottom: 10,
    }
})
