// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React, { useState } from "react";
// import { FontAwesome } from "@expo/vector-icons";
// import { TextInput } from "react-native";
// // import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
// import AutoGrowTextInput from "../scr/Posts/AutoGrowTextInput";
// import { addComment, addReply } from "../Api/post";
// import { useLogin } from "../Api/UserContext";
// // import ToastMessage from "../src/ToastMessage";
// import ToastMessage from "../scr/ToastMessage";

// export default function SendBox({
//   author,
//   postId,
//   height,
//   width,
//   placeholder,
//   commentId,
// }) {
//   const [input, setInput] = useState("");
//   const Input = (newText, event) => {
//     setInput(newText);
//   };

//   // Toast message
//   const [toast, setToast] = useState(false);
//   const [message, setMessage] = useState("");

//   // console.log('author =>',commentId)
//   // console.log("postId =>",postId)
//   const onPress = async () => {
//     const userdata = {
//       postId,
//       author,
//       comment: input,
//     };

//     const reply = {
//       reply: input,
//       commentId: commentId,
//       author,
//     };
//     if (placeholder !== "reply") {
//       try {
//         const response = await addComment(userdata);

//         if (response.data.status === "ok") {
//           setToast(true);
//           setMessage("comment added");
//         } else {
//           setToast(true);
//           setMessage(JSON.stringify(response.data));
//           // Alert.alert(JSON.stringify(response.data));
//         }
//       } catch (error) {
//         setToast(true);
//         setMessage({ error });
//         console.log({ error });
//       }
//     } else {
//       await addReply(reply);
//     }
//     console.log(input);
//     setInput("");
//   };
//   return (
//     <View style={styles.container}>
//       <AutoGrowTextInput
//         value={input}
//         onChangeText={Input}
//         style={[
//           styles.textBar,
//           {
//             width: placeholder == "reply" ? 200 : 266,
//             height: placeholder == "reply" ? 30 : 40,
//           },
//         ]}
//         placeholder={placeholder}
//       >
//         {/* <Text style={{marginLeft:16, fontSize:15, color:'#aaa'}}>Add comment ...</Text> */}
//       </AutoGrowTextInput>

//       <TouchableOpacity
//         onPress={onPress}
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <View style={styles.sendCirlce}></View>
//         <FontAwesome
//           name="send"
//           size={22}
//           color={"#fff"}
//           style={{ position: "absolute" }}
//         />
//       </TouchableOpacity>

//       <View style={{ alignItems: "center", justifyContent: "center",right:180 }}>
//         {toast && (
//           <ToastMessage
//             setToast={setToast}
//             // message={"Account created successfully!"}
//             message={message}
//           />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // flex:1,
//     flexDirection: "row",
//     columnGap: 8,
//     marginBottom: 16,
//     marginTop: 16,
//     // alignItems:'center'
//   },
//   textBar: {
//     // width: 266,
//     // height: 40,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#028704",
//     // alignItems:'center',
//     justifyContent: "center",
//     fontSize: 15,
//     paddingHorizontal: 16,
//   },
//   sendCirlce: {
//     display: "flex",
//     // alignItems:'center',
//     // alignSelf:'center',
//     // justifyContent:'center',
//     width: 40,
//     height: 40,
//     borderRadius: 50,
//     backgroundColor: "#028704",
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AutoGrowTextInput from "../scr/Posts/AutoGrowTextInput";
import { addComment, addReply } from "../Api/post";
import ToastMessage from "../scr/ToastMessage";
import { ScrollView } from "react-native-gesture-handler";

export default function SendBox({
  author,
  postId,
  height,
  width,
  placeholder,
  commentId,
}) {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const handleInputChange = (newText) => {
    setInput(newText);
  };

  const onPress = async () => {
    setVisible(true);
    if (!input.trim()) {
      setToast(true);
      setMessage("Please enter a comment");
      return;
    }

    const userdata = {
      postId,
      author,
      comment: input,
    };

    const reply = {
      reply: input,
      commentId: commentId,
      author,
    };

    try {
      // setVisible(true)
      let response;
      if (placeholder !== "reply") {
        response = await addComment(userdata);
        if (response.data.status === "ok") {
          setVisible(false);
          setToast(true);
          setMessage("Comment added");
        } else {
          setVisible(false);
          setToast(true);
          setMessage(JSON.stringify(response.data));
        }
      } else {
        response = await addReply(reply);
        if (response.data.status === "ok") {
          setVisible(false);
          setToast(true);
          setMessage("Reply added");
        } else {
          setVisible(false);
          setToast(true);
          setMessage(JSON.stringify(response.data));
        }
      }
    } catch (error) {
      setVisible(false);
      setToast(true);
      setMessage(error.message || "Something went wrong");
      console.log({ error });
    }

    setInput("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <AutoGrowTextInput
          value={input}
          onChangeText={handleInputChange}
          style={[
            styles.textBar,
            {
              width: placeholder === "reply" ? 200 : 266,
            },
          ]}
          placeholder={placeholder}
        />

        {visible ? (
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size={24} color={"#1989b9"} />
          </View>
        ) : (
          <TouchableOpacity onPress={onPress} style={styles.sendButton}>
            <View style={styles.sendCircle}></View>
            <FontAwesome
              name="send"
              size={22}
              color={"#fff"}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        )}

        {toast && (
          <View style={styles.toastContainer}>
            <ToastMessage setToast={setToast} message={message} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    padding: 6,
    // width: 308,
    // backgroundColor: "#028704",
    height: 40,

    alignItems: "center",
    borderRadius: 6,
  },
  container: {
    position: "relative",
    flexDirection: "row",
    columnGap: 8,
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 10,
    alignItems: "flex-end",
  },
  textBar: {
    // flex:1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#028704",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendCircle: {
    display: "flex",
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#028704",
  },
  sendIcon: {
    position: "absolute",
  },
  toastContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
