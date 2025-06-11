import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CoinContext = createContext();

export function CoinProvider({ children }) {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('userCoins');
      setCoins(stored ? parseInt(stored, 10) : 0);
    })();
  }, []);

  const addCoins = async (amount) => {
    const updated = coins + amount;
    setCoins(updated);
    await AsyncStorage.setItem('userCoins', updated.toString());
  };

  const resetCoins = async () => {
    setCoins(0);
    await AsyncStorage.setItem('userCoins', '0');
  };

  return (
    <CoinContext.Provider value={{ coins, addCoins, resetCoins }}>
      {children}
    </CoinContext.Provider>
  );
}

export function useCoins() {
  return useContext(CoinContext);
}
