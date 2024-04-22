import React, { useState } from "react";
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
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [dataNasc, setDataNasc] = useState("");

  const salvarRegistro = () => {
    
    if (nome.trim() === "") {
      Alert.alert("Atenção", "Preencha o nome no campo");
      return;
    }
    if (numero.trim() === null) {
      Alert.alert("Atenção", "Preencha o número no campo");
      return;
    }
    if (dataNasc.trim() === null) {
      Alert.alert("Atenção", "Preencha uma data valida no campo");
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO tbl_pessoas(nome, data_nasc) VALUES (?, ?)",
          [nome, dataNasc],
          (_, { insertId }) => {
            console.log(`Cliente inserido com ID: ${insertId}`);

            tx.executeSql(
              "INSERT INTO tbl_telefones(numero) VALUES (?)",
              [telefone,],
              (_, { insertId: telefoneId }) => {
                console.log(`Telefone inserido com ID: ${telefoneId}`);

                tx.executeSql(
                  "INSERT INTO telefones_has_pessoas(telefone_id, pessoas_id) VALUES (?, ?)",
                  [telefoneId, insertId],
                  (_, { rowsAffected }) => {
                    console.log(
                      `Associação de telefone com cliente realizada. Linhas afetadas: ${rowsAffected}`
                    );
                    Alert.alert("Cliente cadastrado com sucesso!");
                    setNome("");
                    setDataNasc("");
                    setTelefone("");
                  },
                  (_, error) => {
                    console.error(
                      "Erro ao associar telefone com cliente",
                      error
                    );
                    Alert.alert(
                      "Ocorreu um erro inesperado ao associar telefone com cliente"
                    );
                  }
                );
              },
              (_, error) => {
                console.error("Erro ao adicionar telefone", error);
                Alert.alert("Ocorreu um erro inesperado ao adicionar telefone");
              }
            );
          },
          (_, error) => {
            console.error("Erro ao adicionar cliente", error);
            Alert.alert("Ocorreu um erro inesperado ao adicionar cliente");
          }
        );
      },
      (_, error) => {
        console.error("Erro na transação principal", error);
        Alert.alert("Ocorreu um erro inesperado durante a transação");
      },
      () => {
        console.log("Transação completa");
      }
    );
  };

  // db.transction((tx) => {
  //   tx.executeSql(
  //     "INSERT INTO tbl_pessoas (nome, data_nasc) VALUES (?,?)",
  //     [nome, dataNasc],
  //     (_, { rowsAffected }) => {
  //       console.log(rowsAffected);
  //       setNome("");
  //       setNumero(null);
  //       Alert.alert("Info", "Registro incluíddo com sucesso");
  //     },
  //     (_, error) => {
  //       console.error("Erro ao adicionar tbl_pessoas:", error);
  //       Alert.alert("Erro", "Ocorreu um erro ao adicionar o cliente.");
  //     }
  //   );
  // });

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
            value={dataNasc}
            onChangeText={setDataNasc}
            placeholder="Data de Nascimento"
          />

          <TextInput
            style={styles.input}
            value={numero}
            onChangeText={setNumero}
            placeholder="Informe o numero"
          />
        </View>
        
        <TouchableOpacity style={styles.buttonSalvar} onPress={salvarRegistro}>
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
