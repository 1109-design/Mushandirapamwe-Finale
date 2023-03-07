import React from "react";
import { StyleSheet } from "react-native";
import { NativeBaseProvider } from "native-base";

// npm i @react-navigation/bottom-tabs react-native-elements
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import Home from "./Screens/Home";
import LogComplaint from "./Screens/LogComplaint";
import Complaints from "./Screens/Complaints";
import Profile from "./Screens/Profile";
import FlashMessage from "react-native-flash-message";
import { ComplaintsScreenNavigator } from "./CustomNavigation";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const Tab = createBottomTabNavigator();

export default function ReactNavigationBottomTabs() {
  return (
    <>
      <ActionSheetProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarHideOnKeyboard: true,
              tabBarActiveTintColor: "#ff4757",
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
              component={ComplaintsScreenNavigator}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="list" color={color} size={size} />
                ),
                headerShown: false,
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
          <FlashMessage position="center" duration={2000} />
        </NavigationContainer>
      </ActionSheetProvider>
    </>
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
