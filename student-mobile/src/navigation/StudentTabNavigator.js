import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/discovery/HomeScreen';
import CollegeListScreen from '../screens/discovery/CollegeListScreen';
import CollegeCoursesScreen from '../screens/discovery/CollegeCoursesScreen';
import AboutScreen from '../screens/discovery/AboutScreen';
import ContactScreen from '../screens/discovery/ContactScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  Colleges: ['grid', 'grid-outline'],
  Courses: ['book', 'book-outline'],
  About: ['information-circle', 'information-circle-outline'],
  Contact: ['call', 'call-outline'],
};

export default function StudentTabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom || 0;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#334155',
        tabBarActiveBackgroundColor: '#EFF6FF',
        tabBarStyle: {
          height: 62 + bottomInset,
          paddingTop: 0,
          paddingBottom: bottomInset,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 8,
        },
        tabBarItemStyle: {
          flex: 1,
          height: 62,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 6,
          paddingBottom: 6,
          marginHorizontal: 0,
          borderRadius: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const [activeIcon, inactiveIcon] = TAB_ICONS[route.name] || [
            'ellipse',
            'ellipse-outline',
          ];
          return (
            <Ionicons
              name={focused ? activeIcon : inactiveIcon}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Colleges" component={CollegeListScreen} />
      <Tab.Screen name="Courses" component={CollegeCoursesScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
}