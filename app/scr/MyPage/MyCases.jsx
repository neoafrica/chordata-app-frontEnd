import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
// import { useLogin } from "../../Api/UserContext";
import { useLogin } from "../../Api/UserContext";
// import { MyCase } from "../../Api/post";
import { MyCase } from "../../Api/post";
// import RecentCaseCard from "../Cases/RecentCard";
import RecentCaseCard from "../../cases/RecentCard";
import { useFocusEffect } from "@react-navigation/native";
// import { getTimeAgo } from "../../Pages/Comments";
import { getTimeAgo } from "../../pages/Comments";

export default function MyCases({ navigation }) {
  const { userData, getToken } = useLogin();
  const [data, setData] = useState();
  const fetchPost = async () => {
    // const posts = await getQuestions();
    const qA = await MyCase(userData?._id);
    setData(qA);
    // console.log("story =>", posts);
  };

  // useFocusEffect(() => {
  //   fetchPost();
  // });

  useEffect(()=>{
    fetchPost();
  },[data])
  const itemSeparator = function () {
    return <View style={styles.separator} />;
  };

  // console.log(navigation.getState())
  return (
    // <ClinicalCase/>
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={({ item }) => (
          <RecentCaseCard
            // animalType={animalType}
            authorId={item.author}
            bookmark={item.bookmarks}
            clinicalFindings={item.clinicalFindings}
            management={item.clinicalManagement}
            category={item.category}
            title={item.caseTitle}
            history={item.caseHistory}
            authorName={item.username}
            caseImages={item.caseImage}
            authorPic={item.authorPic}
            ageOfAnimal={item.ageOfAnimal}
            sexOfAnimal={item.sexOfAnimal}
            typeOfAnimal={item.typeOfAnimal}
            postId={item.id}
            pmFindings={item.clinicalFindings}
            tentativeDiagnosis={item.TentativeDiagnosis}
            differentialDiagnosis={item.DifferentialDiagnosis}
            recommendation={item.recommendations}
            procedure={item.ProceduralSteps}
            poc={item.Poc}
            drugsUsed={item.drugsUsed}
            vaccineName={item.TypeOfVaccine}
            vaccinationAgainst={item.VaccineAgainst}
            regime={item.VaccinationRegime}
            description={item.description}
            managementCategory={item.managementCategory}
            datePublished={getTimeAgo(item.createdAt)}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={itemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex:1
  },
  flatList: {
    marginTop: 30,
  },
  separator: {
    width: "100%",
    height: 10,
    // backgroundColor:'purple'
  },
});


