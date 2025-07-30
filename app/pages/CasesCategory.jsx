import { StyleSheet, Text, View, FlatList,BackHandler } from "react-native";
import React,{useState,useEffect} from "react";
// import CategoryCard from "./categoryCard";
// import { DATA } from "../assets/global";
import { DATA } from "../assets/global";
import { useRoute } from "@react-navigation/native";
import CategoryCard from "./categoryCard";
// import { getCase } from "../Api/post";
// import { use } from "react";
import { SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function CasesCategory({navigation}) {
  const route = useRoute()
  const animalType = route.params.pageTitle
  // console.log(animalType)

  const itemSeparator= function() {
     return<View style={styles.separator}/>
  }
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
      <FlatList
            data={DATA}
        renderItem={({item})=><CategoryCard image={item.image} title={item.name} animalType={animalType}/>}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{flex:1, alignItems:'center'}}
        // ItemSeparatorComponent={itemSeparator}
      />
 
    // <CategoryCard/>
  );
}

const styles = StyleSheet.create({
  separator:{
    width:"100%",
    height:100,
    backgroundColor:'purple'
  }
});
