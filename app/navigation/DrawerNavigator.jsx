// import './gesture-handler';
import "react-native-gesture-handler"
import 'react-native-reanimated'; // 🔁 This must be at the top
import { StyleSheet, Text, View, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import DrawerContents from "../scr/DrawerContents";
import { FontAwesome, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { NavigationContainer } from "@react-navigation/native";
import AboutUs from "../scr/AboutUs";
import ContactUs from "../scr/ContactUs";
import TopStackBarNav from "./TopStackBarNav";


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {

   
  return (

  <Drawer.Navigator

  screenOptions={{
      drawerActiveTintColor:'green',
      drawerLabelStyle:{
          fontSize:16,
          paddingLeft:8,
      },
      headerPressColor:'red',
      headerShown: false,
      drawerStyle: { backgroundColor: "#fff", width: 270,borderBottomColor:'#fff',borderRightColor:"#1989b9",borderTopColor:'#fff', borderTopRightRadius:0,borderBottomRightRadius:0, borderWidth:1 },
  }}
      drawerContent={(props)=><DrawerContents {...props} />}

  >
    <Drawer.Screen
      name="Home"
      component={StackNavigator}
      options={{
          drawerIcon: ({focused,color,size}) => <Ionicons name={focused?"home":"home-outline"} size={24} color={"#028704"} />,
      }}
    />
    
      <Drawer.Screen name="My page" component={TopStackBarNav} options={{
          
          drawerIcon: () => <MaterialIcons name="contact-page" size={24} color={"#028704"} />,
      }}/>
       <Drawer.Screen name="About Us" component={AboutUs} options={{
          
          drawerIcon: () => <Ionicons name="paw" size={24} color={"#028704"} />,
      }}/>
       <Drawer.Screen name="Contact Us" component={ContactUs} options={{
         
          drawerIcon: () => <FontAwesome name="phone-square" size={24} color={"#028704"} />,
      }}/>
      
  </Drawer.Navigator>


  );
}

const styles = StyleSheet.create({});
