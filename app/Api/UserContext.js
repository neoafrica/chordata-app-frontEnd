import { createContext, useEffect, useState } from "react";
// import { Alert } from "react-native";
// import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { getUserData } from "./post";

const UserContext= createContext()

export const useLogin=()=>useContext(UserContext)

export const UserProvider =({children})=>{
    const [userData, setUserData] = useState({})

    useEffect(()=>{
        getToken()
    },[])

    
    const getToken=async()=>{
      const token= await AsyncStorage.getItem('token')

      // console.log(token)

      const response= await getUserData(token)

      if (response.data.status === "ok"){
        setUserData(response.data.data)
        // console.log('From context',response.data)
      }
      // else{
      //   Alert.alert(JSON.stringify(response.data))
      // }
      // console.log(token)
      //  axios.post("http://192.168.43.90:3000/api/post/user-data", {token})
      // .then((response) =>{ console.log('From context',response.data)
      //   if(response.data.status === 'ok'){
      //     setUserData(response.data.data)
      //   }else{
      //     Alert.alert(JSON.stringify(response.data))
      //   }
      // })
      // .catch((error) => console.log({ error }));
  
    }

    return(
        <UserContext.Provider value={{userData,getToken, setUserData}}>
            {children}

        </UserContext.Provider>
    );
}