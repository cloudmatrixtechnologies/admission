import React from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { MobileAuthProvider } from './src/context/MobileAuthContext';
import { MobileWishlistProvider } from './src/context/MobileWishlistContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider
      initialWindowMetrics={initialWindowMetrics}
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    >
      <MobileAuthProvider>
        <MobileWishlistProvider>
          <AppNavigator />
        </MobileWishlistProvider>
      </MobileAuthProvider>
    </SafeAreaProvider>
  );
}