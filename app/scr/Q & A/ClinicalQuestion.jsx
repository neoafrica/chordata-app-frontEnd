import { StyleSheet, Text, View, BackHandler } from "react-native";
import React,{useEffect} from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// import CustomTabBar from "../../navigation/CustomTabBar";
import CustomTabBar from "../../navigation/CustomTabBar";
import SwahiliForm from "./SwahiliForm";
import EnglishForm from "./EnglishForm";
import { SponsorLogo } from "../../assets/global";
import { Image } from "react-native";
// import MyBackButton from "../../Pages/MyBackButton";
import MyBackButton from "../MyBackButton";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

const TopTabs = createMaterialTopTabNavigator();

const formHeader=()=>{
    return (
        <View style={{alignItems:'center', marginHorizontal:8, marginTop:8, marginBottom:8}}>

        <View style={styles.imageContainer}>
            <Image source={SponsorLogo.image} style={styles.image} />
        </View>
        <View >
            <Text style={{fontSize:24}}>Clinical question form</Text>
        </View>
        </View>
    )
}


const clinicalTopTabsCategory=()=>{
    return (
        <TopTabs.Navigator
        tabBar={(props)=><CustomTabBar {...props} />}
      initialRouteName="Swahili"
    
      style={{backgroundColor:'#fff', flex:1}}
          screenOptions={{
            tabBarShowLabel:true,
        
            tabBarItemStyle:{
              width:80,
            },
            tabBarStyle:{
    
              marginTop:24,
            
            },
            swipeEnabled:false,
            
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
             flex:1,
              fontSize: 16,
              textAlign: "center",
              width: 120,
              marginHorizontal: 16,
              color:'red'
            },
            tabBarIndicatorContainerStyle:{  backgroundColor:"green", },
            tabBarIndicatorStyle: {display:'none',  position:'absolute', left:0,right:0,bottom:0,height:4},
          }}
        >
         <TopTabs.Screen name="English" component={EnglishForm}/>
         <TopTabs.Screen name="Swahili" component={SwahiliForm}/>
        </TopTabs.Navigator>
     
      );
}

export default function ClinicalQuestion({navigation}) {
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
    return(
        <View style={styles.container}>
          <NetworkStatusBanner/>
            <View style={{ marginLeft: 30, marginTop: 20, }}>
                    <MyBackButton onPress={navigation.goBack}  />
                  </View>
            {formHeader()}
            {clinicalTopTabsCategory()}
        </View>
    )
}

const styles = StyleSheet.create({
  container:{
    // alignItems:'center',
    flex:1,
    backgroundColor:'#fff'
  },
  imageContainer:{
  
    flexDirection:'column',
    height:95,
    width:201,
    alignItems:'center',
    justifyContent:'center'
  },
  image:{
    height:95,
    width:201,
    resizeMode:'cover',
  
  }
});