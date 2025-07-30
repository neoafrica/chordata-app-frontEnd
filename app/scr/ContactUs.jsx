import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  SafeAreaView,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // optional for nice icons
// import MyBackButton from "../Pages/MyBackButton";
import MyBackButton from "./MyBackButton";
import { useNavigation } from "@react-navigation/native";
// import { SponsorLogo } from "../assets/global";
import { SponsorLogo } from "../assets/global";

const ContactUs = () => {
  const whatsappNumber = "748027802"; // your WhatsApp number without + (country code included)
  const emailAddress = "chordata.vet@gmail.com";
  const phoneNumber = "+255748027802";

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open WhatsApp", err)
    );
  };

  const openGmail = () => {
    const url = `mailto:${emailAddress}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open Gmail", err)
    );
  };

  const makePhoneCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to make call", err)
    );
  };

  const navigation= useNavigation()
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
      <View style={[{ marginLeft: 20, marginTop: 50 }]}>
        <MyBackButton onPress={navigation.goBack} />
      </View>
      <View style={styles.container}>

        <View style={styles.imageContainer}>
          <Image style={styles.image} source={SponsorLogo.img}/>
        </View>
        <Text style={styles.title}>Contact Us</Text>

        <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="white" />
          <Text style={styles.buttonText}>WhatsApp Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openGmail}>
          <Ionicons name="mail" size={24} color="white" />
          <Text style={styles.buttonText}>Email Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={makePhoneCall}>
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.buttonText}>Call Us</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  image:{
    resizeMode:'contain',
    height:150,
    width:150
  },
  imageContainer:{
    alignItems:'center',
    justifyContent:'center',
    marginTop:24
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop:20
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
});
