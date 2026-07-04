# Android App

The Android version lives in `android/` and is built with Capacitor from the same offline web app used on macOS.

## What Is Ready

- Native Android package id: `com.example.italiancoach`
- App label: `Italian Coach`
- Web assets synced into `android/app/src/main/assets/public`
- Launcher icons and splash images generated from the app artwork
- Offline-first app content with optional self-hosted sync

## Commands

```bash
npm run android:sync
npm run android:build
npm run android:install
```

## Requirements

You need:

- JDK 21
- Android SDK command-line tools or Android Studio

When a phone is ready, connect it with USB debugging enabled and run `npm run android:install`.

The Android app is local-first. To sync across devices, run the included sync server on a reachable machine and enter that URL in the app's Sync panel.

Before publishing your own build, replace the sample package id `com.example.italiancoach` in:

- `capacitor.config.json`
- `android/app/build.gradle`
- `android/app/src/main/res/values/strings.xml`
- `android/app/src/main/java/com/example/italiancoach/MainActivity.java`
