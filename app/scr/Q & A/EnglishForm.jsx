import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Formik } from "formik";
// import InputField from "../../Pages/InputField";
import InputField from "../../pages/InputField";
// import CustomButton from "../../Pages/CustomButton";
import CustomButton from "../../pages/CustomButton";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLogin } from "../../Api/UserContext";
// import ToastMessage from "../ToastMessage";
import ToastMessage from "../ToastMessage";
import { questions } from "../../Api/post";


export default function EnglishForm() {
  const [image, setImage] = useState([]);
  const [link, setLink] = useState([]);
  const [visible, setVisible] = useState(true);
  const { userData, getToken } = useLogin();
  // const context = useImageManipulator();

  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");

  const [pickingImage, setPickingImage] = useState(false);


  const pickImage = async () => {
    const remainingSlots = 5 - image.length;
    if (remainingSlots <= 0) {
      alert("You can only select up to 5 images.");
      return;
    }

    setPickingImage(true); // Start loading

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
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
          (img) => img && img.width <= 3840 && img.height <= 2160
        );

        const droppedDueToHighRes = dimensionCheckedAssets.filter(
          (img) => img && (img.width > 3840 || img.height > 2160)
        ).length;

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

  const onSubmitMethod = async (values, resetForm) => {
    setVisible(false);

    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (key !== "qnImage") {
        formData.append(key, val);
      }
    });

    image.forEach((img, index) => {
      formData.append("qnImage", {
        uri: img.uri,
        name: img.fileName || `image_${index}.jpg`,
        type: img.mimeType || "image/jpeg" || "image/jpg",
      });
    });

    try {

      const response = await questions(formData);
      if (response.data.status === "ok") {
        resetForm();
        setImage([]);
        setToast(true);
        setMessage("Question submitted successfully!");
      } else {
        setToast(true);
        setMessage("Something went wrong.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setToast(true);
      setMessage("Error submitting question.");
    } finally {
      setVisible(true);
    }
  };

  useEffect(() => {
    setVisible(true);
  }, [link]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
      <ScrollView style={{ flex: 1, marginBottom: 16 }}>
        <View style={styles.formikContainer}>
          <Formik
            initialValues={{
              ageOfAnimal: "",
              sexOfAnimal: "",
              typeOfAnimal: "",
              caseHistory: "",
              qnImage: [""],
              author: userData?._id,
            }}
            // onSubmit={async (value) => await onSubmitMethod(value)} //values is an object with age, sex, Type of animal, caseHistory
            onSubmit={(value, { resetForm }) =>
              onSubmitMethod(value, resetForm)
            }
          >
            {({ handleChange, handleSubmit, values }) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <InputField
                  placeholder="Eg. Cow"
                  onchangeFx={handleChange("typeOfAnimal")}
                  val={values.typeOfAnimal} //input yote itakuwa na value ya hapa
                  Inputname="Type of animal"
                />
                <InputField
                  // placeholder="Email"
                  onchangeFx={handleChange("ageOfAnimal")}
                  val={values.ageOfAnimal} //input yote itakuwa na value ya hapa
                  Inputname="Age of animal"
                />

                <InputField
                  // placeholder="Phone number"
                  onchangeFx={handleChange("sexOfAnimal")}
                  val={values.sexOfAnimal}
                  name="phone-portrait-outline"
                  Inputname="Sex of an animal"
                />

                <InputField
                  // placeholder="Confirm password"
                  onchangeFx={handleChange("caseHistory")}
                  val={values.caseHistory}
                  name="pencil"
                  Inputname="Briefy case history"
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
                    {image?.length > 0 ? (
                      <View>
                        {/* <FlatList
                          contentContainerStyle={{
                            flexDirection: "row",
                            columnGap: 8,
                          }}
                          data={image}
                          keyExtractor={(item) => item?.uri}
                          renderItem={({ item }) => (
                            <TouchableOpacity onPress={pickImage}>
                              <Image
                                source={{ uri: item.uri }}
                                style={styles.Attachments}
                              />
                            </TouchableOpacity>
                          )}
                        /> */}

                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ paddingHorizontal: 10 }}
                        >
                          {image.map((item, index) => (
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
              </View>
            )}
          </Formik>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {toast && (
              <ToastMessage
                setToast={setToast}
                // message={"Account created successfully!"}
                message={message}
              />
            )}
          </View>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formikContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
});
