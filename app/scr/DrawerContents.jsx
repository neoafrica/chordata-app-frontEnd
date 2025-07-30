import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { img } from "../assets/global";
import ImageLoader from "./ImageLoader";
import { useLogin } from "../Api/UserContext";
import { useNavigation } from "@react-navigation/native";

export default function DrawerContents({ ...props }) {
  //  const route= useRoute()
  const navigation = useNavigation();

  const { userData, getToken } = useLogin();

  // const { navigateTo } = useNav(); // Destructure navigateTo from context

  // const [userData, setUserData] = useState({})

  // const getToken=async()=>{
  //   const token= await AsyncStorage.getItem('token')

  //   // console.log(token)
  //    axios.post("http://192.168.43.96:3000/api/post/user-data", {token})
  //   .then((response) =>{ console.log('From home',response.data)
  //     if(response.data.status === 'ok'){
  //       setUserData(response.data.data)
  //     }else{
  //       Alert.alert(JSON.stringify(response.data))
  //     }
  //   })
  //   .catch((error) => console.log({ error }));

  // }

  // useEffect(() => {
  //   getToken();
  // }, []);
  // const logOut = () => {
  //   // AsyncStorage.setItem('isLogin', '')
  //   // AsyncStorage.setItem('token', '')
  //   navigateTo("Login");
  // };
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ width: 280 }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 24,
          }}
        >
          <View style={styles.imgContainer}>
            {/* <Image source={img.category[10]} style={styles.img} /> */}
            
            <ImageLoader
              resizeMode={"cover"}
              defaultImageSource={img.user[1]}
              source={{uri:userData?.profileImage?.secure_url}}
              style={styles.img}

            />
          </View>
          <View style={{ width: 200, marginBottom: 16 }}>
            <Text style={{ paddingLeft: 16, fontSize: 18, fontWeight: 600 }}>
              {userData?.username}
            </Text>
            <Text style={{ paddingLeft: 16, fontSize: 14 }}>
              {userData?.email}
            </Text>
          </View>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* 
      <TouchableOpacity
      onPress={()=>logOut()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 8,
          marginBottom: 24,
          justifyContent: "center",
        }}
      >
        <View style={{ marginTop: 16 }}>
          <MaterialCommunityIcons name="exit-run" color={"#c82121"} size={24} />
        </View>
        <Text
          style={{
            fontSize: 18,
            marginTop: 20,
            color: "#c82121",
            fontWeight: "bold",
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100,
    resizeMode: "cover",
    borderWidth: 0.1,
    borderColor: "#000",
  },
});
