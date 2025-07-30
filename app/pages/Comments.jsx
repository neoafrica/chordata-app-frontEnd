import {
  Feather,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { img } from "../assets/global";
import SendBox from "./SendBox";
// import Replies from "./Replies";
import Replies from "./Replies";
// import { useLogin } from "../Api/UserContext";
import Modal from "react-native-modal";
import { useLogin } from "../Api/UserContext";
import {
  deleteComment,
  getComments,
  likeComment,
  unLikeComment,
} from "../Api/post";
// import ImageLoader from "../src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
// import { FormatText } from "./formatText";
import { Provider } from "react-native-paper";
import { FormatText } from "../cases/formatText";

const image = img;

export const getTimeAgo = (createdAt) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(createdAt)) / 1000);

  const days = Math.floor(diffInSeconds / (24 * 60 * 60)); // Total days difference
  const hours = Math.floor(diffInSeconds / (60 * 60)); // Total hours difference
  const minutes = Math.floor(diffInSeconds / 60); // Total minutes difference

  const months = Math.floor(days / 30); // Approximate months (30 days in a month)
  const weeks = Math.floor(days / 7); // Weeks (7 days in a week)

  if (months > 0) {
    return `${months} mon ago`;
  } else if (weeks > 0) {
    return `${weeks} w ago`;
  } else if (days > 0) {
    return `${days} d ago`;
  } else if (hours > 0) {
    return `${hours} hr ago`;
  } else if (minutes > 0) {
    return `${minutes} min ago`;
  } else {
    return "Just now";
  }
};

