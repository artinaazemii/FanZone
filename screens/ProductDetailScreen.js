import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCoins } from '../context/CoinContext';

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const product    = route.params.product;

  const { coins }  = useCoins();                  
  const canAfford  = coins >= product.coinAmount;

  const [selectedSize, setSelectedSize]   = useState('M');
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeModalVisible(false);
  };

  const goToCart = (method) => {
    navigation.navigate('Cart', {
      product,
      size: selectedSize,
      paymentMethod: method,           
      coinAmount: product.coinAmount,   
    });
  };

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.title}>
        {product.teamName} {product.name}
      </Text>
      <Text style={styles.description}>{product.description}</Text>

     
      <TouchableOpacity
        style={styles.sizeDropdown}
        onPress={() => setSizeModalVisible(true)}
      >
        <Text style={styles.dropdownLabel}>Size: </Text>
        <Text style={styles.dropdownValue}>{selectedSize}</Text>
        <Image source={require('../assets/dropdownarrow.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <Modal visible={sizeModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setSizeModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            {SIZES.map((sz) => (
              <TouchableOpacity key={sz} style={styles.modalItem} onPress={() => handleSizeSelect(sz)}>
                <Text style={styles.modalText}>{sz}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.coinButton, !canAfford && { opacity: 0.4 }]}
          disabled={!canAfford}
          onPress={() => goToCart('coins')}
        >
          <View style={styles.coinButtonRow}>
            <Text style={styles.coinButtonText}>
              {product.coinPrice}€ with {product.coinAmount}
            </Text>
            <Image source={require('../assets/coin.png')} style={styles.coinIcon} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton} onPress={() => goToCart('euro')}>
          <Text style={styles.buyButtonText}>Buy for {product.price}€</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        By buying this you agree to our marketplace{' '}
        <Text style={{ color: '#3498db' }}>Terms & Conditions</Text>
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  image: {
    width: '70%',
    height: 250,
    resizeMode: 'contain',
    borderRadius: 14,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  description: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  sizeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#1e1e1e',
  },
  dropdownLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
    color: '#fff',
  },
  dropdownValue: {
    fontSize: 14,
    color: '#fff',
  },
  arrowIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: 200,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  coinButton: {
    backgroundColor: '#2c2c2e',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  coinButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  coinIcon: {
    width: 14,
    height: 14,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  buyButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  terms: {
    fontSize: 11,
    marginTop: 10,
    textAlign: 'center',
    color: '#888',
  },
});

