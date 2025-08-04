import { StyleSheet, View, Image,Text } from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper';
export default function Titles() {
    const _handleMore = () => console.log('Shown more');
    const quan = "全部>"
    return (
        <Appbar.Header style={{ backgroundColor: '#f2f2f2' }}>
            <View style={styles.titleTop}>
                <Text style={{fontWeight:700,fontSize:18}}>普法课堂</Text>
                <Text onPress={_handleMore} style={styles.titleAppbar}>{quan}</Text>
            </View>
        </Appbar.Header>
    );
};


const styles = StyleSheet.create({
    titleTop: {
        justifyContent: "space-between",
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 16,
    },
    titleAppbar: {
        fontSize: 14
    }
})
