

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RecentCaseCard from "../cases/RecentCard";
// import ThreadCard from "../src/Thread/ThreadCard";
import { useRoute } from "@react-navigation/native";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";
import { BookmarkThread, getAllCase, getBookmarkedThreads, LikeThread, UnBookmarkThread, unLikeThread } from "../Api/post";
import ThreadCard from "../Twitter/ThreadCard";
// import { useLogin } from "../Api/UserContext";
import { useLogin } from "../Api/UserContext";
// import { getTimeAgo } from "../Pages/Comments";
import { getTimeAgo } from "../pages/Comments";

export default function BookmarkedPostsScreen({ navigation }) {
  const { userData } = useLogin();
  const route = useRoute();

  const [cases, setCases] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesMap, setLikesMap] = useState({});
  const [bookmarksMap, setBookmarksMap] = useState({});

  const [bookmark, setBookmark] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allCases = await getAllCase();
      setCases(allCases)
      const bookmarkedThreads = await getBookmarkedThreads(userData?._id);

      // const bookmarkedCases = allCases.filter((item) =>
      //   item.bookmarks.includes(userData?._id)
      // );

      const newLikesMap = {};
      const newBookmarksMap = {};
      bookmarkedThreads.forEach((thread) => {
        newLikesMap[thread?._id] = thread.isLiked || false;
        newBookmarksMap[thread?._id] = true; // they're all bookmarked
      });
      // console.log("LIKES MAP", newLikesMap);

      setLikesMap(newLikesMap);
      setBookmarksMap(newBookmarksMap);
      // setCases(bookmarkedCases);
      
      setThreads(bookmarkedThreads);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (threadId) => {
    const isLiked = likesMap[threadId];
    const payload = { author: userData?._id, postId: threadId };

    try {
      if (isLiked) {
        await unLikeThread(payload);
      } else {
        await LikeThread(payload);
      }

      setLikesMap((prev) => ({ ...prev, [threadId]: !isLiked }));

      setThreads((prev) =>
        prev.map((thread) =>
          thread?._id === threadId
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

  // const handleBookmark = async (threadId) => {
  //   const isBookmarked = bookmarksMap[threadId];
  //   const payload = { author: userData._id, postId: threadId };

  //   try {
  //     if (isBookmarked) {
  //       await UnBookmarkThread(payload);
  //     } else {
  //       await BookmarkThread(payload);
  //     }

  //     // Refresh data after unbookmarking
  //     if (isBookmarked) {
  //       await fetchData(); // 🔁 refresh only when unbookmarking
  //     } else {
  //       setBookmarksMap((prev) => ({ ...prev, [threadId]: true }));
  //       setThreads((prev) =>
  //         prev.map((thread) =>
  //           thread._id === threadId
  //             ? {
  //                 ...thread,
  //                 bookmarksCount: thread.bookmarksCount + 1,
  //               }
  //             : thread
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Failed to toggle bookmark:", err);
  //   }
  // };
  const handleBookmark = async (threadId) => {
    const isBookmarked = bookmarksMap[threadId];
    const payload = { author: userData?._id, postId: threadId };

    try {
      if (isBookmarked) {
        await UnBookmarkThread(payload);

        // Remove the thread from the list
        setThreads((prev) => prev.filter((thread) => thread?._id !== threadId));

        // Remove from bookmarksMap
        setBookmarksMap((prev) => {
          const updated = { ...prev };
          delete updated[threadId];
          return updated;
        });
      } else {
        await BookmarkThread(payload);

        // Mark as bookmarked and update count
        setBookmarksMap((prev) => ({ ...prev, [threadId]: true }));
        setThreads((prev) =>
          prev.map((thread) =>
            thread?._id === threadId
              ? {
                  ...thread,
                  bookmarksCount: thread.bookmarksCount + 1,
                }
              : thread
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };


  const fetchPost = async () => {
        try {
          const Cases = await getAllCase();
          // const Story = await getStory();
          setCases(Cases);
          // setStory(Story);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

  // Optimized bookmark filtering for cases
  // useEffect(() => {
  //   const bookmarkedCases = cases?.filter((item) =>
  //     item.bookmarks.includes(userData?._id)
  //   );
  //   setBookmark(bookmarkedCases);
  // }, [cases, userData]);

  useEffect(() => {
    if (Array.isArray(cases)) {
      const bookmarkedCases = cases.filter((item) =>
        item.bookmarks?.includes(userData?._id)
      );
      setBookmark(bookmarkedCases);
    } else {
      setBookmark([]); // fallback
    }
  }, [cases, userData]);
  


   useEffect(() => {
    fetchPost();
  }, []);

  // call back function to update the bookmarks when add or remove card
  const handleBookmarkChange = (updatedCase) => {
    const updatedCases = cases.map((item) =>
      item?.id === updatedCase?.id ? updatedCase : item
    );
    setCases(updatedCases); // 🔄 Triggers re-filtering due to dependency in useEffect
  };
  

  useEffect(() => {
    fetchData();
  }, [userData]);

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

  const renderItem = ({ item }) => {
    // console.log("Rendering item:", item);
    if (item.type === "case") {
      return (
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
          onBookmarkChange={handleBookmarkChange} // Pass the callback function
        />
      );
    } else if (item.type === "thread") {
      return (
        <ThreadCard
          thread={item}
          liked={likesMap[item._id]}
          bookmarked={bookmarksMap[item._id]}
          onLike={(threadId) => handleLike(threadId)} // Ensure this is passed
          onBookmark={(threadId) => handleBookmark(threadId)} // Ensure this is passed
          navigation={navigation}
        />
        
      );
    }
    return null;
  };

  // const combinedData = [
  //   ...cases.map((item) => ({ ...item, type: "case" })),
  //   ...threads.map((item) => ({ ...item, type: "thread" })),
  // ];

  const combinedData = [
    ...(Array.isArray(bookmark)
      ? bookmark.map((item) => ({ ...item, type: "case" }))
      : []),
    ...(Array.isArray(threads)
      ? threads.map((item) => ({ ...item, type: "thread" }))
      : []),
  ];
  

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NetworkStatusBanner/>
        {loading ? (
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size={48} color={"#028704"} />
          </View>
        ) : (
          <FlatList
            style={styles.flatList}
            data={combinedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    marginTop: 30,
  },
  separator: {
    width: "100%",
    height: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
});
