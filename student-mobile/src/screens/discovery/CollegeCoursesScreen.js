import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MobileTopHeader from '../../components/MobileTopHeader';
import * as collegeService from '../../services/collegeService';
import { useMobileAuth } from '../../context/MobileAuthContext';

const FALLBACK_COURSES = [
  {
    courseId: 'crs_101',
    collegeId: 'col_001',
    collegeName: 'Government College of Engineering, Salem',
    courseName: 'B.E. Computer Science and Engineering',
    courseLevel: 'UG',
    stream: 'Engineering',
    duration: '4 Years',
    annualFee: 52000,
    seatsAvailable: 120,
    eligibility: '10+2 with Physics, Chemistry & Mathematics (Min 50%)',
  },
  {
    courseId: 'crs_102',
    collegeId: 'col_002',
    collegeName: 'Sona College of Technology',
    courseName: 'B.Tech Artificial Intelligence & Data Science',
    courseLevel: 'UG',
    stream: 'Engineering',
    duration: '4 Years',
    annualFee: 85000,
    seatsAvailable: 180,
    eligibility: '10+2 PCM with TNEA Counselling / Management Quota',
  },
  {
    courseId: 'crs_103',
    collegeId: 'col_003',
    collegeName: 'Sri Sarada College for Women',
    courseName: 'B.Sc. Computer Science & Data Analytics',
    courseLevel: 'UG',
    stream: 'Arts & Science',
    duration: '3 Years',
    annualFee: 28000,
    seatsAvailable: 90,
    eligibility: '10+2 Pass in any stream with Mathematics / Computer Science',
  },
  {
    courseId: 'crs_104',
    collegeId: 'col_004',
    collegeName: 'Government Polytechnic College, Salem',
    courseName: 'Diploma in Mechanical Engineering',
    courseLevel: 'Diploma',
    stream: 'Diploma',
    duration: '3 Years',
    annualFee: 12000,
    seatsAvailable: 120,
    eligibility: '10th Standard (SSLC) Pass',
  },
  {
    courseId: 'crs_105',
    collegeId: 'col_005',
    collegeName: 'Government ITI Salem',
    courseName: 'Electrician & Industrial Automation (NCVT)',
    courseLevel: 'ITI',
    stream: 'ITI',
    duration: '2 Years',
    annualFee: 8500,
    seatsAvailable: 80,
    eligibility: '10th Standard Pass',
  },
  {
    courseId: 'crs_106',
    collegeId: 'col_006',
    collegeName: "Vinayaka Mission's Medical College",
    courseName: 'MBBS (Bachelor of Medicine & Surgery)',
    courseLevel: 'UG',
    stream: 'Medical',
    duration: '5.5 Years',
    annualFee: 350000,
    seatsAvailable: 150,
    eligibility: '10+2 PCB (Min 50%) + Valid NEET-UG Score',
  },
];

const LEVELS = ['All', 'UG', 'PG', 'Diploma', 'ITI'];

