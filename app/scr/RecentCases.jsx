
// With No cases available also with load more

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  BackHandler
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
// import MyBackButton from "../Pages/MyBackButton";
import MyBackButton from "./MyBackButton";
// import RecentCaseCard from "./Cases/RecentCard";
import RecentCaseCard from "../cases/RecentCard";
import { recentCaseCategory, recentCases } from "../Api/post";
import { getTimeAgo } from "../pages/Comments";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

const height = Dimensions.get("window").height;

export default function RecentCases({ navigation }) {
  const [selectedItem, setSelectedItem] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [choices, setChoices] = useState([
    "All",
    "Dog",
    "Cow",
    "Poultry",
    "Goat",
    "Pig",
    "Cat",
    "Sheep",
  ]);

  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchCases = async (pageNumber = 1, category = selectedItem) => {
    if (isFetching || isLoadingMore) return;

    try {
      pageNumber === 1 ? setIsFetching(true) : setIsLoadingMore(true);

      let data = [];
      if (category === "all") {
        data = await recentCases(pageNumber, 5);
      } else {
        data = await recentCaseCategory(category, pageNumber, 5);
      }

      if (pageNumber === 1) {
        setCases(data);
      } else {
        setCases((prev) => [...prev, ...data]);
      }

      setHasMore(data.length > 0);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setIsFetching(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCases(1);
  }, [selectedItem]);

  // useEffect(() => {
  //   fetchCases(1);
  // }, [cases]);


  const handleCategorySelect = (item, index) => {
    setSelectedItem(item.toLowerCase());
    setSelectedIndex(index);
    setPage(1);
    fetchCases(1, item.toLowerCase());
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCases(nextPage, selectedItem);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner/>

      <View style={{ marginLeft: 20, marginTop: 10 }}>
        <MyBackButton onPress={navigation.goBack} />
      </View>

      <View style={{ flex: 1, alignItems: "center", marginHorizontal: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 10 }}>
          Recent Cases
        </Text>

        <FlatList
          horizontal
          data={choices}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ height: 60 }}
          style={{ width: 320, marginTop: 10 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => handleCategorySelect(item, index)}
              style={[
                styles.Choice,
                {
                  backgroundColor:
                    index === selectedIndex ? "#028704" : "transparent",
                },
              ]}
            >
              <Text
                style={{
                  color: index === selectedIndex ? "#fff" : "#000",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {isFetching ? (
          <ActivityIndicator
            size="large"
            color="#028704"
            style={styles.ActivityIndicator}
          />
        ) : cases.length === 0 ? (
          <View style={styles.noCasesView}>
            <Text style={styles.noCasesText}>No cases found</Text>
          </View>
        ) : (
          <FlatList
            style={styles.flatList}
            data={cases}
            renderItem={({ item }) => (
              <RecentCaseCard
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
            ListFooterComponent={() =>
              hasMore && cases.length >= 5 ? (
                isLoadingMore ? (
                  <ActivityIndicator
                    size="large"
                    color="#028704"
                    style={{ marginVertical: 10 }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    style={styles.loadMoreButton}
                  >
                    <Text style={styles.loadMoreText}>Load More</Text>
                  </TouchableOpacity>
                )
              ) : null
            }
            refreshing={isFetching}
            onRefresh={() => {
              setPage(1);
              fetchCases(1, selectedItem);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
  noCasesView: {
    flex:1,
    marginBottom: 80,
    alignItems: "center",
    justifyContent:'center'
  },
  noCasesText: {
    fontSize: 16,
    color: "#888",
  },
  separator: {
    width: "100%",
    height: 10,
  },
  flatList: {
    flexGrow: 1,
  },
  Choice: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#027804",
    marginLeft: 8,
    flexDirection: "row",
    width: 70,
    height: 31,
    borderRadius: 20,
    borderWidth: 1,
  },
  loadMoreButton: {
    marginVertical: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#028704",
    alignSelf: "center",
    borderRadius: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "600",
  },
});


