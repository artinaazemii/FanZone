// DeliveryDetailsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebaseConfig";

const db = getFirestore();

export default function DeliveryDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [details, setDetails] = useState({
    name: "",
    address1: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!details.name || !details.city || !details.phone || !details.country) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, "deliveryDetails", userId), details);
      Alert.alert("Saved", "Delivery details saved successfully.");
      navigation.navigate("Cart", {
        product: route.params?.product,
        size: route.params?.size,
        paymentMethod: route.params?.paymentMethod,
        deliveryDetails: details,
      });
    } catch (error) {
      console.error("Error saving delivery details:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Delivery Details</Text>

      {["name", "address1", "city", "postalCode", "country", "phone"].map(
        (key) => (
          <TextInput
            key={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={details[key]}
            onChangeText={(val) => handleChange(key, val)}
            style={styles.input}
          />
        )
      )}

      <Text style={styles.note}>
        The payment will be made by cash along with the delivery
      </Text>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© All rights reserved</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});
