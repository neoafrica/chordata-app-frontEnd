import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLogin } from "../Api/UserContext";
import { deleteThread } from "../Api/post";
import Modal from "react-native-modal";
import { Provider } from "react-native-paper";
const ThreadCard = ({
  thread,
  liked = false,
  bookmarked = false,
  onLike,
  onBookmark,
  navigation,
}) => {
  const [visible, setVisible] = useState(false);

  const [deleteCaseIndicator, setIndicator] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { userData } = useLogin();
  const firstTweet = thread.tweets?.[0];

  // console.log(thread.user._id)

  useEffect(() => {
    setModalOpen(false);
    setVisible(false);
  }, [thread._id]);

  return (
    <Provider>
      <View style={styles.threadPreview}>
        {/* User Info */}
        <View style={styles.userRow}>
          <Image
            source={{ uri: thread.user?.profileImage?.secure_url }}
            style={styles.avatar}
          />
          <Text style={styles.username}>
            {thread.user?.username || "Unknown User"}
          </Text>

          {thread?.user._id == userData?._id ? (
            <TouchableOpacity
              onPress={() => setVisible(true)}
              style={{
                // left: 5,
                right: -10,
                width: 50,
                // alignItems: "center",
                // width: 50,
                alignItems: "center",
                justifyContent: "center",
                // left: 160,
                // top: 15,
                position: "absolute",
              }}
            >
              {thread?.user._id == userData?._id ? (
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color={"#676767"}
                />
              ) : null}
            </TouchableOpacity>
          ) : null}

          {/* modal */}
          {visible ? (
            <View style={styles.deleteDots}>
              <TouchableOpacity
                onPress={async () => {
                  setVisible(false);
                  setModalOpen(true);
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
            onBackdropPress={() => setModalOpen(false)}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.3}
            useNativeDriver
            hideModalContentWhileAnimating
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Post</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this post?
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setModalOpen(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                {deleteCaseIndicator ? (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <ActivityIndicator size={24} color={"#1989b9"} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      setIndicator(true);
                      const response = await deleteThread(thread?._id);
                      if (response.status == "ok") {
                        setIndicator(false);
                      }
                      setModalOpen(false);
                      navigation.goBack();
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ThreadDetails", { thread: thread })
          }
        >
          {/* Tweet Preview */}
          <Text style={styles.previewText}>
            {firstTweet?.text?.length > 100
              ? firstTweet.text.slice(0, 100) + "..."
              : firstTweet?.text}
          </Text>

          {firstTweet?.imageUrl && (
            <Image
              source={{ uri: firstTweet.imageUrl }}
              style={styles.previewImage}
            />
          )}
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionRow}>
          {/* Like */}
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => onLike && onLike(thread._id)}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "#e0245e" : "#028704"}
              />
            </TouchableOpacity>
            <Text style={styles.actionText}>{thread.likesCount || 0}</Text>
          </View>

          {/* Comments */}
          <View style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={18} color="#888" />
            <Text style={styles.actionText}>{thread.commentsCount || 0}</Text>
          </View>

          {/* Bookmark */}
          <View style={styles.actionItem}>
            <TouchableOpacity
              onPress={() => onBookmark && onBookmark(thread._id)}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color="#028704"
              />
            </TouchableOpacity>
            <Text style={styles.actionText}>{thread.bookmarksCount || 0}</Text>
          </View>
        </View>

        <Text style={styles.timestamp}>
          {new Date(thread.createdAt).toLocaleString()}
        </Text>
      </View>
    </Provider>
  );
};

export default ThreadCard;

const styles = StyleSheet.create({
  deleteDots: {
    zIndex: 1000,
    elevation: 9,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 60,
    top: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,

    height: 80,
    width: 80,
    flexDirection: "column",
    position: "absolute",
    right: 0,
    backgroundColor: "white",
  },
  threadPreview: {
    // flex:1,
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRow: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    // width: 300,
    // backgroundColor: "green",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#ccc",
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  previewText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
    lineHeight: 20,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 6,
    gap: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
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
});
