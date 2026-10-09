# VYBE — Mobile Video Studio

A professional mobile-first short-video camera and editor starter built with Next.js App Router.

## Included
- Real phone camera + microphone capture
- Front/rear camera switching
- Video recording with MediaRecorder
- Import videos from device gallery
- Live video preview
- Trim range controls
- Live visual filters
- Browser-side filtered WebM export
- Import your own music/audio
- Music library UI
- Latest edits / template discovery UI
- Mobile bottom navigation
- Responsive desktop layout

## Run

```bash
npm install
npm run dev
```

Open the HTTPS deployment on your phone for camera access. Camera/microphone access is restricted to secure contexts by browsers.


## Android APK
See [ANDROID-APK.md](ANDROID-APK.md). This project is configured for Capacitor and includes a GitHub Actions workflow to build a debug APK. The APK must be built by Android Gradle; it is not produced just by exporting the web app.

## PWA
The project includes `public/manifest.webmanifest` and an app icon. Deploy it over HTTPS to install it from Chrome.
