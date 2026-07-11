# EyeScan AI 👁️

A premium, production-quality React Native mobile application built with **Expo SDK 54** for real-time detection of eye diseases (Glaucoma & Diabetic Retinopathy) utilizing deep learning algorithms. 

The application features a dark theme utilizing an **Amber/Yellow** accents system with custom glassmorphism cards, micro-animations, fully typed network structures, secure offline fallback layers, and structured clinical profile syncing.

---

## 🚀 Key Features

*   **Premium HSL Dark Aesthetics**: Tailored black (`#0A0A0A`) & amber/yellow (`#F5C518` / `#FFD700`) color palette featuring subtle glow rings, depth-based card styling, and custom glass elements.
*   **Segmented Multi-Neural Scanning**:
    *   *Glaucoma Analyser*: Checks optic disc parameters, box coordinates, and outputs confidence statistics.
    *   *Diabetic Retinopathy (DR) Analyser*: Assesses retina photographs for microaneurysms and exudate lesions.
    *   *Combined Diagnostic Mode*: Executes both neural network predictions in parallel.
*   **Fully-Typed Auth Engine**: Custom JWT interceptors handling Bearer injection, background token refreshing with concurrent request queues, and automated expiration routing.
*   **Diagnostic Logs**: Displays list views with status indicators, swipable rows for item removal, category filters, and detail modals.
*   **Clinical Profiles**: Medical profiling form for saving patient data (demographics, smokes, diabetes types, blood pressure) affecting model context.
*   **Accessibility & UX**: Includes ARIA navigation labels, loading overlay states, custom animations, and a sticky offline banner indicator.

---

## 🛠️ Technology Stack

| Core Concern | Library / Tool |
|---|---|
| Framework | **Expo SDK 54** (Managed Workflow) with **TypeScript** |
| Navigation | React Navigation v7 (`@react-navigation/native` + `stack` + `bottom-tabs`) |
| Network / HTTP | `axios` with global refresh interceptors |
| Authentication | React Context + `expo-secure-store` |
| Image Acquisition | `expo-image-picker` (Camera & Photo rolls) |
| Form Binding | `react-hook-form` |
| Motion / Animation | `react-native-reanimated` |
| Typography | `expo-google-fonts` utilizing the **Inter** font family |
| Connection Monitor | `@react-native-community/netinfo` |
| Notification Toast | `react-native-toast-message` |

---

## ⚙️ Configuration & Environment Setup

The backend endpoint is driven dynamically by the environment. To alter it:

1. Locate the `.env` file in the project root.
2. Edit the API endpoint value `EXPO_PUBLIC_API_BASE_URL`:

```bash
# .env file

# Android Emulator (points to localhost on hosting machine)
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000

# iOS Simulator
# EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Physical Device Testing (use your hosting machine's local LAN IP)
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.45:8000
```

---

## 💻 Running the Application

Follow these steps to launch the app:

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch the Development Server
```bash
npx expo start
```

### 3. Open on Target Platform
*   Press **`a`** to open on an Android emulator or connected device.
*   Press **`i`** to open on an iOS simulator.
*   Scan the QR code printed in the terminal using the **Expo Go** application on your physical device.

---

## 📁 Source Code Directory Structure

```text
src/
├── api/
│   ├── axiosInstance.ts       # Axios wrapper with auto refresh interceptors
│   ├── authApi.ts             # Auth REST endpoints
│   ├── patientApi.ts          # Medical profile endpoints
│   ├── predictApi.ts          # ML multipart image upload calls
│   └── recordsApi.ts          # History CRUD operations
├── components/
│   ├── ui/
│   │   ├── PrimaryButton.tsx  # Spring-animated click action buttons
│   │   ├── GlassCard.tsx      # Transparent amber-glowing borders
│   │   ├── RiskBadge.tsx      # Dynamic colored status pills
│   │   ├── ConfidenceRing.tsx # Dynamic circular progress indicator
│   │   └── LoadingOverlay.tsx # Pulse ring full screen overlay
│   ├── forms/
│   │   ├── InputField.tsx     # Focused styling validation entries
│   │   └── ToggleSwitch.tsx   # Custom spring toggle switches
│   └── records/
│       ├── RecordCard.tsx     # Swipable logs listings
│       └── RecordDetail.tsx   # Results segment mapping
├── config/
│   └── api.ts                 # BaseURL configuration export
├── context/
│   └── AuthContext.tsx        # Secure session persistent store
├── hooks/
│   ├── useAuth.ts             # Global auth export hook
│   └── usePatientProfile.ts   # Patient status synchronizer
├── navigation/
│   ├── RootNavigator.tsx      # Authentication state router
│   ├── AuthStack.tsx          # Login, SignUp, Splash route stack
│   └── AppTabs.tsx            # Main tab navigation layout
├── screens/
│   ├── SplashScreen.tsx       # Animated eye intro screen
│   ├── LoginScreen.tsx        # Auth login card
│   ├── SignUpScreen.tsx       # New account creator card
│   ├── HomeScreen.tsx         # User welcome dashboard metrics
│   ├── ScanScreen.tsx         # Diagnostic camera controller
│   ├── RecordsScreen.tsx      # Swipable patient records logs
│   ├── RecordDetailScreen.tsx # Multi-algorithm diagnostic results
│   ├── ProfileScreen.tsx      # Patient health summaries
│   └── EditProfileScreen.tsx  # Patient medical questionnaire
├── theme/
│   ├── colors.ts              # Styled palette configuration tokens
│   └── typography.ts          # Inter font weights & sizes configurations
└── utils/
    ├── secureStorage.ts       # Expo keychain save helpers
    └── formatters.ts          # Risk colors & date decorators
```
