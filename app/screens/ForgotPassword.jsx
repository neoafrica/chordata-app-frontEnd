import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SponsorLogo } from "../assets/global"; // your logo path
import axios from "axios";

export default function ForgotPassword({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleSendOTP = () => {
    if (!emailOrPhone) {
      alert("Please enter your email");
      return;
    }

    axios
      .post("https://chordata-backend-1.onrender.com/api/post/send-otp", {
        emailOrPhone: emailOrPhone,
      })
      .then((response) => {
        console.log("OTP sent successfully:", response.data);
        if (response.data.status === "ok") {
          // Save OTP locally or move to OTP screen
          navigation.navigate("OTP", { emailOrPhone, otp: response.data.otp });
        } else {
          alert("Failed to send OTP");
        }
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        alert("Something went wrong while sending OTP");
      });
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
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.imageContainer}>
          <Image source={SponsorLogo.img} style={styles.img} />
        </View>

        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.subtitle}>
          Please enter your registered email address.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            style={styles.textInput}
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: emailOrPhone ? "#027804" : "#fff",
              borderColor: emailOrPhone ? null : "#aaa",
              borderWidth: emailOrPhone ? 0 : 1,
            },
          ]}
          onPress={handleSendOTP}
        >
          <Text
            style={{
              fontSize: 16,
              color: emailOrPhone ? "#fff" : "#000",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#676767",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  inputContainer: {
    width: "83%",
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 0.8,
    borderColor: "rgba(170,170,170,0.8)",
    borderRadius: 6,
    fontSize: 16,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 300,
    height: 45,
    borderRadius: 5,
  },
});
