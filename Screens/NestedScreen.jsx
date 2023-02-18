import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { showMessage, hideMessage } from "react-native-flash-message";


const NestedScreen = ({ route }) => {
    const { showActionSheetWithOptions } = useActionSheet();
     const onPress = () => {
    const options = ['Delete', 'Upvote', 'Cancel', 'Edit (Coming soon)', 'Mark as Resolved'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex: number) => {
      switch (selectedIndex) {
        case 1:
          // Save
        ToastAndroid.showWithGravity(
          "Upvoted successfully",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
          break;

        case destructiveButtonIndex:
         showMessage({
           message: "This needs to be reviewed before deleting",
           type: "danger",
         });
          break;

        case cancelButtonIndex:
          // Canceled
      }});
  }




  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <Image
            style={styles.productImg}
            
            source={require("../assets/category-icons/garbage-collection.jpg" )}
          />
          <Text style={styles.name}>{route.params.user.user.category}</Text>
          <Text style={styles.price}>{route.params.user.user.status}</Text>
          <Text style={styles.description}>
            {route.params.user.user.description}
          </Text>
        </View>

        <View style={styles.contentSize}>
          <TouchableOpacity style={styles.btnSize}>
            <Text>S</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSize}>
            <Text>M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSize}>
            <Text>L</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSize}>
            <Text>XL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.addToCarContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={onPress}>
            <Text style={styles.shareButtonText}>Action</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default NestedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  productImg: {
    width: 250,
    height: 200,
  },
  name: {
    marginTop: 8,
    fontSize: 28,
    color: '#696969',
    fontWeight: 'bold',
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    color: '#696969',
  },
  star: {
    width: 40,
    height: 40,
  },
  btnColor: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginHorizontal: 3,
  },
  btnSize: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderColor: '#778899',
    borderWidth: 1,
    marginHorizontal: 3,
    backgroundColor: 'white',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {
    justifyContent: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    marginTop: 20,
  },
  contentColors: {
    justifyContent: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    marginTop: 20,
  },
  contentSize: {
    justifyContent: 'center',
    marginHorizontal: 30,
    flexDirection: 'row',
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: '#eeeeee',
    marginTop: 20,
    marginHorizontal: 30,
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  addToCarContainer: {
    marginHorizontal: 30,
  },
})

                                            
