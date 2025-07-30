import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  StatusBar
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { CommunityQA, SponsorLogo, img } from "../assets/global";
// import ImageLoader from "../src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getQuestions, getComments, recentQA } from "../Api/post";
import dateFormat from "dateformat";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

export const QuestionCard = ({
  AuthorId,
  AuthorImage,
  AuthorName,
  replies,
  time,
  qn,
  qnImg,
  caseDetails,
  postId,
  sexOfAnimal,
  typeOfAnimal,
  ageOfAnimal
}) => {
  // console.log(sexOfAnimal, ageOfAnimal,typeOfAnimal)
  const navigation = useNavigation();
  const [comments, setComments] = useState();
  const fetchPost = async (postId) => {
    // console.log("posts id", post_Id);
    const comments = await getComments(postId);

    setComments(comments);
    // console.log("comments =>", posts);
  };

  useFocusEffect(() => {
    fetchPost(postId);
  });

  const FormatText = (text) => {
    if (!text) return null;

    const regex = /(\*\*.*?\*\*|__.*?__|\[.*?\]|_.*?_|\n)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      if (part.startsWith("__") && part.endsWith("__")) {
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <Text key={index} style={{ fontStyle: "italic" }}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      if (part.startsWith("_") && part.endsWith("_")) {
        return (
          <Text key={index} style={{ fontStyle: "italic" }}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      if (part === "\n") {
        return <Text key={index}>{"\n"}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
  };
  return (
    <View style={{ marginTop: 24 }}>
      {qn ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("QA", {
              details: qn,
              caseImages: qnImg,
              authorName: AuthorName,
              time: time,
              AuthorImage: AuthorImage,
              replies: replies,
              postId: postId,
              AuthorId: AuthorId,
              sexOfAnimal:sexOfAnimal,
              ageOfAnimal:ageOfAnimal,
              typeOfAnimal:typeOfAnimal
            })
          }
          style={{ height: 145, width: 301, backgroundColor: "#e3edf8" }}
        >
          {/* <Text style={{ paddingHorizontal: 16, paddingTop: 16, fontSize: 15 }}>
            {qn.length > 260 ? FormatText(qn.slice(0, 260)) + "...": FormatText(qn)}
          </Text> */}
          <Text style={{ paddingHorizontal: 16, paddingTop: 16, fontSize: 15 }}>
            {FormatText(qn.length > 260 ? qn.slice(0, 260) : qn)}
            {qn.length > 260 && <Text>...</Text>}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("QA", {
              details: qn,
              caseImages: qnImg,
              authorName: AuthorName,
              casedetails: caseDetails,
              time: time,
              AuthorImage: AuthorImage,
              replies: replies,
              postId: postId,
              AuthorId: AuthorId,
              sexOfAnimal:sexOfAnimal,
              ageOfAnimal:ageOfAnimal,
              typeOfAnimal:typeOfAnimal
            })
          }
          style={{ height: 139, width: 301 }}
        >
          {/* <Image
            source={{ uri: qnImg[0]?.url }}
            style={{ height: 139, width: 301, resizeMode: "cover" }}
          /> */}
          <ImageLoader
            resizeMode={"cover"}
            defaultImageSource={img.user[2]}
            source={{ uri: qnImg[0]?.url }}
            style={{ height: 139, width: 301, resizeMode: "cover" }}
          />
        </TouchableOpacity>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        {/* Author avatar */}

        <View
          style={{ flexDirection: "row", columnGap: 8, alignItems: "center" }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 50,
              borderWidth: 0.1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <Image
              source={{ uri: AuthorImage }}
              style={{
                width: 31,
                height: 31,
                borderRadius: 50,
                resizeMode: "cover",
              }}
            /> */}
            <ImageLoader
              resizeMode={"cover"}
              defaultImageSource={img.user[1]}
              source={{ uri: AuthorImage }}
              style={{
                width: 31,
                height: 31,
                borderRadius: 50,
                resizeMode: "cover",
              }}
            />
          </View>
          <Text>{AuthorName}</Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}
        >
          <Feather name="users" size={16} color={"#676767"} />
          <Text style={{ color: "#676767", fontSize: 13 }}>replies</Text>
          <Text style={{ color: "#676767", fontSize: 13 }}>
            {comments?.length}
          </Text>
        </View>

        <View>
          <Text style={{ fontSize: 12, color: "#676767" }}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

// export default function AskDoc({ navigation }) {
//   const [data, setData] = useState();
//   const fetchPost = async () => {
//     // const posts = await getQuestions();
//     const qA = await recentQA();
//     setData(qA);
//     // console.log("story =>", qA);
//   };

//   useEffect(() => {
//     fetchPost();
//   }, [data]);
//   useEffect(() => {
//     const backAction = () => {
//       navigation.goBack();
//       return true; // Prevent default back behavior (which would normally navigate back)
//     };

//     // Listen to the back press event
//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       backAction
//     );

//     // Clean up the event listener
//     return () => backHandler.remove();
//   }, []);
//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
//       <NetworkStatusBanner/>

//       <View>
//         <Text style={styles.headText}>Community Q & A</Text>
//       </View>
//       <View
//         style={[
//           styles.categoryBtnContainer,
//           { justifyContent: "space-evenly" },
//         ]}
//       >
//         <View style={{ alignItems: "center" }}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate("communityQns")}
//             style={styles.BtnCircle}
//           >
//             <Image source={SponsorLogo.img} style={styles.posts} />
//           </TouchableOpacity>
//           <Text style={styles.BtnText}>Posts</Text>
//         </View>

//         <TouchableOpacity
//           activeOpacity={0.5}
//           onPress={() => navigation.navigate("QuestionCategory")}
//         >
//           <View style={[styles.BtnCircle, { backgroundColor: "#028704" }]}>
//             <Ionicons name="add" size={32} color={"#fff"} />
//           </View>
//           {/* empty text to perfect align it with other btns */}
//           <Text></Text>
//         </TouchableOpacity>

//         <View style={{ alignItems: "center" }}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate("myQA")}
//             style={[styles.BtnCircle, { backgroundColor: "#fff" }]}
//           >
//             <AntDesign name="question" size={32} color={"green"} />
//           </TouchableOpacity>
//           <Text style={styles.BtnText}>My Q & A</Text>
//         </View>
//       </View>

//       <Text style={styles.RecentQA}>Recent Q & A</Text>

//       {data ? (
//         <FlatList
//           contentContainerStyle={{ alignItems: "center" }}
//           data={data}
//           renderItem={({ item }) => (
//             // console.log(item)
//             <QuestionCard
//               AuthorId={item.authorId}
//               postId={item.id}
//               AuthorImage={item.authorPic}
//               AuthorName={item.username}
//               // replies={item.replies}
//               time={dateFormat(item.timestamp, "mediumDate")}
//               qnImg={item.qnImage}
//               qn={item.qn}
//               caseDetails={item.history}
//               sexOfAnimal={item.sexOfAnimal}
//               ageOfAnimal={item.ageOfAnimal}
//               typeOfAnimal={item.typeOfAnimal}
//             />
//           )}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       ) : (
//         <View style={styles.ActivityIndicator}>
//           <ActivityIndicator size={48} color={"#028704"} />
//         </View>
//       )}
//     </View>
//   );
// }

export default function AskDoc({ navigation }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    const qA = await recentQA();
    setData(qA);
    setLoading(false);
  };

  useEffect(() => {
    fetchPost(); // fetch once on mount
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner />

      <View>
        <Text style={styles.headText}>Community Q & A</Text>
      </View>

      <View style={[styles.categoryBtnContainer, { justifyContent: "space-evenly" }]}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("communityQns")}
            style={styles.BtnCircle}
          >
            <Image source={SponsorLogo.img} style={styles.posts} />
          </TouchableOpacity>
          <Text style={styles.BtnText}>Posts</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("QuestionCategory")}
        >
          <View style={[styles.BtnCircle, { backgroundColor: "#028704" }]}>
            <Ionicons name="add" size={32} color={"#fff"} />
          </View>
          <Text></Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("myQA")}
            style={[styles.BtnCircle, { backgroundColor: "#fff" }]}
          >
            <AntDesign name="question" size={32} color={"green"} />
          </TouchableOpacity>
          <Text style={styles.BtnText}>My Q & A</Text>
        </View>
      </View>

      <Text style={styles.RecentQA}>Recent Q & A</Text>

      {data ? (
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          data={data}
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
          keyExtractor={(item, index) => index.toString()}
          refreshing={loading}
          onRefresh={fetchPost}
        />
      ) : (
        <View style={styles.ActivityIndicator}>
          <ActivityIndicator size={48} color={"#028704"} />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  ActivityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 6,
  },
  RecentQA: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 24,
    marginTop: 16,
    marginBottom: 16,
    top: 16,
    left: 8,
  },
  BtnText: {
    fontSize: 14,
    fontWeight: 500,
  },
  posts: {
    backgroundColor: "#fff",
    resizeMode: "contain",
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  BtnCircle: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor:'blue',
    borderWidth: 1,
    borderColor: "#1989b9",
    borderRadius: 50,
    width: 62,
    height: 62,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 16 },
    // elevation: 9,
  },
  categoryBtnContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:'space-evenly'
  },
  container: {
    flex: 1,
    // alignItems:'center',
    backgroundColor: "#fff",
  },
  headText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 16,
    fontWeight: 600,
  },
});


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native'

// export default function AskDoc() {
//   return (
//     <SafeAreaView style={styles.container}>
//     <View style={styles.container}>
//       <Text>Ask</Text>
//     </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container:{
//     flex:1,
//     margin:24
//   }
// })