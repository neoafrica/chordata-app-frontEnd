import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
  StatusBar,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import {
  LikeThread,
  BookmarkThread,
  UnBookmarkThread,
  unLikeThread,
  deleteThread,
  getThreads,
} from "../Api/post";
import { useLogin } from "../Api/UserContext";
// import StoryBillboard from "../src/StoryBillboard";
import StoryBillboard from "../scr/StoryBillboard";
import { Provider } from "react-native-paper";
import Modal from "react-native-modal";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";
// import { debounce } from "lodash";
import { debounce } from "lodash";

const THREAD_LIMIT = 5;

const ThreadFeed = () => {
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [deleteCaseIndicator, setIndicator] = useState(false);

  const [likesMap, setLikesMap] = useState({});
  const [bookmarksMap, setBookmarksMap] = useState({});

  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  // modal

  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [activeThreadId, setActiveThreadId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const navigation = useNavigation();
  const { userData } = useLogin();

  const fetchThreads = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // const response = await fetch(
      //   `http://192.168.43.18:3000/api/post/get-threads?page=${pageNumber}&limit=${THREAD_LIMIT}`
      // );

      const response = await getThreads(pageNumber, THREAD_LIMIT);
      // const data = await response.json();
      const data = await response.data;

      const userId = userData?._id;

      const freshThreads = data.threads.filter(
        (thread) => !threads.some((t) => t._id === thread._id)
      );
      const updatedThreads = isRefresh
        ? data.threads
        : [...threads, ...freshThreads];
      setThreads(updatedThreads);

      // Build likes/bookmarks map based on backend data
      const newLikesMap = {};
      const newBookmarksMap = {};
      data.threads.forEach((thread) => {
        newLikesMap[thread._id] = thread.likes?.includes(userId);
        newBookmarksMap[thread._id] = thread.bookmarks?.includes(userId);
      });

      setLikesMap((prev) => ({ ...prev, ...newLikesMap }));
      setBookmarksMap((prev) => ({ ...prev, ...newBookmarksMap }));

      setHasMore(data.threads.length === THREAD_LIMIT);
    } catch (err) {
      console.error("Error fetching threads:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const [filteredThreads, setFilteredThreads] = useState([]);

  useEffect(() => {
    setSearching(true);

    const timeout = setTimeout(() => {
      if (searchText.trim() === "") {
        setFilteredThreads(threads);
      } else {
        const filtered = threads.filter((thread) =>
          thread.user?.username
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
        );
        setFilteredThreads(filtered);
      }
      setSearching(false);
    }, 300); // debounce for 300ms

    return () => clearTimeout(timeout);
  }, [searchText, threads]);

  // In useEffect
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      // trigger filtering here if you separate fetch vs filtered data
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchThreads(nextPage);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchThreads(1, true);
  };

  const handleLike = async (threadId) => {
    const isLiked = likesMap[threadId];
    const payload = { author: userData._id, postId: threadId };

    try {
      if (isLiked) {
        await unLikeThread(payload);
      } else {
        await LikeThread(payload);
      }

      // Update like state and count
      setLikesMap((prev) => ({ ...prev, [threadId]: !isLiked }));
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                likesCount: thread.likesCount + (isLiked ? -1 : 1),
              }
            : thread
        )
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleBookmark = async (threadId) => {
    const isBookmarked = bookmarksMap[threadId];
    const payload = { author: userData._id, postId: threadId };

    try {
      if (isBookmarked) {
        await UnBookmarkThread(payload);
      } else {
        await BookmarkThread(payload);
      }

      // Update bookmark state and count
      setBookmarksMap((prev) => ({ ...prev, [threadId]: !isBookmarked }));
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId
            ? {
                ...thread,
                bookmarksCount: thread.bookmarksCount + (isBookmarked ? -1 : 1),
              }
            : thread
        )
      );
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const renderThreadPreview = ({ item }) => {
    const firstTweet = item.tweets[0];
    const threadId = item?._id;
    const liked = likesMap[threadId];
    const bookmarked = bookmarksMap[threadId];

    // console.log(item?.user?._id);

    return (
      <View style={styles.threadPreview}>
        {/* User Info */}
        <View style={styles.userRow}>
          <Image
            source={{ uri: item.user?.profileImage?.secure_url }}
            style={styles.avatar}
          />
          <Text style={styles.username}>
            {item.user?.username || "Unknown User"}
          </Text>
        </View>

        {item?.user?._id === userData?._id && (
          <TouchableOpacity
            onPress={() =>
              setActiveThreadId(activeThreadId === item._id ? null : item._id)
            }
            style={{
              right: 10,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 15,
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="#676767"
            />
          </TouchableOpacity>
        )}

        {activeThreadId === item._id && (
          <View style={styles.deleteDots}>
            <TouchableOpacity
              onPress={() => {
                setActiveThreadId(null);
                setConfirmDeleteId(item._id);
              }}
              style={styles.modalOption}
            >
              <MaterialCommunityIcons name="delete" size={22} color="#000" />
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveThreadId(null)}
              style={styles.modalOption}
            >
              <Feather name="x" size={22} color="#000" />
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          isVisible={confirmDeleteId === item._id}
          onBackdropPress={() => setConfirmDeleteId(null)}
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
                onPress={() => setConfirmDeleteId(null)}
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
                    const response = await deleteThread(item._id);
                    if (response.status == "ok") {
                      setIndicator(false)
                    }
                    setConfirmDeleteId(null);
                    setThreads((prev) =>
                      prev.filter((t) => t._id !== item._id)
                    );
                  }}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => navigation.navigate("ThreadDetails", { thread: item })}
        >
          {/* Tweet Preview */}
          <Text style={styles.previewText}>
            {firstTweet.text.length > 100
              ? firstTweet.text.slice(0, 100) + "..."
              : firstTweet.text}
          </Text>

          {firstTweet.imageUrl && (
            <Image
              source={{ uri: firstTweet.imageUrl }}
              style={styles.previewImage}
            />
          )}
        </TouchableOpacity>

        {/* Actions Row */}
        <View style={styles.actionRow}>
          {/* Like */}
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => handleLike(threadId)}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color="#028704"
              />
            </TouchableOpacity>
            <Text style={styles.actionText}>{item.likesCount || 0}</Text>
          </View>

          {/* Comments */}
          <View style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={16} color="#888" />
            <Text style={styles.actionText}>{item.commentsCount || 0}</Text>
          </View>

          {/* Bookmark */}
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={() => handleBookmark(threadId)}>
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color="#028704"
              />
            </TouchableOpacity>
            <Text style={styles.actionText}>{item.bookmarksCount || 0}</Text>
          </View>
        </View>

        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return loadingMore ? (
      <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
    ) : (
      <TouchableOpacity onPress={handleLoadMore} style={styles.loadMoreButton}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  if (loading && threads.length === 0) {
    return (
      <ActivityIndicator size="large" style={{ marginTop: 50, flex: 1 }} />
    );
  }

  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
        <NetworkStatusBanner/>
        <StoryBillboard />
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

        <FlatList
          // data={threads}
          data={filteredThreads}
          renderItem={renderThreadPreview}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            searching ? (
              <ActivityIndicator
                size="large"
                style={{ marginTop: 20, flex: 1 }}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20, flex: 1 }}>
                No post found
              </Text>
            )
          }
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("thread")}
          style={styles.pen}
        >
          <Ionicons name="pencil" size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    columnGap: 20,
    margin: 16,
    // marginBottom: 15,
    alignItems: "center",
    left: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    width: 310,
    backgroundColor: "#f5f2f2",
    borderRadius: 30,
    elevation: 9,
  },
  searchIcon: {
    marginHorizontal: 16,
  },
  threadPreview: {
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    right: 0,
    backgroundColor: "white",
  },

  modalOption: {
    height: 40,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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

export default ThreadFeed;
