import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated'; // 🔁 This must be at the top
import DrawerNavigator from './app/navigation/DrawerNavigator';
import './gesture-handler';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from './app/Api/UserContext';
import LoginNav from './app/navigation/LoginNav/LoginNav';
import SplashScreen from './app/screens/SplashScreen';


// import { registerForPushNotificationsAsync } from './app/notifications/notifications';

// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// Notifications.addNotificationReceivedListener(notification => {
//   const { caseTitle, author } = notification.request.content.data;
//   console.log(`Case "${caseTitle}" by ${author} received!`);
// });


// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // notifications

  
// useEffect(() => {
//   (async () => {
//     const token = await registerForPushNotificationsAsync();
//     if (token) {
//       await fetch('http://192.168.43.62:3000/api/post/notifications/save-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${userToken}` // assuming JWT
//         },
//         body: JSON.stringify({ token }),
//       });
//     }
//   })();
// }, []);


//   useEffect(() => {
//     const getData = async () => {
//       const data = await AsyncStorage.getItem('isLogin');
//       console.log(data);
//       setIsLoggedIn(data === 'true');
//       setLoading(false);
//     };
//     getData();
//   }, []);
//   return (
//     <UserProvider>
//     <NavigationContainer>

//         {loading ? (
//             // <ActivityIndicator size="large" color="#028704" />
//             <SplashScreen/>
//           ) : isLoggedIn ? (
//             <DrawerNavigator />
//           ) : (
//             <LoginNav />
//           )}

//       {/* <DrawerNavigator/> */}
//     </NavigationContainer>
//     </UserProvider>
      
//   )
// }
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getData = async () => {
      const data = await AsyncStorage.getItem('isLogin');
      console.log(data);
      setIsLoggedIn(data === 'true');
      setLoading(false);
    };
    getData();
  }, []);
  return (
    <UserProvider>
    <NavigationContainer>

        {loading ? (
            // <ActivityIndicator size="large" color="#028704" />
            <SplashScreen/>
          ) : isLoggedIn ? (
            <DrawerNavigator />
          ) : (
            <LoginNav />
          )}

      {/* <DrawerNavigator/> */}
    </NavigationContainer>
    </UserProvider>
      
  )
}

const styles = StyleSheet.create({})