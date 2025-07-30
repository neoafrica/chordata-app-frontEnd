import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

export default function MyBackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <AntDesign name="arrowleft" size={24} color={"black"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
