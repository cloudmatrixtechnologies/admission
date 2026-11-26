import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabNavigator from './StudentTabNavigator';
import CollegeDetailScreen from '../screens/discovery/CollegeDetailScreen';
import WishlistScreen from '../screens/dashboard/WishlistScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={StudentTabNavigator} />
        <RootStack.Screen name="CollegeDetail" component={CollegeDetailScreen} />
        <RootStack.Screen name="Wishlist" component={WishlistScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}