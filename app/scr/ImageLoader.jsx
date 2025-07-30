// import { StyleSheet, Text, View, Animated,Dimensions,ActivityIndicator } from "react-native";
// import React,{useState} from "react";


// const { height, width } = Dimensions.get("window"); // get window dimensions
// export default function ImageLoader({
//   defaultImageSource,
//   source,
//   style,
//   ...props
// }) {
//   const defaultImageAnimated = new Animated.Value(0);
//   const ImageAnimated = new Animated.Value(0);

//   const handleDefaultImageLoad = () => {
//     Animated.timing(defaultImageAnimated, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };
//   const handleImageLoad = () => {
//     Animated.timing(ImageAnimated, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };

//   // trial
//   const [loading, setLoading] = useState(true);

//   return (
//     <View style={styles.container}>

//       {/* trial */}
//       <Animated.Image
//       {...props}
//       source={defaultImageSource}
//       style={[style,{opacity: defaultImageAnimated}]}
//       onLoad={handleDefaultImageLoad}
//       blurRadius={1}
      
      
//       />
//       {loading && <ActivityIndicator style={styles.imageOverlay} size="large" color="blue" />}
//        <Animated.Image
//         {...props}
//         source={source}
//         style={[style, {opacity:ImageAnimated}, styles.imageOverlay]}
//         onLoad={ handleImageLoad }
//         // blurRadius={1}
//          // trial
//          onLoadStart={() => setLoading(true)}
//          onLoadEnd={() => setLoading(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     container:{
//         // backgroundColor:'#028704',
//         // width: width,
//     // height: 315,
//     // alignItems: "center",
//     },
//     imageOverlay:{
//         position:'absolute',
//         top:0,
//         bottom:0,
//         left:0,
//         right:0,
//         opacity:1
//     },

// });

import { StyleSheet, View, Animated, ActivityIndicator } from "react-native";
import React, { useState, useRef } from "react";

export default function ImageLoader({
  defaultImageSource,
  source,
  style,
  defaultBlurRadius = 1,
  ...props
}) {
  const defaultImageAnimated = useRef(new Animated.Value(0)).current;
  const imageAnimated = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);

  const handleDefaultImageLoad = () => {
    Animated.timing(defaultImageAnimated, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        {...props}
        source={defaultImageSource}
        style={[style, { opacity: defaultImageAnimated }]}
        onLoad={handleDefaultImageLoad}
        blurRadius={defaultBlurRadius}
      />
      {loading && (
        <ActivityIndicator style={styles.imageOverlay} size="large" color="blue" />
      )}
      <Animated.Image
        {...props}
        source={source}
        style={[style, styles.imageOverlay, { opacity: imageAnimated }]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onLoad={handleImageLoad}
        onError={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});


