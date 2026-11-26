import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileAuth } from '../context/MobileAuthContext';
import { useMobileWishlist } from '../context/MobileWishlistContext';

const BRAND_LOGO = require('../../assets/brand-logo.png');

export default function MobileTopHeader() {
  const navigation = useNavigation();
  const { isAuthenticated, user, signOut } = useMobileAuth();
  const { wishlistCount } = useMobileWishlist();

  return (
    <View style={styles.headerContainer}>
      {/* Left: Brand Logo + ADMIZAN Title */}
      <TouchableOpacity
        style={styles.brandWrap}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      >
        <Image
          source={BRAND_LOGO}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <View style={styles.brandTextWrap}>
          <Text style={styles.brandTitle}>ADMIZAN</Text>
          <Text style={styles.brandSubtitle}>
            Your Choice Your College Your Future
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right: Wishlist Heart Badge + Profile + Register Pill */}
      <View style={styles.actionsWrap}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Wishlist')}
          accessibilityLabel="Wishlist"
        >
          <Ionicons name="heart-outline" size={23} color="#0F172A" />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.userPill}
            onPress={signOut}
            title="Sign Out"
          >
            <Ionicons name="person-circle" size={18} color="#1D4ED8" />
            <Text style={styles.userPillText} numberOfLines={1}>
              {(user?.fullName || 'Student').split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Login')}
              accessibilityLabel="Sign In"
            >
              <Ionicons name="person-outline" size={21} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerBtnText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    opacity: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  brandLogo: {
    width: 34,
    height: 34,
    opacity: 1,
  },
  brandTextWrap: {
    flexShrink: 1,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: 0.4,
  },
  brandSubtitle: {
    fontSize: 9.5,
    color: '#475569',
    fontWeight: '600',
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  registerBtn: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    maxWidth: 96,
  },
  userPillText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
});