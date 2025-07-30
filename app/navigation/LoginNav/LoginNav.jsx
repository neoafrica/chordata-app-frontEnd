import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator(); 

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import SignUp from "../../screens/SignUp";
import SignUp from "../../screens/SignUp";
import Login from "../../screens/Login";
import ProfileTypeScreen from "../../screens/ProfileTypeScreen";
import ForgotPassword from "../../screens/ForgotPassword";
import OTP from "../../screens/OTP";
import ResetPassword from "../../screens/ResetPassword";
import TabNavigator from "../../Tabs/TabNavigator";
import DrawerNavigator from "../DrawerNavigator";
import StackNavigator from "../StackNavigator";
import SplashScreen from "../../screens/SplashScreen";
import { SafeAreaProvider,SafeAreaView } from "react-native-safe-area-context";


export default function LoginNav() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>

    <Stack.Navigator initialRouteName="login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="splash" component={SplashScreen}/>
      <Stack.Screen name={'login'} component={Login}/>
      <Stack.Screen name={'Home'} component={DrawerNavigator}/>
      {/* <Stack.Screen name={'Home'} component={StackNavigator}/> */}
      <Stack.Screen name={'sign up'} component={SignUp}/>
      <Stack.Screen name={"ForgotPassword"} component={ForgotPassword}/>
      <Stack.Screen name={"OTP"} component={OTP}/>
      <Stack.Screen name={"ResetPassword"} component={ResetPassword}/>
      <Stack.Screen name={"profileType"} component={ProfileTypeScreen}/>
    </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
   
   
  )
}

const styles = StyleSheet.create({})