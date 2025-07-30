import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import React from "react";
// import { img } from "../assets/global";
import { img } from "../assets/global";
import ImageLoader from "./ImageLoader";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLogin } from "../Api/UserContext";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

export default function Avatar({ name }) {
  // const name= 'mabula'
  const { userData, getToken } = useLogin();
  const navigation = useNavigation();
  return (
    <View style={styles.avatar}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cirlce}
        onPress={() => navigation.openDrawer()}
        // onPress={navigation.openDrawer()}
      >
        <ImageLoader
          resizeMode={"cover"}
          defaultImageSource={img.user[1]}
          source={{ uri: userData?.profileImage?.secure_url }}
          style={styles.img}
        />
        {/* <Image source={img.story[1]} style={styles.img}/> */}
      </TouchableOpacity>
      <TouchableOpacity 
      // onPress={() => navigation.openDrawer()}
      >
        <Text style={styles.user}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    // flex:1,
    flexDirection: "row",
    // justifyContent:"center",
    alignItems: "center",
    marginLeft: 16,
    // marginBottom:160
    // top:10
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
  },
  cirlce: {
    // height: windowHeight*0.07,
    // width: windowWidth*0.14,    /**mara mbili ya upana */
    height: 41,
    width: 41,
    borderRadius: 50,
    backgroundColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
    elevation: 9,
  },
  user: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 8,
    // fontFamily: "Merriweather",
  },
});
