// ─────────────────────────────────────────────────────────────────────────────
// src/screens/RecordsScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Toast from 'react-native-toast-message';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { RecordCard } from '../components/records/RecordCard';
import { getRecords, deleteRecord } from '../api/recordsApi';
import { extractErrorMessage } from '../utils/formatters';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RecordsStackParamList, TestRecord, TestType } from '../types';

type Props = StackScreenProps<RecordsStackParamList, 'RecordsList'>;

export function RecordsScreen({ navigation }: Props) {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [filter, setFilter] = useState<'all' | TestType>('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchRecords = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const testTypeParam = filter === 'all' ? undefined : filter;
        const res = await getRecords({ limit: 40, test_type: testTypeParam });
        setRecords(res.records);
        setTotal(res.total);
      } catch (err: unknown) {
        const msg = extractErrorMessage(err);
        Toast.show({
          type: 'error',
          text1: 'Failed to load records',
          text2: msg,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Refetch when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRecords(true);
    });
    return unsubscribe;
  }, [navigation, fetchRecords]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecords(true);
  }, [fetchRecords]);

  const handleDelete = async (recordId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to permanently delete this diagnostic record from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecord(recordId);
              setRecords((prev) => prev.filter((r) => r.id !== recordId));
              setTotal((prev) => Math.max(0, prev - 1));
              Toast.show({
                type: 'success',
                text1: 'Record Deleted',
                text2: 'The diagnostic log has been removed.',
              });
            } catch (err: unknown) {
              const msg = extractErrorMessage(err);
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: msg,
              });
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (recordId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDelete(recordId)}
        accessibilityLabel="Delete diagnostic record"
      >
        <Ionicons name="trash-outline" size={24} color={Colors.text} />
      </TouchableOpacity>
    );
  };

  const renderFilterChips = () => {
    const filters: Array<{ label: string; value: 'all' | TestType }> = [
      { label: 'All Scans', value: 'all' },
      { label: 'Glaucoma', value: 'glaucoma' },
      { label: 'Diabetic Ret.', value: 'dr' },
      { label: 'Combined', value: 'both' },
    ];

    return (
      <View style={styles.chipsContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.chipsScroll}
          renderItem={({ item }) => {
            const active = filter === item.value;
            return (
              <TouchableOpacity
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(item.value)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <GlassCard style={styles.emptyCard} glowColor={Colors.borderGlow}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="documents-outline" size={44} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No Diagnostic History Found</Text>
          <Text style={styles.emptyDesc}>
            {filter === 'all'
              ? 'Your completed retina scans and test predictions will appear here.'
              : `You haven't run any scans utilizing the ${filter} model yet.`}
          </Text>
        </GlassCard>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterChips()}

      {loading && !refreshing ? (
        <ActivityIndicator color={Colors.primary} size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(item.id)}
              friction={2}
              rightThreshold={40}
            >
              <RecordCard
                record={item}
                onPress={() => navigation.navigate('RecordDetail', { recordId: item.id })}
              />
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chipsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.background,
    fontFamily: FontFamily.bold,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: Colors.danger,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 16,
    marginLeft: 10,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primaryGlow2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
    textAlign: 'center',
  },
  emptyDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
});
