// AutoGrowTextInput.js
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
// import { View } from "react-native-reanimated/lib/typescript/Animated";

const AutoGrowTextInput = ({
  placeholder,
  value,
  onChangeText,
  minHeight=40,
  style,
  editable = true,
}) => {
  const [inputHeight, setInputHeight] = useState(minHeight);

  return (

    // <ScrollView contentContainerStyle={{maxHeight:360, flex:1,width:300}}>

        <TextInput
        
          multiline
          editable={editable}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onContentSizeChange={(e) =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
          style={[
            styles.input,
            { height: Math.max(minHeight, inputHeight) },
            style,
          ]}
        />

        //  </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        // flex:1,
        flexDirection: "row",
        columnGap: 8,
        marginBottom: 16,
        marginTop: 16,
        // alignItems:'center'
      },
  input: {
    position:'relative',
    fontSize: 16,
    padding: 10,
    textAlignVertical: "top",
    width:300,
    minHeight:20
    // minHeight:minHeight
  },
});

export default AutoGrowTextInput;
