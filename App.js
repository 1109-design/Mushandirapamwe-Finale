import React from "react";
import { StyleSheet, Text, View } from "react-native";

// npm i @react-navigation/bottom-tabs react-native-elements
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Home from "./Screens/Home";
import LogComplaint from "./Screens/LogComplaint";
import Complaints from "./Screens/Complaints";
import Profile from "./Screens/Profile";



const Tab = createBottomTabNavigator();

export default function ReactNavigationBottomTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          // inactiveBackgroundColor: "#ced6e0",
          activeTintColor: "#ff4757",
        }}
        tabBarOptions={{
          activeTintColor: "#ff4757",
          inactiveBackgroundColor: "#ced6e0",
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Log Complaint"
          component={LogComplaint}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="message" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Complaints"
          component={Complaints}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="list" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
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
