import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function MyHeader({title, style, leftButton}) {
  return (
    <View style={styles.container}>
      <View style={styles.backArrow}>
      {leftButton}
      </View>

      <View style={styles.headerContainer}>

      <Text style={styles.header}>{title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    // flex:1,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'#028704',
    height:40,
    // zIndex:1000,
    // position:'relative'
  },
  header:{
    fontSize:18,
    fontWeight:600,
    color:'#fff'
  },
  headerContainer:{
    marginLeft:50,
    // marginTop:60
  },
  backArrow:{
    marginHorizontal:20
  }
})