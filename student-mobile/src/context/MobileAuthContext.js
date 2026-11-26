import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginStudentAccount,
  registerStudentAccount,
  logoutStudentAccount,
} from '../services/authService';
import { getAuthToken } from '../services/mobileApiClient';

const USER_STORAGE_KEY = 'admizan_mobile_user';
const MobileAuthContext = createContext(null);

export function MobileAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [token, savedUser] = await Promise.all([
          getAuthToken(),
          AsyncStorage.getItem(USER_STORAGE_KEY),
        ]);
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const signIn = async ({ mobileNumber, password }) => {
    const result = await loginStudentAccount({ mobileNumber, password });
    const profile = result?.user || result?.data?.user || {
      fullName: 'Student',
      mobileNumber,
    };
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    return result;
  };

  const completeRegistration = async (formData) => {
    const result = await registerStudentAccount(formData);
    const profile = result?.user || result?.data?.user || {
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      guardianMobile: formData.guardianMobile,
      email: formData.email,
      accountType: result?.accountType || 'parentAndStudent',
    };
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    return result;
  };

  const signOut = async () => {
    await logoutStudentAccount();
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <MobileAuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signIn,
        completeRegistration,
        signOut,
      }}
    >
      {children}
    </MobileAuthContext.Provider>
  );
}

export function useMobileAuth() {
  const ctx = useContext(MobileAuthContext);
  if (!ctx) {
    throw new Error('useMobileAuth must be used inside MobileAuthProvider');
  }
  return ctx;
}