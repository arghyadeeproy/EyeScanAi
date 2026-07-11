// ─────────────────────────────────────────────────────────────────────────────
// src/screens/RecordDetailScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { RecordDetail } from '../components/records/RecordDetail';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { getRecord } from '../api/recordsApi';
import { extractErrorMessage } from '../utils/formatters';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RecordsStackParamList, TestRecord } from '../types';

type Props = StackScreenProps<RecordsStackParamList, 'RecordDetail'>;

export function RecordDetailScreen({ route, navigation }: Props) {
  const { recordId } = route.params;
  const [record, setRecord] = useState<TestRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecordDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecord(recordId);
      setRecord(data);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      Toast.show({
        type: 'error',
        text1: 'Could not load record details',
        text2: msg,
      });
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    fetchRecordDetails();
  }, [fetchRecordDetails]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Fetching diagnostic results...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No record details found.</Text>
        <PrimaryButton
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RecordDetail record={record} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  loadingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  errorText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  backBtn: {
    width: '60%',
  },
});
