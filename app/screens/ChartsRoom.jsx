import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, TextInput, View } from "react-native";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";
import { getUsers } from "../Api/post";
import { useLogin } from "../Api/UserContext";
import User from "./User";

export default function ChartsRoom() {
    const navigation= useNavigation()
  const { userData, getToken } = useLogin();
  const [users, setUsers] = useState([]);

  const [searchText, setSearchText] = useState("");
const [filteredUsers, setFilteredUsers] = useState([]);
const [loading, setLoading] = useState(true);



  useEffect(() => {
  const fetchUsers = async (userId) => {
    try {
      setLoading(true);
      const response = await getUsers(userId);
      setUsers(response.data);
      setFilteredUsers(response.data); // Assuming you're using search
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers(userData._id);
}, []);


  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; // Prevent default back behavior (which would normally navigate back)
    };

    // Listen to the back press event
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener
    return () => backHandler.remove();
  }, []);



useEffect(() => {
  const fetchUsers = async (userId) => {
    const users = await getUsers(userId);
    setUsers(users.data);
    setFilteredUsers(users.data);
  };

  fetchUsers(userData._id);
}, []);

useEffect(() => {
  const filtered = users.filter(user =>
    user.username?.toLowerCase().includes(searchText.toLowerCase())
  );
  setFilteredUsers(filtered);
}, [searchText, users]);


  return (
    <View style={styles.container}>
      <NetworkStatusBanner></NetworkStatusBanner>
      <View style={styles.search}>
        <View style={styles.searchBar}>
          <TextInput
            style={{ marginLeft: 20, fontSize: 16, width: 200 }}
            placeholder="search by username"
              value={searchText}
               onChangeText={setSearchText}
            
          />
          <View style={styles.searchIcon}>
            <Ionicons name="search-outline" size={24} color={"#1989b9"} />
          </View>
        </View>
      </View>

      {loading ? (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#1989b9" />
  </View>
) : (
  <ScrollView>
    {filteredUsers.map((user) => (
      <User key={user._id} item={user} />
    ))}
  </ScrollView>
)}

      {/* <ScrollView>
  {filteredUsers.map((user, index) => (
    <User key={user._id} item={user} />
  ))}
</ScrollView> */}
      {/* <ScrollView>
        {users.map((user, index) => (
          <User key={index} item={user} />
        ))}
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},

  container: {
    // alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  search: {
    flexDirection: "row",
    columnGap: 20,
    marginTop: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
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
});
