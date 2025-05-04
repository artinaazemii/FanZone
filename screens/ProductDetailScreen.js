import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // ✅ FIX

// ... pjesa tjetër vazhdon



const SIZES = ["S", "M", "L", "XL"];

export default function ProductDetailScreen() {
const navigation = useNavigation();
const route = useRoute();
const product = route.params.product;


  const [selectedSize, setSelectedSize] = useState("M");
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const isSmallScreen = screenWidth < 400;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.title}>{product.teamName}  {product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      {/* Size Dropdown (Custom Modal Trigger) */}
      <TouchableOpacity
        style={styles.sizeDropdown}
        onPress={() => setSizeModalVisible(true)}
      >
        <Text style={styles.dropdownLabel}>Size: </Text>
        <Text style={styles.dropdownValue}>{selectedSize}</Text>
        <Image
  source={require("../assets/dropdownarrow.png")}
  style={styles.arrowIcon}
/>

      </TouchableOpacity>

     

      {/* Modal for selecting size */}
      <Modal visible={sizeModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setSizeModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={styles.modalItem}
                onPress={() => handleSizeSelect(size)}
              >
                <Text style={styles.modalText}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Prices */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={styles.coinButton}
  onPress={() =>
    navigation.navigate("Cart", {
      product: product,
      size: selectedSize,
      paymentMethod: "coins",
    })
  }
>
  <View style={styles.coinButtonRow}>
    <Text style={styles.coinButtonText}>
      {product.coinPrice}€ with {product.coinAmount}
    </Text>
    <Image source={require("../assets/coin.png")} style={styles.coinIcon} />
  </View>
</TouchableOpacity>


  <TouchableOpacity
    style={styles.buyButton}
    onPress={() =>
      navigation.navigate("Cart", {
        product: product,
        size: selectedSize,
        paymentMethod: "euro",
      })
    }
  >
    <Text style={styles.buyButtonText}>Buy for {product.price}€</Text>
  </TouchableOpacity>
</View>


      <Text style={styles.terms}>
        By buying this you agree to our marketplace{" "}
        <Text style={{ color: "#3498db" }}>Terms & Conditions</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  image: {
    width: "70%",
    height: 250,
    resizeMode: "contain",
    borderRadius: 14,
    marginBottom: 10,
  },
  sizeDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: "#f7f7f7",
  },
  dropdownLabel: {
    fontWeight: "600",
    fontSize: 14,
    marginRight: 6,
  },
  dropdownValue: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 16,
    marginLeft: 8,
    transform: [{ rotate: "0deg" }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000077",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 200,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  coinPrice: {
    fontSize: 14,
    fontWeight: "500",
  },
  coinIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 4,
  },
  buyButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  terms: {
    fontSize: 11,
    marginTop: 10,
    textAlign: "center",
    color: "#888",
  },
  arrowIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: "#333", // opsionale për të ndryshuar ngjyrën
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  coinButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  coinButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  coinButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  
  coinIcon: {
    width: 14,
    height: 14,
    marginLeft: 4,
    resizeMode: "contain",
  },
  
  
});
