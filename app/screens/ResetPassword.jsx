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
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios"; // <-- Added axios
import { SponsorLogo } from "../assets/global"; // logo path

import ToastMessage from "../scr/ToastMessage";
import { resetPassword } from "../Api/post";
// import ToastMessage from "../scr/ToastMessage";

export default function ResetPassword({ route, navigation }) {
  // Toast message
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const email = route.params?.email; // Getting passed email/phone (optional safe check)

  const handleResetPassword = async () => {
    // console.log(email, password);
    if (!password || !confirmPassword) {
      setToast(true);
      setMessage("Please fill in both fields.");
      // alert("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setToast(true);
      setMessage("Passwords do not match.");
      // alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true); // Start loading
      // const response = await axios.post(
      //   "http://192.168.43.201:3000/api/post/reset-password",
      //   {
      //     email: email,
      //     newPassword: password,
      //   }
      // );

      const response = await resetPassword({
        email: email,
        newPassword: password,
      });

      setLoading(false); // Stop loading

      if (response.status === 200) {
        setToast(true);
        setMessage("Password reset successfully!");
        // alert("Password reset successfully!");
        navigation.navigate("login");
      } else {
        setToast(true);
        setMessage("Failed to reset password. Please try again.");
        // alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setLoading(false); // Stop loading
      setToast(true);
      setMessage("Something went wrong. Please try again later.");
      console.error(error);
      // alert("Something went wrong. Please try again later.");
    }
  };

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

        <Text style={styles.title}>Reset Password</Text>

        <Text style={styles.subtitle}>Enter your new password below.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#aaa" // Light gray placeholder
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor="#aaa" // Light gray placeholder
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.textInput}
            secureTextEntry
          />
        </View>

        {loading ? (
          // <ActivityIndicator size="large" color="#027804" />
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size={32} color={"#fff"} />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  password && confirmPassword ? "#027804" : "#fff",
                borderColor: password && confirmPassword ? null : "#aaa",
                borderWidth: password && confirmPassword ? 0 : 1,
              },
            ]}
            onPress={handleResetPassword}
          >
            <Text
              style={{
                fontSize: 16,
                color: password && confirmPassword ? "#fff" : "#000",
              }}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {toast && (
            <ToastMessage
              setToast={setToast}
              // message={"Account created successfully!"}
              message={message}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    padding: 6,
    width: 308,
    backgroundColor: "#028704",
    height: 40,

    alignItems: "center",
    borderRadius: 6,
  },
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
  inputContainer: {
    width: "90%",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 0.8,
    borderColor: "rgba(170,170,170,0.8)",
    borderRadius: 6,
    fontSize: 16,
    paddingHorizontal: 10,
    height: 50,
    width: 300,
    color: "#000",
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
