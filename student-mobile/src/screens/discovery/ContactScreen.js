import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MobileTopHeader from '../../components/MobileTopHeader';
import { submitContactInquiry } from '../../services/collegeService';

export default function ContactScreen() {
  const [inquiryType, setInquiryType] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async () => {
    setStatusMsg('');
    if (!fullName.trim() || !mobileNumber.trim() || !message.trim()) {
      setStatusMsg('Please fill in Name, Mobile Number, and Message.');
      return;
    }
    setSubmitting(true);
    try {
      const payload =
        inquiryType === 'partner'
          ? {
              inquiryType: 'partner',
              institutionName: fullName,
              contactPersonName: fullName,
              organizationType: subject || 'College / University',
              email,
              mobileNumber,
              requirementsMessage: message,
            }
          : {
              inquiryType: 'student',
              fullName,
              email,
              mobileNumber,
              subject: subject || 'Admission Guidance',
              message,
            };
      const res = await submitContactInquiry(payload);
      setStatusMsg(res.message || 'Submitted successfully!');
      setFullName('');
      setEmail('');
      setMobileNumber('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatusMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MobileTopHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Contact & Guidance</Text>
        <Text style={styles.subtitle}>
          Reach our Salem counselling desk or register an institution partnership
        </Text>

        {/* Inquiry Type Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, inquiryType === 'student' && styles.toggleActive]}
            onPress={() => setInquiryType('student')}
          >
            <Text
              style={[
                styles.toggleText,
                inquiryType === 'student' && styles.toggleTextActive,
              ]}
            >
              Student Inquiry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, inquiryType === 'partner' && styles.toggleActive]}
            onPress={() => setInquiryType('partner')}
          >
            <Text
              style={[
                styles.toggleText,
                inquiryType === 'partner' && styles.toggleTextActive,
              ]}
            >
              College Partnership
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {statusMsg ? (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>{statusMsg}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>
            {inquiryType === 'partner' ? 'Institution Name *' : 'Full Name *'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              inquiryType === 'partner'
                ? 'Enter college or institution name'
                : 'Enter student / parent name'
            }
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            keyboardType="number-pad"
            maxLength={10}
            value={mobileNumber}
            onChangeText={(t) => setMobileNumber(t.replace(/\D/g, ''))}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>
            {inquiryType === 'partner' ? 'Institution Type' : 'Subject'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              inquiryType === 'partner'
                ? 'Engineering / Arts & Science / Medical'
                : 'Course guidance, fee details, etc.'
            }
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Message *</Text>
          <TextInput
            style={[styles.input, { height: 84, textAlignVertical: 'top' }]}
            placeholder="How can our guidance team help you?"
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Send Message →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Salem Office Info */}
        <View style={styles.officeCard}>
          <Ionicons name="location-outline" size={20} color="#1D4ED8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.officeTitle}>Admizan Admissions Office</Text>
            <Text style={styles.officeText}>
              Salem, Tamil Nadu • Mon – Sat, 9:30 AM – 6:30 PM
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 14, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 12.5, color: '#64748B', marginTop: 3, marginBottom: 14 },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: '#FFFFFF' },
  toggleText: { fontSize: 12.5, fontWeight: '600', color: '#475569' },
  toggleTextActive: { color: '#1D4ED8', fontWeight: '800' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alertBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  alertText: { color: '#1D4ED8', fontSize: 12.5, fontWeight: '600' },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 14.5, fontWeight: '700' },
  officeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  officeTitle: { fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  officeText: { fontSize: 12, color: '#475569', marginTop: 2 },
});