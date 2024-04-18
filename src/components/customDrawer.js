import { View, Text, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default function CustomDrawer(props) {
  return (
  <DrawerContentScrollView {...props}>
    <View style={styles.customView}>

      {/* <Image
        source={require("../assets/perfil.png")}
        style={styles.imagem}>

        </Image> */}

      <Text style={styles.texto}>Teste</Text>

    </View>

    <DrawerItemList {...props} />
  </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  customView: {
    width: "100%",
    alignItems: " center",
    justifyContent: "center",
    marginTop: 30,
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  texto: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 35,
  },
});
