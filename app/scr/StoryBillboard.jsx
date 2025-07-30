


import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { getStoryBillBoardImage } from "../Api/post";
import { getStoryBillBoardImage } from "../Api/post";
// import ImageLoader from "../src/ImageLoader";
import ImageLoader from "./ImageLoader";
// import { img } from "../assets/global";
import { img } from "../assets/global";

const { width } = Dimensions.get("window");

export default function StoryBillboard() {
  const navigation = useNavigation();
  const [Data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);


  const getBillboardImage = async () => {
    try {
      const response = await getStoryBillBoardImage();
      if (Array.isArray(response)) {
        setData(response);
      } else if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.error("Front image response is not an array!");
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch front images", error);
      setData([]);
    }
  };

  // useEffect(() => {
  //   getBillboardImage();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getBillboardImage();
    }, [])
  );

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const dotsIndicator = () =>
    Data.map((_, index) => (
      <View
        key={index}
        style={activeIndex === index ? styles.dot : styles.dot2}
      />
    ));

 
  if (!Array.isArray(Data) || Data.length === 0) {
    return null; // Don't render anything
  }
  

  return (
    <View style={{ alignItems: "center" }}>
      <FlatList
        data={Data}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("front image", { image: item })}
            style={styles.image}
          >
            <ImageLoader
              resizeMode="cover"
              defaultImageSource={img.user[2]}
              source={{ uri: item.Image.url }}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        onMomentumScrollEnd={handleScroll}
      />
      <View style={styles.dotsContainer}>{dotsIndicator()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  imageStyle: {
    height: "100%",
    width: 310,
    borderRadius: 15,
    resizeMode: "cover",
  },
  dot: {
    backgroundColor: "#aaa",
    height: 8,
    width: 8,
    marginLeft: 8,
    borderRadius: 50,
  },
  dot2: {
    backgroundColor: "#1989b9",
    height: 8,
    width: 8,
    marginLeft: 8,
    borderRadius: 50,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 10,
    marginTop: 8,
  },
  Bilboard: {
    width: "100%",
    height: 142,
    resizeMode: "cover",
  },
  BillboardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});
