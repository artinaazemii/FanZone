import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebaseConfig";

const db = getFirestore();

export default function DeliveryDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, paymentMethod, cartItems } = route.params;

  const [details, setDetails] = useState({
    name: "",
    address1: "",
    city: "",
    postalCode: "",
    country: "Kosova",
    phonePrefix: "+383",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isPrefixModalVisible, setPrefixModalVisible] = useState(false);
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);

  const countryOptions = [
    { name: "Kosova", flag: require("../assets/flags/kosovo.png") },
    { name: "Albania", flag: require("../assets/flags/albania.png") },
    { name: "North Macedonia", flag: require("../assets/flags/macedonia.png") },
  ];

  const prefixOptions = [
    { label: "+383 (Kosova)", value: "+383" },
    { label: "+355 (Albania)", value: "+355" },
    { label: "+389 (North Macedonia)", value: "+389" },
  ];

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(details.name)) newErrors.name = true;
    if (!/^[a-zA-Z\s]+$/.test(details.city)) newErrors.city = true;
    if (!/^\d{4,6}$/.test(details.postalCode)) newErrors.postalCode = true;
    if (details.address1.length < 5 || !/[a-zA-Z]/.test(details.address1)) newErrors.address1 = true;

    const phoneLength = details.phoneNumber.length;
    const prefix = details.phonePrefix;

    if (
      (prefix === "+383" && phoneLength !== 8) ||
      (prefix === "+355" && phoneLength !== 9) ||
      (prefix === "+389" && phoneLength !== 8)
    ) {
      newErrors.phoneNumber = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert("Invalid Input", "Please correct the highlighted fields.");
      return;
    }

    const fullPhone = `${details.phonePrefix}${details.phoneNumber}`;

    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, "deliveryDetails", userId), {
        ...details,
        phone: fullPhone,
      });

      Alert.alert("Saved", "Delivery details saved successfully.");
      navigation.navigate("Cart", {
        product,
        paymentMethod,
        cartItems,
        deliveryDetails: {
          ...details,
          phone: fullPhone,
        },
      });
    } catch (error) {
      console.error("Error saving delivery details:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Delivery Details</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#888"
        value={details.name}
        onChangeText={(val) => handleChange("name", val)}
        style={[styles.input, errors.name && styles.inputError]}
      />

      <TextInput
        placeholder="Address"
        placeholderTextColor="#888"
        value={details.address1}
        onChangeText={(val) => handleChange("address1", val)}
        style={[styles.input, errors.address1 && styles.inputError]}
      />

      <TextInput
        placeholder="City"
        placeholderTextColor="#888"
        value={details.city}
        onChangeText={(val) => handleChange("city", val)}
        style={[styles.input, errors.city && styles.inputError]}
      />

      <TextInput
        placeholder="Postal Code"
        placeholderTextColor="#888"
        value={details.postalCode}
        onChangeText={(val) => handleChange("postalCode", val)}
        style={[styles.input, errors.postalCode && styles.inputError]}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Country</Text>
      <TouchableOpacity
        style={[styles.input, errors.country && styles.inputError]}
        onPress={() => setCountryModalVisible(true)}
      >
        <Text style={{ color: '#fff' }}>{details.country}</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isCountryModalVisible}
        onBackdropPress={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalContent}>
          {countryOptions.map((c) => (
            <TouchableOpacity
              key={c.name}
              onPress={() => {
                handleChange("country", c.name);
                setCountryModalVisible(false);
              }}
              style={styles.modalItem}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={c.flag} style={{ width: 24, height: 16, marginRight: 10 }} />
                <Text style={styles.modalItemText}>{c.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneRow}>
        <TouchableOpacity
          style={[
            styles.prefixButton,
            errors.phoneNumber && styles.inputError,
          ]}
          onPress={() => setPrefixModalVisible(true)}
        >
          <Text style={{ color: '#fff' }}>{details.phonePrefix}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="XXXXXXXX"
          placeholderTextColor="#888"
          value={details.phoneNumber}
          onChangeText={(val) =>
            handleChange("phoneNumber", val.replace(/[^0-9]/g, ""))
          }
          style={[styles.phoneInput, errors.phoneNumber && styles.inputError]}
          keyboardType="number-pad"
          maxLength={8}
        />
      </View>

      <Modal
        isVisible={isPrefixModalVisible}
        onBackdropPress={() => setPrefixModalVisible(false)}
      >
        <View style={styles.modalContent}>
          {prefixOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                handleChange("phonePrefix", option.value);
                setPrefixModalVisible(false);
              }}
              style={styles.modalItem}
            >
              <Text style={styles.modalItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

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
    backgroundColor: "#121212",
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
    color: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    color: "#fff",
    backgroundColor: "#1f1f1f",
  },
  inputError: {
    borderColor: "red",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  prefixButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
  },
  phoneInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 8,
    color: "#fff",
    backgroundColor: "#1f1f1f",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalItemText: {
    color: "#fff",
  },
  note: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
