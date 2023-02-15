import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { Icon } from "react-native-elements";
import { ListItem, Left, Right, Radio, Content } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

export default function PaymentScreen1({ navigation }) {
 const [fullName, setFullName] = useState("");
 const [phoneNumber, setPhoneNumber] = useState("");
 const [idNumber, setIdNumber] = useState("");

 const [displayIdNumber, setDisplayIdNumber] = useState("");
 const [displayPhoneNumber, setDisplayPhoneNumber] = useState("");
 const [displayFullName, setDisplayFullName] = useState("");
  const [hideOnInitialLogin, setHideOnInitialLogin] = useState("God Is Good");


//saving and updating profile


  const submitHandler = async (value) => {
    try {
      // validation rules

      if (
        fullName == "" ||
        phoneNumber == ""
      ) {
        showMessage({
          message: "Make sure  you have filled out all required fileds",
          type: "danger",
        });
        return;
      }
       if (fullName.length < 5 || phoneNumber.length < 10) {
         showMessage({
           message: "The minimum number of characters required is 10",
           type: "danger",
         });
         return;
       }

       const items = 
       {
         fullName : fullName,
         phoneNumber : phoneNumber,
         IdNumber : idNumber,
       };
      //  console.log(items);
        // console.log(JSON.stringify(items));
        // return;
      await AsyncStorage.setItem("profileData", JSON.stringify(items));
       showMessage({
         message: "Profile has been updated successfully",
        //  description: "Update your information when neccessary",
         type: "success",
       });

             setDisplayFullName(fullName);
             setDisplayPhoneNumber(phoneNumber);
             setDisplayIdNumber(idNumber);

        setFullName("");
        setIdNumber("");
        setPhoneNumber("");
    } catch (error) {
      showMessage({
        message:error,
        description: error,
        type: "error",
      });
    }
  };


  useEffect(() => {
    StatusBar.setBarStyle("light-content", true);


(async () => {
  try {
    const value = await AsyncStorage.getItem("profileData");
    const data = JSON.parse(value);
    // console.log(data.fullName);

    if (value !== null) {

      setDisplayFullName(data.fullName);
      setDisplayPhoneNumber(data.phoneNumber);
      setDisplayIdNumber(data.IdNumber);
      setHideOnInitialLogin("");
      // console.log(data);
     
      
    }
    else if(value == null)
    {

      showMessage({
        message: "Set up your profile to proceed",
        type: "danger",
      });


    }
    
    
  } catch (error) {
    // console.log(error)
   showMessage({
     message: "We are facing a trouble retrieving your info.Try again later",
    //  description: error,
     type: "error",
   });
  }
})();
  }, []); 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            paddingRight: 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="angle-left" type="font-awesome" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.paymentTitle}>My Profile</Text>
      <View style={styles.cartContainer}>
        <View>
          {!displayFullName || hideOnInitialLogin ? (
            <View>
              <View style={styles.couponInputView}>
                <TextInput
                  placeholder="Full Name"
                  style={styles.couponInput}
                  onChangeText={(input) => setFullName(input)}
                  value={fullName}
                />
              </View>
              <View style={styles.couponInputView}>
                <TextInput
                  placeholder="Phone Number"
                  style={styles.couponInput}
                  onChangeText={(input) => setPhoneNumber(input)}
                  keyboardType="numeric"
                  value={phoneNumber}
                />
              </View>
              <View style={styles.couponInputView}>
                <TextInput
                  placeholder="ID Number (Optional)"
                  style={styles.couponInput}
                  onChangeText={(input) => setIdNumber(input)}
                  value={idNumber}
                />
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={submitHandler}
              >
                <Text style={styles.checkoutButtonText}>Update Profile</Text>
              </TouchableOpacity>

              {/* my credentials section */}
            </View>
          ) : (
            <View>
              <View style={styles.subtotalView}>
                <Text style={styles.subtotalText}>My Creditentials</Text>
                <Text style={styles.subtotalPrice}></Text>
              </View>
              <View style={styles.shippingView}>
                <View style={styles.shippingItemsView}>
                  <Text>Name: {displayFullName ? displayFullName : " "}</Text>
                </View>
                <View style={styles.shippingItemsView}>
                  <Text>
                    Phone Number:{" "}
                    {displayPhoneNumber ? displayPhoneNumber : " "}
                  </Text>
                </View>
                <View style={styles.shippingItemsView}>
                  <Text>
                    ID Number: {displayIdNumber ? displayIdNumber : " "}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 100 }}></View>
        </View>
      </View>
      <FlashMessage position="top" duration={4000} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    paddingTop: 0,
  },
  header: {
    alignItems: "flex-start",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  paymentTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  cartContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 16,
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  cartTitleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  cartTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 10,
  },
  productView: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    // borderRadius: 10,
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    // shadowRadius: 2,
    elevation: 2,
    marginTop: 14,
  },
  productImage: {
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  productMiddleView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  productCompanyTitle: {
    fontSize: 16,
    fontWeight: "300",
  },
  productRightView: {
    alignItems: "center",
    justifyContent: "center",
  },
  productItemCounterView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 4,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: "500",
  },
  productPriceText: {
    alignSelf: "flex-end",
    paddingRight: 10,
    fontSize: 20,
    fontWeight: "700",
  },
  toggleCounterButton: {
    paddingHorizontal: 10,
  },
  couponInputView: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
  },
  couponInput: {
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 10,
  },
  couponButton: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  couponButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  subtotalView: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: "500",
  },
  subtotalPrice: {
    fontSize: 18,
    fontWeight: "300",
  },
  shippingView: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    paddingBottom: 10,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  shippingItemsView: {
    marginTop: 10,
  },
  shippingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  shippingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shippingItemText: {
    fontSize: 16,
    paddingVertical: 4,
    fontWeight: "300",
  },
  totalView: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "300",
  },
  checkoutButton: {
    backgroundColor: "#333",
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  emptyCartView: {
    flex: 1,
    marginTop: 140,
  },
  emptyCartViewText: {
    fontSize: 20,
    fontWeight: "300",
    alignSelf: "center",
  },
});
