import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent:'space-around' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={{marginLeft:8}}>
            <View style={{ padding: 10 }}>
              <Text style={[{ color: isFocused ? 'blue' : '#676767' },{fontSize:16, fontWeight:600}]}>
                {options.tabBarLabel}
               {route.name}
              </Text>
              {isFocused && <View style={{ height: 3, backgroundColor: 'blue' }} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CustomTabBar;
