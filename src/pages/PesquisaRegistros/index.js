import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { DatabaseConnection } from "../../database/database";
import { SafeAreaProvider } from "react-native-safe-area-context";

const db = new DatabaseConnection.getConnection();

export default function PesquisaCliente() {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);

  const pesquisarCliente = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT tbl_pessoas.id, tbl_pessoas.nome AS nome_pessoas, tbl_telefones.numero AS telefone FROM tbl_pessoas INNER JOIN telefones_has_pessoas ON tbl_pessoas.id = telefones_has_pessoas.pessoa_id INNER JOIN tbl_telefones ON telefones_has_pessoas.telefone_id = tbl_telefones.id WHERE tbl_pessoas.nome LIKE ? OR tbl_telefones.numero LIKE ?;",
          [`%${pesquisa}%`, `%${pesquisa}%`],
          (_, { rows }) => {
            setResultados(rows._array);
          },
          (_, error) => console.error(error)
        );
      },
      null,
      null
    );
  };

  const renderResultado = ({ item }) => (
    <TouchableOpacity style={styles.resultadoContainer}>
      <Text style={styles.resultadoText}>{item.nome_pessoas}</Text>
      <Text style={styles.resultadoText}>{item.telefone}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Digite o nome ou telefone do cliente"
          />
          <Button title="Pesquisar" onPress={pesquisarCliente} />
          <FlatList
            data={resultados}
            renderItem={renderResultado}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => <Text>Nenhum resultado encontrado</Text>}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  resultadoContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  resultadoText: {
    fontSize: 16,
  },
});

