import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_KEY = 'admizan_mobile_wishlist';
const MobileWishlistContext = createContext(null);

export function MobileWishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const raw =
          Platform.OS === 'web'
            ? localStorage.getItem(WISHLIST_KEY)
            : await AsyncStorage.getItem(WISHLIST_KEY);
        if (raw) {
          setWishlist(JSON.parse(raw));
        }
      } catch {
        setWishlist([]);
      }
    }
    loadWishlist();
  }, []);

  const persist = async (nextList) => {
    setWishlist(nextList);
    try {
      const serialized = JSON.stringify(nextList);
      if (Platform.OS === 'web') {
        localStorage.setItem(WISHLIST_KEY, serialized);
      } else {
        await AsyncStorage.setItem(WISHLIST_KEY, serialized);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const isWishlisted = (collegeId) =>
    wishlist.some((item) => item.collegeId === collegeId);

  const toggleWishlistItem = async (college) => {
    if (!college?.collegeId) return;
    const exists = isWishlisted(college.collegeId);
    const nextList = exists
      ? wishlist.filter((item) => item.collegeId !== college.collegeId)
      : [
          ...wishlist,
          {
            ...college,
            savedAt: new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          },
        ];
    await persist(nextList);
  };

  const removeWishlistItem = async (collegeId) => {
    const nextList = wishlist.filter((item) => item.collegeId !== collegeId);
    await persist(nextList);
  };

  return (
    <MobileWishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlistItem,
        removeWishlistItem,
      }}
    >
      {children}
    </MobileWishlistContext.Provider>
  );
}

export function useMobileWishlist() {
  const ctx = useContext(MobileWishlistContext);
  if (!ctx) {
    throw new Error('useMobileWishlist must be used inside MobileWishlistProvider');
  }
  return ctx;
}