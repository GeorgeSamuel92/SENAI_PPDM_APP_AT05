import React from "react";
import { StyleSheet, Platform, } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import cadastrar from "./src/pages/cadastrar";;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name="cadastrar"
            component={cadastrar}
            options={{
              title: "cadastrar",
              harderShown: false,
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
  containerScroll: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    gap: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonTable: {
    flexDirection: 'row',
    gap: 15
  }
});