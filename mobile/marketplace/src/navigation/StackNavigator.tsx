import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
//import MarketHomePage from '../screens/MarketHomePage';
//import ShopHomePage from '../screens/ShopHomePage';
// Add other imports as necessary

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="MarketHomePage" component={MarketHomePage} />
      <Stack.Screen name="ShopHomePage" component={ShopHomePage} />
      {/* Add all your routes here */}
    </Stack.Navigator>
  );
}
