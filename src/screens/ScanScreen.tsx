// ─────────────────────────────────────────────────────────────────────────────
// src/screens/ScanScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { RiskBadge } from '../components/ui/RiskBadge';
import { ConfidenceRing } from '../components/ui/ConfidenceRing';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { predictGlaucoma, predictDR, predictBoth } from '../api/predictApi';
import { createRecord } from '../api/recordsApi';
import { useAuth } from '../hooks/useAuth';
import { extractErrorMessage, getRiskColor, getRiskGlow } from '../utils/formatters';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AppTabsParamList, TestType, GlaucomaResult, DRResult, BothResult } from '../types';

type Props = BottomTabScreenProps<AppTabsParamList, 'Scan'>;

export function ScanScreen({ route, navigation }: Props) {
  const { isAuthenticated } = useAuth();
  
  // Steps: 1 = Config/Pick, 2 = Running, 3 = Complete
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scanType, setScanType] = useState<TestType>('both');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  
  // Results
  const [glaucomaResult, setGlaucomaResult] = useState<GlaucomaResult | null>(null);
  const [drResult, setDrResult] = useState<DRResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [predicting, setPredicting] = useState(false);

  // Read initial parameters passed from Home Tab
  useEffect(() => {
    const params = route.params as { initialScanType?: TestType } | undefined;
    if (params?.initialScanType) {
      setScanType(params.initialScanType);
      // Clean params so it doesn't reset state on next focuses
      navigation.setParams({ initialScanType: undefined } as any);
    }
  }, [route.params, navigation]);

  // Glow pulse for "Run Scan" state
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (step === 2) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [step, pulse]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    shadowOpacity: step === 2 ? 0.8 : 0.2,
  }));

  const selectImage = async (useCamera: boolean) => {
    try {
      let statusResult;
      if (useCamera) {
        statusResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        statusResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (statusResult.status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: `App requires ${useCamera ? 'Camera' : 'Gallery'} access to proceed.`,
        });
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageMime(asset.mimeType || 'image/jpeg');
        setImageName(asset.fileName || `eye_scan_${Date.now()}.jpg`);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not capture or load selected image.',
      });
    }
  };

  const handleRunScan = async () => {
    if (!imageUri) {
      Toast.show({
        type: 'error',
        text1: 'Missing Image',
        text2: 'Please capture or select an image file first.',
      });
      return;
    }

    setStep(2);
    setPredicting(true);
    setGlaucomaResult(null);
    setDrResult(null);
    setIsSaved(false);

    try {
      const asset = { uri: imageUri, name: imageName, mimeType: imageMime };

      if (scanType === 'glaucoma') {
        const res = await predictGlaucoma(asset);
        setGlaucomaResult(res);
      } else if (scanType === 'dr') {
        const res = await predictDR(asset);
        setDrResult(res);
      } else {
        const res = await predictBoth(asset);
        setGlaucomaResult(res.glaucoma);
        setDrResult(res.dr);
      }
      setStep(3);
    } catch (err: unknown) {
      setStep(1);
      const msg = extractErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Scan Failed',
        text2: msg,
      });
    } finally {
      setPredicting(false);
    }
  };

  const handleSaveToRecords = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You must login or create an account to save test records to cloud history.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => navigation.navigate('Profile') },
        ]
      );
      return;
    }

    setSaving(true);
    try {
      await createRecord({
        test_type: scanType,
        image_name: imageName,
        glaucoma_result: glaucomaResult || undefined,
        dr_result: drResult || undefined,
        notes: `Manual diagnostics capture using ${scanType} module.`,
      });
      setIsSaved(true);
      Toast.show({
        type: 'success',
        text1: 'Record Saved',
        text2: 'Your diagnostic scan has been stored securely.',
      });
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const resetScan = () => {
    setImageUri(null);
    setImageName('');
    setGlaucomaResult(null);
    setDrResult(null);
    setIsSaved(false);
    setStep(1);
  };

  const renderConfigStep = () => {
    return (
      <View style={styles.stepContainer}>
        {/* Scan Type Choice */}
        <Text style={styles.label}>1. Select Target Analysis</Text>
        <View style={styles.segmentContainer}>
          {(['glaucoma', 'dr', 'both'] as TestType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.segmentBtn, scanType === type && styles.segmentBtnActive]}
              onPress={() => setScanType(type)}
            >
              <Text style={[styles.segmentText, scanType === type && styles.segmentTextActive]}>
                {type === 'glaucoma' ? 'Glaucoma' : type === 'dr' ? 'DR' : 'Combined'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Image Input Selection */}
        <Text style={styles.label}>2. Upload Retinal Fundus Photo</Text>
        {imageUri ? (
          <GlassCard style={styles.previewCard}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              <Text style={styles.removeText}>Remove image</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <View style={styles.pickerRow}>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => selectImage(true)}
              accessibilityLabel="Select from Camera"
            >
              <Ionicons name="camera-outline" size={32} color={Colors.primary} />
              <Text style={styles.pickerBtnText}>Capture Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => selectImage(false)}
              accessibilityLabel="Select from Photos"
            >
              <Ionicons name="images-outline" size={32} color={Colors.primary} />
              <Text style={styles.pickerBtnText}>Select Photos</Text>
            </TouchableOpacity>
          </View>
        )}

        {imageUri && (
          <PrimaryButton
            title="Execute Diagnostic Run"
            onPress={handleRunScan}
            style={styles.runBtn}
          />
        )}
      </View>
    );
  };

  const renderResultCard = (
    title: string,
    res: GlaucomaResult | DRResult,
    isGlaucoma: boolean
  ) => {
    const isAbnormal = isGlaucoma
      ? (res as GlaucomaResult).prediction === 'glaucoma'
      : (res as DRResult).prediction === 'Diabetic Retinopathy';

    const predLabel = isGlaucoma
      ? (res as GlaucomaResult).prediction === 'glaucoma'
        ? 'Glaucoma Detected'
        : 'Normal Optic Disc'
      : (res as DRResult).prediction === 'Diabetic Retinopathy'
      ? 'DR Detected'
      : 'No Diabetic Retinopathy';

    const color = getRiskColor(res.risk_level);
    const glow = getRiskGlow(res.risk_level);

    return (
      <GlassCard key={title} style={styles.resultCard} glowColor={glow}>
        <View style={styles.resultCardHeader}>
          <Text style={styles.resultCardTitle}>{title}</Text>
          <RiskBadge level={res.risk_level} />
        </View>

        <View style={styles.resultCardContent}>
          <ConfidenceRing value={res.confidence} size={94} strokeWidth={8} color={color} />
          
          <View style={styles.resultDetails}>
            <Text style={[styles.resultPredictionText, { color }]}>{predLabel}</Text>
            {isGlaucoma && (res as GlaucomaResult).optic_disc.detected && (
              <Text style={styles.discText}>✓ Optic disc captured successfully</Text>
            )}
            <Text style={styles.resultInferenceTime}>
              Time: {res.inference_time_ms.toFixed(0)} ms
            </Text>
          </View>
        </View>

        <View style={styles.resultDivider} />
        
        <View style={styles.recommendationBox}>
          <Ionicons name="bulb-outline" size={18} color={Colors.primary} />
          <Text style={styles.recommendationText}>{res.recommendation}</Text>
        </View>
      </GlassCard>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Diagnostic Studio</Text>
          <Text style={styles.subtitle}>Analyze high-resolution fundus eye images in real-time</Text>
        </View>

        {step === 1 && renderConfigStep()}

        {step === 2 && (
          <View style={styles.runningContainer}>
            <Animated.View style={[styles.pulseCircle, animatedGlowStyle]}>
              <Ionicons name="scan-outline" size={60} color={Colors.primary} />
            </Animated.View>
            <Text style={styles.runningTitle}>Running Neural Networks</Text>
            <Text style={styles.runningSubtitle}>
              Uploading and analyzing image file: {imageName}
            </Text>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Analysis Outcomes</Text>
            
            {glaucomaResult && renderResultCard('Glaucoma Algorithm', glaucomaResult, true)}
            {drResult && renderResultCard('Diabetic Retinopathy Algorithm', drResult, false)}

            <View style={styles.actionRow}>
              {!isSaved ? (
                <PrimaryButton
                  title="Save to Records"
                  onPress={handleSaveToRecords}
                  loading={saving}
                  style={styles.saveBtn}
                />
              ) : (
                <View style={styles.savedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  <Text style={styles.savedText}>Saved to Cloud Records</Text>
                </View>
              )}

              <PrimaryButton
                title="Scan Again"
                variant="outlined"
                onPress={resetScan}
                style={styles.resetBtn}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <LoadingOverlay visible={predicting} message="Processing fundus photographs..." />
    </SafeAreaView>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.text,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 6,
  },
  stepContainer: {
    gap: 16,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text,
    marginTop: 8,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: Colors.background,
    fontFamily: FontFamily.bold,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerBtn: {
    flex: 1,
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pickerBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    padding: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: `${Colors.danger}15`,
    borderRadius: 8,
  },
  removeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.danger,
  },
  runBtn: {
    marginTop: 16,
  },
  runningContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 20,
  },
  pulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryGlow,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 8,
  },
  runningTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  runningSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: Colors.card,
    marginBottom: 16,
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  resultCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  resultDetails: {
    flex: 1,
    gap: 6,
  },
  resultPredictionText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  discText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.success,
  },
  resultInferenceTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  resultDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  saveBtn: {
    flex: 1.2,
  },
  resetBtn: {
    flex: 1,
  },
  savedBadge: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.success}15`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
    height: 54,
    gap: 8,
  },
  savedText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.success,
  },
});
