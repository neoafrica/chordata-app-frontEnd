import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Alert
} from "react-native";

import {
  AntDesign,
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Provider } from "react-native-paper";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
// import MyBackButton from "./MyBackButton";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

const { height, width } = Dimensions.get("window"); // get window dimensions
const ClinicalNew = ({ navigation }) => {
  const route = useRoute();
  const images = route.params.image;

  const[visible, setVisible] = useState(false)

  const shareToWhatsApp = async () => {
    setVisible(true)
    try {
      // Assuming `image` is a single dynamic item, not an array
      const imageUrl = images?.url || ""; // Get the image URL from the dynamic item

      if (imageUrl) {
        const fileExtension = imageUrl.split(".").pop();
        const fileUri =
          FileSystem.documentDirectory + `shared_image.${fileExtension}`;

        // Download the image to local file system
        const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);



        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
          setVisible(false)
          // Share only the single image (no message)
          await Sharing.shareAsync(uri, {
            mimeType: `image/${fileExtension}`,
            dialogTitle: "Share via WhatsApp",
          });
        } else {
          setVisible(false)
          Alert.alert("Sharing is not available on this device")
          console.log("Sharing is not available on this device");
        }
      } else {
        setVisible(false)
        Alert.alert("No image available to share")
        console.log("No image available to share");
      }
    } catch (error) {
      setVisible(false)
      Alert.alert("Error sharing the image: ")
      console.error("Error sharing the image: ", error);
    }
  };

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
    <Provider>
      <View style={{backgroundColor:"#000", flex:1}}>
        <NetworkStatusBanner/>
        
      <View style={{marginTop:20,marginHorizontal:16,alignItems:"center", justifyContent:"space-between", flexDirection:'row'}}>
        <TouchableOpacity onPress={navigation.goBack}>
      <AntDesign name="arrowleft" size={24} color={"white"} />


      </TouchableOpacity>
{visible?
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <ActivityIndicator size={32} color={"#1989b9"}/>
      </View>
      
        :<TouchableOpacity
          onPress={shareToWhatsApp}
          style={{
            width: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="share-social" size={24} color={"#1989b9"} />
        </TouchableOpacity>}
        </View>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: images.imageUrl || images.url }} style={styles.img} />
        </View>
      </View>
      </View>
    </Provider>
  );
};

export default ClinicalNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
    // marginHorizontal: 8,
    // marginTop: 24,
  },
  imgContainer: {
    // flex:1,
    width: width,
    height: height,
    alignItems: "center",
    // justifyContent:'center'
    // marginTop: 16,
  },
  img: {
    // flex:1,
    width: width,
    height: height,
    resizeMode: "contain",
  },
});
