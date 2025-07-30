import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler
} from "react-native";
import React, { useEffect, useState } from "react";
import { img } from "../assets/global";
// import InputField from "./InputField";
import InputField from "../pages/InputField";
// import CustomButton from "./CustomButton";
import CustomButton from "../pages/CustomButton";
import { Formik } from "formik";
// import MyBackButton from "./MyBackButton";
import MyBackButton from "../scr/MyBackButton";
import { Ionicons, Fontisto } from "@expo/vector-icons";
// import { AutoGrowingTextInput } from "react-native-autogrow-textinput";
import AutoGrowTextInput from "../scr/Posts/AutoGrowTextInput";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";
// import { updateProfile } from "../Api/post";
import { updateProfile } from "../Api/post";
// import { useLogin } from "../Api/UserContext";
import { useLogin } from "../Api/UserContext";
import ToastMessage from "../scr/ToastMessage";
// import ToastMessage from "../src/ToastMessage";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";

const TextInput = ({
  Name,
  minHeight,
  value,
  onChangeText,
  placeholder,
  iconName,
  defaultValue,
}) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>{Name}</Text>
      </View>

      <View style={styles.InputStyle}>
        {iconName == "pencil" ||
        iconName == "person-outline" ||
        iconName == "phone-portrait-outline" ? (
          <Ionicons name={iconName} size={20} color="#028704" />
        ) : (
          <Fontisto name={iconName} size={20} color="#028704" />
        )}

        {iconName ? (
          <View
            style={{
              height: 26,
              width: 1,
              backgroundColor: "rgba(170,170,170,0.5)",
              marginLeft: 8,
            }}
          ></View>
        ) : (
          <View></View>
        )}
        <AutoGrowTextInput
          // defaultValue={}
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