export default function CollegeCoursesScreen({ route, navigation }) {
  const { isAuthenticated } = useMobileAuth();
  const filterCollegeId = route?.params?.collegeId || null;
  const filterCollegeName = route?.params?.collegeName || null;

  const initialList = Array.isArray(collegeService.SAMPLE_COURSES)
    ? collegeService.SAMPLE_COURSES
    : FALLBACK_COURSES;

  const [courses, setCourses] = useState(initialList);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    if (typeof collegeService.getCoursesList === 'function') {
      collegeService
        .getCoursesList(filterCollegeId)
        .then((list) => {
          if (active && Array.isArray(list)) {
            setCourses(list);
          }
        })
        .catch(() => {});
    } else if (filterCollegeId) {
      setCourses(initialList.filter((c) => c.collegeId === filterCollegeId));
    } else {
      setCourses(initialList);
    }
    return () => {
      active = false;
    };
  }, [filterCollegeId]);

  const displayedCourses = useMemo(() => {
    const safeList = Array.isArray(courses) ? courses : FALLBACK_COURSES;
    return safeList.filter((crs) => {
      if (selectedLevel !== 'All' && crs.courseLevel !== selectedLevel) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCourse = (crs.courseName || '').toLowerCase().includes(q);
        const matchCollege = (crs.collegeName || '').toLowerCase().includes(q);
        const matchStream = (crs.stream || '').toLowerCase().includes(q);
        if (!matchCourse && !matchCollege && !matchStream) {
          return false;
        }
      }
      return true;
    });
  }, [courses, selectedLevel, search]);

  const handleApplyPress = (course) => {
    if (!isAuthenticated) {
      navigation.navigate('Register');
      return;
    }
    Alert.alert(
      'Course Shortlisted',
      `Ready to apply for ${course.courseName} at ${course.collegeName}.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MobileTopHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.headerBanner}>
          <View style={styles.breadcrumbPill}>
            <Text style={styles.breadcrumbText}>Home  ›  Courses</Text>
          </View>
          <Text style={styles.title}>
            {filterCollegeName ? (
              `${filterCollegeName} — Courses`
            ) : (
              <>
                Explore <Text style={{ color: '#1D4ED8' }}>Courses</Text>
              </>
            )}
          </Text>
          <Text style={styles.subtitle}>
            Compare programs, duration, eligibility, and annual tuition fees
          </Text>
        </View>

        {filterCollegeId ? (
          <TouchableOpacity
            style={styles.clearCollegeBtn}
            onPress={() =>
              navigation.setParams({ collegeId: null, collegeName: null })
            }
          >
            <Text style={styles.clearCollegeText}>Show All Colleges&apos; Courses ✕</Text>
          </TouchableOpacity>
        ) : null}

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={17} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search B.E., B.Sc., Diploma, MBBS..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Level Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {LEVELS.map((lvl) => {
            const active = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setSelectedLevel(lvl)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {lvl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Course Cards */}
        {displayedCourses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matching courses found</Text>
            <Text style={styles.emptySub}>
              Try selecting &ldquo;All&rdquo; levels or clearing your search text.
            </Text>
          </View>
        ) : (
          displayedCourses.map((course) => (
            <View key={course.courseId} style={styles.courseCard}>
              <View style={styles.cardTop}>
                <View style={styles.badgesRow}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{course.courseLevel}</Text>
                  </View>
                  <View style={styles.streamBadge}>
                    <Text style={styles.streamBadgeText}>{course.stream}</Text>
                  </View>
                </View>
                <Text style={styles.durationText}>{course.duration}</Text>
              </View>

              <Text style={styles.courseTitle}>{course.courseName}</Text>
              <Text style={styles.collegeSub}>{course.collegeName}</Text>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Eligibility:</Text>
                <Text style={styles.infoValue}>{course.eligibility}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.feeLabel}>Annual Fee</Text>
                  <Text style={styles.feeAmount}>
                    ₹{Number(course.annualFee || 0).toLocaleString('en-IN')}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => handleApplyPress(course)}
                >
                  <Text style={styles.applyBtnText}>Apply Now →</Text>
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
  scroll: { padding: 14, paddingBottom: 28 },
  headerBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  breadcrumbPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  breadcrumbText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  title: { fontSize: 21, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#475569', marginTop: 3 },
  clearCollegeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearCollegeText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: '#0F172A' },
  pillsRow: { paddingVertical: 12, gap: 8 },
  pill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 999,
  },
  pillActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  pillText: { fontSize: 12.5, fontWeight: '600', color: '#334155' },
  pillTextActive: { color: '#FFFFFF', fontWeight: '700' },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  emptySub: { fontSize: 12.5, color: '#64748B', marginTop: 4, textAlign: 'center' },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelBadgeText: { color: '#1D4ED8', fontSize: 11, fontWeight: '800' },
  streamBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  streamBadgeText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  durationText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  courseTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  collegeSub: { fontSize: 12.5, color: '#1D4ED8', fontWeight: '600', marginTop: 2 },
  infoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  infoLabel: { fontSize: 11, fontWeight: '700', color: '#475569' },
  infoValue: { fontSize: 11.5, color: '#334155', marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  feeLabel: { fontSize: 11, color: '#64748B' },
  feeAmount: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  applyBtn: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  applyBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },
});