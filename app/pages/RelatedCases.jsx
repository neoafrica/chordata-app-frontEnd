import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { img } from "../assets/global";
// import ImageLoader from "../src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
import { Image } from "react-native";

const images= img

export default function RelatedCases({
  recommendation,
  pmFindings,
  tentativeDiagnosis,
  differentialDiagnosis,

  vaccinationAgainst,
  vaccineName,
  regime,
  procedure,
  poc,
  authorPic,
  sexOfAnimal,
  ageOfAnimal,
  AuthorName,
  title,
  postId,
  img,
  authorId,
  typeOfAnimal,
  category,
  drugsUsed,
  management,
  history,
  clinicalFindings,
  managementCategory,
  description,
}) {
  const navigation = useNavigation();
 
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            category == "Vaccination"
              ? "Vaccination details"
              : category == "Clinical"
              ? "clinical details"
              : category == "Postmortem"
              ? "Postmortem details"
              : category == "Surgery"
              ? "Surgery details"
              :category == "Management"
              ? "Routine Management"
              : null,
            {
              postId,
              procedure,
              poc,
              category,
              authorId,
              typeOfAnimal,
              drugsUsed,
              recommendation,
              pmFindings,
              tentativeDiagnosis,
              differentialDiagnosis,
              management,
              hist: history,
              clinicalFindings,
              Title: title,
              img,
              authorPic,
              authorName: AuthorName,
              sexOfAnimal,
              ageOfAnimal,
              vaccinationAgainst,
              vaccineName,
              regime,
              managementCategory,
              description,
            }
          )
        }
        style={styles.imgContainer}
      >
        {/* <Image source={{ uri: img[0]?.url }} style={styles.img} /> */}
        <ImageLoader
          resizeMode={"cover"}
          defaultImageSource={images.user[2]}
          source={{ uri: img[0]?.url }}
          style={styles.img}
        />
      </TouchableOpacity>

      <View>
        <Text style={styles.title}>
          {title.length > 30 ? title.slice(0, 40) + "..." : title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems:'center',
    marginTop: 10,
  },
  img: {
    height: 120,
    width: 100,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imgContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    width: 100,
    fontWeight: "bold",
    marginLeft: 14,
    marginTop: 8,
    color: "#676767",
  },
});
