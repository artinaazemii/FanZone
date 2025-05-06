import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { product, size, paymentMethod } = params;

  const [quantity, setQuantity] = useState(1);
  const deliveryCharge = 4.49;

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const unitPrice = paymentMethod === "coins" ? product.coinPrice : product.price;
  const totalPrice = unitPrice * quantity + deliveryCharge;
  const totalCoins = product.coinAmount * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.productRow}>
        <Image source={product.image} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.teamName}  {product.name}</Text>
          <Text style={styles.productInfo}>Size: {size}</Text>
          <Text style={styles.productInfo}>Quantity:</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity onPress={decreaseQty} style={styles.qtyButton}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQty} style={styles.qtyButton}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}><Text>Original Price</Text><Text>{product.price}€</Text></View>
        <View style={styles.summaryRow}><Text>Current Price</Text><Text>{unitPrice * quantity}€</Text></View>
        {paymentMethod === "coins" && (
          <View style={styles.summaryRow}>
          <Text>Total Coins</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{totalCoins}</Text>
            <Image
              source={require("../assets/coin.png")}
              style={styles.coinIcon}
            />
          </View>
        </View>        
        )}
        <View style={styles.summaryRow}><Text>Delivery Charges</Text><Text>{deliveryCharge.toFixed(2)}€</Text></View>
        <View style={styles.summaryRow}><Text>Payable Amount</Text><Text>{totalPrice.toFixed(2)}€</Text></View>

        <TouchableOpacity
          style={styles.deliveryButton}
          onPress={() => navigation.navigate("DeliveryDetails")}
        >
          <Text style={styles.deliveryText}>+ Add Delivery Details</Text>
        </TouchableOpacity>

        <Text style={styles.deliveryNote}>*Delivery within 5-7 working days.</Text>

        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: "#f4f4f4",
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  productInfo: {
    fontSize: 13,
    marginBottom: 6,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  qtyButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    elevation: 2,
    shadowColor: "#000",
    marginHorizontal: 8,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  summarySection: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  deliveryButton: {
    marginTop: 16,
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deliveryNote: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  coinIcon: {
    width: 14,
    height: 14,
    marginLeft: 4,
    resizeMode: "contain",
  },
  
});
