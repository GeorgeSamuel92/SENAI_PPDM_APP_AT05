import React from "react";
import { StyleSheet, Platform, } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getStatusBarHeight } from "react-native-status-bar-height";

import home from "./src/pages/home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name="Home"
            component={home}
            options={{
              title: "home",
              headerShown: false // mostra nome da pagina
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    marginTop: 10
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    gap: 10
  },
  
});