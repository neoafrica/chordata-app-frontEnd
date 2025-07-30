import { StyleSheet, Text, View, BackHandler, Image,ScrollView,TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
// import MyBackButton from "./Pages/MyBackButton";
import MyBackButton from "../scr/MyBackButton";
import { useRoute } from "@react-navigation/native";
// import ImageLoader from "./src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
// import { img } from "./assets/global";
import { img } from "../assets/global";
// import { FormatText } from "./Pages/formatText";
import { FormatText } from "../cases/formatText";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

export default function FrontImageDetails({ navigation }) {
  const route = useRoute();
  const Images = route.params.image;

//   console.log(Images.Image.url)

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
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        <NetworkStatusBanner/>
      <View style={[{ marginLeft: 20, marginTop: 10 }]}>
        <MyBackButton onPress={navigation.goBack} />
      </View>
      <View style={styles.container}>
        <TouchableOpacity
         onPress={() =>
          navigation.navigate("new clinical", { image: Images.Image})
        }
         style={styles.image}>
          <ImageLoader
            resizeMode={"cover"}
            defaultImageSource={img.user[2]}
            source={{ uri:Images.Image.url}}
            style={styles.imageStyle}
          />
          {/* <Image source={Images} style={styles.imageStyle}  /> */}
        </TouchableOpacity>

        <View style={styles.body}>
          <ScrollView>
          <Text style={{ fontSize: 15}}>{FormatText(Images.description)}</Text>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
  },
  image: {
    // display: "flex",
    width: 310,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:"green"
    // borderWidth: 1,
    // borderColor: "#aaa",
    // borderRadius: 15,
    marginTop: 16,
  },
  imageStyle: {
    height: "99.99%",
    borderRadius: 15,
    width: 310,
    // resizeMode: "contain",
  },
  body: {
    marginTop: 16,
    marginHorizontal:28,
    // textAlign:'center'
    // alignItems:'center'
    // width:340
  },
});
