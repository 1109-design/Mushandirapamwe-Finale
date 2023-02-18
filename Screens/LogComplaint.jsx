import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ToastAndroid,
} from "react-native";
import { Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LogComplaint() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [description, setDescription] = useState(null);

  //getting location permissions and cordinates

  useEffect(() => {
    (async () => {
      //get logged in user data

      try {
        const value = await AsyncStorage.getItem("profileData");
        const data = JSON.parse(value);
        console.log(data);

        if (value !== null) {
          setFullName(data.fullName);
          setPhoneNumber(data.phoneNumber);
          //  setDisplayIdNumber(data.IdNumber);
          //  setHideOnInitialLogin("");
        } else if (value == null) {
          showMessage({
            message: "Set up your profile to proceed",
            type: "danger",
          });
        }
      } catch (error) {
        console.log(error);
        showMessage({
          message:
            "We are facing a trouble retrieving your info.Try again later",
          // description: error,
          type: "error",
        });
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocation(location.coords);

      ToastAndroid.show(
        "We have successfully retrieved your location",
        ToastAndroid.SHORT
      );
    })();
  }, []);

  //  let text = "Waiting..";
  //  if (errorMsg) {
  //    text = errorMsg;
  //  } else if (location) {
  //    text = JSON.stringify(location);
  //  }

  //submitting the form

  const submitComplaintHandler = () => {
    var signupData = JSON.stringify({
      full_name: fullName,
      phone_number: phoneNumber,
      category: category,
      description: description,
      latitude: latitude,
      longitude: longitude,
    });
    console.log(signupData);

    if (category == "" || description == "" ) {
      showMessage({
        message: "Fill out the whole form",
        description: "All Form fields are required",
        type: "danger",
      });
      return;
    }
    if(latitude == null){
      let location =  Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocation(location.coords);
    }

    //clearing the fields

    setCategory("");
    setDescription("");

    fetch(`http://172.16.13.49:8002/api/store-complaint`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data"
        "content-type": "undefined",
      },
      body: signupData,
    })
      .then((response) => {
        response = response.json();
        // console.log(response);
        return response;
      })
      .then((responseData) => {
        // console.log(JSON.stringify(data));
        "POST Response " + responseData;
        // data = JSON.stringify(data);
        console.log(responseData);
        if (responseData.code == 200) {
          showMessage({
            message: "Your complaint has been logged successfully",
            type: "success",
          });
        }
        // console.log("submitted");
      })
      .catch((error) => {
        console.log(error);
        showMessage({
          message: "Oops..Failed to report.Check your network connection",
          type: "danger",
        });
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.bigCircle}></View>
        <View style={styles.smallCircle}></View>
        <View style={styles.centerizedView}>
          <View style={styles.authBox}>
            <View style={styles.logoBox}>
              <Icon
                color="#fff"
                name="comments"
                type="font-awesome"
                size={50}
              />
            </View>
            <Text style={styles.loginTitleText}></Text>
            <View style={styles.hr}></View>
            <View style={styles.inputBox}>
              {/* <Text style={styles.inputLabel}>Category</Text> */}
              <Picker
                selectedValue={category}
                onValueChange={(value, index) => setCategory(value)}
                mode="dropdown" // Android only
                style={(styles.input, { marginTop: 0, height: 50 })}
              >
                <Picker.Item label="Please select category" value="Unknown" />
                <Picker.Item label="Water Burst" value="Water Burst" />
                <Picker.Item label="Sewer Blockage" value="Sewer Blockage" />
                <Picker.Item
                  label="Refuse Collection"
                  value="Refuse Collection"
                />
                <Picker.Item label="Bill Enquiry" value="Bill Enquiry" />
                <Picker.Item label="Road Works" value="Road Works" />
                <Picker.Item label="Traffic Lights" value="Traffic Lights" />
                <Picker.Item label="Double Billing" value="Double Billing" />
                <Picker.Item
                  label="Statement Requests"
                  value="Statement Requests"
                />
                <Picker.Item label="Road Works" value="Fire Hazards" />
              </Picker>
            </View>

            <View style={styles.inputBox}>
              {/* <Text style={styles.inputLabel}>Descriprion</Text> */}
              <TextInput
                style={[
                  styles.input,
                  {
                    height: 100,
                    paddingVertical: 10,
                    textAlignVertical: "top",
                    marginTop: 2,
                  },
                  // { marginTop: 0, height: 50 },
                ]}
                multiline={true}
                autoCapitalize={false}
                placeholder={"Describe your issue here."}
                onChangeText={(input) => setDescription(input)}
                value={description}
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>My Location</Text>
              <TextInput
                style={styles.input}
                autoCapitalize={false}
                editable={false}
                selectTextOnFocus={false}
                // placeholder={"work"}
                //  Longitude : {longitude} Latitude :{latitude}
                value={
                  "Long :" + " " + longitude + " | " + "Lat :" + " " + latitude
                }
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={submitComplaintHandler}
            >
              <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlashMessage position="top" duration={4000} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  bigCircle: {
    width: Dimensions.get("window").height * 0.7,
    height: Dimensions.get("window").height * 0.7,
    backgroundColor: "#ff6b81",
    borderRadius: 1000,
    position: "absolute",
    right: Dimensions.get("window").width * 0.25,
    top: -50,
  },
  smallCircle: {
    width: Dimensions.get("window").height * 0.4,
    height: Dimensions.get("window").height * 0.4,
    backgroundColor: "#ff7979",
    borderRadius: 1000,
    position: "absolute",
    bottom: Dimensions.get("window").width * -0.2,
    right: Dimensions.get("window").width * -0.3,
  },
  centerizedView: {
    width: "100%",
    top: "15%",
  },
  authBox: {
    width: "80%",
    backgroundColor: "#fafafa",
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: "#eb4d4b",
    borderRadius: 1000,
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: -50,
    marginBottom: -50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginTitleText: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },
  hr: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#444",
    marginTop: 0,
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#dfe4ea",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#ff4757",
    marginTop: 30,
    paddingVertical: 10,
    borderRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
  },
});
