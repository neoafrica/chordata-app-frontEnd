import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
// import MyBackButton from "../../Pages/MyBackButton";
import MyBackButton from "../MyBackButton";
import { QuestionCard } from "../../screens/Ask-doc";
import { useFocusEffect } from "@react-navigation/native";
import { myQA } from "../../Api/post";
import { useLogin } from "../../Api/UserContext";
import dateFormat from "dateformat";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

// export default function MyQA({ navigation }) {
//   const { userData, getToken } = useLogin();
//   const [data, setData] = useState();
//   const fetchPost = async () => {
//     // const posts = await getQuestions();
//     const qA = await myQA(userData?._id);
//     setData(qA);
//     // console.log("story =>", posts);
//   };

//   useFocusEffect(() => {
//     fetchPost();
//   });

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
//     <View style={{ backgroundColor: "#fff", flex: 1 }}>
//       <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
//       <NetworkStatusBanner/>
//       <View style={[{ marginLeft: 20, marginTop: 10 }]}>
//         <MyBackButton onPress={navigation.goBack} />
//       </View>
//       <Text style={styles.headText}>my Q & A</Text>

//       {data ? (
//         <FlatList
//           contentContainerStyle={{ alignItems: "center" }}
//           data={data}
//           renderItem={({ item }) => (
//             <QuestionCard
//               AuthorId={item.authorId}
//               postId={item.id}
//               AuthorImage={item.authorPic}
//               AuthorName={item.username}
//               time={dateFormat(item.timestamp, "mediumDate")}
//               // time={item.timestamp}
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
//       {data?.length == 0 ? (
//         <View
//           style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
//         >
//           <Text style={{ fontSize: 18, color: "#676767" }}>Empty</Text>
//         </View>
//       ) : null}
//     </View>
//   );
// }


export default function MyQA({ navigation }) {
  const { userData } = useLogin();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    const qA = await myQA(userData?._id);
    setData(qA);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [userData?._id])
  );

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
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner />
      <View style={{ marginLeft: 20, marginTop: 10 }}>
        <MyBackButton onPress={navigation.goBack} />
      </View>
      <Text style={styles.headText}>my Q & A</Text>

      {data ? (
        data.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Text style={{ fontSize: 18, color: "#676767" }}>Empty</Text>
          </View>
        ) : (
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
        )
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
  container: {
    alignItems: "center",
    flex: 1,
  },
  headText: {
    fontSize: 18,
    textAlign: "center",
    // marginTop:24,
    marginBottom: 16,
    fontWeight: 600,
  },
});
