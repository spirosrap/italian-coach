# Italian Coach

Italian Coach is a local-first adaptive practice app for learning Italian alongside Duolingo. It tunes each session to the learner's available time, current energy, focus area, and actual answer history.

![Italian Coach icon](assets/app-icon-192.png)

## What It Does

- Builds short Italian practice sessions from a local course bank.
- Adapts difficulty from `Energy`, `Minutes`, and `Focus` controls.
- Mixes weak items, due review, new material, and occasional stretch phrases.
- Tracks wrong answers and gives them a dedicated mistake-review loop.
- Supports typed recall, multiple choice, grammar fill-ins, and browser speech playback for listening reps.
- Saves progress privately in browser `localStorage`.
- Optionally syncs progress through a small self-hosted server.
- Runs as a macOS local app/PWA and as an Android Capacitor app.

## Learning Model

Each item keeps a small local progress record:

- attempts and correct answers
- missed answers and the most recent wrong input
- strength score from `0` to `1`
- next due time
- last self-grade: `Again`, `Hard`, `Good`, or `Easy`

The next session favors unresolved mistakes, low-strength items, and due items, then adds fresh material based on energy. Lower-energy sessions use gentler recognition work; higher-energy sessions add harder recall and a little more new content.

## Mistake Review

Wrong answers are saved in a small mistake list with:

- the prompt
- the answer you gave
- the correct answer
- how many times the item was missed

Use `Practice mistakes` to start a focused review session. A mistake is cleared after you answer it correctly and grade it `Good` or `Easy`.

## Run on macOS

Double-click `Open Italian Coach.command`, or run:

```bash
npm install
npm run serve
```

Then open `http://127.0.0.1:4179`.

## Sync Server

Sync is optional. Local practice works without a server.

To sync across devices, run the included server on a machine reachable by those devices:

```bash
npm run serve
```

Then enter that server URL in the app's Sync panel, for example:

```text
http://your-server:4179
```

The shared progress store is written to:

```text
data/progress.json
```

That file is intentionally ignored by Git because it contains personal learning progress.

## Sync Behavior

Each app instance keeps its own local copy. When a sync server URL is configured, the app syncs when:

- the app starts
- the app comes back to the foreground
- the network reconnects
- a practice answer is graded
- the Sync button is pressed

Sync is merge-based. The server keeps the highest per-item attempts, correct counts, missed counts, strength, due values, unresolved mistakes, and the freshest settings/history. This lets the Mac and Android app reconcile after either one was closed.

## Android

The Android app is generated with Capacitor from the same offline web app.

```bash
npm install
npm run android:sync
npm run android:build
npm run android:install
```

The Android build expects:

- JDK 21
- Android SDK command-line tools or Android Studio
- a USB-connected Android device with USB debugging enabled for `android:install`

The sample Android package id is `com.example.italiancoach`. Change `appId`, `namespace`, and `applicationId` before publishing your own build.

## Project Layout

```text
.
├── app.js                  # adaptive practice engine and UI behavior
├── styles.css              # responsive app styling
├── index.html              # PWA shell
├── assets/                 # generated app artwork and icons
├── android/                # Capacitor Android project
├── scripts/                # local server and web asset copy helper
├── manifest.webmanifest    # PWA metadata
└── sw.js                   # offline cache service worker
```

## Privacy

Italian Coach does not send practice data to any third-party service. Progress stays on your devices and, when sync is enabled, on the server you configure at `data/progress.json`.

## Roadmap

- Add spaced repetition import/export.
- Add more A1/A2 travel, food, and verb decks.
- Add a daily streak screen.
- Add optional speech-recognition scoring on Android.
