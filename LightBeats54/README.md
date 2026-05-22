# LightBeats

Mobile application built with React Native (Expo SDK 54) for Laboratory 3 of the CI-0161 — Mobile Application Development course, Universidad de Costa Rica.

The app synchronizes the device flashlight with music beats captured by the microphone in real time, and integrates the accelerometer to detect when the phone is placed face down.

## Team

- Álvaro Moya Arrieta — C15331
- Sebastián Blanco Quesada — C11085

## Integrated Sensors

| Sensor | Package | Description |
|---|---|---|
| Microphone | expo-av | Captures real-time audio and measures amplitude (dBFS) |
| Flashlight / Camera | expo-camera | Controls the LED flash synchronized with beats |
| Accelerometer | expo-sensors | Detects face-down position to turn off the flashlight |

## Prerequisites

- Node.js 18+
- npm
- Expo Go installed on the device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Or Android Studio / Xcode for emulator use

## Installation and Setup

1. Clone the repository

```bash
git clone https://github.com/MrWhite2312-IS/Lab3Moviles.git
cd Lab3Moviles/LightBeats54
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npx expo start
```

4. Scan the QR code with Expo Go or press `a` for Android / `i` for iOS

## Required Permissions

| Permission | Platform | Usage |
|---|---|---|
| RECORD_AUDIO | Android / iOS | Microphone audio capture |
| CAMERA | Android / iOS | Flashlight control |

Permissions are requested at runtime on first use.

## Project Structure

```
src/
├── app/
│   └── index.tsx                 # Main screen with tab navigation
├── components/
│   ├── light-beats.tsx           # LightBeats screen (microphone + flashlight)
│   └── accelerometer-display.tsx # Accelerometer screen
└── hooks/
    ├── use-audio-analyzer.ts     # Microphone hook
    ├── use-flashlight-control.ts # Flashlight hook
    ├── use-accelerometer.ts      # Accelerometer hook
    └── useScreenOrientation.ts   # Screen orientation hook
```

## Features

- Real-time beat detection through audio amplitude analysis
- Flashlight synchronized with beats with configurable debounce
- Adjustable sensitivity threshold via slider (0–100%)
- Amplitude visualizer with 10 animated bars
- Automatic face-down detection — turns off the flashlight
- Responsive layout for portrait and landscape modes
- Dedicated accelerometer tab with tilt ball indicator
