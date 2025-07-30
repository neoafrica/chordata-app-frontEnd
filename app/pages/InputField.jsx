import React from "react";

import { View, StyleSheet, TextInput, Text } from "react-native";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView } from "react-native";

// import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import AutoGrowTextInput from "../scr/Posts/AutoGrowTextInput";

export default function InputField({ placeholder, onchangeFx, val, ...props }) {
  return (
    <View style={{ marginBottom: 16, marginTop: 16, alignItems: "center" }}>
      <Text
        style={{
          marginBottom: 0,
          position:props.Inputname === "Briefy case history" || "Historia ya Ugonjwa" ?'relative': "absolute",
          bottom: props.Inputname === "Briefy case history" || "Historia ya Ugonjwa"? 10 : 60,
          left:props.Inputname === "Briefy case history"||"Historia ya Ugonjwa" ?-90: 0,
        }}
      >
        {props.Inputname}
      </Text>
      <View style={styles.InputStyle}>
        {props.iconName == "pencil" ||
        props.iconName == "person-outline" ||
        props.iconName == "phone-portrait-outline" ? (
          <Ionicons name={props.iconName} size={20} color="#028704" />
        ) : (
          <Fontisto name={props.iconName} size={20} color="#028704" />
        )}

        {props.iconName ? (
          <View
            style={{
              height: 26,
              width: 1,
              backgroundColor: "rgba(170,170,170,0.5)",
              marginLeft: 8,
            }}
          ></View>
        ) : (
          <View></View>
        )}

        <AutoGrowTextInput
          multiline={true}
          onChangeText={onchangeFx}
          placeholder={placeholder}
          minHeight={(props.Inputname ==="Historia ya Ugonjwa" )?120:(props.Inputname ==="Briefy case history" )?120:45}
          style={{
            fontSize:14,
            textAlignVertical:'top',
            width: props.iconName ? 250 : 280,
            // height: props.Inputname === "Briefy case history" ? 120 : 45,
          }}
          keyboardType={props.keyboardTypX}
          secureTextEntry={props.HideInput} // hide the password while typing
          value={val} //input yote itakuwa na value ya hapa
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //   onFocus:{
  //    // flex:1,
  //    borderWidth: 0.8,
  //    // borderColor: "rgba(131,204,48,0.3)",
  //    borderColor: "red",
  //    fontSize: 18,
  //    paddingLeft: 10,
  //    height: 45,
  //    width: "90%", // take full width of the Input container
  //    marginBottom: 10,
  //    borderRadius: 6,
  //    flexDirection: "row",
  //    alignItems: "center",
  //  },
  newInput: {
  
    fontSize: 18,
  },
  InputStyle: {
    // flex:1,
    borderWidth: 0.8,
    // borderColor: "rgba(131,204,48,0.3)",
    borderColor: "rgba(170,170,170,0.3)",
    fontSize: 18,
    paddingLeft: 10,
    // height: 45,
    width: "90%", // take full width of the Input container
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
