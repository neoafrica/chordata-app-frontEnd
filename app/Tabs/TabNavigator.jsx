// import './gesture-handler';
import "react-native-reanimated"
import 'react-native-reanimated'; // 🔁 This must be at the top
import {  StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import Home from "../../Home";
import Home from "../scr/Home";
import Ionicons from "@expo/vector-icons/Ionicons";

import AskDoc from "../screens/Ask-doc";
import CreatePost from "../screens/CreatePost";
import Profile from "../screens/Profile";
import ThreadFeed from "../Twitter/ThreadFeed";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { NavigationContainer } from "@react-navigation/native";

// import { NavigationContainer } from "@react-navigation/native";
// import { UserProvider } from "../Api/UserContext";


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  // {
  //   StatusBar.setBarStyle("light-content", true);
  // }
  // {
  //   StatusBar.setBackgroundColor("#028704");
  // }
  // {
  //   StatusBar.setHidden(false);
  // }
  // {
  //   StatusBar.setTranslucent(true);
  // }

  useEffect(()=>{

  },[])
return (


  <Tab.Navigator
  initialRouteName="Home"
  screenOptions={({route, navigation})=>({
    
        tabBarIcon:({color,size,focused})=>{
          // focusing the icon in the tab navigator
          let iconName;
          if (route.name === 'Home'){
            iconName=focused?'home':'home-outline'
          }
          else if(route.name === 'Profile'){
            iconName=focused?'person':'person-outline'
          }
          else if (route.name === 'Threads'){
            iconName=focused?'library':'library-outline'
          }
          return(
          <View style={styles.AllIcon}>
            <Ionicons name={iconName} style={styles.icon} size={24} />
          </View>)
        },
        headerShown: false,
        // tabBarShowLabel:false,
        // tabBarActiveTintColor: "red",
        tabBarStyle: {
          backgroundColor: "#028704",
          height: 70,
          elevation:0,
          // marginBottom:38, // here
          // justifyContent:'center',
          // alignItems:'center'
        },
        tabBarItemStyle:{
            marginLeft:10,
            height:40
        }
      })}
    >
       <Tab.Screen
      //  headerShown:false
        name="Home"
        component={Home}
        options={({route})=>({
          headerShown:false,
          tabBarLabel: () => <Text style={styles.text}>Home</Text>,
          // tabBarIcon: ({focused}) => { 

            
          // },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: () => <Text style={styles.text}>Profile</Text>
          // tabBarLabel: () => <Text style={styles.text}>Profile</Text>,
          // tabBarIcon: () => (
          //   <View style={styles.AllIcon}>
          //     <Ionicons name="person-outline" style={styles.icon} size={24} />
          //   </View>
          // ),
        }}
      />
     
      <Tab.Screen
        name="add"
        component={CreatePost}
        options={{
          tabBarLabel: () => <Text></Text>,
          tabBarIcon: () => (
            <View style={styles.iconContainer}>
              <Ionicons
                name="document-text-outline"
                style={styles.Addicon}
                size={32}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Ask-Doc"
        component={AskDoc}
        options={({route})=>({
          tabBarLabel: () => <Text style={styles.text}>Ask</Text>,
          tabBarIcon: ({focused}) => {
              // focusing the icon in the tab navigator
              let iconName;
              if (route.name === 'Ask-Doc'){
                iconName=focused?'comment-question':'comment-question-outline'
              }
              return(
                <View style={styles.AllIcon}>
              <MaterialCommunityIcons
                name={iconName}
                style={styles.icon}
                size={24}
              />
            </View>
              )
          }
        })}
      />
      <Tab.Screen
        name="Threads"
        // component={Story}

        component={ThreadFeed}
       
        options={({route})=>({
          tabBarLabel: () => <Text style={styles.text}>Threads</Text>,
          tabBarIcon: ({focused}) => {

             // focusing the icon in the tab navigator
             let iconName;
             if (route.name === 'Threads'){
               iconName=focused?'library':'library-outline'
             }
             return(
             <View style={styles.AllIcon}>
               <Ionicons name={iconName} style={styles.icon} size={24} />
             </View>)
           },
          
        })}
      />
    </Tab.Navigator>
   
  );}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:'center'
    // marginBottom:52
    // backgroundColor: "green",
  },
  text: {
    // paddingBottom: 20,
    // marginTop:10,
    // paddingBottom:6,
    paddingRight:10,
    fontSize:14,
    width:100,
    // paddingLeft:10,
    textAlign:'center'
  },
  icon: {
    height: 36,
    width: 36,
    color: "white",
  },
  Addicon: {
    height: 36,
    width: 36,
    color: "black",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 30,
    marginRight:15,
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  AllIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, 
    // backgroundColor:'red'        //Icons kupanda juu kutoka kwenye maandishi
    // textAlign:'center'
  },
});
