import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { getFrontImage } from "./Api/post";
import { getFrontImage } from "../Api/post";
// import ImageLoader from "./src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
// import { img } from "./assets/global";
import { img } from "../assets/global";

import { SponsorLogo } from "../assets/global";
import { useFocusEffect } from "@react-navigation/native";


const { height, width } = Dimensions.get("window"); // get window dimensions

export default function FrontImage() {
  const navigation = useNavigation();
  const [Data, setData] = useState([]);

  // const getBillboardImage = async () => {
  //   const data = await getFrontImage();
  //   console.log("data =>", data);
    
  //   setData(data);
  // };


  const getBillboardImage = async () => {
    try {
      const response = await getFrontImage();
      // console.log("response =>", response);
  
      if (Array.isArray(response)) {
        setData(response);
      } else if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        // console.error("Front image response is not an array!");
        setData([]); // set to empty array
      }
    } catch (error) {
      console.error("Failed to fetch front images", error);
      setData([]); // prevent crash
    }
  };

    // useFocusEffect(
    //   useCallback(() => {
    //     getBillboardImage();
    //   }, [])
    // );
  

  useEffect(() => {
    getBillboardImage();
  }, [Data]);

   //  scroll index state
    const [activeIndex, setActiveIndex] = useState(0);

  // scroll indicators
  // const dotsIndicator = () => {
  //   return Data?.map((dots, index) => {
  //     if (activeIndex == index) {
  //       return <View key={index} style={styles.dot}></View>;
  //     } else {
  //       return <View key={index} style={styles.dot2}></View>;
  //     }
  //   });
  // };

  const dotsIndicator = () =>
    Array.isArray(Data) &&
    Data.map((_, index) => (
      <View
        key={index}
        style={activeIndex === index ? styles.dot : styles.dot2}
      />
    ));
  

  // scrolls indications
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setActiveIndex(index);
  };

  return (
    <View style={{alignItems:'center'}}>
      {Data?.length>0?
      <FlatList
        data={Data}
        showsHorizontalScrollIndicator={false}
        // style={{ alignContent:'center',}}
        // contentContainerStyle={{ width:width}}
        horizontal
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("front image", { image: item })
              }
              style={styles.image}
            >
              <ImageLoader
                resizeMode={"cover"}
                defaultImageSource={img.user[2]}
                source={{ uri: item.Image.url }}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled={true}
        onScroll={handleScroll}
      />:
      <View  style={styles.image}>

        <Image source={SponsorLogo.img} style={styles.imageLogo} />
      </View>}
      <View style={styles.dotsContainer}>{dotsIndicator()}</View>
    {/* <TouchableOpacity
      onPress={() => navigation.navigate("front image", {frontImage})}
      style={styles.image}
    >
      <Image source={SponsorLogo.img} style={styles.imageLogo} />
    </TouchableOpacity> */}
    </View>

  );
}

const styles = StyleSheet.create({
  image: {
    display: "flex",
    width: width,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  imageStyle: {
    height: "99.99%",
    borderRadius: 15,
    width: 310,
    resizeMode: "cover",
  },
  imageLogo: {
    height: "90%",
    borderRadius: 15,
    width: 200,
    resizeMode: "contain",
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
    marginBottom:8
  },
});
