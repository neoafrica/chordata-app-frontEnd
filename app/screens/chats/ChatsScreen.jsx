import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";
import { useLogin } from "../../Api/UserContext";
import {
  DeleteMessage,
  SendMessage,
  fetchMessages,
  getHeaderChatInfo,
} from "../../Api/post";
import { img } from "../../assets/global";
import ImageLoader from "../../scr/ImageLoader";

export default function ChatsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { userData, getToken } = useLogin();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [selectedImage, setSelectedImage] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [recepientData, setRecepientData] = useState("");

  const [image, setImage] = useState();

  const [inputHeight, setInputHeight] = useState(40);

  const recepientId = route.params.recepientId;

  // Picking image indicator
  const [pickingImage, setPickingImage] = useState(false);

  // delete message

  const [deleted, setDeleted] = useState(false);

  // image upload

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const cancelTokenSourceRef = useRef(null); // <--- For canceling

  const fetchConvo = async () => {
    try {
      const response = await fetchMessages(userData?._id, recepientId);

      const data = response.data;

      // console.log("messages", response);

      if (response.status == 200) {
        setMessages(data);
      } else {
        console.log("Error showing messages");
      }
    } catch (error) {
      console.log("Error fetch messages", error);
    }
  };

  useEffect(() => {
    fetchConvo();
  }, []);

  useEffect(() => {
    const fetchHeaderInfo = async () => {
      const response = await getHeaderChatInfo(recepientId); // ✅ await the data

      // console.log("Data for recipient", response.data);

      setRecepientData(response.data);
    };

    fetchHeaderInfo();
  }, [recepientId]); // ✅ Add recepientId as a dependency if it can change

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

  const handleSend = async (messageType, imageUrl) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userData._id);
      formData.append("recepientId", route.params.recepientId);

      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUrl,
          name: "image.jpg",
          type: "image/jpeg" || "image/jpeg",
        });
        //    formData.append("qnImage", {
        //   uri: img.uri,
        //   name: img.fileName || `image_${index}.jpg`,
        //   type: img.mimeType || "image/jpeg" || "image/jpg",
        // });
      } else {
        formData.append("messageType", "text");
        formData.append("message", message);
      }

      const response = await SendMessage(formData);

      // console.log(formData)

      if (response.status === 200) {
        setMessage("");
        // setSelectedImage("");
        setImage("");
        fetchConvo();
      }
    } catch (error) {
      console.log("error send message", error);
    }
  };

  // console.log(recepientData?.username)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        height: 60, // <-- Set your desired height
      },
      headerTitle: "",
      headerLeft: () => (
        <View style={{ marginLeft: 16 }}>
          <Text>Loading...</Text>
        </View>
      ),
    });
    if (!recepientData) return; // Don't set header until data is ready

    navigation.setOptions({
      headerStyle: {
        height: 60, // <-- Set your desired height
      },
      headerShown: true,
      headerTitle: "",
      headerLeft: () => (
        <View
          style={{
            // height: 50,
            // width:360,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            bottom: 10,
            // backgroundColor: "green",
          }}
        >
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color={"#000"}
            style={{ marginHorizontal: 16 }}
          />

          {selectedMessages?.length > 0 ? (
            <View>
              <Text style={{ fontSize: 15, fontWeight: 500 }}>
                {selectedMessages?.length}
              </Text>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              {/* <Image
              source={{ uri: recepientData.profileImage?.secure_url }}
              style={styles.avatar}
            /> */}
              <ImageLoader
                resizeMode={"cover"}
                defaultImageSource={img.user[1]}
                source={{ uri: recepientData.profileImage?.secure_url }}
                style={styles.avatar}
              />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {recepientData.username || "Unknown"}
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages?.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              bottom: 10,
              marginHorizontal: 16,
            }}
          >
            {/* <Ionicons name="arrow-redo-sharp" color={"black"} size={24}/> */}
            <Ionicons
              onPress={() => backAction()}
              name="arrow-undo"
              color={"black"}
              size={24}
            />
            {/* <FontAwesome name="star" size={24} color={"black"}/> */}
            {deleted ? (
              <ActivityIndicator size={24} color={"#1989b9"} />
            ) : (
              <MaterialIcons
                onPress={() => {
                  setDeleted(true);
                  deleteMessage(selectedMessages);
                }}
                name="delete"
                size={24}
                color={"black"}
              />
            )}
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };

    return new Date(time).toLocaleString("en-US", options);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }
  };

  const handleContentSize = () => {
    scrollToBottom();
  };

  const pickImage = async () => {
    setPickingImage(true);

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        // allowsMultipleSelection: true,
        // allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      // console.log(result);

      if (!result.canceled) {
        // handleSend("image", result.assets[0].uri);

        await handleSendImageWithAxios(result.assets[0]);
        setImage(result.assets);
        console.log(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    } finally {
      setPickingImage(false); // End loading
    }
  };

  // image upload with progress

  const handleSendImageWithAxios = async (imageAsset) => {
    const uri = imageAsset.uri;
    const fileName = uri.split("/").pop();
    const fileType = "image/jpeg";

    const formData = new FormData();
    formData.append("senderId", userData._id);
    formData.append("recepientId", recepientId);
    formData.append("messageType", "image");
    formData.append("imageFile", {
      uri,
      type: fileType,
      name: fileName,
    });

    const cancelTokenSource = axios.CancelToken.source();
    cancelTokenSourceRef.current = cancelTokenSource; // save it

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setPreviewImage(uri);

      const response = await axios.post(
        "https://chordata-backend-1.onrender.com/api/post/message",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          cancelToken: cancelTokenSource.token,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setIsUploading(false);
      setPreviewImage(null);
      cancelTokenSourceRef.current = null; // clear it
      fetchConvo();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload canceled");
        Alert.alert("Upload canceled");
      } else {
        console.log("Upload failed", error);
        Alert.alert("Upload failed", "Please try again.");
      }

      setIsUploading(false);
      setPreviewImage(null);
      setUploadProgress(0);
      cancelTokenSourceRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Component unmounted");
        setPreviewImage(null);
        setUploadProgress(0);
      }
    };
  }, []);

  // Back mode in message selection mode

  const backAction = () => {
    if (selectedMessages.length > 0) {
      setSelectedMessages([]);
      return true; // prevent exit
    }
    navigation.goBack();
    return true;
  };

  // Delete message

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages?.includes(message._id);
    if (isSelected) {
      setSelectedMessages((prev) => prev?.filter((id) => id !== message._id));
    } else {
      setSelectedMessages((prev) => [...prev, message._id]);
    }
  };

  const deleteMessage = async (messageId) => {
    setDeleted(true);
    // const msg= JSON.stringify({messag:messageId})
    // console.log(msg)
    try {
      const response = await DeleteMessage({ messages: messageId });

      if (response.status == 200) {
        setSelectedMessages((prev) =>
          prev.filter((id) => !messageId?.includes(id))
        );
        fetchConvo();
        setDeleted(false);
        Alert.alert("Message deleted");
      }
    } catch (error) {
      console.log("error delete message");
    }finally {
    setDeleted(false); // ✅ always reset
  }
  };

  // console.log("messages ", selectedMessages)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner></NetworkStatusBanner>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 90}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        {messages.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#aaa" }}>No messages yet</Text>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          onContentSizeChange={handleContentSize}
        >
          {messages.map((item, index) => {
            // console.log(item.imageUrl.url);
            if (item.messageType == "text") {
              const isSelected = selectedMessages?.includes(item._id);
              return (
                <Pressable
                  onLongPress={() => handleSelectMessage(item)}
                  key={index}
                  style={[
                    item?.senderId?._id === userData?._id
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#f1f8e8",
                          padding: 8,
                          maxWidth: "80%",
                          borderRadius: 20,
                          margin: 5,
                          marginHorizontal: 16,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 10,
                          elevation: 10,
                          // width:360
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "#f8f8f8",
                          padding: 8,
                          margin: 5,
                          borderRadius: 20,
                          maxWidth: "80%",
                          marginHorizontal: 16,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 10,
                          elevation: 10,
                        },
                    isSelected && { width: "100%", backgroundColor: "#028704" },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "left",
                      marginHorizontal: 8,
                    }}
                  >
                    {item?.message}
                  </Text>
                  <Text
                    style={[
                      item?.senderId?._id === userData?._id
                        ? {
                            textAlign: "right",
                            fontSize: 12,
                            marginTop: 2,
                            color: "gray",
                          }
                        : {
                            textAlign: "right",
                            fontSize: 12,
                            marginTop: 2,
                            color: "gray",
                          },
                    ]}
                  >
                    {formatTime(item.timestamp)}
                  </Text>
                </Pressable>
              );
            }
            if (item.messageType == "image") {
              const isSelected = selectedMessages?.includes(item._id);
              return (
                <Pressable
                  onLongPress={() => handleSelectMessage(item)}
                  key={index}
                  style={[
                    item?.senderId?._id === userData?._id
                      ? {
                          alignSelf: "flex-end",
                          backgroundColor: "#f1f8e8",
                          padding: 8,
                          maxWidth: "80%",
                          borderRadius: 20,
                          margin: 5,
                          marginHorizontal: 16,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 10,
                          elevation: 10,
                          // width:360
                        }
                      : {
                          alignSelf: "flex-start",
                          backgroundColor: "#f8f8f8",
                          padding: 8,
                          margin: 5,
                          borderRadius: 20,
                          maxWidth: "80%",
                          marginHorizontal: 16,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 10,
                          elevation: 10,
                        },
                    isSelected && { width: "70%", backgroundColor: "#028704" },
                  ]}
                >
                  <View>
                    {/* <Image source={{uri:item.imageUrl.url}} style={{width:200, height:200, borderRadius:10}}/> */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("new clinical", {
                          image: item.imageUrl,
                        })
                      }
                    >
                      <ImageLoader
                        resizeMode={"cover"}
                        defaultImageSource={img.user[2]}
                        source={{ uri: item?.imageUrl?.url }}
                        style={{ width: 220, height: 200, borderRadius: 10 }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        item?.senderId?._id === userData?._id
                          ? {
                              textAlign: "right",
                              fontSize: 12,
                              marginTop: 2,
                              color: "gray",
                            }
                          : {
                              textAlign: "right",
                              fontSize: 12,
                              marginTop: 2,
                              color: "gray",
                            },
                      ]}
                    >
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                </Pressable>
              );
            }
          })}
        </ScrollView>

        {/* Image upload */}

        {previewImage && (
          <View
            // style={{ margin: 10, alignItems: "center" }}
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#f1f8e8",
              padding: 8,
              maxWidth: "80%",
              borderRadius: 20,
              margin: 5,
              marginHorizontal: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Image
              source={{ uri: previewImage }}
              style={{ width: 220, height: 200, borderRadius: 10 }}
            />
            {isUploading && (
              <>
                <Text style={{ marginTop: 5, color: "gray" }}>
                  Uploading... {uploadProgress}%
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: "#e53935",
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                  onPress={() => {
                    if (cancelTokenSourceRef.current) {
                      cancelTokenSourceRef.current.cancel(
                        "Upload canceled by user."
                      );
                    }
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Cancel Upload
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <View
          style={{
            // flex:1,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderTopColor: "#ddd",
            // maxHeight:200,
          }}
        >
          {/* <Entypo
            style={{ marginRight: 5 }}
            name="emoji-happy"
            size={24}
            color={"black"}
          /> */}
          <TextInput
            multiline
            value={message}
            onChangeText={(text) => setMessage(text)}
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
            style={{
              flex: 1,
              // height: 40,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 20,
              paddingHorizontal: 10,
              height: Math.max(40, inputHeight),
              backgroundColor: "#fff",
              fontSize: 15,
              // position:'absolute'
            }}
            placeholder="type your message..."
          />

          {pickingImage ? (
            <ActivityIndicator color={"#1989b9"} size={24} />
          ) : (
            <TouchableOpacity onPress={() => pickImage()}>
              <Entypo
                onPress={() => pickImage()}
                style={{ marginLeft: 5 }}
                name="camera"
                size={24}
                color={"grey"}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            // onPress={() => handleSend("text")}
            onPress={() => {
              if (message.trim()) {
                handleSend("text");
              }
            }}
            disabled={isUploading}
            style={[
              {
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginLeft: 10,
                backgroundColor: "#1989b9",
              },
              isUploading && { backgroundColor: "#ccc" },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 100,
  },
});
