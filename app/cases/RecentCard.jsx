import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Bookmark, unBookmark,getCase } from "../Api/post";
import { useLogin } from "../Api/UserContext";
import ImageLoader from "../scr/ImageLoader";
import ToastMessage from "../scr/ToastMessage";
import { img } from "../assets/global";
import { FormatText } from "./formatText";

export default function RecentCaseCard({
  onBookmarkChange, // The callback function passed from parent
  bookmark,
  procedure,
  regime,
  category,
  authorId,
  title,
  history,
  authorName,
  image,
  authorPic,
  datePublished,

  poc,

  clinicalFindings,
  recommendation,
  pmFindings,
  tentativeDiagnosis,
  differentialDiagnosis,

  postId,
  vaccinationAgainst,
  vaccineName,

  management,
  drugsUsed,

  caseImages,
  sexOfAnimal,
  ageOfAnimal,
  typeOfAnimal,
  managementCategory,
  description,
}) {
  const [color, setColor] = useState("green");

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [Case, setCase] = useState();
  const [Bookmarks, setBookmark] = useState();

  const { userData, getToken } = useLogin();

  const navigation = useNavigation();

  // Toast message
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  // call back function from parent bookmarks

  const handleBookmarkToggle = async () => {
    const updatedBookmark = !isBookmarked;
    setIsBookmarked(updatedBookmark);

    if (updatedBookmark) {
      await addBookmark();
    } else {
      await removeBookmark();
    }

    // Pass the updated case to the parent to update the list
    const updatedCase = {
      ...bookmark,
      bookmarks: updatedBookmark
        ? [...bookmark, userData?._id]
        : bookmark.filter((userId) => userId !== userData?._id),
    };

    // Call onBookmarkChange to update the parent component state
    if (onBookmarkChange) {
      onBookmarkChange(updatedCase);
    }
  };


  const HandlePress = () => {
    setIsBookmarked((prev) => !prev);
  };

  const fetchStory = async () => {
    const CAse = await getCase();

    setCase(CAse);
  };

  useEffect(() => {
    const currentCase = Case?.find((str) => str.id === postId);
    if (currentCase) {
      setBookmark(currentCase.bookmarks);
    }
  }, [Case, postId]);

  useEffect(() => {
    fetchStory();
  }, [Bookmarks]);

  useEffect(() => {
    // Check if the case is already bookmarked
    const userLiked = bookmark?.includes(userData?._id);
    setIsBookmarked(userLiked);
  }, [bookmark, userData]);

  const addBookmark = async () => {
    const userdata = { author: userData?._id, postId };

    try {
      const response = await Bookmark(userdata); // Assuming Bookmark function exists to add a bookmark
      if (response.data.status === "ok") {
        setToast(true);
        setMessage("bookmark added");
      } else {
        setToast(true);
        setMessage(JSON.stringify(response.data));
        // Alert.alert(JSON.stringify(response.data));
      }
    } catch (error) {
      setToast(true);
      setMessage({ error });
      console.log({ error });
    }
  };

  const removeBookmark = async () => {
    const userdata = { author: userData?._id, postId };
    try {
      const response = await unBookmark(userdata); // Assuming unBookmark function exists to remove a bookmark
      if (response.data.status === "ok") {
        setToast(true);
        setMessage("bookmark removed");
      } else {
        setToast(true);
        setMessage(JSON.stringify(response.data));
        // Alert.alert(JSON.stringify(response.data));
      }
    } catch (error) {
      setToast(true);
      setMessage({ error });
      console.log({ error });
    }
  };

  // useEffect(() => {
  //   if (bookmark?.length) {
  //     const userLiked = bookmark.includes(userData?._id);
  //     setIsBookmarked(userLiked);
  //   }
  // }, [bookmark, userData?._id]);

  // const addBookmark = async () => {
  //   if (!isBookmarked) {
  //     const userdata = { author: userData?._id, postId: postId };
  //     await Bookmark(userdata);
  //     setIsBookmarked(true); // Update the heart state
  //   }
  // };

  // const removeBookmark = async () => {
  //   if (isBookmarked) {
  //     const userdata = { author: userData?._id, postId: postId };
  //     await unBookmark(userdata);
  //     setIsBookmarked(false); // Update the heart state
  //   }
  // };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.ImageContainer}
        onPress={() =>
          navigation.navigate(
            category == "Vaccination"
              ? "Vaccination details"
              : category == "Clinical"
              ? "clinical details"
              : category == "Postmortem"
              ? "Postmortem details"
              : category == "Surgery"
              ? "Surgery details"
              : category == "Management"
              ? "Routine Management"
              : null,
            {
              postId,
              category,
              authorId,
              vaccinationAgainst,
              vaccineName,
              poc,
              procedure,
              Title: title,
              img: caseImages,
              hist: history,
              authorPic: authorPic,
              authorName: authorName,
              pmFindings,
              recommendation,
              tentativeDiagnosis,
              differentialDiagnosis,
              management: management,
              regime,
              clinicalFindings,
              // caseImages,
              ageOfAnimal,
              sexOfAnimal,
              typeOfAnimal,
              drugsUsed: drugsUsed,
              managementCategory,
              description,
            }
          )
        }
      >
        {/* {caseImages ? (
          <Image
            source={{ uri: caseImages[0]?.url }}
            style={styles.ImageCase}
          />
        ) : (
          //   <Image source={{uri:caseImages[0].secure_url}} style={styles.ImageCase} />
          <View
            style={{
              height: 120,
              width: 101,
              backgroundColor: "green",
              borderRadius: 10,
            }}
          ></View>

       
        )} */}
        <ImageLoader
          resizeMode={"cover"}
          defaultImageSource={img.user[2]}
          source={{ uri: caseImages[0]?.url }}
          style={styles.ImageCase}
        />
      </TouchableOpacity>

      <View style={styles.content$Arrow}>
        {/* flex against image */}
        <View style={styles.contents}>
          <TouchableOpacity>
            <Text style={styles.headeText}>
              {FormatText(title?.length > 20 ? title.slice(0, 20) + "..." : title)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bodyTextContainer}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.bodyText}
            >
              {category === "Vaccination"
                ? regime
                : category === "Management"
                ? description
                : history}
              {/* {category == "Vaccination" ? regime : history || category== "Management" ? description:null}... */}
            </Text>
          </TouchableOpacity>

          {/* Author */}
          <View style={styles.author}>
            <View>
              {/* <Image source={{ uri: authorPic }} style={styles.authorPic} /> */}
              <ImageLoader
                resizeMode={"cover"}
                defaultImageSource={img.user[1]}
                source={{ uri: authorPic }}
                style={styles.authorPic}
              />
            </View>
            <View>
              <Text style={styles.authorName}>{authorName}</Text>
            </View>
          </View>
          {/* ****************author */}

          {/* **************** */}

          {/* Days and bookmark */}
          <View style={styles.time$bmk}>
            <View>
              <Text style={styles.timeStampText}>{datePublished}</Text>
            </View>
            <TouchableOpacity
              style={{
                left: 10,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleBookmarkToggle}
            >
              {isBookmarked ? (
                <FontAwesome name="bookmark" size={20} color={color} />
              ) : (
                <FontAwesome name="bookmark-o" size={20} color={color} />
              )}
            </TouchableOpacity>
          </View>
          {/* ************** */}
        </View>
        <View>
          <Ionicons name="chevron-forward" size={24} color={"black"} />
        </View>
      <View style={{ alignItems: "center", justifyContent: "center" , left:-100}}>
        {toast && (
          <ToastMessage
            setToast={setToast}
            // message={"Account created successfully!"}
            message={message}
          />
        )}
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 320,
    height: 154,
    backgroundColor: "#f9fcf5",
    borderRadius: 5,
    // shadowOffset:{width:0,height:4},
    // shadowRadius:6,
    shadowColor: "black",
    shadowOpacity: 0.25,
    elevation: 27,
    marginHorizontal: 22,
    // marginTop:20,
    // marginBottom:20
  },

  content$Arrow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ImageCase: {
    height: 120,
    width: 101,
    resizeMode: "cover",
    borderRadius: 10,
  },
  ImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 101,
    marginLeft: 16,
  },
  time$bmk: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  author: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  authorPic: {
    height: 36,
    width: 36,
    resizeMode: "cover",
    borderRadius: 50,
  },
  authorName: {
    fontSize: 13,
    color: "#1989b9",
    fontWeight: "500",
  },

  bodyTextContainer: {
    // flex:1,
    width: 170,
    paddingBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    color: "#676767",
  },
  timeStampText: {
    fontSize: 14,
    color: "#676767",
  },
  headeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contents: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 8,
  },
});
