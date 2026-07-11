// ─────────────────────────────────────────────────────────────────────────────
// App.tsx  — Root application wrapper
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View, LogBox } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import { Colors } from './src/theme/colors';
import { FontFamily, FontWeights, useFonts } from './src/theme/typography';

// Must be called before any navigator renders
enableScreens();

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Found screens with the same name nested inside one another.',
]);

export default function App() {
  const [fontsLoaded, fontError] = useFonts(FontWeights);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  // Blank dark screen while fonts load — do NOT use custom FontFamily here
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      </View>
    );
  }

  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.background,
      card: Colors.card,
      border: Colors.border,
      text: Colors.text,
    },
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef} theme={navTheme}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            <View style={styles.flex}>
              <RootNavigator />

              {isOffline && (
                <SafeAreaView edges={['bottom']} style={styles.offlineBanner}>
                  <Text style={styles.offlineText}>
                    ⚠️  No internet — Scans and record sync unavailable.
                  </Text>
                </SafeAreaView>
              )}
            </View>

            <Toast />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  offlineBanner: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  offlineText: {
    color: Colors.background,
    fontFamily: FontFamily.bold,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
