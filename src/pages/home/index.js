import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DatabaseConnection } from "../../database/database";
import {
  SafeAreaProvider,
  safeAreaProvider,
} from "react-native-safe-area-context";

const db = DatabaseConnection.getConnection();

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [operacao, setOperacao] = useState("Incluir");
  const [id, setId] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS smartphones (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL)",
        [],
        () => console.log("Tabela criada com sucesso"),
        (_, error) => console.error(error)
      );
    });
  }, [todos]);

  // const navigation = useNavigation();

  // function navegaDetalhes() {
  //   navigation.navigate("Detalhes");
  // }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite um novo cliente"
          />
          <Button title="Adicionar" onPress={salvaCliente} />
          <Button
            title="Excluir Banco de dados"
            onPress={() => {
              Alert.alert(
                "Atenção!",
                "Deseja excluir o banco de dados? Todos os registros serão perdidos. Esta ação não pode ser desfeita!",
                [
                  {
                    text: "OK",
                    onPress: () => deleteDatabase,
                  },
                  {
                    text: "Cancelar",
                    onPress: () => {
                      return;
                    },
                  },
                ]
              );
            }}
          />

          <Text style={styles.title}>Clientes Cadastrados</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
