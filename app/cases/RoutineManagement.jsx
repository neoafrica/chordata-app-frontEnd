
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  BackHandler
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import RecentCaseCard from "./RecentCard";
import { getCase } from "../Api/post";
import { getTimeAgo } from "../pages/Comments";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

const LIMIT = 5;

export default function RoutineManagement({ navigation }) {
  const route = useRoute();
  const animalType = route.params.animalType;
  const categor = route.params.head;

  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCases = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const fetchedCases = await getCase(animalType, categor, pageNumber, LIMIT);

      if (isRefresh || pageNumber === 1) {
        setCases(fetchedCases);
      } else {
        setCases(prev => [...prev, ...fetchedCases]);
      }

      setHasMore(fetchedCases.length === LIMIT);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases(1, true);
  }, [animalType]);

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchCases(1, true);
  };

  const loadMoreCases = () => {
    if (!loadingMore && hasMore) {
      fetchCases(page);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const itemSeparator = () => <View style={styles.separator} />;

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadMoreContainer}>
        {loadingMore ? (
          <ActivityIndicator color="#028704" size={34} />
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreCases}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NetworkStatusBanner/>
        <View style={styles.search}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Search", { animalType })}
            style={styles.searchBar}
          >
            <View style={styles.searchIcon}>
              <Ionicons name="search-outline" size={20} color={"#028704"} />
            </View>
          </TouchableOpacity>
        </View>

        {loading && cases.length === 0 ? (
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size={48} color={"#028704"} />
          </View>
        ) : cases.length === 0 ? (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No cases available</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ backgroundColor: "#fff" }}
            style={styles.flatList}
            data={cases}
            renderItem={({ item }) => (
              <RecentCaseCard
                authorId={item.author}
                bookmark={item.bookmarks}
                // clinicalFindings={item.clinicalFindings}
                // management={item.clinicalManagement}
                category={item.category}
                title={item.caseTitle}
                // history={item.caseHistory}
                authorName={item.username}
                caseImages={item.caseImage}
                authorPic={item.authorPic}
                ageOfAnimal={item.ageOfAnimal}
                sexOfAnimal={item.sexOfAnimal}
                typeOfAnimal={item.typeOfAnimal}
                postId={item.id}
                // pmFindings={item.clinicalFindings}
                // tentativeDiagnosis={item.TentativeDiagnosis}
                // differentialDiagnosis={item.DifferentialDiagnosis}
                // recommendation={item.recommendations}
                // procedure={item.ProceduralSteps}
                // poc={item.Poc}
                // drugsUsed={item.drugsUsed}
                // vaccineName={item.TypeOfVaccine}
                // vaccinationAgainst={item.VaccineAgainst}
                // regime={item.VaccinationRegime}
                description={item.description}
                managementCategory={item.managementCategory}
                datePublished={getTimeAgo(item.createdAt)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={itemSeparator}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListFooterComponent={renderFooter}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noData: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
  },
  flatList: {
    flex: 1,
    marginTop: 16,
    backgroundColor: "#fff",
  },
  separator: {
    width: "100%",
    height: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    backgroundColor: "#028704",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchIcon: {
    position: "absolute",
  },
  search: {
    justifyContent: "flex-end",
    height: 40,
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    marginHorizontal: 24,
  },
  searchBar: {
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
});
