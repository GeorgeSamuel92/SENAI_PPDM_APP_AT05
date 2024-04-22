import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DatabaseConnection } from "../../database/database";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";

const db = DatabaseConnection.getConnection();

export default function Home() {
  const navigation = useNavigation();

  const config = () => {
    navigation.navigate("Config");
  };

  function todosRegistros() {
    navigation.navigate("TodosRegistros");
  }

  function cadastroRegistro() {
    navigation.navigate("CadastroRegistro");
  }

  function pesquisaRegistros() {
    navigation.navigate("PesquisaRegistros");
  }

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS tbl_pessoas(id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, data_nasc DATE)",
        [],
        () => console.log("tbl_pessoas criada com sucesso"),
        (_, error) => console.error(error)
      );
    });
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS telefones_has_pessoas(telefone_id INTEGER NOT NULL, pessoas_id INTEGER NOT NULL, FOREIGN KEY (telefone_id) REFERENCES tbl_telefones, FOREIGN KEY (pessoas_id) REFERENCES tbl_pessoas(id), PRIMARY KEY (telefone_id, pessoas_id))",
        [],
        () => console.log("tbl_telefone_has_pessoas criada com sucesso"),
        (_, error) => console.error(error)
      );
    });
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.androidSafeArea}>

        <View>
        <Text style={styles.textTitle}>Cadastro de Registros</Text>
          <FontAwesome6 name="film" color="white" size={32} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={todosRegistros}>
            <Text style={styles.textButton}>Acessar Banco de Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pesquisaRegistros}>
            <Text style={styles.textButton}>Pesquisa Registro</Text>
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
  textTitle: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    height: 50,
    width: 300,
    backgroundColor: "yellow",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 10,
  },
});
