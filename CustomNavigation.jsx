import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Complaints from "./Screens/Complaints";
import NestedScreen from "./Screens/NestedScreen";

const Stack = createStackNavigator(); // creates object for Stack Navigator

const ComplaintsScreenNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Complaint"
        component={Complaints}
      />
      <Stack.Screen
        name="More Info"
        component={NestedScreen}
        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export { ComplaintsScreenNavigator }; // Stack-Navigator for complaints Tab
