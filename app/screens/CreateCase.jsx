import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'

export default function CreateCase() {
  return (
  <SafeAreaView style={styles.container}>
     <View style={styles.container}>
       <Text>CreateCases</Text>
     </View>
     </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    margin:24
  }
})