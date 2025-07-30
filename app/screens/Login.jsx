import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SponsorLogo } from "../assets/global";
// import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import AutoGrowTextInput from "../scr/Posts/AutoGrowTextInput";
// import CustomButton from "../Pages/CustomButton";
// import { LogIn } from "../Api/post";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogIn } from "../Api/post";
// import ToastMessage from "../src/ToastMessage";
import ToastMessage from "../scr/ToastMessage";


const TextInput = ({
  Name,
  minHeight,
  value,
  onChangeText,
  placeholder,
  alert,
}) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>{Name}</Text>
      </View>

      <View style={styles.InputStyle}>
        <AutoGrowTextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          minHeight={minHeight}
          style={{ width: 280, fontSize: 14, textAlignVertical: "top" }}
          value={value}
        />
      </View>
      {/* {alert?<Text>Invalid email</Text>:null} */}
    </View>
  );
};
export default function Login({ navigation }) {
  const [visible, setVisible] = useState(true);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState('')
  const onSubmitMethod = async (value) => {
    // console.log(value)
    setVisible(false)
    try {
      const response = await LogIn(value);
      if (response.data.status === "ok") {
        setVisible(true);
        setToast(true)
        setMessage("login successfully!!")
        // Alert.alert("login successfully !!");
        AsyncStorage.setItem("token", response.data.data);
        AsyncStorage.setItem("isLogin", JSON.stringify(true));
        navigation.navigate("Home");
      } else {
        setVisible(true)
        setToast(true)
        setMessage(JSON.stringify(response.data.message))
        // Alert.alert(JSON.stringify(response.data));

      }
    } catch (error) {
      setVisible(true)
      setToast(true)
      setMessage(error.message || "Something went wrong!");
      console.log({ error });
    }
  };

  
  useEffect(() => {
    // setToast(true)
    // setVisible(true)
    setMessage('')
  }, []);

    useEffect(() => {
      const backAction = () => {
        navigation.goBack();
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, []);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
      >
        <View style={styles.imageContainer}>
          <Image source={SponsorLogo.img} style={styles.img} />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          Login
        </Text>
        <Text style={{ fontSize: 14, color: "#676767" }}>
          Use proper information to continue
        </Text>

        <View style={styles.formikContainer}>
          <Formik
            initialValues={{
              username: "",
              //   email: "",
              password: "",
            }}
            onSubmit={(value) => onSubmitMethod(value)} //values is an object with age, sex, Type of animal, caseHistory
          >
            {({ handleChange, handleSubmit, values }) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <TextInput
                  Name={"Full name"}
                  minHeight={45}
                  value={values.username}
                  onChangeText={(text)=>handleChange("username")(text.trimStart())}
                  // onChangeText={handleChange('fullName')}
                  //   placeholder={route.params.placeholder}
                />

                <TextInput
                  Name={"Password"}
                  minHeight={45}
                  value={values.password}
                  //   onChangeText={(e)=>{handleChange("password"),setPassword(e.nativeEvent.Target)}}
                  onChangeText={handleChange("password")}
                  //   placeholder={"Eg cow"}
                />

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text
                    style={{
                      position: "relative",
                      color: "#1989b9",
                      fontSize: 14,
                      alignSelf: "flex-end",
                      marginRight: 24,
                      marginBottom: 20,
                      // left:80
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {visible ? (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!(values.username && values.password)}
                    style={[
                      styles.button,
                      {
                        backgroundColor:
                          values.username && values.password
                            ? "#027804"
                            : "#fff",
                        borderWidth: values.username && values.password ? 0 : 1,
                        borderColor:
                          values.username && values.password ? null : "#aaa",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          values.username && values.password ? "#fff" : "#000",
                      }}
                    >
                      Submit
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.ActivityIndicator}>
                    <ActivityIndicator size={32} color={"#fff"} />
                  </View>
                )}
              </View>
            )}
          </Formik>
          
        </View>
        <View
          style={{
            position: "absolute",
            bottom: -50,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 6,
          }}
        >
          <Text style={{ color: "#676767" }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("sign up")}>
            <Text style={{ fontSize: 16, fontWeight: 600, color: "#1989b9" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            {toast && (
              <ToastMessage
                setToast={setToast}
                // message={"Account created successfully!"}
                message={message}
              />
            )}
          </View>
      </ScrollView>
    </View>
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
  button: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 300,
    height: 45,
    borderRadius: 5,
    // backgroundColor:'#028704'
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  img: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  formikContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  InputStyle: {
    // flex:1,
    borderWidth: 0.8,
    // borderColor: "rgba(131,204,48,0.3)",
    borderColor: "rgba(170,170,170,0.8)",
    fontSize: 18,
    paddingLeft: 10,
    // height: 45,
    width: "90%", // take full width of the Input container
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
