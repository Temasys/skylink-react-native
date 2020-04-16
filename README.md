# Skylink React Native SDK
> Temasys Skylink React Native SDK is a React Native library that enables any React Native app to easily leverage the capabilities of WebRTC and its direct data streaming powers between peers for audio/video conferencing.
>
> If you've built with our SkylinkJS Web SDK before, building with Skylink React Native SDK requires minimal learning as it uses the same apis as the web sdk.

You'll need a Temasys Account and an App key to use this. [Register here to get your App key](https://console.temasys.io).

### Building Skylink-React-Native SDK
- clone [SkylinkJS](https://github.com/Temasys/SkylinkJS) and set up the repo locally
- run `npm link skylinkjs` in project folder (`path/to/react-native-sdk-2.x`) to link `skylinkjs` as a dependency in the project 
- check there is a `skylinkjs` folder in `node_modules`
- run `npm run build`
- in `path/to/react-native-sdk-2.x/sample-app` the `skylink_rn.complete.js` will be replaced or added
- this is the Skylink React Native SDK that is imported in `App.js`
- refer to [sample-app/README.md](/sample-app/README.md) for steps on setting up the Android and iOS sample apps

#### Need help or want something changed?
You can raise tickets on [our support portal](http://support.temasys.io) or on [our Github Page](https://console.temasys.io/support).

#### Read more
- [API Docs](http://cdn.temasys.io/skylink/skylinkjs/latest/doc/classes/Skylink.html)
- [Temasys Console  - Get your App key](https://console.temasys.io)

    
Lateset version: `Skylink-React-Native 2.0.0`
    
Built on: `SkylinkJS 2.1.0`
