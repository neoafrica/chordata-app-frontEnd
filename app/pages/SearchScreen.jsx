
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
// import MyBackButton from "./MyBackButton";
import MyBackButton from "../scr/MyBackButton";
// import RecentCaseCard from "../src/Cases/RecentCard";
import RecentCaseCard from "../cases/RecentCard";
import { SearchCase, SearchAll } from "../Api/post";
import { getTimeAgo } from "./Comments";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

export default function SearchScreen({ navigation }) {
  const route = useRoute();
  const animalType = route.params?.animalType;

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [match, setMatch] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    loadHistory();

    return () => backHandler.remove();
  }, []);

  const loadHistory = async () => {
    const saved = await AsyncStorage.getItem("searchHistory");
    if (saved) setHistory(JSON.parse(saved));
  };

  const saveHistory = async (query) => {
    const updated = [query, ...history.filter((item) => item !== query)];
    setHistory(updated);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem("searchHistory");
    setHistory([]);
  };

  let timeoutId;
  const debounce = (func, delay) => {
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleSearch = async (value) => {
    if (!value) return;
    setLoading(true);
    if (animalType) {
      const cases = await SearchCase(value, animalType);
      setLoading(false);
      if (cases.status === 200) {
        setResults(cases.data);
        saveHistory(value);
      } else {
        setMatch("No match found");
      }
    } else {
      const cases = await SearchAll(value);
      setLoading(false);
      if (cases.status === 200) {
        setResults(cases.data);
        saveHistory(value);
      } else {
        setMatch("No match found");
      }
    }
  };

  const debounceSearch = debounce(handleSearch, 1000);

  const Input = (value) => {
    setInput(value);
    debounceSearch(value);
  };

  const itemSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatusBanner/>
      {/* Custom Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Clear Search History</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to clear your recent searches?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.clearBtn}
                onPress={() => {
                  clearHistory();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.clearText2}>Clear</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Bar */}
      <View style={styles.search}>
        <MyBackButton onPress={navigation.goBack} />
        <View style={styles.searchBar}>
          <TextInput
            onChangeText={Input}
            value={input}
            style={{ marginLeft: 20, fontSize: 16, width: 200 }}
            placeholder="Search"
          />
          <TouchableOpacity
            onPress={() => {
              setInput("");
              setResults([]);
            }}
            style={styles.searchIcon}
          >
            <Feather name="x" size={24} color="#028704" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search History */}
      {input === "" && history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {history.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setInput(item);
                handleSearch(item);
              }}
            >
              <Text style={styles.historyItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Loading */}
      {/* {loading && <ActivityIndicator size="large" color="#028704" />} */}

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#028704" />
        </View>
      )}

      {/* Results */}
      {!loading && results.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={results}
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
        />
      ) : !loading && match ? (
        <View style={styles.center}>
          <Text>{match}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  search: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 20,
    marginTop: 20,
    height: 40,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    width: 280,
    backgroundColor: "#f5f2f2",
    borderRadius: 30,
    borderColor: "#1989b9",
    borderWidth: 0.5,
    elevation: 9,
    justifyContent: "space-between",
  },
  searchIcon: {
    marginHorizontal: 8,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    marginTop: 20,
    backgroundColor: "#fff",
  },
  separator: {
    width: "100%",
    height: 10,
  },
  historySection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  clearText: {
    color: "#1989b9",
    fontWeight: "bold",
  },
  clearText2: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#028704",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    backgroundColor: "#ccc",
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  clearBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    backgroundColor: "#028704",
    alignItems: "center",
  },
});
