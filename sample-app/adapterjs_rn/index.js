/* AdapterJS-React-Native Thu Nov 26 2020 11:40:21 GMT+0800 (Singapore Standard Time) */
import { mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView, MediaStream, MediaStreamTrack } from 'temasys-react-native-webrtc';

// AdapterJS_RN will be bundled with Skylink and replace all AdapterJS references
const AdapterJS_RN = {};

AdapterJS_RN.windowClone = Object.create(global.window);

// SkylinkJS checks for AdapterJS_RN.webRTCReady during init and must return success before it can proceed
// This is not required in React Native so callback is immediately executed
AdapterJS_RN.webRTCReady = (callback) => {
  callback();
};

AdapterJS_RN.window = {
  getUserMedia: mediaDevices.getUserMedia,
  RTCPeerConnection: RTCPeerConnection,
  RTCIceCandidate: RTCIceCandidate,
  RTCSessionDescription: RTCSessionDescription,
  RTCView: RTCView,
  MediaStream: MediaStream,
  MediaStreamTrack: MediaStreamTrack,
  navigator: {
    "getUserMedia": mediaDevices.getUserMedia,
    "enumerateDevices": mediaDevices.enumerateDevices,
    "platform": "React-Native",
    "userAgent": "React-Native",
    "mediaDevices": {
      "getUserMedia": mediaDevices.getUserMedia,
      "getDisplayMedia": mediaDevices.getDisplayMedia,
      "enumerateDevices": mediaDevices.enumerateDevices,
    }
  },
  logLevel: null,
  localStorage: {
    setItem: function (key, logLevel) {
      this.logLevel = logLevel;
    },
    getItem: function (key) {
      return this.logLevel;
    }
  },
  fetch: global.fetch,
  WebSocket: true,
  location: {
    protocol: 'https'
  }
};

AdapterJS_RN.deleteWindowAndLocation = () => {
  delete global["window"];
  delete global["location"];
};

AdapterJS_RN.initOverride = () => {
  AdapterJS_RN.deleteWindowAndLocation();
  global.window = AdapterJS_RN.window;
  global.document = {};
};

AdapterJS_RN.initOverride();

export default AdapterJS_RN;
