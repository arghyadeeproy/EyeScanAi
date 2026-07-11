// ─────────────────────────────────────────────────────────────────────────────
// src/navigation/AppTabs.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { RecordsScreen } from '../screens/RecordsScreen';
import { RecordDetailScreen } from '../screens/RecordDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import type { AppTabsParamList, RecordsStackParamList, ProfileStackParamList } from '../types';

// ─── Stack Navigators ─────────────────────────────────────────────────────────

const RecordsStack = createStackNavigator<RecordsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

function RecordsTabStack() {
  return (
    <RecordsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.bold,
          color: Colors.text,
          fontSize: FontSize.lg,
        },
        headerTintColor: Colors.primary,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <RecordsStack.Screen
        name="RecordsList"
        component={RecordsScreen}
        options={{ title: 'Diagnostic Records' }}
      />
      <RecordsStack.Screen
        name="RecordDetail"
        component={RecordDetailScreen}
        options={{ title: 'Record Details' }}
      />
    </RecordsStack.Navigator>
  );
}

function ProfileTabStack() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.bold,
          color: Colors.text,
          fontSize: FontSize.lg,
        },
        headerTintColor: Colors.primary,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <ProfileStack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Patient Information' }}
      />
    </ProfileStack.Navigator>
  );
}

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: Colors.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: FontSize.xs,
        },
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.bold,
          color: Colors.text,
          fontSize: FontSize.lg,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Scan':
              iconName = focused ? 'scan' : 'scan-outline';
              break;
            case 'Records':
              iconName = focused ? 'medical' : 'medical-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          if (route.name === 'Scan') {
            return (
              <View style={[styles.fabContainer, focused && styles.fabContainerActive]}>
                <Ionicons name="scan" size={26} color={Colors.background} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Dashboard', headerShown: false }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: 'New Scan',
          tabBarLabel: 'EyeScan',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Records"
        component={RecordsTabStack}
        options={{ title: 'Records', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTabStack}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    borderWidth: 4,
    borderColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  fabContainerActive: {
    backgroundColor: Colors.primaryLight,
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
});
