// import { IconButton, Portal } from "react-native-paper";
// import { Dimensions, StyleSheet, Text, View, Animated, Pressable } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import { PanGestureHandler } from "react-native-gesture-handler";

// export default function BottomShit({ show, onDismiss,enableBackDropDismiss, children,comments }) {
//   const bottomSheetHeight = Dimensions.get("window").height * 0.7;
//   const deviceWidth = Dimensions.get("window").width;
//   const [open, setOpen] = useState(show);
//   const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current;

//   const onGesture= (event)=>{
//     if(event.nativeEvent.translationY > 0){
//         bottom.setValue(-event.nativeEvent.translationY)
//     }
//   }

//   const onGestureEnd= (event)=>{
//     if(event.nativeEvent.translationY > (bottomSheetHeight/2)){
//         onDismiss()
//     }
//     else{
//         bottom.setValue(0);
//     }
//   }

//   useEffect(() => {
//     if (show) {
//       setOpen(show);
//       Animated.timing(bottom, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     } else {
//       Animated.timing(bottom, {
//         toValue: -bottomSheetHeight,
//         duration: 500,
//         useNativeDriver: false,
//       }).start(() => {
//         setOpen(false);
//       });
//     }
//   }, [show]);
//   if (!open) {
//     return null;
//   }
//   return (
//     <Portal>

//         <Pressable onPress={enableBackDropDismiss ? onDismiss:undefined } style={styles.backDrop}/>
//       <Animated.View
//         style={[
//           styles.root,
//           {
//             height: bottomSheetHeight,
//             bottom: bottom,
//             shadowOffset: { height: -3 },
//           },
//           styles.common,
//         ]}
//       >
//         <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
//         <View
//           style={[
//             styles.header,
//             // styles.common,
//             { position: "relative", shadowOffset: { height: 3 } },
//           ]}
//         >
            
//           <View
//             style={{
//               width: 60,
//               height: 3,
//               borderRadius: 1.5,
//               position: "absolute",
//               top: 8,
//               left: (deviceWidth - 60) / 2,
//               zIndex: 10,
//               backgroundColor: "#ccc",
//             }}
//           />
//           <IconButton
//             iconColor="red"
//             icon={"close"}
//             style={styles.closeIcon}
//             onPress={
//               onDismiss
//             }
//           />
//         <Text style={{ paddingTop:10, top:10, fontSize:15, left:32}}>Comments <Text style={{fontWeight:'bold'}}>{comments}</Text></Text>
//         <View       //Line separator
//           style={{
//             backgroundColor: "rgba(25,137,185,0.3)",
//             height: 1,
//             width: 300,
//             marginTop: 20,
//             alignItems:'center',
//             // marginLeft:10,
//             left:30
//           }}
//         ></View>
//         </View>
//         </PanGestureHandler>
//         {children}
//       </Animated.View>
//     </Portal>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     // alignItems:'center',
//     position: "absolute",
//     left: 0,
//     right: 0,
//     zIndex: 100,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     overflow: "hidden",
//   },
//   header: {
//     height: 60,
//     // backgroundColor: "#1989b9",
//   },
//   common: {
//     shadowColor: "#000",
//     shadowOffset: {
//       //   height:-3,
//       width: 0,
//     },
//     shadowOpacity: 0.24,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   closeIcon: {
//     position: "absolute",
//     top: 0,
//     right: 20,
//     zIndex: 10,
//     // left:-10
//   },
//   backDrop:{
//     ...StyleSheet.absoluteFillObject,
//     zIndex:80,
//     backgroundColor:'rgba(0,0,0,0.5)'
//   },
//   lineSeparator:{       //Line separator
          
//     backgroundColor: "#aaaaaa",
//     height: 0.5,
//     width: 300,
//     marginTop: 20,
       
//   }
// });


import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { IconButton, Portal } from "react-native-paper";

