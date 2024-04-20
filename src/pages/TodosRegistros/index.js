import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { DatabaseConnection } from "../../database/database";
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import {
  useNavigation,
  StackActions,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
// import { LinearGradient } from 'expo-linear-gradient';

// Abra ou crie o banco de dados SQLite
const db = new DatabaseConnection.getConnection();

const windowWidth = Dimensions.get("window").width;

export default function TodosRegistros() {
  const navigation = useNavigation();

  const [todos, setTodos] = useState([]);
  const [textPesquisa, setTextPesquisa] = useState(null);
  const [refresh, setRefresh] = useState(
    route.params?.refresh ? route.params.setRefresh : false
  );

  const newItem = () => {
    navigation.navigate("NewItem");
  };

  useFocusEffect(
    useCallback(() => {
      // console.log(todos.length);
      if (todos.length !== 0) {
        pesquisaRegistros();
      }
    }, [refresh])
  );

  const pesquisaRegistros = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM filmes",
          //'_array' é uma propriedade do objeto rows retornado pela consulta SQL, em rows._array, o '_' não se refere diretamente a rows, mas sim ao objeto retornado pela transação SQL.
          [],
          (_, { rows }) =>
            // O '_array' é uma propriedade desse objeto que contém os resultados da consulta em forma de array.
            // console.log(rows)
            setTodos(rows._array)
        );
      });
    } catch (error) {
      console.error("Erro ao buscar todos:", error);
    }
  };

  const filtraRegistros = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM registros where nome like ? OR numero like ?",
          //'_array' é uma propriedade do objeto rows retornado pela consulta SQL, em rows._array, o '_' não se refere diretamente a rows, mas sim ao objeto retornado pela transação SQL.
          [`${textPesquisa}%`, `${textPesquisa}%`, ],
          (_, { rows }) =>
            // O '_array' é uma propriedade desse objeto que contém os resultados da consulta em forma de array.
            // console.log(textPesquisa,rows._array),
            setTodos(rows._array)
        );
      });
    } catch (error) {
      console.error("Erro ao buscar todos:", error);
    }
  };

  useEffect(() => {
    filtraRegistros();
  }, [textPesquisa]);

  useEffect(() => {
    pesquisaRegistros();
  }, []);
}
