import commonJS from 'rollup-plugin-commonjs';
import localResolve from 'rollup-plugin-local-resolve';
import resolve from 'rollup-plugin-node-resolve';
import del from 'rollup-plugin-delete';
import pkg from '../package.json';
import paths from './paths';
import json from '@rollup/plugin-json';
import skylinkPackageJson from '../node_modules/skylinkjs/package.json';

const IMPORT_DECLARATIONS = `
import io from 'socket.io-client';
import  AdapterJS from 'adapterjs_rn';
import CryptoJS from 'crypto-js';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  permissions
} from 'temasys-react-native-webrtc';
const temasysReactNativeWebrtc = {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  permissions
};
const __sdkVersion__ = '${pkg.version}';
`;
const CLONE_DEST_PATH = `${paths.skylinkNodeModules}/clone/clone.js`;
const DIST_PATH = paths.appDist;
const SAMPLE_APP_PATH = paths.sampleApp;


const FORMATS = {
  esm: 'esm',
  iife: 'iife',
  cjs: 'cjs',
};
const BUILD_JS = {
  adapterjsRN: {
    format: FORMATS.esm,
    fileName: 'adapterjs_rn.js',
    minFileName: 'adapterjs_rn.min.js',
    external : ['temasys-react-native-webrtc'],
    banner: `/* AdapterJS-React-Native ${new Date().toString()} */`,
  },
  skylinkRN: {
    format: FORMATS.iife,
    fileName: 'skylink_rn.complete.js',
    minFileName: 'skylink_rn.complete.min.js',
    globals: { 'socket.io-client' : 'io', 'adapterjs_rn': 'AdapterJS_RN', 'skylinkjs': 'Skylink', 'webrtc-adapter': 'AdapterJS', 'temasys-react-native-webrtc': 'temasysReactNativeWebrtc', 'crypto-js': 'CryptoJS' },
    external: ['socket.io-client', 'webrtc-adapter', 'temasys-react-native-webrtc', 'crypto-js'],
    banner: `/* SkylinkJS-React-Native v${pkg.version} @ SkylinkJS v${skylinkPackageJson.version} ${new Date().toString()}*/
    ${IMPORT_DECLARATIONS}`,
  },
};

const ADAPTERJS_RN = {
  input: paths.adapterjsRN,
  output: [
    {
      file: `${DIST_PATH}/adapterjs_rn/${BUILD_JS.adapterjsRN.fileName}`,
      format: BUILD_JS.adapterjsRN.format,
      exports: 'named',
      name: 'AdapterJS_RN',
      banner: BUILD_JS.adapterjsRN.banner,
    }, {
      file: `${DIST_PATH}/adapterjs_rn/${BUILD_JS.adapterjsRN.minFileName}`,
      format: BUILD_JS.adapterjsRN.format,
      exports: 'named',
      banner: BUILD_JS.adapterjsRN.banner,
    }, {
      file: `${SAMPLE_APP_PATH}/adapterjs_rn/index.js`,
      format: BUILD_JS.adapterjsRN.format,
      exports: 'named',
      banner: BUILD_JS.adapterjsRN.banner,
    },
  ],
  onwarn: (warning, warn) => {
    // skip certain warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    // Use default for everything else
    warn(warning);
  },
  plugins: [
    json({ compact: true }),
    localResolve(),
    del({
      targets: [`dist/adapterjs_rn/${BUILD_JS.adapterjsRN.fileName}`, `dist/adapterjs_rn/${BUILD_JS.adapterjsRN.minFileName}`, `dist/skylinkjs_rn/${BUILD_JS.skylinkRN.fileName}`, `dist/skylinkjs_rn/${BUILD_JS.skylinkRN.minFileName}`],
      verbose: true,
    }),
  ],
  external: BUILD_JS.adapterjsRN.external,
};

const SKYLINK_RN = {
  input: paths.skylink_RNIndexJs,
  output: [
    {
      file: `${DIST_PATH}/skylinkjs_rn/${BUILD_JS.skylinkRN.fileName}`,
      format: BUILD_JS.skylinkRN.format,
      exports: 'named',
      globals: BUILD_JS.skylinkRN.globals,
      banner: BUILD_JS.skylinkRN.banner,
    }, {
      file: `${SAMPLE_APP_PATH}/${BUILD_JS.skylinkRN.fileName}`, // place a copy in /sample-app folder as react cannot reference the dist folder which is outside of the project root folder
      format: BUILD_JS.skylinkRN.format,
      exports: 'named',
      globals: BUILD_JS.skylinkRN.globals,
      banner: BUILD_JS.skylinkRN.banner,
    }, {
      file: `${DIST_PATH}/skylinkjs_rn/${BUILD_JS.skylinkRN.minFileName}`,
      format: BUILD_JS.skylinkRN.format,
      exports: 'named',
      globals: BUILD_JS.skylinkRN.globals,
      banner: BUILD_JS.skylinkRN.banner,
    },
  ],
  onwarn: (warning, warn) => {
    // skip certain warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    // Use default for everything else
    warn(warning);
  },
  plugins: [
    json({ compact: true }),
    commonJS({
      namedExports: {
        [CLONE_DEST_PATH]: ['clone'],
      }
    }),
    resolve({
      only: ['skylinkjs', 'clone', 'adapterjs_rn', 'crypto-js'], // bundle AdapterJS_RN
    }),
    localResolve(),
  ],
  external: BUILD_JS.skylinkRN.external,
};

export default [ ADAPTERJS_RN, SKYLINK_RN ];

