import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "../Api/UserContext";
// import { getComments } from "../Api/post";
import { getComments } from "../Api/post";
import { SponsorLogo } from "../assets/global";
// import BottomShit from "../Pages/BottomShit";
import BottomShit from "../pages/BottomShit";
// import SendBox from "../Pages/SendBox";
import SendBox from "../pages/SendBox";
// import Commenty from "../Pages/Comments";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Provider } from "react-native-paper";
import Commenty from "../pages/Comments";
// import { FormatText } from "../Pages/formatText";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";
import { FormatText } from "../cases/formatText";
import AuthorName from "../pages/AuthorName";

const ThreadDetails = ({ route }) => {
  const navigation = useNavigation();
  const { thread } = route.params;

  const [data, setData] = useState();
  const [comments, setComments] = useState(false);
  const { userData } = useLogin();

  // console.log("threa id", thread);
  const fetchComments = async (post_Id) => {
    const posts = await getComments(post_Id);

    setData(posts);
    // console.log("comments =>", posts);
  };

  useEffect(() => {
    fetchComments(thread?._id);
  }, [data]); //2

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
    <Provider >
      <NetworkStatusBanner/>
    <ScrollView style={styles.container}>
      {thread.tweets.map((tweet, index) => (
        <View key={index} style={styles.tweetRow}>
          {/* Left vertical timeline */}
          <View style={styles.timeline}>
            <View style={styles.dot} />
            {index !== thread.tweets.length - 1 && (
              <View style={styles.connector} />
            )}
          </View>

          {/* Tweet content */}
          <View style={styles.tweetContent}>
            <Text style={styles.tweetText}>{FormatText(tweet.text)}</Text>
            {tweet.imageUrl && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("new clinical", { image: tweet })
                }
              >
                <Image source={{ uri: tweet.imageUrl }} style={styles.image} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      <View style={styles.imageContainer}>
        <Image
          source={SponsorLogo.img}
          style={styles.sponosor_image}
          // resizeMode="cover"
        />
      </View>

         <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity
            onPress={()=> navigation.navigate("ChatScreen", { recepientId: thread?.user?._id })}
            >

          <AuthorName
            authorPic={thread.user.profileImage.secure_url}
            AuthorName={thread.user.username}
          />
            </TouchableOpacity>
          <View style={{marginLeft:18}}>
            {/* <MaterialCommunityIcons name="message-reply-text-outline" size={24}/>
             */}
             <TouchableOpacity 
             onPress={()=> navigation.navigate("ChatScreen", { recepientId: thread?.user?._id })}
             style={{flexDirection:"row", alignItems:'center', gap:8}}>

             <AntDesign name="message1" size={24} color={"#1989b9"}/>
            <Text style={{fontWeight:600}}>Chat</Text>
             </TouchableOpacity>
          </View>
          </View>


      <TouchableOpacity onPress={() => setComments(true)} style={styles.comments}>
      <Ionicons name="chatbubble-outline" size={24} color="#888" />
        <View  style={{ paddingLeft:8 }}><Text><Text style={{fontSize:18, fontWeight:600, color:"#007bff"}}>Comments ·</Text> <Text style={{fontSize:18,color:"#999"}}>{data?.length || 0}</Text></Text></View>
      </TouchableOpacity>

      {/* Bottom sheet comments */}

      <BottomShit
        show={comments}
        onDismiss={() => setComments(false)}
        enableBackDropDismiss
        comments={data?.length}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
        <SendBox
            author={userData?._id}
            postId={thread?._id}
            placeholder={"Add comment.."}
          />
          {data?.length !== 0 ? (
            <FlatList
              // contentContainerStyle={{flex:1}}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={({ item }) => (
                <Commenty
                  img={item.authorPic}
                  msg={item.comment}
                  // date={dateFormat(item.createAt, "mediumDate")}
                  date={item.createAt}
                  replies={item.replies.length}
                  name={item.username}
                  // likes={item.likes}

                  commentId={item.id}
                  // replies

                  repl={item.replies}
                  // author id
                  authorId={item.authorId}
                  postId={item.postId}
                  likes={item.likes.length}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text>No comments</Text>
            </View>
          )}
 
        </View>
      </BottomShit>
    </ScrollView>
     </Provider>
  );
};

const styles = StyleSheet.create({
  comments:{
    flexDirection:'row',
    alignItems:'center',
    padding:26
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex:1
  },
  tweetRow: {
    flexDirection: "row",
    marginBottom: 32,
  },
  timeline: {
    width: 20,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginTop: 4,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
  tweetContent: {
    flex: 1,
    paddingLeft: 10,
  },
  tweetText: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },

  imageContainer: {
    // width: 200,
    // height: 200,
    // flex:1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sponosor_image: {
    // flex:1,
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: "contain",
  },
});

export default ThreadDetails;
