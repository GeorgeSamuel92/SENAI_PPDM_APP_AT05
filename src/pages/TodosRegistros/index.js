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

export default function ExibeRegistros({ navigation }) {
  const [dados, setDados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  useEffect(() => {
    trazerDados();
  }, []);

  const trazerDados = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT tbl_pessoas.id, tbl_pessoas.nome AS nome_pessoa, tbl_pessoas.data_nasc AS data_nascimento, tbl_telefones.numero AS telefone, tbl_telefones.tipo AS tipo FROM tbl_pessoas INNER JOIN telefones_has_pessoas ON tbl_pessoas.id = telefones_has_pessoas.pessoa_id INNER JOIN tbl_telefones ON telefones_has_pessoas.telefone_id = tbl_telefones.id;",
          [],
          (_, { rows }) => {
            if (rows._array) {
              setDados(rows._array);
            }
          },
          (_, error) => console.error(error)
        );
      },
      null,
      null
    );
  };

  const handleDelete = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM tbl_pessoas WHERE id = ?;",
          [id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              trazerDados();
              Alert.alert("Cliente removido com sucesso!");
            }
          },
          (_, error) => {
            console.error("Erro ao excluir cliente", error);
            Alert.alert("Ocorreu um erro ao excluir cliente");
          }
        );
      },
      null,
      null
    );
  };

  const handleEdit = (item) => {
    setClienteSelecionado(item);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!clienteSelecionado) {
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE tbl_pessoas SET nome = ?, data_nasc = ? WHERE id = ?;",
          [clienteSelecionado.nome_cliente, clienteSelecionado.data_nascimento, clienteSelecionado.id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              trazerDados();
              Alert.alert("Cliente atualizado com sucesso!");
              setModalVisible(false);
            }
          },
          (_, error) => {
            console.error("Erro ao atualizar cliente", error);
            Alert.alert("Ocorreu um erro ao atualizar cliente");
          }
        );
      },
      null,
      null
    );
  };

  const renderDados = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.text}>{item.nome_cliente}</Text>
        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.text}>{item.data_nascimento}</Text>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.text}>{item.telefone}</Text>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.text}>{item.tipo}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dados}
        renderItem={renderDados}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Editar Cliente</Text>
            <TextInput
              style={styles.input}
              value={clienteSelecionado ? clienteSelecionado.nome_cliente : ""}
              onChangeText={(text) => setClienteSelecionado({ ...clienteSelecionado, nome_cliente: text })}
              placeholder="Nome do cliente"
            />
            <TextInput
              style={styles.input}
              value={clienteSelecionado ? clienteSelecionado.data_nascimento : ""}
              onChangeText={(text) => setClienteSelecionado({ ...clienteSelecionado, data_nascimento: text })}
              placeholder="Data de Nascimento"
            />
            <TextInput
              style={styles.input}
              value={clienteSelecionado ? clienteSelecionado.telefone : ""}
              placeholder="Telefone"
              editable={false}
            />
            <TextInput
              style={styles.input}
              value={clienteSelecionado ? clienteSelecionado.tipo : ""}
              placeholder="Tipo"
              editable={false} 
            />
            <View style={styles.modalButtonContainer}>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#2196F3" }}
                onPress={handleSave}
              >
                <Text style={styles.textStyle}>Salvar</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#f44336" }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  dataContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  editButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "80%",
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

