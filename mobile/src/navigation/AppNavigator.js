import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import VoiceAssistantScreen from '../screens/VoiceAssistantScreen';
import DocumentScreen from '../screens/DocumentScreen';
import SchoolLookupScreen from '../screens/SchoolLookupScreen';
import SchoolDetailScreen from '../screens/SchoolDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for the School lookup flow
const SchoolStackNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4285F4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SchoolLookup" 
        component={SchoolLookupScreen} 
        options={{ title: t('schools.title') }} 
      />
      <Stack.Screen 
        name="SchoolDetail" 
        component={SchoolDetailScreen}
        options={({ route }) => ({ title: route.params?.schoolName || t('schools.detail') })}
      />
    </Stack.Navigator>
  );
};

// Stack navigator for the Document flow
const DocumentStackNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4285F4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Documents" 
        component={DocumentScreen} 
        options={{ title: t('documents.title') }} 
      />
    </Stack.Navigator>
  );
};

// Main tab navigator
const AppNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chat') {
            iconName = 'message-circle';
          } else if (route.name === 'Voice') {
            iconName = 'mic';
          } else if (route.name === 'DocumentStack') {
            iconName = 'file-text';
          } else if (route.name === 'SchoolStack') {
            iconName = 'book';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4285F4',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4285F4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('home.title') }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ title: t('chat.title') }} 
      />
      <Tab.Screen 
        name="Voice" 
        component={VoiceAssistantScreen} 
        options={{ title: t('voice.title') }} 
      />
      <Tab.Screen 
        name="DocumentStack" 
        component={DocumentStackNavigator} 
        options={{ 
          headerShown: false,
          title: t('documents.tab_title')
        }} 
      />
      <Tab.Screen 
        name="SchoolStack" 
        component={SchoolStackNavigator} 
        options={{ 
          headerShown: false,
          title: t('schools.tab_title')
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: t('settings.title') }} 
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
