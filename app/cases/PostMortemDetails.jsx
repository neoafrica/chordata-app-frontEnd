import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// import React, { useState } from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

import { img } from "../assets/global";
import Sponsorlogo from "../pages/SponsorLogo";
// import ImageLoader from "../src/ImageLoader";
import ImageLoader from "../scr/ImageLoader";
// import RelatedCases from "./RelatedCases";
import RelatedCases from "../pages/RelatedCases";
// import AuthorName from "./AuthorName";
import AuthorName from "../pages/AuthorName";
// import BottomShit from "./BottomShit";
import BottomShit from "../pages/BottomShit";
// import Commenty from "./Comments";
import Commenty from "../pages/Comments";
// import SendBox from "./SendBox";
import { Provider } from "react-native-paper";
import SendBox from "../pages/SendBox";
// import { useLogin } from "../Api/UserContext";
import { useLogin } from "../Api/UserContext";

import { useFocusEffect } from "@react-navigation/native";
import { deleteCase, getComments, RelatedCase } from "../Api/post";
// import { RelatedCase } from "../../Api/post";
// import RelatedCases from "../pages/RelatedCases";
// import ImageLoader from "../scr/ImageLoader";
import Modal from "react-native-modal";
// import { FormatText } from "../../Pages/formatText";
import NetworkStatusBanner from "../Api/NetInfo/NetWorkStatusBanner";
import { FormatText } from "./formatText";

const { height, width } = Dimensions.get("window"); // get window dimensions

