// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ProfileScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAuth } from '../hooks/useAuth';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { getInitials } from '../utils/formatters';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types';

type Props = StackScreenProps<ProfileStackParamList, 'ProfileHome'>;

export function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { profile, loading, refresh, profileExists } = usePatientProfile();

  // Refresh profile on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refresh();
    });
    return unsubscribe;
  }, [navigation, refresh]);

  const handleLogout = async () => {
    await logout();
  };

  const renderMedicalField = (label: string, value: string | number | boolean, icon: string) => {
    let displayValue = String(value);
    if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    }

    return (
      <View style={styles.medicalFieldRow}>
        <View style={styles.medicalFieldLeft}>
          <Ionicons name={icon as any} size={18} color={Colors.primary} />
          <Text style={styles.medicalFieldLabel}>{label}</Text>
        </View>
        <Text style={styles.medicalFieldValue}>{displayValue || '—'}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Account Info Segment */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.display_name ?? 'US')}</Text>
        </View>
        <Text style={styles.displayName}>{user?.display_name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? 'user@example.com'}</Text>
        
        {user?.email_verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
        )}
      </View>

      {/* Patient Health Profile Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Patient Health Profile</Text>
        {profileExists && (
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editBtn}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={styles.loader} />
      ) : !profileExists ? (
        <GlassCard style={styles.noProfileCard} glowColor={Colors.primaryGlow}>
          <Ionicons name="medical-outline" size={36} color={Colors.primary} />
          <Text style={styles.noProfileTitle}>No Health Profile Created Yet</Text>
          <Text style={styles.noProfileDesc}>
            Creating a medical profile allows the AI models to record demographic risk adjustments like age, diabetes, and blood pressure.
          </Text>
          <PrimaryButton
            title="Create Health Profile"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.createProfileBtn}
          />
        </GlassCard>
      ) : profile ? (
        <GlassCard style={styles.profileCard}>
          {renderMedicalField('Full Name', profile.name, 'person-outline')}
          {renderMedicalField('Age', `${profile.age} years`, 'calendar-outline')}
          {renderMedicalField('Gender', profile.gender, 'transgender-outline')}
          {renderMedicalField('Location', profile.location, 'location-outline')}
          
          <View style={styles.profileDivider} />

          {renderMedicalField('Left Eye Optical Power', `${profile.optical_power_left} D`, 'eye-outline')}
          {renderMedicalField('Right Eye Optical Power', `${profile.optical_power_right} D`, 'eye-outline')}
          
          <View style={styles.profileDivider} />

          {renderMedicalField('Diabetic', profile.has_diabetes, 'git-commit-outline')}
          {profile.has_diabetes && profile.diabetes_type && (
            <View style={styles.nestedField}>
              {renderMedicalField('Diabetes Type', profile.diabetes_type, 'arrow-redo-outline')}
            </View>
          )}
          {renderMedicalField('Smoker', profile.is_smoker, 'flame-outline')}
          {renderMedicalField('Blood Pressure', `${profile.bp_systolic}/${profile.bp_diastolic} mmHg`, 'pulse-outline')}
          
          {profile.existing_eye_conditions && profile.existing_eye_conditions.length > 0 ? (
            <>
              <View style={styles.profileDivider} />
              <Text style={styles.chipsLabel}>Existing Eye Conditions</Text>
              <View style={styles.conditionsRow}>
                {profile.existing_eye_conditions.map((cond) => (
                  <View key={cond} style={styles.conditionChip}>
                    <Text style={styles.conditionChipText}>{cond}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {profile.notes ? (
            <>
              <View style={styles.profileDivider} />
              <Text style={styles.notesLabel}>Clinical Notes</Text>
              <Text style={styles.notesText}>{profile.notes}</Text>
            </>
          ) : null}
        </GlassCard>
      ) : null}

      <View style={styles.spacer} />

      {/* Logout button */}
      <PrimaryButton
        title="Logout Account"
        variant="outlined"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.background,
  },
  displayName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginTop: 14,
  },
  email: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.success}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
  },
  verifiedText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  editBtn: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  loader: {
    marginVertical: 30,
  },
  noProfileCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 24,
    gap: 12,
  },
  noProfileTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
    textAlign: 'center',
  },
  noProfileDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  createProfileBtn: {
    width: '100%',
    marginTop: 10,
  },
  profileCard: {
    backgroundColor: Colors.surface,
  },
  medicalFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  medicalFieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  medicalFieldLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  medicalFieldValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  nestedField: {
    marginLeft: 20,
    borderLeftWidth: 1.5,
    borderColor: Colors.border,
    paddingLeft: 12,
  },
  profileDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  chipsLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  conditionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionChip: {
    backgroundColor: Colors.primaryGlow2,
    borderWidth: 1,
    borderColor: `${Colors.primary}44`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  conditionChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  notesLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  notesText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  spacer: {
    height: 32,
  },
  logoutBtn: {
    borderColor: Colors.danger,
    color: Colors.danger,
  },
});
