import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLogin } from "../Api/UserContext";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastMessage from "../scr/ToastMessage";

const MAX_WORDS = 560;

const THREAD_STORAGE_KEY = "draft_thread_data";

const TwitterThreadPost = ({ navigation }) => {
  // Toast message
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const { userData } = useLogin();
  const [loading, setLoading] = useState(false);
  const [thread, setThread] = useState([{ text: "", image: null }]);

  const [pickingImage, setPickingImage] = useState(false);

  const getTotalWords = () => {
    return thread
      .map((t) => t.text.trim())
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length;
  };

  // const handleInputChange = (index, value) => {
  //   const updatedThread = [...thread];
  //   updatedThread[index].text = value;
  //   setThread(updatedThread);
  // };

  const handleInputChange = (index, value) => {
    const updatedThread = [...thread];
    updatedThread[index].text = value;
    setThreadAndSave(updatedThread);
  };

  const addThreadPart = () => {
    setThread([...thread, { text: "", image: null }]);
    // const updatedThread = [...thread];
    // updatedThread[index].text = value;
    // setThreadAndSave(updatedThread);
  };

  const removeThreadPart = (index) => {
    if (thread.length > 1) {
      const updatedThread = [...thread];
      updatedThread.splice(index, 1);
      // setThread(updatedThread);
      setThreadAndSave(updatedThread);
    }
  };

  const pickImage = async (index) => {
    setPickingImage(true); // Start loading

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsMultipleSelection: true,
        // allowsEditing: true,
        aspect: [4, 8],
        quality: 1,
      });

      if (!result.canceled) {
        const updatedThread = [...thread];
        updatedThread[index].image = result.assets[0].uri;
        // setThread(updatedThread);
        setThreadAndSave(updatedThread);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    } finally {
      setPickingImage(false); // End loading
    }
  };

  const removeImage = (index) => {
    const updatedThread = [...thread];
    updatedThread[index].image = null;
    // setThread(updatedThread);
    setThreadAndSave(updatedThread);
  };

  const submitThread = async () => {
    const totalWords = getTotalWords();

    if (totalWords > MAX_WORDS) {
      return Alert.alert(
        "Too many words",
        `Thread must be under ${MAX_WORDS} words.`
      );
    }

    if (!thread.some((t) => t.text.trim() || t.image)) {
      return alert("Please add text or image to at least one tweet.");
    }

    try {
      // setToast(true);
      setLoading(true);

      const formData = new FormData();
      formData.append("author", userData._id);

      const tweetTextArray = thread.map(({ text }) => ({ text }));
      formData.append("tweets", JSON.stringify(tweetTextArray));

      thread.forEach((item, index) => {
        if (item.image) {
          const uriParts = item.image.split(".");
          const fileType = uriParts[uriParts.length - 1];
          formData.append("images", {
            uri: item.image,
            name: `tweet-image-${index}.${fileType}`,
            type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
          });
        }
      });

      const response = await axios.post(
        "https://chordata-backend-1.onrender.com/api/post/threads",
        // "http://192.168.43.14:3000/api/post/threads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Thread posted successfully!");
        // setThread([{ text: "", image: null }]);

        await AsyncStorage.removeItem(THREAD_STORAGE_KEY);
        setThread([{ text: "", image: null }]);

        navigation.goBack();
      } else {
        setToast(true);
        setMessage("Failed to post thread");
        Alert.alert("Failed to post thread", JSON.stringify(response.data));
      }
    } catch (error) {
      setToast(true);
      setMessage("Submission failed");
      console.error("Upload error:", error);
      // Alert.alert("Error", "An error occurred while uploading the thread.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (loading) return true;
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [loading]);

  // AsyStorage values and load on mount persist data
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedThread = await AsyncStorage.getItem(THREAD_STORAGE_KEY);
        if (savedThread) {
          setThread(JSON.parse(savedThread));
        }
      } catch (e) {
        console.error("Failed to load saved draft", e);
      }
    };

    loadDraft();
  }, []);

  const setThreadAndSave = async (newThread) => {
    setThread(newThread);
    try {
      await AsyncStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(newThread));
    } catch (e) {
      console.error("Failed to save thread draft", e);
    }
  };

  const totalWords = getTotalWords();
  const isOverLimit = totalWords > MAX_WORDS;

  return (
    <SafeAreaView>
      <NetworkStatusBanner />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create Thread</Text>

        {thread.map((item, index) => (
          <View key={index} style={styles.inputContainer}>
            <TextInput
              placeholder={`Paragraph ${index + 1}`}
              placeholderTextColor="#1989b9" // Light gray placeholder
              value={item.text}
              onChangeText={(text) => handleInputChange(index, text)}
              style={styles.textInput}
              multiline
            />

            {item.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity onPress={() => removeImage(index)}>
                  <Text style={styles.removeImageText}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => pickImage(index)}
              style={styles.imageButton}
            >
              {pickingImage ? (
                <ActivityIndicator size={24} color={"#fff"} />
              ) : (
                <Text style={styles.imageButtonText}>
                  {item.image ? "Change Image" : "Add Image"}
                </Text>
              )}
            </TouchableOpacity>

            {thread.length > 1 && (
              <TouchableOpacity
                onPress={() => removeThreadPart(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove Paragraph</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Text
          style={{
            textAlign: "right",
            color: isOverLimit ? "red" : totalWords > 500 ? "orange" : "gray",
            marginBottom: 10,
          }}
        >
          Total words: {totalWords}/{MAX_WORDS}
        </Text>

        <TouchableOpacity onPress={addThreadPart} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add another Paragraph</Text>
        </TouchableOpacity>


           <View style={{ alignItems: "center", justifyContent: "center" }}>
          {toast && (
            <ToastMessage
              setToast={setToast}
              // message={"Account created successfully!"}
              message={message}
            />
          )}
        </View>

        {loading ? (
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <Button
            title="Post Thread"
            onPress={submitThread}
            disabled={isOverLimit}
          />
        )}

     
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ActivityIndicator: {
    padding: 6,
    width: 320,
    backgroundColor: "#028704",
    height: 40,
    alignItems: "center",
    borderRadius: 6,
  },
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
  },
  textInput: {
    minHeight: 60,
    textAlignVertical: "top",
    fontSize: 16,
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: "#007aff",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  imageButtonText: {
    color: "white",
    fontWeight: "600",
  },
  removeButton: {
    marginTop: 6,
    alignSelf: "flex-end",
  },
  removeButtonText: {
    color: "red",
  },
  imageContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageText: {
    color: "red",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TwitterThreadPost;
