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

  const todosRegistros = () => {
    navigation.navigate("TodosRegistros");
  };

  const cadastroRegistro = () => {
    navigation.navigate("CadastroRegistro");
  };

  const editarRegistros = () => {
    navigation.navigate("EditarRegistros");
  };

  const excluirRegistros = () => {
    navigation.navigate("ExcluirRegistros");
  };

  const pesquisaRegistros = () => {
    navigation.navigate("PesquisarRegistros");
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS registros (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, numero TEXT NOT NULL, data DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW', 'localtime')))",
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

          <TouchableOpacity style={styles.button} onPress={cadastroRegistro}>
            <Text style={styles.textButton}>Cadastro Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={editarRegistros}>
            <Text style={styles.textButton}>Editar Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={excluirRegistros}>
            <Text style={styles.textButton}>Excluir Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pesquisaRegistros}>
            <Text style={styles.textButton}>Pesquisar Registro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={todosRegistros}>
            <Text style={styles.textButton}>Todos os Registros</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alinharEmLinha}>
          <TouchableOpacity style={styles.buttonConfig} onPress={config}>
            <FontAwesome6 name="gear" color="red" size={30} />
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
    backgroundColor: "black",
    padding: 15,
    gap: 10,
  },
  alinharEmLinha: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 15,
  },
  button: {
    borderRadius: 30,
    backgroundColor: "red",
    height: 60,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 7,
    marginBottom: 30,
  },
  textButton: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  title: {
    fontSize: 26,
    letterSpacing: 6,
    textAlign: "center",
    color: "red",
    marginBottom: 30,
  },
  buttonTable: {
    flexDirection: "row",
    gap: 15,
  },
});
