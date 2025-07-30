import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SponsorLogo } from '../assets/global'

export default function Sponsorlogo() {
  return (
    <View style={styles.Logo}>
      <Image source={SponsorLogo.img} style={styles.logo}/>
    </View>
  )
}

const styles = StyleSheet.create({
    Logo:{
        // flex:1,
        marginTop:20,
        height:120,
        width:120,
        alignItems:'center',
        justifyContent:'center',
        // backgroundColor:'green'
      },
      logo:{
        resizeMode:'contain',
        height:110,
        width:110
      }
})