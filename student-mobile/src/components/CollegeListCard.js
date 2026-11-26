import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileWishlist } from '../context/MobileWishlistContext';

function getBadgeStyle(badge) {
  if (!badge) return null;
  const lower = badge.toLowerCase();
  if (lower.includes('popular')) return { bg: '#7C3AED', label: badge };
  if (lower.includes('trend')) return { bg: '#EA580C', label: badge };
  return { bg: '#16A34A', label: badge };
}

export default function CollegeListCard({
  college = {},
  onPressDetails,
  onPressCourses,
  showFeeMeta = false,
}) {
  const { isWishlisted, toggleWishlistItem } = useMobileWishlist();
  const [imgFailed, setImgFailed] = useState(false);

  const saved = isWishlisted(college.collegeId);
  const badgeInfo = getBadgeStyle(college.featuredBadge);
  const hasLiveImage = Boolean(college.thumbnailImage) && !imgFailed;

  return (
    <View style={styles.card}>
      {/* Left Campus Image Slot (Empty Slot in Dummy Mode -> Live Photo when Backend Connects) */}
      <View style={styles.imageWrap}>
        {hasLiveImage ? (
          <Image
            source={{ uri: college.thumbnailImage }}
            style={styles.thumbnail}
            resizeMode="cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <View style={styles.emptyImageSlot}>
            <Ionicons name="business-outline" size={28} color="#94A3B8" />
            <Text style={styles.emptySlotText}>Campus Photo</Text>
          </View>
        )}

        {badgeInfo && (
          <View style={[styles.featuredPill, { backgroundColor: badgeInfo.bg }]}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
            <Text style={styles.featuredText}>{badgeInfo.label}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartBtn}
          activeOpacity={0.8}
          onPress={() => toggleWishlistItem(college)}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={16}
            color={saved ? '#EF4444' : '#0F172A'}
          />
        </TouchableOpacity>
      </View>

      {/* Right Details Column */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {college.collegeName || 'Unnamed Institution'}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color="#2563EB" />
          <Text style={styles.metaText}>
            {college.city || 'Salem'}, {college.state || 'Tamil Nadu'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={styles.ratingBold}>{college.rating || '4.5'}</Text>
          <Text style={styles.metaText}>({college.reviewCount || 0} reviews)</Text>
        </View>

        {showFeeMeta && college.feeRange ? (
          <View style={styles.metaRow}>
            <Ionicons name="school-outline" size={13} color="#475569" />
            <Text style={styles.metaText}>
              {(college.courseLevels || ['UG']).join(', ')}  |  ₹
              {Number(college.feeRange.minFee || 0).toLocaleString('en-IN')} -{' '}
              {Number(college.feeRange.maxFee || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        ) : null}

        {/* Accreditations Pills */}
        <View style={styles.tagsWrap}>
          {(college.accreditations || []).slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Ionicons name="checkmark-circle-outline" size={11} color="#1D4ED8" />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.8}
            onPress={() => onPressDetails && onPressDetails(college)}
          >
            <Text style={styles.outlineBtnText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => onPressCourses && onPressCourses(college)}
          >
            <Text style={styles.primaryBtnText}>Explore Courses →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  imageWrap: {
    width: 122,
    minHeight: 136,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  emptyImageSlot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingTop: 18,
    gap: 4,
  },
  emptySlotText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  featuredPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingBold: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaText: {
    fontSize: 11,
    color: '#475569',
    flexShrink: 1,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#334155',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  primaryBtn: {
    flex: 1.3,
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});