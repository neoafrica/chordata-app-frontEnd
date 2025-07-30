import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import MyCases from "../src/MyPage/MyCases";
import MyCases from "../scr/MyPage/MyCases";
import TopTab from "./TopTabs";
// import ClinicalDetails from "../Pages/ClinicalDetails";
import ClinicalDetails from "../cases/ClinicalDetails";
// import MyBackButton from "../Pages/MyBackButton";
import MyBackButton from "../scr/MyBackButton";
import { getHeaderTitle } from "@react-navigation/elements";
// import MyHeader from "../MyHeader";
import MyHeader from "../scr/MyHeader";
// import PostMortemDetails from "../src/Cases/PostMortemDetails";
import PostMortemDetails from "../cases/PostMortemDetails";
// import SurgeryDetails from "../src/Cases/SurgeryDetails";
import SurgeryDetails from "../cases/SurgeryDetails";
// import VaccinationDetails from "../src/Cases/VaccinationDetails";
import VaccinationDetails from "../cases/VaccinationDetails";
// import ClinicalNew from "../Pages/ClinicalNew";
import ClinicalNew from "../pages/ClinicalNew";
// import StoryDetails from "../src/StoryDetails";
// import WriteStory from "../src/WriteStory";
// import TwitterThreadPost from "../Twitter/TwitterPost";
import TwitterThreadPost from "../Twitter/TwitterPost";
// import ThreadDetails from "../Twitter/ThreadDetails";
import ThreadDetails from "../Twitter/ThreadDetails";
import { SafeAreaProvider,SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();
export default function TopStackBarNav() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>

    <Stack.Navigator
      initialRouteName="TopTabs"
      screenOptions={{
                  //from react native custom header
                  header: ({ navigation, route, options, back }) => {
                    const title = getHeaderTitle(options, route.name);
          
                    return (
                      <MyHeader
                        title={title}
                        leftButton={
                          back ? <MyBackButton onPress={navigation.goBack} /> : undefined
                        }
                        // style={options.headerStyle, options.headerBackTitle}
                      />
                    );
                  },
                }}
    >
      <Stack.Screen name="clinical details" component={ClinicalDetails} />
      {/* <Stack.Screen name="WriteStory" component={WriteStory} options={{ headerShown: false }}/> */}
      {/* <Stack.Screen name="StoryDetails" component={StoryDetails} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Postmortem details" component={PostMortemDetails} />
      <Stack.Screen name="Surgery details" component={SurgeryDetails} />
      <Stack.Screen name="Vaccination details" component={VaccinationDetails} />
      <Stack.Screen name="new clinical" component={ClinicalNew} options={{ headerShown: false }} />
      <Stack.Screen name="thread" component={TwitterThreadPost} options={{headerShown:false}}/>
      <Stack.Screen name="ThreadDetails" component={ThreadDetails} />
      <Stack.Screen
        name="My cases"
        component={MyCases}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TopTabs"
        component={TopTab}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
