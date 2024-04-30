// AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FoodAnalyticsScreen from '../screens/FoodAnalyticsScreen';

import AnalyticsScreen from '../screens/AnalyticsScreen';
import AnalyticsScreen2 from '../screens/AnalyticsScreen2';

import BloatingScreen from '../screens/BloatingScreen';

import BreakfastScreen from '../screens/BreakfastScreen';
import BreakfastScreen2 from '../screens/BreakfastScreen2';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import CameraScreen from '../screens/CameraScreen';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homescreen" component={HomeScreen} />
      <Stack.Screen name="Breakfast" component={BreakfastScreen2} />
      <Stack.Screen name="Bloating" component={BloatingScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen2} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Analytics') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: Colors.primary,
          inactiveTintColor: Colors.gray,
        }}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen2} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="FoodAnalytics" component={FoodAnalyticsScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
