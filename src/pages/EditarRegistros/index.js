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
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DatabaseConnection } from "../../database/database";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";

const db = new DatabaseConnection().getConnection();

export default function EditarRegistros() {
  const navigation = useNavigation();

  const [Id, setId] = useState([]);
  const [nome, setNome] = useState(nome);
  const [numero, setNumero] = useState(numero);
  const [dataNas, setdataNas] = useState(dataNas);

  const handleEditarRegistros = () => {
    if (nome.trim() === "") {
      Alert.alert("Atenção", "Preencha o nome no campo");
      return;
    }
    if (numero.trim() === null) {
      Alert.alert("Atenção", "Preencha o número no campo");
      return;
    }
    if (dataNas.trim() === null) {
      Alert.alert("Atenção", "Preencha uma data no campo");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE registros SET nome=?, numero=?, dataNas=? WHERE Id=?",
        [nome, numero, dataNas, Id],
        (_, { rowsAffected }) => {
          console.log(rowsAffected);
          setNome("");
          setNumero(null);
          setdataNas(null);
          Alert.alert("Info", "Registro alterado com sucesso", [
            {
              onPress: () => {
                navigation.navigate("TodosRegistros");
              },
            },
          ]);
        },
        (_, error) => {
          console.error("Erro ao adicionar cadastro:", error);
          Alert.alert("Erro", "Ocorreu um erro ao adicionar o cliente.");
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
            placeholder="Informe o numero de telefone"
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
          onPress={handleEditarRegistros}
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
    paddingTop: Platform.OS === "android" ? getStatusBarHeight() : 0,
    marginTop: 10,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  viewTitle: {
    alignItems: "center",
    alignContent: "center",
    width: "100%",
  },
  clienteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropDown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonSalvar: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // width: "100%",
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
