// LoggedInTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from 'react-native-vector-icons';
import LoggedInView from './LoggedInView';
import GamesScreen from './GamesScreen';
import GameOneScreen from './GameOneScreen';
import LeaderboardScreen from '../LeaderboardScreen';

const Tab = createBottomTabNavigator();

export default function LoggedInTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Profil') {
            iconName = 'person'; 
          } else if (route.name === 'Igrice') {
            iconName = 'gamepad'; 
          } else if ( route.name === 'Game#1')
            iconName = 'gamepad';
            else if (route.name === 'Leaderboard') {
              iconName = 'leaderboard'; 
            }


          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'navy',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Profil" component={LoggedInView} />
      <Tab.Screen name="Igrice" component={GamesScreen} />
      <Tab.Screen name="Game#1" component={GameOneScreen}/>
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Tab.Navigator>
  );
}