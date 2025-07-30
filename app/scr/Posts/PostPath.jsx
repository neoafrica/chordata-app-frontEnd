import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SurgicalPost from './SurgicalPost'
import ClinicalPost from './ClinicalPost'
import { useRoute } from '@react-navigation/native'
import PmPost from './PmPost'
import VaccinationPost from './VaccinationPost'
import ManagementPost from './ManagementPost'

export default function PostPath({navigation}) {
    const route= useRoute()
    const path= route.params.placeholder
  return (
    <View style={{flex:1}}>
      {(path==='Surgery')?<SurgicalPost/>:(path==='Clinical')?<ClinicalPost/>:(path==='Postmortem')?<PmPost/>:(path==="Vaccination")?<VaccinationPost></VaccinationPost>:(path==="Management")?<ManagementPost/>:<View><Text>Others</Text></View>}
    </View>
    //   <View style={{flex:1}}>
    //   {(path==='Clinical')?<ClinicalPost/>:(path==='Postmortem')?<PmPost/>:(path==='Surgery')?<SurgicalPost/>:(path==="Vaccination")?<VaccinationPost/>:<View><Text>Others</Text></View>}
    // </View>
  )
}

const styles = StyleSheet.create({})