export default function Commenty({
  img,
  msg,
  replies,
  date,
  name,
  likes,
  commentId,
  repl,
  authorId,
  postId,
  id,
}) {
  // console.log(postId)

  const nav = useNavigation();
  const [pressed, setPressed] = useState(true);
  const [Likes, setLikes] = useState(false);
  const [reply, setReplies] = useState(true);

  const [commentlikes, setCommentsLikes] = useState();

  const [comments, setComments] = useState();
  const { userData, getToken } = useLogin();

  const [visible, setVisible] = useState(false);

  // indicator for deleting
  const [deleteVisible, setDeleteComment] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // console.log("replies =>",repl)
  const showReplies = () => {
    setReplies((prev) => !prev);
  };

  useEffect(() => {
    const currentComment = comments?.find((str) => str.id === commentId);
    if (currentComment) {
      setCommentsLikes(currentComment.likes);
    }
  }, [commentId, comments]);

  useEffect(() => {
    setDeleteComment(false)
    if (commentlikes?.length) {
      const userLiked = commentlikes.includes(userData?._id);
      setLikes(userLiked);
    }
  }, [commentlikes, userData?._id]);

  const handleLikes = async () => {
    const userdata = { author: userData?._id, postId: commentId };
    if (!Likes) {
      await likeComment(userdata);
      setLikes(true);
    } else {
      await unLikeComment(userdata);
      setLikes(false);
    }
  };

  const toggleReplies = () => {
    setReplies((prev) => !prev);
  };

  useEffect(() => {
    setDeleteComment(false)
    fetchComments(postId);
  }, [postId]);

  const fetchComments = async (post_Id) => {
    // console.log("posts id", post_Id);
    const comments = await getComments(post_Id);

    setComments(comments);
    // console.log("comments =>", posts);
  };

  const openSendBox = () => {
    setPressed((prev) => !prev);
  };
  return (
    <Provider >

      <View style={{flex:1}}>
           <KeyboardAvoidingView>
            <ScrollView>
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            {/* <Image source={{ uri: img }} style={styles.img} /> */}
            <ImageLoader
              resizeMode={"cover"}
              defaultImageSource={image.user[1]}
              source={{ uri: img }}
              style={styles.img}
            />
          </View>
          <View style={styles.contentContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.authorName}>{name}</Text>
              </View>

              {/* conditionary render the dots if comment creator is same as the authenticated user */}
              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{ width: 30, alignItems: "center" }}
              >
                {authorId == userData?._id ? (
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={20}
                    color={"#676767"}
                  />
                ) : null}
              </TouchableOpacity>

              {/* modal */}
              {visible ? (
                <View style={styles.deleteDots}>
                  <TouchableOpacity
                    onPress={async () => {
                      setVisible(false), setModalOpen(true);
                    }}
                    style={{
                      // borderRadius:10,
                      height: 40,
                      width: 80,
                      // marginTop: 16,
                      // backgroundColor: "green",
                      // top: 8,
                      // flex: 1,
                      // position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                      // right: 0,
                      flexDirection: "row",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={22}
                      color={"#000"}
                    />

                    <Text>delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      setDeleteComment(false);
                      setVisible(false);
                    }}
                    style={{
                      // borderRadius:10,
                      height: 40,
                      width: 80,
                      // bottom:8,
                      // backgroundColor: "green",
                      flex: 1,
                      // position: "absolute",
                      alignItems: "center",
                      justifyContent: "center",
                      // right: 0,
                      flexDirection: "row",
                    }}
                  >
                    <Feather name="x" size={22} color={"#000"} />

                    <Text>cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <Modal
                isVisible={modalOpen}
                // onBackdropPress={() => setConfirmDeleteId(null)}
                onBackdropPress={() => {
                  setModalOpen(false);
                }}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.3}
                useNativeDriver
                hideModalContentWhileAnimating
              >
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Delete Comment</Text>
                  <Text style={styles.modalMessage}>
                    Are you sure you want to delete this comment?
                  </Text>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      // onPress={() => setConfirmDeleteId(null)}
                      onPress={() => {
                        setModalOpen(false);
                      }}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    {deleteVisible ? (
                      <View style={styles.ActivityIndicator}>
                        <ActivityIndicator size={24} color={"#1989b9"} />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={async () => {
                          setDeleteComment(true);
                          const response=await deleteComment(commentId);
                          if(response.status == "ok"){
                            setDeleteComment(false)
                          }
                          setModalOpen(false);
                        }}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Modal>

              {/* ** */}
            </View>

            <View style={{ width: 250 }}>
              <Text style={styles.comment}>{FormatText(msg)}</Text>
            </View>

            <View style={styles.icons$Date}>
              <TouchableOpacity onPress={showReplies}>
                <MaterialCommunityIcons
                  name="comment-minus-outline"
                  size={18}
                  color={"#028704"}
                />
              </TouchableOpacity>

              <View style={{ position: "relative", right: 16 }}>
                <Text>{replies}</Text>
              </View>

              <TouchableOpacity onPress={handleLikes}>
                {Likes ? (
                  <Ionicons name="heart" size={18} color={"#028704"} />
                ) : (
                  <Ionicons name="heart-outline" size={18} color={"#028704"} />
                )}
              </TouchableOpacity>

              <View style={{ position: "relative", right: 16 }}>
                <Text>{likes}</Text>
              </View>
              <View style={{ right: 16 }}>
                <Text>{Likes}</Text>
              </View>
              <Text style={{ color: "#aaa" }}>{date}</Text>
            </View>

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={openSendBox}
            >
              <MaterialCommunityIcons
                name="arrow-right-bottom"
                size={20}
                color={"#676767"}
              />
              <Text style={{ color: "#676767" }}>Reply</Text>
            </TouchableOpacity>
            {!pressed ? (
              <View>
                <SendBox
                  height={30}
                  width={180}
                  placeholder={"reply"}
                  commentId={commentId}
                  author={userData._id}
                />
              </View>
            ) : null}
            {/* ********************* */}
            {!reply ? (
              <View>
                {repl.length !== 0 ? (
                  <FlatList
                    // contentContainerStyle={{flex:1}}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={repl}
                    renderItem={({ item }) => (
                      <Replies
                        img={item.author.profileImage.secure_url}
                        msg={item.reply}
                        date={getTimeAgo(item.createdAt)}
                        // replies={item.length}
                        name={item.author.username}
                        // likes={item.likes}
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
            ) : null}

            {/* ********************* */}
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
  
      </View>
   
    </Provider>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    padding: 6,
    // width: 308,
    // backgroundColor: "#028704",
    height: 40,

    alignItems: "center",
    borderRadius: 6,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },

  modalMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#028704",
  },

  cancelButtonText: {
    color: "#028704",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#D75C5C",
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  authorName: {
    fontSize: 15,
    fontWeight: 600,
  },
  comment: {
    fontSize: 15,
    // width:330
  },
  container: {
    // marginLeft:16,
    flexDirection: "row",
    columnGap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  contentContainer: {
    flexDirection: "column",
    rowGap: 8,
  },
  imgContainer: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 39,
    height: 39,
    borderRadius: 50,
    resizeMode: "cover",
    borderWidth: 0.1,
  },
  icons$Date: {
    width: 250,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  deleteDots: {
    zIndex: 1000,
    elevation: 9,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 60,
    top: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,

    height: 80,
    width: 80,
    flexDirection: "column",
    position: "absolute",
    right: 10,
    backgroundColor: "white",
  },
});
