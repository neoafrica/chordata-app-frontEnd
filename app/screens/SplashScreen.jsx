import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { SponsorLogo } from '../assets/global'

export default function SplashScreen() {
  return (
    <View style={styles.container}>

    <View style={styles.imageContainer}>
             <Image source={SponsorLogo.img} style={styles.img} />
           </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff",
        alignItems:'center',
        justifyContent:'center'
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
      },
      img: {
        width: 150,
        height: 150,
        resizeMode: "contain",
      },
})