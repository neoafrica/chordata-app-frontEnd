
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaView} from "react-native";
import FrontImage from "../pages/frontImage";
import Menu from "./Menu";
import Avatar from "./avatar";
import { useFocusEffect } from "@react-navigation/native";
// import { useLogin } from "../Api/UserContext";
import { useLogin } from "../Api/UserContext";
import { recentCases } from "../Api/post";
import { getTimeAgo } from "../pages/Comments";
import RecentCaseCard from "../cases/RecentCard";
import { Ionicons } from "@expo/vector-icons";
import ToastMessage from "./ToastMessage";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

export default function Home({ navigation }) {
  const [toast, setToast] = useState(false);
  const [cases, setCases] = useState([]);
  const { userData, getToken } = useLogin();

  const [refreshing, setRefreshing] = useState(false);


  // const fetchPost = async () => {
  //   try {
  //     const result = await recentCases(1, 5); // Fetch only the first 4 cases
  //     if (!result.error) {
  //       setCases(result || []);
  //     } else {
  //       console.error("API error:", result.error);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching cases:", err);
  //   }
  // };


  const fetchPost = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const result = await recentCases(1, 5);
      if (!result.error) {
        setCases(result || []);
      } else {
        console.error("API error:", result.error);
      }
    } catch (err) {
      console.error("Error fetching cases:", err);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };
  
  useEffect(() => {
    let isMounted = true;
    if (userData && isMounted) {
      fetchPost();
    }
    return () => {
      isMounted = false;
    };
  }, [userData]);

  const handleBackPress = () => {
    Alert.alert("Exit app!", "Are you sure you want to exit", [
      { text: "Cancel", onPress: () => null, style: "cancel" },
      { text: "Exit", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     BackHandler.addEventListener("hardwareBackPress", handleBackPress);
  //     return () => {
  //       BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  //     };
  //   }, [])
  // );

  useFocusEffect(
    React.useCallback(() => {
      getToken();
      fetchPost();
    }, [])
  );

  useEffect(() => {
    setToast(true);
    // getToken();
  }, []);

  const itemSeparator = () => <View style={styles.separator} />;
  const name = userData?.username;


  return (


    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
        <NetworkStatusBanner></NetworkStatusBanner>
        <View style={styles.Head}>
          <Avatar name={name} />
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={styles.searchBar}

          >
            <View style={styles.searchIcon}>
              <Ionicons name="search-outline" size={20} color={"#028704"} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bodyElements}>
          <View style={{ flex: 1 }}>
            <FrontImage />
          </View>

          <View style={{marginBottom:8, bottom:8}}>
            <Menu />
          </View>

          <View style={styles.recentContainer}>
            <View style={styles.RecenttextContainer}>
              <Text style={styles.RecentText}>Recent cases</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("RecentCases")}
              style={styles.SeeAlltextContainer}
            >
              <Text style={styles.seeAlltext}>See All</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.cont}>
            {cases.length > 0 ? (
              <FlatList
                style={styles.flatList}
                data={cases}
                renderItem={({ item }) => (
                  <RecentCaseCard
                    // animalType={animalType}
                    authorId={item.author}
                    bookmark={item.bookmarks}
                    clinicalFindings={item.clinicalFindings}
                    management={item.clinicalManagement}
                    category={item.category}
                    title={item.caseTitle}
                    history={item.caseHistory}
                    authorName={item.username}
                    caseImages={item.caseImage}
                    authorPic={item.authorPic}
                    ageOfAnimal={item.ageOfAnimal}
                    sexOfAnimal={item.sexOfAnimal}
                    typeOfAnimal={item.typeOfAnimal}
                    postId={item.id}
                    pmFindings={item.clinicalFindings}
                    tentativeDiagnosis={item.TentativeDiagnosis}
                    differentialDiagnosis={item.DifferentialDiagnosis}
                    recommendation={item.recommendations}
                    procedure={item.ProceduralSteps}
                    poc={item.Poc}
                    drugsUsed={item.drugsUsed}
                    vaccineName={item.TypeOfVaccine}
                    vaccinationAgainst={item.VaccineAgainst}
                    regime={item.VaccinationRegime}
                    description={item.description}
                    managementCategory={item.managementCategory}
                    datePublished={getTimeAgo(item.createdAt)}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={itemSeparator}
                refreshing={refreshing}
                onRefresh={() => {
                  // console.log("Refreshing...");
                  fetchPost(true);
                }}
                // pull to refresh
              />
            ) : (
              <View style={styles.ActivityIndicator}>
                <ActivityIndicator size={38} color={"#028704"} />
              </View>
            )}
          </View> 
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {toast && (
            <ToastMessage setToast={setToast} message={"Login successfully!"} />
          )}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    position: "absolute",
  },
  searchBar: {
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    backgroundColor: "#f5f2f2",
    borderRadius: 30,
    borderColor: "#1989b9",
    borderWidth: 0.5,
    elevation: 9,
  },
  flatList: {
    flex: 1,
  },
  cont: {
    alignItems: "center",
    flex: 1,
    // marginTop: 15,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
    // marginTop:36
  },
  recentContainer: {
    flexDirection: "row",
    marginTop: 15,
    // bottom:36
    bottom:16
  },
  RecenttextContainer: {
    position: "relative",
    right: 80,
  },
  SeeAlltextContainer: {
    position: "relative",
    left: 80,
  },
  RecentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#028704",
  },
  seeAlltext: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1989b9",
  },
  Head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bodyElements: {
    flex: 1,
    alignItems: "center",
  },
  separator: {
    width: "100%",
    height: 10,
  },
});