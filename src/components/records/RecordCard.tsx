// ─────────────────────────────────────────────────────────────────────────────
// src/components/records/RecordCard.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { GlassCard } from '../ui/GlassCard';
import { RiskBadge } from '../ui/RiskBadge';
import {
  formatDate,
  formatConfidence,
  getTestTypeLabel,
  getTestTypeIcon,
} from '../../utils/formatters';
import type { TestRecord } from '../../types';

interface RecordCardProps {
  record: TestRecord;
  onPress: () => void;
}

export function RecordCard({ record, onPress }: RecordCardProps) {
  const result = record.glaucoma_result || record.dr_result;
  const riskLevel =
    record.test_type === 'both'
      ? record.glaucoma_result?.risk_level === 'HIGH' || record.dr_result?.risk_level === 'HIGH'
        ? 'HIGH'
        : record.glaucoma_result?.risk_level === 'MODERATE' || record.dr_result?.risk_level === 'MODERATE'
        ? 'MODERATE'
        : record.glaucoma_result?.risk_level === 'LOW-MODERATE' || record.dr_result?.risk_level === 'LOW-MODERATE'
        ? 'LOW-MODERATE'
        : 'LOW'
      : result?.risk_level || 'UNCERTAIN';

  const confidence =
    record.test_type === 'both'
      ? Math.max(record.glaucoma_result?.confidence ?? 0, record.dr_result?.confidence ?? 0)
      : result?.confidence ?? 0;

  const predictionText =
    record.test_type === 'both'
      ? `${record.glaucoma_result?.prediction === 'glaucoma' ? 'Glaucoma' : 'Normal'} / ${
          record.dr_result?.prediction === 'Diabetic Retinopathy' ? 'DR' : 'No DR'
        }`
      : record.test_type === 'glaucoma'
      ? record.glaucoma_result?.prediction === 'glaucoma'
        ? 'Glaucoma Detected'
        : 'Normal Optic Disc'
      : record.dr_result?.prediction === 'Diabetic Retinopathy'
      ? 'DR Detected'
      : 'No Diabetic Retinopathy';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.container}
      accessibilityLabel={`Test record for ${getTestTypeLabel(record.test_type)}, done on ${formatDate(record.created_at)}`}
    >
      <GlassCard noPadding style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={getTestTypeIcon(record.test_type) as any} size={22} color={Colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{getTestTypeLabel(record.test_type)}</Text>
            <Text style={styles.date}>{formatDate(record.created_at)}</Text>
          </View>
          <RiskBadge level={riskLevel} size="sm" />
        </View>

        <View style={styles.body}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Prediction</Text>
            <Text style={styles.value} numberOfLines={1}>
              {predictionText}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Max Confidence</Text>
            <Text style={[styles.value, styles.amberValue]}>
              {formatConfidence(confidence)}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.viewDetailsText}>Tap to view full analysis</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primaryGlow2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  date: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  body: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  value: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text,
    maxWidth: '65%',
  },
  amberValue: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  viewDetailsText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
