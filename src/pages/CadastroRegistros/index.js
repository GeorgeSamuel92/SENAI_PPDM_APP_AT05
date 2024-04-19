import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { DatabaseConnection } from "../../database/database";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

const db = new DatabaseConnection().getConnection();

export default function cadastrar() {
  const [todos, setTodos] = useState([]);
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState(null);

  const atualizarRegistros = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM registros", [], (_, { rows }) =>
          setTodos(rows._array)
        );
      });
    } catch (error) {
      console.error("Erro ao buscar todos:", error);
    }
  };

  const CadastroRegistro = () => {
    useEffect(() => {
      atualizarRegistros();
    }, []);

    if (nome.trim() === "") {
      Alert.alert("Atenção", "Preencha o nome no campo");
      return;
    }
    if (numero.trim() === null) {
      Alert.alert("Atenção", "Preencha o número no campo");
      return;
    }
  };

  db.transction((tx) => {
    tx.executeSql(
      "INSERT INTO cadastro (nome, numero) VALUES (?,?)",
      [nome, numero],
      (_, { rowsAffected }) => {
        console.log(rowsAffected);
        setNome("");
        setNumero(null);
        Alert.alert("Info", "Registro incluíddo com sucesso");
        atualizarRegistros();
      },
      (_, error) => {
        console.error("Erro ao adicionar cadastro:", error);
        Alert.alert("Erro", "Ocorreu um erro ao adicionar o cliente.");
      }
    );
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <View style={styles.container}>
          <View style={styles.viewTitle}>
            <Text style={styles.title}>Novo registro</Text>
          </View>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Informe o nome"
          />

          <TextInput
            style={styles.input}
            value={numero}
            onChangeText={setNumero}
            placeholder="Informe o numero"
          />
        </View>
        <TouchableOpacity style={styles.buttonSalvar} onPress={CadastroRegistro}>
          <Text style={styles.buttonTitle}>Salvar</Text>
          <FontAwesome6 name="check" size={32} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? getStatusBarHeight() : 0,
    marginTop: 10,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    gap: 10,
  },
});
