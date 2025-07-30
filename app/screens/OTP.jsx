

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
    Animated
  } from "react-native";
  import React, { useState, useRef, useEffect } from "react";
  import { SponsorLogo } from "../assets/global";
  import axios from 'axios'; // add axios to make API requests
  
  export default function OTP({ route, navigation }) {
    const { emailOrPhone, otp: initialOtp } = route.params;
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [activeInput, setActiveInput] = useState(0);
    const [counter, setCounter] = useState(60);
    const [serverOtp, setServerOtp] = useState(initialOtp); // track updated server otp
    const inputRefs = Array.from({ length: 6 }, () => useRef(null));
    const fadeAnim = useRef(new Animated.Value(1)).current; // for fading animation
  
    const handleOtpChange = (text, index) => {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
  
      if (text && index < 5) {
        inputRefs[index + 1].current.focus();
        setActiveInput(index + 1);
      }
    };
  
    const handleKeyPress = (key, index) => {
      if (key === "Backspace") {
        if (otp[index] === "" && index > 0) {
          inputRefs[index - 1].current.focus();
          setActiveInput(index - 1);
        }
      }
    };
  
    const handleVerify = () => {
      const enteredOtp = otp.join("");
      if (enteredOtp === serverOtp) {
        console.log("OTP matched");
        navigation.navigate("ResetPassword",{email:emailOrPhone});
      } else {
        alert("Invalid OTP");
      }
    };
  
    const isOtpComplete = otp.every((digit) => digit !== "");
  
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
  
    useEffect(() => {
      if (counter > 0) {
        const timer = setTimeout(() => {
          setCounter(counter - 1);
          fadeInOut();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [counter]);
  
    const fadeInOut = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };
  
    const handleSendOtp = async () => {

      try {
        // Example API call (adjust to your real backend)
        const response = await axios.post("https://chordata-backend-1.onrender.com/api/post/send-otp", {
          emailOrPhone: emailOrPhone,
        });
     
        const { otp: newOtp } = response.data;
        console.log("New OTP:", newOtp);
        setServerOtp(newOtp);
        setCounter(60); // Restart countdown
        setOtp(["", "", "", "", "", ""]); // Clear previous OTP
        inputRefs[0].current.focus();
        setActiveInput(0);
        alert("A new OTP has been sent.");
      } catch (error) {
        console.error("Failed to resend OTP", error);
        alert("Failed to resend OTP. Please try again.");
      }
    };
  
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
  
          <Text style={styles.title}>Verification</Text>
  
          <Text style={styles.subtitle}>
            Please enter the verification code sent to {emailOrPhone}.
          </Text>
  
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[
                  styles.otpBox,
                  {
                    borderColor:
                      activeInput === index ? "#028704" : "rgba(170,170,170,0.8)",
                  },
                ]}
                // keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
                onFocus={() => setActiveInput(index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                value={digit}
              />
            ))}
          </View>
  
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isOtpComplete ? "#027804" : "#fff",
                borderColor: isOtpComplete ? null : "#aaa",
                borderWidth: isOtpComplete ? 0 : 1,
              },
            ]}
            onPress={handleVerify}
            disabled={!isOtpComplete}
          >
            <Text
              style={{
                fontSize: 16,
                color: isOtpComplete ? "#fff" : "#000",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
  
          {counter > 0 ? (
            <Animated.Text style={[styles.counterText, { opacity: fadeAnim }]}>
              Resend Code in 00:{counter < 10 ? `0${counter}` : counter}
            </Animated.Text>
          ) : (
            <TouchableOpacity onPress={handleSendOtp}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
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
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    otpContainer: {
      flexDirection: "row",
    //   justifyContent: "space-between",
    justifyContent:'center',
    alignItems:'center',
      width: "80%",
      marginBottom: 20,
    },
    otpBox: {
      borderWidth: 2,
      width: 35,
      height: 45,
      borderRadius: 8,
      textAlign: "center",
      fontSize: 20,
      marginHorizontal: 5,
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
    counterText: {
      marginTop: 16,
      fontSize: 14,
      color: "#676767",
    },
    resendText: {
      marginTop: 16,
      fontSize: 14,
      color: "#028704",
      fontWeight: "bold",
    },
  });
  
  
  
