import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MobileTopHeader from '../../components/MobileTopHeader';

const HIGHLIGHTS = [
  {
    icon: 'business-outline',
    title: 'Verified Campus Profiles',
    desc: 'Explore approved Engineering, Arts & Science, Diploma, ITI, and Medical colleges across Tamil Nadu.',
  },
  {
    icon: 'cash-outline',
    title: 'Transparent Fee Insights',
    desc: 'Compare tuition ranges, accreditations (NAAC, NBA, AICTE), and course eligibility upfront.',
  },
  {
    icon: 'document-text-outline',
    title: 'Single-Profile Application',
    desc: 'Fill your student profile and upload marksheets once to apply across multiple institutions.',
  },
  {
    icon: 'headset-outline',
    title: 'Personalised Admission Guidance',
    desc: 'Direct counselling support from our Salem guidance team at every step.',
  },
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MobileTopHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>ABOUT ADMIZAN</Text>
          <Text style={styles.title}>Your Choice. Your College. Your Future.</Text>
          <Text style={styles.desc}>
            Admizan simplifies higher-education discovery and admissions for students and parents across Tamil Nadu with verified data and transparent guidance.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Why Students Trust Admizan</Text>

        {HIGHLIGHTS.map((item) => (
          <View key={item.title} style={styles.featureCard}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={22} color="#1D4ED8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 14, paddingBottom: 28 },
  heroCard: {
    backgroundColor: '#1E60F2',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', lineHeight: 26 },
  desc: { fontSize: 13, color: '#DBEAFE', marginTop: 8, lineHeight: 19 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  featureDesc: { fontSize: 12.5, color: '#475569', marginTop: 3, lineHeight: 18 },
});