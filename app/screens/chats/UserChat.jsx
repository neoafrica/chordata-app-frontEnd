import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getHeaderChatInfo, MarkMessageRead } from "../../Api/post";
import { useLogin } from "../../Api/UserContext";
import { img } from "../../assets/global";
import { getTimeAgo } from "../../pages/Comments";
import ImageLoader from "../../scr/ImageLoader";

export default function UserChat({
  item,
  lastMessage,
  Id,
  lastMsgTime,
  unreadCount,
  refreshInbox, // 👈 accept the function here
}) {
  // console.log(item)

  const navigation = useNavigation();
  const [recepientData, setRecepientData] = useState("");
  const { userData, getToken } = useLogin();

  const [recepient, setRecepientId] = useState("");
   const [inBox, setInBox] = useState([]);

  useEffect(() => {
    const fetchHeaderInfo = async () => {
      const response = await getHeaderChatInfo(item); // ✅ await the data

      // console.log("Data for recipient", response.data);

      setRecepientData(response.data);
    };

    fetchHeaderInfo();
  }, [item]); // ✅ Add recepientId as a dependency if it can change

  // unread message marked read

  const MarkMessage= async () => {
    refreshInbox(); // 👈 call it safely
    const body = {
      userId: userData._id,
      otherUserId: Id,
    };

    const response = await MarkMessageRead(body);

    const data = await response.json();

    console.log("response =>", response);

    if (data.status == 200) {
      console.log("Message readed");
    } else {
      console.log("error reade the message");
    }
  };

  // fetch inbox after read the message


  return (
    <Pressable
      onPress={() => {
        navigation.navigate("ChatScreen", { recepientId: item });
        MarkMessage();
        // fetchInBox();
      }}
      // onPress={async () => {
      //   await markMessagesAsRead();
      //   navigation.navigate("ChatScreen", { recepientId: item });
      // }}
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        borderWidth: 0.7,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: "#d0d0d0",
        padding: 10,
      }}
    >
      {/* <Image style={{width:50, height:50, borderRadius:25, resizeMode:'cover'}}/> */}
      <ImageLoader
        resizeMode={"cover"}
        defaultImageSource={img.user[1]}
        source={{ uri: recepientData?.profileImage?.secure_url }}
        style={styles.avatar}
      />

      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: 500 }}>
            {recepientData?.username}
          </Text>
          <View>
            <Text style={{ fontSize: 11, fontWeight: 400, color: "#585858" }}>
              {getTimeAgo(lastMsgTime)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // marginHorizontal:8
          }}
        >
          <Text style={[unreadCount?{ color: "#000", fontWeight: 600, width:250 }:{ color: "#494959",  width:250 }]}>
            {lastMessage.length> 100? lastMessage.slice(0,80) + "....":lastMessage}
          </Text>
          <View>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  unreadBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  unreadText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
