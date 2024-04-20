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
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { DatabaseConnection } from "../../database/database";

const db = new DatabaseConnection().getConnection();

export default function CadastroRegistros() {
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [dataNas, setdataNas] = useState("");

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

  useEffect(() => {
    atualizarRegistros();
  }, []);

  const handleCadastroRegistros = () => {
    if (nome.trim() === "") {
      Alert.alert("Atenção", "Preencha o nome no campo");
      return;
    }
    if (numero.trim() === "") {
      Alert.alert("Atenção", "Preencha o número no campo");
      return;
    }
    if (dataNas.trim() === "") {
      Alert.alert("Atenção", "Preencha uma data no campo");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO registros (nome, numero, dataNas) VALUES (?, ?, ?)",
        [nome, numero, dataNas],
        (_, { rowsAffected }) => {
          console.log(rowsAffected);
          setNome("");
          setNumero("");
          setdataNas("");
          Alert.alert("Info", "Registro incluído com sucesso");
          atualizarRegistros();
        },
        (_, error) => {
          console.error("Erro ao adicionar cadastro:", error);
          Alert.alert("Erro", "Ocorreu um erro ao adicionar o registro.");
        }
      );
    });
  };

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
            placeholder="Informe o número de telefone"
          />
          <TextInput
            style={styles.input}
            value={dataNas}
            onChangeText={setdataNas}
            placeholder="Informe sua data de nascimento"
          />
        </View>
        <TouchableOpacity
          style={styles.buttonSalvar}
          onPress={handleCadastroRegistros}
        >
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginTop: 10,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    gap: 10,
  },
  viewTitle: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonSalvar: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#7a42f4",
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 1,
    shadowColor: "black",
    shadowRadius: 5,
    gap: 10,
    padding: 10,
  },
  buttonTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});
