// ─────────────────────────────────────────────────────────────────────────────
// index.ts  — Main Entry Point for EyeScan AI (Standard Expo registerRootComponent)
// ─────────────────────────────────────────────────────────────────────────────

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
