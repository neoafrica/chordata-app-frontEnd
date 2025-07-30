import React from "react";
import { Text, StyleSheet, Pressable,TouchableOpacity } from "react-native";

export default function CustomButton({ placeholder, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} placeholder={placeholder} style={styles.root}>
      <Text style={styles.text}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    padding:6,
    width: 308,
    backgroundColor:'#028704',
    height: 40,
   
    alignItems:'center',
    borderRadius:6,
   
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