export default function EditProfile({ navigation }) {
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [caseImage, setImage] = useState(); // rev 1
  const [link, setLink] = useState();
  const [visible, setVisible] = useState(true);

  const [Bio, setBio]= useState('')

  const [profileImage, setProfileImage] = useState(); // rev 1

  //trial
  const [profilePic, setProfilePic] = useState();

  const { userData, getToken } = useLogin();

  const multipleImages = async (obj) => {
    const CLOUD_API_KEY = "379593744871259";
    const CLOUD_API_SECRET = "8ly2CNBUvQ9UdFRu_peuyidv_dc";
    const time_stamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(time_stamp, CLOUD_API_SECRET);

    console.log("cloud =>", obj);
    const formData = new FormData();

    formData.append("file", {
      uri: obj[0].uri,
      name: obj[0].fileName,
      type: obj[0].mimeType,
    });

    formData.append("api_key", CLOUD_API_KEY);
    formData.append("timestamp", time_stamp.toString());
    formData.append("signature", await signature);

    // console.log(formData);

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dvek8fc4e/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    //trials

    if (response.ok) {
      // setLink({url: data?.secure_url, id: data.public_id})
      console.log("data", data?.secure_url, data.public_id);
      return { secure_url: data?.secure_url, public_id: data.public_id };
    } else {
      console.log("error", data.error.message);
      return data.error.message;
    }
  };

  const uploadImageToCloudinary = async (obj) => {
    const links = await multipleImages(obj);
    return links;
  };

  const onSubmitMethod = async (value, resetForm, setFieldValue) => {
    setBio('')
    try {
      setVisible(false);
  
      if (caseImage?.length > 0) {
        try {
          const uploaded = await uploadImageToCloudinary(caseImage);
          value.profileImage = uploaded;
        } catch (uploadError) {
          setToast(true);
          setVisible(true);
          console.error(uploadError);
          return;
        }
      } else {
        delete value.profileImage;
      }
  
      // Remove empty fields
      Object.keys(value).forEach(
        (key) => (value[key] === "" || value[key] === null) && delete value[key]
      );
  
      const response = await updateProfile(value);
      // console.log(response.data)
  
      if (response.data.message === "success") {
        // console.log("success");
        setVisible(true)
        setToast(true);
        setMessage("profile updated successfully!")

           // 🔥 Reset fields except username
      // resetForm();
      // setFieldValue("username", userData.username); 
      resetForm({
        values: {
          email: "",
          phoneNumber: "",
          username: userData.username, // Keep username filled
          bio: "",
          profileImage: "",
          userId: userData?._id,
        },
      });
      }
      else {
        setVisible(true)
        setToast(true)
        // setMessage(JSON.stringify(response.data.error))
        setMessage("error updating profile")
        // Alert.alert(JSON.stringify(response.data));

      }
  
    } catch (error) {
      console.log({ error });
    }
  };
  
  useEffect(() => {
    // setToast(true)
    setVisible(true);
  }, [link]);

  async function generateSignature(timestamp, CLOUD_API_SECRET) {
    const signatureString = `timestamp=${timestamp}${CLOUD_API_SECRET}`;
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      signatureString
    );
    return digest;
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      // allowsEditing: true,
      aspect: [4, 8],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      //   setImage(result.assets[0].uri);
      setImage(result.assets);
    }
  };

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
  
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
        <NetworkStatusBanner/>
        <View style={{ marginLeft: 20, marginTop: 20 }}>
          <MyBackButton onPress={navigation.goBack} />
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {caseImage || userData?.profileImage?.secure_url ? (
              <Image
                source={{
                  uri: caseImage?.[0]?.uri || userData?.profileImage?.secure_url

                  // uri: userData?.profileImage?.secure_url
                  //   ? userData?.profileImage?.secure_url
                  //   : caseImage[0].uri,
                }}
                style={styles.img}
              />
            ) : (
              <Image source={img.user[1]} style={styles.img} />
            )}
            <TouchableOpacity
              onPress={() => pickImage()}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 40,
                height: 40,
                borderRadius: 50,
                backgroundColor: "#028704",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="camera" size={24} color={"#fff"} />
            </TouchableOpacity>
          </View>

          <View style={styles.formikContainer}>
            <Formik
            enableReinitialize={true} // 🛠️ add this
              initialValues={{
                email: "",
                phoneNumber: "",
                username: userData.username,
                bio: Bio,
                profileImage: "",
                userId: userData?._id,
              }}
              onSubmit={(values, { resetForm, setFieldValue }) => onSubmitMethod(values, resetForm,setFieldValue)} //values is an object with email, password, name
            >
              {({ handleChange, handleSubmit, values }) => (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TextInput
                    Name={"Full name"}
                    value={userData.username}
                    onChangeText={handleChange("username")}
                    iconName={"person-outline"}
                  />

                  <TextInput
                    Name={"Email"}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    iconName={"email"}
                  />

                  <TextInput
                    Name={"Phone number"}
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    iconName={"phone-portrait-outline"}
                  />

                  <TextInput
                    Name={"About me"}
                    value={values.bio}
                    onChangeText={handleChange("bio")}
                    iconName={"pencil"}
                  />
                  {visible ? (
                    <CustomButton
                      placeholder="submit"
                      onPress={async () => {
                        // setVisible(true)
                        handleSubmit();
                      }}
                    />
                  ) : (
                    <View style={styles.ActivityIndicator}>
                      <ActivityIndicator size={32} color={"#fff"} />
                    </View>
                  )}
                  {/* <Button onPress={handleSubmit} title="submit" color="purple" /> */}
                </View>
              )}
            </Formik>
          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {toast && (
            <ToastMessage
              setToast={setToast}
              message={message}
            />
          )}
        </View>
      </ScrollView>
  
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
  editProfile: {
    fontSize: 20,
    marginBottom: 24,
    fontWeight: 500,
    color: "#028704",
  },
  container: {
    marginHorizontal: 16,
    // flexDirection:'column',
    alignItems: "center",
    bottom: 20,
  },
  imgContainer: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  img: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 100,
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
    borderColor: "rgba(170,170,170,0.5)",
    fontSize: 18,
    paddingLeft: 10,
    // height: 45,
    width: 300, // take full width of the Input container
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
