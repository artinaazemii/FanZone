import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebaseConfig";

export default function CartScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product, size, paymentMethod } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    address1: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (route.params?.deliveryDetails) {
      setDeliveryDetails(route.params.deliveryDetails);
    }
  }, [route.params?.deliveryDetails]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const unitPrice = paymentMethod === "coins" ? product?.coinPrice : product?.price;
  const unitCoins = product?.coinAmount || 0;
  const totalPrice = unitPrice * quantity;
  const totalCoins = unitCoins * quantity;
  const deliveryCharge = 4.49;
  const payableAmount = totalPrice + deliveryCharge;

  const deliveryFilled =
    deliveryDetails.city && deliveryDetails.country && deliveryDetails.phone;

  return (
    <View style={styles.container}>
      <View style={styles.productRow}>
        <Image source={product?.image} style={styles.productImage} />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.productTitle}>
            {product?.teamName} {product?.name}
          </Text>
          <Text style={styles.sizeText}>Size : {size}</Text>
          <View style={styles.quantityWrapper}>
            <TouchableOpacity style={styles.qBtn} onPress={handleDecrease}><Text>-</Text></TouchableOpacity>
            <Text style={styles.qValue}>{quantity}</Text>
            <TouchableOpacity style={styles.qBtn} onPress={handleIncrease}><Text>+</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryRow}><Text>Original Price</Text><Text>{product?.price}€</Text></View>
      <View style={styles.summaryRow}><Text>Current Price</Text><Text>{totalPrice}€</Text></View>
      {paymentMethod === "coins" && (
        <View style={styles.summaryRow}>
          <Text>Total Coins</Text>
          <View style={styles.coinRow}>
            <Text>{totalCoins}</Text>
            <Image source={require("../assets/coin.png")} style={styles.coinIcon} />
          </View>
        </View>
      )}
      <View style={styles.summaryRow}><Text>Delivery Charges</Text><Text>{deliveryCharge}€</Text></View>
      <View style={styles.summaryRow}><Text>Payable Amount</Text><Text>{payableAmount.toFixed(2)}€</Text></View>

      <TouchableOpacity
        style={[
          styles.addBtn,
          deliveryFilled && { backgroundColor: "#d1f7c4", borderColor: "#4CAF50" }
        ]}
        onPress={() => navigation.navigate("DeliveryDetails")}
      >
        <Text style={[styles.addText, deliveryFilled && { color: "#2e7d32" }]}>
          + Add Delivery Details
        </Text>
      </TouchableOpacity>

      <Text style={styles.note}>*Delivery within 5-7 working days.</Text>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={async () => {
          if (deliveryFilled) {
            try {
              const db = getFirestore();
              await addDoc(collection(db, "orders"), {
                userId: auth.currentUser.uid,
                product: {
                  name: product.name,
                  image: product.image.uri,
                  team: product.teamName,
                  size,
                  quantity,
                  paymentMethod,
                  unitPrice,
                  coinAmount: unitCoins,
                  totalPrice,
                  totalCoins,
                },
                deliveryDetails,
                createdAt: serverTimestamp(),
              });
              Alert.alert("Success", "Your order has been confirmed!");
              // do not navigate away
            } catch (err) {
              console.error("Failed to save order:", err);
              Alert.alert("Error", "Something went wrong while placing the order.");
            }
          } else {
            Alert.alert("Missing Info", "Please fill in delivery details first.");
          }
        }}
      >
        <Text style={styles.checkoutText}>CHECKOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  productRow: { flexDirection: "row", marginBottom: 16 },
  productImage: { width: 100, height: 100, borderRadius: 20 },
  productTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  sizeText: { fontSize: 13 },
  quantityWrapper: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#aaa", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: "#fff", elevation: 3,
  },
  qBtn: { paddingHorizontal: 10, paddingVertical: 2 },
  qValue: { fontSize: 16, fontWeight: "600", marginHorizontal: 6 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginTop: 20, marginBottom: 10 },
  summaryRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 4,
  },
  coinRow: { flexDirection: "row", alignItems: "center" },
  coinIcon: { width: 14, height: 14, resizeMode: "contain", marginLeft: 4 },
  addBtn: {
    backgroundColor: "#fff", borderRadius: 20, padding: 12, marginTop: 20,
    borderWidth: 1, borderColor: "#aaa", elevation: 3,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
  },
  addText: { fontSize: 15 },
  note: { marginTop: 10, fontSize: 12, color: "#666", textAlign: "center" },
  checkoutButton: {
    backgroundColor: "#000", marginTop: 20, paddingVertical: 12,
    borderRadius: 20, alignItems: "center", elevation: 4,
  },
  checkoutText: { color: "#fff", fontWeight: "bold" },
});
