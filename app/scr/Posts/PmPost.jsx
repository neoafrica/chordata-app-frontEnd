import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import AutoGrowTextInput from "./AutoGrowTextInput";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Modal } from "react-native";
import MyBackButton from "../MyBackButton";
import { createCase } from "../../Api/post";
import { useLogin } from "../../Api/UserContext";
import ToastMessage from "../ToastMessage";
import CustomButton from "../../pages/CustomButton";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

const TextInput = ({
  Name,
  minHeight = 40,
  value,
  onChangeText,
  placeholder,
  setFieldValue,
}) => {
  const [visible, setVisible] = useState(false);

  const isAnimalType = Name === "Type of animal";
  const animalOptions = ["poultry", "cow", "cat", "dog", "goat", "sheep"];

  // const handleSelect = (item) => {
  //   setFieldValue("typeOfAnimal", item);
  //   setVisible(false);
  // };

  // Four

  const handleSelect = (item) => {
    setFieldValue("typeOfAnimal", item);
    saveFormData({ ...value, typeOfAnimal: item });
    setVisible(false);
  };
  

  return (
    <View style={styles.Textcontainer}>
      <Text style={styles.label}>{Name}:</Text>

      <TouchableOpacity
        activeOpacity={isAnimalType ? 0.8 : 1}
        onPress={() => isAnimalType && setVisible(true)}
        style={styles.inputWrapper}
      >
        <AutoGrowTextInput
          editable={!isAnimalType}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          minHeight={minHeight}
        />
      </TouchableOpacity>

      {isAnimalType && (
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          
            <View style={styles.modalView}>
              {animalOptions.map((item, index) => (
                <TouchableOpacity key={item} onPress={() => handleSelect(item)}>
                  <Text
                    style={[
                      styles.textModal,
                      index === animalOptions.length - 1 && { paddingBottom: 32 },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          
        </Modal>
      )}
    </View>
  );
};


const FORM_KEY = "postmortem_form_data";

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


export default function PmPost({ navigation }) {
  const route = useRoute();
  const nav = useNavigation();
  const [caseImage, setImage] = useState([]);
  const [link, setLink] = useState([]);
  const [visible, setVisible] = useState(true);
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
    caseHistory: "",
    clinicalFindings: "",
    DifferentialDiagnosis: "",
    TentativeDiagnosis: "",
    recommendations: "",
    caseImage: [""],
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
  

  // Toast Message

  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");


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
        await clearFormData(); // Add this line
        resetForm();
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
            //   caseHistory: "",
            //   clinicalFindings: "",
            //   DifferentialDiagnosis: "",
            //   TentativeDiagnosis: "",
            //   recommendations: "",
            //   caseImage: [""],
            // }}
            // onSubmit={(value) => onSubmitMethod(value)} //values is an object with age, sex, Type of animal, caseHistory
            onSubmit={(value, { resetForm }) =>
              onSubmitMethod(value, resetForm)
            }
          >
            {({ handleChange, handleSubmit, values, setFieldValue }) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <TextInput
                  Name={"Category"}
                  minHeight={35}
                  value={route.params.placeholder}
                  onChangeText={handleChange("category")}
                  placeholder={route.params.placeholder}
                />
                <TextInput
                  Name={"Case Title"}
                  minHeight={65}
                  value={values.caseTitle}
                  // onChangeText={handleChange("caseTitle")}// Third

                  // onChangeText={(text) => {
                  //   handleChange("caseTitle")(text);
                  //   saveFormData({ ...values, caseTitle: text });
                  // }}

                  onChangeText={(text) => {
                    setFieldValue("caseTitle", text);
                    saveFormData({ ...values, caseTitle: text }); // This is still fine to persist
                  }}
                  
                  
                  
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
                  Name={"Briefy case history"}
                  minHeight={120}
                  value={values.caseHistory}
                  // onChangeText={handleChange("caseHistory")}
                  onChangeText={(text) => {
                    handleChange("caseHistory")(text);
                    saveFormData({ ...values, caseHistory: text });
                  }}
                  
                />

                <TextInput
                  Name={"Postmortem findings"}
                  minHeight={100}
                  value={values.clinicalFindings}
                  // onChangeText={handleChange("clinicalFindings")}
                  onChangeText={(text) => {
                    handleChange("clinicalFindings")(text);
                    saveFormData({ ...values, clinicalFindings: text });
                  }}
                />
                <TextInput
                  Name={"Differential diagnosis"}
                  minHeight={100}
                  value={values.DifferentialDiagnosis}
                  // onChangeText={handleChange("DifferentialDiagnosis")}
                  onChangeText={(text) => {
                    handleChange("DifferentialDiagnosis")(text);
                    saveFormData({ ...values, DifferentialDiagnosis: text });
                  }}
                />
                <TextInput
                  Name={"Tentative diagnosis"}
                  minHeight={100}
                  value={values.TentativeDiagnosis}
                  // onChangeText={handleChange("TentativeDiagnosis")}
                  onChangeText={(text) => {
                    handleChange("TentativeDiagnosis")(text);
                    saveFormData({ ...values, TentativeDiagnosis: text });
                  }}
                />
                <TextInput
                  Name={"Recommendation(s)"}
                  minHeight={100}
                  value={values.recommendations}
                  // onChangeText={handleChange("recommendations")}
                  onChangeText={(text) => {
                    handleChange("recommendations")(text);
                    saveFormData({ ...values, recommendations: text });
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

                {/* <Button onPress={handleSubmit} title="submit" color="purple" /> */}
                <View
                      style={{ alignItems: "center", width:"100%" }}
                    >
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

// const PmPost = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { userData } = useLogin();
//   const [visible, setVisible] = useState(false);
//   const [toast, setToast] = useState(false);
//   const [message, setMessage] = useState("");
//   const [initialValues, setInitialValues] = useState({
//     author: userData?._id,
//     category: route.params.placeholder,
//     sexOfAnimal: "",
//     ageOfAnimal: "",
//     caseTitle: "",
//     typeOfAnimal: "",
//     caseHistory: "",
//     clinicalFindings: "",
//     DifferentialDiagnosis: "",
//     TentativeDiagnosis: "",
//     recommendations: "",
//     caseImage: [""],
//   });

//   useEffect(() => {
//     const restoreForm = async () => {
//       const saved = await loadFormData();
//       if (saved) {
//         setInitialValues((prev) => ({ ...prev, ...saved }));
//       }
//     };
//     restoreForm();
//   }, []);

//   const handleSubmit = async (values, { resetForm }) => {
//     try {
//       const response = await postmortem(values);
//       if (response.data.status === "ok") {
//         await clearFormData();
//         resetForm();
//         setToast(true);
//         setMessage("Case submitted successfully!");
//         navigation.goBack();
//       } else {
//         setToast(true);
//         setMessage("Submission failed. Try again.");
//       }
//     } catch (error) {
//       setToast(true);
//       setMessage("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
//         {({ handleChange, handleSubmit, values, setFieldValue, resetForm }) => (
//           <>
//             <Text style={styles.heading}>Sex of Animal</Text>
//             <TextInput
//               style={styles.input}
//               value={values.sexOfAnimal}
//               onChangeText={(text) => {
//                 handleChange("sexOfAnimal")(text);
//                 saveFormData({ ...values, sexOfAnimal: text });
//               }}
//             />

//             <Text style={styles.heading}>Age of Animal</Text>
//             <TextInput
//               style={styles.input}
//               value={values.ageOfAnimal}
//               onChangeText={(text) => {
//                 handleChange("ageOfAnimal")(text);
//                 saveFormData({ ...values, ageOfAnimal: text });
//               }}
//             />

//             <Text style={styles.heading}>Case Title</Text>
//             <TextInput
//               style={styles.input}
//               value={values.caseTitle}
//               onChangeText={(text) => {
//                 handleChange("caseTitle")(text);
//                 saveFormData({ ...values, caseTitle: text });
//               }}
//             />

//             <Text style={styles.heading}>Type of Animal</Text>
//             <Pressable onPress={() => setVisible(true)} style={styles.dropdown}>
//               <Text>{values.typeOfAnimal || "Select Type of Animal"}</Text>
//             </Pressable>

//             <Text style={styles.heading}>Case History</Text>
//             <TextInput
//               style={styles.input}
//               multiline
//               value={values.caseHistory}
//               onChangeText={(text) => {
//                 handleChange("caseHistory")(text);
//                 saveFormData({ ...values, caseHistory: text });
//               }}
//             />

//             <Text style={styles.heading}>Clinical Findings</Text>
//             <TextInput
//               style={styles.input}
//               multiline
//               value={values.clinicalFindings}
//               onChangeText={(text) => {
//                 handleChange("clinicalFindings")(text);
//                 saveFormData({ ...values, clinicalFindings: text });
//               }}
//             />

//             <Text style={styles.heading}>Differential Diagnosis</Text>
//             <TextInput
//               style={styles.input}
//               multiline
//               value={values.DifferentialDiagnosis}
//               onChangeText={(text) => {
//                 handleChange("DifferentialDiagnosis")(text);
//                 saveFormData({ ...values, DifferentialDiagnosis: text });
//               }}
//             />

//             <Text style={styles.heading}>Tentative Diagnosis</Text>
//             <TextInput
//               style={styles.input}
//               multiline
//               value={values.TentativeDiagnosis}
//               onChangeText={(text) => {
//                 handleChange("TentativeDiagnosis")(text);
//                 saveFormData({ ...values, TentativeDiagnosis: text });
//               }}
//             />

//             <Text style={styles.heading}>Recommendations</Text>
//             <TextInput
//               style={styles.input}
//               multiline
//               value={values.recommendations}
//               onChangeText={(text) => {
//                 handleChange("recommendations")(text);
//                 saveFormData({ ...values, recommendations: text });
//               }}
//             />

//             <Pressable onPress={handleSubmit} style={styles.button}>
//               <Text style={styles.buttonText}>Submit</Text>
//             </Pressable>

//             {toast && <Text style={styles.toast}>{message}</Text>}

//             {/* Animal Type Modal */}
//             <Modal visible={visible} transparent animationType="slide">
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <Text style={styles.modalTitle}>Select Type of Animal</Text>
//                   <ScrollView>
//                     {animalType.map((item) => (
//                       <TouchableOpacity
//                         key={item}
//                         onPress={() => {
//                           setFieldValue("typeOfAnimal", item);
//                           saveFormData({ ...values, typeOfAnimal: item });
//                           setVisible(false);
//                         }}
//                         style={styles.modalOption}
//                       >
//                         <Text>{item}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                   <TouchableOpacity onPress={() => setVisible(false)} style={styles.modalCancel}>
//                     <Text style={styles.modalCancelText}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           </>
//         )}
//       </Formik>
//     </ScrollView>
//   );
// };

// export default PmPost;


const styles = StyleSheet.create({

  Textcontainer: {
    marginBottom: 8,
    // flex:1
    // width:50
  },
  label: {
    fontSize: 16,
    color: "#676767",
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  // modalView: {
  //   backgroundColor: "white",
  //   marginHorizontal: 20,
  //   borderRadius: 12,
  //   padding: 20,
  // },
  modalItem: {
    fontSize: 18,
    paddingVertical: 12,
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
