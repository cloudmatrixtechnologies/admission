import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  requestRegistrationOtp,
  verifyRegistrationOtp,
} from '../../services/authService';
import { useMobileAuth } from '../../context/MobileAuthContext';

export default function RegisterScreen({ navigation }) {
  const { completeRegistration } = useMobileAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Step 1: Student OTP
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentOtpSent, setStudentOtpSent] = useState(false);
  const [studentOtp, setStudentOtp] = useState('');
  const [mobileVerificationToken, setMobileVerificationToken] = useState('');

  // Step 2: Parent OTP (Case A vs Case B)
  const [guardianMobile, setGuardianMobile] = useState('');
  const [parentOtpSent, setParentOtpSent] = useState(false);
  const [parentOtp, setParentOtp] = useState('');
  const [guardianVerificationToken, setGuardianVerificationToken] = useState('');

  // Step 3: Student Details & Password
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isSameNumber =
    mobileNumber.length === 10 && mobileNumber === guardianMobile;

  const handleSendStudentOtp = async () => {
    setError('');
    setInfo('');
    if (mobileNumber.length !== 10) {
      setError('Enter a valid 10-digit student mobile number.');
      return;
    }
    setLoading(true);
    try {
      const res = await requestRegistrationOtp(mobileNumber);
      setStudentOtpSent(true);
      setInfo(res?.message || '6-digit OTP sent to student mobile.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStudentOtp = async () => {
    setError('');
    setInfo('');
    if (studentOtp.length !== 6) {
      setError('Enter the 6-digit OTP sent to student mobile.');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyRegistrationOtp(mobileNumber, studentOtp);
      setMobileVerificationToken(res.verificationToken);
      setGuardianMobile(mobileNumber);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParentStepNext = async () => {
    setError('');
    setInfo('');
    if (guardianMobile.length !== 10) {
      setError('Enter a valid 10-digit parent/guardian mobile number.');
      return;
    }
    if (isSameNumber) {
      setGuardianVerificationToken('');
      setStep(3);
      return;
    }
    if (!parentOtpSent) {
      setLoading(true);
      try {
        const res = await requestRegistrationOtp(guardianMobile);
        setParentOtpSent(true);
        setInfo(res?.message || '6-digit OTP sent to parent mobile.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (parentOtp.length !== 6) {
      setError('Enter the 6-digit OTP sent to parent mobile.');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyRegistrationOtp(guardianMobile, parentOtp);
      setGuardianVerificationToken(res.verificationToken);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !dob.trim()) {
      setError('Please fill in Full Name, Email, and Date of Birth.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await completeRegistration({
        mobileNumber,
        guardianMobile,
        fullName,
        email,
        dob,
        gender,
        password,
        confirmPassword,
        mobileVerificationToken,
        guardianVerificationToken,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step Progress Bar */}
          <View style={styles.stepHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Step {step} of 3</Text>
            <View style={{ width: 22 }} />
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>

          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            {info ? (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{info}</Text>
              </View>
            ) : null}

            {/* STEP 1: STUDENT MOBILE */}
            {step === 1 && (
              <>
                <Text style={styles.heading}>Verify Student Mobile</Text>
                <Text style={styles.subtext}>
                  We will send a 6-digit OTP to verify the student&apos;s number.
                </Text>

                <Text style={styles.label}>Student Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit student number"
                  keyboardType="number-pad"
                  maxLength={10}
                  editable={!studentOtpSent}
                  value={mobileNumber}
                  onChangeText={(t) => setMobileNumber(t.replace(/\D/g, ''))}
                />

                {!studentOtpSent ? (
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleSendStudentOtp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <>
                    <Text style={styles.label}>Enter 6-Digit OTP</Text>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="••••••"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={studentOtp}
                      onChangeText={(t) => setStudentOtp(t.replace(/\D/g, ''))}
                    />
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={handleVerifyStudentOtp}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

            {/* STEP 2: PARENT / GUARDIAN MOBILE */}
            {step === 2 && (
              <>
                <Text style={styles.heading}>Parent / Guardian Mobile</Text>
                <Text style={styles.subtext}>
                  Enter parent mobile. Using the same number skips the second OTP.
                </Text>

                <Text style={styles.label}>Parent Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit parent number"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={guardianMobile}
                  onChangeText={(t) => {
                    setGuardianMobile(t.replace(/\D/g, ''));
                    setParentOtpSent(false);
                    setParentOtp('');
                  }}
                />

                {isSameNumber ? (
                  <View style={styles.greenBadge}>
                    <Ionicons name="checkmark-circle" size={18} color="#15803D" />
                    <Text style={styles.greenBadgeText}>
                      Same as student mobile — second OTP skipped automatically
                    </Text>
                  </View>
                ) : null}

                {!isSameNumber && parentOtpSent ? (
                  <>
                    <Text style={styles.label}>Enter Parent 6-Digit OTP</Text>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="••••••"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={parentOtp}
                      onChangeText={(t) => setParentOtp(t.replace(/\D/g, ''))}
                    />
                  </>
                ) : null}

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleParentStepNext}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      {isSameNumber
                        ? 'Continue to Details'
                        : parentOtpSent
                        ? 'Verify Parent OTP'
                        : 'Send Parent OTP'}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* STEP 3: STUDENT DETAILS & PASSWORD */}
            {step === 3 && (
              <>
                <Text style={styles.heading}>Student Profile & Password</Text>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter student full name"
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="student@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2008-05-15"
                  value={dob}
                  onChangeText={setDob}
                />

                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  {['male', 'female', 'other'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.genderChip,
                        gender === item && styles.genderChipActive,
                      ]}
                      onPress={() => setGender(item)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          gender === item && styles.genderTextActive,
                        ]}
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Create Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleFinalSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Create Student Account</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    marginBottom: 18,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#2563EB' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heading: { fontSize: 19, fontWeight: '800', color: '#0F172A' },
  subtext: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  otpInput: {
    letterSpacing: 8,
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 20,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  errorText: { color: '#DC2626', fontSize: 12.5, fontWeight: '600' },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  infoText: { color: '#1D4ED8', fontSize: 12.5, fontWeight: '600' },
  greenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginTop: 12,
  },
  greenBadgeText: { flex: 1, fontSize: 12.5, color: '#15803D', fontWeight: '600' },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  genderChipActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  genderText: { fontSize: 13.5, fontWeight: '600', color: '#475569' },
  genderTextActive: { color: '#2563EB', fontWeight: '700' },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15.5, fontWeight: '700' },
});