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

/* NEW ─────────────────────────────────────────────── */
import { useCoins } from '../context/CoinContext';

export default function CartScreen() {
  const route       = useRoute();
  const navigation  = useNavigation();
  const { coins, spendCoins } = useCoins();          // ⬅️ wallet access

  /* ───────── params from ProductDetailScreen ──────── */
  const {
    product,
    paymentMethod,
    deliveryDetails: incomingDeliveryDetails,
    cartItems: incomingCartItems,
  } = route.params;

  /* ───────── local state ──────── */
  const [deliveryDetails, setDeliveryDetails] = useState(incomingDeliveryDetails || {});
  const [cartItems, setCartItems]             = useState(incomingCartItems || [{ size: 'M', quantity: 1 }]);
  const [processing, setProcessing]           = useState(false);

  /* update delivery details when coming back from DeliveryDetails screen */
  useEffect(() => {
    if (route.params?.deliveryDetails) setDeliveryDetails(route.params.deliveryDetails);
  }, [route.params?.deliveryDetails]);

  /* ───────── helpers ──────── */
  const unitPrice  = paymentMethod === 'coins' ? product.coinPrice : product.price;
  const unitCoins  = product.coinAmount;
  const totalPrice = cartItems.reduce((acc, i) => acc + i.quantity * unitPrice, 0);
  const totalCoins = cartItems.reduce((acc, i) => acc + i.quantity * unitCoins, 0);

  const deliveryCharge = 4.49;
  const payableAmount  = totalPrice + deliveryCharge;

  const isDeliveryFilled =
    deliveryDetails?.name &&
    deliveryDetails?.city &&
    deliveryDetails?.phone &&
    deliveryDetails?.country;

  const canAfford = paymentMethod === 'coins' ? coins >= totalCoins : true;

  /* ───────── actions ──────── */
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

    /* pretend-stock check (optional) … removed for brevity */

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

      /* NEW – debit coins AFTER order saved */
      if (paymentMethod === 'coins') {
        await spendCoins(totalCoins);
      }

      Alert.alert('Success', 'Your order has been placed!');
      navigation.popToTop();           // back to main tabs
    } catch (err) {
      console.error('Failed to save order:', err);
      Alert.alert('Error', 'Something went wrong while placing the order.');
    } finally {
      setProcessing(false);
    }
  };

  /* ───────── render ──────── */
  return (
    <ScrollView style={styles.container}>
      {/* product thumb */}
      <View style={styles.productRow}>
        <Image source={product.image} style={styles.productImage} />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.productTitle}>
            {product.teamName} {product.name}
          </Text>
        </View>
      </View>

      {/* cart items */}
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
                  item.size === sz && { borderColor: '#000' },
                ]}
              >
                <Text style={item.size === sz && { fontWeight: 'bold' }}>{sz}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* quantity */}
          <View style={styles.quantityWrapper}>
            <TouchableOpacity
              style={styles.qBtn}
              onPress={() => {
                const updated = [...cartItems];
                updated[index].quantity = Math.max(1, updated[index].quantity - 1);
                setCartItems(updated);
              }}
            >
              <Text>-</Text>
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
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addAnotherSize}>
        <Text style={styles.addText}>+ Add Another Size</Text>
      </TouchableOpacity>

      {/* summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <Row label="Total Items" value={cartItems.reduce((a, i) => a + i.quantity, 0)} />
      <Row label="Total Price" value={`${totalPrice.toFixed(2)}€`} />
      {paymentMethod === 'coins' && <Row label="Total Coins" value={totalCoins} />}
      <Row label="Delivery" value={`${deliveryCharge}€`} />
      <Row label="Payable" value={`${payableAmount.toFixed(2)}€`} />

      {/* delivery */}
      <TouchableOpacity
        style={[
          styles.addDeliveryBtn,
          isDeliveryFilled && { backgroundColor: '#d0f0c0', borderColor: 'green' },
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
            isDeliveryFilled && { color: 'green', fontWeight: 'bold' },
          ]}
        >
          + Add Delivery Details
        </Text>
      </TouchableOpacity>
      <Text style={styles.note}>*Delivery within 5-7 working days.</Text>

      {/* checkout */}
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

/* simple row component */
const Row = ({ label, value }) => (
  <View style={styles.summaryRow}>
    <Text>{label}</Text>
    <Text>{value}</Text>
  </View>
);

/* styles (mostly same as yours) */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  productRow: { flexDirection: 'row', marginBottom: 16 },
  productImage: { width: 100, height: 100, borderRadius: 20 },
  productTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  sizeText: { fontSize: 13 },
  sizeOptions: { flexDirection: 'row', marginTop: 6, marginBottom: 8 },
  sizeBtn: { borderWidth: 1, borderColor: '#aaa', padding: 8, marginRight: 8, borderRadius: 6 },
  quantityWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#aaa',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start',
    backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 3, marginTop: 4,
  },
  qBtn: { paddingHorizontal: 10, paddingVertical: 2 },
  qValue: { fontSize: 16, fontWeight: '600', marginHorizontal: 6 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 20, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  addBtn: {
    backgroundColor: '#fff', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: '#aaa',
    shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 3, marginBottom: 12, alignItems: 'center',
  },
  addText: { fontSize: 15 },
  addDeliveryBtn: {
    backgroundColor: '#fff', borderRadius: 20, padding: 12, borderWidth: 1,
    borderColor: '#aaa', marginTop: 20, alignItems: 'center',
  },
  addDeliveryText: { fontSize: 15 },
  note: { marginTop: 10, fontSize: 12, color: '#666', textAlign: 'center' },
  checkoutButton: {
    backgroundColor: '#27ae60', marginTop: 20, paddingVertical: 12, borderRadius: 20,
    alignItems: 'center', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
});
