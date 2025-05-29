// context/CoinContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(null);          // null while loading
  const uid = auth.currentUser?.uid;

  // ───────────────────────────────── load balance
  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, { coins: 0 }, { merge: true });
        setCoins(0);
      } else {
        setCoins(snap.data().coins ?? 0);
      }
    };

    load();
  }, [uid]);

  // ───────────────────────────────── helpers
  const addCoins = async (amount) => {
    if (!uid) return;
    setCoins((prev) => prev + amount);
    await updateDoc(doc(db, 'users', uid), { coins: increment(amount) });
  };

  const spendCoins = async (amount) => {
    if (!uid) return;
    setCoins((prev) => prev - amount);
    await updateDoc(doc(db, 'users', uid), { coins: increment(-amount) });
  };

  return (
    <CoinContext.Provider value={{ coins, addCoins, spendCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoins = () => useContext(CoinContext);
