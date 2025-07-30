import { StyleSheet, Text, View,Image, SafeAreaView,StatusBar, TouchableOpacity,BackHandler } from 'react-native'
import React,{useEffect,useState} from 'react'
// import { img } from '../../assets/global'
// import MyBackButton from '../../Pages/MyBackButton'
import MyBackButton from '../MyBackButton';
import { img } from '../../assets/global';

export default function QuestionCategory({navigation}) {
    useEffect(() => {
      const backAction = () => {
        navigation.goBack();
        return true; // Prevent default back behavior (which would normally navigate back)
      };
  
      // Listen to the back press event
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      // Clean up the event listener
      return () => backHandler.remove();
    }, []);
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
         <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
        
                <View style={[{ marginLeft: 20, marginTop: 10 }]}>
                  <MyBackButton onPress={navigation.goBack} />
                </View>

    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={img.QA[1]} style={styles.image}/>
      </View>
      <View style={{marginTop:16}}>
        <Text style={styles.WelcomeText}>Welcome to Doctors community Questions and Answers (Q & A)</Text>
      </View>

      <View>

      <TouchableOpacity activeOpacity={0.8} style={styles.categoryBtn} onPress={()=>navigation.navigate('ClinicalQuestion')}>
        <Text style={styles.categoryText}>Clinical Question</Text>
      </TouchableOpacity>

      <TouchableOpacity  activeOpacity={0.8} style={styles.categoryBtn} onPress={()=>navigation.navigate('NonClinicalQn')}>
        <Text style={styles.categoryText}>Non Specific Question</Text>
      </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    categoryText:{
        fontSize:16,
        color:'#fff',
        fontWeight:500
    },
    categoryBtn:{
        marginTop:16,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#028704',
        borderRadius:10,
        width:299,
        height:52,
        shadowColor:'#000',
        shadowOpacity:1,
        shadowRadius:60,
        shadowOffset:{width:0, height:16},
        elevation:19
    },
    WelcomeText:{
        fontSize:18,
        fontWeight:600,
        textAlign:'center'
    },
    container:{
        alignItems:'center',
        backgroundColor:'#fff',
        flex:1,
        marginHorizontal:16,
        marginTop:16,
    },
    image:{
        width:320,
        height:199,
        resizeMode:'cover'
    },
    imgContainer:{
        width:320,
        height:199, 
    }
})