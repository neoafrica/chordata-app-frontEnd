import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { myThread } from "../../Api/post";
// import dateFormat from "dateformat";
import { useFocusEffect } from "@react-navigation/native";
import ThreadCard from "../../Twitter/ThreadCard";
// import { useLogin } from "../../Api/UserContext";
import { useLogin } from "../../Api/UserContext";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

export default function MyStory({ navigation }) {
  const { userData} = useLogin();
  const [data, setData] = useState();

  const fetchPost = async (id) => {
    const posts = await myThread(id);
    setData(posts);
    // console.log("story =>", posts);
  };
  // useFocusEffect(() => {
  //   fetchPost(userData?._id);
  // });


  useEffect(() => {
    fetchPost(userData?._id);
  }, [data]);

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
  return (
    <View style={styles.container}>
      <NetworkStatusBanner/>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          // <StoryCard
          //   like={item.likes}
          //   bookmark={item.bookmarks}
          //   name={item.username}
          //   img={item.authorPic}
          //   header={item.title}
          //   content={item.body}
          //   Id={item.id}
          //   Date={dateFormat(item.timestamp, "mediumDate")}
          // />
          <ThreadCard
          thread={item}
          navigation={navigation}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        // onPress={() => navigation.navigate("thread")}
        onPress={() => navigation.navigate("thread")}
        style={styles.pen}
      >
        <Ionicons name="pencil" size={24} color={"#fff"} />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  pen: {
    width: 47,
    height: 47,
    borderRadius: 50,
    backgroundColor: "#028704",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    right: 8,
    elevation: 3,
    marginRight: 12,
  },
});


