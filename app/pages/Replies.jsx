import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useNavigation } from "expo-router";
import { useNavigation } from "@react-navigation/native";
// import { img } from "../assets/global";
import { img } from "../assets/global";
// import ImageLoader from "../src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
// import { FormatText } from "./formatText";
import { FormatText } from "../cases/formatText";

const image= img
export default function Replies({ img, msg, replies, date, name, likes }) {
  const nav = useNavigation();
  const [pressed, setPressed] = useState(true);
  const [Likes, setLikes] = useState(likes);

  const Pressed = () => {
    if (pressed) {
      setPressed(false);
      setLikes(Likes + 1);
    } else {
      setPressed(true);
      setLikes(Likes - 1);
    }
  };

  const openSendBox = () => {
    setPressed((prev) => !prev);
  };
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        {/* <Image source={{uri:img}} style={styles.img} />
         */}
        <ImageLoader
          resizeMode={"cover"}
          defaultImageSource={image.user[1]}
          source={{uri:img}} 
          style={styles.img}
        />
      </View>
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.authorName}>{name}</Text>
        </View>
        <View style={{ width: 220 }}>
          <Text style={styles.comment}>{FormatText(msg)}</Text>
        </View>

        <View style={styles.icons$Date}>

          <TouchableOpacity onPress={Pressed}>
          </TouchableOpacity>
          <View style={{ right: 16 }}>
            {/* <Text style={{ fontSize: 12 }}>{Likes}</Text> */}
          </View>
          <Text style={{ color: "#aaa", fontSize: 12 }}>{date}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    rowGap: 4,
  },
  imgContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 35,
    height: 35,
    borderRadius: 50,
    resizeMode: "cover",
    borderWidth: 0.1,
  },
  icons$Date: {
    width: 220,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
