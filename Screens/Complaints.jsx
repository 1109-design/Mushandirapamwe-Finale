import React from "react";
import { StyleSheet, Text, View } from "react-native";

// npm i @react-navigation/bottom-tabs react-native-elements
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

export default function Complaints() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Compaint</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
});
