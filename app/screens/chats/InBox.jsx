import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";
import { fetchInbox } from "../../Api/post";
import { useLogin } from "../../Api/UserContext";
import UserChat from "./UserChat";
export default function InBox() {
  const { userData, getToken } = useLogin();

  const [inBox, setInBox] = useState([]);

  const [recepient, setRecepientId] = useState("");

  const [loading, setLoading] = useState(false);


  const fetchInBox = async () => {
      setLoading(true); // Start loading
    try {
      const response = await fetchInbox(userData?._id);

      if (response.status === 200) {
        setLoading(false); // Stop loading
        const data = response.data;

        const latestMessagesByUser = {};

        data.messages.forEach((message) => {
          const senderId =
            typeof message.senderId === "object"
              ? message.senderId._id
              : message.senderId;
          const recepientId =
            typeof message.recepientId === "object"
              ? message.recepientId._id
              : message.recepientId;

          setRecepientId(recepientId);

          // Find the "other user" (not the logged-in user)
          const otherUserId =
            senderId === userData._id ? recepientId : senderId;

        
          // If this is the latest message between us and that user, keep it
          if (
            !latestMessagesByUser[otherUserId] ||
            new Date(message.timestamp) >
              new Date(latestMessagesByUser[otherUserId].timestamp)
          ) {
            latestMessagesByUser[otherUserId] = message;
          }
        });

        const uniqueMessages = Object.values(latestMessagesByUser);

        // Optional: sort by most recent
        uniqueMessages.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setInBox(uniqueMessages);
      } else {
        setLoading(false); // Stop loading
        console.log("Error showing messages");
      }
    } catch (error) {
      console.log("Error fetching messages", error);
      setLoading(false); // Stop loading
    }
  };

// const fetchInBox = async () => {
//   setLoading(true); // Start loading
//   try {
//     const response = await fetchInbox(userData?._id);
//     if (response.status === 200) {
//       const data = response.data;
//       const latestMessagesByUser = {};

//       data.messages.forEach((message) => {
//         const senderId =
//           typeof message.senderId === "object"
//             ? message.senderId._id
//             : message.senderId;
//         const recepientId =
//           typeof message.recepientId === "object"
//             ? message.recepientId._id
//             : message.recepientId;

//         const otherUserId =
//           senderId === userData._id ? recepientId : senderId;

//         if (
//           !latestMessagesByUser[otherUserId] ||
//           new Date(message.timestamp) >
//             new Date(latestMessagesByUser[otherUserId].timestamp)
//         ) {
//           latestMessagesByUser[otherUserId] = message;
//         }
//       });

//       const uniqueMessages = Object.values(latestMessagesByUser);
//       uniqueMessages.sort(
//         (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
//       );

//       setInBox(uniqueMessages);
//     } else {
//       console.log("Error showing messages");
//     }
//   } catch (error) {
//     console.log("Error fetching messages", error);
//   } finally {
//     setLoading(false); // Stop loading
//   }
// };

  useEffect(() => {
    fetchInBox();
  }, []);

  return (
    <View style={styles.container}>
      <NetworkStatusBanner></NetworkStatusBanner>
      {/* {!loading && inBox.length === 0 && 
  <View style={{ alignItems: 'center', marginTop: 40 }}>
    <Text style={{ color: '#777' }}>No conversations yet</Text>
  </View>
} */}

{/* {!loading ? <View>
  <Text style={{ color: '#777' }}>No conversations yet</Text>
</View>:null} */}

  {loading ? 
  <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>

    <ActivityIndicator size="large" color="#0000ff" />
  </View>:
    <ScrollView>
      {inBox.map((msg, index) => {
        const senderId =
          typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
        const recepientId =
          typeof msg.recepientId === "object"
            ? msg.recepientId._id
            : msg.recepientId;

        const otherUserId = senderId === userData._id ? recepientId : senderId;
        // console.log("my Id", otherUserId + "recepeintId", recepientId)

        return (
          <UserChat
            key={index}
            item={otherUserId}
            lastMessage={msg.message}
            lastMsgTime={msg.timestamp}
            Id={otherUserId}
            unreadCount={msg.unreadCount || 0}
            refreshInbox={fetchInBox} // 👈 here it is
          />
        );
      })}
    </ScrollView>}
    </View>
 
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