export default function PostMortemDetails({ navigation }) {
  const route = useRoute();
  const images = route.params.img;

  // for delete case modal
  const [visible, setVisible] = useState(false);
  const [deleteCaseIndicator, setIndicator] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [differentialDiagnosis, setDifferential] = useState(true);

  const [caseHist, setCaseHist] = useState(true);
  const [pmFindings, setFindings] = useState(true);
  const [tentativeDiagnosis, setTentative] = useState(true);
  const [comments, setComments] = useState(true);
  const [recommendations, setRecommendations] = useState(true);

  const post_Id = route.params.postId;

  const { userData, getToken } = useLogin();
  const [Author, setAuthor] = useState(userData._id);
  const [postId, setPostId] = useState(post_Id);

  const [data, setData] = useState();
  const [related, setRelated] = useState();

  // for delaying comment shit loading it render the page heavy upon mounting
  const [isDelayedComponentVisible, setIsDelayedComponentVisible] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayedComponentVisible(true); // Delay rendering this component
    }, 3000); // Delay for 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  const category = route.params.category;
  const animalType = route.params.typeOfAnimal;
  const authorId = route.params.authorId;

  const relatedCase = async (animalType, category, authorId, post_Id) => {
    const related = await RelatedCase(animalType, category, authorId, post_Id);
    setRelated(related);
    // console.log("Related cases =>", related);
  };

  const fetchPost = async (post_Id) => {
    const posts = await getComments(post_Id);

    setData(posts);
  };

  useFocusEffect(() => {
    fetchPost(post_Id), relatedCase(animalType, category, authorId, post_Id);
  });

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
  // case images

  //  scroll index state
  const [activeIndex, setActiveIndex] = useState(0);

  // scroll indicators

  const dotsIndicator = () => {
    return images.map((dots, index) => {
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

  // flatlist auto scroll hooks

  const flatListRef = useRef();

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index: index,
  });

  useEffect(() => {
    //Prevent pre-opening of the comments section upon page loading
    setComments(false);
  }, []);

  const Recommendations = () => {
    setRecommendations((prev) => !prev);
  };

  const Findings = () => {
    setFindings((prev) => !prev);
  };
  const Tentative = () => {
    setTentative((prev) => !prev);
  };
  const Comments = () => {
    setComments((prev) => !prev);
  };

  const CaseHistory = () => {
    setCaseHist((prev) => !prev);
  };
  const Differential = () => {
    setDifferential((prev) => !prev);
  };


  return (
    <Provider>
      <View style={styles.container}>
        <NetworkStatusBanner/>
        {authorId == userData?._id ? (
          <TouchableOpacity
            onPress={() => setVisible(true)}
            // style={{left:5,width: 50, alignItems: "center" }}
            style={{
              right: 0,
              position: "absolute",
              width: 40,
              alignItems: "center",
              marginTop:12
            }}
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
              <MaterialCommunityIcons name="delete" size={22} color={"#000"} />

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
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                          <ActivityIndicator size={24} color={"#1989b9"} />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={async () => {
                            setIndicator(true);
                            const response = await deleteCase(post_Id);
                            if (response.status == "ok") {
                              setIndicator(false);
                            }
                            setModalOpen(false), navigation.goBack();
                          }}
                          style={styles.deleteButton}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Modal>

        <View style={styles.titleContainer}>
          <Text style={styles.Title}>{FormatText(route.params.Title)}</Text>
        </View>

        {/* <View style={styles.imgContainer}>
          <Image source={{ uri: route.params.img[0].url }} style={styles.img} />
        </View> */}

        <FlatList
          data={images}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("new clinical", { image: item })
                }
                style={styles.imgContainer}
              >
                {/* <Image source={{ uri: item.url }} style={styles.img} />
                 */}
                <ImageLoader
                  resizeMode={"cover"}
                  defaultImageSource={img.user[2]}
                  source={{ uri: item.url }}
                  style={styles.img}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled={true}
          onScroll={handleScroll}
          // ref={flatListRef}
          getItemLayout={getItemLayout}
        />

        <View style={styles.dotsContainer}>{dotsIndicator()}</View>

        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          {/* **************************** DROP DOWN CASE HISTORY DETAILS */}
          {caseHist ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={CaseHistory}
              style={[
                styles.tabBar,
                { backgroundColor: caseHist ? "#028704" : "#1989b9" },
              ]}
            >
              <Fontisto name="prescription" size={22} color={"#fff"} />
              <Text style={styles.tabText}>Case history</Text>
              {caseHist ? (
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              ) : (
                <Ionicons
                  name="chevron-up-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={CaseHistory}
                style={[
                  styles.tabBar,
                  { backgroundColor: caseHist ? "#028704" : "#1989b9" },
                ]}
              >
                <Fontisto name="prescription" size={22} color={"#fff"} />
                <Text style={[styles.tabText]}>Case history</Text>

                <Ionicons
                  name={
                    caseHist
                      ? "chevron-down-circle-outline"
                      : "chevron-up-circle-outline"
                  }
                  size={26}
                  color={"#fff"}
                />
              </TouchableOpacity>
              <View style={{ marginTop: 8, width: 322 }}>
                <Text
                  style={{
                    fontSize: 15,
                    paddingLeft: 4,
                    textDecorationStyle: "dotted",
                  }}
                >
                  {FormatText(route.params.hist)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 16,
                    paddingLeft: 6,
                    color: "#676767",
                    fontWeight: 600,
                  }}
                >
                  bio-data -- {FormatText(route.params.ageOfAnimal)} ,
                  {FormatText(route.params.sexOfAnimal)}, {FormatText(route.params.typeOfAnimal)}
                </Text>
              </View>
            </View>
          )}

          {/* *************************************************************/}

          {pmFindings ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={Findings}
              style={[
                styles.tabBar,
                { backgroundColor: pmFindings ? "#028704" : "#1989b9" },
              ]}
            >
              <FontAwesome name="scissors" size={24} color={"#fff"} />
              <Text style={styles.tabText}>Postmortem findings</Text>
              {pmFindings ? (
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              ) : (
                <Ionicons
                  name="chevron-up-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={Findings}
                style={[
                  styles.tabBar,
                  { backgroundColor: pmFindings ? "#028704" : "#1989b9" },
                ]}
              >
                {/* <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={"#fff"} /> */}

                <FontAwesome name="scissors" size={24} color={"#fff"} />
                <Text style={styles.tabText}>Postmortem findings</Text>
                <Ionicons
                  name={
                    pmFindings
                      ? "chevron-down-circle-outline"
                      : "chevron-up-circle-outline"
                  }
                  size={26}
                  color={"#fff"}
                />
              </TouchableOpacity>
              <View style={{ marginTop: 8, width: 322 }}>
                <Text
                  style={{
                    fontSize: 15,
                    paddingLeft: 4,
                    textDecorationStyle: "dotted",
                  }}
                >
                  {FormatText(route.params.pmFindings)}
                </Text>
              </View>
            </View>
          )}

          {/* **************************************************8 */}

          {differentialDiagnosis ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={Differential}
              style={[
                styles.tabBar,
                {
                  backgroundColor: differentialDiagnosis
                    ? "#028704"
                    : "#1989b9",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color={"#fff"}
              />
              <Text style={styles.tabText}>Differential diagnosis</Text>
              {differentialDiagnosis ? (
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              ) : (
                <Ionicons
                  name="chevron-up-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={Differential}
                style={[
                  styles.tabBar,
                  {
                    backgroundColor: differentialDiagnosis
                      ? "#028704"
                      : "#1989b9",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="clipboard-list-outline"
                  size={24}
                  color={"#fff"}
                />
                <Text style={styles.tabText}>Differential diagnosis</Text>

                <Ionicons
                  name={
                    differentialDiagnosis
                      ? "chevron-down-circle-outline"
                      : "chevron-up-circle-outline"
                  }
                  size={26}
                  color={"#fff"}
                />
              </TouchableOpacity>
              <View style={{ marginTop: 8, width: 322 }}>
                <Text
                  style={{
                    fontSize: 15,
                    paddingLeft: 4,
                    textDecorationStyle: "dotted",
                  }}
                >
                  {FormatText(route.params.differentialDiagnosis)}
                </Text>
              </View>
            </View>
          )}
          {/* **********************************************88 */}
          {tentativeDiagnosis ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={Tentative}
              style={[
                styles.tabBar,
                { backgroundColor: tentativeDiagnosis ? "#028704" : "#1989b9" },
              ]}
            >
              <FontAwesome6 name="microscope" size={24} color={"#fff"} />
              <Text style={styles.tabText}>Tentative diagnosis</Text>
              {tentativeDiagnosis ? (
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              ) : (
                <Ionicons
                  name="chevron-up-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={Tentative}
                style={[
                  styles.tabBar,
                  {
                    backgroundColor: tentativeDiagnosis ? "#028704" : "#1989b9",
                  },
                ]}
              >
                <FontAwesome6 name="microscope" size={24} color={"#fff"} />
                <Text style={styles.tabText}>Tentative diagnosis</Text>

                <Ionicons
                  name={
                    tentativeDiagnosis
                      ? "chevron-down-circle-outline"
                      : "chevron-up-circle-outline"
                  }
                  size={26}
                  color={"#fff"}
                />
              </TouchableOpacity>
              <View style={{ marginTop: 8, width: 322 }}>
                <Text
                  style={{
                    fontSize: 15,
                    paddingLeft: 4,
                    textDecorationStyle: "dotted",
                  }}
                >
                  {FormatText(route.params.tentativeDiagnosis)}
                </Text>
              </View>
            </View>
          )}
          {/* ************************************ */}
          {recommendations ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={Recommendations}
              style={[
                styles.tabBar,
                { backgroundColor: recommendations ? "#028704" : "#1989b9" },
              ]}
            >
              <FontAwesome6 name="user-doctor" size={24} color={"#fff"} />
              <Text style={styles.tabText}>Recommendation(s)</Text>
              {recommendations ? (
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              ) : (
                <Ionicons
                  name="chevron-up-circle-outline"
                  size={26}
                  color={"#fff"}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={Recommendations}
                style={[
                  styles.tabBar,
                  {
                    backgroundColor: recommendations ? "#028704" : "#1989b9",
                  },
                ]}
              >
                <FontAwesome6 name="user-doctor" size={24} color={"#fff"} />
                <Text style={styles.tabText}>Recommendation(s)</Text>

                <Ionicons
                  name={
                    recommendations
                      ? "chevron-down-circle-outline"
                      : "chevron-up-circle-outline"
                  }
                  size={26}
                  color={"#fff"}
                />
              </TouchableOpacity>
              <View style={{ marginTop: 8, width: 322 }}>
                <Text
                  style={{
                    fontSize: 15,
                    paddingLeft: 4,
                    recommendations: "dotted",
                  }}
                >
                  {FormatText(route.params.recommendation)}
                </Text>
              </View>
            </View>
          )}
          {/* ***************************************************** */}
          <Sponsorlogo />

          <View style={{ flex: 1, marginTop: 24, width: width }}>
            <View style={{ left: 20, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 500, color: "#1989b9" }}>
                Related Cases
              </Text>
            </View>
            <FlatList
              data={related}
              renderItem={({ item }) => (
                <RelatedCases
                  pmFindings={item.clinicalFindings}
                  tentativeDiagnosis={item.TentativeDiagnosis}
                  differentialDiagnosis={item.DifferentialDiagnosis}
                  recommendation={item.recommendations}
                  sexOfAnimal={item.sexOfAnimal}
                  ageOfAnimal={item.ageOfAnimal}
                  authorPic={route.params.authorPic}
                  AuthorName={route.params.authorName}
                  postId={item.id}
                  authorId={item.author}
                  typeOfAnimal={item.typeOfAnimal}
                  category={item.category}
                  img={item.caseImage}
                  title={item.caseTitle}
                  history={item.caseHistory}
                />
              )}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          </View>

          <View //Line separator
            style={{
              backgroundColor: "#aaaaaa",
              height: 0.5,
              width: 300,
              marginTop: 20,
            }}
          ></View>
          {/* <AuthorName
            authorPic={route.params.authorPic}
            AuthorName={route.params.authorName}
          /> */}
   <View style={{flexDirection:'row', alignItems:'center'}}>
            <TouchableOpacity
            onPress={()=> navigation.navigate("ChatScreen", { recepientId: route.params.authorId })}
            >

          <AuthorName
            authorPic={route.params.authorPic}
            AuthorName={route.params.authorName}
          />
            </TouchableOpacity>
          <View style={{marginLeft:18}}>
            {/* <MaterialCommunityIcons name="message-reply-text-outline" size={24}/>
             */}
             <TouchableOpacity 
             onPress={()=> navigation.navigate("ChatScreen", { recepientId: route.params.authorId })}
             style={{flexDirection:"row", alignItems:'center', gap:8}}>

             <AntDesign name="message1" size={24} color={"#1989b9"}/>
            <Text style={{fontWeight:600}}>Chat</Text>
             </TouchableOpacity>
          </View>
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setComments(true);
              }}
              style={[
                styles.tabBar,
                {
                  backgroundColor: comments ? "#1989b9" : "#028704",
                  marginBottom: 20,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={22}
                color={"#fff"}
              />
              <View>
                <Text style={styles.tabText}>Comments · {data?.length}</Text>
              </View>

              <Ionicons
                name={
                  comments
                    ? "chevron-up-circle-outline"
                    : "chevron-down-circle-outline"
                }
                size={26}
                color={"#fff"}
              />
            </TouchableOpacity>

            {isDelayedComponentVisible && (
              <BottomShit
                show={comments}
                onDismiss={() => setComments(false)}
                enableBackDropDismiss
                comments={data?.length}
              >
                <View style={{ flex: 1, alignItems: "center" }}>
                <SendBox author={Author} postId={postId} placeholder={"Add comment"} />
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
            )}
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: "center",
    // marginHorizontal: 8,
    // marginTop: 24,
    backgroundColor:"#fff"
  },
  pressedTab: {
    display: "flex",
    justifyContent: "space-around",
    width: 322,
    height: 41,
    // backgroundColor:'#028704',
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#028704",
    // color:'black'
  },
  tabBar: {
    display: "flex",
    justifyContent: "space-around",
    width: 322,
    height: 41,
    backgroundColor: "#028704",
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
    // textDecorationStyle:'dotted'
  },
  titleContainer: {
    marginTop: 36,
    // marginHorizontal:8
  },
  Title: {
    width: width - 40,
    fontSize: 18,
    fontWeight: 500,
    // color: "#676767",
    paddingTop: 16,
    bottom: 15,
    // textAlign:'center'
  },
  imgContainer: {
    // flex:1,
    width: width,
    height: 315,
    alignItems: "center",
    // justifyContent:'center'
    // marginTop: 16,
  },
  img: {
    // flex:1,
    width: 323,
    height: 180,
    borderRadius: 10,
    // borderBottomRightRadius:10,
    //   resizeMode: 'cover',
    // bottom:15,
    // marginBottom:16
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
});
