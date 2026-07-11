// ─────────────────────────────────────────────────────────────────────────────
// src/components/records/RecordDetail.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { GlassCard } from '../ui/GlassCard';
import { RiskBadge } from '../ui/RiskBadge';
import { ConfidenceRing } from '../ui/ConfidenceRing';
import { formatDateTime, getTestTypeLabel, getTestTypeIcon } from '../../utils/formatters';
import type { TestRecord, GlaucomaResult, DRResult } from '../../types';

interface RecordDetailProps {
  record: TestRecord;
}

export function RecordDetail({ record }: RecordDetailProps) {
  const renderGlaucomaResult = (res: GlaucomaResult) => {
    const isAbnormal = res.prediction === 'glaucoma';
    const statusText = isAbnormal ? 'Glaucoma Detected' : 'Normal / Healthy';
    const statusColor = isAbnormal ? Colors.danger : Colors.success;

    return (
      <GlassCard style={styles.sectionCard} glowColor={`${statusColor}44`}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Glaucoma Analysis</Text>
        </View>

        <View style={styles.resultMain}>
          <ConfidenceRing value={res.confidence} size={90} strokeWidth={8} color={statusColor} />
          <View style={styles.resultMeta}>
            <Text style={[styles.predictionLabel, { color: statusColor }]}>{statusText}</Text>
            <View style={styles.badgeRow}>
              <RiskBadge level={res.risk_level} />
            </View>
            <Text style={styles.inferenceTime}>
              Inference: {res.inference_time_ms.toFixed(0)}ms
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Optic Disc Detection</Text>
          <Text style={styles.detailValue}>
            {res.optic_disc.detected ? '✓ Detected' : '✗ Not Detected'}
          </Text>
        </View>
        {res.optic_disc.detected && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Detection Confidence</Text>
            <Text style={styles.detailValue}>
              {(res.optic_disc.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.recommendationLabel}>Recommendation</Text>
        <Text style={styles.recommendationText}>{res.recommendation}</Text>
      </GlassCard>
    );
  };

  const renderDRResult = (res: DRResult) => {
    const isAbnormal = res.prediction === 'Diabetic Retinopathy';
    const statusText = isAbnormal ? 'Diabetic Retinopathy' : 'No Diabetic Retinopathy';
    const statusColor = isAbnormal ? Colors.danger : Colors.success;

    return (
      <GlassCard style={styles.sectionCard} glowColor={`${statusColor}44`}>
        <View style={styles.sectionHeader}>
          <Ionicons name="cellular" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Diabetic Retinopathy Analysis</Text>
        </View>

        <View style={styles.resultMain}>
          <ConfidenceRing value={res.confidence} size={90} strokeWidth={8} color={statusColor} />
          <View style={styles.resultMeta}>
            <Text style={[styles.predictionLabel, { color: statusColor }]}>{statusText}</Text>
            <View style={styles.badgeRow}>
              <RiskBadge level={res.risk_level} />
            </View>
            <Text style={styles.inferenceTime}>
              Inference: {res.inference_time_ms.toFixed(0)}ms
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.recommendationLabel}>Recommendation</Text>
        <Text style={styles.recommendationText}>{res.recommendation}</Text>
      </GlassCard>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <GlassCard style={styles.infoCard}>
        <View style={styles.infoHead}>
          <View style={styles.typeRow}>
            <Ionicons name={getTestTypeIcon(record.test_type) as any} size={24} color={Colors.primary} />
            <Text style={styles.infoTitle}>{getTestTypeLabel(record.test_type)}</Text>
          </View>
          <Text style={styles.infoDate}>{formatDateTime(record.created_at)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Record ID</Text>
            <Text style={styles.gridValue} numberOfLines={1} ellipsizeMode="middle">
              {record.id}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Image File</Text>
            <Text style={styles.gridValue} numberOfLines={1}>
              {record.image_name}
            </Text>
          </View>
        </View>

        {record.notes ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{record.notes}</Text>
          </>
        ) : null}
      </GlassCard>

      {record.glaucoma_result && renderGlaucomaResult(record.glaucoma_result)}
      {record.dr_result && renderDRResult(record.dr_result)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: Colors.card,
  },
  infoHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  infoDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  gridValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  notesLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  notesText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: Colors.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  resultMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  resultMeta: {
    flex: 1,
    gap: 6,
  },
  predictionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  inferenceTime: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  detailValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  recommendationLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginBottom: 6,
  },
  recommendationText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
