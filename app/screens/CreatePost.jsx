import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React,{useState, useEffect} from 'react'
import { SponsorLogo } from '../assets/global'
import { TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Modal } from 'react-native'

export default function CreatePost({navigation}) {

   const [visible, setVisible] = useState(false);
    const [category, setCategory] = useState([
      "Clinical",
      "Surgery",
      "Postmortem",
      "Vaccination",
      "Management",
    ]);

    const toggleOverlay = () => {
      setVisible(!visible);
    };

      const [filter, setFilter] = useState(""); //1

     const [getword, setGetWord] = useState("");
    const triggerCall = (child) => {
    setGetWord(child);
  };



  // console.log(value)
  return (
    <View style={styles.container}>

      <View style={styles.contentContainer}>

      <View>

      <Text style={styles.text}>Please choose Post Category.</Text>
      </View>

      <View >
        <Image source={SponsorLogo.post} style={styles.image}/>
      </View>
      </View>


    <View style={{marginHorizontal:16,left:64, top:45,marginTop:60}}>


             <Modal
                          visible={visible}
                          // presentationStyle="formSheet"
                          transparent={true}
                          animationType="slide"
                          onRequestClose={toggleOverlay}
                          
                          // onDismiss={()=>setFilter('')}
                        >
                          <View style={styles.modalView}>
                            {category.map((item,index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setFilter(item);
                                    toggleOverlay();
                                  }}
                                  key={item}
                                >
                                  <Text style={[styles.textModal,{paddingBottom:index===category.length-1?32:0}]}>{item}</Text>
                                </TouchableOpacity>
                              );
                            })}
                            {/* {console.log(filter)} */}
                          </View>
                        </Modal>
    </View>

      <View style={styles.InputContainer}>

      <TextInput value={filter} placeholder={filter}  style={styles.inputField} editable={false}/>
      
      <TouchableOpacity onPress={()=>setVisible(true)} style={{right:24}}>

      <Ionicons name='chevron-down' size={20} color={"#000"}/>
      </TouchableOpacity>
    
      </View>

      <TouchableOpacity
       onPress={()=>navigation.navigate('PostPath', {placeholder:filter})}
        activeOpacity={0.8} style={[styles.continue,{borderWidth:filter?0:1},{backgroundColor:filter?'#028704':"#fff"},{borderColor:!filter?"#aaa":null}]}>
        <Text style={{color:filter?'#fff':"#000", fontSize:18, fontWeight:500}}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  continue:{
    marginTop:32,
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center',
    width:300,
    height:50,
    borderRadius:10,
    // backgroundColor:'#028704'
  },
  textModal: {
    paddingTop: 16,
    textAlign: "center",
    fontSize: 16,
    paddingBottom:8
    // fontWeight:500
  },
  modalView: {
    position: "absolute",
    right: 30,
    bottom:200,
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

  inputField:{
    fontSize:16,
    paddingLeft:16,
    width:280,
    height:50,
    // borderWidth:1,
    // marginHorizontal:8
  },
  InputContainer:{
    borderRadius:10,
    flexDirection:'row',
    width:300,
    height:50,
    borderWidth:1,
    borderColor:'#aaa',
    alignItems:'center',
    justifyContent:'center'
  },
  text:{
    fontSize:24,
    width:160,
    fontWeight:600,
    paddingTop:32,
    paddingLeft:16
  },
  contentContainer:{
    columnGap:16,
    alignItems:'center',
    // flex:1,
    flexDirection:'row',
    marginHorizontal:16,
    marginTop:24
  },
  container:{
    alignItems:'center',
    backgroundColor:"#fff",
    flex:1
  },
  image:{
    width:126,
    height:158,
    resizeMode:'cover'
  }
})


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { SafeAreaView } from 'react-native'

// export default function CreatePost() {
//   return (
//  <SafeAreaView style={styles.container}>
//     <View style={styles.container}>
//       <Text>Create Post</Text>
//     </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container:{
//     flex:1,
//     margin:24
//   }
// })