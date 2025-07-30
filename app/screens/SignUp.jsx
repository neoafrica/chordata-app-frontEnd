import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import React, { useState } from "react";
// import { SponsorLogo } from "../assets/global";
import { SponsorLogo } from "../assets/global";
import { Formik } from "formik";
// import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import AutoGrowTextInput from "../scr/Posts/AutoGrowTextInput";
// import axios from "axios";
// import CountryPicker from "react-native-country-picker-modal";
import CountryPicker from "react-native-country-picker-modal-v2";

import { Ionicons } from "@expo/vector-icons";

const TextInput = ({ Name, minHeight, value, onChangeText, placeholder }) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>{Name}</Text>
      </View>
      <View style={styles.InputStyle}>
        <AutoGrowTextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          minHeight={minHeight}
          style={{ width: 280, fontSize: 14, textAlignVertical: "top" }}
          value={value}
        />
      </View>
    </View>
  );
};

export default function SignUp({ navigation }) {
  const [countryCode, setCountryCode] = useState("TZ"); // Default Tanzania 🇹🇿
  const [callingCode, setCallingCode] = useState("255");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false); // State for checkbox

  //   const [countryCode, setCountryCode] = useState('FR')
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(false);
  const [withCallingCode, setWithCallingCode] = useState(true);
  //   const onSelect = (country) => {
  //     setCountryCode(country.cca2)
  //     setCountry(country)
  //   }

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setCountry(country);
  };

  const onSubmitMethod = (value) => {
    // Check if all fields are filled
    if (
      !value.username ||
      !value.email ||
      !value.password ||
      !phoneNumber ||
      !isTermsChecked
    ) {
      Alert.alert("Please fill all fields and agree to the Terms of Service.");
      return;
    }

    // navigation.navigate("profileType", {
    //   username: value.username,
    //   email: value.email,
    //   password: value.password,
    //   phone: `+${callingCode}${phoneNumber}`,
    // });

    const trimmedValues = {
      username: value.username.trim(),
      email: value.email.trim(),
      password: value.password.trim(),
    };

    navigation.navigate("profileType", {
      ...trimmedValues,
      phone: `+${callingCode}${phoneNumber.trim()}`,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={SponsorLogo.img} style={styles.img} />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          Sign Up
        </Text>
        <Text style={{ fontSize: 14, color: "#676767" }}>
          Use proper information to continue
        </Text>

        <View style={styles.formikContainer}>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
            }}
            onSubmit={(value) => onSubmitMethod(value)}
          >
            {({ handleChange, handleSubmit, values }) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <TextInput
                  Name={"Full name"}
                  minHeight={45}
                  value={values.username}
                  onChangeText={handleChange("username")}
                  placeholder="Enter full name"
                />

                <TextInput
                  Name={"Email"}
                  minHeight={45}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  placeholder="Enter email"
                />

                {/* Phone number input */}
                <View style={{ marginBottom: 8, width: "90%" }}>
                  <Text style={{ fontSize: 14, paddingLeft: 16 }}>
                    Phone Number
                  </Text>
                </View>
                <View style={styles.phoneInputContainer}>
                  <Ionicons
                    style={{ paddingRight: 8, paddingLeft: 8 }}
                    name="chevron-down"
                    size={20}
                    color={"#000"}
                  />

                  <CountryPicker
                    {...{
                      countryCode,
                      withFilter,
                      withFlag,
                      withCountryNameButton,
                      withAlphaFilter,
                      withCallingCode,
                      withEmoji,
                      onSelect,
                    }}
                    // visible
                  />

                  <Text style={styles.callingCode}>+{callingCode}</Text>
                  <AutoGrowTextInput
                    placeholder="Phone number"
                    onChangeText={(text) => setPhoneNumber(text)}
                    value={phoneNumber}
                    keyboardType="phone-pad"
                    style={{ fontSize: 16, width: 220 }}
                  />
                </View>

                <TextInput
                  Name={"Password"}
                  minHeight={45}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  placeholder="Enter password"
                />

                {/* Terms of Service checkbox */}
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    onPress={() => setIsTermsChecked(!isTermsChecked)}
                    style={styles.checkbox}
                  >
                    {isTermsChecked && (
                      <Text style={styles.checkboxTick}>✔</Text>
                    )}
                  </TouchableOpacity>

                  <Text style={{ fontSize: 14, marginLeft: 8 }}>
                    I agree to the{" "}
                    <TouchableOpacity
                      style={{ marginTop: 8 }}
                      onPress={() =>
                        Linking.openURL(
                          "https://neoafrica.github.io/chordata-privacy-policy/privacy-policy.html"
                        )
                      }
                    >
                      <Text style={{ color: "#1989b9" }}>Terms of Service</Text>
                    </TouchableOpacity>
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        values.username &&
                        values.email &&
                        values.password &&
                        phoneNumber &&
                        isTermsChecked
                          ? "#027804"
                          : "#fff",
                      borderWidth:
                        values.username &&
                        values.email &&
                        values.password &&
                        phoneNumber &&
                        isTermsChecked
                          ? null
                          : 1,
                      borderColor:
                        values.username &&
                        values.email &&
                        values.password &&
                        phoneNumber &&
                        isTermsChecked
                          ? null
                          : "#aaa",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        values.username &&
                        values.email &&
                        values.password &&
                        phoneNumber &&
                        isTermsChecked
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>

        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 6,
          }}
        >
          <View
            style={{
              flex: 1,
              position: "absolute",
              bottom: -50,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 6,
            }}
          >
            <Text style={{ color: "#676767" }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#1989b9" }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 300,
    height: 45,
    borderRadius: 5,
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
  formikContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  InputStyle: {
    borderWidth: 0.8,
    borderColor: "rgba(170,170,170,0.8)",
    fontSize: 18,
    paddingLeft: 10,
    width: "90%",
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.8,
    borderColor: "rgba(170,170,170,0.8)",
    width: "83%",
    borderRadius: 6,
    paddingLeft: 10,
    height: 45,
    marginBottom: 10,
    // fontSize:16
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#028704",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxTick: {
    fontSize: 14,
    color: "#028704",
  },
});
