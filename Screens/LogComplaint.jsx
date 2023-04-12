import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import { Icon } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Camera, CameraType } from "expo-camera";
import axios from "axios";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function LogComplaint({ navigation }) {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCameraRollPermission, setCameraRollPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // console.log(result)
        setSelectedImage(result.assets[0].uri);
   
    }
  };

  const handleSelectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // console.log(result);
      setSelectedImage(result.assets[0].uri);
    }
  };

  const update = {
    update: true,
  };

  //getting location permissions and cordinates

  useEffect(() => {
    (async () => {
      //get logged in user data

      try {
        const value = await AsyncStorage.getItem("profileData");
        const data = JSON.parse(value);
        // console.log(data);

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
        // console.log(error);
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
        alert(
          "Permission to access location was denied. Please enable location access in your device settings to continue."
        );
        return;
      }
      let retries = 0;
      while (retries < 4) {
        try {
          let location = await Location.getCurrentPositionAsync({});
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
          setLocation(location.coords);
          console.log(location.coords);

          break;
        } catch (error) {
          retries++;
          console.log(`Error getting location: ${error.message}`);
        }
      }
      setLoading(false);
      //Camera Permissions

      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === "granted");
      } catch (error) {
        console.log(error);
      }

      // requestCameraPermission;r

      // const requestCameraPermission = async () => {
      //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
      //   if (status !== "granted") {
      //     alert("Camera permission is required");
      //   }
      // };

      //end Camera permissions

      ToastAndroid.show(
        "We have successfully retrieved your location",
        ToastAndroid.SHORT
      );
    })();
  }, []);

  // if (loading) {
  //   return <ActivityIndicator size="large" />;
  // }

  //submitting the form

  const submitComplaintHandler = () => {
    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("phone_number", phoneNumber);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("complaintImage", {
      uri: selectedImage,
      type: "image/jpeg",
      name: "complaint.jpg",
    });
    console.log(formData);
    // console.log(selectedImage);
    // var signupData = JSON.stringify({
    //   full_name: fullName,
    //   phone_number: phoneNumber,
    //   category: category,
    //   description: description,
    //   latitude: latitude,
    //   longitude: longitude,
    //   complaintImage : selectedImage

    // });
    // console.log(signupData);

    if (category == "" || description == "" || latitude == null) {
      showMessage({
        message: "Fill out the whole form",
        description: "All Form fields are required",
        type: "danger",
      });
      return;
    }
    if (latitude == null) {
      // let { status } =  Location.requestForegroundPermissionsAsync();
      // if (status !== "granted") {
      //   setErrorMsg("Permission to access location was denied");
      //   return;
      // }

      let location = Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocation(location.coords);
      // console.log(location.coords);
    }

    //clearing the fields

    setCategory("");
    setDescription("");

    fetch(`http://172.16.9.235:8008/api/store-complaint`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data"
        // "content-type": "undefined",
      },
      body: formData,
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
        // console.log(responseData);
        if (responseData.code == 200) {
          showMessage({
            message: "Your complaint has been logged successfully",
            type: "success",
          });
          navigation.navigate("Complaints", { update });
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

  // camera logic

  const takePicture = async () => {
    if (camera) {
      await camera.pausePreview(); // Pause the camera preview
      const pictureSizes = await camera.getAvailablePictureSizesAsync("4:3");
      console.log("pictureSizes:", pictureSizes);
      const pictureSize = pictureSizes[pictureSizes.length - 1];
      setTimeout(async () => {
        try {
          const options = { ratio: "4:3", quality: 0.5, base64: true };
          const data = await camera.takePictureAsync(options);
          console.log(data.uri);
        } catch (error) {
          console.log("Error taking picture: ", error);
        } finally {
          try {
            await camera.resumePreview();
          } catch (error) {
            console.log(error);
          }
        }
      }, 2000); // Wait for 2 seconds before taking the picture
    }
  };
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      showMessage({
        message: "Image uploaded successfully",
        type: "success",
      });
      setImageUri(result.assets[0].uri);
    }
    console.log(result.assets[0].uri);
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
              {selectedImage && (
                <View style={{ position: "relative", width: 250, height: 100 }}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    style={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <Text
                      style={{
                        color: "white",
                        backgroundColor: "red",
                        padding: 5,
                        borderRadius: 5,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.inputBox}>
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
            <View style={styles.hr}></View>
            <View style={styles.inputBox}>
              <View style={styles.buttonContainer}>
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleTakePhoto}
                  >
                    <Text style={styles.buttonText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSelectPhoto}
                  >
                    <Text style={styles.buttonText}>
                      Select Photo from Gallery
                    </Text>
                  </TouchableOpacity>
                </>
              </View>
            </View>

            <View style={styles.hr}></View>

            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>My Location</Text>
              {loading && <ActivityIndicator size="small" />}
              {!loading && (
                <TextInput
                  style={styles.input}
                  autoCapitalize={false}
                  editable={false}
                  selectTextOnFocus={false}
                  // placeholder={"work"}
                  //  Longitude : {longitude} Latitude :{latitude}
                  value={
                    "Long :" +
                    " " +
                    longitude +
                    " | " +
                    "Lat :" +
                    " " +
                    latitude
                  }
                />
              )}
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
    top: "8%",
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
  cameraButton: {
    backgroundColor: "grey",
    // marginTop: 30,
    // paddingVertical: 10,
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
  button: {
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // position: "absolute",
    // bottom: 100,
    paddingHorizontal: 20,
    paddingVertical: 5,
    // width: "100%",
    // backgroundColor: "#dfe4ea",
  },
  camera: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
    margin: 5,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
