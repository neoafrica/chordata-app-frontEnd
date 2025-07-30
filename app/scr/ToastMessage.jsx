import { StyleSheet, Text, View, Animated } from 'react-native'
import React,{useRef, useEffect} from 'react'

export default function ToastMessage({setToast, message}) {
    const bottom= useRef(new Animated.Value(-80)).current
    const opacity= useRef(new Animated.Value(1)).current

    const Animate =()=>{
        Animated.timing(bottom, {
            toValue:(20),
            duration:1000,
            useNativeDriver:false
        }).start(()=>{
            Animated.timing(opacity,{
                toValue:0,
                duration: 2000,
                useNativeDriver: false
            }).start(()=>{
                setToast(false)
            })
        })
    }

    useEffect(()=>{
        Animate()
    },[])
  return (
    <Animated.View  style={[styles.container,{opacity, bottom}]}>
        <View>

      <Text style={{color:'#fff', fontSize:14, textAlign:'center'}}>{message}</Text>
        </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#1989b9',
        paddingHorizontal:20,
        paddingVertical:10,
        position:'absolute',
        bottom:20,
        borderRadius:5
    }
})

// import { StyleSheet, Text, View, Animated } from 'react-native';
// import React, { useRef, useEffect } from 'react';

// export default function ToastMessage({ setToast, message }) {
//   const translateY = useRef(new Animated.Value(100)).current;
//   const opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(translateY, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true, // ✅ Safe with transform
//       }),
//       Animated.timing(opacity, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true, // ✅ Safe with opacity
//       }),
//     ]).start(() => {
//       setTimeout(() => {
//         Animated.timing(opacity, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }).start(() => setToast(false));
//       }, 2000);
//     });
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         {
//           transform: [{ translateY }],
//           opacity,
//         },
//       ]}
//     >
//       <Text style={styles.text}>{message}</Text>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: '#1989b9',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1000,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });
