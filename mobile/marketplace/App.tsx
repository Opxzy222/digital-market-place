import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homepage from './src/screens/Homepage';
import ShopHomePage from './src/screens/shop/ShopHomePage';
// Import your types
import { RootStackParamList } from './src/types/navigation';

// Create a typed stack navigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* Stack Navigator */}
      <Stack.Navigator initialRouteName="Homepage">
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="ShopHomePage"
          component={ShopHomePage}
          options={{ title: 'Shop Home' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
