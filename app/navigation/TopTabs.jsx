import { StyleSheet, Text, View,BackHandler,Image, SafeAreaView } from 'react-native'
import React,{useEffect} from 'react'
import TopTabsNavigator from './TopTabsNavigator'
import { useNavigation } from '@react-navigation/native'
import { SponsorLogo } from '../assets/global'
import { useLogin } from '../Api/UserContext'
import NetworkStatusBanner from '../Api/NetInfo/NetWorkStatusBanner'


export default function TopTab() {
    const { userData, getToken } = useLogin();

    // console.log(userData)
    const navigation = useNavigation();

    useEffect(() => {
      const backAction = () => {
       navigation.goBack()
        return true; // Prevent default back behavior (which would normally navigate back)
      };
  
      // Listen to the back press event
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
      // Clean up the event listener
      return () => backHandler.remove();
    }, []);
  return (
        


    <SafeAreaView style={styles.container}>
        <NetworkStatusBanner/>
    <View style={styles.header}>
        <Image source={SponsorLogo.img} style={styles.headerImg}/> 
    </View>

    <View style={{flexDirection:'row', columnGap:24, alignItems:'center',height:60}}>

        <View style={styles.AuthorImgContainer}>
            <Image source={{uri:userData?.profileImage?.secure_url}} style={styles.authorImg}/>
        </View>

        <View style={{marginLeft:24}}>
            <Text style={{fontSize:18, fontWeight:600,left:24}}>{userData?.username}</Text>
        </View>
    </View>

   

    <TopTabsNavigator />
    </SafeAreaView>

    
 
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        flex:1
    },
    header:{
        width:360,
        height:126,
        backgroundColor:'#aaa'
    },
    headerImg:{
        height:126,
        width:'100%',
        resizeMode:'cover'
    },
    authorImg:{
        height:78,
        width:78,
        borderRadius:50
    },
    AuthorImgContainer:{
        // position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        left:32,
        bottom:36,
        height:80,
        width:80,
        borderRadius:50,
        borderWidth:0.5,
        borderColor:'#028704'
    }
})