import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Modal } from "react-native";
import AutoGrowTextInput from "./AutoGrowTextInput";
import { useNavigation } from "@react-navigation/native";
import MyBackButton from "../MyBackButton";
import { createCase } from "../../Api/post";
import { useLogin } from "../../Api/UserContext";
import ToastMessage from "../ToastMessage";
import CustomButton from "../../pages/CustomButton";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TextInput = ({
  Name,
  value,
  onChangeText,
  placeholder,
  minHeight = 40,
  setFieldValue,
}) => {
  const [visible, setVisible] = useState(false);

  const isManagementCategory = Name === "Management category";
  const isTypeOfAnimal = Name === "Type of animal";
  const isDropdown = isManagementCategory || isTypeOfAnimal;

  const options = isManagementCategory
    ? [
        "Animal feeds",
        "Animal breeds",
        "Parasite control",
        "Animal housing",
        "Growth management",
      ]
    : isTypeOfAnimal
    ? ["poultry", "cow", "cat", "dog", "goat", "sheep"]
    : [];

  const toggleOverlay = () => setVisible(!visible);

  const handleSelect = (item) => {
    saveFormData({ ...value, typeOfAnimal: item });
    if (setFieldValue) {
      const fieldName = isManagementCategory ? "managementCategory" : "typeOfAnimal";
      setFieldValue(fieldName, item);
    }
    if (onChangeText) {
      onChangeText(item);
    }
    toggleOverlay();
  };

  // const handleSelect = (item) => {
  //   setFieldValue("typeOfAnimal", item);
  //   saveFormData({ ...value, typeOfAnimal: item });
  //   setVisible(false);
  // };

  return (
    <View style={styles.Textcontainer}>
      <Text style={styles.label}>{Name}:</Text>

      <View style={styles.inputWrapper}>
        <AutoGrowTextInput
          editable={!isDropdown}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          minHeight={minHeight}
          style={styles.autoInput}
        />

        {isDropdown && (
          <TouchableOpacity
            onPress={toggleOverlay}
            style={styles.dropdownButton}
          >
            <Ionicons name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {isDropdown && (
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={toggleOverlay}
        >
          <TouchableWithoutFeedback onPress={toggleOverlay}>
            {/* <View style={styles.modalBackdrop}> */}
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  {options.map((item, index) => (
                    <TouchableOpacity key={item} onPress={() => handleSelect(item)}>
                      <Text
                        style={[
                          styles.textModal,
                          index === options.length - 1 && { paddingBottom: 32 },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            {/* </View> */}
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

const FORM_KEY = "management_form_data";

const saveFormData = async (data) => {
  try {
    await AsyncStorage.setItem(FORM_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save form data", e);
  }
};

const loadFormData = async () => {
  try {
    const saved = await AsyncStorage.getItem(FORM_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error("Failed to load form data", e);
    return null;
  }
};

const clearFormData = async () => {
  try {
    await AsyncStorage.removeItem(FORM_KEY);
  } catch (e) {
    console.error("Failed to clear form data", e);
  }
};



export default function ManagementPost({ navigation }) {
  const route = useRoute();
  const nav = useNavigation();

  // const [sexOfAnimal, setSexOfAnimal] = useState("");
  // const [ageOfAnimal, setAgeOfAnimal] = useState("");
  // const [caseTitle, setCaseTitle] = useState("");
  // const [typeOfAnimal, setTypeOfAnimal] = useState("");
  // const [managementCategory, setManagementCategory] = useState("");
  // const [description, setDescription] = useState("");
  const { userData, getToken } = useLogin();

  const [pickingImage, setPickingImage] = useState(false);

   // first 
  
    const [initialValues, setInitialValues] = useState({
      author: userData?._id,
      category: route.params.placeholder,
      sexOfAnimal: "",
      ageOfAnimal: "",
      caseTitle: "",
      typeOfAnimal: "",
      managementCategory: "",
      description: "",
    });
  
    // Second
  
    useEffect(() => {
      const restoreForm = async () => {
        const saved = await loadFormData();
        if (saved) {
          setInitialValues({ ...initialValues, ...saved });
        }
      };
      restoreForm();
    }, []);

  //Toast Message

  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const [caseImage, setImage] = useState([]);
  const [link, setLink] = useState([]);
  const [visible, setVisible] = useState(true);
  



  const onSubmitMethod = async (values, resetForm) => {
    setVisible(false);
    const formData = new FormData();

    // Append form fields
    Object.entries(values).forEach(([key, val]) => {
      // Skip caseImage for now, we add it separately
      if (key !== "caseImage") {
        formData.append(key, val);
      }
    });

    // Append images
    caseImage.forEach((img, index) => {
      formData.append("caseImage", {
        uri: img.uri,
        name: img.fileName || `image_${index}.jpg`,
        type: img.mimeType || "image/jpeg" || "image/jpg",
      });
    });

    try {
    

      const response = await createCase(formData);

      if (response.data.status === "ok") {
        resetForm();
        await clearFormData(); // Add this line
        setImage([]);
        setToast(true);
        setMessage("Case submitted successfully!");
      } else {
        setToast(true);
        setMessage(JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast(true);
      setMessage("Submission failed.");
    } finally {
      setVisible(true);
    }
  };


  useEffect(() => {
    setVisible(true);
  }, [link]);


  const pickImage = async () => {
    const remainingSlots = 5 - caseImage.length;
    if (remainingSlots <= 0) {
      alert("You can only select up to 5 images.");
      return;
    }
    setPickingImage(true); // Start loading

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaType.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAssets = result.assets.slice(0, remainingSlots);

        const dimensionCheckPromises = selectedAssets.map((asset) => {
          return new Promise((resolve) => {
            Image.getSize(
              asset.uri,
              (width, height) => {
                resolve({ ...asset, width, height });
              },
              (error) => {
                console.error("Failed to get image dimensions", error);
                resolve(null);
              }
            );
          });
        });

        const dimensionCheckedAssets = await Promise.all(
          dimensionCheckPromises
        );

        const validImages = dimensionCheckedAssets.filter(
          (img) =>
            img &&
            // img.width >= 800 &&
            // img.height >= 600 &&
            img.width <= 3840 &&
            img.height <= 2160
        );

        // const droppedDueToLowRes = dimensionCheckedAssets.filter(
        //   (img) => img && (img.width < 800 || img.height < 600)
        // ).length;

        const droppedDueToHighRes = dimensionCheckedAssets.filter(
          (img) => img && (img.width > 3840 || img.height > 2160)
        ).length;

        // if (droppedDueToLowRes > 0) {
        //   alert(
        //     `${droppedDueToLowRes} image(s) were dropped for being too small (min 800x600).`
        //   );
        // }

        if (droppedDueToHighRes > 0) {
          alert(
            `${droppedDueToHighRes} image(s) were dropped for being too large (max 3840x2160).`
          );
        }

        setImage((prev) => [...prev, ...validImages]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    } finally {
      setPickingImage(false); // End loading
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <NetworkStatusBanner/>
      <View style={[{ marginLeft: 20, marginTop: 10 }]}>
        <MyBackButton onPress={nav.goBack} />
      </View>
      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        <View style={styles.formikContainer}>
          <Formik initialValues={initialValues} enableReinitialize
            // initialValues={{
            //   author: userData?._id,
            //   category: route.params.placeholder,
            //   sexOfAnimal: "",
            //   ageOfAnimal: "",
            //   caseTitle: "",
            //   typeOfAnimal: "",
            //   managementCategory: "",
            //   description: "",
              
            // }}
            onSubmit={(value, { resetForm }) =>
              onSubmitMethod(value, resetForm)
            } //values is an object with age, sex, Type of animal, caseHistory
          >
            {({ handleChange, handleSubmit, values, setFieldValue }) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <TextInput
                  Name={"Category"}
                  minHeight={35}
                  value={values.category}
                  onChangeText={handleChange("category")}
                  placeholder={route.params.placeholder}
                />

                <TextInput
                  Name={"Type of animal"}
                  minHeight={35}
                  value={values.typeOfAnimal}
                  onChangeText={handleChange("typeOfAnimal")}
                  placeholder={"Eg cow"}
                  setFieldValue={setFieldValue}
                />
                <TextInput
                  Name={"Sex of an animal"}
                  minHeight={35}
                  value={values.sexOfAnimal}
                  // onChangeText={handleChange("sexOfAnimal")}
                  onChangeText={(text) => {
                    handleChange("sexOfAnimal")(text);
                    saveFormData({ ...values, sexOfAnimal: text });
                  }}
                  
                />

                <TextInput
                  Name={"Age of an animal"}
                  minHeight={35}
                  value={values.ageOfAnimal}
                  // onChangeText={handleChange("ageOfAnimal")}
                  onChangeText={(text) => {
                    handleChange("ageOfAnimal")(text);
                    saveFormData({ ...values, ageOfAnimal: text });
                  }}
                  
                />
                <TextInput
                  Name={"Case Title"}
                  minHeight={65}
                  value={values.caseTitle}
                  // onChangeText={handleChange("caseTitle")}
                  onChangeText={(text) => {
                    handleChange("caseTitle")(text);
                    saveFormData({ ...values, caseTitle: text });
                  }}
                  
                />

                <TextInput
                  Name={"Management category"}
                  minHeight={35}
                  value={values.managementCategory}
                  // onChangeText={handleChange("managementCategory")}
                  onChangeText={(text) => {
                    handleChange("managementCategory")(text);
                    saveFormData({ ...values, managementCategory: text });
                  }}
                  setFieldValue={setFieldValue}
                />
                <TextInput
                  Name={"Descriptions"}
                  minHeight={140}
                  value={values.description}
                  // onChangeText={handleChange("description")}
                  onChangeText={(text) => {
                    handleChange("description")(text);
                    saveFormData({ ...values, description: text });
                  }}
                />

                <View style={{ right: 15 }}>
                  <Text style={{ paddingBottom: 10 }}>
                    Attachments (attach pictures if available)
                  </Text>
                </View>
                <ScrollView style={{ flex: 1 }} horizontal>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 8,
                      marginHorizontal: 32,
                      marginBottom: 16,
                    }}
                  >
                    {caseImage.length > 0 ? (
                      <View>

                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingHorizontal: 10 }}
                        >
                          {caseImage.map((item, index) => (
                            <TouchableOpacity
                              key={item.uri}
                              // onPress={() => replaceImage(index)}
                              onPress={pickImage}
                              style={{ position: "relative", marginRight: 8 }}
                            >
                              <Image
                                source={{ uri: item.uri }}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 10,
                                }}
                              />
                              <TouchableOpacity
                                style={{
                                  position: "absolute",
                                  top: -2,
                                  right: -6,
                                  backgroundColor: "#fff",
                                  borderRadius: 20,
                                  padding: 2,
                                }}
                                onPress={() =>
                                  setImage((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <AntDesign
                                  name="closecircle"
                                  size={20}
                                  color="red"
                                />
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    ) : (
                     
                      <TouchableOpacity
                        onPress={pickImage}
                        style={styles.Attachments}
                      >
                        {pickingImage ? (
                          <ActivityIndicator size={32} color={"#028709"} />
                        ) : (
                          <AntDesign name="picture" size={32} color={"#Aaa"} />
                        )}
                      </TouchableOpacity>
                    )}

                 
                  </View>
                </ScrollView>
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
                <View style={{ alignItems: "center", width:"100%"}}>
            {toast && (
              <ToastMessage
                setToast={setToast}
                // message={"Account created successfully!"}
                message={message}
              />
            )}
          </View>
              </View>
            )}
          </Formik>
         
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  Textcontainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#676767",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingRight: 50, // space for dropdown icon
    backgroundColor: "#fff",
  },
  autoInput: {
    fontSize: 16,
    padding: 10,
    textAlignVertical: "top",
    width: 260,
  },
  dropdownButton: {
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: "100%",
    position: "absolute",
    right: 0,
    top: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  modalView: {
    position: "absolute",
    right: 40,
    bottom: 250,
    width: 180,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // modalView: {
  //   backgroundColor: "#fff",
  //   width: 300,
  //   borderRadius: 8,
  //   padding: 20,
  //   elevation: 5,
  // },
  textModal: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  ActivityIndicator: {
    padding: 6,
    width: 308,
    backgroundColor: "#028704",
    height: 40,

    alignItems: "center",
    borderRadius: 6,
  },
  formikContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  Attachments: {
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
    height: 110,
    width: 112,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(170,170,170,0.6)",
  },
  InputStyle: {
    // flex:1,
    borderWidth: 0.8,
    // borderColor: "rgba(131,204,48,0.3)",
    borderColor: "rgba(170,170,170,0.3)",
    fontSize: 18,
    paddingLeft: 10,
    // height: 45,
    width: "90%", // take full width of the Input container
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textModal: {
    paddingTop: 16,
    textAlign: "center",
    fontSize: 16,
    paddingBottom: 8,
    // fontWeight:500
  },
  modalView: {
    position: "absolute",
    right: 30,
    bottom: 200,
    width: 180,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
