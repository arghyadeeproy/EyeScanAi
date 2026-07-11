// ─────────────────────────────────────────────────────────────────────────────
// src/screens/EditProfileScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { InputField } from '../components/forms/InputField';
import { ToggleSwitch } from '../components/forms/ToggleSwitch';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { EYE_CONDITIONS, Gender, DiabetesType, PatientProfile, EyeCondition } from '../types';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../types';

type Props = StackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { profile, save, loading, profileExists } = usePatientProfile();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientProfile>({
    defaultValues: {
      name: '',
      age: 0,
      gender: 'Male',
      location: '',
      optical_power_left: 0.0,
      optical_power_right: 0.0,
      has_diabetes: false,
      diabetes_type: '',
      bp_systolic: 120,
      bp_diastolic: 80,
      existing_eye_conditions: [],
      is_smoker: false,
      notes: '',
    },
  });

  const hasDiabetes = watch('has_diabetes');
  const selectedConditions = watch('existing_eye_conditions') || [];

  // Populate form with existing profile if available
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setValue('age', profile.age);
      setValue('gender', profile.gender);
      setValue('location', profile.location);
      setValue('optical_power_left', profile.optical_power_left);
      setValue('optical_power_right', profile.optical_power_right);
      setValue('has_diabetes', profile.has_diabetes);
      setValue('diabetes_type', profile.diabetes_type);
      setValue('bp_systolic', profile.bp_systolic);
      setValue('bp_diastolic', profile.bp_diastolic);
      setValue('existing_eye_conditions', profile.existing_eye_conditions || []);
      setValue('is_smoker', profile.is_smoker);
      setValue('notes', profile.notes);
    }
  }, [profile, setValue]);

  const toggleEyeCondition = (cond: EyeCondition) => {
    const active = selectedConditions.includes(cond);
    const updated = active
      ? selectedConditions.filter((c) => c !== cond)
      : [...selectedConditions, cond];
    setValue('existing_eye_conditions', updated);
  };

  const onSubmit = async (data: PatientProfile) => {
    try {
      // Coerce inputs to correct types
      const payload = {
        ...data,
        age: Number(data.age),
        optical_power_left: Number(data.optical_power_left),
        optical_power_right: Number(data.optical_power_right),
        bp_systolic: Number(data.bp_systolic),
        bp_diastolic: Number(data.bp_diastolic),
        // Clean diabetes type if has_diabetes is false
        diabetes_type: data.has_diabetes ? data.diabetes_type : '',
      };

      await save(payload);
      Toast.show({
        type: 'success',
        text1: profileExists ? 'Profile Updated' : 'Profile Created',
        text2: 'Patient information saved to cloud health databases.',
      });
      navigation.goBack();
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Could not write clinical profile data.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={styles.formCard}>
          {/* SECTION: Personal Info */}
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Patient name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Full Name"
                placeholder="Enter patient full name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Controller
                control={control}
                name="age"
                rules={{
                  required: 'Age is required',
                  min: { value: 0, message: 'Invalid age' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Age"
                    placeholder="e.g. 28"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? String(value) : ''}
                    error={errors.age?.message}
                  />
                )}
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.pickerLabel}>Gender</Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.segmentedRow}>
                    {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.segmentBtn, value === g && styles.segmentBtnActive]}
                        onPress={() => onChange(g)}
                      >
                        <Text style={[styles.segmentText, value === g && styles.segmentTextActive]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="location"
            rules={{ required: 'Location is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Location / Address"
                placeholder="City, Country"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.location?.message}
              />
            )}
          />

          <View style={styles.divider} />

          {/* SECTION: Medical Info */}
          <Text style={styles.sectionTitle}>Medical Information</Text>
          
          <Controller
            control={control}
            name="is_smoker"
            render={({ field: { onChange, value } }) => (
              <ToggleSwitch
                label="Tobacco Smoking Status"
                sublabel="Current active regular smoker"
                value={value}
                onValueChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="has_diabetes"
            render={({ field: { onChange, value } }) => (
              <ToggleSwitch
                label="Diabetic Condition"
                sublabel="Diagnosed diabetic or pre-diabetic patient"
                value={value}
                onValueChange={onChange}
              />
            )}
          />

          {hasDiabetes && (
            <View style={styles.nestedBox}>
              <Text style={styles.pickerLabel}>Diabetes Diagnosis Type</Text>
              <Controller
                control={control}
                name="diabetes_type"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.segmentedRow}>
                    {(['Type 1', 'Type 2', 'Pre-diabetic'] as DiabetesType[]).map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.segmentBtn, value === t && styles.segmentBtnActive]}
                        onPress={() => onChange(t)}
                      >
                        <Text style={[styles.segmentText, value === t && styles.segmentTextActive]}>
                          {t || 'None'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Controller
                control={control}
                name="bp_systolic"
                rules={{ required: 'BP Systolic required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Systolic BP (mmHg)"
                    placeholder="e.g. 120"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? String(value) : ''}
                    error={errors.bp_systolic?.message}
                  />
                )}
              />
            </View>
            <View style={styles.halfCol}>
              <Controller
                control={control}
                name="bp_diastolic"
                rules={{ required: 'BP Diastolic required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Diastolic BP (mmHg)"
                    placeholder="e.g. 80"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? String(value) : ''}
                    error={errors.bp_diastolic?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* SECTION: Eye Health */}
          <Text style={styles.sectionTitle}>Ophthalmic Status</Text>

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Controller
                control={control}
                name="optical_power_left"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Left Eye Power (D)"
                    placeholder="e.g. -1.5"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value !== undefined ? String(value) : '0.0'}
                  />
                )}
              />
            </View>
            <View style={styles.halfCol}>
              <Controller
                control={control}
                name="optical_power_right"
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputField
                    label="Right Eye Power (D)"
                    placeholder="e.g. -1.25"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value !== undefined ? String(value) : '0.0'}
                  />
                )}
              />
            </View>
          </View>

          <Text style={styles.chipFieldLabel}>Existing Eye Diagnoses</Text>
          <View style={styles.conditionsRow}>
            {EYE_CONDITIONS.map((cond) => {
              const active = selectedConditions.includes(cond);
              return (
                <TouchableOpacity
                  key={cond}
                  style={[styles.conditionChip, active && styles.conditionChipActive]}
                  onPress={() => toggleEyeCondition(cond)}
                >
                  <Text style={[styles.conditionChipText, active && styles.conditionChipTextActive]}>
                    {cond}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Clinical Notes / Allergies"
                placeholder="Enter health history summaries, systemic details..."
                multiline
                numberOfLines={3}
                style={styles.notesInput}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <PrimaryButton
            title="Save Profile Details"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitBtn}
          />
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: Colors.card,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  halfCol: {
    flex: 1,
  },
  pickerLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
    height: 50,
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: Colors.background,
    fontFamily: FontFamily.bold,
  },
  nestedBox: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  chipFieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 10,
    marginBottom: 10,
  },
  conditionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  conditionChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  conditionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  conditionChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  conditionChipTextActive: {
    color: Colors.background,
    fontFamily: FontFamily.bold,
  },
  notesInput: {
    marginTop: 8,
  },
  submitBtn: {
    marginTop: 24,
  },
});
