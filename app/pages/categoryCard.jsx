import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CategoryCard({ image, title, animalType }) {
  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate(title, { head: title, animalType: animalType })}
          activeOpacity={0.8}
          style={styles.imageContainer}
        >
          <Image source={image} style={styles.imageStyle} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(title, { head: title })}
          activeOpacity={0.8}
          style={styles.textContainer}
        >
          <Text style={styles.text}>{title}</Text>
          <View>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={20}
              color={"#fff"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    top: 20,
    // left: 16,
    // marginLeft:8,
    // marginRight:0
  },
  cardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    // backgroundColor:'orange',
    width: 130,
  },
  transform: {
    // transform: [{ scaleX: 2 }],
  },
  imageContainer: {
    // flex:1,
    display: "flex",
    width: "50%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  imageStyle: {
    height: "50%",
    width: 147,
    // height: 130,
    resizeMode: "contain",
    borderRadius: 10,
  },
  textContainer: {
    display: "flex",
    // flexWrap:'wrap',
    flexDirection: "row",
    columnGap: 8,
    backgroundColor: "#028704",
    height: 37,
    width: 130,
    borderRadius: 10,
    alignItems: "center",
    elevation: 9,
    bottom: 20,
    // paddingBottom:30
  },
  text: {
    color: "#fff",
    fontWeight: 600,
    paddingLeft: 8,
  },
});
