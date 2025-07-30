import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import ImageLoader from '../src/ImageLoader'
import ImageLoader from '../scr/ImageLoader'
import { img } from '../assets/global'


export default function AuthorName({authorPic, AuthorName}) {
  return (
    <View style={styles.container}>
      <View>
        {/* <Image source={{uri:authorPic}} style={styles.img}/>
         */}
          <ImageLoader
                resizeMode= {'cover'}
                defaultImageSource={img.user[1]}
                source={{uri:authorPic}}
                  style={styles.img}
                />
      </View>
      <View>
      <Text style={styles.authorName}>{AuthorName}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        columnGap:8,
        marginTop:20,
        marginBottom:20
    },
    img:{
        width:45,
        height:45,
        borderRadius:50,
        resizeMode:'cover'
    },
    authorName:{
        fontWeight:'bold'
    }
})