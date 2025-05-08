// DeliveryDetailsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function DeliveryDetailsScreen() {
  const navigation = useNavigation();
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

  const handleSubmit = () => {
    if (!details.city || !details.country || !details.phone) {
      alert("Please fill all required fields");
      return;
    }
    navigation.navigate("Cart", { deliveryDetails: details });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Delivery Details</Text>
      {[
        ["name", "Name"],
        ["address1", "Address 1"],
        ["city", "City*"],
        ["postalCode", "Postal Code*"],
        ["country", "Country*"],
        ["phone", "Phone Number*"],
      ].map(([key, label]) => (
        <TextInput
          key={key}
          placeholder={label}
          value={details[key]}
          onChangeText={(val) => handleChange(key, val)}
          style={styles.input}
        />
      ))}

      <Text style={styles.note}>The payment will be made by cash along with the delivery</Text>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© All rights reserved</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1, borderColor: "#aaa", borderRadius: 5,
    paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12,
  },
  note: { fontSize: 12, color: "gray", textAlign: "center", marginBottom: 20 },
  submitButton: {
    backgroundColor: "#fff", borderRadius: 8, paddingVertical: 12,
    alignItems: "center", borderWidth: 1, borderColor: "#000",
    shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  submitText: { fontSize: 16, fontWeight: "bold" },
  footer: { fontSize: 12, textAlign: "center", marginTop: 20, color: "#999" },
});
