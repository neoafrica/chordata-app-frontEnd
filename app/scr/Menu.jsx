import { StyleSheet, Text, View,Button,ScrollView,Dimensions } from 'react-native'
import React from 'react'

import CategoryButton from './CategoryButton'

const {height, width}= Dimensions.get('window')



export default function Menu() {
  return (
    <View style={styles.container}>
        {/* <View style={styles.textContainer}>
            <Text  style={styles.categoriesText}>Categories</Text>
        </View> */}

        {/* ****************************************** */}

        <ScrollView  style={{flex:1}}scrollEnabled={true} contentContainerStyle={styles.categoryContainer} horizontal>

        <View>
        <CategoryButton names={"Poultry"} icons={4}/>
        </View>
        <View>
            <CategoryButton names={"Cow"} icons={1}/>
        </View>
        <View>
        <CategoryButton names={"Dog"} icons={2}/>
        </View>
        <View>
        <CategoryButton names={"Pig"} icons={5}/>
        </View>
        <View>
        <CategoryButton names={"Goat"} icons={3}/>
        </View>
         <View>
        <CategoryButton names={"Cat"} icons={8}/>
        </View>
        <View>
        <CategoryButton names={"Sheep"} icons={9}/>
        </View>
      
        </ScrollView>

        {/* *********************************************** */}
      
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        // flex:1,
        backgroundColor:'#028704',
        width:316,
        height:110,
        borderRadius:6,
        shadowColor:'black',
        shadowOffset:{width:0,height:4},
        shadowRadius:60,
        shadowOpacity:1,
        marginTop:16,
        // alignItems:'center'
        // elevation:12,
        // alignItems:'center'
    },
    categoriesText:{
        color:'white',
       
        fontSize:16,
        // fontFamily:'display fair',
        fontWeight:'bold',
     
    },
    textContainer:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    categoryContainer:{
        // flex:1,
        // display:'flex',
        // flexWrap:'wrap',
        columnGap:20,
        // rowGap:10,
        flexDirection:'row',
        justifyContent:'center',
        marginTop:30,
        width:500,
        // alignItems:'center'
        // marginHorizontal:16,

        // width:width*1.7
        // marginRight:20
    },
   
})