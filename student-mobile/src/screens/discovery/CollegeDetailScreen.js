import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMobileWishlist } from '../../context/MobileWishlistContext';

export default function CollegeDetailScreen({ route, navigation }) {
  const college = route?.params?.college;
  const { isWishlisted, toggleWishlistItem } = useMobileWishlist();

  if (!college) return null;
  const saved = isWishlisted(college.collegeId);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>
          College Details
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => toggleWishlistItem(college)}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={20}
            color={saved ? '#EF4444' : '#0F172A'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: college.thumbnailImage }}
          style={styles.heroImg}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.collegeName}>{college.collegeName}</Text>
          <View style={styles.row}>
            <Ionicons name="location" size={15} color="#1D4ED8" />
            <Text style={styles.locationText}>
              {college.city}, {college.state} • Est. {college.establishedYear}
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statVal}>★ {college.rating} / 5</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Institution</Text>
              <Text style={styles.statVal}>{college.institutionType}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Seats</Text>
              <Text style={styles.statVal}>{college.totalSeats}+</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Annual Fee</Text>
              <Text style={styles.statVal}>
                ₹{college.feeRange?.minFee?.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionHeading}>Approvals & Accreditations</Text>
          <View style={styles.tagsRow}>
            {(college.accreditations || []).map((acc) => (
              <View key={acc} style={styles.accPill}>
                <Ionicons name="shield-checkmark" size={14} color="#15803D" />
                <Text style={styles.accText}>{acc}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Courses',
                params: {
                  collegeId: college.collegeId,
                  collegeName: college.collegeName,
                },
              })
            }
          >
            <Text style={styles.ctaBtnText}>Explore Courses & Fees →</Text>
          </TouchableOpacity>
        </View>
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
  heroImg: { width: '100%', height: 200, backgroundColor: '#CBD5E1' },
  content: { padding: 16 },
  collegeName: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  locationText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: { fontSize: 11.5, color: '#64748B', fontWeight: '600' },
  statVal: { fontSize: 14.5, fontWeight: '800', color: '#0F172A', marginTop: 3 },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 18,
    marginBottom: 8,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  accPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  accText: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  ctaBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  ctaBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});