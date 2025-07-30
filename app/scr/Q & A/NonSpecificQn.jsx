import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
// import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import AutoGrowTextInput from "../Posts/AutoGrowTextInput";
// import MyBackButton from "../../Pages/MyBackButton";
import MyBackButton from "../MyBackButton";
// import CustomButton from "../../Pages/CustomButton";
import CustomButton from "../../pages/CustomButton";
import { useLogin } from "../../Api/UserContext";
import { questions } from "../../Api/post";
import ToastMessage from "../ToastMessage";
import { useEffect } from "react";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

export default function NonSpecificQn({ navigation }) {
  const [input, setInput] = useState("");
  const { userData, getToken } = useLogin();

  // Toast Message

  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const [visible, setVisible] = useState(true);

  const [bodyColor, setBodyColor] = useState("#aaa");
  const OnFocusBody = () => {
    setBodyColor("#1989b9");
  };

  const OnBlurBody = () => {
    setBodyColor("#aaa");
  };

  const Input = (newText, event) => {
    setInput(newText);
  };
  const onPress = async () => {
    // setToast(true)
    setVisible(false)
    const userdata = {
      Qn: input,
      author: userData._id,
    };

    try {
      const response = await questions(userdata);
      if (response.data.status == "ok") {
        setVisible(true)
        setToast(true);
        setMessage("Question submitted successfully!");
        // alert("Question submitted successfully!");
        console.log(input);
        setInput("");
      }
    } catch (error) {
      setVisible(true)
      setToast(true);
      setMessage(error);
    }
  };

  // useEffect(() => {
  //   setToast(true);
  // }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner/>
      <View style={[{ marginLeft: 20, marginTop: 10 }]}>
        <MyBackButton onPress={navigation.goBack} />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Ask any Question related to animals.</Text>

        <AutoGrowTextInput
          onFocus={OnFocusBody}
          onBlur={OnBlurBody}
          value={input}
          onChangeText={Input}
          minHeight={209}
          style={[styles.inputText, { borderColor: bodyColor }]}
        />

        {visible ? (
          <CustomButton placeholder={"Submit"} onPress={onPress} />
        ) : (
          <View style={styles.ActivityIndicator}>
            <ActivityIndicator size={32} color={"#fff"} />
          </View>
        )}
        <View style={{ alignItems: "center", width: "100%" }}>
          {toast && (
            <ToastMessage
              setToast={setToast}
              // message={"Account created successfully!"}
              message={message}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ActivityIndicator: {
    padding: 6,
    width: 308,
    backgroundColor: "#028704",
    height: 40,

    alignItems: "center",
    borderRadius: 6,
  },
  text: {
    margin: 24,
    fontSize: 20,
    fontWeight: 600,
  },
  container: {
    // justifyContent:"center",
    marginHorizontal: 16,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
    paddingLeft: 12,
    textAlignVertical: "top",
    width: 299,
    borderRadius: 10,
    // borderColor: "#aaa",
    borderWidth: 1,
    marginBottom: 24,
  },
});
