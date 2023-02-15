import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { Icon, Badge } from "react-native-elements";
import axios from "axios";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { withBadge } from "react-native-elements";

export default function Complaints({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isConditionMet, setIsConditionMet] = useState(false);
  const [animating, setAnimating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    StatusBar.setBarStyle("dark-content", false);
    axios
      .get(`http://172.16.13.49:8002/api/retrieve-complaints`)
      .then(function (response) {
        setIsLoading(false);
        return response.data;
      })
      .then((responseData) => {
        setAnimating(false);
        setFilteredUsers(responseData);
        console.log(responseData);
        showMessage({
          message: "Your complaints has been received retrieved",
          type: "success",
        });
      })
      .catch((error) => {
        // Handle any errors that occur
        console.log(error);

        showMessage({
          message: "Failed to retrieve. Check your network connection",
          type: "danger",
        });
      });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    axios
      .get(`http://172.16.13.49:8002/api/retrieve-complaints`)
      .then(function (response) {
        setIsLoading(false);
        return response.data;
      })
      .then((responseData) => {
        setAnimating(false);
        setFilteredUsers(responseData);
       ToastAndroid.show("List sucessfully updated", ToastAndroid.SHORT);
      })
      .catch((error) => {
        // Handle any errors that occur
        console.log(error);
        ToastAndroid.show("Failed due to network error", ToastAndroid.SHORT);
      });
       setRefreshing(false);
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 0 }}>
      <ActivityIndicator size="small" color="#0000ff" animating={isLoading} />
      <View style={styles.container}>
        <View style={styles.searchView}>
          <View style={styles.inputView}>
            <TextInput
              defaultValue={searchText}
              style={styles.input}
              placeholder="Search"
              textContentType="name"
              returnKeyType="search"
            />
            {searchText.length === 0 ? (
              <TouchableOpacity>
                <Icon name="search" size={24} color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearchText("");
                  setFilteredUsers([]);
                }}
              >
                <Icon name="cancel" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {filteredUsers.length > 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => navigation.navigate("ComplaintDescription")}
              >
                <Image
                  style={styles.userImage}
                  source={require("../assets/jabawi.jpg")}
                  // source={{ uri: user.picture?.large }}
                />
                <View style={styles.userCardRight}>
                  {/* <Text
                    style={{ fontSize: 18, fontWeight: "500" }}
                  >{`${user.full_name}`}</Text> */}
                  <Text
                    style={{ fontSize: 16, fontWeight: "400" }}
                  >{`${user.full_name}`}</Text>
                  <Text
                    style={{ fontSize: 14, fontWeight: "300" }}
                  >{`${user?.category}`}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "300" }}>
                    <Badge
                      value={user?.status}
                      status={
                        user?.status == "Pending"
                          ? "warning"
                          : user?.status == "Work In Progress"
                          ? "primary"
                          : "success"
                      }
                    />
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 50 }}></View>
          </ScrollView>
        ) : (
          <View style={styles.messageBox}>
            <Text style={styles.messageBoxText}>No complaints reported</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchView: {
    display: "flex",
    flexDirection: "row",
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: "#dfe4ea",
    paddingHorizontal: 10,
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  userCard: {
    backgroundColor: "#fafafa",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
  messageBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBoxText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
