import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { React, useEffect, useState } from "react";
import { img } from "../assets/global";
import { useNavigation } from "@react-navigation/native";

export default function CategoryButton({ names, icons }) {
  const navigation = useNavigation(); //use navigation hooks to navigate the screens
  const pic = img.category[icons];
  // console.log(names)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("casesCategory", { pageTitle: names })
        }
      >
        <Image source={pic} style={styles.icon} />
      </TouchableOpacity>
      <View>
        <Text style={styles.categoryText}>{names}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  icon: {
    height: 50,
    width: 50,
  },
  categoryText: {
    color: "white",
    fontSize: 15,
    fontWeight: 500,
  },
});
