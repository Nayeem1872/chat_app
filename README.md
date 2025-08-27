<p align="center">
  <img alt="CometChat" src="https://assets.cometchat.io/website/images/logos/banner.png">
</p>

# React Native Sample App Expo by CometChat

This is a reference application showcasing the integration of [CometChat's React Native UI Kit](https://www.cometchat.com/docs/ui-kit/react-native/5.0/overview) in a React Native Expo project. It demonstrates how to implement real-time messaging and voice/video calling features with ease in your React Native Expo App.

<div style="display: flex; align-items: center; justify-content: center">
   <img src="../../screenshots/overview_cometchat_screens.png" />
</div>


## Prerequisites

Sign up for a [CometChat](https://app.cometchat.com/) account to obtain your app credentials: _`App ID`_, _`Region`_, and _`Auth Key`_

- **Node.js** 18 or higher
- **React Native** Version 0.77 or later (up to the latest version) 

**iOS**
- XCode
- Pod (CocoaPods) for iOS
- An iOS device or emulator with iOS 12.0 or above.
- Ensure that you have configured the provisioning profile in Xcode to run the app on a physical device.

**Android**
- Android Studio
- Android device or emulator with Android version 5.0 or above.


## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/cometchat/cometchat-uikit-react-native.git
   ```

1. Run `npm install` to install the dependencies in the root folder.

1. Change into the specific app's directory (e.g., SampleApp).
   ```sh
     cd examples/SampleAppExpo
   ```

1. `[Optional]` Configure CometChat credentials:
    - Open the `AppConstants.tsx` file located at `examples/SampleAppExpo/src/utils/AppConstants.tsx` and enter your CometChat _`appId`_, _`region`_, and _`authKey`_:
      ```ts
      export const AppConstants = {
          appId: 'YOUR_APP_ID',
          authKey: 'YOUR_AUTH_KEY',
          region: 'REGION',
          //other properties
      }
      ```

1. Generate the native Android and iOS project folders for the Expo app. This step is required for the "custom dev client" and "bare workflow" pipeline:
   ```sh
    npx expo prebuild
   ```

1. Run the app on a connected device or emulator:
   ```sh
    npx expo run:android
    npx expo run:ios
   ```



> **⚠️ Compatibility:**  
> The React Native UI Kit is **not compatible** with Expo Go because it requires custom native modules. Expo Go is not recommended for production-grade apps.  
> **Development Builds:** To use the UI Kit in an Expo app, you must use development builds. Refer to the official Expo guide for more details.

   
## Help and Support

For issues running the project or integrating with our UI Kits, consult our [documentation](https://www.cometchat.com/docs/ui-kit/react-native/5.0/getting-started) or create a [support ticket](https://help.cometchat.com/hc/en-us). You can also access real-time support via the [CometChat Dashboard](http://app.cometchat.com/).