import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  FlatList,
  BackHandler,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
// import MyBackButton from "../../Pages/MyBackButton";
import MyBackButton from "../MyBackButton";
import { Ionicons } from "@expo/vector-icons";
import { QuestionCard } from "../../screens/Ask-doc";
import { getQuestions } from "../../Api/post";
// import { useFocusEffect } from "@react-navigation/native";
import dateFormat from "dateformat";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

export default function CommunityQns({ navigation }) {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const debounceTimeoutRef = useRef(null);

  const fetchPost = async (search = "", pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    const posts = await getQuestions(search, pageNum, 5);

    if (posts.error) {
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (pageNum === 1) {
      setData(posts);
    } else {
      setData((prev) => [...prev, ...posts]);
    }

    setHasMore(posts.length === 5);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchPost(searchText, 1);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchText]);

  useEffect(() => {
    fetchPost("", 1); // initial load
  }, []);

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

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPost(searchText, nextPage);
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner />
      <View style={[{ marginLeft: 20, marginTop: 10 }]}>
        <MyBackButton onPress={navigation.goBack} />
      </View>

      <View style={styles.container}>
        <Text style={styles.headText}>Community Q & A</Text>

        <View style={styles.search}>
          <View style={styles.searchBar}>
            <TextInput
              style={{ marginLeft: 20, fontSize: 16, width: 200 }}
              placeholder="search by username"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
            <View style={styles.searchIcon}>
              <Ionicons name="search-outline" size={24} color={"#1989b9"} />
            </View>
          </View>
        </View>

        {loading ? (
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size={48} color={"#028704"} />
          </View>
        ) : data.length === 0 && searchText.trim() !== "" ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>Username not found</Text>
          </View>
        ) : (
          // <FlatList
          //   contentContainerStyle={{ alignItems: "center" }}
          //   data={data}
          //   keyExtractor={(item, index) => index.toString()}
          //   showsVerticalScrollIndicator={false}
          //   renderItem={({ item }) => (
          //     <QuestionCard
          //       AuthorId={item.authorId}
          //       postId={item.id}
          //       AuthorImage={item.authorPic}
          //       AuthorName={item.username}
          //       // time={item.timestamp}
          //       time={dateFormat(item.timestamp, "mediumDate")}
          //       qnImg={item.qnImage}
          //       qn={item.qn}
          //       caseDetails={item.history}
          //       sexOfAnimal={item.sexOfAnimal}
          //       ageOfAnimal={item.ageOfAnimal}
          //       typeOfAnimal={item.typeOfAnimal}
          //     />
          //   )}
          //   ListFooterComponent={() =>
          //     hasMore ? (
          //       loadingMore ? (
          //         <ActivityIndicator
          //           size="large"
          //           color="#028704"
          //           style={{ marginVertical: 20 }}
          //         />
          //       ) : (
          //         <TouchableOpacity style={{marginTop:16}} onPress={handleLoadMore}>
          //           <Text style={styles.loadMoreButton}>Load More</Text>
          //         </TouchableOpacity>
          //       )
          //     ) : null
          //   }
          // />
          <FlatList
            contentContainerStyle={{ alignItems: "center" }}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <QuestionCard
                AuthorId={item.authorId}
                postId={item.id}
                AuthorImage={item.authorPic}
                AuthorName={item.username}
                time={dateFormat(item.timestamp, "mediumDate")}
                qnImg={item.qnImage}
                qn={item.qn}
                caseDetails={item.history}
                sexOfAnimal={item.sexOfAnimal}
                ageOfAnimal={item.ageOfAnimal}
                typeOfAnimal={item.typeOfAnimal}
              />
            )}
            refreshing={loading}
            onRefresh={() => {
              setPage(1);
              fetchPost(searchText, 1);
            }}
            ListFooterComponent={() =>
              hasMore ? (
                loadingMore ? (
                  <ActivityIndicator
                    size="large"
                    color="#028704"
                    style={{ marginVertical: 20 }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{ marginTop: 16 }}
                    onPress={handleLoadMore}
                  >
                    <Text style={styles.loadMoreButton}>Load More</Text>
                  </TouchableOpacity>
                )
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },

  ActivityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
  },
  headText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
  search: {
    flexDirection: "row",
    columnGap: 20,
    marginTop: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    width: 320,
    backgroundColor: "#f5f2f2",
    borderRadius: 30,
    elevation: 9,
  },
  searchIcon: {
    marginHorizontal: 16,
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#028704",
    color: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});
