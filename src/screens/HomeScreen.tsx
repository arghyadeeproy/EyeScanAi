// ─────────────────────────────────────────────────────────────────────────────
// src/screens/HomeScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { GlassCard } from '../components/ui/GlassCard';
import { RecordCard } from '../components/records/RecordCard';
import { getRecords } from '../api/recordsApi';
import { useAuth } from '../hooks/useAuth';
import { getGreeting } from '../utils/formatters';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { AppTabsParamList, TestRecord } from '../types';

type Props = BottomTabScreenProps<AppTabsParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [recent, setRecent] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecentRecords = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getRecords({ limit: 3 });
      setRecent(data.records);
    } catch {
      // Silently ignore or show local info.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentRecords();
  }, [fetchRecentRecords]);

  // Refetch when tab gets focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRecentRecords(true);
    });
    return unsubscribe;
  }, [navigation, fetchRecentRecords]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecentRecords(true);
  }, [fetchRecentRecords]);

  const navigateToScan = (type: 'glaucoma' | 'dr' | 'both') => {
    navigation.navigate('Scan', { initialScanType: type } as any);
  };

  const handleRecordPress = (record: TestRecord) => {
    // Navigate to Records tab, which is a nested stack, and push RecordDetail
    navigation.navigate('Records', {
      screen: 'RecordDetail',
      params: { recordId: record.id },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()},
            </Text>
            <Text style={styles.username}>{user?.display_name ?? 'Guest'} 👁️</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="View profile"
          >
            <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Scan Actions Section */}
        <Text style={styles.sectionTitle}>Perform Diagnostics</Text>
        <View style={styles.scanGrid}>
          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => navigateToScan('glaucoma')}
            activeOpacity={0.9}
            accessibilityLabel="Glaucoma scan button"
          >
            <GlassCard style={styles.scanCard} glowColor={Colors.borderGlow}>
              <View style={styles.scanIconBg}>
                <Ionicons name="eye" size={26} color={Colors.primary} />
              </View>
              <Text style={styles.scanTitle}>Glaucoma Scan</Text>
              <Text style={styles.scanDesc}>Analyze optic nerve heads and evaluate disk health</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cardBtn}
            onPress={() => navigateToScan('dr')}
            activeOpacity={0.9}
            accessibilityLabel="Diabetic Retinopathy scan button"
          >
            <GlassCard style={styles.scanCard} glowColor={Colors.borderGlow}>
              <View style={styles.scanIconBg}>
                <Ionicons name="cellular" size={26} color={Colors.primary} />
              </View>
              <Text style={styles.scanTitle}>DR Scan</Text>
              <Text style={styles.scanDesc}>Detect lesions, exudates, and vascular abnormalities</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.fullCardBtn}
          onPress={() => navigateToScan('both')}
          activeOpacity={0.9}
          accessibilityLabel="Combined both glaucoma and diabetic retinopathy scan button"
        >
          <GlassCard style={styles.bothCard} glowColor={Colors.primaryGlow}>
            <View style={styles.bothIconBg}>
              <Ionicons name="scan-circle" size={32} color={Colors.primary} />
            </View>
            <View style={styles.bothTextContainer}>
              <Text style={styles.bothTitle}>Combined Analysis</Text>
              <Text style={styles.bothDesc}>Run both Glaucoma & Diabetic Retinopathy algorithms in parallel</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </GlassCard>
        </TouchableOpacity>

        {/* Recent Results Section */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Results</Text>
          {recent.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Records')}>
              <Text style={styles.viewAllBtn}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={styles.loader} />
        ) : recent.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No diagnostic records yet</Text>
            <TouchableOpacity style={styles.emptyAction} onPress={() => navigateToScan('both')}>
              <Text style={styles.emptyActionText}>Run your first scan</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <View style={styles.list}>
            {recent.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onPress={() => handleRecordPress(record)}
              />
            ))}
          </View>
        )}
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  username: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.text,
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: 14,
  },
  scanGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  cardBtn: {
    flex: 1,
  },
  scanCard: {
    minHeight: 160,
    padding: 16,
    gap: 12,
    backgroundColor: 'rgba(20, 20, 20, 0.4)',
  },
  scanIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primaryGlow2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}22`,
  },
  scanTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  scanDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  fullCardBtn: {
    marginBottom: 28,
  },
  bothCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    backgroundColor: 'rgba(245, 197, 24, 0.05)',
    borderWidth: 1,
    borderColor: Colors.primaryGlow,
  },
  bothIconBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.primaryGlow2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bothTextContainer: {
    flex: 1,
    gap: 4,
  },
  bothTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  bothDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  viewAllBtn: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  loader: {
    marginVertical: 20,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.surface,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 10,
  },
  emptyAction: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryGlow2,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  emptyActionText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  list: {
    gap: 2,
  },
});