export default function BottomShit({
  show,
  onDismiss,
  enableBackDropDismiss,
  children,
  comments,
}) {
  const bottomSheetHeight = Dimensions.get("window").height * 0.7;
  const deviceWidth = Dimensions.get("window").width;

  const [open, setOpen] = useState(show);
  const translateY = useRef(new Animated.Value(bottomSheetHeight)).current;

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );
  
  const handleGestureEnd = (event) => {
    const translationY = event.nativeEvent.translationY;
    if (translationY > bottomSheetHeight / 3) {
      Animated.timing(translateY, {
        toValue: bottomSheetHeight,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setOpen(false);
        onDismiss?.();
      });
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };
  

  // const handleGestureEnd = (event) => {
  //   const translationY = event.nativeEvent.translationY;
  //   if (translationY > bottomSheetHeight / 3) {
  //     Animated.timing(translateY, {
  //       toValue: bottomSheetHeight,
  //       duration: 300,
  //       useNativeDriver: false,
  //     }).start(() => {
  //       setOpen(false);
  //       onDismiss?.();
  //     });
  //   } else {
  //     Animated.timing(translateY, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: false,
  //     }).start();
  //   }
  // };

  useEffect(() => {
    if (show) {
      setOpen(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: bottomSheetHeight,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setOpen(false);
      });
    }
  }, [show]);

  if (!open) return null;

  return (
   
    <Portal>

      <Pressable
        onPress={enableBackDropDismiss ? onDismiss : undefined}
        style={styles.backDrop}
      />
      <Animated.View
        style={[
          styles.root,
          {
            height: bottomSheetHeight,
            transform: [{ translateY }],
          },
        ]}
      >
        <PanGestureHandler
          onGestureEvent={handleGesture}
          onEnded={handleGestureEnd}
        >
          <View style={[styles.header, { position: "relative" }]}>
            <View
              style={{
                width: 60,
                height: 3,
                borderRadius: 1.5,
                position: "absolute",
                top: 8,
                left: (deviceWidth - 60) / 2,
                zIndex: 10,
                backgroundColor: "#ccc",
              }}
            />
            <IconButton
              iconColor="red"
              icon={"close"}
              style={styles.closeIcon}
              onPress={onDismiss}
            />
            <Text style={styles.commentText}>
              Comments <Text style={{ fontWeight: "bold" }}>{comments}</Text>
            </Text>
            <View style={styles.separator} />
          </View>
        </PanGestureHandler>
        {/* {children}
         */}
         <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 280}
        >
          {/* Let children be FlatList or whatever is needed */}
          {children}
        </KeyboardAvoidingView>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    height: 60,
    paddingTop: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 20,
    zIndex: 10,
  },
  commentText: {
    paddingTop: 10,
    fontSize: 15,
    left: 32,
    top: 10,
  },
  separator: {
    backgroundColor: "rgba(25,137,185,0.3)",
    height: 1,
    width: 300,
    marginTop: 20,
    alignSelf: "center",
  },
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 80,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});


// import React, { useEffect, useState } from "react";
// import { Dimensions, StyleSheet, Text, View, Pressable } from "react-native";
// import { IconButton, Portal } from "react-native-paper";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSpring,
//   runOnJS,
// } from "react-native-reanimated";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";

// export default function BottomShit({ show, onDismiss, enableBackDropDismiss, children, comments }) {
//   const bottomSheetHeight = Dimensions.get("window").height * 0.75;
//   const deviceWidth = Dimensions.get("window").width;

//   const translateY = useSharedValue(bottomSheetHeight); // Start off-screen
//   const [open, setOpen] = useState(show);

//   useEffect(() => {
//     if (show) {
//       setOpen(true);
//       translateY.value = withTiming(0, { duration: 300 });
//     } else {
//       translateY.value = withTiming(bottomSheetHeight, { duration: 300 }, (finished) => {
//         if (finished) {
//           runOnJS(setOpen)(false);
//         }
//       });
//     }
//   }, [show]);

//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       if (event.translationY > 0) {
//         translateY.value = event.translationY;
//       }
//     })
//     .onEnd((event) => {
//       if (event.translationY > bottomSheetHeight / 2) {
//         runOnJS(onDismiss)();
//       } else {
//         translateY.value = withSpring(0);
//       }
//     });

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   if (!open) return null;

//   return (
//     <Portal>
//       <Pressable
//         onPress={enableBackDropDismiss ? onDismiss : undefined}
//         style={styles.backDrop}
//       />
//       <GestureDetector gesture={panGesture}>
//         <Animated.View
//           style={[
//             styles.root,
//             { height: bottomSheetHeight },
//             styles.common,
//             animatedStyle,
//           ]}
//         >
//           <View style={[styles.header]}>
//             <View style={[styles.dragHandle, { left: (deviceWidth - 60) / 2 }]} />
//             <IconButton iconColor="red" icon="close" style={styles.closeIcon} onPress={onDismiss} />
//             <Text style={styles.commentText}>
//               Comments <Text style={{ fontWeight: "bold" }}>{comments}</Text>
//             </Text>
//             <View style={styles.lineSeparator} />
//           </View>
//           {children}
//         </Animated.View>
//       </GestureDetector>
//     </Portal>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 100,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     overflow: "hidden",
//   },
//   header: {
//     height: 60,
//     justifyContent: "center",
//   },
//   dragHandle: {
//     width: 60,
//     height: 3,
//     borderRadius: 1.5,
//     position: "absolute",
//     top: 8,
//     zIndex: 10,
//     backgroundColor: "#ccc",
//   },
//   closeIcon: {
//     position: "absolute",
//     top: 0,
//     right: 20,
//     zIndex: 10,
//   },
//   commentText: {
//     paddingTop: 20,
//     paddingLeft: 32,
//     fontSize: 15,
//   },
//   lineSeparator: {
//     backgroundColor: "rgba(25,137,185,0.3)",
//     height: 1,
//     width: 300,
//     marginTop: 20,
//     alignSelf: "center",
//   },
//   common: {
//     shadowColor: "#000",
//     shadowOffset: { width: 0 },
//     shadowOpacity: 0.24,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   backDrop: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: 80,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
// });
