/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import React from 'react';
import { useRef } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './components/Home';
import QrCode from './components/QrCode';
import Chat from './components/Chat';


const App = () => {

  const Stack = createNativeStackNavigator();
  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Qrcode" component={QrCode} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};


export default App;
