import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { img } from "../assets/global";
import ImageLoader from "../scr/ImageLoader";

import { useNavigation } from "@react-navigation/native";

export default function User({item}) {
    const navigation= useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {/* <Image style={styles.image} source={uri:user.profileImage?.secure_url}/>
         */}
        <ImageLoader
          resizeMode={"cover"}
          defaultImageSource={img.user[1]}
          source={{ uri: item.profileImage?.secure_url }}
          style={styles.avatar}
        />
      </View>

      <View
        style={{
          flex: 1,
        //   left: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal:16
        }}
      >
        <Text style={{ color: "#000", fontWeight:600 }}>{item.username} </Text>

        <TouchableOpacity
        onPress={()=>navigation.navigate('ChatScreen', {recepientId:item._id})}
        style={styles.message}>
          <Text style={{ color: "#fff" }}>message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    width: 70,
    height: 30,
    backgroundColor: "#1989b9",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {

    // margin: 10,
    marginHorizontal:16,
    marginTop:20,
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:'space-between'
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  image: {
    resizeMode: "cover",
  },
});
