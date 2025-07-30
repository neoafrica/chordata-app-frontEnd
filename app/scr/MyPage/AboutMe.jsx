import { StyleSheet, Text, View } from "react-native";
import React,{useState,useEffect} from "react";
// import { useLogin } from "../../Api/UserContext";
import { useLogin } from "../../Api/UserContext";

export default function AboutMe() {
  const { userData, getToken } = useLogin();

  useEffect(()=>{
    getToken()
  },[])
  return (
    <View style={styles.container}>
      <View style={{marginHorizontal:16}}>

      <Text style={styles.bio}>
       {userData?.bio}
      </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    // marginHorizontal:16,
    backgroundColor:'#fff'
  },
  bio:{
    flex:1,
    marginHorizontal:16,
    width:320
  }
});


