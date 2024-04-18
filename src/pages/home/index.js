import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DatabaseConnection } from "../../database/database";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation, StackActions } from "@react-navigation/native";

const db = DatabaseConnection.getConnection();

export default function Home() {
  const navigation = useNavigation();

  const config = () => {
    navigation.navigation("Config");
  };

  const todosRegistros = () => {
    navigation.navigation("TodosRegistros");
  };

  const cadastroRegistro = () => {
    navigation.navigation("CadastroRegistro");
  };

  const editarRegistro = () => {
    navigation.navigation("EditarRegistro");
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS registros (id INTEGER PRIMARY KEY AUTOINCREMENT, filme TEXT NOT NULL, genero TEXT NOT NULL, classificacao TEXT NOT NULL, data DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime')))",
        [], //[]: Este é o array de parâmetros. Como não estamos usando nenhum parâmetro na consulta SQL, deixamos esse array vazio.
        () => console.log("Tabela criada com sucesso"), //retorno de  sucesso
        // '_' É um parâmetro que representa o resultado da transação SQL, por convenção utiliza-se o underscore. para indicar que estamos ignorando esse valor.
        (_, error) => console.error(error) //retorno de  erro
      );
    });
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Cadastro de Registros</Text>
          <FontAwesome6 name="film" color="white" size={32} />


          <TouchableOpacity style={styles.button} onPress={cadastroRegistro}>
            <Text style={styles.textButton}>Incluir Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={todosRegistros}>
            <Text style={styles.textButton}>Accessar Banco de Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={editarRegistro}>
            <Text style={styles.textButton}>Editar Registro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={cadastroRegistro}>
            <Text style={styles.textButton}>Cadastro de Registro</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.alinharEmLinha}>
          <TouchableOpacity style={styles.buttonConfig} onPress={config}>
            <FontAwesome6 name="gear" color="#4b2379" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? getStatusBarHeight() : 0,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    gap: 10,
  },
});
