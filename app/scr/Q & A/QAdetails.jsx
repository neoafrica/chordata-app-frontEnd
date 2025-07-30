import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  SafeAreaView,
  FlatList,
  // ScrollView,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
// import ScrollDots from "../Pages/ScrollDots";
// import { img } from "../assets/global";
import { img } from "../../assets/global";
// import ImageLoader from "./ImageLoader";
import ImageLoader from "../ImageLoader";
// import Commenty from "../Pages/Comments";
import Commenty from "../../pages/Comments";
// import SendBox from "../../pages/SendBox";
import SendBox from "../../pages/SendBox";
import BottomShit from "../../pages/BottomShit";
import { Provider } from "react-native-paper";
// import { Feather } from "@expo/vector-icons";
// import MyBackButton from "../Pages/MyBackButton";
import MyBackButton from "../MyBackButton";
// import { useLogin } from "../Api/UserContext";
import { useLogin } from "../../Api/UserContext";
// import { getComments, deleteQuestion } from "../Api/post";
import { getComments, deleteQuestion } from "../../Api/post";
import { useFocusEffect } from "@react-navigation/native";
import dateFormat from "dateformat";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
// import { FormatText } from "../Pages/formatText";
import { FormatText } from "../../cases/formatText";
import { ScrollView } from "react-native-gesture-handler";
import NetworkStatusBanner from "../../Api/NetInfo/NetWorkStatusBanner";

const { height, width } = Dimensions.get("window"); // get window dimensions

// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function QAdetails({ navigation }) {
  const route = useRoute();
  const casesImages = route.params.caseImages;
  const caseDetails = route.params.casedetails;
  const replies = route.params.replies;
  const qn = route.params.details;
  const post_Id = route.params.postId;
  const authorId = route.params.AuthorId;
  const age = route.params.ageOfAnimal;
  const sex = route.params.sexOfAnimal;
  const typeOfAnimal = route.params.typeOfAnimal;

  // console.log(qn)

  // const [isLoadingComments, setIsLoadingComments] = useState(false);

  const { userData, getToken } = useLogin();

  const [visible, setVisible] = useState(false);
  const [deleteCaseIndicator, setIndicator] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [replys, setReplies] = useState();

  const [data, setData] = useState();

  const fetchPost = async (post_Id) => {
    // console.log("posts id", post_Id);
    const posts = await getComments(post_Id);

    setData(posts);
    // console.log("comments =>", posts);
  };

 

  useFocusEffect(() => {
    fetchPost(post_Id);
  });
  useEffect(() => {
    // fetchPost(post_Id);
  }, []);

  const [comments, setComments] = useState(false);

  const [Author, setAuthor] = useState(userData._id);
  const [postId, setPostId] = useState(post_Id);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; // Prevent default back behavior (which would normally navigate back)
    };

    // Listen to the back press event
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener
    return () => backHandler.remove();
  }, []);

  //  scroll index state
  const [activeIndex, setActiveIndex] = useState(0);

  // scroll indicators
  const dotsIndicator = () => {
    return casesImages?.map((dots, index) => {
      if (activeIndex == index) {
        return <View key={index} style={styles.dot}></View>;
      } else {
        return <View key={index} style={styles.dot2}></View>;
      }
    });
  };

  // scrolls indications
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setActiveIndex(index);
  };
  const Replies = () => {
    return data?.map((item, index) => {
      return (
        <View key={index}>
          <Commenty
            name={item.username}
            msg={item.comment}
            // likes={item.likes}
            date={dateFormat(item.createAt, "mediumDate")}
            img={item.authorPic}
            // replies={item.replies}
          />
        </View>
      );
    });
  };

  return (
    // <View>

    //   <Text>{qn}</Text>
    // </View>
    <Provider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
        <NetworkStatusBanner />

        <View style={[{ marginLeft: 20, marginTop: 10 }]}>
          <MyBackButton onPress={navigation.goBack} />
        </View>

        <View style={[styles.container]}>
          <View style={styles.AvatarTop}>
            <View style={styles.Avatar}>
              {/* <Image
                source={{ uri: route.params.AuthorImage }}
                style={styles.AvatarImg}
              /> */}
              <ImageLoader
                resizeMode={"cover"}
                defaultImageSource={img.user[1]}
                source={{ uri: route.params.AuthorImage }}
                style={styles.AvatarImg}
              />
              <Text style={{ fontWeight: 500 }}>{route.params.authorName}</Text>
            </View>
            <View style={{ marginRight: 6 }}>
              <Text style={{ fontSize: 12 }}>{route.params.time}</Text>
            </View>

            {/* Menu dots */}

            {authorId == userData?._id ? (
              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{ left: 5, width: 50, alignItems: "center" }}
              >
                {authorId == userData?._id ? (
                  <MaterialCommunityIcons
                    // style={{width:50,alignItems:'center',justifyContent:'center'}}
                    name="dots-vertical"
                    size={24}
                    color={"#676767"}
                  />
                ) : null}
              </TouchableOpacity>
            ) : null}

            {/* modal */}
            {visible ? (
              <View style={styles.deleteDots}>
                <TouchableOpacity
                  onPress={async () => {
                    setVisible(false), setModalOpen(true);
                  }}
                  style={{
                    // borderRadius:10,
                    height: 40,
                    width: 80,
                    // marginTop: 16,
                    // backgroundColor: "green",
                    // top: 8,
                    // flex: 1,
                    // position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                    // right: 0,
                    flexDirection: "row",
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={22}
                    color={"#000"}
                  />

                  <Text>delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setVisible(false);
                  }}
                  style={{
                    // borderRadius:10,
                    height: 40,
                    width: 80,
                    // bottom:8,
                    // backgroundColor: "green",
                    flex: 1,
                    // position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                    // right: 0,
                    flexDirection: "row",
                  }}
                >
                  <Feather name="x" size={22} color={"#000"} />

                  <Text>cancel</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <Modal
              isVisible={modalOpen}
              // onBackdropPress={() => setConfirmDeleteId(null)}
              onBackdropPress={() => {
                setModalOpen(false);
              }}
              animationIn="zoomIn"
              animationOut="zoomOut"
              backdropOpacity={0.3}
              useNativeDriver
              hideModalContentWhileAnimating
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Delete Post</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete this post?
                </Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    // onPress={() => setConfirmDeleteId(null)}
                    onPress={() => {
                      setModalOpen(false);
                    }}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  {deleteCaseIndicator ? (
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <ActivityIndicator size={24} color={"#1989b9"} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={async () => {
                        setIndicator(true);
                        const response = await deleteQuestion(post_Id);
                        if (response.status == "ok") {
                          setIndicator(false);
                        }
                        setModalOpen(false);
                        navigation.goBack();
                      }}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>

            {/* ** */}
          </View>

          <View style={{ alignItems: "center" }}>
            {casesImages ? (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  // width: 320,
                  width: width,
                  rowGap: 16,
                }}
              >
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={casesImages}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("new clinical", { image: item })
                        }
                        style={styles.imageQA}
                      >
                        {/* <Image
                          source={{ uri: item?.url }}
                          style={styles.casesImages}
                        /> */}
                        <ImageLoader
                          resizeMode={"cover"}
                          defaultImageSource={img.user[2]}
                          source={{ uri: item?.url }}
                          style={styles.casesImages}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  onScroll={handleScroll}
                  pagingEnabled={true}
                />
                <View style={styles.dotsContainer}>{dotsIndicator()}</View>

                {typeOfAnimal || sex || age ? (
                  <Text style={{ color: "#1989b9" }}>
                    #{typeOfAnimal}, {sex}, {age}
                  </Text>
                ) : null}
                <View style={{ maxHeight: 200 }}>
                  <ScrollView>
                    <Text style={styles.caseDetails}>
                      {FormatText(caseDetails)}
                    </Text>
                  </ScrollView>
                </View>
              </View>
            ) : (
              <View style={styles.QAcontainer}>
                <ScrollView>
                  <Text style={styles.qn}>{FormatText(qn)}</Text>

                  {/* <Text style={styles.qn}>{qn}</Text> */}
                </ScrollView>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setComments(true)}
            style={{
              marginLeft: 8,
              marginTop: 24,
              flexDirection: "row",
              columnGap: 8,
            }}
          >
            <Feather name="users" size={16} color={"#676767"} />
            <Text style={{ color: "#676767" }}>Replies</Text>
            <Text>{data?.length}</Text>
          </TouchableOpacity>
          <View
            style={{
              width: 301,
              height: 1,
              backgroundColor: "#aaa",
              marginLeft: 8,
              marginTop: 8,
            }}
          ></View>

          {(qn || caseDetails).length > 160 || casesImages ? (
            <BottomShit
              show={comments}
              onDismiss={() => setComments(false)}
              enableBackDropDismiss
              comments={data?.length}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <SendBox
                  author={Author}
                  postId={postId}
                  placeholder={"Add comment"}
                />
                {data?.length !== 0 ? (
                  <FlatList
                    // contentContainerStyle={{flex:1}}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    renderItem={({ item }) => (
                      <Commenty
                        img={item.authorPic}
                        msg={item.comment}
                        // date={dateFormat(item.createAt, "mediumDate")}
                        date={item.createAt}
                        replies={item.replies.length}
                        name={item.username}
                        // likes={item.likes}

                        commentId={item.id}
                        // replies

                        repl={item.replies}
                        // author id
                        authorId={item.authorId}
                        postId={item.postId}
                        likes={item.likes.length}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <Text>No comments</Text>
                  </View>
                )}
            
              </View>
            </BottomShit>
          ) : (
            <View style={{ flex: 1, alignItems: "center" }}>
              <SendBox
                author={Author}
                postId={postId}
                placeholder={"Add comment"}
              />
              {data ? (
                <FlatList
                  // contentContainerStyle={{flex:1}}
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator={false}
                  data={data}
                  renderItem={({ item }) => (
                    <Commenty
                      img={item.authorPic}
                      msg={item.comment}
                      // date={dateFormat(item.createAt, "mediumDate")}
                      date={item.createAt}
                      replies={item.replies.length}
                      name={item.username}
                      // likes={item.likes}
                      commentId={item.id}
                      // replies

                      repl={item.replies}
                      //  author id
                      authorId={item.authorId}
                      postId={item.postId}
                      likes={item.likes.length}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <View style={styles.ActivityIndicator}>
                  <ActivityIndicator size={38} color={"#028704"} />
                </View>
              )}
            </View>
          )}
          {/*  */}
        </View>
      </SafeAreaView>
    </Provider>
  );
}

// export default function QAdetails({ navigation }) {
//   const route = useRoute();
//   const casesImages = route.params.caseImages;
//   const caseDetails = route.params.casedetails;
//   const replies = route.params.replies;
//   const qn = route.params.details;
//   const post_Id = route.params.postId;
//   const authorId = route.params.AuthorId;
//   const age = route.params.ageOfAnimal;
//   const sex = route.params.sexOfAnimal;
//   const typeOfAnimal = route.params.typeOfAnimal;

//   const { userData, getToken } = useLogin();

//   const [visible, setVisible] = useState(false);
//   const [deleteCaseIndicator, setIndicator] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [replys, setReplies] = useState();
//   const [data, setData] = useState();

//   const fetchPost = async (post_Id) => {
//     const posts = await getComments(post_Id);
//     setData(posts);
//   };

//   useFocusEffect(() => {
//     fetchPost(post_Id);
//   });

//   const [comments, setComments] = useState(false);
//   const [Author, setAuthor] = useState(userData._id);
//   const [postId, setPostId] = useState(post_Id);

//   useEffect(() => {
//     const backAction = () => {
//       navigation.goBack();
//       return true;
//     };
//     const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
//     return () => backHandler.remove();
//   }, []);

//   const [activeIndex, setActiveIndex] = useState(0);

//   const dotsIndicator = () => {
//     return casesImages?.map((dots, index) => {
//       return <View key={index} style={activeIndex == index ? styles.dot : styles.dot2}></View>;
//     });
//   };

//   const handleScroll = (event) => {
//     const scrollPosition = event.nativeEvent.contentOffset.x;
//     const index = scrollPosition / width;
//     setActiveIndex(index);
//   };

//   const Replies = () => {
//     return data?.map((item, index) => (
//       <View key={index}>
//         <Commenty
//           name={item.username}
//           msg={item.comment}
//           date={dateFormat(item.createAt, "mediumDate")}
//           img={item.authorPic}
//         />
//       </View>
//     ));
//   };

//   return (
//     <Provider>
//       <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//         <StatusBar backgroundColor={"#028704"} barStyle={"light-content"} />
//         <NetworkStatusBanner />

//         <View style={[{ marginLeft: 20, marginTop: 10 }]}> <MyBackButton onPress={navigation.goBack} /> </View>

//         <View style={[styles.container]}>
//           <View style={styles.AvatarTop}>
//             <View style={styles.Avatar}>
//               <ImageLoader
//                 resizeMode={"cover"}
//                 defaultImageSource={img.user[1]}
//                 source={{ uri: route.params.AuthorImage }}
//                 style={styles.AvatarImg}
//               />
//               <Text style={{ fontWeight: 500 }}>{route.params.authorName}</Text>
//             </View>
//             <View style={{ marginRight: 6 }}>
//               <Text style={{ fontSize: 12 }}>{route.params.time}</Text>
//             </View>

//             {authorId == userData?._id && (
//               <TouchableOpacity
//                 onPress={() => setVisible(true)}
//                 style={{ left: 5, width: 50, alignItems: "center" }}
//               >
//                 <MaterialCommunityIcons name="dots-vertical" size={24} color={"#676767"} />
//               </TouchableOpacity>
//             )}

//             {visible && (
//               <View style={styles.deleteDots}>
//                 <TouchableOpacity onPress={() => { setVisible(false); setModalOpen(true); }} style={styles.deleteOption}>
//                   <MaterialCommunityIcons name="delete" size={22} color={"#000"} />
//                   <Text>delete</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setVisible(false)} style={styles.deleteOption}>
//                   <Feather name="x" size={22} color={"#000"} />
//                   <Text>cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             <Modal
//               isVisible={modalOpen}
//               onBackdropPress={() => setModalOpen(false)}
//               animationIn="zoomIn"
//               animationOut="zoomOut"
//               backdropOpacity={0.3}
//               useNativeDriver
//               hideModalContentWhileAnimating
//             >
//               <View style={styles.modalContainer}>
//                 <Text style={styles.modalTitle}>Delete Post</Text>
//                 <Text style={styles.modalMessage}>Are you sure you want to delete this post?</Text>
//                 <View style={styles.modalActions}>
//                   <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.cancelButton}>
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>

//                   {deleteCaseIndicator ? (
//                     <ActivityIndicator size={24} color={"#1989b9"} />
//                   ) : (
//                     <TouchableOpacity
//                       onPress={async () => {
//                         setIndicator(true);
//                         const response = await deleteQuestion(post_Id);
//                         if (response.status == "ok") setIndicator(false);
//                         setModalOpen(false);
//                         navigation.goBack();
//                       }}
//                       style={styles.deleteButton}
//                     >
//                       <Text style={styles.deleteButtonText}>Delete</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             </Modal>
//           </View>

//           <View style={{ alignItems: "center" }}>
//             {casesImages ? (
//               <View style={{ flexDirection: "column", alignItems: "center", width: width, rowGap: 16 }}>
//                 <FlatList
//                   showsHorizontalScrollIndicator={false}
//                   horizontal
//                   data={casesImages}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => navigation.navigate("new clinical", { image: item })}
//                       style={styles.imageQA}
//                     >
//                       <ImageLoader
//                         resizeMode={"cover"}
//                         defaultImageSource={img.user[2]}
//                         source={{ uri: item?.url }}
//                         style={styles.casesImages}
//                       />
//                     </TouchableOpacity>
//                   )}
//                   keyExtractor={(item, index) => index.toString()}
//                   onScroll={handleScroll}
//                   pagingEnabled
//                 />
//                 <View style={styles.dotsContainer}>{dotsIndicator()}</View>
//                 {typeOfAnimal || sex || age ? (
//                   <Text style={{ color: "#1989b9" }}>#{typeOfAnimal}, {sex}, {age}</Text>
//                 ) : null}
//                 <View style={{ maxHeight: 200 }}>
//                   <ScrollView>
//                     <Text style={styles.caseDetails}>{FormatText(caseDetails)}</Text>
//                   </ScrollView>
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.QAcontainer}>
//                 <ScrollView>
//                   <Text style={styles.qn}>{FormatText(qn)}</Text>
//                 </ScrollView>
//               </View>
//             )}
//           </View>

//           <TouchableOpacity
//             onPress={() => setComments(true)}
//             style={{ marginLeft: 8, marginTop: 24, flexDirection: "row", columnGap: 8 }}
//           >
//             <Feather name="users" size={16} color={"#676767"} />
//             <Text style={{ color: "#676767" }}>Replies</Text>
//             <Text>{data?.length}</Text>
//           </TouchableOpacity>

//           <View style={{ width: 301, height: 1, backgroundColor: "#aaa", marginLeft: 8, marginTop: 8 }}></View>

//           {(qn || caseDetails).length > 160 || casesImages ? (
//             <BottomShit show={comments} onDismiss={() => setComments(false)} enableBackDropDismiss comments={data?.length}>
//               <View style={{ flex: 1, alignItems: "center" }}>
//                 <SendBox author={Author} postId={postId} placeholder={"Add comment"} />
//                 {data?.length !== 0 ? (
//                   <FlatList
//                     style={{ flex: 1 }}
//                     showsVerticalScrollIndicator={false}
//                     data={data}
//                     renderItem={({ item }) => (
//                       <Commenty
//                         img={item.authorPic}
//                         msg={item.comment}
//                         date={item.createAt}
//                         replies={item.replies.length}
//                         name={item.username}
//                         commentId={item.id}
//                         repl={item.replies}
//                         authorId={item.authorId}
//                         postId={item.postId}
//                         likes={item.likes.length}
//                       />
//                     )}
//                     keyExtractor={(item, index) => index.toString()}
//                   />
//                 ) : (
//                   <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
//                     <Text>No comments</Text>
//                   </View>
//                 )}
//               </View>
//             </BottomShit>
//           ) : (
//             <View style={{ flex: 1, alignItems: "center" }}>
//               <SendBox author={Author} postId={postId} placeholder={"Add comment"} />
//               {data ? (
//                 <FlatList
//                   style={{ flex: 1 }}
//                   showsVerticalScrollIndicator={false}
//                   data={data}
//                   renderItem={({ item }) => (
//                     <Commenty
//                       img={item.authorPic}
//                       msg={item.comment}
//                       date={item.createAt}
//                       replies={item.replies.length}
//                       name={item.username}
//                       commentId={item.id}
//                       repl={item.replies}
//                       authorId={item.authorId}
//                       postId={item.postId}
//                       likes={item.likes.length}
//                     />
//                   )}
//                   keyExtractor={(item, index) => index.toString()}
//                 />
//               ) : (
//                 <View style={styles.ActivityIndicator}>
//                   <ActivityIndicator size={38} color={"#028704"} />
//                 </View>
//               )}
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     </Provider>
//   );
// }

const styles = StyleSheet.create({
  ActivityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 6,
  },
  deleteDots: {
    zIndex: 1000,
    elevation: 9,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 60,
    top: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,

    height: 80,
    width: 80,
    flexDirection: "column",
    position: "absolute",
    right: 10,
    backgroundColor: "white",
  },
  qn: {
    padding: 16,
    fontSize: 16,
  },
  caseDetails: {
    // paddingTop:16,
    fontSize: 16,
    marginHorizontal: 24,
    // padding:16
  },
  casesImages: {
    // alignItems: "center",
    // height: 250,
    // width: 310,
    // // width:width,
    // resizeMode: "cover",

    height: "99.99%",
    borderRadius: 15,
    width: 310,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    // alignItems:'center'
  },
  imageQA: {
    display: "flex",
    width: width,
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    // display:"flex",
    // marginTop: 16,
    // height: 250,
    // // width: 320,
    // width:width,
    // alignItems: "center",
    // justifyContent: "center",
  },
  QAcontainer: {
    // height:147,
    maxHeight: 500,
    minHeight: 50,
    width: 320,
    backgroundColor: "#e3edf8",
    marginTop: 24,
  },
  AvatarTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginHorizontal: 0,
    marginTop: 24,
  },
  Avatar: {
    flexDirection: "row",
    columnGap: 8,
    alignItems: "center",
  },
  AvatarImg: {
    height: 43,
    width: 43,
    borderRadius: 50,
    borderWidth: 0.1,
  },
  dot: {
    backgroundColor: "#aaa",
    height: 8,
    width: 8,
    marginLeft: 8,
    borderRadius: 50,
  },
  dot2: {
    backgroundColor: "#1989b9",
    height: 8,
    width: 8,
    marginLeft: 8,
    borderRadius: 50,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 55,
    height: 10,
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },

  modalMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#028704",
  },

  cancelButtonText: {
    color: "#028704",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#D75C5C",
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
