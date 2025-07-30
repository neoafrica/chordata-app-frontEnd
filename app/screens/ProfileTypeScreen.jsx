import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SponsorLogo } from "../assets/global";
import axios from "axios";
import ToastMessage from "../scr/ToastMessage";

export default function ProfileTypeScreen({ route, navigation }) {
  // Toast message
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const { username, email, password, phone } = route.params;
  const [selectedRole, setSelectedRole] = useState("");
  const [visible, setVisible] = useState(true);

  const roles = [
    "Veterinary",
    "Agrovet owner",
    "Student",
    "Para-vet",
    "Farmer",
  ];

  const handleFinalSubmit = () => {
    setVisible(false);
    if (!selectedRole) {
      Alert.alert("Please select your role before proceeding.");
      return;
    }

    const payload = {
      username,
      email,
      password,
      phone,
      role: selectedRole,
    };

    axios
      .post("https://chordata-backend-1.onrender.com/api/post/signUp", payload)
      .then((response) => {
        // console.log(response.data);
        if (response.data.status === "ok") {
          setVisible(true);
          // Alert.alert("Registered successfully!");
          navigation.navigate("login");
        } else {
          setToast(true)
          setMessage(JSON.stringify(response.data.message))
          setVisible(true);
          // Alert.alert(JSON.stringify(response.data.message));
        }
      })
      .catch((error) => console.log({ error }));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />

      <View style={styles.imageContainer}>
        <Image source={SponsorLogo.img} style={styles.img} />
      </View>

      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      <Text style={styles.selectText}>Please select your role:</Text>

      <View style={styles.radioContainer}>
        {roles.map((role, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioOption}
            onPress={() => setSelectedRole(role)}
          >
            <View style={styles.radioCircle}>
              {selectedRole === role && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.radioText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {visible ? (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: selectedRole ? "#027804" : "#aaa" },
          ]}
          onPress={handleFinalSubmit}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>
            Finish Registration
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.ActivityIndicator}>
          <ActivityIndicator size={32} color={"#fff"} />
        </View>
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
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    marginTop: 32,
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
  },
  selectText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    color: "#555",
  },
  radioContainer: {
    width: "90%",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 0.8,
    borderRadius: 10,
    borderColor: "#028704",
    height: 50,
    backgroundColor: "rgba(170,170,170,0.8)",
    paddingLeft: 20,
    //   marginLeft:20
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#028704",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#028704",
  },
  radioText: {
    fontSize: 16,
  },
  button: {
    width: 300,
    height: 45,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
