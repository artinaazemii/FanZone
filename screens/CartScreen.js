import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { useCoins } from '../context/CoinContext';

export default function CartScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { coins, spendCoins } = useCoins();

  const {
    product,
    paymentMethod,
    deliveryDetails: incomingDeliveryDetails,
    cartItems: incomingCartItems,
  } = route.params;

  const [deliveryDetails, setDeliveryDetails] = useState(incomingDeliveryDetails || {});
  const [cartItems, setCartItems] = useState(incomingCartItems || [{ size: 'M', quantity: 1 }]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (route.params?.deliveryDetails) setDeliveryDetails(route.params.deliveryDetails);
  }, [route.params?.deliveryDetails]);

  const unitPrice = paymentMethod === 'coins' ? product.coinPrice : product.price;
  const unitCoins = product.coinAmount;
  const totalPrice = cartItems.reduce((acc, i) => acc + i.quantity * unitPrice, 0);
  const totalCoins = cartItems.reduce((acc, i) => acc + i.quantity * unitCoins, 0);

  const deliveryCharge = 4.49;
  const payableAmount = totalPrice + deliveryCharge;

  const isDeliveryFilled =
    deliveryDetails?.name &&
    deliveryDetails?.city &&
    deliveryDetails?.phone &&
    deliveryDetails?.country;

  const canAfford = paymentMethod === 'coins' ? coins >= totalCoins : true;

  const addAnotherSize = () => setCartItems((prev) => [...prev, { size: 'M', quantity: 1 }]);

  const handleCheckout = async () => {
    if (!isDeliveryFilled) {
      Alert.alert('Missing Info', 'Please fill in delivery details first.');
      return;
    }
    if (paymentMethod === 'coins' && !canAfford) {
      Alert.alert('Insufficient Coins', `You need ${totalCoins} coins, but you only have ${coins}.`);
      return;
    }

    setProcessing(true);
    const db = getFirestore();
    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        product: {
          name: product.name,
          image: product.image.uri,
          team: product.teamName,
          items: cartItems,
        },
        payment: {
          method: paymentMethod,
          unitPrice,
          unitCoins,
          totalPrice,
          totalCoins: paymentMethod === 'coins' ? totalCoins : 0,
        },
        deliveryDetails,
        createdAt: serverTimestamp(),
      });

      if (paymentMethod === 'coins') {
        await spendCoins(totalCoins);
      }

      Alert.alert('Success', 'Your order has been placed!');
      navigation.popToTop();
    } catch (err) {
      console.error('Failed to save order:', err);
      Alert.alert('Error', 'Something went wrong while placing the order.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productRow}>
        <Image source={product.image} style={styles.productImage} />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.productTitle}>
            {product.teamName} {product.name}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Selection</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={{ marginBottom: 12 }}>
          <Text style={styles.sizeText}>Item {index + 1} – Size:</Text>
          <View style={styles.sizeOptions}>
            {['S', 'M', 'L', 'XL'].map((sz) => (
              <TouchableOpacity
                key={sz}
                onPress={() => {
                  const updated = [...cartItems];
                  updated[index].size = sz;
                  setCartItems(updated);
                }}
                style={[
                  styles.sizeBtn,
                  item.size === sz && { borderColor: '#fff' },
                ]}
              >
                <Text
                  style={[
                    styles.sizeOptionText,
                    item.size === sz && styles.sizeOptionTextSelected,
                  ]}
                >
                  {sz}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.quantityWrapper}>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => {
                const updated = [...cartItems];
                updated[index].quantity = Math.max(1, updated[index].quantity - 1);
                setCartItems(updated);
              }}
            >
              <Text style={styles.qText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => {
                const updated = [...cartItems];
                updated[index].quantity += 1;
                setCartItems(updated);
              }}
            >
              <Text style={styles.qText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addAnotherSize}>
        <Text style={styles.addText}>+ Add Another Size</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Order Summary</Text>
      <Row label="Total Items" value={cartItems.reduce((a, i) => a + i.quantity, 0)} />
      <Row label="Total Price" value={`${totalPrice.toFixed(2)}€`} />
      {paymentMethod === 'coins' && <Row label="Total Coins" value={totalCoins} />}
      <Row label="Delivery" value={`${deliveryCharge}€`} />
      <Row label="Payable" value={`${payableAmount.toFixed(2)}€`} />

      <TouchableOpacity
        style={[
          styles.addDeliveryBtn,
          isDeliveryFilled && { backgroundColor: '#27ae60'},
        ]}
        onPress={() =>
          navigation.navigate('DeliveryDetails', {
            product,
            paymentMethod,
            cartItems,
          })
        }
      >
        <Text
          style={[
            styles.addDeliveryText,
            isDeliveryFilled && { color: '#fff', fontWeight: 'bold' },
          ]}
        >
          + Add Delivery Details
        </Text>
      </TouchableOpacity>
      <Text style={styles.note}>*Delivery within 5-7 working days.</Text>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          (!isDeliveryFilled || !canAfford || processing) && { opacity: 0.35 },
        ]}
        disabled={!isDeliveryFilled || !canAfford || processing}
        onPress={handleCheckout}
      >
        <Text style={styles.checkoutText}>
          {processing ? 'Processing…' : 'CHECKOUT'}
        </Text>
      </TouchableOpacity>

      {!canAfford && paymentMethod === 'coins' && (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>
          You don’t have enough coins.
        </Text>
      )}
    </ScrollView>
  );
}

const Row = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text style={{ color: '#fff' }}>{label}</Text>
    <Text style={{ color: '#fff' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#fff',
  },
  sizeText: {
    fontSize: 13,
    color: '#ddd',
  },
  sizeOptions: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 8,
  },
  sizeBtn: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#1f1f1f',
  },
  sizeOptionText: {
    color: '#ccc',
  },
  sizeOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    marginTop: 4,
  },
  qBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  qText: {
    color: '#fff',
    fontSize: 16,
  },
  qValue: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 6,
    color: '#fff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  addBtn: {
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#666',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 12,
    alignItems: 'center',
  },
  addText: {
    fontSize: 15,
    color: '#eee',
  },
  addDeliveryBtn: {
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#666',
    marginTop: 20,
    alignItems: 'center',
  },
  addDeliveryText: {
    fontSize: 15,
    color: '#fff',
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
