import React, { useEffect, useState } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// import MyBackButton from "../Pages/MyBackButton";
import MyBackButton from "../scr/MyBackButton";
// import { img } from "../assets/global";
import {
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons
} from "@expo/vector-icons";
import { img } from "../assets/global";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { fetchInbox } from "../Api/post";
import { useLogin } from "../Api/UserContext";
import ImageLoader from "../scr/ImageLoader";
// import { useNavigation } from "@react-navigation/native";

export default function Profile({ navigation }) {
  // const navigation= useNavigation()

  const { userData, getToken } = useLogin();

    const [inBox, setInBox] = useState([]);
  
    const [recepient, setRecepientId] = useState("");

    const [totalCount, setCount]= useState(0)

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


   useFocusEffect(
      React.useCallback(() => {
        getToken();
      }, [])
    );

  const logOut = () => {
    AsyncStorage.setItem("isLogin", "");
    AsyncStorage.setItem("token", "");
    // navigateTo("Login")
    navigation.navigate("Login");
  };



  useEffect(() => {
    getToken()
  }, []);


   const fetchInBox = async () => {
      try {
        const response = await fetchInbox(userData?._id);

        // console.log(response.data.totalUnreadCount)

        if (response.status === 200) {

          setCount(response.data.totalUnreadCount)

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
          console.log("Error showing messages");
        }
      } catch (error) {
        console.log("Error fetching messages", error);
      }
    };
  
    useEffect(() => {
      fetchInBox();
    }, [inBox]);
  

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <MyBackButton onPress={navigation.goBack} />
      </View>
      <View style={styles.container}>
        <View>
          <Text
            style={{
              textAlign: "center",
              marginBottom: 10,
              fontSize: 20,
              fontWeight: 500,
              paddingBottom: 10,
              color: "#028704",
            }}
          >
            Profile
          </Text>
        </View>

        <View>
          {/* {userData?.profileImage?.secure_url ? (
            <Image
              source={{ uri: userData?.profileImage?.secure_url }}
              style={styles.img}
            />
          ) : (
            <Image source={img.user[1]} style={styles.img} />
          )} */}

          <ImageLoader
            resizeMode={"cover"}
            defaultImageSource={img.user[1]}
            source={{ uri: userData?.profileImage?.secure_url }}
            style={styles.img}
          />
           {/* <Image source={img.user[1]} style={styles.img} /> */}
        </View>

        <View style={styles.profileDesc}>
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            {userData?.username}
            
          </Text>
        </View>

        <View style={styles.profileFrame}>
          <View style={styles.barIcon}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={styles.IconCircle}></View>
              <SimpleLineIcons
                name="pencil"
                color={"#fff"}
                style={styles.icon}
                size={24}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("edit profile")}
            >
              <Text style={{ fontSize: 16 }}>Edit Profile</Text>
            </TouchableOpacity>
            <View>
              <Ionicons name="chevron-forward" size={24} color={"black"} />
            </View>
          </View>
          <View
            style={{
              height: 1,
              width: 280,
              backgroundColor: "rgba(170,170,170,0.3)",
            }}
          />
          <View style={styles.barIcon}>
            <TouchableOpacity
            onPress={()=> navigation.navigate('Inbox')}
            style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={styles.IconCircle}></View>
              <Fontisto
                name="email"
                color={"#fff"}
                style={styles.icon}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=> navigation.navigate('Inbox')}
            style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>

            <Text style={{ fontSize: 16 }}>In Box </Text>
            {totalCount > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{totalCount}</Text>
                          </View>
                        )}
            </TouchableOpacity>
            <View>
              <Ionicons name="chevron-forward" size={24} color={"black"} />
            </View>
            
          </View>
           <View
            style={{
              height: 1,
              width: 280,
              backgroundColor: "rgba(170,170,170,0.3)",
            }}
          />
            <View style={styles.barIcon}>
              <TouchableOpacity
              // style={styles.barIcon}
                onPress={() => navigation.navigate("Chat-Room")}

             style={{ alignItems: "center", justifyContent: "center" }}
             >
              <View style={styles.IconCircle}></View>
              <Feather
                name="users"
                color={"#fff"}
                style={styles.icon}
                size={24}
              />
            
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => navigation.navigate("Chat-Room")}
              >

            <Text style={{ fontSize: 16 }}>Chat Room</Text>
              </TouchableOpacity>
            <View>
              <Ionicons name="chevron-forward" size={24} color={"black"} />
            </View>
          </View>
          <View
            style={{
              height: 1,
              width: 280,
              backgroundColor: "rgba(170,170,170,0.3)",
            }}
          />
          <TouchableOpacity
            style={styles.barIcon}
            onPress={() => navigation.navigate("Bookmarks")}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={styles.IconCircle}></View>
              <Ionicons
                name="bookmark-outline"
                color={"#fff"}
                style={styles.icon}
                size={24}
              />
            </View>

            <Text style={{ fontSize: 16 }}>Bookmarks</Text>
            <View>
              <Ionicons name="chevron-forward" size={24} color={"black"} />
            </View>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              width: 280,
              backgroundColor: "rgba(170,170,170,0.3)",
            }}
          />
          <View style={styles.barIcon}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={styles.IconCircle}></View>
              <Feather
                name="book-open"
                color={"#fff"}
                style={styles.icon}
                size={24}
              />
            </View>
            <TouchableOpacity 
            onPress={() => navigation.navigate("My Thread")}
            >
              <Text style={{ fontSize: 16 }}>My Thread</Text>
            </TouchableOpacity>
            <View>
              <Ionicons name="chevron-forward" size={24} color={"black"} />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => logOut()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 8,
            marginBottom: 24,
            justifyContent: "center",
          }}
        >
          <View style={{ marginTop: 16 }}>
            <MaterialCommunityIcons
              name="exit-run"
              color={"#c82121"}
              size={24}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              marginTop: 20,
              color: "#c82121",
              fontWeight: "bold",
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    // columnGap:70
  },
  IconCircle: {
    // flex:1,
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#028704",
    // position:'absolute',
  },
  icon: {
    position: "absolute",
  },
  profileDesc: {
    // height: 64,
    width: 313,
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    // marginBottom: 24,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    bottom: 30,
  },
  imgContainer: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  img: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 100,
  },
  profileFrame: {
    height: 288,
    width: 308,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 16,
    // alignItems:'center',
  },
    unreadBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    left:60
  },
  unreadText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
