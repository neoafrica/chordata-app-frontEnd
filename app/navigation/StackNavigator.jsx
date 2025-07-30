// import './gesture-handler';
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated"; // 🔁 This must be at the top
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { createStackNavigator,TransitionPresets,TransitionSpecs } from "@react-navigation/stack";
import { getHeaderTitle } from "@react-navigation/elements";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "../Tabs/TabNavigator";
import PostmortemCase from "../cases/PostMortem";
import RoutineManagement from "../cases/RoutineManagement";
import SurgeryCases from "../cases/SurgeryCases";
import VaccinationCase from "../cases/VaccinationCases";
import CasesCategory from "../pages/CasesCategory";
import Home from "../scr/Home";
import MyBackButton from "../scr/MyBackButton";
import MyHeader from "../scr/MyHeader";
import ClinicalPost from "../scr/Posts/ClinicalPost";
import PostPath from "../scr/Posts/PostPath";
import Avatar from "../scr/avatar";
import Profile from "../screens/Profile";
import DrawerNavigator from "./DrawerNavigator";

import ClinicalCase from "../cases/ClinicalCase";
import ClinicalDetails from "../cases/ClinicalDetails";
import PostMortemDetails from "../cases/PostMortemDetails";
import RoutineDetails from "../cases/RoutineDetails";
import SurgeryDetails from "../cases/SurgeryDetails";
import VaccinationDetails from "../cases/VaccinationDetails";
import ClinicalNew from "../pages/ClinicalNew";
import FrontImageDetails from "../pages/FrontImageDetails";
import SearchScreen from "../pages/SearchScreen";
import MyStory from "../scr/MyPage/MyStory";
import ClinicalQuestion from "../scr/Q & A/ClinicalQuestion";
import CommunityQns from "../scr/Q & A/CommunityQns";
import MyQA from "../scr/Q & A/MyQ&A";
import NonSpecificQn from "../scr/Q & A/NonSpecificQn";
import QAdetails from "../scr/Q & A/QAdetails";
import QuestionCategory from "../scr/Q & A/QuestionCategory";
import RecentCases from "../scr/RecentCases";
import BookmarkedPostsScreen from "../screens/Bookmarks";
import EditProfile from "../screens/EditProfile";
import LoginNav from "./LoginNav/LoginNav";

import ThreadDetails from "../Twitter/ThreadDetails";
import TwitterThreadPost from "../Twitter/TwitterPost";
import ChartsRoom from "../screens/ChartsRoom";
import ChatsScreen from "../screens/chats/ChatsScreen";
import InBox from "../screens/chats/InBox";

const Stack = createStackNavigator(); // kupata height ya header kwa native haiwezekani
// const Stack =createNativeStackNavigator()
export default function StackNavigator({ navigation }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Tabs"
          // initialRouteName="drawer"

          //trial

          // initialRouteName="sign up"
          screenOptions={{
            header: ({ navigation, route, options, back }) => {
              const title = getHeaderTitle(options, route.name);
              // console.log(title)

              return (
                <MyHeader
                  title={title}
                  leftButton={
                    back ? (
                      <MyBackButton onPress={navigation.goBack} />
                    ) : undefined
                  }
                />
              );
            },
          }}
        >
          <Stack.Screen name="header" component={MyHeader} />
          <Stack.Screen name="index" component={Home} />
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="casesCategory"
            component={CasesCategory}
            options={({ route }) => ({ title: route.params.pageTitle })} //getti the dynamic header title
          />
          <Stack.Screen
            name="Clinical"
            component={ClinicalCase}
            options={({ route }) => ({ title: route.params.head })}
          />
          <Stack.Screen
            name="Surgery"
            component={SurgeryCases}
            options={({ route }) => ({ title: route.params.head })}
          />
          <Stack.Screen
            name="Postmortem"
            component={PostmortemCase}
            options={({ route }) => ({ title: route.params.head })}
          />
          <Stack.Screen
            name="Vaccination"
            component={VaccinationCase}
            options={({ route }) => ({ title: route.params.head })}
          />
          <Stack.Screen
            name="Management"
            component={RoutineManagement}
            options={({ route }) => ({ title: route.params.head })}
          />
          <Stack.Screen
            name="Login"
            component={LoginNav}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="cardCategory" component={CategoryCard} />
        <Stack.Screen name="drawer" component={DrawerNavigator} options={{headerShown:false}}/> */}
          <Stack.Screen name="clinical details" component={ClinicalDetails} />
          <Stack.Screen name="Routine Management" component={RoutineDetails} />
          <Stack.Screen
            name="Vaccination details"
            component={VaccinationDetails}
          />
          <Stack.Screen
            name="Postmortem details"
            component={PostMortemDetails}
          />
          <Stack.Screen name="Surgery details" component={SurgeryDetails} />

          <Stack.Screen
            name="drawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="avatar"
            component={Avatar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="edit profile"
            component={EditProfile}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="thread"
            component={TwitterThreadPost}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ThreadDetails" component={ThreadDetails} />
          <Stack.Screen name="My Thread" component={MyStory} />

          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="front image"
            component={FrontImageDetails}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="QA"
            component={QAdetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClinicalQuestion"
            component={ClinicalQuestion}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NonClinicalQn"
            component={NonSpecificQn}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="QuestionCategory"
            component={QuestionCategory}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClinicalPost"
            component={ClinicalPost}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PostPath"
            component={PostPath}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RecentCases"
            component={RecentCases}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="communityQns"
            component={CommunityQns}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="myQA"
            component={MyQA}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="new clinical"
            component={ClinicalNew}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Bookmarks" component={BookmarkedPostsScreen} />

          {/* <Stack.Screen name='ChatScreen' component={ChatsScreen} options={{headerShown:true}} />
           */}

          <Stack.Screen
            name="ChatScreen"
            component={ChatsScreen}
            options={{
              header: undefined, // 👈 Disables global custom header
              headerShown: true, // 👈 Enables default header rendering
            }}
          />

          <Stack.Screen name="Chat-Room" component={ChartsRoom} />

            <Stack.Screen name="Inbox" component={InBox} />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
