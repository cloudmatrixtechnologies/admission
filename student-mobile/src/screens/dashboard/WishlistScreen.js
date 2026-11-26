import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMobileWishlist } from '../../context/MobileWishlistContext';

export default function WishlistScreen({ navigation }) {
  const { wishlist, removeWishlistItem } = useMobileWishlist();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Saved Colleges ({wishlist.length})</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {wishlist.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="heart-outline" size={42} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Saved Colleges Yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart icon on any college card to shortlist it here.
            </Text>
          </View>
        ) : (
          wishlist.map((item) => (
            <View key={item.collegeId} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.collegeName}>{item.collegeName}</Text>
                  <Text style={styles.metaText}>
                    {item.city}, {item.state} • Saved on {item.savedAt}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeWishlistItem(item.collegeId)}
                  style={styles.trashBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={() =>
                    navigation.navigate('CollegeDetail', { college: item })
                  }
                >
                  <Text style={styles.outlineText}>View Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() =>
                    navigation.navigate('MainTabs', {
                      screen: 'Courses',
                      params: {
                        collegeId: item.collegeId,
                        collegeName: item.collegeName,
                      },
                    })
                  }
                >
                  <Text style={styles.primaryText}>Explore Courses →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  scroll: { padding: 14 },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 10 },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  collegeName: { fontSize: 14.5, fontWeight: '800', color: '#0F172A' },
  metaText: { fontSize: 12, color: '#64748B', marginTop: 3 },
  trashBtn: { padding: 4 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  outlineText: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  primaryBtn: {
    flex: 1.3,
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  primaryText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
});