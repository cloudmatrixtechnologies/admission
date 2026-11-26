import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MobileTopHeader from '../../components/MobileTopHeader';
import CollegeListCard from '../../components/CollegeListCard';
import {
  getHomeFeedColleges,
  SAMPLE_COLLEGES,
  STREAM_CATEGORIES,
} from '../../services/collegeService';

export default function CollegeListScreen({ navigation }) {
  const [colleges, setColleges] = useState(SAMPLE_COLLEGES);
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  useEffect(() => {
    getHomeFeedColleges().then(setColleges);
  }, []);

  const activeFilterCount =
    (selectedStream ? 1 : 0) +
    (selectedLevel ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const filteredColleges = useMemo(() => {
    return colleges.filter((c) => {
      if (selectedStream && c.collegeType !== selectedStream) return false;
      if (
        selectedLevel &&
        !(c.courseLevels || []).includes(selectedLevel)
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.collegeName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [colleges, selectedStream, selectedLevel, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MobileTopHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Banner */}
        <View style={styles.banner}>
          <View style={styles.breadcrumbPill}>
            <Text style={styles.breadcrumbText}>Home  ›  Colleges</Text>
          </View>
          <Text style={styles.bannerTitle}>
            Explore <Text style={{ color: '#1D4ED8' }}>Colleges</Text>
          </Text>
          <Text style={styles.bannerSub}>
            Discover top colleges, compare courses, fees, eligibility, facilities and more.
          </Text>
        </View>

        {/* 5 Stream Category Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.streamStrip}
        >
          {STREAM_CATEGORIES.map((item) => {
            const active = selectedStream === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.streamCard, active && styles.streamCardActive]}
                onPress={() =>
                  setSelectedStream((prev) => (prev === item.id ? '' : item.id))
                }
              >
                <Ionicons name={item.icon} size={22} color={item.color} />
                <Text style={styles.streamCardLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Full-Width Stretched Filter Button */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={styles.filterBtn}
            activeOpacity={0.85}
            onPress={() => setFilterModalOpen(true)}
          >
            <Ionicons name="funnel-outline" size={16} color="#020202" />
            <Text style={styles.filterBtnText}>Filters</Text>
            {activeFilterCount > 0 && (
              <View style={styles.countCircle}>
                <Text style={styles.countCircleText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* College Cards List */}
        <View style={styles.listWrap}>
          {filteredColleges.map((college) => (
            <CollegeListCard
              key={college.collegeId}
              college={college}
              showFeeMeta
              onPressDetails={(item) =>
                navigation.navigate('CollegeDetail', { college: item })
              }
              onPressCourses={(item) =>
                navigation.navigate('Courses', {
                  collegeId: item.collegeId,
                  collegeName: item.collegeName,
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Filter Modal Drawer */}
      <Modal
        visible={filterModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Colleges</Text>
              <TouchableOpacity onPress={() => setFilterModalOpen(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Search College or Keyword</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., Engineering, Government, Autonomous..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <Text style={styles.fieldLabel}>Course Level</Text>
            <View style={styles.levelRow}>
              {['UG', 'PG', 'Diploma', 'ITI'].map((lvl) => {
                const active = selectedLevel === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.levelChip, active && styles.levelChipActive]}
                    onPress={() =>
                      setSelectedLevel((prev) => (prev === lvl ? '' : lvl))
                    }
                  >
                    <Text
                      style={[
                        styles.levelChipText,
                        active && styles.levelChipTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedStream('');
                  setSelectedLevel('');
                  setSearchQuery('');
                }}
              >
                <Text style={styles.resetBtnText}>Reset All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setFilterModalOpen(false)}
              >
                <Text style={styles.applyBtnText}>
                  Show {filteredColleges.length} Colleges
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  banner: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  breadcrumbPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 8,
  },
  breadcrumbText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  bannerTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  bannerSub: { fontSize: 12, color: '#475569', marginTop: 4, lineHeight: 17 },
  streamStrip: { paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  streamCard: {
    width: 92,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  streamCardActive: {
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
  },
  streamCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterBtnText: { fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  countCircle: {
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countCircleText: { color: '#FFFFFF', fontSize: 10.5, fontWeight: '800' },
  listWrap: { paddingHorizontal: 14, paddingBottom: 24 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  levelRow: { flexDirection: 'row', gap: 8 },
  levelChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  levelChipActive: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  levelChipText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  levelChipTextActive: { color: '#1D4ED8', fontWeight: '800' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  resetBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  resetBtnText: { fontWeight: '700', color: '#475569' },
  applyBtn: {
    flex: 1.6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
  },
  applyBtnText: { fontWeight: '700', color: '#FFFFFF' },
});