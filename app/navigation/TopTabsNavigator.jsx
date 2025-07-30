
import { StyleSheet, Text, View, TouchableOpacity,BackHandler } from "react-native";
import React,{useEffect} from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import AboutMe from "../src/MyPage/AboutMe";
import AboutMe from "../scr/MyPage/AboutMe";
import MyCases from "../scr/MyPage/MyCases";
import MyStory from "../scr/MyPage/MyStory";
// import MyCases from "../src/MyPage/MyCases";
// import MyStory from "../src/MyPage/MyStory";
import CustomTabBar from "./CustomTabBar";
import { useNavigation } from "@react-navigation/native";

const TopTabs = createMaterialTopTabNavigator();

function CustomTabLabel({ children, focused }) {
  const navigation = useNavigation()

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
    <TouchableOpacity>
      <Text style={{ color: focused ? 'blue' : 'gray', fontWeight: 'bold' }}>
        {children}
        
      </Text>
    </TouchableOpacity>
  );
}

export default function TopTabsNavigator() {
  const navigation= useNavigation()
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
    <TopTabs.Navigator
    tabBar={(props)=><CustomTabBar {...props} />}
  initialRouteName="About me"

  // style={{backgroundColor:'#fff'}}
      screenOptions={{
        tabBarShowLabel:true,
        // tabBarLabel: ({ focused, children }) => (
        //   <CustomTabLabel focused={focused}>
        //     {children}
        //   </CustomTabLabel>
        // ),


        tabBarActiveTintColor:'black',
        tabBarInactiveTintColor:'black',
        tabBarItemStyle:{
          width:80,
          // paddingLeft:24
        },
        tabBarStyle:{
          // marginHorizontal:32,
          marginTop:24,
          // alignItems:'center',
          // justifyContent:'center',
        },
        swipeEnabled:false,
        // tabBarItemStyle:{
        //   width:'50%'
        // },
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
      <TopTabs.Screen name="About me" component={AboutMe} />
      <TopTabs.Screen name="Cases" component={MyCases} />
      <TopTabs.Screen name="Threads" component={MyStory} />
      {/* <TopTabs.Screen name="Q & A" component={MyStory} /> */}
    </TopTabs.Navigator>
 
  );
}

const styles = StyleSheet.create({
  
});
