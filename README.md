# Deprecation Status

- I am no longer interested in updating this project. The Expo SDK updates far too frequently with no long-term support (they even recommend using development builds for production apps).
- As it stands, this is a non-production app that is fully feature complete.
- Major vulnerabilities should have no effect as this app is just for demonstration purposes.

# Workout App

[![runs with Expo Go](https://img.shields.io/badge/Runs%20with%20Expo%20Go-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/client)

- Simplistic mobile app for core lifts; deadlift, backsquat, and bench press
- Generate a workout by entering your one rep max and number of sets desired
- Complete the workout and the app will store your completed workout.
- Press on a completed workout if you would like to delete it from history.

# Instructions

1. Navigate to [snack.expo.dev](https://snack.expo.dev/)
2. On the left side in the file explorer, press the 3 dots to the right of the new file and new folder buttons.
3. From the dropdown, select "Import git repository"
4. Paste this GitHub link

```
https://github.com/noahcroghan/workout-app
```

5. On the status bar at the bottom right, change the Expo version to v50
6. Ignore warnings on the Snack preview in the right, the app does not support the web as it uses a SQLite implementation that doesn't support the web.
7. Select iOS or Android from the preview top menu.
   - The appeffectively the same on either platform, but style wise it is more consistent with Android
   - You can also attempt to run it on your personal device through [Expo Go](https://expo.dev/go), but note that iOS will never be supported for this due to always requiring the latest SDK version.
8. (if iOS chosen) select "Open" when prompted

Optionally, if you prefer to develop locally, you can instead clone this Git repository, install [Node.js](https://nodejs.org/en), and run the app with `npx expo start`, which supports opening the app in a local [Android virtual machine](https://docs.expo.dev/workflow/android-studio-emulator/), or Expo Go (assuming the above aforementioned restrictions about SDK version)
