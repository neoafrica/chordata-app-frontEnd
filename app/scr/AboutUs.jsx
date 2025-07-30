import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import { SponsorLogo } from "../assets/global";
// import MyBackButton from "../Pages/MyBackButton";
import MyBackButton from "./MyBackButton";
import { useNavigation } from "@react-navigation/native";

const AboutUs = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[{ marginLeft: 10, marginTop: 30 }]}>
        <MyBackButton onPress={navigation.goBack} />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>About Us</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.introText}>
          Welcome to Chordata – the ultimate platform for veterinary
          professionals and animal care enthusiasts.
        </Text>

        <Text style={styles.bodyText}>
          At Chordata, we are passionate about improving animal health by
          providing a platform where veterinary professionals, pet owners, and
          animal enthusiasts can share their experiences and knowledge. Our app
          allows users to upload and share a wide variety of cases including:
        </Text>

        <Text style={styles.caseTypeText}>• Veterinary Clinical Cases</Text>
        <Text style={styles.caseTypeText}>• Surgery Cases</Text>
        <Text style={styles.caseTypeText}>• Postmortem Reports</Text>
        <Text style={styles.caseTypeText}>
          • Vaccination Schedules and Results
        </Text>
        <Text style={styles.caseTypeText}>• Animal Management Strategies</Text>

        <Text style={styles.bodyText}>
          We focus on domesticated animals, including:
        </Text>

        <Text style={styles.animalTypeText}>• Dogs</Text>
        <Text style={styles.animalTypeText}>• Cats</Text>
        <Text style={styles.animalTypeText}>• Pigs</Text>
        <Text style={styles.animalTypeText}>• Goats</Text>
        <Text style={styles.animalTypeText}>• Sheep</Text>
        <Text style={styles.animalTypeText}>• Cows</Text>
        <Text style={styles.animalTypeText}>• Poultry</Text>

        <Text style={styles.bodyText}>
          Whether you're a veterinarian, a student, or a pet owner looking to
          learn more about animal care, Chordata offers valuable insights and
          resources for everyone. Join our growing community of animal care
          professionals and share your experiences today!
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={SponsorLogo.img}
            style={styles.image}
            // resizeMode="cover"
          />
        </View>

        <View style={{alignItems:'center', flex:1, justifyContent:'center', marginTop:24 }}>

        <Text style={{ fontSize: 14 }}>
          View Our {" "}
          <TouchableOpacity
            style={{ marginTop: 8, alignSelf:'center', flex:1 }}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // flex:1,
    backgroundColor: "#fff",
    padding: 20,
    // alignItems:'center'
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e2e2e",
  },
  content: {
    paddingHorizontal: 10,
  },
  introText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: "#333",
  },
  caseTypeText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  animalTypeText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    paddingLeft: 10,
  },
  imageContainer: {
    // width: 200,
    // height: 200,
    // flex:1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"green"
  },
  image: {
    // flex:1,
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "contain",
  },
});

export default AboutUs;
