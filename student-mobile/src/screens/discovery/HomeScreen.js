import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MobileTopHeader from '../../components/MobileTopHeader';
import CollegeListCard from '../../components/CollegeListCard';
import { getHomeFeedColleges } from '../../services/collegeService';

const HERO_BG = require('../../../assets/hero-homepage.jpeg');

const STREAM_CHIPS = [
  'Engineering',
  'Arts & Science',
  'Diploma',
  'ITI',
  'Medical',
];

export default function HomeScreen({ navigation }) {
  const [colleges, setColleges] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [activeChip, setActiveChip] = useState('');

  useEffect(() => {
    let active = true;
    getHomeFeedColleges()
      .then((data) => {
        if (active) {
          setColleges(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (active) {
          setColleges([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = () => {
    setAppliedSearch(searchInput.trim());
  };

  const handleChipPress = (chip) => {
    setActiveChip((prev) => (prev === chip ? '' : chip));
  };

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      if (activeChip) {
        if (college.collegeType?.toLowerCase() !== activeChip.toLowerCase()) {
          return false;
        }
      }
      if (appliedSearch) {
        const q = appliedSearch.toLowerCase();
        const matchName = college.collegeName?.toLowerCase().includes(q);
        const matchType = college.collegeType?.toLowerCase().includes(q);
        const matchCity = college.city?.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchCity) return false;
      }
      return true;
    });
  }, [colleges, activeChip, appliedSearch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MobileTopHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner with Campus & Students Background */}
        <ImageBackground
          source={HERO_BG}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <View style={styles.guidanceBadge}>
              <Text style={styles.guidanceBadgeText}>ADMISSION GUIDANCE</Text>
            </View>

            <Text style={styles.heroTitleWhite}>Choose Degree, Pick Campus</Text>
            <Text style={styles.heroTitleGold}>Start Your Story</Text>

            {/* Unified Search Bar */}
            <View style={styles.searchPill}>
              <Ionicons name="search" size={18} color="#475569" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by college name, course, or specialization..."
                placeholderTextColor="#64748B"
                value={searchInput}
                onChangeText={(txt) => {
                  setSearchInput(txt);
                  if (!txt.trim()) setAppliedSearch('');
                }}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Horizontal Stream Filter Chips (Without 'Popular') */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {STREAM_CHIPS.map((chip) => {
            const active = activeChip === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => handleChipPress(chip)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Top Colleges in Tamil Nadu */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Top Colleges in Tamil Nadu</Text>
              <Text style={styles.sectionSub}>
                Discover accredited universities, government, and autonomous colleges
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Colleges')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {filteredColleges.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No colleges matched your filter. Tap the selected stream again or clear search.
              </Text>
            </View>
          ) : (
            filteredColleges.map((college) => (
              <CollegeListCard
                key={college.collegeId}
                college={college}
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
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  heroBanner: {
    width: '100%',
    backgroundColor: '#1E60F2',
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    backgroundColor: 'rgba(11, 30, 74, 0.36)',
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 22,
    alignItems: 'center',
  },
  guidanceBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  guidanceBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitleWhite: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  heroTitleGold: {
    color: '#FACC15',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingLeft: 14,
    paddingRight: 5,
    paddingVertical: 5,
    width: '100%',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    paddingVertical: 6,
  },
  searchBtn: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  chipsRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionWrap: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  viewAllBtn: {
    paddingVertical: 4,
  },
  viewAllText: {
    color: '#1D4ED8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});