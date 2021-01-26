/* SkylinkJS-React-Native v2.0.0 @ SkylinkJS v2.2.1 Tue Jan 26 2021 17:15:39 GMT+0800 (Singapore Standard Time)*/
    
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
const __sdkVersion__ = '2.0.0';

(function (temasysReactNativeWebrtc, io, AdapterJS, CryptoJS) {
  'use strict';

  io = io && io.hasOwnProperty('default') ? io['default'] : io;
  AdapterJS = AdapterJS && AdapterJS.hasOwnProperty('default') ? AdapterJS['default'] : AdapterJS;
  CryptoJS = CryptoJS && CryptoJS.hasOwnProperty('default') ? CryptoJS['default'] : CryptoJS;

  /* AdapterJS-React-Native Tue Jan 26 2021 17:15:39 GMT+0800 (Singapore Standard Time) */

  // AdapterJS_RN will be bundled with Skylink and replace all AdapterJS references
  const AdapterJS_RN = {};

  AdapterJS_RN.windowClone = Object.create(global.window);

  // SkylinkJS checks for AdapterJS_RN.webRTCReady during init and must return success before it can proceed
  // This is not required in React Native so callback is immediately executed
  AdapterJS_RN.webRTCReady = (callback) => {
    callback();
  };

  AdapterJS_RN.window = {
    getUserMedia: temasysReactNativeWebrtc.mediaDevices.getUserMedia,
    RTCPeerConnection: temasysReactNativeWebrtc.RTCPeerConnection,
    RTCIceCandidate: temasysReactNativeWebrtc.RTCIceCandidate,
    RTCSessionDescription: temasysReactNativeWebrtc.RTCSessionDescription,
    RTCView: temasysReactNativeWebrtc.RTCView,
    MediaStream: temasysReactNativeWebrtc.MediaStream,
    MediaStreamTrack: temasysReactNativeWebrtc.MediaStreamTrack,
    navigator: {
      "getUserMedia": temasysReactNativeWebrtc.mediaDevices.getUserMedia,
      "enumerateDevices": temasysReactNativeWebrtc.mediaDevices.enumerateDevices,
      "platform": "React-Native",
      "userAgent": "React-Native",
      "mediaDevices": {
        "getUserMedia": temasysReactNativeWebrtc.mediaDevices.getUserMedia,
        "getDisplayMedia": temasysReactNativeWebrtc.mediaDevices.getDisplayMedia,
        "enumerateDevices": temasysReactNativeWebrtc.mediaDevices.enumerateDevices,
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

  /* eslint-disable */

  AdapterJS.options = AdapterJS.options || {};

  // True is AdapterJS.onwebrtcready was already called, false otherwise
  // Used to make sure AdapterJS.onwebrtcready is only called once
  AdapterJS.onwebrtcreadyDone = false;

  AdapterJS.WebRTCPlugin = {
    plugin: null,
  };

  AdapterJS._onwebrtcreadies = [];

  AdapterJS.webRTCReady = function (baseCallback) {
    if (typeof baseCallback !== 'function') {
      throw new Error('Callback provided is not a function');
    }

    var callback = function () {
      // Make users having requirejs to use the webRTCReady function to define first
      // When you set a setTimeout(definePolyfill, 0), it overrides the WebRTC function
      // This is be more than 0s
      if (typeof window.require === 'function' &&
        typeof AdapterJS._defineMediaSourcePolyfill === 'function') {
        AdapterJS._defineMediaSourcePolyfill();
      }

      // All WebRTC interfaces are ready, just call the callback
      baseCallback(null !== AdapterJS.WebRTCPlugin.plugin);
    };


    if (true === AdapterJS.onwebrtcreadyDone) {
      callback();
    } else {
      // will be triggered automatically when your browser/plugin is ready.
      AdapterJS._onwebrtcreadies.push(callback);
    }
  };

  AdapterJS.maybeThroughWebRTCReady = function() {
    if (!AdapterJS.onwebrtcreadyDone) {
      AdapterJS.onwebrtcreadyDone = true;

      // If new interface for multiple callbacks used
      if (AdapterJS._onwebrtcreadies.length) {
        AdapterJS._onwebrtcreadies.forEach(function (callback) {
          if (typeof(callback) === 'function') {
            callback(AdapterJS.WebRTCPlugin.plugin !== null);
          }
        });
        // Else if no callbacks on new interface assuming user used old(deprecated) way to set callback through AdapterJS.onwebrtcready = ...
      } else if (typeof(AdapterJS.onwebrtcready) === 'function') {
        AdapterJS.onwebrtcready(AdapterJS.WebRTCPlugin.plugin !== null);
      }
    }
  };

  ///////////////////////////////////////////////////////////////////
  // ADAPTERJS BROWSER AND VERSION DETECTION
  //
  // Detected browser agent name. Types are:
  // - 'firefox': Firefox browser.
  // - 'chrome': Chrome browser.
  // - 'opera': Opera browser.
  // - 'safari': Safari browser.
  // - 'IE' - Internet Explorer browser.
  window.webrtcDetectedBrowser = null;

  // Detected browser version.
  window.webrtcDetectedVersion = null;

  // The minimum browser version still supported by AJS.
  window.webrtcMinimumVersion  = null;

  // The type of DC supported by the browser
  window.webrtcDetectedDCSupport = null;

  // This function helps to retrieve the webrtc detected browser information.
  // This sets:
  // - webrtcDetectedBrowser: The browser agent name.
  // - webrtcDetectedVersion: The browser version.
  // - webrtcMinimumVersion: The minimum browser version still supported by AJS.
  // - webrtcDetectedType: The types of webRTC support.
  //   - 'moz': Mozilla implementation of webRTC.
  //   - 'webkit': WebKit implementation of webRTC.
  //   - 'plugin': Using the plugin implementation.
  AdapterJS.parseWebrtcDetectedBrowser = function () {
    var hasMatch = null;

    // Detect React-Native
    // Placed before browsers to check - global navigator object is present when react-native debugger is on and takes browser agent of the debugger
    // React Native adapter adds navigator object
    if (window.navigator.userAgent.match(/React-Native/gi) || navigator.userAgent.match(/React-Native/gi)) {
      window.webrtcDetectedBrowser   = 'react-native';
      window.webrtcDetectedVersion   = "";
      window.webrtcMinimumVersion    = 0;
      window.webrtcDetectedType      = 'react-native';
      window.webrtcDetectedDCSupport = null;
      // Detect Opera (8.0+)
    } else if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
      hasMatch = navigator.userAgent.match(/OPR\/(\d+)/i) || [];

      window.webrtcDetectedBrowser   = 'opera';
      window.webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
      window.webrtcMinimumVersion    = 26;
      window.webrtcDetectedType      = 'webkit';
      window.webrtcDetectedDCSupport = 'SCTP'; // Opera 20+ uses Chrome 33

      // Detect Bowser on iOS
    } else if (navigator.userAgent.match(/Bowser\/[0-9.]*/g)) {
      hasMatch = navigator.userAgent.match(/Bowser\/[0-9.]*/g) || [];

      var chromiumVersion = parseInt((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [])[2] || '0', 10);

      window.webrtcDetectedBrowser   = 'bowser';
      window.webrtcDetectedVersion   = parseFloat((hasMatch[0] || '0/0').split('/')[1], 10);
      window.webrtcMinimumVersion    = 0;
      window.webrtcDetectedType      = 'webkit';
      window.webrtcDetectedDCSupport = chromiumVersion > 30 ? 'SCTP' : 'RTP';


      // Detect Opera on iOS (does not support WebRTC yet)
    } else if (navigator.userAgent.indexOf('OPiOS') > 0) {
      hasMatch = navigator.userAgent.match(/OPiOS\/([0-9]+)\./);

      // Browser which do not support webrtc yet
      window.webrtcDetectedBrowser   = 'opera';
      window.webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
      window.webrtcMinimumVersion    = 0;
      window.webrtcDetectedType      = null;
      window.webrtcDetectedDCSupport = null;

      // Detect Chrome on iOS (does not support WebRTC yet)
    } else if (navigator.userAgent.indexOf('CriOS') > 0) {
      hasMatch = navigator.userAgent.match(/CriOS\/([0-9]+)\./) || [];

      window.webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
      window.webrtcMinimumVersion    = 0;
      window.webrtcDetectedType      = null;
      window.webrtcDetectedBrowser   = 'chrome';
      window.webrtcDetectedDCSupport = null;

      // Detect Firefox on iOS (does not support WebRTC yet)
    } else if (navigator.userAgent.indexOf('FxiOS') > 0) {
      hasMatch = navigator.userAgent.match(/FxiOS\/([0-9]+)\./) || [];

      // Browser which do not support webrtc yet
      window.webrtcDetectedBrowser   = 'firefox';
      window.webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
      window.webrtcMinimumVersion    = 0;
      window.webrtcDetectedType      = null;
      window.webrtcDetectedDCSupport = null;

      // Detect IE (6-11)
    } else if (/*@cc_on!@*/ !!document.documentMode) {
      hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];

      window.webrtcDetectedBrowser   = 'IE';
      window.webrtcDetectedVersion   = parseInt(hasMatch[1], 10);
      window.webrtcMinimumVersion    = 9;
      window.webrtcDetectedType      = 'plugin';
      window.webrtcDetectedDCSupport = 'SCTP';

      if (!webrtcDetectedVersion) {
        hasMatch = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || [];

        window.webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10);
      }

      // Detect Edge (20+)
    } else if (!!window.StyleMedia || navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
      hasMatch = navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) || [];

      // Previous webrtc/adapter uses minimum version as 10547 but checking in the Edge release history,
      // It's close to 13.10547 and ObjectRTC API is fully supported in that version

      window.webrtcDetectedBrowser   = 'edge';
      window.webrtcDetectedVersion   = parseFloat((hasMatch[0] || '0/0').split('/')[1], 10);
      window.webrtcMinimumVersion    = 13.10547;
      window.webrtcDetectedType      = 'ms';
      window.webrtcDetectedDCSupport = null;

      // Detect Firefox (1.0+)
      // Placed before Safari check to ensure Firefox on Android is detected
    } else if (typeof InstallTrigger !== 'undefined' || navigator.userAgent.indexOf('irefox') > 0) {
      hasMatch = navigator.userAgent.match(/Firefox\/([0-9]+)\./) || [];

      window.webrtcDetectedBrowser   = 'firefox';
      window.webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
      window.webrtcMinimumVersion    = 33;
      window.webrtcDetectedType      = 'moz';
      window.webrtcDetectedDCSupport = 'SCTP';

      // Detect Chrome (1+ and mobile)
      // Placed before Safari check to ensure Chrome on Android is detected
    } else if ((!!window.chrome && !!window.chrome.webstore) || navigator.userAgent.indexOf('Chrom') > 0) {
      hasMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [];

      window.webrtcDetectedBrowser   = 'chrome';
      window.webrtcDetectedVersion   = parseInt(hasMatch[2] || '0', 10);
      window.webrtcMinimumVersion    = 38;
      window.webrtcDetectedType      = 'webkit';
      window.webrtcDetectedDCSupport = window.webrtcDetectedVersion > 30 ? 'SCTP' : 'RTP'; // Chrome 31+ supports SCTP without flags

      // Detect Safari
    } else if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification) || navigator.userAgent.match(/AppleWebKit\/(\d+)\./) || navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
      hasMatch = navigator.userAgent.match(/version\/(\d+)\.(\d+)/i) || [];
      var AppleWebKitBuild = navigator.userAgent.match(/AppleWebKit\/(\d+)/i) || [];

      var isMobile      = navigator.userAgent.match(/(iPhone|iPad)/gi);
      var hasNativeImpl = AppleWebKitBuild.length >= 1 && AppleWebKitBuild[1] >= 604;
      window.webrtcDetectedBrowser   = 'safari';
      window.webrtcDetectedVersion   = parseInt(hasMatch[1] || '0', 10);
      window.webrtcMinimumVersion    = 7;
      if (isMobile) {
        window.webrtcDetectedType    = hasNativeImpl ? 'AppleWebKit' : null;
      } else { // desktop
        var majorVersion = window.webrtcDetectedVersion;
        var minorVersion = parseInt(hasMatch[2] || '0', 10);
        var nativeImplIsOverridable = majorVersion == 11 && minorVersion < 2;
        window.webrtcDetectedType    = hasNativeImpl && !(AdapterJS.options.forceSafariPlugin && nativeImplIsOverridable) ? 'AppleWebKit' : 'plugin';
      }
      window.webrtcDetectedDCSupport = 'SCTP';
    }

    // Scope it to AdapterJS and window for better consistency
    AdapterJS.webrtcDetectedBrowser   = window.webrtcDetectedBrowser;
    AdapterJS.webrtcDetectedVersion   = window.webrtcDetectedVersion;
    AdapterJS.webrtcMinimumVersion    = window.webrtcMinimumVersion;
    AdapterJS.webrtcDetectedType      = window.webrtcDetectedType;
    AdapterJS.webrtcDetectedDCSupport = window.webrtcDetectedDCSupport;
  };

  // END OF ADAPTERJS BROWSER AND VERSION DETECTION
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  // EXTENSION FOR CHROME, FIREFOX AND EDGE
  // Includes additional shims
  // -- attachMediaStream
  // -- reattachMediaStream
  // -- a call to AdapterJS.maybeThroughWebRTCReady (notifies WebRTC is ready)
  AdapterJS.addExtensions = function() {
    var attachMediaStream = null;
    var reattachMediaStream = null;
  // Add support for legacy functions
    if ( navigator.mozGetUserMedia ) {
      // Attach a media stream to an element.
      attachMediaStream = function(element, stream) {
        element.srcObject = stream;
        return element;
      };

      reattachMediaStream = function(to, from) {
        to.srcObject = from.srcObject;
        return to;
      };
    } else if ( navigator.webkitGetUserMedia ) {
      // Attach a media stream to an element.
      attachMediaStream = function(element, stream) {
        if (AdapterJS.webrtcDetectedVersion >= 43) {
          element.srcObject = stream;
        } else if (typeof element.src !== 'undefined') {
          element.src = URL.createObjectURL(stream);
        } else {
          console.error('Error attaching stream to element.');
          // logging('Error attaching stream to element.');
        }
        return element;
      };

      reattachMediaStream = function(to, from) {
        if (AdapterJS.webrtcDetectedVersion >= 43) {
          to.srcObject = from.srcObject;
        } else {
          to.src = from.src;
        }
        return to;
      };

    } else if (AdapterJS.webrtcDetectedType === 'AppleWebKit') {
      attachMediaStream = function(element, stream) {
        element.srcObject = stream;
        return element;
      };
      reattachMediaStream = function(to, from) {
        to.srcObject = from.srcObject;
        return to;
      };
    }

  // Propagate attachMediaStream and gUM in window and AdapterJS
    window.attachMediaStream      = attachMediaStream;
    window.reattachMediaStream    = reattachMediaStream;
    AdapterJS.attachMediaStream   = attachMediaStream;
    AdapterJS.reattachMediaStream = reattachMediaStream;
  };

  // END OF EXTENSION OF CHROME, FIREFOX AND EDGE
  ///////////////////////////////////////////////////////////////////

  // Init browser detection
  AdapterJS.parseWebrtcDetectedBrowser();
  // Add extensions
  AdapterJS.addExtensions();
  // Signal AdapterJS loaded
  AdapterJS.maybeThroughWebRTCReady();

  const ON_INCOMING_STREAM = 'onIncomingStream';
  const ON_INCOMING_SCREEN_STREAM = 'onIncomingScreenStream';
  const STREAM_ENDED = 'streamEnded';
  const PEER_UPDATED = 'peerUpdated';
  const PEER_JOINED = 'peerJoined';
  const PEER_LEFT = 'peerLeft';
  const PEER_CONNECTION_STATE = 'peerConnectionState';
  const DATA_CHANNEL_STATE = 'dataChannelState';
  const ON_INCOMING_MESSAGE = 'onIncomingMessage';
  const HANDSHAKE_PROGRESS = 'handshakeProgress';
  const SERVER_PEER_JOINED = 'serverPeerJoined';
  const SERVER_PEER_LEFT = 'serverPeerLeft';
  const CANDIDATE_PROCESSING_STATE = 'candidateProcessingState';
  const CANDIDATE_GENERATION_STATE = 'candidateGenerationState';
  const CANDIDATES_GATHERED = 'candidatesGathered';
  const DATA_STREAM_STATE = 'dataStreamState';
  const DATA_TRANSFER_STATE = 'dataTransferState';
  const ON_INCOMING_DATA = 'onIncomingData';
  const ON_INCOMING_DATA_REQUEST = 'onIncomingDataRequest';
  const ON_INCOMING_DATA_STREAM = 'onIncomingDataStream';
  const ON_INCOMING_DATA_STREAM_STARTED = 'onIncomingDataStreamStarted';
  const ON_INCOMING_DATA_STREAM_STOPPED = 'onIncomingDataStreamStopped';
  const GET_PEERS_STATE_CHANGE = 'getPeersStateChange';
  const SESSION_DISCONNECT = 'sessionDisconnect';
  const STREAM_MUTED = 'streamMuted';
  const CHANNEL_OPEN = 'channelOpen';
  const CHANNEL_REOPEN = 'channelReopen';
  const CHANNEL_CLOSE = 'channelClose';
  const CHANNEL_MESSAGE = 'channelMessage';
  const CHANNEL_ERROR = 'channelError';
  const CHANNEL_RETRY = 'channelRetry';
  const SOCKET_ERROR = 'socketError';
  const SYSTEM_ACTION = 'systemAction';
  const MEDIA_ACCESS_FALLBACK = 'mediaAccessFallback';
  const MEDIA_ACCESS_REQUIRED = 'mediaAccessRequired';
  const MEDIA_ACCESS_STOPPED = 'mediaAccessStopped';
  const MEDIA_ACCESS_SUCCESS = 'mediaAccessSuccess';
  const RECORDING_STATE = 'recordingState';
  const LOCAL_MEDIA_MUTED = 'localMediaMuted';
  const MEDIA_ACCESS_ERROR = 'mediaAccessError';
  const GET_CONNECTION_STATUS_STATE_CHANGE = 'getConnectionStatusStateChange';
  const READY_STATE_CHANGE = 'readyStateChange';
  const ROOM_LOCK = 'roomLock';
  const INTRODUCE_STATE_CHANGE = 'introduceStateChange';
  const ICE_CONNECTION_STATE = 'iceConnectionState';
  const BYE = 'bye';
  const RTMP_STATE = 'rtmpState';
  const LOGGED_ON_CONSOLE = 'loggedOnConsole';
  const MEDIA_INFO_DELETED = 'mediaInfoDeleted';
  const STORED_MESSAGES = 'storedMessages';
  const ENCRYPT_SECRETS_UPDATED = 'encryptSecretsUpdated';
  const PERSISTENT_MESSAGE_STATE = 'persistentMessageState';
  const ROOM_REJOIN = 'roomRejoin';

  var SkylinkEventsConstants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ON_INCOMING_STREAM: ON_INCOMING_STREAM,
    ON_INCOMING_SCREEN_STREAM: ON_INCOMING_SCREEN_STREAM,
    STREAM_ENDED: STREAM_ENDED,
    PEER_UPDATED: PEER_UPDATED,
    PEER_JOINED: PEER_JOINED,
    PEER_LEFT: PEER_LEFT,
    PEER_CONNECTION_STATE: PEER_CONNECTION_STATE,
    DATA_CHANNEL_STATE: DATA_CHANNEL_STATE,
    ON_INCOMING_MESSAGE: ON_INCOMING_MESSAGE,
    HANDSHAKE_PROGRESS: HANDSHAKE_PROGRESS,
    SERVER_PEER_JOINED: SERVER_PEER_JOINED,
    SERVER_PEER_LEFT: SERVER_PEER_LEFT,
    CANDIDATE_PROCESSING_STATE: CANDIDATE_PROCESSING_STATE,
    CANDIDATE_GENERATION_STATE: CANDIDATE_GENERATION_STATE,
    CANDIDATES_GATHERED: CANDIDATES_GATHERED,
    DATA_STREAM_STATE: DATA_STREAM_STATE,
    DATA_TRANSFER_STATE: DATA_TRANSFER_STATE,
    ON_INCOMING_DATA: ON_INCOMING_DATA,
    ON_INCOMING_DATA_REQUEST: ON_INCOMING_DATA_REQUEST,
    ON_INCOMING_DATA_STREAM: ON_INCOMING_DATA_STREAM,
    ON_INCOMING_DATA_STREAM_STARTED: ON_INCOMING_DATA_STREAM_STARTED,
    ON_INCOMING_DATA_STREAM_STOPPED: ON_INCOMING_DATA_STREAM_STOPPED,
    GET_PEERS_STATE_CHANGE: GET_PEERS_STATE_CHANGE,
    SESSION_DISCONNECT: SESSION_DISCONNECT,
    STREAM_MUTED: STREAM_MUTED,
    CHANNEL_OPEN: CHANNEL_OPEN,
    CHANNEL_REOPEN: CHANNEL_REOPEN,
    CHANNEL_CLOSE: CHANNEL_CLOSE,
    CHANNEL_MESSAGE: CHANNEL_MESSAGE,
    CHANNEL_ERROR: CHANNEL_ERROR,
    CHANNEL_RETRY: CHANNEL_RETRY,
    SOCKET_ERROR: SOCKET_ERROR,
    SYSTEM_ACTION: SYSTEM_ACTION,
    MEDIA_ACCESS_FALLBACK: MEDIA_ACCESS_FALLBACK,
    MEDIA_ACCESS_REQUIRED: MEDIA_ACCESS_REQUIRED,
    MEDIA_ACCESS_STOPPED: MEDIA_ACCESS_STOPPED,
    MEDIA_ACCESS_SUCCESS: MEDIA_ACCESS_SUCCESS,
    RECORDING_STATE: RECORDING_STATE,
    LOCAL_MEDIA_MUTED: LOCAL_MEDIA_MUTED,
    MEDIA_ACCESS_ERROR: MEDIA_ACCESS_ERROR,
    GET_CONNECTION_STATUS_STATE_CHANGE: GET_CONNECTION_STATUS_STATE_CHANGE,
    READY_STATE_CHANGE: READY_STATE_CHANGE,
    ROOM_LOCK: ROOM_LOCK,
    INTRODUCE_STATE_CHANGE: INTRODUCE_STATE_CHANGE,
    ICE_CONNECTION_STATE: ICE_CONNECTION_STATE,
    BYE: BYE,
    RTMP_STATE: RTMP_STATE,
    LOGGED_ON_CONSOLE: LOGGED_ON_CONSOLE,
    MEDIA_INFO_DELETED: MEDIA_INFO_DELETED,
    STORED_MESSAGES: STORED_MESSAGES,
    ENCRYPT_SECRETS_UPDATED: ENCRYPT_SECRETS_UPDATED,
    PERSISTENT_MESSAGE_STATE: PERSISTENT_MESSAGE_STATE,
    ROOM_REJOIN: ROOM_REJOIN
  });

  class SkylinkEvent {
    constructor(name, detail) {
      this.name = name;
      this.detail = detail;
    }
  }

  /**
   * @event SkylinkEvents.ON_INCOMING_STREAM
   * @description Event triggered when receiving Peer Stream.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {MediaStream} detail.stream - The Stream object. To attach it to an element: <code>attachMediaStream(videoElement, stream);</code>.
   * @param {String} detail.streamId - The stream id.
   * @param {boolean} detail.isSelf -The flag if Peer is User.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   * @param {boolean} detail.isVideo - The flag if the incoming stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the incoming stream has an audio track.
   * */
  const onIncomingStream = (detail = {}) => new SkylinkEvent(ON_INCOMING_STREAM, { detail });

  /**
   * @event SkylinkEvents.ON_INCOMING_SCREEN_STREAM
   * @description Event triggered when receiving Peer Screenshare Stream.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room.
   * @param {String} detail.peerId - The peer's id.
   * @param {MediaStream} detail.stream - The Stream object.
   * @param {String} detail.streamId - The Stream id.
   * @param {Boolean} detail.isSelf - The flag if Peer is User.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   * @param {boolean} detail.isVideo - The flag if the incoming screen stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the incoming screen stream has an audio track.
   * */
  const onIncomingScreenStream = (detail = {}) => new SkylinkEvent(ON_INCOMING_SCREEN_STREAM, { detail });

  /**
   * @event SkylinkEvents.STREAM_ENDED
   * @description Event triggered when a Peer Stream streaming has stopped. Note that it may not be the currently sent Stream to User, and it also triggers when User leaves the Room for any currently sent Stream to User from Peer.
   * @param {Object} detail - Event's payload.
   * @param {String} detail.peerId - The Peer ID.
   * @param {roomInfo} detail.room - The room.
   * @param {peerInfo} detail.peerInfo - The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received
   * in the <code> {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED}</code> event.
   * @param {Boolean} detail.isSelf The flag if Peer is User.
   * @param {Boolean} detail.isScreensharing The flag if Peer Stream is a screensharing Stream.
   * @param {String} detail.streamId The Stream ID.
   * @param {boolean} detail.isVideo - The flag if the ended stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the ended stream has an audio track.
   * */
  const streamEnded = (detail = {}) => new SkylinkEvent(STREAM_ENDED, { detail });

  /**
   * @event SkylinkEvents.STREAM_MUTED
   * @description Event triggered when Peer Stream audio or video tracks has been muted / unmuted.
   * @param {Object} detail - Event's payload.
   * @param {String} detail.peerId -  The Peer ID.
   * @param {peerInfo} detail.peerInfo The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code> {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED}</code> event.
   * @param {Boolean} detail.isSelf The flag if Peer is User.
   * @param {boolean} detail.isVideo - The flag if the muted stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the muted stream has an audio track.
   * @param {boolean} detail.isScreensharing - The flag if the muted stream is a screensharing stream.
   * */
  const streamMuted = (detail = {}) => new SkylinkEvent(STREAM_MUTED, { detail });

  /**
   * @event SkylinkEvents.DATA_CHANNEL_STATE
   * @description Event triggered when a Datachannel connection state has changed.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {SkylinkConstants.DATA_CHANNEL_STATE} detail.state - The current Datachannel connection state.
   * @param {Error} detail.error - The error object. Defined only when <code>state</code> payload is <code>ERROR</code> or <code>SEND_MESSAGE_ERROR</code>.
   * @param {String} detail.channelName - The Datachannel ID.
   * @param {SkylinkConstants.DATA_CHANNEL_TYPE} detail.channelType - The Datachannel type.
   * @param {SkylinkConstants.DATA_CHANNEL_MESSAGE_ERROR} detail.messageType - The Datachannel sending Datachannel message error type.
   *   Defined only when <cod>state</code> payload is <code>SEND_MESSAGE_ERROR</code>.
   * @param {Object} detail.bufferAmount The Datachannel - buffered amount information.
   * @param {number} detail.bufferAmount.bufferedAmount - The size of currently queued data to send on the Datachannel connection.
   * @param {number} detail.bufferAmount.bufferedAmountLowThreshold - Threshold The current buffered amount low threshold configured.
   */
  const onDataChannelStateChanged = (detail = {}) => new SkylinkEvent(DATA_CHANNEL_STATE, { detail });

  /**
   * @event SkylinkEvents.ON_INCOMING_MESSAGE
   * @description Event triggered when receiving message from Peer.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {JSON} detail.message - The message result.
   * @param {JSON|string} detail.message.content - The message.
   * @param {String} detail.message.senderPeerId - The sender Peer ID.
   * @param {String|Array} [detail.message.targetPeerId] The value of the <code>targetPeerId</code>
   *   defined in {@link Skylink#sendP2PMessage} or {@link Skylink#sendMessage|sendMessage}.
   *   Defined as User's Peer ID when <code>isSelf</code> payload value is <code>false</code>.
   *   Defined as <code>null</code> when provided <code>targetPeerId</code> in {@link Skylink#sendP2PMessage|sendP2PMessage} or
   *   {@link Skylink#sendMessage|sendMessage} is not defined.
   * @param {Array} [detail.message.listOfPeers] The list of Peers that the message has been sent to.
   *  Defined only when <code>isSelf</code> payload value is <code>true</code>.
   * @param {boolean} detail.message.isPrivate The flag if message is targeted or not, basing
   *   off the <code>targetPeerId</code> parameter being defined in
   *   {@link Skylink#sendP2PMessage|sendP2PMessage} or
   *   {@link Skylink#sendMessage|sendMessage}.
   * @param {boolean} detail.message.isDataChannel The flag if message is sent from
   *   {@link Skylink#sendP2PMessage|sendP2PMessage}.
   * @param {String} detail.message.timeStamp The time stamp when the message was sent.
   * @param {String} detail.peerId The Peer ID.
   * @param {peerInfo} detail.peerInfo The Peer session information.
   *   Object signature matches the <code>peerInfo</code> parameter payload received in the
   *   {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED} event.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   */
  const onIncomingMessage = (detail = {}) => new SkylinkEvent(ON_INCOMING_MESSAGE, { detail });

  /**
   * @event SkylinkEvents.STORED_MESSAGES
   * @description Event triggered when receiving stored messages from the Signaling Server.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {Array} detail.storedMessages - The stored messages result.
   * @param {String} detail.storedMessages[].targetPeerId - The value of the <code>targetPeerId</code>
   *   defined in {@link Skylink#sendP2PMessage|sendP2PMessage} or {@link Skylink#sendMessage|sendMessage}.
   *   Defined as User's Peer ID when <code>isSelf</code> payload value is <code>false</code>.
   *   Defined as <code>null</code> when provided <code>targetPeerId</code> in {@link Skylink#sendP2PMessage|sendP2PMessage} or
   *   {@link Skylink#sendMessage|sendMessage} is not defined.
   * @param {JSON|String} detail.storedMessages[].senderPeerId - The sender Peer ID.
   * @param {JSON|String} detail.storedMessages[].content - The message.
   * @param {JSON|String} detail.storedMessages[].timeStamp - The timestamp when the message was sent, in simplified extended ISO format.
   * @param {boolean} detail.storedMessages.isPrivate - The flag if message is targeted or not, basing
   *   off the <code>targetPeerId</code> parameter being defined in {@link Skylink#sendP2PMessage|sendP2PMessage} or {@link Skylink#sendMessage|sendMessage}. Value will always
   *   be false for stored messages.
   * @param {boolean} detail.storedMessages.isDataChannel - The flag if message is sent from {@link Skylink#sendP2PMessage|sendP2PMessage}. Value will always be
   * true for stored messages.
   * @param {String} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   *   Object signature matches the <code>peerInfo</code> parameter payload received in the
   *   {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED} event.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   */
  const storedMessages = (detail = {}) => new SkylinkEvent(STORED_MESSAGES, { detail });

  /**
   * @event SkylinkEvents.ENCRYPT_SECRETS_UPDATED
   * @description Event triggered when encrypt secret data is updated.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {Object} detail.encryptSecrets - The secretId and secret pair.
   * @param {String} detail.selectedSecretId - The id of the secret that is used for encryption and decryption of messages. If value is an
   * empty string, message will not be encrypted.
   * @param {String} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   *   Object signature matches the <code>peerInfo</code> parameter payload received in the
   *   {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED} event.
   */
  const encryptionSecretsUpdated = (detail = {}) => new SkylinkEvent(ENCRYPT_SECRETS_UPDATED, { detail });

  /**
   * @event SkylinkEvents.PERSISTENT_MESSAGE_STATE
   * @description Event triggered when persistent message state changes.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {Object} detail.isPersistent - The flag if messages should be persistent.
   * @param {String} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   *   Object signature matches the <code>peerInfo</code> parameter payload received in the
   *   {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED} event.
   */
  const persistentMessageState = (detail = {}) => new SkylinkEvent(PERSISTENT_MESSAGE_STATE, { detail });

  /**
   * @description Event triggered when a Peer connection establishment state has changed.
   * @event SkylinkEvents.HANDSHAKE_PROGRESS
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.HANDSHAKE_PROGRESS} detail.state The current Peer connection establishment state.
   * @param {String} detail.peerId The Peer ID.
   * @param {roomInfo} detail.room The room.
   * @param {Error|String} [detail.error] The error object.
   *   Defined only when <code>state</code> is <code>ERROR</code>.
   */
  const handshakeProgress = (detail = {}) => new SkylinkEvent(HANDSHAKE_PROGRESS, { detail });

  /**
   * @description Event triggered when {@link Skylink#introducePeer}
   * introduction request state changes.
   * @event SkylinkEvents.INTRODUCE_STATE_CHANGE
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.INTRODUCE_STATE} detail.state The current <code>introducePeer()</code> introduction request state.
   * @param {String} detail.privilegedPeerId The User's privileged Peer ID.
   * @param {String} detail.sendingPeerId The Peer ID to be connected with <code>receivingPeerId</code>.
   * @param {String} detail.receivingPeerId The Peer ID to be connected with <code>sendingPeerId</code>.
   * @param {String} [detail.reason] The error object.
   *   Defined only when <code>state</code> payload is <code>ERROR</code>.
   * @ignore
   */
  const introduceStateChange = (detail = {}) => new SkylinkEvent(INTRODUCE_STATE_CHANGE, { detail });

  /* eslint-disable import/prefer-default-export */

  /**
   * @event SkylinkEvents.READY_STATE_CHANGE
   * @description Event triggered when <code>init()</code> method ready state changes.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.READY_STATE_CHANGE} detail.readyState - The current ready state when instantiating <code>new Skylink()</code>.
   * @param {JSON} detail.error - The error result. Defined only when <code>state</code> is <code>ERROR</code>.
   * @param {Number} detail.error.status - The HTTP status code when failed.
   * @param {SkylinkConstants.READY_STATE_CHANGE_ERROR} detail.error.errorCode - The ready state change failure code.
   * @param {Error} detail.error.content - The error object.
   * @param {String} detail.room - The Room to The Room to retrieve session token for.
   */
  const readyStateChange = (detail = {}) => new SkylinkEvent(READY_STATE_CHANGE, { detail });

  /**
   * @event SkylinkEvents.CANDIDATE_PROCESSING_STATE
   * @description Event triggered when remote ICE candidate processing state has changed when Peer is using trickle ICE.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {SkylinkConstants.CANDIDATE_PROCESSING_STATE} detail.state - The ICE candidate processing state.
   * @param {String} detail.candidateId - The remote ICE candidate session ID.
   * @param {String} detail.candidateType - The remote ICE candidate type.
   * @param {Object} detail.candidate - The remote ICE candidate.
   * @param {String} detail.candidate.candidate - The remote ICE candidate connection description.
   * @param {String} detail.candidate.sdpMid- The remote ICE candidate identifier based on the remote session description.
   * @param {number} detail.candidate.sdpMLineIndex - The remote ICE candidate media description index (starting from 0) based on the remote session description.
   * @param {Error} detail.error - The error object.
   */
  const candidateProcessingState = detail => new SkylinkEvent(CANDIDATE_PROCESSING_STATE, { detail });

  /**
   * @event SkylinkEvents.CANDIDATE_GENERATION_STATE
   * @description Event triggered when a Peer connection ICE gathering state has changed.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {SkylinkConstants.CANDIDATE_GENERATION_STATE} detail.state - The current Peer connection ICE gathering state.
   */
  const candidateGenerationState = detail => new SkylinkEvent(CANDIDATE_GENERATION_STATE, { detail });

  /**
   * @event SkylinkEvents.CANDIDATES_GATHERED
   * @description Event triggered when all remote ICE candidates gathering has completed and been processed.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {Object} detail.candidatesLength - The remote ICE candidates length.
   * @param {number} detail.candidatesLength.expected - The expected total number of remote ICE candidates to be received.
   * @param {number} detail.candidatesLength.received - The actual total number of remote ICE candidates received.
   * @param {number} detail.candidatesLength.processed - The total number of remote ICE candidates processed.
   */
  const candidatesGathered = detail => new SkylinkEvent(CANDIDATES_GATHERED, { detail });

  /**
   * @event SkylinkEvents.ICE_CONNECTION_STATE
   * @description Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * Event triggered when a Peer connection ICE connection state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.ICE_CONNECTION_STATE} detail.state - The current Peer connection ICE connection state.
   * @param {String} detail.state - The Peer ID.
   */
  const iceConnectionState = detail => new SkylinkEvent(ICE_CONNECTION_STATE, { detail });

  /**
   * @event SkylinkEvents.ROOM_LOCK
   * @description Event triggered when Room locked status has changed.
   * @param {Object} detail - Event's payload
   * @param {Boolean} detail.isLocked The flag if Room is locked.
   * @param {String} detail.peerId The Peer ID.
   * @param {peerInfo} detail.peerInfo The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code> {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED}</code> event.
   * @param {Boolean} detail.isSelf The flag if User changed the Room locked status.
   * @param {roomInfo} detail.room The room.
   *
   */
  const roomLock = (detail = {}) => new SkylinkEvent(ROOM_LOCK, { detail });

  /**
   * @event SkylinkEvents.PEER_UPDATED
   * @description Event triggered when a Peer session information has been updated.
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {boolean} detail.isSelf -The flag if Peer is User.
   * @param {peerInfo} detail.peerInfo - The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code> {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED}</code> event.
   */
  const peerUpdated = (detail = {}) => new SkylinkEvent(PEER_UPDATED, { detail });

  /**
   * @event SkylinkEvents.PEER_JOINED
   * @description Event triggered when a Peer joins the room.
   * <blockquote><code>PEER_JOINED</code> event with <code>isSelf=true</code> indicates that the local peer has successfully joined the
   * room. All call actions should be done after the <code>PEER_JOINED</code> event is registered.
   * If <code>MCU</code> feature is enabled on the appKey, {@link SkylinkEvents.event:SERVER_PEER_JOINED|SERVER PEER JOINED} is the
   * corresponding event.
   * </blockquote>
   * @param {Object} detail - Event's payload
   * @param {roomInfo} detail.room - The current room.
   * @param {String} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   */
  const peerJoined = (detail = {}) => new SkylinkEvent(PEER_JOINED, { detail });

  /**
   * @event SkylinkEvents.PEER_LEFT
   * @description Event triggered when a Peer leaves the room.
   * @param {Object} detail - Event's payload.
   * @param {String} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the<code>peerJoined</code> event.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   * @param {roomInfo} detail.room - The room.
   */
  const peerLeft = (detail = {}) => new SkylinkEvent(PEER_LEFT, { detail });

  /**
   * @event SkylinkEvents.SERVER_PEER_JOINED
   * @description Event triggered when a server Peer joins the room.
   *  * <blockquote><code>SERVER_PEER_JOINED</code> event indicates that the <code>MCU</code> has successfully joined the
   * room. All call actions should be done after the <code>SERVER_PEER_JOINED</code> event is registered.
   * For <code>P2P</code> key, {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED} is the
   * corresponding event.
   * </blockquote>
   * @param {Object} detail - Event's payload.
   * @param {roomInfo} detail.room - The current room
   * @param {String} detail.peerId - The peer's id
   * @param {SkylinkConstants.SERVER_PEER_TYPE} detail.serverPeerType - The server Peer type
   */
  const serverPeerJoined = (detail = {}) => new SkylinkEvent(SERVER_PEER_JOINED, { detail });

  /**
   * @event SkylinkEvents.SERVER_PEER_LEFT
   * @description Event triggered when a server Peer leaves the room.
   * @param {Object} detail - Event's payload
   * @param {String} detail.peerId - The Peer ID
   * @param {roomInfo} detail.room - The room.
   * @param {SkylinkConstants.SERVER_PEER_TYPE} detail.serverPeerType - The server Peer type
   */
  const serverPeerLeft = (detail = {}) => new SkylinkEvent(SERVER_PEER_LEFT, { detail });

  /**
   * @event SkylinkEvents.GET_PEERS_STATE_CHANGE
   * @description Event triggered when <code>{@link Skylink#getPeers|getPeers}</code> method retrieval state changes.
   * @param {Object} detail - Event's payload
   * @param {SkylinkConstants.GET_PEERS_STATE} detail.state - The current <code>{@link Skylink#getPeers|getPeers}</code> retrieval state.
   * @param {SkylinkUser.sid} detail.privilegePeerId - The Users privileged Peer Id.
   * @param {Object} detail.peerList - The list of Peer IDs Rooms within the same App space.
   * @param {Array} detail.peerList.#room - The list of Peer IDs associated with the Room defined in <code>#room</code> property.
   * @memberOf SkylinkEvents
   */
  const getPeersStateChange = (detail = {}) => new SkylinkEvent(GET_PEERS_STATE_CHANGE, { detail });

  /**
   * @event SkylinkEvents.PEER_CONNECTION_STATE
   * @description Event triggered when a Peer connection session description exchanging state has changed.
   *  <blockquote class="info">
   *   Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * @param {Object} detail - Event's payload
   * @param {SkylinkConstants.PEER_CONNECTION_STATE} detail.state - The current Peer connection session description exchanging states.
   * @param {String} detail.peerId - The Peer ID
   */
  const peerConnectionState = (detail = {}) => new SkylinkEvent(PEER_CONNECTION_STATE, { detail });

  /**
   * @event SkylinkEvents.SESSION_DISCONNECT
   * @description Event triggered when Room session has ended abruptly due to network disconnections.
   * @param {Object} detail - Event's payload.
   * @param {String} detail.peerId - The User's Room session Peer ID
   * @param {peerInfo} detail.peerInfo - The User's Room session information. Object signature matches the <code>peerInfo</code> parameter payload received in the<code> {@link SkylinkEvents.event:PEER_JOINED|PEER JOINED}</code> event.
   * @param {peerInfo} detail.reason - Reason for the disconnect
   * @example
   * Example 1: Listen on sessionDisconnect to reconnect
   * SkylinkEventManager.addEventListener(SkylinkConstants.EVENTS.SESSION_DISCONNECT, evt => {
   *   skylink.leaveRoom() // call leaveRoom to ensure that previous peer information will be removed
   *   .then(() => skylink.joinRoom(joinRoomOptions))
   *   .then((streams) => {
   *     window.attachMediaStream(audioEl, streams[0]);
   *     window.attachMediaStream(videoEl, streams[1]);
   *   })
   * });
   */
  const sessionDisconnect = (detail = {}) => new SkylinkEvent(SESSION_DISCONNECT, { detail });

  /**
   * Event triggered when <code>{@link PeerConnection.getConnectionStatus|getConnectionStatus}</code> method
   * retrieval state changes.
   * @event SkylinkEvents.GET_CONNECTION_STATUS_STATE_CHANGE
   * @param {Object} detail - Event's payload/
   * @param {SkylinkConstants.GET_CONNECTION_STATUS_STATE} detail.state The current retrieval state from <code>{@link
    * Skylink#getConnectionStatus|getConnectionStatus}</code> method.
   * @param {String} detail.peerId The Peer ID.
   * @param {statistics} [detail.stats] The Peer connection current stats.
   * @param {Error} detail.error - The error object. Defined only when <code>state</code> payload is <code>RETRIEVE_ERROR</code>.
   */
  const getConnectionStatusStateChange = (detail = {}) => new SkylinkEvent(GET_CONNECTION_STATUS_STATE_CHANGE, { detail });

  /* eslint-disable */

  /**
   * @event SkylinkEvents.CHANNEL_OPEN
   * @description Event triggered when socket connection to Signaling server has opened.
   * @param {Object} detail - Event's payload.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelOpen = detail => new SkylinkEvent(CHANNEL_OPEN, { detail });

  /**
   * @description Event triggered when socket connection to Signaling server has closed.
   * @event SkylinkEvents.CHANNEL_CLOSE
   * @param {Object} detail - Event's payload.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelClose = detail => new SkylinkEvent(CHANNEL_CLOSE, { detail });

  /**
   * @description This may be caused by Javascript errors in the event listener when subscribing to events.<br>
   * It may be resolved by checking for code errors in your Web App in the event subscribing listener.<br>
   * Event triggered when socket connection encountered exception.
   * @event SkylinkEvents.CHANNEL_ERROR
   * @param {Object} detail - Event's payload.
   * @param {Error|String} detail.error The error object.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelError = detail => new SkylinkEvent(CHANNEL_ERROR, { detail });

  /**
   * @description Note that this is used only for SDK developer purposes.
   * Event triggered when receiving socket message from the Signaling server.
   * @event SkylinkEvents.CHANNEL_MESSAGE
   * @param {Object} detail - Event's payload.
   * @param {Object} detail.message The socket message object.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelMessage = detail => new SkylinkEvent(CHANNEL_MESSAGE, { detail });

  /**
   * @description Event triggered when attempt to establish socket connection to Signaling server has failed.
   * @event SkylinkEvents.SOCKET_ERROR
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.SOCKET_ERROR} detail.errorCode The socket connection error code.
   * @param {Error|String|Number} detail.error The error object.
   * @param {SkylinkConstants.SOCKET_FALLBACK} detail.type The fallback state of the socket connection attempt.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const socketError = detail => new SkylinkEvent(SOCKET_ERROR, { detail });

  /**
   * @description Event triggered when Signaling server reaction state has changed.
   * @event SkylinkEvents.SYSTEM_ACTION
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.SYSTEM_ACTION} detail.action The current Signaling server reaction state.
   * @param {String} detail.message The message.
   * @param {SkylinkConstants.SYSTEM_ACTION_REASON} detail.reason The Signaling server reaction state reason of action code.
   */
  const systemAction = detail => new SkylinkEvent(SYSTEM_ACTION, { detail });

  /**
   * @event SkylinkEvents.MEDIA_ACCESS_FALLBACK
   * @description Event triggered when Stream retrieval fallback state has changed.
   * @param {Object} detail - Event's payload.
   * @param {JSON} detail.error - The error result.
   * @param {String} detail.error.error - The error object.
   * @param {JSON} detail.error.diff - The list of excepted but received audio and video tracks in Stream. Defined only when <code>state</code> payload is <code>FALLBACKED</code>.
   * @param {JSON} detail.error.video - The expected and received video tracks.
   * @param {Number} detail.error.video.expected - The expected video tracks.
   * @param {Number} detail.error.video.received - The received video tracks.
   * @param {JSON} detail.error.audio - The expected and received audio tracks.
   * @param {Number} detail.error.audio.expected - The expected audio tracks.
   * @param {Number} detail.error.audio.received - The received audio tracks.
   * @param {SkylinkConstants.MEDIA_ACCESS_FALLBACK_STATE} detail.state - The fallback state.
   * @param {boolean} detail.isScreensharing - The flag if event occurred during <code>{@link Skylink#shareScreen|shareScreen}</code> method
   * and not <code>{@link Skylink#getUserMedia|getUserMedia}</code> method.
   * @param {boolean} detail.isAudioFallback - The flag if event occurred during retrieval of audio tracks only when <code>{@link Skylink#getUserMedia|getUserMedia}</code> method failed to retrieve both audio and video tracks.
   * @param {String} detail.streamId - The Stream ID. Defined only when <code>state</code> payload is <code>FALLBACKED</code>.
   */
  const mediaAccessFallback = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_FALLBACK, { detail });

  /**
   * @event SkylinkEvents.MEDIA_ACCESS_STOPPED
   * @description Event triggered when Stream has stopped streaming.
   * @param {Object} detail.isScreensharing - The flag if event occurred during <code>{@link Skylink#shareScreen|shareScreen}</code> method and not <code>{@link Skylink#getUserMedia|jgetUserMedia}</code> method.
   * @param {boolean} detail.isAudioFallback - The flag if event occurred during retrieval of audio tracks only when <code>{@link Skylink#getUserMedia|jgetUserMedia}</code> method had failed to retrieve both audio and video tracks.
   * @param {String} detail.streamId - The Stream ID.
   */
  const mediaAccessStopped = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_STOPPED, { detail });

  /**
   * @event SkylinkEvents.MEDIA_ACCESS_SUCCESS
   * @description Event triggered when retrieval of Stream is successful.
   * @param {Object} detail
   * @param {MediaStream} detail.stream - The Stream object. To attach it to an element: <code>attachMediaStream(videoElement, stream);</code>.
   * @param {Boolean} detail.isScreensharing - The flag if event occurred during <code>{@link Skylink#shareScreen|shareScreen}</code> method and not <code>{@link Skylink#getUserMedia|getUserMedia}</code> method.
   * @param {Boolean} detail.isAudioFallback - The flag if event occurred during retrieval of audio tracks only when <code>{@link Skylink#getUserMedia|getUserMedia}</code> method had failed to retrieve both audio and video tracks.
   * @param {String} detail.streamId - The Stream ID.
   * @param {boolean} detail.isVideo - The flag if the incoming stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the incoming stream has an audio track.
   */
  const mediaAccessSuccess = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_SUCCESS, { detail });

  /**
   * @event SkylinkEvents.RECORDING_STATE
   * @description Event triggered when recording session state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.RECORDING_STATE} detail.state - The current recording session state.
   * @param {String} detail.recordingId - The recording session ID.
   * @param {Error | String} detail.error - The error object. Defined only when <code>state</code> payload is <code>ERROR</code>.
   */
  const recordingState = (detail = {}) => new SkylinkEvent(RECORDING_STATE, { detail });

  /**
   * @event SkylinkEvents.RTMP_STATE
   * @description Event triggered when rtmp session state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.RTMP_STATE} detail.state - The current recording session state.
   * @param {String} detail.rtmpId - The rtmp session ID.
   * @param {Error | String} detail.error - The error object. Defined only when <code>state</code> payload is <code>ERROR</code>.
   */
  const rtmpState = (detail = {}) => new SkylinkEvent(RTMP_STATE, { detail });

  /**
   * @event SkylinkEvents.LOCAL_MEDIA_MUTED
   * @description Event triggered when <code>{@link PeerConnection.muteStreams|muteStreams}</code> method changes User Streams audio and video tracks
   * muted
   * status.
   * @param {Object} detail - Event's payload.
   * @param {String} detail.streamId - The muted Stream Id.
   * @param {Boolean} detail.isScreensharing - The flag if the media muted was screensharing.
   * @param {JSON} detail.mediaStatus - The Peer streaming media status. This indicates the media status for both <code>{@link Skylink#getUserMedia|getUserMedia}</code> Stream and <code>{@link Skylink#shareScreen|shareScreen}</code> Stream.
   * @param {Boolean} detail.mediaStatus.audioMuted - The value of the audio status. If Peer <code>mediaStatus</code> is <code>-1</code>, audio is not present in the stream. If Peer <code>mediaStatus</code> is <code>1</code>, audio is present
   *   in the stream and active (not muted). If Peer <code>mediaStatus</code> is <code>0</code>, audio is present in the stream and muted.
   * @param {Boolean} detail.mediaStatus.videoMuted - The value of the video status. If Peer <code>mediaStatus</code> is <code>-1</code>, video is not present in the stream. If Peer <code>mediaStatus</code> is <code>1</code>, video is present
   *   in the stream and active (not muted). If Peer <code>mediaStatus</code> is <code>0</code>, video is present in the stream and muted.
   */
  const localMediaMuted = (detail = {}) => new SkylinkEvent(LOCAL_MEDIA_MUTED, { detail });

  /**
   * @event SkylinkEvents.MEDIA_ACCESS_ERROR
   * @description Event triggered when retrieval of Stream failed.
   * @param {Object} detail - Event's payload.
   * @param {Error | String} detail.error - The error object.
   * @param {Boolean} detail.isScreensharing - The flag if event occurred during <code>{@link Skylink#shareScreen|shareScreen}</code> method and not <code>{@link Skylink#getUserMedia|getUserMedia}</code> method.
   * @param {Boolean} detail.isAudioFallbackError - The flag if event occurred during retrieval of audio tracks only when <code>{@link Skylink#getUserMedia|getUserMedia}</code> method had failed to retrieve both audio and video tracks.
   */
  const mediaAccessError = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_ERROR, { detail });

  /**
   * @event SkylinkEvents.mediaInfo
   * @description Event triggered when media info changes.
   * @param {Object} detail - Event's payload.
   * @param {Object} detail.mediaInfo - The media info object.
   * @private
   */
  const mediaInfoDeleted = (detail = {}) => new SkylinkEvent(MEDIA_INFO_DELETED, { detail });

  /* eslint-disable import/prefer-default-export */

  /**
   * @event SkylinkEvents.loggedOnConsole
   * @description Event triggered when Skylink logs to browser's console.
   * @param {Object} detail - Event's payload.
   * @param {JSON} detail.level - The log level.
   * @param {String} detail.message - The log message.
   * @param {JSON} detail.debugObject - A JavaScript object to be logged to help with analysis.
   * @private
   */
  const loggedOnConsole = (detail = {}) => new SkylinkEvent(LOGGED_ON_CONSOLE, { detail });

  /**
   * @namespace SkylinkConstants
   * @description
   * <ul>
   *  <li>{@link SkylinkConstants.BUNDLE_POLICY|BUNDLE_POLICY} </li>
   *  <li>{@link SkylinkConstants.CANDIDATE_GENERATION_STATE|CANDIDATE_GENERATION_STATE} </li>
   *  <li>{@link SkylinkConstants.CANDIDATE_PROCESSING_STATE|CANDIDATE_PROCESSING_STATE} </li>
   *  <li>{@link SkylinkConstants.DATA_CHANNEL_STATE|DATA_CHANNEL_STATE} </li>
   *  <li>{@link SkylinkConstants.DATA_CHANNEL_TYPE|DATA_CHANNEL_TYPE} </li>
   *  <li>{@link SkylinkConstants.DATA_CHANNEL_MESSAGE_ERROR|DATA_CHANNEL_MESSAGE_ERROR} </li>
   *  <li>{@link SkylinkEvents|EVENTS} </li>
   *  <li>{@link SkylinkConstants.GET_CONNECTION_STATUS_STATE|GET_CONNECTION_STATUS_STATE} </li>
   *  <li>{@link SkylinkConstants.GET_PEERS_STATE|GET_PEERS_STATE} </li>
   *  <li>{@link SkylinkConstants.HANDSHAKE_PROGRESS|HANDSHAKE_PROGRESS} </li>
   *  <li>{@link SkylinkConstants.ICE_CONNECTION_STATE|ICE_CONNECTION_STATE} </li>
   *  <li>{@link SkylinkConstants.LOG_LEVEL|LOG_LEVEL} </li>
   *  <li>{@link SkylinkConstants.MEDIA_ACCESS_FALLBACK_STATE|MEDIA_ACCESS_FALLBACK_STATE} </li>
   *  <li>{@link SkylinkConstants.MEDIA_SOURCE|MEDIA_SOURCE} </li>
   *  <li>{@link SkylinkConstants.MEDIA_STATUS|MEDIA_STATUS} </li>
   *  <li>{@link SkylinkConstants.MEDIA_TYPE|MEDIA_TYPE} </li>
   *  <li>{@link SkylinkConstants.MEDIA_STATE|MEDIA_STATE} </li>
   *  <li>{@link SkylinkConstants.PEER_CERTIFICATE|PEER_CERTIFICATE} </li>
   *  <li>{@link SkylinkConstants.PEER_CONNECTION_STATE|PEER_CONNECTION_STATE} </li>
   *  <li>{@link SkylinkConstants.READY_STATE_CHANGE_ERROR|READY_STATE_CHANGE_ERROR} </li>
   *  <li>{@link SkylinkConstants.READY_STATE_CHANGE|READY_STATE_CHANGE} </li>
   *  <li>{@link SkylinkConstants.RTCP_MUX_POLICY|RTCP_MUX_POLICY} </li>
   *  <li>{@link SkylinkConstants.RTMP_STATE|RTMP_STATE} </li>
   *  <li>{@link SkylinkConstants.RECORDING_STATE|RECORDING_STATE} </li>
   *  <li>{@link SkylinkConstants.SDP_SEMANTICS|SDP_SEMANTICS} </li>
   *  <li>{@link SkylinkConstants.SERVER_PEER_TYPE|SERVER_PEER_TYPE} </li>
   *  <li>{@link SkylinkConstants.SOCKET_ERROR|SOCKET_ERROR} </li>
   *  <li>{@link SkylinkConstants.SOCKET_FALLBACK|SOCKET_FALLBACK} </li>
   *  <li>{@link SkylinkConstants.SYSTEM_ACTION|SYSTEM_ACTION} </li>
   *  <li>{@link SkylinkConstants.SYSTEM_ACTION_REASON|SYSTEM_ACTION_REASON} </li>
   *  <li>{@link SkylinkConstants.SM_PROTOCOL_VERSION|SM_PROTOCOL_VERSION} </li>
   *  <li>{@link SkylinkConstants.TURN_TRANSPORT|TURN_TRANSPORT} </li>
   *  <li>{@link SkylinkConstants.VIDEO_RESOLUTION|VIDEO_RESOLUTION} </li>
   *  <li>{@link SkylinkConstants.VIDEO_QUALITY|VIDEO_QUALITY} </li>
   * </ul>
   */

  /**
   *  // Not implemented yet
   *  {@link SkylinkConstants.DATA_TRANSFER_DATA_TYPE|DATA_TRANSFER_DATA_TYPE} </br>
   *  {@link SkylinkConstants.DT_PROTOCOL_VERSION|DT_PROTOCOL_VERSION} </br>
   *  {@link SkylinkConstants.DATA_TRANSFER_TYPE|DATA_TRANSFER_TYPE} </br>
   *  {@link SkylinkConstants.DATA_TRANSFER_SESSION_TYPE|DATA_TRANSFER_SESSION_TYPE} </br>
   *  {@link SkylinkConstants.DATA_TRANSFER_STATE|DATA_TRANSFER_STATE} </br>
   *  {@link SkylinkConstants.DATA_STREAM_STATE|DATA_STREAM_STATE} </br>
   *  {@link SkylinkConstants.INTRODUCE_STATE|INTRODUCE_STATE} </br>
   *  {@link SkylinkConstants.REGIONAL_SERVER|REGIONAL_SERVER} </br>
   *  {@link SkylinkConstants.CHUNK_FILE_SIZE|CHUNK_FILE_SIZE} </br>
   *  {@link SkylinkConstants.MOZ_CHUNK_FILE_SIZE|MOZ_CHUNK_FILE_SIZE} </br>
   *  {@link SkylinkConstants.BINARY_FILE_SIZE|BINARY_FILE_SIZE} </br>
   *  {@link SkylinkConstants.MOZ_BINARY_FILE_SIZE|MOZ_BINARY_FILE_SIZE} </br>
   *  {@link SkylinkConstants.CHUNK_DATAURL_SIZE|CHUNK_DATAURL_SIZE} </br>
   *  {@link SkylinkConstants.DC_PROTOCOL_TYPE|DC_PROTOCOL_TYPE} </br>
   *  // Private
   *  {@link SkylinkConstants.SIG_MESSAGE_TYPE|SIG_MESSAGE_TYPE} </br>
   *  {@link SkylinkConstants.AUTH_STATE|AUTH_STATE} </br>
   *  {@link SkylinkConstants.STREAM_STATUS|STREAM_STATUS} </br>
   *  {@link SkylinkConstants.GROUP_MESSAGE_LIST|GROUP_MESSAGE_LIST} </br>
   *  {@link SkylinkConstants.TAGS|TAGS} </br>
   *  {@link SkylinkConstants.TRACK_READY_STATE|TRACK_READY_STATE} </br>
   *  {@link SkylinkConstants.TRACK_KIND|TRACK_KIND} </br>
   *  {@link SkylinkConstants.MEDIA_INFO|MEDIA_INFO} </br>
   *  {@link SkylinkConstants.SDK_VERSION|SDK_VERSION} </br>
   *  {@link SkylinkConstants.SDK_NAME|SDK_NAME} </br>
   *  {@link SkylinkConstants.API_VERSION|API_VERSION} </br>
   *  {@link SkylinkConstants.SIGNALING_VERSION|SIGNALING_VERSION} </br>
   *  {@link SkylinkConstants.BROWSER_AGENT|BROWSER_AGENT} </br>
   *  {@link SkylinkConstants.PEER_TYPE|PEER_TYPE} </br>
   *  {@link SkylinkConstants.SOCKET_EVENTS|SOCKET_EVENTS} </br>
   *  {@link SkylinkConstants.SOCKET_TYPE|SOCKET_TYPE} </br>
   *  {@link SkylinkConstants.STATES|STATES} </br>
   */

  /**
   * The list of Datachannel connection states.
   * @typedef DATA_CHANNEL_STATE
   * @property {String} CONNECTING          Value <code>"connecting"</code>
   *   The value of the state when Datachannel is attempting to establish a connection.
   * @property {String} OPEN                Value <code>"open"</code>
   *   The value of the state when Datachannel has established a connection.
   * @property {String} CLOSING             Value <code>"closing"</code>
   *   The value of the state when Datachannel connection is closing.
   * @property {String} CLOSED              Value <code>"closed"</code>
   *   The value of the state when Datachannel connection has closed.
   * @property {String} ERROR               Value <code>"error"</code>
   *   The value of the state when Datachannel has encountered an exception during connection.
   * @property {String} CREATE_ERROR        Value <code>"createError"</code>
   *   The value of the state when Datachannel has failed to establish a connection.
   * @property {String} BUFFERED_AMOUNT_LOW Value <code>"bufferedAmountLow"</code>
   *   The value of the state when Datachannel when the amount of data buffered to be sent
   *   falls below the Datachannel threshold.
   *   This state should occur only during after {@link Skylink#sendBlobData|sendBlobData} or {@link Skylink#sendURLData|sendURLData} or
   *   {@link Skylink#sendP2PMessage|sendP2PMessage}.
   * @property {String} SEND_MESSAGE_ERROR  Value <code>"sendMessageError"</code>
   *   The value of the state when Datachannel when data transfer packets or P2P message fails to send.
   *   This state should occur only during after {@link Skylink#sendBlobData|sendBlobData} or {@link Skylink#sendURLData|sendURLData} or
   *   {@link Skylink#sendP2PMessage|sendP2PMessage}.
   * @constant
   * @type object
   * @readOnly
   * @since 0.1.0
   * @memberOf SkylinkConstants
   */
  const DATA_CHANNEL_STATE$1 = {
    CONNECTING: 'connecting',
    OPEN: 'open',
    CLOSING: 'closing',
    CLOSED: 'closed',
    ERROR: 'error',
    CREATE_ERROR: 'createError',
    BUFFERED_AMOUNT_LOW: 'bufferedAmountLow',
    SEND_MESSAGE_ERROR: 'sendMessageError',
  };

  /**
   * The list of Datachannel types.
   * @typedef DATA_CHANNEL_TYPE
   * @property {String} MESSAGING Value <code>"messaging"</code>
   *   The value of the Datachannel type that is used only for messaging in
   *   {@link Skylink#sendP2PMessage|sendP2PMessage}.
   *   However for Peers that do not support simultaneous data transfers, this Datachannel
   *   type will be used to do data transfers (1 at a time).
   *   Each Peer connections will only have one of this Datachannel type and the
   *   connection will only close when the Peer connection is closed (happens when {@link SkylinkEvents.event:PEER_CONNECTION_STATE|PEER CONNECTION
    *   STATE} event triggers parameter payload <code>state</code> as
   *   <code>CLOSED</code> for Peer).
   * @property {String} DATA [UNAVAILABLE] Value <code>"data"</code>
   *   The value of the Datachannel type that is used only for a data transfer in
   *   {@link Skylink#sendURLData|sendURLData} and
   *   {@link Skylink#sendBlobData|sendBlobData}.
   *   The connection will close after the data transfer has been completed or terminated (happens when
   *   {@link SkylinkEvents.event:DATA_TRANSFER_STATE|DATA TRANSFER STATE} triggers parameter payload
   *   <code>state</code> as <code>DOWNLOAD_COMPLETED</code>, <code>UPLOAD_COMPLETED</code>,
   *   <code>REJECTED</code>, <code>CANCEL</code> or <code>ERROR</code> for Peer).
   * @constant
   * @type object
   * @readOnly
   * @since 0.6.1
   * @memberOf SkylinkConstants
   */
  const DATA_CHANNEL_TYPE = {
    MESSAGING: 'messaging',
    DATA: 'data',
  };

  /**
   * The list of Datachannel sending message error types.
   * @typedef DATA_CHANNEL_MESSAGE_ERROR
   * @property {String} MESSAGE  Value <code>"message"</code>
   *   The value of the Datachannel sending message error type when encountered during
   *   sending P2P message from {@link Skylink#sendP2PMessage|sendP2PMessage}.
   * @property {String} TRANSFER Value <code>"transfer"</code>
   *   The value of the Datachannel sending message error type when encountered during
   *   data transfers from {@link Skylink#sendURLData|sendURLData} or
   *   {@link Skylink#sendBlobData|sendBlobData}.
   * @constant
   * @type object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.16
   */
  const DATA_CHANNEL_MESSAGE_ERROR = {
    MESSAGE: 'message',
    TRANSFER: 'transfer',
  };

  /**
   * The list of supported data transfer data types.
   * @typedef DATA_TRANSFER_DATA_TYPE
   * @property {String} BINARY_STRING Value <code>"binaryString"</code>
   *   The value of data transfer data type when Blob binary data chunks encoded to Base64 encoded string are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendBlobData|sendBlobData} when
   *   parameter <code>sendChunksAsBinary</code> value is <code>false</code>.
   * @property {String} ARRAY_BUFFER  Value <code>"arrayBuffer"</code>
   *   The value of data transfer data type when ArrayBuffer binary data chunks are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendBlobData|sendBlobData} when
   *   parameter <code>sendChunksAsBinary</code> value is <code>true</code>.
   * @property {String} BLOB          Value <code>"blob"</code>
   *   The value of data transfer data type when Blob binary data chunks are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendBlobData|sendBlobData} when
   *   parameter <code>sendChunksAsBinary</code> value is <code>true</code>.
   * @property {String} STRING        Value <code>"string"</code>
   *   The value of data transfer data type when only string data chunks are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendURLData|sendURLData}.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   * @ignore
   */
  const DATA_TRANSFER_DATA_TYPE = {
    BINARY_STRING: 'binaryString',
    ARRAY_BUFFER: 'arrayBuffer',
    BLOB: 'blob',
    STRING: 'string',
  };

  /**
   * <blockquote class="info">
   *   Note that this is used only for SDK developer purposes.<br>
   *   Current version: <code>0.1.3</code>
   * </blockquote>
   * The value of the current version of the data transfer protocol.
   * @typedef DT_PROTOCOL_VERSION
   * @type string
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.10
   */
  const DT_PROTOCOL_VERSION = '0.1.3';

  /**
   * The list of data transfers directions.
   * @typedef DATA_TRANSFER_TYPE
   * @property {String} UPLOAD Value <code>"upload"</code>
   *   The value of the data transfer direction when User is uploading data to Peer.
   * @property {String} DOWNLOAD Value <code>"download"</code>
   *   The value of the data transfer direction when User is downloading data from Peer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   * @ignore
   */
  const DATA_TRANSFER_TYPE = {
    UPLOAD: 'upload',
    DOWNLOAD: 'download',
  };

  /**
   * The list of data transfers session types.
   * @typedef DATA_TRANSFER_SESSION_TYPE
   * @property {String} BLOB     Value <code>"blob"</code>
   *   The value of the session type for
   *   {@link Skylink#sendURLData|sendURLData} data transfer.
   * @property {String} DATA_URL Value <code>"dataURL"</code>
   *   The value of the session type for
   *   {@link Skylink#sendBlobData|sendBlobData} data transfer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   * @ignore
   */
  const DATA_TRANSFER_SESSION_TYPE = {
    BLOB: 'blob',
    DATA_URL: 'dataURL',
  };

  /**
   * The list of data transfer states.
   * @typedef DATA_TRANSFER_STATE
   * @property {String} UPLOAD_REQUEST     Value <code>"request"</code>
   *   The value of the state when receiving an upload data transfer request from Peer to User.
   *   At this stage, the upload data transfer request from Peer may be accepted or rejected with the
   *   {@link Skylink#acceptDataTransfer} invoked by User.
   * @param {String} USER_UPLOAD_REQUEST Value <code>"userRequest"</code>
   *   The value of the state when User sent an upload data transfer request to Peer.
   *   At this stage, the upload data transfer request to Peer may be accepted or rejected with the
   *   {@link Skylink#acceptDataTransfer}invoked by Peer.
   * @property {String} UPLOAD_STARTED     Value <code>"uploadStarted"</code>
   *   The value of the state when the data transfer request has been accepted
   *   and data transfer will start uploading data to Peer.
   *   At this stage, the data transfer may be terminated with the
   *   {@link Skylink#cancelDataTransfer}.
   * @property {String} DOWNLOAD_STARTED   Value <code>"downloadStarted"</code>
   *   The value of the state when the data transfer request has been accepted
   *   and data transfer will start downloading data from Peer.
   *   At this stage, the data transfer may be terminated with the
   *   {@link Skylink#cancelDataTransfer}.
   * @property {String} REJECTED           Value <code>"rejected"</code>
   *   The value of the state when upload data transfer request to Peer has been rejected and terminated.
   * @property {String} USER_REJECTED      Value <code>"userRejected"</code>
   *   The value of the state when User rejected and terminated upload data transfer request from Peer.
   * @property {String} UPLOADING          Value <code>"uploading"</code>
   *   The value of the state when data transfer is uploading data to Peer.
   * @property {String} DOWNLOADING        Value <code>"downloading"</code>
   *   The value of the state when data transfer is downloading data from Peer.
   * @property {String} UPLOAD_COMPLETED   Value <code>"uploadCompleted"</code>
   *   The value of the state when data transfer has uploaded successfully to Peer.
   * @property {String} DOWNLOAD_COMPLETED Value <code>"downloadCompleted"</code>
   *   The value of the state when data transfer has downloaded successfully from Peer.
   * @property {String} CANCEL             Value <code>"cancel"</code>
   *   The value of the state when data transfer has been terminated from / to Peer.
   * @property {String} ERROR              Value <code>"error"</code>
   *   The value of the state when data transfer has errors and has been terminated from / to Peer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.4.0
   * @ignore
   */
  const DATA_TRANSFER_STATE$1 = {
    UPLOAD_REQUEST: 'request',
    UPLOAD_STARTED: 'uploadStarted',
    DOWNLOAD_STARTED: 'downloadStarted',
    REJECTED: 'rejected',
    CANCEL: 'cancel',
    ERROR: 'error',
    UPLOADING: 'uploading',
    DOWNLOADING: 'downloading',
    UPLOAD_COMPLETED: 'uploadCompleted',
    DOWNLOAD_COMPLETED: 'downloadCompleted',
    USER_REJECTED: 'userRejected',
    USER_UPLOAD_REQUEST: 'userRequest',
    START_ERROR: 'startError',
  };

  /**
   * The list of auth states.
   * @typedef AUTH_STATE
   * @property {String} REQUEST   Value <code>"request"</code>
   *   The value of the state when the SDK authenticates with API.
   * @property {String} SUCCESS Value <code>"success"</code>
   *   The value of the state when the auth request is successful.
   * @property {String} ERROR          Value <code>"error"</code>
   *   The value of the state when the auth request fails.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0.0
   * @ignore
   */
  const AUTH_STATE = {
    REQUEST: 'request',
    SUCCESS: 'success',
    ERROR: 'error',
  };

  /**
   * The list of data streaming states.
   * @typedef DATA_STREAM_STATE
   * @property {String} SENDING_STARTED   Value <code>"sendStart"</code>
   *   The value of the state when data streaming session has started from User to Peer.
   * @property {String} RECEIVING_STARTED Value <code>"receiveStart"</code>
   *   The value of the state when data streaming session has started from Peer to Peer.
   * @property {String} RECEIVED          Value <code>"received"</code>
   *   The value of the state when data streaming session data chunk has been received from Peer to User.
   * @property {String} SENT              Value <code>"sent"</code>
   *   The value of the state when data streaming session data chunk has been sent from User to Peer.
   * @property {String} SENDING_STOPPED   Value <code>"sendStop"</code>
   *   The value of the state when data streaming session has stopped from User to Peer.
   * @property {String} RECEIVING_STOPPED Value <code>"receivingStop"</code>
   *   The value of the state when data streaming session has stopped from Peer to User.
   * @property {String} ERROR             Value <code>"error"</code>
   *   The value of the state when data streaming session has errors.
   *   At this stage, the data streaming state is considered <code>SENDING_STOPPED</code> or
   *   <code>RECEIVING_STOPPED</code>.
   * @property {String} START_ERROR       Value <code>"startError"</code>
   *   The value of the state when data streaming session failed to start from User to Peer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.18
   * @ignore
   */
  const DATA_STREAM_STATE$1 = {
    SENDING_STARTED: 'sendStart',
    SENDING_STOPPED: 'sendStop',
    RECEIVING_STARTED: 'receiveStart',
    RECEIVING_STOPPED: 'receiveStop',
    RECEIVED: 'received',
    SENT: 'sent',
    ERROR: 'error',
    START_ERROR: 'startError',
  };

  /**
   * <blockquote class="info">
   *   Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of Peer connection ICE gathering states.
   * @typedef CANDIDATE_GENERATION_STATE
   * @property {String} GATHERING Value <code>"gathering"</code>
   *   The value of the state when Peer connection is gathering ICE candidates.
   *   These ICE candidates are sent to Peer for its connection to check for a suitable matching
   *   pair of ICE candidates to establish an ICE connection for stream audio, video and data.
   *   See {@link SkylinkConstants.ICE_CONNECTION_STATE|ICE_CONNECTION_STATE} for ICE connection status.
   *   This state cannot happen until Peer connection remote <code>"offer"</code> / <code>"answer"</code>
   *   session description is set. See {@link SkylinkConstants.PEER_CONNECTION_STATE|PEER_CONNECTION_STATE} for session description exchanging status.
   * @property {String} COMPLETED Value <code>"completed"</code>
   *   The value of the state when Peer connection gathering of ICE candidates has completed.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.4.1
   */
  const CANDIDATE_GENERATION_STATE$1 = {
    NEW: 'new',
    GATHERING: 'gathering',
    COMPLETED: 'complete',
  };

  /**
   * <blockquote class="info">
   *   Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of Peer connection remote ICE candidate processing states for trickle ICE connections.
   * @typedef CANDIDATE_PROCESSING_STATE
   * @property {String} RECEIVED Value <code>"received"</code>
   *   The value of the state when the remote ICE candidate was received.
   * @property {String} DROPPED  Value <code>"received"</code>
   *   The value of the state when the remote ICE candidate is dropped.
   * @property {String} BUFFERED  Value <code>"buffered"</code>
   *   The value of the state when the remote ICE candidate is buffered.
   * @property {String} PROCESSING  Value <code>"processing"</code>
   *   The value of the state when the remote ICE candidate is being processed.
   * @property {String} PROCESS_SUCCESS  Value <code>"processSuccess"</code>
   *   The value of the state when the remote ICE candidate has been processed successfully.
   *   The ICE candidate that is processed will be used to check against the list of
   *   locally generated ICE candidate to start matching for the suitable pair for the best ICE connection.
   * @property {String} PROCESS_ERROR  Value <code>"processError"</code>
   *   The value of the state when the remote ICE candidate has failed to be processed.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.16
   */
  const CANDIDATE_PROCESSING_STATE$1 = {
    RECEIVED: 'received',
    DROPPED: 'dropped',
    BUFFERED: 'buffered',
    PROCESSING: 'processing',
    PROCESS_SUCCESS: 'processSuccess',
    PROCESS_ERROR: 'processError',
  };

  /**
   * <blockquote class="info">
   *   Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of Peer connection ICE connection states.
   * @typedef ICE_CONNECTION_STATE
   * @property {String} CHECKING       Value <code>"checking"</code>
   *   The value of the state when Peer connection is checking for a suitable matching pair of
   *   ICE candidates to establish ICE connection.
   *   Exchanging of ICE candidates happens during {@link SkylinkEvents.event:candidateGenerationState|{@link SkylinkEvents.event:CANDIDATE_GENERATION_STATE|CANDIDATE GENERATION STATE} event}.
   * @property {String} CONNECTED      Value <code>"connected"</code>
   *   The value of the state when Peer connection has found a suitable matching pair of
   *   ICE candidates to establish ICE connection but is still checking for a better
   *   suitable matching pair of ICE candidates for the best ICE connectivity.
   *   At this state, ICE connection is already established and audio, video and
   *   data streaming has already started.
   * @property {String} COMPLETED      Value <code>"completed"</code>
   *   The value of the state when Peer connection has found the best suitable matching pair
   *   of ICE candidates to establish ICE connection and checking has stopped.
   *   At this state, ICE connection is already established and audio, video and
   *   data streaming has already started. This may happen after <code>CONNECTED</code>.
   * @property {String} FAILED         Value <code>"failed"</code>
   *   The value of the state when Peer connection ICE connection has failed.
   * @property {String} DISCONNECTED   Value <code>"disconnected"</code>
   *   The value of the state when Peer connection ICE connection is disconnected.
   *   At this state, the Peer connection may attempt to revive the ICE connection.
   *   This may happen due to flaky network conditions.
   * @property {String} CLOSED         Value <code>"closed"</code>
   *   The value of the state when Peer connection ICE connection has closed.
   *   This happens when Peer connection is closed and no streaming can occur at this stage.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   */
  const ICE_CONNECTION_STATE$1 = {
    STARTING: 'starting',
    CHECKING: 'checking',
    CONNECTED: 'connected',
    COMPLETED: 'completed',
    CLOSED: 'closed',
    FAILED: 'failed',
    DISCONNECTED: 'disconnected',
  };

  /**
   * <blockquote class="info">
   *   Note that configuring the protocol may not necessarily result in the desired network transports protocol
   *   used in the actual TURN network traffic as it depends which protocol the browser selects and connects with.
   *   This simply configures the TURN ICE server urls <code?transport=(protocol)</code> query option when constructing
   *   the Peer connection. When all protocols are selected, the ICE servers urls are duplicated with all protocols.
   * </blockquote>
   * The list of TURN network transport protocols options when constructing Peer connections
   * configured in Skylink {@link initOptions}.
   * Example <code>.urls</code> inital input: [<code>"turn:server.com?transport=tcp"</code>,
   * <code>"turn:server1.com:3478"</code>, <code>"turn:server.com?transport=udp"</code>]
   * @typedef TURN_TRANSPORT
   * @property {String} TCP Value  <code>"tcp"</code>
   *   The value of the option to configure using only TCP network transport protocol.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=tcp"</code>,
   *   <code>"turn:server1.com:3478?transport=tcp"</code>]
   * @property {String} UDP Value  <code>"udp"</code>
   *   The value of the option to configure using only UDP network transport protocol.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=udp"</code>,
   *   <code>"turn:server1.com:3478?transport=udp"</code>]
   * @property {String} ANY Value  <code>"any"</code>
   *   The value of the option to configure using any network transport protocols configured from the Signaling server.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=tcp"</code>,
   *   <code>"turn:server1.com:3478"</code>, <code>"turn:server.com?transport=udp"</code>]
   * @property {String} NONE Value <code>"none"</code>
   *   The value of the option to not configure using any network transport protocols.
   *   Example <code>.urls</code> output: [<code>"turn:server.com"</code>, <code>"turn:server1.com:3478"</code>]
   *   Configuring this does not mean that no protocols will be used, but
   *   rather removing <code>?transport=(protocol)</code> query option in
   *   the TURN ICE server <code>.urls</code> when constructing the Peer connection.
   * @property {String} ALL Value  <code>"all"</code>
   *   The value of the option to configure using both TCP and UDP network transport protocols.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=tcp"</code>,
   *   <code>"turn:server.com?transport=udp"</code>, <code>"turn:server1.com:3478?transport=tcp"</code>,
   *   <code>"turn:server1.com:3478?transport=udp"</code>]
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.4
   */
  const TURN_TRANSPORT = {
    UDP: 'udp',
    TCP: 'tcp',
    ANY: 'any',
    NONE: 'none',
    ALL: 'all',
  };

  /**
   * <blockquote class="info">
   *   Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of Peer connection session description exchanging states.
   * @typedef PEER_CONNECTION_STATE
   * @property {String} STABLE            Value <code>"stable"</code>
   *   The value of the state when there is no session description being exchanged between Peer connection.
   * @property {String} HAVE_LOCAL_OFFER  Value <code>"have-local-offer"</code>
   *   The value of the state when local <code>"offer"</code> session description is set.
   *   This should transition to <code>STABLE</code> state after remote <code>"answer"</code>
   *   session description is set.
   *   See {@link SkylinkConstants.HANDSHAKE_PROGRESS|HANDSHAKE_PROGRESS} for a more
   *   detailed exchanging of session description states.
   * @property {String} HAVE_REMOTE_OFFER Value <code>"have-remote-offer"</code>
   *   The value of the state when remote <code>"offer"</code> session description is set.
   *   This should transition to <code>STABLE</code> state after local <code>"answer"</code>
   *   session description is set.
   *   See {@link SkylinkConstants.HANDSHAKE_PROGRESS|HANDSHAKE_PROGRESS} for a more
   *   detailed exchanging of session description states.
   * @property {String} CLOSED Value <code>"closed"</code>
   *   The value of the state when Peer connection is closed and no session description can be exchanged and set.
   * @property {String} CONNECTING  Value <code>"connecting"</code>
   *   The value of the state when Peer connection is trying to establish a connection and negotiation has started.
   * @property {String} CONNECTED Value <code>"connected"</code>
   *   The value of the state when Peer connection is connected after successful negotiation.
   * @property {String} FAILED  Value <code>"failed"</code>
   *   The value of the state when Peer connection has failed. A renegotiation is required to re-establish the connection.
   * @property {String} DISCONNECTED  Value <code>"disconnected"</code>
   *   The value of the state when Peer connection is disconnected. State may change to <code>"connected"</code> or <code>"failed"</code>.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.0
   */
  const PEER_CONNECTION_STATE$1 = {
    // onsignalingstatechange
    STABLE: 'stable',
    HAVE_LOCAL_OFFER: 'have-local-offer',
    HAVE_REMOTE_OFFER: 'have-remote-offer',
    CLOSED: 'closed',
    // onconnectionstatechange
    CONNECTING: 'connecting',
    FAILED: 'failed',
    DISCONNECTED: 'disconnected',
    CONNECTED: 'connected',
  };

  /**
   * The list of {@link Skylink#getConnectionStatus} retrieval states.
   * @typedef GET_CONNECTION_STATUS_STATE
   * @property {number} RETRIEVING Value <code>0</code>
   *   The value of the state when {@link Skylink#getConnectionStatus|getConnectionStatus} is retrieving the Peer connection stats.
   * @property {number} RETRIEVE_SUCCESS Value <code>1</code>
   *   The value of the state when {@link Skylink#getConnectionStatus|getConnectionStatus} has retrieved the Peer connection stats successfully.
   * @property {number} RETRIEVE_ERROR Value <code>-1</code>
   *   The value of the state when {@link Skylink#getConnectionStatus|getConnectionStatus} has failed retrieving the Peer connection stats.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   */
  const GET_CONNECTION_STATUS_STATE = {
    RETRIEVING: 0,
    RETRIEVE_SUCCESS: 1,
    RETRIEVE_ERROR: -1,
  };

  /**
   * <blockquote class="info">
   *  As there are more features getting implemented, there will be eventually more different types of
   *  server Peers.
   * </blockquote>
   * The list of available types of server Peer connections.
   * @typedef SERVER_PEER_TYPE
   * @property {String} MCU Value <code>"mcu"</code>
   *   The value of the server Peer type that is used for MCU connection.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.1
   */
  const SERVER_PEER_TYPE = {
    MCU: 'mcu',
  };

  /**
   * <blockquote class="info">
   *  Learn more about how ICE works in this
   *  <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of available Peer connection bundle policies.
   * @typedef BUNDLE_POLICY
   * @property {String} MAX_COMPAT Value <code>"max-compat"</code>
   *   The value of the bundle policy to generate ICE candidates for each media type
   *   so each media type flows through different transports.
   * @property {String} MAX_BUNDLE Value <code>"max-bundle"</code>
   *   The value of the bundle policy to generate ICE candidates for one media type
   *   so all media type flows through a single transport.
   * @property {String} BALANCED   Value <code>"balanced"</code>
   *   The value of the bundle policy to use <code>MAX_BUNDLE</code> if Peer supports it,
   *   else fallback to <code>MAX_COMPAT</code>.
   * @property {String} NONE       Value <code>"none"</code>
   *   The value of the bundle policy to not use any media bundle.
   *   This removes the <code>a=group:BUNDLE</code> line from session descriptions.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.18
   */
  const BUNDLE_POLICY = {
    MAX_COMPAT: 'max-compat',
    BALANCED: 'balanced',
    MAX_BUNDLE: 'max-bundle',
    NONE: 'none',
  };

  /**
   * <blockquote class="info">
   *  Learn more about how ICE works in this
   *  <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of available Peer connection RTCP mux policies.
   * @typedef RTCP_MUX_POLICY
   * @property {String} REQUIRE   Value <code>"require"</code>
   *   The value of the RTCP mux policy to generate ICE candidates for RTP only and RTCP shares the same ICE candidates.
   * @property {String} NEGOTIATE Value <code>"negotiate"</code>
   *   The value of the RTCP mux policy to generate ICE candidates for both RTP and RTCP each.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.18
   */
  const RTCP_MUX_POLICY = {
    REQUIRE: 'require',
    NEGOTIATE: 'negotiate',
  };

  /**
   * <blockquote class="info">
   *  Learn more about how ICE works in this
   *  <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of available Peer connection certificates cryptographic algorithm to use.
   * @typedef PEER_CERTIFICATE
   * @property {String} RSA   Value <code>"RSA"</code>
   *   The value of the Peer connection certificate algorithm to use RSA-1024.
   * @property {String} ECDSA Value <code>"ECDSA"</code>
   *   The value of the Peer connection certificate algorithm to use ECDSA.
   * @property {String} AUTO  Value <code>"AUTO"</code>
   *   The value of the Peer connection to use the default certificate generated.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.18
   */
  const PEER_CERTIFICATE = {
    RSA: 'RSA',
    ECDSA: 'ECDSA',
    AUTO: 'AUTO',
  };

  /**
   * The list of Peer connection states.
   * @typedef HANDSHAKE_PROGRESS
   * @property {String} ENTER   Value <code>"enter"</code>
   *   The value of the connection state when Peer has just entered the Room.
   *   At this stage, {@link SkylinkConstants.PEER_JOINED|PEER_JOINED}
   *   is triggered.
   * @property {String} WELCOME Value <code>"welcome"</code>
   *   The value of the connection state when Peer is aware that User has entered the Room.
   *   At this stage, {@link SkylinkConstants.PEER_JOINED|PEER_JOINED}
   *   is triggered and Peer connection may commence.
   * @property {String} OFFER   Value <code>"offer"</code>
   *   The value of the connection state when Peer connection has set the local / remote <code>"offer"</code>
   *   session description to start streaming connection.
   * @property {String} ANSWER  Value <code>"answer"</code>
   *   The value of the connection state when Peer connection has set the local / remote <code>"answer"</code>
   *   session description to establish streaming connection.
   * @property {string} ANSWER_ACK  Value <code>"answerAck"</code>
   *   The value of the connection state when Peer connection is aware that the user has received the answer and the handshake is
   *   complete.
   * @property {string} ERROR   Value <code>"error"</code>
   *   The value of the connection state when Peer connection has failed to establish streaming connection.
   *   This happens when there are errors that occurs in creating local <code>"offer"</code> /
   *   <code>"answer"</code>, or when setting remote / local <code>"offer"</code> / <code>"answer"</code>.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   */
  const HANDSHAKE_PROGRESS$1 = {
    ENTER: 'enter',
    WELCOME: 'welcome',
    OFFER: 'offer',
    ANSWER: 'answer',
    ANSWER_ACK: 'answerAck',
    ERROR: 'error',
  };

  /**
   * <blockquote class="info">
   *   Note that this feature requires <code>"isPrivileged"</code> flag to be enabled for the App Key
   *   provided in Skylink {@link initOptions}, as only Users connecting using
   *   the App Key with this flag enabled (which we call privileged Users / Peers) can retrieve the list of
   *   Peer IDs from Rooms within the same App space.
   *   <a href="http://support.temasys.io/support/solutions/articles/12000012342-what-is-a-privileged-key-">
   *   Read more about privileged App Key feature here</a>.
   * </blockquote>
   * The list of <code>{@link Skylink#getPeers|getPeers}</code> method retrieval states.
   * @typedef GET_PEERS_STATE
   * @property {String} ENQUIRED Value <code>"enquired"</code>
   *   The value of the state when <code>{@link Skylink#getPeers|getPeers}</code> is retrieving the list of Peer IDs
   *   from Rooms within the same App space from the Signaling server.
   * @property {String} RECEIVED Value <code>"received"</code>
   *   The value of the state when <code>{@link Skylink#getPeers|getPeers}</code> has retrieved the list of Peer IDs
   *   from Rooms within the same App space from the Signaling server successfully.
   * @readOnly
   * @type Object
   * @constant
   * @public
   * @memberOf SkylinkConstants
   * @since 0.6.1
   */
  const GET_PEERS_STATE = {
    ENQUIRED: 'enquired',
    DISPATCHED: 'dispatched',
    RECEIVED: 'received',
  };

  /**
   * <blockquote class="info">
   *   Note that this feature requires <code>"isPrivileged"</code> flag to be enabled and
   *   <code>"autoIntroduce"</code> flag to be disabled for the App Key provided in
   *   Skylink {@link initOptions}, as only Users connecting using
   *   the App Key with this flag enabled (which we call privileged Users / Peers) can retrieve the list of
   *   Peer IDs from Rooms within the same App space.
   *   <a href="http://support.temasys.io/support/solutions/articles/12000012342-what-is-a-privileged-key-">
   *   Read more about privileged App Key feature here</a>.
   * </blockquote>
   * The list of {@link Skylink#introducePeer} Peer introduction request states.
   * @typedef INTRODUCE_STATE
   * @property {String} INTRODUCING Value <code>"enquired"</code>
   *   The value of the state when introduction request for the selected pair of Peers has been made to the Signaling server.
   * @property {String} ERROR       Value <code>"error"</code>
   *   The value of the state when introduction request made to the Signaling server
   *   for the selected pair of Peers has failed.
   * @readOnly
   * @constant
   * @memberOf SkylinkConstants
   * @since 0.6.1
   * @ignore
   */
  const INTRODUCE_STATE = {
    INTRODUCING: 'introducing',
    ERROR: 'error',
  };

  /**
   * The list of Signaling server reaction states during {@link Skylink#joinRoom|joinRoom}.
   * @typedef SYSTEM_ACTION
   * @property {String} WARNING Value <code>"warning"</code>
   *   The value of the state when Room session is about to end.
   * @property {String} REJECT  Value <code>"reject"</code>
   *   The value of the state when Room session has failed to start or has ended.
   * @property {String} LOCKED  Value <code>"locked"</code>
   *   The value of the state when Room sis locked.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.1
   */
  const SYSTEM_ACTION$1 = {
    WARNING: 'warning',
    REJECT: 'reject',
    LOCKED: 'locked',
  };

  /**
   * The list of Signaling server reaction states reason of action code during
   * {@link Skylink#joinRoom|joinRoom}.
   * @typedef SYSTEM_ACTION_REASON
   * @property {String} CREDENTIALS_EXPIRED Value <code>"oldTimeStamp"</code>
   *   The value of the reason code when Room session token has expired.
   *   Happens during {@link Skylink#joinRoom|joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {String} CREDENTIALS_ERROR   Value <code>"credentialError"</code>
   *   The value of the reason code when Room session token provided is invalid.
   *   Happens during {@link Skylink#joinRoom|joinRoom} request.
   * @property {String} DUPLICATED_LOGIN    Value <code>"duplicatedLogin"</code>
   *   The value of the reason code when Room session token has been used already.
   *   Happens during {@link Skylink#joinRoom|joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {String} ROOM_NOT_STARTED    Value <code>"notStart"</code>
   *   The value of the reason code when Room session has not started.
   *   Happens during {@link Skylink#joinRoom|joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {String} EXPIRED             Value <code>"expired"</code>
   *   The value of the reason code when Room session has ended already.
   *   Happens during {@link Skylink#joinRoom|joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {String} ROOM_LOCKED         Value <code>"locked"</code>
   *   The value of the reason code when Room is locked.
   *   Happens during {@link Skylink#joinRoom|joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {String} FAST_MESSAGE        Value <code>"fastmsg"</code>
   *    The value of the reason code when User is flooding socket messages to the Signaling server
   *    that is sent too quickly within less than a second interval.
   *    Happens after Room session has started. This can be caused by various methods like
   *    {@link Skylink#sendMessage|sendMessage},
   *    {@link Skylink#muteStreams|muteStreams}
   *    Results with: <code>WARNING</code>
   * @property {String} ROOM_CLOSING        Value <code>"toClose"</code>
   *    The value of the reason code when Room session is ending.
   *    Happens after Room session has started. This serves as a prerequisite warning before
   *    <code>ROOM_CLOSED</code> occurs.
   *    Results with: <code>WARNING</code>
   * @property {String} ROOM_CLOSED         Value <code>"roomclose"</code>
   *    The value of the reason code when Room session has just ended.
   *    Happens after Room session has started.
   *    Results with: <code>REJECT</code>
   * @property {String} SERVER_ERROR        Value <code>"serverError"</code>
   *    The value of the reason code when Room session fails to start due to some technical errors.
   *    Happens during {@link Skylink#joinRoom|joinRoom} request.
   *    Results with: <code>REJECT</code>
   * @property {String} KEY_ERROR           Value <code>"keyFailed"</code>
   *    The value of the reason code when Room session fails to start due to some technical error pertaining to
   *    App Key initialization.
   *    Happens during {@link Skylink#joinRoom|joinRoom} request.
   *    Results with: <code>REJECT</code>
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.2
   */
  const SYSTEM_ACTION_REASON = {
    CREDENTIALS_EXPIRED: 'oldTimeStamp',
    CREDENTIALS_ERROR: 'credentialError',
    DUPLICATED_LOGIN: 'duplicatedLogin',
    ROOM_NOT_STARTED: 'notStart',
    EXPIRED: 'expired',
    ROOM_LOCKED: 'locked',
    FAST_MESSAGE: 'fastmsg',
    ROOM_CLOSING: 'toclose',
    ROOM_CLOSED: 'roomclose',
    SERVER_ERROR: 'serverError',
    KEY_ERROR: 'keyFailed',
  };

  /**
   * The list of Skylink {@link initOptions} ready states.
   * @typedef READY_STATE_CHANGE
   * @property {number} INIT      Value <code>0</code>
   *   The value of the state when <code>init()</code> has just started.
   * @property {number} LOADING   Value <code>1</code>
   *   The value of the state when <code>init()</code> is authenticating App Key provided
   *   (and with credentials if provided as well) with the Auth server.
   * @property {number} COMPLETED Value <code>2</code>
   *   The value of the state when <code>init()</code> has successfully authenticated with the Auth server.
   *   Room session token is generated for joining the <codRoom</code> provided in <code>init()</code>.
   *   Room session token has to be generated each time User switches to a different Room
   *   in {@link Skylink#joinRoom|joinRoom} method.
   * @property {number} ERROR     Value <code>-1</code>
   *   The value of the state when <code>init()</code> has failed authenticating with the Auth server.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   */
  const READY_STATE_CHANGE$1 = {
    INIT: 0,
    LOADING: 1,
    COMPLETED: 2,
    ERROR: -1,
  };

  /**
   * The list of Skylink {@link initOptions} ready state failure codes.
   * @typedef READY_STATE_CHANGE_ERROR
   * @property {number} API_INVALID                 Value <code>4001</code>
   *   The value of the failure code when provided App Key in <code>init()</code> does not exists.
   *   To resolve this, check that the provided App Key exists in
   *   <a href="https://console.temasys.io">the Temasys Console</a>.
   * @property {number} API_DOMAIN_NOT_MATCH        Value <code>4002</code>
   *   The value of the failure code when <code>"domainName"</code> property in the App Key does not
   *   match the accessing server IP address.
   *   To resolve this, contact our <a href="http://support.temasys.io">support portal</a>.
   * @property {number} API_CORS_DOMAIN_NOT_MATCH   Value <code>4003</code>
   *   The value of the failure code when <code>"corsurl"</code> property in the App Key does not match accessing CORS.
   *   To resolve this, configure the App Key CORS in
   *   <a href="https://console.temasys.io">the Temasys Console</a>.
   * @property {number} API_CREDENTIALS_INVALID     Value <code>4004</code>
   *   The value of the failure code when there is no [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
   *   present in the HTTP headers during the request to the Auth server present nor
   *   <code>options.credentials.credentials</code> configuration provided in the <code>init()</code>.
   *   To resolve this, ensure that CORS are present in the HTTP headers during the request to the Auth server.
   * @property {number} API_CREDENTIALS_NOT_MATCH   Value <code>4005</code>
   *   The value of the failure code when the <code>options.credentials.credentials</code> configuration provided in the
   *   <code>init()</code> does not match up with the <code>options.credentials.startDateTime</code>,
   *   <code>options.credentials.duration</code> or that the <code>"secret"</code> used to generate
   *   <code>options.credentials.credentials</code> does not match the App Key's <code>"secret</code> property provided.
   *   To resolve this, check that the <code>options.credentials.credentials</code> is generated correctly and
   *   that the <code>"secret"</code> used to generate it is from the App Key provided in the <code>init()</code>.
   * @property {number} API_INVALID_PARENT_KEY      Value <code>4006</code>
   *   The value of the failure code when the App Key provided does not belong to any existing App.
   *   To resolve this, check that the provided App Key exists in
   *   <a href="https://console.temasys.io">the Developer Console</a>.
   * @property {number} API_NO_MEETING_RECORD_FOUND Value <code>4010</code>
   *   The value of the failure code when provided <code>options.credentials</code>
   *   does not match any scheduled meetings available for the "Persistent Room" enabled App Key provided.
   *   See the <a href="http://support.temasys.io/support/solutions/articles/
   * 12000002811-using-the-persistent-room-feature-to-configure-meetings">Persistent Room article</a> to learn more.
   * @property {number} API_OVER_SEAT_LIMIT         Value <code>4020</code>
   *   The value of the failure code when App Key has reached its current concurrent users limit.
   *   To resolve this, use another App Key. To create App Keys dynamically, see the
   *   <a href="https://temasys.atlassian.net/wiki/display/TPD/SkylinkAPI+-+Application+Resources">Application REST API
   *   docs</a> for more information.
   * @property {number} API_RETRIEVAL_FAILED        Value <code>4021</code>
   *   The value of the failure code when App Key retrieval of authentication token fails.
   *   If this happens frequently, contact our <a href="http://support.temasys.io">support portal</a>.
   * @property {number} API_WRONG_ACCESS_DOMAIN     Value <code>5005</code>
   *   The value of the failure code when App Key makes request to the incorrect Auth server.
   *   To resolve this, ensure that the <code>roomServer</code> is not configured. If this persists even without
   *   <code>roomServer</code> configuration, contact our <a href="http://support.temasys.io">support portal</a>.
   * @property {number} XML_HTTP_REQUEST_ERROR      Value <code>-1</code>
   *   The value of the failure code when requesting to Auth server has timed out.
   * @property {number} XML_HTTP_NO_REPONSE_ERROR      Value <code>-2</code>
   *   The value of the failure code when response from Auth server is empty or timed out.
   * @property {number} NO_SOCKET_IO                Value <code>1</code>
   *   The value of the failure code when dependency <a href="http://socket.io/download/">Socket.IO client</a> is not loaded.
   *   To resolve this, ensure that the Socket.IO client dependency is loaded before the Skylink SDK.
   *   You may use the provided Socket.IO client <a href="http://socket.io/download/">CDN here</a>.
   * @property {number} NO_XMLHTTPREQUEST_SUPPORT   Value <code>2</code>
   *   The value of the failure code when <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">
   *   XMLHttpRequest API</a> required to make request to Auth server is not supported.
   *   To resolve this, display in the Web UI to ask clients to switch to the list of supported browser
   *   as <a href="https://github.com/Temasys/SkylinkJS/tree/0.6.14#supported-browsers">listed in here</a>.
   * @property {number} NO_WEBRTC_SUPPORT           Value <code>3</code>
   *   The value of the failure code when <a href="https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/">
   *   RTCPeerConnection API</a> required for Peer connections is not supported.
   *   To resolve this, display in the Web UI to ask clients to switch to the list of supported browser
   *   as <a href="https://github.com/Temasys/SkylinkJS/tree/0.6.14#supported-browsers">listed in here</a>.
   *   For <a href="http://confluence.temasys.com.sg/display/TWPP">plugin supported browsers</a>, if the clients
   *   does not have the plugin installed, there will be an installation toolbar that will prompt for installation
   *   to support the RTCPeerConnection API.
   * @property {number} NO_PATH                     Value <code>4</code>
   *   The value of the failure code when provided <code>init()</code> configuration has errors.
   * @property {number} ADAPTER_NO_LOADED           Value <code>7</code>
   *   The value of the failure code when dependency <a href="https://github.com/Temasys/AdapterJS/">AdapterJS</a>
   *   is not loaded.
   *   To resolve this, ensure that the AdapterJS dependency is loaded before the Skylink dependency.
   *   You may use the provided AdapterJS <a href="https://github.com/Temasys/AdapterJS/">CDN here</a>.
   * @property {number} PARSE_CODECS                Value <code>8</code>
   *   The value of the failure code when codecs support cannot be parsed and retrieved.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.4.0
   */
  const READY_STATE_CHANGE_ERROR = {
    API_INVALID: 4001,
    API_DOMAIN_NOT_MATCH: 4002,
    API_CORS_DOMAIN_NOT_MATCH: 4003,
    API_CREDENTIALS_INVALID: 4004,
    API_CREDENTIALS_NOT_MATCH: 4005,
    API_INVALID_PARENT_KEY: 4006,
    API_NO_MEETING_RECORD_FOUND: 4010,
    API_OVER_SEAT_LIMIT: 4020,
    API_RETRIEVAL_FAILED: 4021,
    API_WRONG_ACCESS_DOMAIN: 5005,
    XML_HTTP_REQUEST_ERROR: -1,
    XML_HTTP_NO_REPONSE_ERROR: -2,
    NO_SOCKET_IO: 1,
    NO_XMLHTTPREQUEST_SUPPORT: 2,
    NO_WEBRTC_SUPPORT: 3,
    NO_PATH: 4,
    ADAPTER_NO_LOADED: 7,
    PARSE_CODECS: 8,
  };

  /**
   * Spoofs the REGIONAL_SERVER to prevent errors on deployed apps except the fact this no longer works.
   * Automatic regional selection has already been implemented hence REGIONAL_SERVER is no longer useful.
   * @typedef REGIONAL_SERVER
   * @constant
   * @type Object
   * @readOnly
   * @private
   * @memberOf SkylinkConstants
   * @since 0.6.16
   */
  const REGIONAL_SERVER = {
    APAC1: '',
    US1: '',
  };

  /**
   * The list of the SDK <code>console</code> API log levels.
   * @typedef LOG_LEVEL
   * @property {number} DEBUG Value <code>4</code>
   *   The value of the log level that displays <code>console</code> <code>debug</code>,
   *   <code>log</code>, <code>info</code>, <code>warn</code> and <code>error</code> logs.
   * @property {number} LOG   Value <code>3</code>
   *   The value of the log level that displays only <code>console</code> <code>log</code>,
   *   <code>info</code>, <code>warn</code> and <code>error</code> logs.
   * @property {number} INFO  Value <code>2</code>
   *   The value of the log level that displays only <code>console</code> <code>info</code>,
   *   <code>warn</code> and <code>error</code> logs.
   * @property {number} WARN  Value <code>1</code>
   *   The value of the log level that displays only <code>console</code> <code>warn</code>
   *   and <code>error</code> logs.
   * @property {number} ERROR Value <code>0</code>
   *   The value of the log level that displays only <code>console</code> <code>error</code> logs.
   * @property {number} NONE Value <code>-1</code>
   *   The value of the log level that displays no logs.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.4
   */
  const LOG_LEVEL = {
    DEBUG: 4,
    LOG: 3,
    INFO: 2,
    WARN: 1,
    ERROR: 0,
    NONE: -1,
  };

  /**
   * The list of {@link Skylink#joinRoom|joinRoom}  socket connection failure states.
   * @typedef SOCKET_ERROR
   * @property {number} CONNECTION_FAILED    Value <code>0</code>
   *   The value of the failure state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection failed to establish with
   *   the Signaling server at the first attempt.
   * @property {number} RECONNECTION_FAILED  Value <code>-1</code>
   *   The value of the failure state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection failed to establish
   *   the Signaling server after the first attempt.
   * @property {number} CONNECTION_ABORTED   Value <code>-2</code>
   *   The value of the failure state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection will not attempt
   *   to reconnect after the failure of the first attempt in <code>CONNECTION_FAILED</code> as there
   *   are no more ports or transports to attempt for reconnection.
   * @property {number} RECONNECTION_ABORTED Value <code>-3</code>
   *   The value of the failure state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection will not attempt
   *   to reconnect after the failure of several attempts in <code>RECONNECTION_FAILED</code> as there
   *   are no more ports or transports to attempt for reconnection.
   * @property {number} RECONNECTION_ATTEMPT Value <code>-4</code>
   *   The value of the failure state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection is attempting
   *   to reconnect with a new port or transport after the failure of attempts in
   *   <code>CONNECTION_FAILED</code> or <code>RECONNECTED_FAILED</code>.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.6
   */
  const SOCKET_ERROR$1 = {
    CONNECTION_FAILED: 0,
    RECONNECTION_FAILED: -1,
    CONNECTION_ABORTED: -2,
    RECONNECTION_ABORTED: -3,
    RECONNECTION_ATTEMPT: -4,
  };

  /**
   * The list of {@link Skylink#joinRoom|joinRoom}  socket connection reconnection states.
   * @typedef SOCKET_FALLBACK
   * @property {String} NON_FALLBACK      Value <code>"nonfallback"</code>
   *   The value of the reconnection state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection is at its initial state
   *   without transitioning to any new socket port or transports yet.
   * @property {String} FALLBACK_PORT     Value <code>"fallbackPortNonSSL"</code>
   *   The value of the reconnection state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection is reconnecting with
   *   another new HTTP port using WebSocket transports to attempt to establish connection with Signaling server.
   * @property {String} FALLBACK_PORT_SSL Value <code>"fallbackPortSSL"</code>
   *   The value of the reconnection state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection is reconnecting with
   *   another new HTTPS port using WebSocket transports to attempt to establish connection with Signaling server.
   * @property {String} LONG_POLLING      Value <code>"fallbackLongPollingNonSSL"</code>
   *   The value of the reconnection state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection is reconnecting with
   *   another new HTTP port using Polling transports to attempt to establish connection with Signaling server.
   * @property {String} LONG_POLLING_SSL  Value <code>"fallbackLongPollingSSL"</code>
   *   The value of the reconnection state when <code>{@link Skylink#joinRoom|joinRoom} </code> socket connection is reconnecting with
   *   another new HTTPS port using Polling transports to attempt to establish connection with Signaling server.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.6
   */
  const SOCKET_FALLBACK = {
    NON_FALLBACK: 'nonfallback',
    FALLBACK_PORT: 'fallbackPortNonSSL',
    FALLBACK_SSL_PORT: 'fallbackPortSSL',
    LONG_POLLING: 'fallbackLongPollingNonSSL',
    LONG_POLLING_SSL: 'fallbackLongPollingSSL',
  };

  /**
   * <blockquote class="info">
   *   Note that this is used only for SDK developer purposes.<br>
   *   Current version: <code>2.1.0</code>
   * </blockquote>
   * The value of the current version of the Signaling socket message protocol.
   * @typedef SM_PROTOCOL_VERSION
   * @constant
   * @type string
   * @memberOf SkylinkConstants
   * @since 0.6.0
   */
  const SM_PROTOCOL_VERSION = '2.1.0';

  /**
   * <blockquote class="info">
   *   Note that if the video codec is not supported, the SDK will not configure the local <code>"offer"</code> or
   *   <code>"answer"</code> session description to prefer the codec.
   * </blockquote>
   * The list of available video codecs to set as the preferred video codec to use to encode
   * sending video data when available encoded video codec for Peer connections
   * configured in Skylink {@link initOptions}.
   * @typedef VIDEO_CODEC
   * @property {String} AUTO Value <code>"auto"</code>
   *   The value of the option to not prefer any video codec but rather use the created
   *   local <code>"offer"</code> / <code>"answer"</code> session description video codec preference.
   * @property {String} VP8  Value <code>"VP8"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/VP8">VP8</a> video codec.
   * @property {String} VP9  Value <code>"VP9"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/VP9">VP9</a> video codec.
   * @property {String} H264 Value <code>"H264"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC">H264</a> video codec.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.10
   * @private
   */
  const VIDEO_CODEC = {
    AUTO: 'auto',
    VP8: 'VP8',
    H264: 'H264',
    VP9: 'VP9',
  };

  /**
   * <blockquote class="info">
   *   Note that if the audio codec is not supported, the SDK will not configure the local <code>"offer"</code> or
   *   <code>"answer"</code> session description to prefer the codec.
   * </blockquote>
   * The list of available audio codecs to set as the preferred audio codec to use to encode
   * sending audio data when available encoded audio codec for Peer connections
   * configured in Skylink {@link initOptions}.
   * @typedef AUDIO_CODEC
   * @property {String} AUTO Value <code>"auto"</code>
   *   The value of the option to not prefer any audio codec but rather use the created
   *   local <code>"offer"</code> / <code>"answer"</code> session description audio codec preference.
   * @property {String} OPUS Value <code>"opus"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/Opus_(audio_format)">OPUS</a> audio codec.
   * @property {String} ISAC Value <code>"ISAC"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/Internet_Speech_Audio_Codec">ISAC</a> audio codec.
   * @property {String} ILBC Value <code>"ILBC"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/Internet_Low_Bitrate_Codec">iLBC</a> audio codec.
   * @property {String} G722 Value <code>"G722"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/G.722">G722</a> audio codec.
   * @property {String} PCMA Value <code>"PCMA"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/G.711">G711u</a> audio codec.
   * @property {String} PCMU Value <code>"PCMU"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/G.711">G711a</a> audio codec.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.10
   * @private
   */
  const AUDIO_CODEC = {
    AUTO: 'auto',
    ISAC: 'ISAC',
    OPUS: 'opus',
    ILBC: 'ILBC',
    G722: 'G722',
    PCMU: 'PCMU',
    PCMA: 'PCMA',
  };

  /**
   * The list of available screensharing media sources configured in the
   * {@link Skylink#shareScreen|shareScreen}.
   * @typedef MEDIA_SOURCE
   * @property {String} SCREEN Value <code>"screen"</code>
   *   The value of the option to share entire screen.
   * @property {String} WINDOW Value <code>"window"</code>
   *   The value of the option to share application windows.
   * @property {String} TAB Value <code>"tab"</code>
   *   The value of the option to share browser tab.
   *   Note that this is only supported by from Chrome 52+ and Opera 39+.
   * @property {String} TAB_AUDIO Value <code>"audio"</code>
   *   The value of the option to share browser tab audio.
   *   Note that this is only supported by Chrome 52+ and Opera 39+.
   *   <code>options.audio</code> has to be enabled with <code>TAB</code> also requested to enable sharing of tab audio.
   * @property {String} APPLICATION Value <code>"application"</code>
   *   The value of the option to share applications.
   *   Note that this is only supported by Firefox currently.
   * @property {String} BROWSER Value <code>"browser"</code>
   *   The value of the option to share browser.
   *   Note that this is only supported by Firefox currently, and requires toggling the <code>media.getUserMedia.browser.enabled</code>
   *   in <code>about:config</code>.
   * @property {String} CAMERA Value <code>"camera"</code>
   *   The value of the option to share camera.
   *   Note that this is only supported by Firefox currently.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.10
   */
  const MEDIA_SOURCE = {
    SCREEN: 'screen',
    WINDOW: 'window',
    TAB: 'tab',
    TAB_AUDIO: 'audio',
    APPLICATION: 'application',
    BROWSER: 'browser',
    CAMERA: 'camera',
  };

  /**
   * <blockquote class="info">
   *   Note that currently {@link Skylink#getUserMedia|getUserMedia} method only configures
   *   the maximum resolution of the Stream due to browser interopability and support.
   * </blockquote>
   * The list of <a href="https://en.wikipedia.org/wiki/Graphics_display_resolution#Video_Graphics_Array">
   * video resolutions</a> sets configured in the {@link Skylink#getUserMedia|getUserMedia} method.
   * @typedef VIDEO_RESOLUTION
   * @property {Object} QQVGA Value <code>{ width: 160, height: 120 }</code>
   *   The value of the option to configure QQVGA resolution.
   *   Aspect ratio: <code>4:3</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} HQVGA Value <code>{ width: 240, height: 160 }</code>
   *   The value of the option to configure HQVGA resolution.
   *   Aspect ratio: <code>3:2</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} QVGA Value <code>{ width: 320, height: 240 }</code>
   *   The value of the option to configure QVGA resolution.
   *   Aspect ratio: <code>4:3</code>
   * @property {Object} WQVGA Value <code>{ width: 384, height: 240 }</code>
   *   The value of the option to configure WQVGA resolution.
   *   Aspect ratio: <code>16:10</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} HVGA Value <code>{ width: 480, height: 320 }</code>
   *   The value of the option to configure HVGA resolution.
   *   Aspect ratio: <code>3:2</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} VGA Value <code>{ width: 640, height: 480 }</code>
   *   The value of the option to configure VGA resolution.
   *   Aspect ratio: <code>4:3</code>
   * @property {Object} WVGA Value <code>{ width: 768, height: 480 }</code>
   *   The value of the option to configure WVGA resolution.
   *   Aspect ratio: <code>16:10</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} FWVGA Value <code>{ width: 854, height: 480 }</code>
   *   The value of the option to configure FWVGA resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} SVGA Value <code>{ width: 800, height: 600 }</code>
   *   The value of the option to configure SVGA resolution.
   *   Aspect ratio: <code>4:3</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} DVGA Value <code>{ width: 960, height: 640 }</code>
   *   The value of the option to configure DVGA resolution.
   *   Aspect ratio: <code>3:2</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} WSVGA Value <code>{ width: 1024, height: 576 }</code>
   *   The value of the option to configure WSVGA resolution.
   *   Aspect ratio: <code>16:9</code>
   * @property {Object} HD Value <code>{ width: 1280, height: 720 }</code>
   *   The value of the option to configure HD resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on device supports.
   * @property {Object} HDPLUS Value <code>{ width: 1600, height: 900 }</code>
   *   The value of the option to configure HDPLUS resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} FHD Value <code>{ width: 1920, height: 1080 }</code>
   *   The value of the option to configure FHD resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on device supports.
   * @property {Object} QHD Value <code>{ width: 2560, height: 1440 }</code>
   *   The value of the option to configure QHD resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} WQXGAPLUS Value <code>{ width: 3200, height: 1800 }</code>
   *   The value of the option to configure WQXGAPLUS resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} UHD Value <code>{ width: 3840, height: 2160 }</code>
   *   The value of the option to configure UHD resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} UHDPLUS Value <code>{ width: 5120, height: 2880 }</code>
   *   The value of the option to configure UHDPLUS resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} FUHD Value <code>{ width: 7680, height: 4320 }</code>
   *   The value of the option to configure FUHD resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @property {Object} QUHD Value <code>{ width: 15360, height: 8640 }</code>
   *   The value of the option to configure QUHD resolution.
   *   Aspect ratio: <code>16:9</code>
   *   Note that configurating this resolution may not be supported depending on browser and device supports.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.6
   */
  const VIDEO_RESOLUTION = {
    QQVGA: { width: 160, height: 120 /* , aspectRatio: '4:3' */ },
    HQVGA: { width: 240, height: 160 /* , aspectRatio: '3:2' */ },
    QVGA: { width: 320, height: 240 /* , aspectRatio: '4:3' */ },
    WQVGA: { width: 384, height: 240 /* , aspectRatio: '16:10' */ },
    HVGA: { width: 480, height: 320 /* , aspectRatio: '3:2' */ },
    VGA: { width: 640, height: 480 /* , aspectRatio: '4:3' */ },
    WVGA: { width: 768, height: 480 /* , aspectRatio: '16:10' */ },
    FWVGA: { width: 854, height: 480 /* , aspectRatio: '16:9' */ },
    SVGA: { width: 800, height: 600 /* , aspectRatio: '4:3' */ },
    DVGA: { width: 960, height: 640 /* , aspectRatio: '3:2' */ },
    WSVGA: { width: 1024, height: 576 /* , aspectRatio: '16:9' */ },
    HD: { width: 1280, height: 720 /* , aspectRatio: '16:9' */ },
    HDPLUS: { width: 1600, height: 900 /* , aspectRatio: '16:9' */ },
    FHD: { width: 1920, height: 1080 /* , aspectRatio: '16:9' */ },
    QHD: { width: 2560, height: 1440 /* , aspectRatio: '16:9' */ },
    WQXGAPLUS: { width: 3200, height: 1800 /* , aspectRatio: '16:9' */ },
    UHD: { width: 3840, height: 2160 /* , aspectRatio: '16:9' */ },
    UHDPLUS: { width: 5120, height: 2880 /* , aspectRatio: '16:9' */ },
    FUHD: { width: 7680, height: 4320 /* , aspectRatio: '16:9' */ },
    QUHD: { width: 15360, height: 8640 /* , aspectRatio: '16:9' */ },
  };

  /**
   * The list of {@link Skylink#getUserMedia|getUserMedia} or
   * {@link Skylink#shareScreen|shareScreen} Stream fallback states.
   * @typedef MEDIA_ACCESS_FALLBACK_STATE
   * @property {Object} FALLBACKING Value <code>0</code>
   *   The value of the state when <code>{@link Skylink#getUserMedia|getUserMedia}</code> method will retrieve audio track only
   *   when retrieving audio and video tracks failed.
   *   This can be configured by Skylink {@link initOptions}
   *   <code>audioFallback</code> option.
   * @property {Object} FALLBACKED  Value <code>1</code>
   *   The value of the state when <code>{@link Skylink#getUserMedia|getUserMedia}</code> or <code>{@link Skylink#shareScreen|shareScreen}</code>
   *   method retrieves camera / screensharing Stream successfully but with missing originally required audio or video tracks.
   * @property {Object} ERROR       Value <code>-1</code>
   *   The value of the state when <code>{@link Skylink#getUserMedia|getUserMedia}</code> method failed to retrieve audio track only
   *   after retrieving audio and video tracks failed.
   * @readOnly
   * @constant
   * @type Object
   * @memberOf SkylinkConstants
   * @since 0.6.14
   */
  const MEDIA_ACCESS_FALLBACK_STATE = {
    FALLBACKING: 0,
    FALLBACKED: 1,
    ERROR: -1,
  };

  /**
   * The list of recording states.
   * @typedef RECORDING_STATE
   * @property {number} START Value <code>0</code>
   *   The value of the state when recording session has started.
   * @property {number} STOP Value <code>1</code>
   *   The value of the state when recording session has stopped.<br>
   *   At this stage, the recorded videos will go through the mixin server to compile the videos.
   * @property {number} LINK Value <code>2</code>
   *   The value of the state when recording session mixin request has been completed.
   * @property {number} ERROR Value <code>-1</code>
   *   The value of the state state when recording session has errors.
   *   This can happen during recording session or during mixin of recording videos,
   *   and at this stage, any current recording session or mixin is aborted.
   * @constant
   * @type Object
   * beta
   * @memberOf SkylinkConstants
   * @since 0.6.16
   */
  const RECORDING_STATE$1 = {
    START: 0,
    STOP: 1,
    LINK: 2,
    ERROR: -1,
  };

  /**
   * Stores the data chunk size for Blob transfers.
   * @typedef CHUNK_FILE_SIZE
   * @type Number
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.2
   * @ignore
   */
  const CHUNK_FILE_SIZE = 49152;

  /**
   * Stores the data chunk size for Blob transfers transferring from/to
   *   Firefox browsers due to limitation tested in the past in some PCs (linx predominatly).
   * @typedef MOZ_CHUNK_FILE_SIZE
   * @type Number
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.2
   * @ignore
   */
  const MOZ_CHUNK_FILE_SIZE = 12288;

  /**
   * Stores the data chunk size for binary Blob transfers.
   * @typedef BINARY_FILE_SIZE
   * @type Number
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.16
   * @ignore
   */
  const BINARY_FILE_SIZE = 65456;

  /**
   * Stores the data chunk size for binary Blob transfers.
   * @typedef MOZ_BINARY_FILE_SIZE
   * @type Number
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.16
   * @ignore
   */
  const MOZ_BINARY_FILE_SIZE = 16384;

  /**
   * Stores the data chunk size for data URI string transfers.
   * @typedef CHUNK_DATAURL_SIZE
   * @type Number
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.2
   * @ignore
   */
  const CHUNK_DATAURL_SIZE = 1212;

  /**
   * Stores the list of data transfer protocols.
   * @typedef DC_PROTOCOL_TYPE
   * @property {String} WRQ The protocol to initiate data transfer.
   * @property {String} ACK The protocol to request for data transfer chunk.
   *   Give <code>-1</code> to reject the request at the beginning and <code>0</code> to accept
   *   the data transfer request.
   * @property {String} CANCEL The protocol to terminate data transfer.
   * @property {String} ERROR The protocol when data transfer has errors and has to be terminated.
   * @property {String} MESSAGE The protocol that is used to send P2P messages.
   * @constant
   * @type Object
   * @readOnly
   * @private
   * @memberOf SkylinkConstants
   * @since 0.5.2
   * @ignore
   */
  const DC_PROTOCOL_TYPE = {
    WRQ: 'WRQ',
    ACK: 'ACK',
    ERROR: 'ERROR',
    CANCEL: 'CANCEL',
    MESSAGE: 'MESSAGE',
  };

  /**
   * Stores the list of socket messaging protocol types.
   * See confluence docs for the list based on the current <code>SM_PROTOCOL_VERSION</code>.
   * @typedef SIG_MESSAGE_TYPE
   * @property {String} JOIN_ROOM Value <code>joinRoom</code>
   * Message sent by peer to Signalling server to join the room.
   * @property {String} IN_ROOM Value <code>inRoom</code>
   * Message received by peer from Signalling server when peer successfully connects to the room.
   * @property {String} ENTER Value <code>enter</code>
   * Message sent by peer to all peers in the room (after <code>inRoom</code> message).
   * @property {String} WELCOME Value <code>welcome</code>
   * Message sent by peer in response to <code>enter</code> message.
   * @property {String} OFFER Value <code>offer</code>
   * Messsage sent by the peer with the higher weight to the targeted peer after the enter/welcome message.
   * Message is sent after the local offer is created and set, or after all its local ICE candidates have been gathered completely for non-trickle ICE connections (gathering process happens after the local offer is set).
   * The targeted peer will have to set the received remote offer, create and set the local answer and send to sender peer the <code>answer</code> message to end the offer/answer handshaking process.
   * @property {String} ANSWER Value <code>answer</code>
   * Message sent by the targeted peer with the lower weight back to the peer in response to <code>offer</code> message.
   * The peer will have to set the received remote answer, which ends the offer/answer handshaking process.
   * @property {String} CANDIDATE Value <code>candidate</code>
   * Message sent by peer to targeted peer when it has gathered a local ICE candidate.
   * @property {String} BYE Value <code>bye</code>
   * Message that is broadcast by Signalling server when a peer's socket connection has been disconnected. This happens when a peer leaves the room.
   * @property {String} REDIRECT Value <code>redirect</code>
   * Message received from Signalling server when a peer fails to connect to the room (after <code>joinRoom</code> message).
   * @property {String} UPDATE_USER Value <code>updateUserEvent</code>
   * Message that is broadcast by peer to all peers in the room when the peer's custom userData has changed.
   * @property {String} ROOM_LOCK Value <code>roomLockEvent</code>
   * Message that is broadcast by peer to all peers in the room to toggle the Signaling server Room lock status
   * @property {String} PUBLIC_MESSAGE Value <code>public</code>
   * Message sent by peer to all peers in the room as a public message.
   * @property {String} PRIVATE_MESSAGE Value <code>private</code>
   * Message sent to a targeted peer as a private message.
   * @property {String} STREAM Value <code>stream</code>
   * Message that is boradcast by peer to all peers in the room to indicate the sender peer's stream object status.
   * @property {String} GROUP Value <code>group</code>
   * Message that is boradcast by peer to all peers in the room for bundled messages that was sent before a second interval.
   * @property {String} GET_PEERS Value <code>getPeers</code>
   * Message sent by peer (connecting from a Privileged Key) to the Signaling server to retrieve a list of peer IDs in each room within the same App space (app keys that have the same parent app).
   * @property {String} PEER_LIST Value <code>peerList</code>
   * Message sent by Signalling server to the peer (connecting from a Privileged Key) containing the list of peer IDs.
   * @property {String} INTRODUCE Value <code>introduce</code>
   * Message sent by peer (connecting from a Privileged Key) to the Signaling server to introduce a peer to another peer in the same room. Peers can be a Privileged Key Peer or non-Privileged Key Peer.
   * @property {String} INTRODUCE_ERROR Value <code>introduceError</code>
   * Message sent by Signaling server to requestor peer (connecting from a Privileged Key) when introducing two peers fails.
   * @property {String} APPROACH Value <code>approach</code>
   * Message sent by Signaling server to the peer defined in the "sendingPeerId" in the <code>introduce</code> message.
   * @property {String} START_RECORDING Value <code>startRecordingRoom</code>
   * Message sent by peer to a peer (connecting from an MCU Key) to start recording session.
   * @property {String} STOP_RECORDING Value <code>stopRecordingRooms</code>
   * Message sent by peer to a peer (connecting from an MCU Key) to stop recording session.
   * @property {String} RECORDING Value <code>recordingEvent</code>
   * Message broadcasted by peer (connecting from an MCU Key) to all peers to indicate the status of the recording session.
   * @property {String} END_OF_CANDIDATES Value <code>endOfCandidates</code>
   * Message sent by peer to the targeted peer after all its local ICE candidates gathering has completed.
   * @property {String} MEDIA_INFO_EVENT Value <code>mediaStateChangeEvent</code>
   * Message sent by peer to all peers to communicate change of media state.
   * * @property {String} MESSAGE Value <code>message</code>
   * Message sent by peer to all peers in the room as either a public or a private message.
   * @property {String} GET_STORED_MESSAGES Value <code>getStoredMessages</code>
   * Message sent by peer to Signaling server to retrieve stored (persisted) messages.
   * @private
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.6
   */
  const SIG_MESSAGE_TYPE = {
    JOIN_ROOM: 'joinRoom',
    IN_ROOM: 'inRoom',
    ENTER: 'enter',
    WELCOME: 'welcome',
    OFFER: 'offer',
    ANSWER: 'answer',
    ANSWER_ACK: 'answerAck',
    CANDIDATE: 'candidate',
    BYE: 'bye',
    REDIRECT: 'redirect',
    UPDATE_USER: 'updateUserEvent',
    ROOM_LOCK: 'roomLockEvent',
    PUBLIC_MESSAGE: 'public',
    PRIVATE_MESSAGE: 'private',
    STREAM: 'stream',
    GROUP: 'group',
    GET_PEERS: 'getPeers',
    PEER_LIST: 'peerList',
    INTRODUCE: 'introduce',
    INTRODUCE_ERROR: 'introduceError',
    APPROACH: 'approach',
    START_RECORDING: 'startRecordingRoom',
    STOP_RECORDING: 'stopRecordingRoom',
    RECORDING: 'recordingEvent',
    END_OF_CANDIDATES: 'endOfCandidates',
    START_SCREENSHARE: 'startScreenshare',
    START_RTMP: 'startRTMP',
    STOP_RTMP: 'stopRTMP',
    RTMP: 'rtmpEvent',
    MEDIA_INFO_EVENT: 'mediaInfoEvent',
    MESSAGE: 'message',
    GET_STORED_MESSAGES: 'getStoredMessages',
    STORED_MESSAGES: 'storedMessages',
    RESTART: 'restart',
  };

  const STREAM_STATUS = {
    ENDED: 'ended',
  };

  /**
   * Stores the list of socket messaging protocol types to queue when sent less than a second interval.
   * @typedef GROUP_MESSAGE_LIST
   * @type Array
   * @readOnly
   * @private
   * @memberOf SkylinkConstants
   * @since 0.5.10
   */
  const GROUP_MESSAGE_LIST = [
    SIG_MESSAGE_TYPE.STREAM,
    SIG_MESSAGE_TYPE.UPDATE_USER,
    SIG_MESSAGE_TYPE.PUBLIC_MESSAGE,
  ];

  /**
   * The options available for video and audio bitrates (kbps) quality.
   * @typedef VIDEO_QUALITY
   * @property {Object} HD Value <code>{ video: 3200, audio: 80 }</code>
   *   The value of option to prefer high definition video and audio bitrates.
   * @property {Object} HQ Value <code>{ video: 1200, audio: 50 }</code>
   *   The value of option to prefer high quality video and audio bitrates.
   * @property {Object} SQ Value <code>{ video: 800, audio: 30 }</code>
   *   The value of option to prefer standard quality video and audio bitrates.
   * @property {Object} LQ Value <code>{ video: 500, audio: 20 }</code>
   *   The value of option to prefer low quality video and audio bitrates.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.32
   */
  const VIDEO_QUALITY = {
    HD: { video: 3200, audio: 150 },
    HQ: { video: 1200, audio: 80 },
    SQ: { video: 800, audio: 30 },
    LQ: { video: 400, audio: 20 },
  };

  /**
   * The options available for SDP sematics while create a PeerConnection.
   * @typedef SDP_SEMANTICS
   * @property {String} PLAN_B
   *   The value of option to prefer plan-b sdp.
   * @property {String} UNIFIED
   *   The value of option to prefer unified-plan sdp.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.32
   */
  const SDP_SEMANTICS = {
    PLAN_B: 'plan-b',
    UNIFIED: 'unified-plan',
  };

  /**
   * The list of RTMP states.
   * @typedef RTMP_STATE
   * @property {number} START Value <code>0</code>
   *   The value of the state when live streaming session has started.
   * @property {number} STOP Value <code>1</code>
   *   The value of the state when live streaming session has stopped.<br>
   *   At this stage, the recorded videos will go through the mixin server to compile the videos.
   * @property {number} ERROR Value <code>-1</code>
   *   The value of the state state when live streaming session has errors.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.34
   */
  const RTMP_STATE$1 = {
    START: 0,
    STOP: 1,
    ERROR: -1,
  };

  /**
   * The status of media on the stream.
   * @typedef MEDIA_STATUS
   * @property {number} MUTED <small>Value <code>0</code></small>
   * The media is present in the stream and muted
   * @property {number} ACTIVE <small>Value <code>1</code></small>
   * The media is present in the stream and active
   * @property {number} UNAVAILABLE <small>Value <code>-1</code></small>
   * The media is not present in the stream
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 1.0
   */
  const MEDIA_STATUS = {
    MUTED: 0,
    ACTIVE: 1,
    UNAVAILABLE: -1,
  };

  /**
   * The logging tags.
   * @typedef TAGS
   * @property {String} STATS_MODULE
   * @property {String} SESSION_DESCRIPTION
   * @property {String} PEER_CONNECTION
   * @property {String} CANDIDATE_HANDLER
   * @property {String} SIG_SERVER
   * @property {String} PEER_MEDIA
   * @property {String} PEER_INFORMATION
   * @property {String} MEDIA_STREAM
   * @constant
   * @private
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const TAGS = {
    SKYLINK_EVENT: 'SKYLINK EVENT',
    SKYLINK_ERROR: 'SKYLINK ERROR',
    STATS_MODULE: 'RTCStatsReport',
    SESSION_DESCRIPTION: 'RTCSessionDescription',
    PEER_CONNECTION: 'RTCPeerConnection',
    CANDIDATE_HANDLER: 'RTCIceCandidate',
    DATA_CHANNEL: 'RTCDataChannel',
    SIG_SERVER: 'SIG SERVER',
    PEER_MEDIA: 'PEER MEDIA',
    PEER_INFORMATION: 'PEER INFORMATION',
    ROOM: 'ROOM',
    RECORDING: 'RECORDING',
    MEDIA_STREAM: 'MEDIA STREAM',
    MESSAGING: 'MESSAGING',
    ASYNC_MESSAGING: 'ASYNC MESSAGING',
    ENCRYPTED_MESSAGING: 'ENCRYPTED MESSAGING',
    STATS: 'STATS',
  };

  /**
   * The list of media types.
   * @typedef MEDIA_TYPE
   * @property {String} AUDIO_MIC - Audio from a microphone.
   * @property {String} VIDEO_CAMERA - Video from a Camera of any type.
   * @property {String} VIDEO_SCREEN - Video of the Screen captured for screen sharing.
   * @property {String} VIDEO_OTHER - Video from source other than Camera.
   * @property {String} AUDIO - Audio from an unspecified MediaType.
   * @property {String} VIDEO - Video from an unspecified MediaType.
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const MEDIA_TYPE = {
    AUDIO_MIC: 'audioMic',
    VIDEO_CAMERA: 'videoCamera',
    VIDEO_SCREEN: 'videoScreen',
    VIDEO_OTHER: 'videoOther',
    AUDIO: 'audio',
    VIDEO: 'video',
  };

  /**
   * The ready state of the track.
   * @typedef TRACK_READY_STATE
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const TRACK_READY_STATE = {
    LIVE: 'live',
    ENDED: 'ended',
  };

  /**
   * The track kind.
   * @typedef TRACK_KIND
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const TRACK_KIND = {
    AUDIO: 'audio',
    VIDEO: 'video',
  };

  /**
   * The state of the media.
   * @typedef MEDIA_STATE
   * @property {String} MUTED - The state when the MediaTrack enabled flag is set to false. The MediaTrack is sending black frames.
   * @property {String} ACTIVE - The state when the MediaTrack enabled flag and active flag is set to true. The MediaTrack is sending frames with content.
   * @property {String} STOPPED - The state when the MediaTrack active flag is false. The MediaTrack is not sending any frames.
   * @property {String} UNAVAILABLE - The state when the MediaTrack is no longer available or has been disposed.
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const MEDIA_STATE = {
    MUTED: 'muted',
    ACTIVE: 'active',
    STOPPED: 'stopped',
    UNAVAILABLE: 'unavailable',
  };

  /**
   * Media Info keys.
   * @typedef MEDIA_INFO
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const MEDIA_INFO = {
    PUBLISHER_ID: 'publisherId',
    MEDIA_ID: 'mediaId',
    MEDIA_TYPE: 'mediaType',
    MEDIA_STATE: 'mediaState',
    TRANSCEIVER_MID: 'transceiverMid',
    MEDIA_META_DATA: 'mediaMetaData',
    SIMULCAST: 'simulcast',
    STREAM_ID: 'streamId',
  };

  /**
   * The SDK version.
   * @typedef SDK_VERSION
   * @type {String}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  // eslint-disable-next-line no-undef
  const SDK_VERSION = __sdkVersion__;

  /**
   * The SDK type.
   * @typedef SDK_NAME
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const SDK_NAME = {
    WEB: 'Web SDK',
    ANDROID: 'Android SDK',
    IOS: 'iOS SDK',
    CPP: 'C++ SDK',
  };

  /**
   * The API version.
   * @typedef API_VERSION
   * @type {String}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const API_VERSION = '9.0.0';

  /**
   * select Signaling server version.
   * @typedef Signaling_version
   * @type {String}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const SIGNALING_VERSION = 'sig-v2';

  /**
   * The Browser agent type.
   * @typedef BROWSER_AGENT
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const BROWSER_AGENT = {
    CHROME: 'chrome',
    FIREFOX: 'firefox',
    SAFARI: 'safari',
    REACT_NATIVE: 'react-native',
  };

  /**
   * The Peer type.
   * @typedef PEER_TYPE
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const PEER_TYPE = {
    MCU: 'MCU',
  };

  /**
   * Events dispatched by Socket.io.
   * @typedef SOCKET_EVENTS
   * @type {Object}
   * @private
   * @constant
   * @readonly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    RECONNECT_ATTEMPT: 'reconnect_attempt',
    RECONNECT_SUCCESS: 'reconnect_success',
    RECONNECT_FAILED: 'reconnect_failed',
    RECONNECT_ERROR: 'reconnect_error',
    MESSAGE: 'message',
    ERROR: 'error',
  };

  /**
   * Socket types
   * @typedef SOCKET_TYPE
   * @type {Object}
   * @private
   * @constant
   * @readonly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const SOCKET_TYPE = {
    POLLING: 'Polling',
    WEBSOCKET: 'WebSocket',
    XHR_POLLING: 'xhr-polling',
    JSONP_POLLING: 'jsonp-polling',
  };

  /**
   * The state of the SDK.
   * @typedef STATES
   * @type {Object}
   * @private
   * @constant
   * @readonly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const STATES = {
    SIGNALING: SOCKET_EVENTS,
  };

  const EVENTS = SkylinkEventsConstants;

  var SkylinkConstants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DATA_CHANNEL_STATE: DATA_CHANNEL_STATE$1,
    DATA_CHANNEL_TYPE: DATA_CHANNEL_TYPE,
    DATA_CHANNEL_MESSAGE_ERROR: DATA_CHANNEL_MESSAGE_ERROR,
    DATA_TRANSFER_DATA_TYPE: DATA_TRANSFER_DATA_TYPE,
    DT_PROTOCOL_VERSION: DT_PROTOCOL_VERSION,
    DATA_TRANSFER_TYPE: DATA_TRANSFER_TYPE,
    DATA_TRANSFER_SESSION_TYPE: DATA_TRANSFER_SESSION_TYPE,
    DATA_TRANSFER_STATE: DATA_TRANSFER_STATE$1,
    AUTH_STATE: AUTH_STATE,
    DATA_STREAM_STATE: DATA_STREAM_STATE$1,
    CANDIDATE_GENERATION_STATE: CANDIDATE_GENERATION_STATE$1,
    CANDIDATE_PROCESSING_STATE: CANDIDATE_PROCESSING_STATE$1,
    ICE_CONNECTION_STATE: ICE_CONNECTION_STATE$1,
    TURN_TRANSPORT: TURN_TRANSPORT,
    PEER_CONNECTION_STATE: PEER_CONNECTION_STATE$1,
    GET_CONNECTION_STATUS_STATE: GET_CONNECTION_STATUS_STATE,
    SERVER_PEER_TYPE: SERVER_PEER_TYPE,
    BUNDLE_POLICY: BUNDLE_POLICY,
    RTCP_MUX_POLICY: RTCP_MUX_POLICY,
    PEER_CERTIFICATE: PEER_CERTIFICATE,
    HANDSHAKE_PROGRESS: HANDSHAKE_PROGRESS$1,
    GET_PEERS_STATE: GET_PEERS_STATE,
    INTRODUCE_STATE: INTRODUCE_STATE,
    SYSTEM_ACTION: SYSTEM_ACTION$1,
    SYSTEM_ACTION_REASON: SYSTEM_ACTION_REASON,
    READY_STATE_CHANGE: READY_STATE_CHANGE$1,
    READY_STATE_CHANGE_ERROR: READY_STATE_CHANGE_ERROR,
    REGIONAL_SERVER: REGIONAL_SERVER,
    LOG_LEVEL: LOG_LEVEL,
    SOCKET_ERROR: SOCKET_ERROR$1,
    SOCKET_FALLBACK: SOCKET_FALLBACK,
    SM_PROTOCOL_VERSION: SM_PROTOCOL_VERSION,
    VIDEO_CODEC: VIDEO_CODEC,
    AUDIO_CODEC: AUDIO_CODEC,
    MEDIA_SOURCE: MEDIA_SOURCE,
    VIDEO_RESOLUTION: VIDEO_RESOLUTION,
    MEDIA_ACCESS_FALLBACK_STATE: MEDIA_ACCESS_FALLBACK_STATE,
    RECORDING_STATE: RECORDING_STATE$1,
    CHUNK_FILE_SIZE: CHUNK_FILE_SIZE,
    MOZ_CHUNK_FILE_SIZE: MOZ_CHUNK_FILE_SIZE,
    BINARY_FILE_SIZE: BINARY_FILE_SIZE,
    MOZ_BINARY_FILE_SIZE: MOZ_BINARY_FILE_SIZE,
    CHUNK_DATAURL_SIZE: CHUNK_DATAURL_SIZE,
    DC_PROTOCOL_TYPE: DC_PROTOCOL_TYPE,
    SIG_MESSAGE_TYPE: SIG_MESSAGE_TYPE,
    STREAM_STATUS: STREAM_STATUS,
    GROUP_MESSAGE_LIST: GROUP_MESSAGE_LIST,
    VIDEO_QUALITY: VIDEO_QUALITY,
    SDP_SEMANTICS: SDP_SEMANTICS,
    RTMP_STATE: RTMP_STATE$1,
    MEDIA_STATUS: MEDIA_STATUS,
    TAGS: TAGS,
    MEDIA_TYPE: MEDIA_TYPE,
    TRACK_READY_STATE: TRACK_READY_STATE,
    TRACK_KIND: TRACK_KIND,
    MEDIA_STATE: MEDIA_STATE,
    MEDIA_INFO: MEDIA_INFO,
    SDK_VERSION: SDK_VERSION,
    SDK_NAME: SDK_NAME,
    API_VERSION: API_VERSION,
    SIGNALING_VERSION: SIGNALING_VERSION,
    BROWSER_AGENT: BROWSER_AGENT,
    PEER_TYPE: PEER_TYPE,
    SOCKET_EVENTS: SOCKET_EVENTS,
    SOCKET_TYPE: SOCKET_TYPE,
    STATES: STATES,
    EVENTS: EVENTS
  });

  const MESSAGES = {
    INIT: {
      ERRORS: {
        NO_ADAPTER: 'AdapterJS dependency is not loaded or incorrect AdapterJS dependency is used',
        NO_SOCKET_IO: 'Socket.io not loaded - Please load socket.io',
        NO_FETCH_SUPPORT: 'Fetch API is not supported in your browser. Please make sure you are using a modern browser: https://caniuse.com/#search=fetch',
        NO_APP_KEY: 'Please provide an App Key - Get one at console.temasys.io!',
        AUTH_CORS: 'Promise rejected due to CORS forbidden request - Please visit: http://support.temasys.com.sg/support/solutions/articles/12000006761-i-get-a-403-forbidden-access-is-denied-when-i-load-the-application-why-',
        AUTH_GENERAL: 'Promise rejected due to network issue',
        SOCKET_CREATE_FAILED: 'Failed creating socket connection object ->',
        SOCKET_ERROR_ABORT: 'Reconnection aborted as the connection timed out or there no more available ports, transports and final attempts left',
      },
      INCOMPATIBLE_BROWSER: 'Incompatible browser agent detected',
      INFO: {
        API_SUCCESS: 'Promise resolved: APP Authenticated Successfully!',
      },
    },
    SOCKET: {
      ABORT_RECONNECT: 'Aborting socket reconnect',
    },
    JOIN_ROOM: {
      ERRORS: {
        CODEC_SUPPORT: 'No audio/video codecs available to start connection',
      },
    },
    ROOM: {
      ERRORS: {
        STOP: {
          SCREEN_SHARE: 'Error stopping screenshare',
        },
        NOT_IN_ROOM: 'User is not in room',
        NO_PEERS: 'No peers in room',
      },
      LEAVE_ROOM: {
        ERROR: 'Leave room error -->',
        NO_PEERS: 'No peers in room',
        DROPPING_HANGUP: 'Dropping hang-up from remote peer',
        LEAVE_ALL_ROOMS: {
          SUCCESS: 'Successfully left all rooms',
          ERROR: 'Leave all rooms error -->',
        },
        PEER_LEFT: {
          START: 'Initiating peer left process',
          SUCCESS: 'Successfully completed peer left process',
          ERROR: 'Failed peer left process',
        },
        SENDING_BYE: 'Sending bye message to all peers',
        DISCONNECT_SOCKET: {
          SUCCESS: 'Successfully disconnected socket',
        },
        REMOVE_STATE: {
          SUCCESS: 'Successfully removed room state',
        },
      },
    },
    ROOM_STATE: {
      NOT_FOUND: 'Could not retrieve room state for room name/key',
      LEFT: 'Peer left room',
      NO_ROOM_NAME: 'No room name specified',
    },
    PEER_INFORMATIONS: {
      NO_PEER_INFO: 'Not able to retrieve Peer Information for peerId:',
      UPDATE_USER_DATA: 'Peer updated userData: ',
      OUTDATED_MSG: 'Dropping outdated status ->',
      USER_DATA_NOT_JSON: 'UserData is not JSON',
      SET_PEER_PRIORITY_WEIGHT: 'Setting peerPriorityWeight with tiebreaker value from inRoom signalling message',
    },
    PEER_CONNECTION: {
      NOT_INITIALISED: 'Peer Connection not initialised',
      CREATE_NEW: 'Creating new Peer Connection',
      NO_PEER_CONNECTION: 'No Peer Connection detected',
      PEER_ID_NOT_FOUND: 'Peer Id not found',
      STATE_CHANGE: 'Peer connection state changed ->',
      STATS_API_UNAVAILABLE: 'getStats() API is not available',
      MCU: 'MCU connected',
      FAILED_STATE: 'Peer Connection state: failed',
      ADD_TRANSCEIVER: 'Adding empty transceiver',
      ERRORS: {
        REMOVE_TRACK: 'Error removing track from peer connection',
        NOT_FOUND: 'Peer Connection not found',
      },
      REFRESH_CONNECTION: {
        START: 'Refreshing peer connections',
        SUCCESS: 'Peer Connection refreshed successfully',
        FAILED: 'Peer Connection failed to refresh',
        COMPLETED: 'All Peer Connections refreshed with resolve or errors',
        RESTART_ICE_UNAVAILABLE: 'Dropping iceRestart option as it is not available on the peer connection',
        NOT_SUPPORTED: 'Refresh connection not supported by browser',
        SEND_RESTART_OFFER: 'Sending restart offer message to signaling server',
        NO_LOCAL_DESCRIPTION: 'No localDescription set to connection. There could be a handshaking step error.',
      },
    },
    PEER_PRIVILEGED: {
      not_privileged: 'Please upgrade your key to privileged to use this function',
      no_appkey: 'App key is not defined - Please authenticate again',
      getPeerListFromServer: 'Enquired server for peers within the App space',
    },
    ICE_CONNECTION: {
      END_OF_CANDIDATES_SUCCESS: 'Signaling of end-of-candidates remote ICE gathering',
      END_OF_CANDIDATES_FAILURE: 'Failed signaling of end-of-candidates remote ICE gathering',
      ICE_GATHERING_STARTED: 'ICE gathering has started',
      ICE_GATHERING_COMPLETED: 'ICE gathering has completed',
      DROP_EOC: 'Dropping of sending ICE candidate end-of-candidates signal or unused ICE candidates ->',
      STATE_CHANGE: 'Ice connection state changed ->',
    },
    ICE_CANDIDATE: {
      DROPPING_CANDIDATE: 'Dropping ICE candidate',
      INVALID_CANDIDATE: 'Received invalid ICE candidate message ->',
      VALID_CANDIDATE: 'Received ICE candidate ->',
      FILTERED_CANDIDATE: 'Dropping received ICE candidate as it matches ICE candidate filtering flag ->',
      FILTERING_FLAG_NOT_HONOURED: 'Not dropping received ICE candidate as TURN connections are enforced as MCU is present (and act as a TURN itself) so filtering of ICE candidate flags are not honoured ->',
      CANDIDATE_ADDED: 'Added ICE candidate successfully',
      ADDING_CANDIDATE: 'Adding ICE Candidate',
      FAILED_ADDING_CANDIDATE: 'Failed adding ICE candidate ->',
      ADD_BUFFERED_CANDIDATE: 'Adding buffered ICE candidate',
      ADD_CANDIDATE_TO_BUFFER: 'Adding ICE candidate to buffer',
      CANDIDATE_GENERATED: 'Generated ICE candidate ->',
      SENDING_CANDIDATE: 'Sending ICE candidate ->',
    },
    SESSION_DESCRIPTION: {
      parsing_media_ssrc: 'Parsing session description media SSRCs ->',
    },
    DATA_CHANNEL: {
      reviving_dataChannel: 'Reviving Datachannel connection',
      refresh_error: 'Not a valid Datachannel connection',
      CLOSING: 'Closing DataChannel',
      closed: 'Datachannel has closed',
      onclose_error: 'Error in data-channel onclose callback',
      NO_REMOTE_DATA_CHANNEL: 'Remote peer does not have data channel',
      ERRORS: {
        FAILED_CLOSING: 'Failed closing DataChannels --> ',
        NO_SESSIONS: 'Peer Connection does not have DataChannel sessions',
      },
    },
    NEGOTIATION_PROGRESS: {
      SET_LOCAL_DESCRIPTION: 'Successfully set local description -->',
      SET_REMOTE_DESCRIPTION: 'Successfully set remote description -->',
      APPLYING_BUFFERED_REMOTE_OFFER: 'Applying buffered remote offer',
      ERRORS: {
        FAILED_SET_LOCAL_DESCRIPTION: 'Failed setting local description -->',
        FAILED_SET_REMOTE_DESCRIPTION: 'Failed setting remote description',
        FAILED_SET_REMOTE_ANSWER: 'Peer failed to set remote answer.',
        FAILED_RENEGOTIATION: 'Failed renegotiation after answerAck',
        NOT_STABLE: 'Dropping of message as signaling state is not stable',
        PROCESSING_EXISTING_SDP: 'Dropping message as there is another sessionDescription being processed -->',
        OFFER_TIEBREAKER: 'Dropping the received offer: self weight is greater than incoming offer weight -->',
        NO_LOCAL_BUFFERED_OFFER: 'FATAL: No buffered local offer found - Unable to setLocalDescription',
        ADDING_REMOTE_OFFER_TO_BUFFER: 'Adding remote offer received to buffer as current negotiation has not completed',
      },
    },
    SIGNALING: {
      MESSAGE_ADDED_TO_BUFFER: 'Message buffered as enter message has not been sent',
      ENTER_LISTENER: 'Enter listener initialized',
      BUFFERED_MESSAGES_SENT: 'Buffered messages sent',
      BUFFERED_MESSAGES_DROPPED: 'Buffered messages dropped - no mid',
      OUTDATED_MSG: 'Dropping outdated status ->',
      DROPPING_MUTE_EVENT: 'Dropping mute audio / video event message as it is processed by mediaInfoEvent',
      BUFFER_NOT_NEEDED: 'Enter message sent. Messages do not need to be buffered',
      ABORTING_OFFER: 'Aborting offer as current negotiation has not completed',
    },
    MESSAGING: {
      PRIVATE_MESSAGE: 'Sending private message to Peer',
      BROADCAST_MESSAGE: 'Broadcasting message to Peers',
      RECEIVED_MESSAGE: 'Received message from Peer',
      PERSISTENCE: {
        SEND_MESSAGE: 'Sending persisted message',
        NOT_PERSISTED: 'Message will not be persisted as persistent flag is set to false',
        STORED_MESSAGES: 'Received stored messages for room',
        IS_PERSISTENT_CONFIG: 'Persistent message flag is set to',
        ERRORS: {
          FAILED_SETTING_PERSISTENCE: 'Failed setting persistent message flag',
          INVALID_TYPE: 'Persistent message flag must be of type boolean',
          PRIVATE_MESSAGE: 'Cannot persist private messages',
          PERSISTENT_MESSAGE_FEATURE_NOT_ENABLED: 'Persistent Message feature is not enabled. Enable'
            + ' this feature on the key under \'Advanced Settings\' in the Temasys Console',
        },
      },
      ENCRYPTION: {
        SEND_MESSAGE: 'Sending encrypted message',
        DELETE_ALL: 'Deleting all stored secrets',
        ERRORS: {
          FAILED_DECRYPTING_MESSAGE: 'Failed decrypting message',
          ENCRYPT_SECRET: 'Incorrect secret provided',
          INVALID_SECRETS: 'No or invalid secret and secret id provided',
          SET_SELECTED_SECRET: 'Failed setting selected secret',
          DELETE_ENCRYPT_SECRETS: 'Failed deleting secret',
          SET_ENCRYPT_SECRET: 'Failed setting secret',
          SECRET_ID_NOT_FOUND: 'Secret id not found',
          NO_SECRET_OR_SECRET_ID: 'Secret and / or secret id not provided',
          INVALID_TYPE: 'Secret and secret id must be of type string and not empty',
          SECRET_ID_NOT_UNIQUE: 'Secret id provided is not unique',
          SECRET_ID_NOT_SELECTED: 'Secret id not selected',
          SECRET_ID_NOT_PROVIDED: 'Secret id not provided',
          SECRETS_NOT_PROVIDED: 'Secrets not provided',
        },
      },
      ERRORS: {
        DROPPING_MESSAGE: 'Dropping message',
        FAILED_SENDING_MESSAGE: 'Failed to send user message',
      },
    },
    MEDIA_INFO: {
      UPDATE_SUCCESS: 'Successfully updated media info',
      ERRORS: {
        NO_ASSOCIATED_STREAM_ID: 'There is no streamId associated with the mediaId and transceiverMid pair',
        FAILED_PROCESSING_MEDIA_INFO_EVENT: 'Failed to process mediaInfoEvent message',
        FAILED_UPDATING: 'Failed to update media info',
        FAILED_PROCESSING_PEER_MEDIA: 'Failed to process media info',
        FAILED_UPDATING_TRANSCEIVER_MID: 'Failed updating media info transceiverMid after setLocalDescription',
        FAILED_SETTING_PEER_MEDIA_INFO: 'Failed setting peer media at offer / answer',
        STREAM_ID_NOT_MATCHED: 'There is no mediaInfo associated with the streamId',
      },
      WARN: {
        READ_ONLY_VALUE: 'Attempting to change media info read only value: ',
        INVALID_MEDIA_TYPE: 'Invalid media info media type: ',
      },
      VIDEO_STATE_CHANGE: 'Peers\'s video state changed to ->',
      AUDIO_STATE_CHANGE: 'Peers\'s audio state changed to ->',
      VIDEO_SCREEN_STATE_CHANGE: 'Peers\'s video screen state changed to ->',
    },
    MEDIA_STREAM: {
      STOP_SETTINGS: 'Stopped streams with settings:',
      STOP_SUCCESS: 'Successfully stopped stream',
      REMOTE_TRACK_REMOVED: 'Remote MediaStreamTrack removed',
      START_FALLBACK: 'Fall back to retrieve audio only stream',
      NO_OPTIONS: 'No user media options provided',
      DEFAULT_OPTIONS: 'Using default options',
      FALLBACK_SUCCESS: 'Successfully retrieved audio fallback stream',
      START_SCREEN_SUCCESS: 'Successfully retrieved screen share stream',
      STOP_SCREEN_SUCCESS: 'Successfully stopped screen share stream',
      UPDATE_MUTED_SETTINGS: 'Updated stream muted setting',
      UPDATE_MEDIA_STATUS: 'Updated stream media status',
      AUDIO_MUTED: 'Peers\'s audio muted: ',
      VIDEO_MUTED: 'Peers\'s video muted: ',
      ERRORS: {
        STOP_SCREEN: 'Error stopping screen share stream',
        START_SCREEN: 'Error starting screen share stream',
        STOP_ADDED_STREAM: 'Error stopping added stream',
        STOP_USER_MEDIA: 'Error stopping user media',
        STOP_AUDIO_TRACK: 'Error stopping audio tracks in stream',
        STOP_VIDEO_TRACK: 'Error stopping video tracks in stream',
        STOP_MEDIA_TRACK: 'Error stopping MediaTrack',
        STOP_SCREEN_TRACK: 'Error stopping screen track in stream',
        DROPPING_ONREMOVETRACK: 'Dropping onremovetrack',
        NO_STREAM: 'No stream to process',
        INVALID_STREAM_ID: 'No stream detected with stream id',
        NO_USER_MEDIA_STREAMS: 'No user media streams detected',
        INVALID_STREAM_ID_TYPE: 'Stream id is not a string',
        NO_STREAM_ID: 'No stream id provided',
        PEER_SCREEN_ACTIVE: 'Peer has existing screen share',
        FALLBACK: 'Error retrieving fallback audio stream',
        INVALID_GUM_OPTIONS: 'Invalid user media options',
        INVALID_GDM_OPTIONS: 'Invalid display media options',
        GET_USER_MEDIA: 'Error retrieving stream from \'getUserMedia\' method',
        INVALID_MUTE_OPTIONS: 'Invalid muteStreams options provided',
        NO_STREAMS_MUTED: 'No streams to mute',
        SEND_STREAM: 'Error sending stream',
        INVALID_MEDIA_STREAM_ARRAY: 'Array is not of type MediaStream',
        ACTIVE_STREAMS: 'There are currently active streams being sent to remote peers. Please stop streams.',
        INVALID_PREFETCHED_STREAMS: 'Invalid prefetched streams provided',
      },
    },
    STATS_MODULE: {
      NOT_INITIATED: 'Stats Module is not initiated',
      STATS_DISCARDED: 'Stats report discarded as peer has left the room',
      ERRORS: {
        RETRIEVE_STATS_FAILED: 'Failed retrieving stats',
        POST_FAILED: 'Failed posting to stats api',
        PARSE_FAILED: 'Failed parsing stats report',
        STATS_IS_NULL: 'Stats object is null',
        INVALID_TRACK_KIND: 'Media kind is not audio or video',
      },
      HANDLE_ICE_GATHERING_STATS: {
        PROCESS_FAILED: 'process_failed',
        PROCESS_SUCCESS: 'process_success',
        PROCESSING: 'processing',
        DROPPED: 'dropped',
        BUFFERED: 'buffered',
      },
      HANDLE_NEGOTIATION_STATS: {
        OFFER: {
          create: 'create_offer',
          create_error: 'error_create_offer',
          set: 'set_offer',
          set_error: 'error_set_offer',
          offer: 'offer',
          dropped: 'dropped_offer',
        },
        ANSWER: {
          create: 'create_answer',
          create_error: 'error_create_answer',
          set: 'set_answer',
          set_error: 'error_set_ANSWER',
          answer: 'answer',
          dropped: 'dropped_answer',
        },
      },
      HANDLE_DATA_CHANNEL_STATS: {
        open: 'open',
        closed: 'closed',
        reconnecting: 'reconnecting',
      },
      HANDLE_CONNECTION_STATS: {},
      HANDLE_BANDWIDTH_STATS: {
        RETRIEVE_FAILED: 'Failed posting bandwidth stats: ',
        NO_STATE: 'No room state',
      },
      HANDLE_ICE_CONNECTION_STATS: {
        RETRIEVE_FAILED: 'Failed retrieving stats: ',
        SEND_FAILED: 'Failed sending ice connection stats: ',
      },
      HANDLE_RECORDING_STATS: {
        START: 'start',
        STOP: 'stop',
        REQUEST_START: 'request-start',
        REQUEST_STOP: 'request-stop',
        ERROR_NO_MCU_START: 'error-no-mcu-start',
        ERROR_NO_MCU_STOP: 'error-no-mcu-stop',
        ERROR_START_ACTIVE: 'error-start-when-active',
        ERROR_STOP_ACTIVE: 'error-stop-when-active',
        ERROR_MIN_STOP: 'error-min-stop',
        MCU_RECORDING_ERROR: 'mcu-recording-error',
      },
    },
    RECORDING: {
      START_SUCCESS: 'Started recording',
      STOP_SUCCESS: 'Stopped recording',
      START_FAILED: 'Failed to start recording',
      STOP_FAILED: 'Failed to stop recording',
      MIN_RECORDING_TIME_REACHED: '4 seconds has been recorded - Recording can be stopped now',
      ERRORS: {
        MCU_NOT_CONNECTED: 'MCU is not connected',
        EXISTING_RECORDING_IN_PROGRESS: 'There is an existing recording in-progress',
        NO_RECORDING_IN_PROGRESS: 'There is no existing recording in-progress',
        MIN_RECORDING_TIME: '4 seconds has not been recorded yet',
        STOP_ABRUPT: 'Recording stopped abruptly before 4 seconds',
        SESSION_EMPTY: 'Received request of "off" but the session is empty',
        MCU_RECORDING_ERROR: 'Recording error received from MCU',
      },
    },
    RTMP: {
      start_no_mcu: 'Unable to start RTMP session as MCU is not connected',
      stop_no_mcu: 'Unable to stop RTMP as MCU is not connected',
      start_no_stream_id: 'Unable to start RTMP Session stream id is missing',
      start_no_endpoint: 'Unable to start RTMP Session as Endpoint is missing',
      starting_rtmp: 'Starting RTMP Session',
      stopping_rtmp: 'Stopping RTMP Session',
      message_received_from_sig: 'Received RTMP Session message ->',
      stop_session_empty: 'Received request of "off" but the session is empty',
      stopped_success: 'Stopped RTMP Session',
      started_success: 'Started RTMP Session',
      error_session_empty: 'Received error but the session is empty ->',
      error_session: 'RTMP session failure ->',
      error_Session_abrupt: 'Stopped RTMP session abruptly',
    },
    PERSISTENT_MESSAGE: {
      ERRORS: {
        NO_DEPENDENCY: 'CryptoJS is not available',
      },
    },
    UTILS: {
      INVALID_BROWSER_AGENT: 'Invalid browser agent',
    },
    LOGGER: {
      EVENT_DISPATCHED: 'Event dispatched',
      EVENT_REGISTERED: 'Event successfully registered',
      EVENT_UNREGISTERED: 'Event successfully unregistered',
      EVENT_DISPATCH_ERROR: 'Error dispatching event',
      EVENT_REGISTER_ERROR: 'Error registering event',
      EVENT_UNREGISTER_ERROR: 'Error unregistering event',
      LOGS_NOT_STORED: 'Store logs feature is not enabled. Enable it via SkylinkLogger.setLevel(logLevel, storeLogs)',
      LOGS_CLEARED: 'Stored logs cleared',
      INVALID_CB: 'Dropping listener as it is not a function',
    },
    BROWSER_AGENT: {
      REACT_NATIVE: {
        ERRORS: {
          DROPPING_ONREMOVETRACK: 'Dropping onremovetrack as trackInfo is malformed',
        },
      },
    },
  };

  class SkylinkEventManager {
    constructor() {
      this.events = {};
      this.privateEvents = {};
    }

    addPrivateEventListener(eventName, callback) {
      this.addListener(eventName, callback, true);
    }

    addEventListener(eventName, callback) {
      this.addListener(eventName, callback, false);
    }

    addListener(eventName, callback, isPrivate) {
      try {
        const key = isPrivate ? 'privateEvents' : 'events';

        if (!isAFunction(callback)) {
          logger.log.DEBUG([null, TAGS.SKYLINK_EVENT, eventName, MESSAGES.LOGGER.INVALID_CB]);
          return;
        }

        if (!this[key][eventName]) {
          this[key][eventName] = {};
        }

        if (!this[key][eventName].callbacks) {
          this[key][eventName].callbacks = [];
        }

        this[key][eventName].callbacks.push(callback);

        if (!isPrivate) {
          logger.log.DEBUG([null, TAGS.SKYLINK_EVENT, eventName, MESSAGES.LOGGER.EVENT_REGISTERED]);
        }
      } catch (err) {
        logger.log.ERROR([null, TAGS.SKYLINK_EVENT, eventName, MESSAGES.LOGGER.EVENT_REGISTER_ERROR], err);
      }
    }

    dispatchEvent(evt) {
      if (evt.name === EVENTS.LOGGED_ON_CONSOLE) {
        return;
      }

      let allEventCallbacks = [];
      if (!this.events[evt.name]) {
        logger.log.DEBUG([null, TAGS.SKYLINK_EVENT, evt.name, MESSAGES.LOGGER.EVENT_DISPATCHED]);
      } else {
        const userCallbacks = this.events[evt.name].callbacks;
        allEventCallbacks = allEventCallbacks.concat(userCallbacks);
      }

      if (this.privateEvents[evt.name]) {
        const privateCallbacks = this.privateEvents[evt.name] ? this.privateEvents[evt.name].callbacks : [];
        allEventCallbacks = allEventCallbacks.concat(privateCallbacks);
      }

      allEventCallbacks.forEach((callback) => {
        try {
          callback(evt.detail);
        } catch (err) {
          logger.log.ERROR([null, TAGS.SKYLINK_EVENT, evt.name, MESSAGES.LOGGER.EVENT_DISPATCH_ERROR], err);
        }
      });
    }

    removeEventListener(eventName, callback) {
      this.removeListener(eventName, callback, false);
    }

    removePrivateEventListener(eventName, callback) {
      this.removeListener(eventName, callback, true);
    }

    removeListener(eventName, callback, isPrivate) {
      const key = isPrivate ? 'privateEvents' : 'events';

      if (!isPrivate && !(this.events[eventName] && this.events[eventName].callbacks)) {
        logger.log.WARN([null, TAGS.SKYLINK_EVENT, eventName, MESSAGES.LOGGER.EVENT_UNREGISTERED]);
        return;
      }

      try {
        this[key][eventName].callbacks.forEach((cb, i) => {
          if (cb === callback) {
            delete this[key][eventName].callbacks[i];

            if (!isPrivate) {
              logger.log.DEBUG([null, TAGS.SKYLINK_EVENT, eventName, MESSAGES.LOGGER.EVENT_UNREGISTERED]);
            }
          }
        });
      } catch (err) {
        logger.log.ERROR([null, TAGS.SKYLINK_EVENT, eventName, MESSAGES.LOGGER.EVENT_DISPATCH_ERROR], err);
      }
    }
  }

  const skylinkEventManager = new SkylinkEventManager();
  const addEventListener = skylinkEventManager.addPrivateEventListener.bind(skylinkEventManager);
  const removeEventListener = skylinkEventManager.removePrivateEventListener.bind(skylinkEventManager);
  const dispatchEvent = skylinkEventManager.dispatchEvent.bind(skylinkEventManager);

  const logMethods = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
  ];

  const LEVEL_STORAGE_KEY = 'loglevel:skylinkjs';

  const checkSupport = (methodName) => {
    let hasSupport = true;
    if (typeof console === 'undefined') {
      hasSupport = false;
    } else if (typeof console[methodName] === 'undefined') { // eslint-disable-line no-console
      hasSupport = false;
    }
    return hasSupport;
  };

  const getFormattedMessage = (message) => {
    let log = 'SkylinkJS -';
    if (Array.isArray(message)) {
      // fragment1 - peerId
      // fragment2 - tag
      // fragment3 - additional info / state
      const [fragment1, fragment2, fragment3, messageString] = message;
      log += fragment1 ? ` [${fragment1}]` : ' -';
      // eslint-disable-next-line no-nested-ternary
      log += fragment2 ? ` <<${fragment2}>>` : (fragment1 ? '' : ' <<Method>>');
      if (fragment3) {
        if (Array.isArray(fragment3)) {
          for (let i = 0; i < fragment3.length; i += 1) {
            log += ` (${fragment3[i]})`;
          }
        } else {
          log += ` (${fragment3})`;
        }
      }
      log += ` ${messageString}`;
    } else {
      log += ` ${message}`;
    }
    return log;
  };

  const logFn = (logger$1, level, message, debugObject = null) => {
    const datetime = `[${(new Date()).toISOString()}]`;
    const currentLevel = logger$1.level;
    const { logLevels } = logger$1;
    if (currentLevel <= level && currentLevel !== logLevels.SILENT) {
      const methodName = logMethods[level];
      const hasSupport = checkSupport(methodName);

      if (!hasSupport) {
        return;
      }

      const formattedMessage = getFormattedMessage(message);
      if (checkSupport(methodName)) {
        console[methodName](datetime, formattedMessage, debugObject || ''); // eslint-disable-line no-console
        dispatchEvent(loggedOnConsole({ level: methodName, message: formattedMessage, debugObject }));
      }

      if (logger.storeLogs) {
        const logItems = [datetime, methodName.toUpperCase(), formattedMessage];
        if (debugObject) {
          logItems.push(debugObject);
        }
        logger.storedLogs.push(logItems);
      }
    }
  };

  const persistLogLevel = (level) => {
    window.localStorage.setItem(LEVEL_STORAGE_KEY, level);
  };

  const getPersistedLevel = (logLevels) => {
    const level = window.localStorage.getItem(LEVEL_STORAGE_KEY);
    return level !== null && !Number.isNaN(+level) ? +level : logLevels.ERROR;
  };

  /**
   * @classdesc Class used for logging messages on the console. Exports a singleton logger object.
   * @class SkylinkLogger
   * @public
   * @example
   * import { SkylinkLogger } from 'skylinkjs';
   *
   * const skylinkLogger = new SkylinkLogger();
   */
  class SkylinkLogger {
    constructor() {
      /**
       * @description List of log levels.
       * @type {Object} logLevels
       * @property {number} TRACE - All logs.
       * @property {number} DEBUG
       * @property {number} INFO
       * @property {number} WARN
       * @property {number} ERROR
       * @property {number} SILENT - No logs.
       */
      this.logLevels = {
        TRACE: 0, // All Logs
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4, // Ideal level for Production Env.
        SILENT: 5, // No logging
      };

      this.level = getPersistedLevel(this.logLevels);

      /**
       * @description The flag that enables the store logs function.
       * @type {boolean}
       */
      this.storeLogs = false;

      /**
       * @description The stored logs when storeLogs flag is set to true.
       * @type {Array.<logItems>} The array of stored logs
       */
      this.storedLogs = [];
    }

    /**
     * @description Method that sets the log level.
     * @param {number} level - The log level to be set. REF: {@link SkylinkLogger#logLevels|logLevels}
     * @param {Boolean} storeLogs - The flag if logs should be stored.
     * @public
     * @example
     * skylinkLogger.setLogLevels(skylinkLogger.logLevels.TRACE);
     * @alias SkylinkLogger#setLevel
     */
    setLevel(level = this.levels.ERROR, storeLogs) {
      if (isANumber(level)) {
        this.level = level;
        persistLogLevel(this.level);
      } else {
        this.level = this.levels.ERROR;
      }

      if (storeLogs) {
        this.storeLogs = storeLogs;
      }
    }

    /**
     * @description Enables logging with highest level (TRACE).
     * @public
     * @alias SkylinkLogger#enableAll
     */
    enableAll() {
      this.setLevel(this.logLevels.TRACE);
    }

    /**
     * @description Disables all logging with lowest level (SILENT).
     * @public
     * @alias SkylinkLogger#disableAll
     */
    disableAll() {
      this.setLevel(this.logLevels.SILENT);
    }

    getLogs() {
      if (this.storeLogs) {
        return this.storedLogs;
      }

      this.log.WARN(MESSAGES.LOGGER.LOGS_NOT_STORED);
      return null;
    }

    clearLogs() {
      this.log.INFO(MESSAGES.LOGGER.LOGS_CLEARED);
      this.storedLogs = [];
    }
  }

  /**
   * @type {SkylinkLogger}
   * @private
   */
  const logger = new SkylinkLogger();

  /**
   * @description Method to trigger a log
   * @type {{TRACE: SkylinkLogger.log.TRACE, DEBUG: SkylinkLogger.log.DEBUG, INFO: SkylinkLogger.log.INFO, WARN: SkylinkLogger.log.WARN, ERROR: SkylinkLogger.log.ERROR}}
   * @private
   */
  SkylinkLogger.prototype.log = {
    TRACE: (...params) => {
      logFn(logger, logger.logLevels.TRACE, ...params);
    },
    DEBUG: (...params) => {
      logFn(logger, logger.logLevels.DEBUG, ...params);
    },
    INFO: (...params) => {
      logFn(logger, logger.logLevels.INFO, ...params);
    },
    WARN: (...params) => {
      logFn(logger, logger.logLevels.WARN, ...params);
    },
    ERROR: (...params) => {
      logFn(logger, logger.logLevels.ERROR, ...params);
    },
  };

  /**
   * @param {getUserMediaOptions} options
   * @param {SkylinkState} roomState
   * @return {SkylinkState}
   * @memberOf MediaStreamHelpers
   * @private
   */
  const parseMediaOptions = (options, roomState) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const mediaOptions = options || {};

    state.voiceActivityDetection = typeof mediaOptions.voiceActivityDetection === 'boolean' ? mediaOptions.voiceActivityDetection : true;

    if (mediaOptions.bandwidth) {
      if (typeof mediaOptions.bandwidth.audio === 'number') {
        state.streamsBandwidthSettings.bAS.audio = mediaOptions.bandwidth.audio;
      }

      if (typeof mediaOptions.bandwidth.video === 'number') {
        state.streamsBandwidthSettings.bAS.video = mediaOptions.bandwidth.video;
      }

      if (typeof mediaOptions.bandwidth.data === 'number') {
        state.streamsBandwidthSettings.bAS.data = mediaOptions.bandwidth.data;
      }
    }

    if (mediaOptions.autoBandwidthAdjustment) {
      state.bandwidthAdjuster = {
        interval: 10,
        limitAtPercentage: 100,
        useUploadBwOnly: false,
      };

      if (typeof mediaOptions.autoBandwidthAdjustment === 'object') {
        if (typeof mediaOptions.autoBandwidthAdjustment.interval === 'number' && mediaOptions.autoBandwidthAdjustment.interval >= 10) {
          state.bandwidthAdjuster.interval = mediaOptions.autoBandwidthAdjustment.interval;
        }
        if (typeof mediaOptions.autoBandwidthAdjustment.limitAtPercentage === 'number' && (mediaOptions.autoBandwidthAdjustment.limitAtPercentage >= 0 && mediaOptions.autoBandwidthAdjustment.limitAtPercentage <= 100)) {
          state.bandwidthAdjuster.limitAtPercentage = mediaOptions.autoBandwidthAdjustment.limitAtPercentage;
        }
        if (typeof mediaOptions.autoBandwidthAdjustment.useUploadBwOnly === 'boolean') {
          state.bandwidthAdjuster.useUploadBwOnly = mediaOptions.autoBandwidthAdjustment.useUploadBwOnly;
        }
      }
    }
    return state;
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var clone_1 = createCommonjsModule(function (module) {
  var clone = (function() {

  function _instanceof(obj, type) {
    return type != null && obj instanceof type;
  }

  var nativeMap;
  try {
    nativeMap = Map;
  } catch(_) {
    // maybe a reference error because no `Map`. Give it a dummy value that no
    // value will ever be an instanceof.
    nativeMap = function() {};
  }

  var nativeSet;
  try {
    nativeSet = Set;
  } catch(_) {
    nativeSet = function() {};
  }

  var nativePromise;
  try {
    nativePromise = Promise;
  } catch(_) {
    nativePromise = function() {};
  }

  /**
   * Clones (copies) an Object using deep copying.
   *
   * This function supports circular references by default, but if you are certain
   * there are no circular references in your object, you can save some CPU time
   * by calling clone(obj, false).
   *
   * Caution: if `circular` is false and `parent` contains circular references,
   * your program may enter an infinite loop and crash.
   *
   * @param `parent` - the object to be cloned
   * @param `circular` - set to true if the object to be cloned may contain
   *    circular references. (optional - true by default)
   * @param `depth` - set to a number if the object is only to be cloned to
   *    a particular depth. (optional - defaults to Infinity)
   * @param `prototype` - sets the prototype to be used when cloning an object.
   *    (optional - defaults to parent prototype).
   * @param `includeNonEnumerable` - set to true if the non-enumerable properties
   *    should be cloned as well. Non-enumerable properties on the prototype
   *    chain will be ignored. (optional - false by default)
  */
  function clone(parent, circular, depth, prototype, includeNonEnumerable) {
    if (typeof circular === 'object') {
      depth = circular.depth;
      prototype = circular.prototype;
      includeNonEnumerable = circular.includeNonEnumerable;
      circular = circular.circular;
    }
    // maintain two arrays for circular references, where corresponding parents
    // and children have the same index
    var allParents = [];
    var allChildren = [];

    var useBuffer = typeof Buffer != 'undefined';

    if (typeof circular == 'undefined')
      circular = true;

    if (typeof depth == 'undefined')
      depth = Infinity;

    // recurse this function so we don't reset allParents and allChildren
    function _clone(parent, depth) {
      // cloning null always returns null
      if (parent === null)
        return null;

      if (depth === 0)
        return parent;

      var child;
      var proto;
      if (typeof parent != 'object') {
        return parent;
      }

      if (_instanceof(parent, nativeMap)) {
        child = new nativeMap();
      } else if (_instanceof(parent, nativeSet)) {
        child = new nativeSet();
      } else if (_instanceof(parent, nativePromise)) {
        child = new nativePromise(function (resolve, reject) {
          parent.then(function(value) {
            resolve(_clone(value, depth - 1));
          }, function(err) {
            reject(_clone(err, depth - 1));
          });
        });
      } else if (clone.__isArray(parent)) {
        child = [];
      } else if (clone.__isRegExp(parent)) {
        child = new RegExp(parent.source, __getRegExpFlags(parent));
        if (parent.lastIndex) child.lastIndex = parent.lastIndex;
      } else if (clone.__isDate(parent)) {
        child = new Date(parent.getTime());
      } else if (useBuffer && Buffer.isBuffer(parent)) {
        if (Buffer.allocUnsafe) {
          // Node.js >= 4.5.0
          child = Buffer.allocUnsafe(parent.length);
        } else {
          // Older Node.js versions
          child = new Buffer(parent.length);
        }
        parent.copy(child);
        return child;
      } else if (_instanceof(parent, Error)) {
        child = Object.create(parent);
      } else {
        if (typeof prototype == 'undefined') {
          proto = Object.getPrototypeOf(parent);
          child = Object.create(proto);
        }
        else {
          child = Object.create(prototype);
          proto = prototype;
        }
      }

      if (circular) {
        var index = allParents.indexOf(parent);

        if (index != -1) {
          return allChildren[index];
        }
        allParents.push(parent);
        allChildren.push(child);
      }

      if (_instanceof(parent, nativeMap)) {
        parent.forEach(function(value, key) {
          var keyChild = _clone(key, depth - 1);
          var valueChild = _clone(value, depth - 1);
          child.set(keyChild, valueChild);
        });
      }
      if (_instanceof(parent, nativeSet)) {
        parent.forEach(function(value) {
          var entryChild = _clone(value, depth - 1);
          child.add(entryChild);
        });
      }

      for (var i in parent) {
        var attrs;
        if (proto) {
          attrs = Object.getOwnPropertyDescriptor(proto, i);
        }

        if (attrs && attrs.set == null) {
          continue;
        }
        child[i] = _clone(parent[i], depth - 1);
      }

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(parent);
        for (var i = 0; i < symbols.length; i++) {
          // Don't need to worry about cloning a symbol because it is a primitive,
          // like a number or string.
          var symbol = symbols[i];
          var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
          if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
            continue;
          }
          child[symbol] = _clone(parent[symbol], depth - 1);
          if (!descriptor.enumerable) {
            Object.defineProperty(child, symbol, {
              enumerable: false
            });
          }
        }
      }

      if (includeNonEnumerable) {
        var allPropertyNames = Object.getOwnPropertyNames(parent);
        for (var i = 0; i < allPropertyNames.length; i++) {
          var propertyName = allPropertyNames[i];
          var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
          if (descriptor && descriptor.enumerable) {
            continue;
          }
          child[propertyName] = _clone(parent[propertyName], depth - 1);
          Object.defineProperty(child, propertyName, {
            enumerable: false
          });
        }
      }

      return child;
    }

    return _clone(parent, depth);
  }

  /**
   * Simple flat clone using prototype, accepts only objects, usefull for property
   * override on FLAT configuration object (no nested props).
   *
   * USE WITH CAUTION! This may not behave as you wish if you do not know how this
   * works.
   */
  clone.clonePrototype = function clonePrototype(parent) {
    if (parent === null)
      return null;

    var c = function () {};
    c.prototype = parent;
    return new c();
  };

  // private utility functions

  function __objToStr(o) {
    return Object.prototype.toString.call(o);
  }
  clone.__objToStr = __objToStr;

  function __isDate(o) {
    return typeof o === 'object' && __objToStr(o) === '[object Date]';
  }
  clone.__isDate = __isDate;

  function __isArray(o) {
    return typeof o === 'object' && __objToStr(o) === '[object Array]';
  }
  clone.__isArray = __isArray;

  function __isRegExp(o) {
    return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
  }
  clone.__isRegExp = __isRegExp;

  function __getRegExpFlags(re) {
    var flags = '';
    if (re.global) flags += 'g';
    if (re.ignoreCase) flags += 'i';
    if (re.multiline) flags += 'm';
    return flags;
  }
  clone.__getRegExpFlags = __getRegExpFlags;

  return clone;
  })();

  if ( module.exports) {
    module.exports = clone;
  }
  });

  const SOCKET_DEFAULTS = {
    RECONNECTION_ATTEMPTS: {
      WEBSOCKET: 10,
      POLLING: 4,
    },
    RECONNECTION_DELAY_MAX: 5000,
    RECONNECTION_DELAY: 1000,
  };

  const SOCKET_CONFIG = options => ({
    forceNew: true,
    reconnection: false, // Ref: ESS-2024
    timeout: options.socketTimeout,
    path: options.socketServerPath,
    reconnectionAttempts: SOCKET_DEFAULTS.RECONNECTION_ATTEMPTS.WEBSOCKET,
    reconnectionDelayMax: SOCKET_DEFAULTS.RECONNECTION_DELAY_MAX,
    reconnectionDelay: SOCKET_DEFAULTS.RECONNECTION_DELAY,
    transports: [SOCKET_TYPE.WEBSOCKET.toLowerCase()],
    query: {
      Skylink_SDK_type: SDK_NAME.WEB,
      Skylink_SDK_version: SDK_VERSION,
      Skylink_API_version: API_VERSION,
      'X-Server-Select': SIGNALING_VERSION,
    },
    extraHeaders: {
      Skylink_SDK_type: SDK_NAME.WEB,
      Skylink_SDK_version: SDK_VERSION,
      Skylink_API_version: API_VERSION,
      'X-Server-Select': SIGNALING_VERSION,
    },
  });

  const CONFIGS = {
    SOCKET: SOCKET_CONFIG,
    PEER_CONNECTION: {
      bundlePolicy: BUNDLE_POLICY.BALANCED,
      rtcpMuxPolicy: RTCP_MUX_POLICY.REQUIRE,
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 0,
    },
  };

  const DEFAULTS = {
    SOCKET: SOCKET_DEFAULTS,
    MEDIA_OPTIONS: {
      AUDIO: {
        stereo: false,
        echoCancellation: true,
        exactConstraints: false,
      },
      VIDEO: {
        resolution: VIDEO_RESOLUTION.VGA,
        frameRate: 30,
        exactConstraints: false,
      },
      SCREENSHARE: {
        video: true,
      },
    },
  };

  const retrieveConfig = (name, options) => {
    if (options) {
      return CONFIGS[name](options);
    }

    return CONFIGS[name];
  };

  /* eslint-disable no-nested-ternary */

  const parseGumSettings = (settings, type) => {
    const gumSettings = {
      audio: false,
      video: false,
    };

    if ((settings.audio && !type) || (settings.audio && type === TRACK_KIND.AUDIO)) {
      if (settings.audio && isAObj(settings.audio)) {
        gumSettings.audio = {};
        gumSettings.audio.echoCancellation = true;

        if (isABoolean(settings.audio.echoCancellation)) {
          gumSettings.audio.echoCancellation = settings.audio.echoCancellation;
        }

        if (isAgent(BROWSER_AGENT.FIREFOX)) ; else if (settings.audio.deviceId && isAString(settings.audio.deviceId)) {
          gumSettings.audio.deviceId = settings.audio.exactConstraints
            ? { exact: settings.audio.deviceId } : { ideal: settings.audio.deviceId };
        }
      }
    }

    if ((settings.video && !type) || (settings.video && type === TRACK_KIND.VIDEO)) {
      if (settings.video && isAObj(settings.video)) {
        gumSettings.video = {};

        if (settings.video.deviceId && isAString(settings.video.deviceId)) {
          gumSettings.video.deviceId = settings.video.exactConstraints
            ? { exact: settings.video.deviceId } : { ideal: settings.video.deviceId };
        }

        gumSettings.video.width = isAObj(settings.video.resolution.width)
          ? settings.video.resolution.width : (settings.video.exactConstraints
            ? { exact: settings.video.resolution.width } : { max: settings.video.resolution.width });

        gumSettings.video.height = isAObj(settings.video.resolution.height)
          ? settings.video.resolution.height : (settings.video.exactConstraints
            ? { exact: settings.video.resolution.height } : { max: settings.video.resolution.height });

        if ((settings.video.frameRate && isAObj(settings.video.frameRate))
          || isANumber(settings.video.frameRate)) {
          gumSettings.video.frameRate = isAObj(settings.video.frameRate)
            ? settings.video.frameRate : (settings.video.exactConstraints
              ? { exact: settings.video.frameRate } : { max: settings.video.frameRate });
        }
      } else if (settings.video) {
        gumSettings.video = {
          width: settings.video.exactConstraints ? { exact: settings.video.resolution.width }
            : { max: settings.video.resolution.width },
          height: settings.video.exactConstraints ? { exact: settings.video.resolution.height }
            : { max: settings.video.resolution.height },
        };
      }
    }

    return gumSettings;
  };

  const parseSettings = (options, type = '') => {
    const settings = { audio: false, video: false };

    if ((options.audio && !type) || (options.audio && type === TRACK_KIND.AUDIO)) {
      settings.audio = clone_1(DEFAULTS.MEDIA_OPTIONS.AUDIO);

      if (isAObj(options.audio)) {
        if (isABoolean(options.audio.stereo)) {
          settings.audio.stereo = options.audio.stereo;
        }

        if (isABoolean(options.audio.echoCancellation)) {
          settings.audio.echoCancellation = options.audio.echoCancellation;
        }

        if (isAgent(BROWSER_AGENT.FIREFOX)) ; else if (options.audio.deviceId && isAString(options.audio.deviceId)) {
          settings.audio.deviceId = options.audio.deviceId;
        }

        if ((options.useExactConstraints && isABoolean(options.useExactConstraints))) {
          settings.audio.exactConstraints = options.useExactConstraints;
        }
      }
    }

    if ((options.video && !type) || (options.video && type === TRACK_KIND.VIDEO)) {
      settings.video = clone_1(DEFAULTS.MEDIA_OPTIONS.VIDEO);

      if (isAObj(options.video)) {
        if (options.video.deviceId && isAString(options.video.deviceId)) {
          settings.video.deviceId = options.video.deviceId;
        }

        if (options.video.resolution && isAObj(options.video.resolution)) {
          if ((options.video.resolution.width && isAString(options.video.resolution.width))
            || isANumber(options.video.resolution.width)) {
            settings.video.resolution.width = options.video.resolution.width;
          }
          if ((options.video.resolution.height && isAString(options.video.resolution.height))
            || isANumber(options.video.resolution.height)) {
            settings.video.resolution.height = options.video.resolution.height;
          }
        }

        if ((options.video.frameRate && isAString(options.video.frameRate))
          || isANumber(options.video.frameRate)) {
          settings.video.frameRate = options.video.frameRate;
        }

        if ((options.useExactConstraints && isABoolean(options.useExactConstraints))) {
          settings.video.exactConstraints = options.useExactConstraints;
        }
      }
    }

    return settings;
  };

  /**
   * Parse the options provided to make sure they are compatible
   * @param {getUserMediaOptions} options
   * @param {String} type - The type of stream i.e. audio or video if options contain both audio and video options
   * @memberOf MediaStreamHelpers
   * @private
   * @return {{settings: {audio: boolean, video: boolean}, mutedSettings: {shouldAudioMuted: Event | boolean | Boolean, shouldVideoMuted: Event | boolean | Boolean}, getUserMediaSettings: {audio: boolean, video: boolean}}}
   */
  const parseStreamSettings = (options, type = '') => {
    const settings = parseSettings(options, type);
    const mutedSettings = { shouldAudioMuted: options.audio && isABoolean(options.audio.mute) ? options.audio.mute : false, shouldVideoMuted: options.video && isABoolean(options.video.mute) ? options.video.mute : false };
    const getUserMediaSettings = parseGumSettings(settings, type);

    return {
      settings,
      mutedSettings,
      getUserMediaSettings,
    };
  };

  const isUser = (peerId, roomState) => {
    const { user } = roomState;
    return peerId === user.sid;
  };

  /**
   * @description Function that returns the User / Peer current session information.
   * @private
   * @param {String} peerId
   * @param {SkylinkRoom} room
   * @return {peerInfo}
   * @memberOf PeerDataHelpers
   */
  const getPeerInfo = (peerId, room) => {
    let peerInfo = null;
    if (!peerId) {
      return null;
    }
    const state = Skylink.getSkylinkState(room.id);

    if (!state) {
      logger.log.ERROR(`${MESSAGES.ROOM_STATE.NOT_FOUND} ${room.id}`);
      return peerInfo;
    }

    if (isUser(peerId, state)) {
      return PeerData.getCurrentSessionInfo(room);
    }

    peerInfo = clone_1(state.peerInformations[peerId]);

    if (!peerInfo) {
      logger.log.ERROR(`${MESSAGES.PEER_INFORMATIONS.NO_PEER_INFO} ${peerId}`);
      return peerInfo;
    }

    peerInfo.room = room.roomName;
    peerInfo.settings.data = !!(state.dataChannels[peerId] && state.dataChannels[peerId].main && state.dataChannels[peerId].main.channel && state.dataChannels[peerId].main.channel.readyState === DATA_CHANNEL_STATE$1.OPEN);

    return peerInfo;
  };

  /**
   * @namespace initOptions
   * @private
   * @module skylink/defaultOptions
   */
  const defaultOptions = {
    /*
     * @param {String} options.appKey The App Key.
     * <small>By default, <code>init()</code> uses [HTTP CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
     * authentication. For credentials based authentication, see the <code>options.credentials</code> configuration
     * below. You can know more about the <a href="http://support.temasys.io/support/solutions/articles/
     * 12000002712-authenticating-your-application-key-to-start-a-connection">in the authentication methods article here</a>
     * for more details on the various authentication methods.</small>
     * <small>If you are using the Persistent Room feature for scheduled meetings, you will require to
     * use the credential based authentication. See the <a href="http://support.temasys.io/support
     * /solutions/articles/12000002811-using-the-persistent-room-feature-to-configure-meetings">Persistent Room article here
     * </a> for more information.</small>
     */
    defaultRoom: null,
    appKey: null,
    roomServer: '//api.temasys.io',
    enableDataChannel: true,
    enableSTUNServer: true,
    enableTURNServer: true,
    socketServerPath: null,
    enableStatsGathering: true,
    audioFallback: true,
    socketTimeout: 7000,
    forceTURNSSL: false,
    forceTURN: false,
    forceSSL: true,
    usePublicSTUN: false,
    mcuUseRenegoRestart: true,
    useEdgeWebRTC: false,
    enableSimultaneousTransfers: true,
    TURNServerTransport: TURN_TRANSPORT.ANY,
    credentials: null,
    iceServer: null,
    socketServer: null,
    audioCodec: AUDIO_CODEC.AUTO,
    videoCodec: VIDEO_CODEC.AUTO,
    codecParams: { // TODO: review if codec setting is needed
      audio: {
        opus: {
          stereo: null,
          'sprop-stereo': null,
          usedtx: null,
          useinbandfec: null,
          maxplaybackrate: null,
          minptime: null,
        },
      },
      video: {
        h264: {
          profileLevelId: null,
          levelAsymmetryAllowed: null,
          packetizationMode: null,
        },
        vp8: {
          maxFs: null,
          maxFr: null,
        },
        vp9: {
          maxFs: null,
          maxFr: null,
        },
      },
    },
    beSilentOnStatsLogs: false,
    beSilentOnParseLogs: false,
    statsInterval: 20, // sec
  };

  /**
   * @private
   * @description Checks for the dependencies required for SkylinkJS
   * @memberOf module:Compatibility
   * @return {{fulfilled: boolean, message: string}}
   */
  const validateDependencies = () => {
    const dependencies = {
      fulfilled: true,
      message: '',
    };
    const { AdapterJS, io, fetch } = window;
    const header = 'Validating Dependencies';
    if (typeof (AdapterJS || window.AdapterJS || window.AdapterJS || {}).webRTCReady !== 'function') {
      dependencies.message = MESSAGES.INIT.ERRORS.NO_ADAPTER;
      dependencies.fulfilled = false;
      dependencies.readyStateChangeErrorCode = READY_STATE_CHANGE_ERROR.ADAPTER_NO_LOADED;
    } else if (!(io || window.io)) {
      dependencies.message = MESSAGES.INIT.ERRORS.NO_SOCKET_IO;
      dependencies.fulfilled = false;
      dependencies.readyStateChangeErrorCode = READY_STATE_CHANGE_ERROR.NO_SOCKET_IO;
    } else if (!fetch || !window.fetch) {
      dependencies.message = MESSAGES.INIT.ERRORS.NO_FETCH_SUPPORT;
      dependencies.fulfilled = false;
      dependencies.readyStateChangeErrorCode = READY_STATE_CHANGE_ERROR.NO_XMLHTTPREQUEST_SUPPORT;
    }
    if (!((isAgent(BROWSER_AGENT.FIREFOX) && AdapterJS.webrtcDetectedType === 'moz') || isAgent(BROWSER_AGENT.SAFARI) || (isAgent(BROWSER_AGENT.CHROME) && AdapterJS.webrtcDetectedType === 'webkit') || isAgent(BROWSER_AGENT.REACT_NATIVE))) {
      logger.log.WARN([header, null, null, MESSAGES.INIT.INCOMPATIBLE_BROWSER]);
    }
    if (!dependencies.fulfilled) {
      logger.log.ERROR([header, null, null, dependencies.message]);
    }
    return dependencies;
  };

  /**
   * @description Gets TCP and UDP ports based on the browser
   * @param {Object} params
   * @param {boolean} params.forceTURNSSL
   * @param {boolean} params.enableTURNServer
   * @param {enum} params.CONSTANTS
   * @memberOf module:Compatibility
   * @return {{tcp: Array, udp: Array, both: Array, iceServerProtocol: string}}
   */
  const getConnectionPortsAndProtocolByBrowser = (params) => {
    const { forceTURNSSL, serverConfig } = params;
    const connectionConfig = {
      tcp: serverConfig.iceServerPorts.tcp,
      udp: serverConfig.iceServerPorts.udp,
      both: serverConfig.iceServerPorts.both,
      iceServerProtocol: serverConfig.iceServerProtocol,
      iceServerPorts: serverConfig.iceServerPorts,
    };

    if (forceTURNSSL) {
      connectionConfig.iceServerPorts.udp = [];
      connectionConfig.iceServerProtocol = 'turns';
    } else if (isAgent(BROWSER_AGENT.FIREFOX)) { // default configs are specific to Chrome
      connectionConfig.udp = [3478];
      connectionConfig.both = [];
    }

    return connectionConfig;
  };

  /**
   * @classdesc Class representing a Skylink Room.
   * @class SkylinkRoom
   * @private
   */
  class SkylinkRoom {
    /**
     * @param {RawApiResponse} rawApiResponse - API response received from the API Server
     * @private
     */
    constructor(rawApiResponse) {
      /**
       * The room's id
       * @type {String}
       */
      this.id = rawApiResponse.room_key;
      /**
       * The room's credentials
       * @type {String}
       */
      this.token = rawApiResponse.roomCred;
      /**
       * The room start time
       * @type {Date}
       */
      this.startDateTime = rawApiResponse.start;
      /**
       * The maximum allowed room duration
       * @type {number}
       */
      this.duration = rawApiResponse.len;
      /**
       * The room name
       * @type {String}
       */
      this.roomName = rawApiResponse.roomName;
      /**
       * The peer connection configuration
       * @type {{mediaConstraints: any, peerConstraints: any, offerConstraints: any, peerConfig: {iceServers: Array}, sdpConstraints: {}}}
       */
      this.connection = {
        peerConstraints: JSON.parse(rawApiResponse.pc_constraints),
        offerConstraints: JSON.parse(rawApiResponse.offer_constraints),
        sdpConstraints: {},
        peerConfig: {
          iceServers: [],
        },
        mediaConstraints: JSON.parse(rawApiResponse.media_constraints),
      };
      /**
       * Stores the flag that indicates if Room is locked.
       * @type {boolean}
       */
      this.isLocked = false;
    }
  }

  /**
   * @classdesc Class representing a Skylink User.
   * @class
   * @private
   */
  class SkylinkUser {
    /**
     * @param {RawApiResponse} rawApiResponse - API response received from the API Server
     */
    constructor(rawApiResponse) {
      /**
       * The user id of the user
       * @type {String}
       */
      this.uid = rawApiResponse.username;
      /**
       * The user credentials or token of the user
       * @type {String}
       */
      this.token = rawApiResponse.userCred;
      /**
       * TimeStamp returned by API
       * @type {Date}
       */
      this.timeStamp = rawApiResponse.timeStamp;
      /**
       * The socket ID of the user
       * @type {JSON}
       */
      this.sid = null;
      /**
       * The status of whether messages via signaling server should be buffered. Messages will be buffered if it is not a handshake message and
       * enter message has not been sent by the user.
       * @type {Null|Boolean} Null when uninitialized i.e. no messages have been added to buffer, true when initialized i.e. messages have been
       * added to buffer and false when enter message has been sent
       */
      this.bufferMessage = null;
    }
  }

  /* eslint-disable camelcase */

  const apiResponseInstance = {};

  /**
   * @classdesc Class representing a Skylink API response.
   * @class SkylinkApiResponse
   * @private
   * @param {RawApiResponse} rawApiResponse - API response received from the API Server
   * @param {String} roomKey - Room id for retrieving ApiResponse instance
   */
  class SkylinkApiResponse {
    constructor(rawApiResponse, roomKey) {
      if (isAString(roomKey) && apiResponseInstance[roomKey]) {
        return apiResponseInstance[roomKey];
      }

      const {
        offer_constraints,
        pc_constraints,
        cid,
        apiOwner,
        ipSigserver,
        isPrivileged,
        autoIntroduce,
        httpPortList,
        httpsPortList,
        hasMCU,
        ipSigserverPath,
        hasPersistentMessage,
        room_key,
        enable_stats_config,
      } = rawApiResponse;

      if (!offer_constraints && !pc_constraints) {
        logger.log.ERROR(['API', null, 'init', 'pc_constraints or offer_constraints are null']);
      }
      logger.log.DEBUG(['API', null, 'init', 'Parsed Peer Connection constraints:'], JSON.parse(pc_constraints));
      logger.log.DEBUG(['API', null, 'init', 'Parsed Offer constraints'], JSON.parse(offer_constraints));

      /**
       * This is the cid received from API
       * @type {String}
       */
      this.key = cid;
      /**
       * The owner of the App Key
       * @type {String}
       */
      this.appKeyOwner = apiOwner;
      /**
       * If the App Key has privileged option enabled
       * @type {boolean}
       */
      this.isPrivileged = isPrivileged;
      /**
       * If the App Key has autoIntroduce option enabled
       * @type {boolean}
       */
      this.autoIntroduce = autoIntroduce;
      /**
       * The instance of SkylinkRoom
       * @type {SkylinkRoom}
       */
      this.room = new SkylinkRoom(rawApiResponse);
      /**
       * The instance of SkylinkUser
       * @type {SkylinkUser}
       */
      this.user = new SkylinkUser(rawApiResponse);
      /**
       * If the key has MCU enabled
       * @type Boolean
       */
      this.hasMCU = hasMCU;
      /**
       * The endpoint of the signaling server
       * @type {String}
       */
      this.socketServer = ipSigserver;
      /**
       * The socket server version path of the signaling server
       * @type {String}
       */
      this.socketServerPath = ipSigserverPath;
      /**
       * The socket server ports
       * @type {String}
       */
      this.socketPorts = {
        'http:': Array.isArray(httpPortList) && httpPortList.length > 0 ? httpPortList : [80, 3000],
        'https:': Array.isArray(httpsPortList) && httpsPortList.length > 0 ? httpsPortList : [443, 3443],
      };

      this.hasPersistentMessage = hasPersistentMessage;

      this.enableStatsGathering = enable_stats_config;

      apiResponseInstance[room_key] = this;
    }

    // eslint-disable-next-line class-methods-use-this
    deleteApiResponseInstance(roomKey) {
      delete apiResponseInstance[roomKey];
    }
  }

  const config = {
    stats: {
      endPoints: {
        client: '/client',
        session: '/session',
        auth: '/auth',
        signaling: '/client/signaling',
        iceConnection: '/client/iceconnection',
        iceCandidate: '/client/icecandidate',
        iceGathering: '/client/icegathering',
        negotiation: '/client/negotiation',
        bandwidth: '/client/bandwidth',
        recording: '/client/recording',
        dataChannel: '/client/datachannel',
        userMedia: '/client/usermedia',
      },
    },
  };

  config.stats.statsBase = '/rest/stats';

  /* eslint-disable class-methods-use-this */
  /**
   * @class
   * @classdesc This class is used to post the stats data.
   * @private
   */
  class SkylinkStats {
    constructor() {
      this.endpoints = config.stats.endPoints;
      this.stats_buffer = {};
      this.bufferTimeout = false;
    }

    postStats(endpoint, data) {
      const { STATS_MODULE } = MESSAGES;
      const beSilentOnLogs = Skylink.getInitOptions().beSilentOnStatsLogs;

      try {
        const postData = this.processData(data);
        this.postStatObj(endpoint, beSilentOnLogs, postData);
      } catch (err) {
        logger.log.WARN(STATS_MODULE.ERRORS.POST_FAILED, err);
      }
    }

    processData(data) {
      if (Array.isArray(data)) {
        return {
          client_id: data[0].client_id,
          data,
        };
      }

      return data;
    }

    async postStatObj(endpoint, beSilentOnLogs, data) {
      const { roomServer } = Skylink.getInitOptions();
      const { fetch } = window;
      const statsResponse = await fetch(`https:${roomServer}${config.stats.statsBase}${endpoint}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!beSilentOnLogs) {
        statsResponse.json()
          .then((result) => {
            logger.log.INFO([null, TAGS.STATS, null, `${endpoint}`], result);
          })
          .catch((err) => {
            logger.log.INFO([null, TAGS.STATS, null, `${endpoint}`], err);
          });
      }
    }

    addToStatsBuffer(operation, data, url) {
      if (!this.stats_buffer[operation]) {
        this.stats_buffer[operation] = {};
        this.stats_buffer[operation].url = url;
        this.stats_buffer[operation].data = [];
      }

      const cloneData = Object.assign({}, data);
      this.stats_buffer[operation].data.push(cloneData);
    }

    manageStatsBuffer() {
      if (!this.bufferTimeout) {
        this.bufferTimeout = true;
        setInterval(() => {
          const operations = Object.keys(this.stats_buffer);
          for (let i = 0; i < operations.length; i += 1) {
            if (this.stats_buffer[operations[i]].data.length > 0) {
              this.postStats(this.stats_buffer[operations[i]].url, this.stats_buffer[operations[i]].data);
              this.stats_buffer[operations[i]].data = [];
            }
          }
        }, 5000);
      }
    }
  }

  class HandleAuthStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        state: null,
        http_status: null,
        http_error: null,
        api_url: null,
        api_result: null,
      };
    }

    send(roomName, state, response, error) {
      this.model.room_id = roomName;
      // eslint-disable-next-line no-nested-ternary
      this.model.http_status = error ? (-1) : (response && response.status ? response.status : null);
      this.model.http_error = (typeof error === 'string' ? error : (error && error.message)) || null;
      this.model.api_url = response && response.endpoint ? response.endpoint : response.url;
      this.model.client_id = Skylink.getInitOptions().clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.state = state;
      this.model.timestamp = (new Date()).toISOString();

      this.postStats(this.endpoints.auth, this.model);
    }
  }

  const getEndPoint = (options) => {
    const {
      roomServer,
      appKey,
      defaultRoom,
      credentials,
      forceSSL,
    } = options;
    let path = `${roomServer}/api/${appKey}/${defaultRoom}`;
    let urlChar = '?';
    path = forceSSL ? `https:${path}` : `${window.location.protocol}${path}`;

    if (credentials) {
      const { startDateTime, duration } = credentials;
      path += `/${startDateTime}/${duration}?cred=${credentials.credentials}`;
      urlChar = '&';
    }

    path += `${urlChar}rand=${Date.now()}`;
    return path;
  };

  const logAPIResponse = (response) => {
    const { status, ok } = response;
    const loggerMethod = ok ? 'INFO' : 'ERROR';
    let message = MESSAGES.INIT.INFO.API_SUCCESS;
    if (!ok) {
      message = MESSAGES.INIT.ERRORS.AUTH_GENERAL;
      if (status === 403) {
        message = MESSAGES.INIT.ERRORS.AUTH_CORS;
      }
    }
    logger.log[loggerMethod](['API', null, 'auth', message], response);
  };

  const validateOptions = (options) => {
    const { appKey } = options;
    const toReturn = {
      isValid: true,
      message: '',
    };
    logger.log.INFO(['API', null, 'init', 'API initialised with options:'], options);
    if (!appKey) {
      toReturn.isValid = false;
      toReturn.message = MESSAGES.INIT.ERRORS.NO_APP_KEY;
      dispatchEvent(readyStateChange({
        readyState: READY_STATE_CHANGE$1.ERROR,
        error: {
          status: -2,
          content: new Error(MESSAGES.INIT.ERRORS.NO_APP_KEY),
          errorCode: READY_STATE_CHANGE_ERROR.NO_PATH,
        },
        room: null,
      }));
    }
    if (!toReturn.isValid) {
      logger.log.ERROR(['API', null, 'init', toReturn.message]);
    }
    return toReturn;
  };

  const validateAPIResponse = (response) => {
    const { ok } = response;
    logAPIResponse(response);
    return ok;
  };

  const parseAndMutateOptions = (options) => {
    const updatedOptions = options;
    // Force TURN connections should enforce settings.
    if (updatedOptions.forceTURN === true) {
      updatedOptions.enableTURNServer = true;
      updatedOptions.enableSTUNServer = false;
    }

    return updatedOptions;
  };

  const enforceUserInitOptions = (apiResponse) => {
    const userInitOptions = Skylink.getUserInitOptions();
    const initOptions = Skylink.getInitOptions();
    let updatedInitOptions = Object.assign(initOptions, apiResponse, userInitOptions);
    const optionsValidity = validateOptions(updatedInitOptions);

    if (!optionsValidity.isValid) {
      throw new Error(optionsValidity.message);
    }

    updatedInitOptions = parseAndMutateOptions(updatedInitOptions);
    Skylink.setInitOptions(updatedInitOptions);

    return updatedInitOptions;
  };

  const authenticateApp = async (options) => {
    const { fetch } = window;
    const endpoint = getEndPoint(options);
    new HandleAuthStats().send(options.defaultRoom, AUTH_STATE.REQUEST, { endpoint });
    const apiResponse = await fetch(endpoint, {
      headers: {
        Skylink_SDK_type: SDK_NAME.WEB,
        Skylink_SDK_version: SDK_VERSION,
        Skylink_API_version: API_VERSION,
        'X-Server-Select': SIGNALING_VERSION,
      },
    });

    return {
      endpoint,
      response: apiResponse,
    };
  };

  const parseAPIResponseBody = (responseBody) => {
    const apiResponse = new SkylinkApiResponse(responseBody);
    return apiResponse;
  };

  const testRTCPeerConnection = () => {
    try {
      const p = new window.RTCPeerConnection(null);
      // IE returns as typeof object
      return ['object', 'function'].indexOf(typeof p.createOffer) > -1 && p.createOffer !== null;
    } catch (e) {
      return false;
    }
  };

  const webRTCReadyOperations = () => {
    const returnObject = {
      ready: true,
      message: '',
    };
    if (!testRTCPeerConnection()) {
      returnObject.message = 'WebRTC not supported. Please upgrade your browser';
      returnObject.ready = false;
      dispatchEvent(readyStateChange({
        readyState: READY_STATE_CHANGE$1.ERROR,
        error: {
          status: -2,
          content: new Error(returnObject.message),
          errorCode: READY_STATE_CHANGE_ERROR.NO_WEBRTC_SUPPORT,
        },
        room: null,
      }));
    }


    return returnObject;
  };

  const codecSupport = roomKey => new Promise((resolve, reject) => {
    SessionDescription.getCodecsSupport(roomKey)
      .then((currentCodecSupport) => {
        const state = Skylink.getSkylinkState(roomKey);
        const { room } = state;

        if (Object.keys(currentCodecSupport.audio).length === 0 && Object.keys(currentCodecSupport.video).length === 0) {
          logger.log.ERROR(MESSAGES.JOIN_ROOM.ERRORS.CODEC_SUPPORT);
          dispatchEvent(readyStateChange({
            readyState: READY_STATE_CHANGE$1.ERROR,
            error: {
              status: -2,
              content: new Error(MESSAGES.JOIN_ROOM.ERRORS.CODEC_SUPPORT),
              errorCode: READY_STATE_CHANGE_ERROR.PARSE_CODECS,
            },
            room: Room.getRoomInfo(room.id),
          }));
          reject(new Error(MESSAGES.JOIN_ROOM.ERRORS.CODEC_SUPPORT));
        } else {
          resolve(true);
        }

        state.currentCodecSupport = currentCodecSupport;
        Skylink.setSkylinkState(state);
      })
      .catch((error) => {
        const state = Skylink.getSkylinkState(roomKey);
        const { room } = state;

        logger.log.ERROR(error);
        dispatchEvent(readyStateChange({
          readyState: READY_STATE_CHANGE$1.ERROR,
          error: {
            status: -2,
            content: new Error(error.message || error.toString()),
            errorCode: READY_STATE_CHANGE_ERROR.PARSE_CODECS,
          },
          room: Room.getRoomInfo(room.id),
        }));
        reject(new Error(error.message || error.toString()));
      });
  });

  /* eslint-disable class-methods-use-this */

  let instance = null;

  /**
   * @class
   * @classdesc Singleton class that represents a API server.
   * @private
   */
  class SkylinkAPIServer {
    constructor() {
      if (!instance) {
        instance = this;
      }

      this.options = {};

      return instance;
    }

    // eslint-disable-next-line class-methods-use-this
    init(options = defaultOptions) {
      if (options) {
        if (options.socketServer && !options.socketServerPath) { // set socketServerPath to override socketServerPath value returned from api that only works with
          // default sig
          // server url
          // eslint-disable-next-line no-param-reassign
          options.socketServerPath = '';
        }
        // eslint-disable-next-line no-param-reassign
        options.clientId = generateUUID();
        Skylink.setUserInitOptions(options);
      }
      dispatchEvent(readyStateChange({
        readyState: READY_STATE_CHANGE$1.INIT,
        error: null,
        room: null,
      }));
      const dependencies = validateDependencies();
      const { AdapterJS } = window;
      if (!dependencies.fulfilled) {
        dispatchEvent(readyStateChange({
          readyState: READY_STATE_CHANGE$1.ERROR,
          error: {
            status: -2,
            content: new Error(dependencies.message),
            errorCode: dependencies.readyStateChangeErrorCode,
          },
          room: null,
        }));
        throw new Error(dependencies.message);
      }

      let initOptions = Object.assign({}, defaultOptions, options);
      const optionsValidity = validateOptions(initOptions);
      if (!optionsValidity.isValid) {
        throw new Error(optionsValidity.message);
      }
      AdapterJS.webRTCReady(() => {
        const webrtcReady = webRTCReadyOperations();
        if (!webrtcReady.ready) {
          throw new Error(webrtcReady.message);
        }
      });
      initOptions = parseAndMutateOptions(initOptions);
      return initOptions;
    }

    createRoom(room) {
      return new Promise((resolve, reject) => {
        const initOptions = Skylink.getInitOptions();
        initOptions.defaultRoom = room;
        authenticateApp(initOptions).then((result) => {
          const { endpoint, response } = result;
          const isResponseValid = validateAPIResponse(response);
          if (isResponseValid) {
            dispatchEvent(readyStateChange({
              readyState: READY_STATE_CHANGE$1.COMPLETED,
              error: null,
              room,
            }));
            response.json().then((apiResponse) => {
              new HandleAuthStats().send(apiResponse.room_key, AUTH_STATE.SUCCESS, response);
              resolve({
                endpoint,
                response: apiResponse,
              });
            });
          } else {
            dispatchEvent(readyStateChange({
              readyState: READY_STATE_CHANGE$1.ERROR,
              error: {
                status: response.status,
                content: new Error(response.info || `XMLHttpRequest status not OK\nStatus was: ${response.status}`),
                errorCode: response.error || response.status,
              },
              room,
            }));
            response.json().then((error) => {
              new HandleAuthStats().send(room, AUTH_STATE.ERROR, response, error.info);
              reject(error);
            });
          }
        }).catch((error) => {
          dispatchEvent(readyStateChange({
            readyState: READY_STATE_CHANGE$1.ERROR,
            error: {
              status: error.status || -1,
              content: new Error(error.message || 'Network error occurred'),
              errorCode: READY_STATE_CHANGE_ERROR.XML_HTTP_REQUEST_ERROR,
            },
            room,
          }));
        });
      });
    }

    checkCodecSupport(roomKey) {
      return codecSupport(roomKey);
    }

    static parseAPIResponseBody(response) {
      return parseAPIResponseBody(response);
    }

    enforceUserInitOptions(response) {
      return enforceUserInitOptions(response);
    }

    static getRoomNameFromParams(params) {
      const initOptions = Skylink.getInitOptions();
      const { roomName } = params;
      const { defaultRoom } = initOptions;
      let room = null;
      if (typeof roomName !== 'undefined' && roomName !== '' && defaultRoom !== roomName) {
        room = roomName;
      } else {
        room = defaultRoom;
      }
      return room;
    }

    static getStateByKey(roomKey) {
      return getStateByKey(roomKey);
    }
  }

  /* eslint-disable prefer-destructuring */

  const isFirstConnectionAttempt = config => !config.signalingServerPort;

  const isLastPort = (ports, config) => ports.indexOf(config.signalingServerPort) === ports.length - 1;

  const getSignalingServerUrl = (params) => {
    const {
      signalingServerProtocol,
      signalingServer,
      signalingServerPort,
      socketServer,
    } = params;

    let url = '';

    if (isAString(signalingServer)) {
      url = `${signalingServerProtocol}//${signalingServer}`;
    } else if (signalingServer && isAObj(signalingServer) && signalingServer.protocol) {
      url = `${signalingServer.protocol}//${socketServer.url}:${signalingServerPort}?rand=${Date.now()}`;
    } else {
      url = `${signalingServerProtocol}//${signalingServer}:${signalingServerPort}?rand=${Date.now()}`;
    }

    return url;
  };

  const createSocket = (params) => {
    const skylinkState = Skylink.getSkylinkState(params.roomKey);
    const initOptions = Skylink.getInitOptions();
    const { config } = params;
    const { socketServer, socketTimeout, socketServerPath } = initOptions;
    const { socketPorts } = new SkylinkApiResponse(null, params.roomKey);
    const socketConfig = retrieveConfig('SOCKET', { socketTimeout, socketServerPath });

    let ports = [];

    if (socketServer && isAObj(socketServer) && Array.isArray(socketServer.ports) && socketServer.ports.length) {
      ({ ports } = socketServer);
    } else {
      ports = socketPorts[config.signalingServerProtocol];
    }

    if (isFirstConnectionAttempt(config)) {
      config.signalingServerPort = ports[0];
      config.fallbackType = SOCKET_FALLBACK.NON_FALLBACK;
    } else if (isLastPort(ports, config) || isAString(initOptions.socketServer)) {
      // re-refresh to long-polling port
      if (config.socketType === SOCKET_TYPE.WEBSOCKET) {
        config.socketType = SOCKET_TYPE.POLLING;
        config.signalingServerPort = ports[0];
      } else {
        config.socketSession.finalAttempts += 1;
        config.signalingServerPort = ports[0];
      }
    // move to the next port
    } else {
      config.signalingServerPort = ports[ports.indexOf(config.signalingServerPort) + 1];
    }

    if (config.socketType === SOCKET_TYPE.POLLING) {
      socketConfig.reconnectionDelayMax = DEFAULTS.SOCKET.RECONNECTION_DELAY_MAX;
      socketConfig.reconnectionAttempts = DEFAULTS.SOCKET.RECONNECTION_ATTEMPTS.POLLING;
      socketConfig.transports = [SOCKET_TYPE.XHR_POLLING, SOCKET_TYPE.JSONP_POLLING, SOCKET_TYPE.POLLING.toLowerCase()];
    }

    const url = getSignalingServerUrl({
      signalingServerProtocol: config.signalingServerProtocol,
      signalingServer: skylinkState.socketServer,
      signalingServerPort: config.signalingServerPort,
      socketServer,
    });

    config.socketServer = socketServer;
    config.socketServerPath = socketServerPath;
    skylinkState.socketSession = config;
    Skylink.setSkylinkState(skylinkState, params.roomKey);

    return window.io(url, socketConfig);
  };

  const processSignalingMessage = (messageHandler, message) => {
    const { type } = message;
    logger.log.INFO(['SIG SERVER', null, type, 'received']);
    switch (type) {
      case SIG_MESSAGE_TYPE.IN_ROOM: messageHandler.inRoomHandler(message); break;
      case SIG_MESSAGE_TYPE.ENTER: messageHandler.enterRoomHandler(message); break;
      case SIG_MESSAGE_TYPE.OFFER: messageHandler.offerHandler(message); break;
      case SIG_MESSAGE_TYPE.WELCOME: messageHandler.welcomeHandler(message); break;
      case SIG_MESSAGE_TYPE.ANSWER: messageHandler.answerHandler(message); break;
      case SIG_MESSAGE_TYPE.ANSWER_ACK: messageHandler.answerAckHandler(message); break;
      case SIG_MESSAGE_TYPE.CANDIDATE: messageHandler.candidateHandler(message); break;
      case SIG_MESSAGE_TYPE.PEER_LIST: messageHandler.getPeerListHandler(message); break;
      case SIG_MESSAGE_TYPE.INTRODUCE_ERROR: messageHandler.introduceError(message); break;
      case SIG_MESSAGE_TYPE.BYE: messageHandler.byeHandler(message); break;
      case SIG_MESSAGE_TYPE.STREAM: messageHandler.streamHandler(message); break;
      case SIG_MESSAGE_TYPE.RECORDING: messageHandler.recordingHandler(message); break;
      case SIG_MESSAGE_TYPE.REDIRECT: messageHandler.redirectHandler(message); break;
      case SIG_MESSAGE_TYPE.RTMP: messageHandler.rtmpHandler(message); break;
      case SIG_MESSAGE_TYPE.UPDATE_USER: messageHandler.setUserDataHandler(message); break;
      case SIG_MESSAGE_TYPE.MEDIA_INFO_EVENT: messageHandler.mediaInfoEventHandler(message); break;
      case SIG_MESSAGE_TYPE.MESSAGE: messageHandler.userMessageHandler(message, null); break;
      case SIG_MESSAGE_TYPE.STORED_MESSAGES: messageHandler.storedMessagesHandler(message); break;
      case SIG_MESSAGE_TYPE.ROOM_LOCK: messageHandler.roomLockHandler(message); break;
      // Backward compatibility for public and private message protocol
      case SIG_MESSAGE_TYPE.PUBLIC_MESSAGE: messageHandler.userMessageHandler(message, true); break;
      case SIG_MESSAGE_TYPE.PRIVATE_MESSAGE: messageHandler.userMessageHandler(message, false); break;
    }
  };

  const handleSocketClose = (roomKey, reason) => {
    const state = Skylink.getSkylinkState(roomKey) || Object.values(Skylink.getSkylinkState())[0]; // to handle leaveAllRooms method

    const {
      socketSession, room, user,
    } = state;

    logger.log.INFO([null, 'Socket', null, `Channel closed. Reason - ${reason}`]);

    state.channelOpen = false;
    Skylink.setSkylinkState(state, roomKey);

    dispatchEvent(channelClose({
      socketSession: clone_1(socketSession),
      reason,
    }));

    if (room.inRoom && user && user.sid) {
      dispatchEvent(sessionDisconnect({
        peerId: user.sid,
        peerInfo: PeerData.getCurrentSessionInfo(room),
        reason,
      }));
    }
  };

  class HandleSignalingStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        state: null,
        signaling_url: null,
        signaling_transport: null,
        attempts: null,
        error: null,
      };
    }

    send(roomKey, state, error) {
      const roomState = Skylink.getSkylinkState(roomKey);
      const { socketSession } = roomState;

      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.client_id = roomState.clientId;
      this.model.state = state;
      this.model.signaling_url = roomState.socketSession.socketServer;
      this.model.signaling_transport = roomState.socketSession.socketType.toLowerCase();
      this.model.attempts = socketSession.socketSession.finalAttempts === 0 ? socketSession.socketSession.attempts : (socketSession.socketSession.finalAttempts * 2) + socketSession.socketSession.attempts;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.attempts = typeof error === 'number' ? error : null;
      this.model.error = (typeof error === 'string' ? error : (error && error.message)) || null;

      this.postStats(this.endpoints.signaling, this.model);
    }
  }

  const onConnection = (resolve, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { socketSession } = state;

    new HandleSignalingStats().send(roomKey, STATES.SIGNALING.CONNECT, null);

    if (!state.channelOpen) {
      state.channelOpen = true;
      Skylink.setSkylinkState(state, roomKey);
    }

    dispatchEvent(channelOpen({
      socketSession: clone_1(socketSession),
    }));

    resolve();
  };

  const onDisconnect = (roomKey, reason) => {
    const state = Skylink.getSkylinkState(roomKey) || Object.values(Skylink.getSkylinkState())[0]; // to handle leaveAllRooms method
    const isChannelOpen = state.channelOpen;
    const { room } = state;
    let error = null;

    if (reason !== 'io client disconnect') {
      error = reason;
    }

    new HandleSignalingStats().send(room.id, STATES.SIGNALING.DISCONNECT, error);

    if (isChannelOpen || (!isChannelOpen && roomKey !== room.roomName)) { // to handle leaveAllRooms method
      handleSocketClose$1(room.id, reason);
    }
  };

  const onError = (roomKey, error) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { socketSession } = state;

    new HandleSignalingStats().send(roomKey, STATES.SIGNALING.ERROR, error);

    logger.log.ERROR([null, 'Socket', null, 'Exception occurred ->'], error);

    dispatchEvent(channelError({
      error,
      socketSession: clone_1(socketSession),
    }));
  };

  const callbacks = {
    onConnection,
    onDisconnect,
    onError,
  };

  const setSocketCallbacks = (roomKey, signaling, resolve) => {
    signaling.socket.on(SOCKET_EVENTS.CONNECT, callbacks.onConnection.bind(signaling, resolve, roomKey));
    signaling.socket.on(SOCKET_EVENTS.MESSAGE, signaling.onMessage.bind(signaling));
    signaling.socket.on(SOCKET_EVENTS.DISCONNECT, callbacks.onDisconnect.bind(signaling, roomKey));
    signaling.socket.on(SOCKET_EVENTS.ERROR, callbacks.onError.bind(signaling, roomKey));
  };

  const isNegotiationTypeMsg = (message) => {
    const {
      JOIN_ROOM, ENTER, WELCOME, OFFER, ANSWER, ANSWER_ACK, CANDIDATE, END_OF_CANDIDATES,
    } = SIG_MESSAGE_TYPE;
    const negTypeMessages = [JOIN_ROOM, ENTER, WELCOME, OFFER, ANSWER, ANSWER_ACK, CANDIDATE, END_OF_CANDIDATES];
    return negTypeMessages.indexOf(message.type) > -1;
  };

  const sendBufferedMsg = (state, currentBufferedMsgs) => {
    const signaling = new SkylinkSignalingServer();
    for (let i = currentBufferedMsgs.length - 1; i >= 0; i -= 1) {
      const message = currentBufferedMsgs[i];
      if (!message.mid) {
        if (!state.user.sid) {
          logger.log.DEBUG([state.user.sid, TAGS.SIG_SERVER, null, `${MESSAGES.SIGNALING.BUFFERED_MESSAGES_DROPPED}`]);
          return;
        }
        message.mid = state.user.sid;
      }
      signaling.sendMessage(message);
      currentBufferedMsgs.splice(i, 1);
    }
  };

  const initAndTrue = value => isABoolean(value) && value;

  const executeCallbackAndRemoveListener = (rid, evt) => {
    const state = Skylink.getSkylinkState(rid);
    const { detail } = evt;

    if (detail.state === HANDSHAKE_PROGRESS$1.ENTER) {
      const currentBufferedMsgs = clone_1(state.socketMessageQueue);
      state.user.bufferMessage = false;
      state.socketMessageQueue = [];
      Skylink.setSkylinkState(state, state.room.id);

      logger.log.DEBUG([state.user.sid, TAGS.SIG_SERVER, null, `${MESSAGES.SIGNALING.BUFFERED_MESSAGES_SENT}: ${currentBufferedMsgs.length}`]);
      sendBufferedMsg(state, currentBufferedMsgs);
      skylinkEventManager.removeEventListener(EVENTS.HANDSHAKE_PROGRESS, executeCallbackAndRemoveListener);
    }
  };

  const shouldBufferMessage = (message) => {
    const { rid } = message;
    const updatedState = Skylink.getSkylinkState(rid);
    const { user, room } = updatedState;

    if ((isNull(user.bufferMessage) || initAndTrue(user.bufferMessage)) && !isNegotiationTypeMsg(message)) {
      logger.log.DEBUG([user.sid, TAGS.SIG_SERVER, null, MESSAGES.SIGNALING.MESSAGE_ADDED_TO_BUFFER]);
      updatedState.socketMessageQueue.unshift(message);

      if (!initAndTrue(user.bufferMessage)) {
        updatedState.user.bufferMessage = true;
        logger.log.DEBUG([user.sid, TAGS.SIG_SERVER, null, MESSAGES.SIGNALING.ENTER_LISTENER]);
        skylinkEventManager.addEventListener(EVENTS.HANDSHAKE_PROGRESS, executeCallbackAndRemoveListener.bind(undefined, rid));
      }

      Skylink.setSkylinkState(updatedState, room.id);

      return true;
    }

    if (message.type === HANDSHAKE_PROGRESS$1.ENTER && isNull(user.bufferMessage)) {
      logger.log.DEBUG([user.sid, TAGS.SIG_SERVER, null, MESSAGES.SIGNALING.BUFFER_NOT_NEEDED]);
      updatedState.user.bufferMessage = false;
      updatedState.socketMessageQueue = [];
      Skylink.setSkylinkState(updatedState, updatedState.room.id);
    }

    return false;
  };

  const createSocket$1 = params => createSocket(params);

  const processSignalingMessage$1 = (messageHandler, message) => {
    processSignalingMessage(messageHandler, message);
  };

  const sendChannelMessage = (socket, message) => {
    socket.send(JSON.stringify(message));
  };

  const handleSocketClose$1 = (roomKey, reason) => {
    handleSocketClose(roomKey, reason);
  };

  const setSocketCallbacks$1 = (roomKey, signaling, resolve) => {
    setSocketCallbacks(roomKey, signaling, resolve);
  };

  const shouldBufferMessage$1 = message => shouldBufferMessage(message);

  /**
   * Method that deletes the encryption secret associated with the given secretId. If the secretId is not provided all encryption secrets are deleted.
   * @param encryptSecrets
   * @param selectedSecretId
   * @param secretId
   * @returns {object}
   * @private
   */
  const deleteEncryptSecrets = (encryptSecrets, selectedSecretId, secretId) => {
    const updatedData = {
      encryptSecrets,
      selectedSecretId,
    };

    if (secretId) {
      if (!updatedData.encryptSecrets[secretId]) {
        throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRET_ID_NOT_FOUND);
      }

      // selectedSecretId should be set to default if there are no encryptSecrets stored
      if (updatedData.selectedSecretId === secretId) {
        updatedData.selectedSecretId = helpers$1.setSelectedSecretId();
      }

      delete updatedData.encryptSecrets[secretId];
    } else {
      logger.log.DEBUG([null, TAGS.ENCRYPTED_MESSAGING, null, `${MESSAGES.MESSAGING.ENCRYPTION.DELETE_ALL}`]);
      updatedData.selectedSecretId = helpers$1.setSelectedSecretId();
      updatedData.encryptSecrets = {};
    }

    return updatedData;
  };

  const isValidSecret = (secret) => {
    if (!secret) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.NO_SECRET_OR_SECRET_ID);
    }

    if (!helpers$1.utils.isValidString(secret)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.INVALID_TYPE);
    }

    return true;
  };

  const isValidSecretId = (secretId, updatedEncryptSecrets) => {
    if (!secretId) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.NO_SECRET_OR_SECRET_ID);
    }

    if (!helpers$1.utils.isValidString(secretId)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.INVALID_TYPE);
    }

    if (helpers$1.utils.isExisting(secretId, updatedEncryptSecrets)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRET_ID_NOT_UNIQUE);
    }

    return true;
  };


  // eslint-disable-next-line consistent-return
  const setEncryptSecret = (encryptSecrets, secret, secretId) => {
    const updatedEncryptSecrets = encryptSecrets;

    if (isValidSecret(secret) && isValidSecretId(secretId, updatedEncryptSecrets)) {
      updatedEncryptSecrets[secretId] = secret;
      return updatedEncryptSecrets;
    }
  };

  const isExisting = (encryptionParam, updatedEncryptSecrets) => {
    const duplicates = Object.keys(updatedEncryptSecrets).filter(id => id === encryptionParam);
    return duplicates.length > 0;
  };

  // conditions for encryption - encryptSecrets must not be empty obj AND selected secret must not be empty string
  const canEncrypt = (selectedSecretId, encryptSecrets) => {
    if (isEmptyObj(encryptSecrets) && isEmptyString(selectedSecretId)) {
      throw new Error(`${MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRETS_NOT_PROVIDED}, ${MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRET_ID_NOT_PROVIDED}`);
    } else if (isEmptyString(selectedSecretId)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRET_ID_NOT_SELECTED);
    } else if (isEmptyObj(encryptSecrets)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRETS_NOT_PROVIDED);
    }

    return true;
  };

  // conditions for decryption - encrypt secrets must not be empty obj
  const canDecrypt = (encryptSecrets) => {
    if (isEmptyObj(encryptSecrets)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRETS_NOT_PROVIDED);
    }

    return true;
  };

  const isValidString = (encryptionParam) => {
    if (!isAString(encryptionParam) || !isAString(encryptionParam) || isEmptyString(encryptionParam)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.INVALID_TYPE);
    }

    return true;
  };

  const hasCrypto = () => {
    if (!CryptoJS) {
      logger.log.ERROR([null, TAGS.ASYNC_MESSAGING, null, MESSAGES.PERSISTENT_MESSAGE.ERRORS.NO_DEPENDENCY]);
      return false;
    }

    return CryptoJS;
  };

  const utils = {
    isExisting,
    isValidString,
    hasCrypto,
    canEncrypt,
    canDecrypt,
  };

  const setSelectedSecretId = (encryptSecrets, secretId) => {
    if (!secretId) {
      return '';
    }

    if (!helpers$1.utils.isValidString(secretId)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.INVALID_TYPE);
    }

    if (!encryptSecrets[secretId]) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRET_ID_NOT_FOUND);
    }

    return secretId;
  };

  const getMessageConfig = (roomState, targetPeerId) => {
    const {
      peerInformations,
      room,
      user,
    } = roomState;
    let listOfPeers;
    let isPrivate = false;

    if (!room.inRoom || !user) {
      throw Error(MESSAGES.ROOM.ERRORS.NOT_IN_ROOM);
    }

    if (Array.isArray(targetPeerId) && !isEmptyArray(targetPeerId)) {
      listOfPeers = targetPeerId;
      isPrivate = true;
    } else if (targetPeerId && isAString(targetPeerId)) {
      listOfPeers = [targetPeerId];
      isPrivate = true;
    } else {
      listOfPeers = Object.keys(peerInformations);
    }

    listOfPeers.forEach((peerId, i) => {
      if (!peerInformations[peerId]) {
        logger.log.WARN([peerId, TAGS.MESSAGING, null, `${MESSAGES.MESSAGING.ERRORS.DROPPING_MESSAGE} - ${MESSAGES.PEER_CONNECTION.NO_PEER_CONNECTION}`]);
        listOfPeers.splice(i, 1);
      } else if (peerId === PEER_TYPE.MCU) {
        listOfPeers.splice(i, 1);
      }
    });

    if (listOfPeers.length === 0) {
      logger.log.WARN([null, TAGS.MESSAGING, null, MESSAGES.PEER_CONNECTION.NO_PEER_CONNECTION]);
    }

    return { listOfPeers, isPrivate };
  };

  const sendMessageToSig = (roomState, config, message, encryptedMessage = '', targetPeerId) => {
    const signaling = new SkylinkSignalingServer();
    signaling.sendUserMessage(roomState, config, encryptedMessage || message);
    helpers.dispatchOnIncomingMessage(roomState, config, message, true, targetPeerId);
  };

  // if isSelf = true, targetPeerId is the peer id targeted in sendMessage
  // else targetPeerId is the targetMid of the incoming sig msg
  const dispatchOnIncomingMessage = (roomState, config, messageContent, isSelf, targetPeerId) => {
    const { room, user } = roomState;

    logger.log.DEBUG([isSelf ? null : targetPeerId, TAGS.MESSAGING, null, `${MESSAGES.MESSAGING.RECEIVED_MESSAGE} - isPrivate: ${config.isPrivate}`]);
    const message = {
      // eslint-disable-next-line no-nested-ternary
      targetPeerId: isSelf ? (config.isPrivate ? targetPeerId : null) : user.sid,
      content: messageContent,
      senderPeerId: isSelf ? user.sid : targetPeerId,
      isDataChannel: false,
      isPrivate: config.isPrivate,
      timeStamp: generateISOStringTimesStamp(),
    };

    if (isSelf) {
      message.listOfPeers = config.listOfPeers;
    }

    dispatchEvent(onIncomingMessage({
      room: Room.getRoomInfo(room.id),
      message,
      isSelf,
      peerId: isSelf ? user.sid : targetPeerId,
      peerInfo: isSelf ? PeerData.getCurrentSessionInfo(room) : PeerData.getPeerInfo(targetPeerId, room),
    }));
  };

  class SkylinkError {
    static throwError(errorLog = '', message = '') {
      logger.log.ERROR([null, TAGS.SKYLINK_ERROR, null, `${errorLog}${(message ? ` - ${message}` : '')}`]);
      throw new Error(`${errorLog}${(message ? ` - ${message}` : '')}`);
    }
  }

  const trySendMessage = (roomState, message, targetPeerId) => {
    try {
      const config = helpers.getMessageConfig(roomState, targetPeerId);
      helpers.sendMessageToSig(roomState, config, message, null, targetPeerId);
    } catch (error) {
      SkylinkError.throwError(MESSAGES.MESSAGING.ERRORS.FAILED_SENDING_MESSAGE);
    }
  };

  const helpers = {
    getMessageConfig,
    sendMessageToSig,
    dispatchOnIncomingMessage,
    trySendMessage,
  };

  const getMessageConfig$1 = (roomState, targetPeerId, encryptSecrets, selectedSecretId, isPersistent) => {
    const config = helpers.getMessageConfig(roomState, targetPeerId);

    if (helpers$1.utils.hasCrypto() && helpers$1.utils.canEncrypt(selectedSecretId, encryptSecrets)) {
      config.secretId = selectedSecretId;
    }

    if (isPersistent) {
      config.isPersistent = isPersistent;
    }

    return config;
  };

  const encryptMessage = (message, secret, decrypt = false) => {
    if (decrypt) {
      try {
        const decipher = CryptoJS.AES.decrypt(message, secret);

        return decipher.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.ENCRYPT_SECRET);
      }
    }

    const cipher = CryptoJS.AES.encrypt(message, secret);

    return cipher.toString();
  };

  const tryDecryptMessage = (message, secretId, encryptSecrets) => {
    const decryptedMessage = helpers$1.encryptMessage(message, encryptSecrets[secretId], true);
    if (isEmptyString(decryptedMessage)) {
      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.ENCRYPT_SECRET);
    } else {
      return decryptedMessage;
    }
  };

  const helpers$1 = {
    deleteEncryptSecrets,
    setEncryptSecret,
    setSelectedSecretId,
    utils,
    getMessageConfig: getMessageConfig$1,
    encryptMessage,
    tryDecryptMessage,
  };

  /**
   * @description Function that returns the userInfo to be sent to Signaling.
   * @private
   * @param {SkylinkRoom} room
   * @return {Object}
   * @memberOf PeerDataHelpers
   */
  const getUserInfo = (room) => {
    const userInfo = helpers$6.getCurrentSessionInfo(room);
    delete userInfo.room;
    return userInfo;
  };

  const instance$1 = {};
  /**
   * @classdesc Class used for handling encryption
   * @class
   * @private
   */
  class EncryptedMessaging {
    constructor(roomState) {
      const { room, user } = roomState;

      if (!instance$1[room.id]) {
        instance$1[room.id] = this;
      }

      this.room = room;
      this.peerId = user.sid;

      /**
       * The secret id and encrypt secret key-value pair.
       * @type {Object|{}}
       */
      this.encryptSecrets = {};

      /**
       * The selected secret id.
       * @type {String}
       */
      this.selectedSecretId = '';

      return instance$1[room.id];
    }

    setEncryptSecret(secret, secretId) {
      try {
        this.encryptSecrets = helpers$1.setEncryptSecret(this.encryptSecrets, secret, secretId);
        this.dispatchEncryptSecretEvent();
      } catch (error) {
        SkylinkError.throwError(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SET_ENCRYPT_SECRET, error.message);
      }
    }

    getEncryptSecrets() {
      return this.encryptSecrets;
    }

    deleteEncryptSecrets(secretId) {
      try {
        const updatedData = helpers$1.deleteEncryptSecrets(this.encryptSecrets, this.selectedSecretId, secretId);
        this.encryptSecrets = updatedData.encryptSecrets;
        this.selectedSecretId = updatedData.selectedSecretId;
        this.dispatchEncryptSecretEvent();
      } catch (error) {
        SkylinkError.throwError(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.DELETE_ENCRYPT_SECRETS, error.message);
      }
    }

    setSelectedSecretId(secretId) {
      try {
        this.selectedSecretId = helpers$1.setSelectedSecretId(this.encryptSecrets, secretId);
        this.dispatchEncryptSecretEvent();
      } catch (error) {
        SkylinkError.throwError(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SET_SELECTED_SECRET, error.message);
      }
    }

    getSelectedSecretId() {
      return this.selectedSecretId;
    }

    dispatchEncryptSecretEvent() {
      dispatchEvent(encryptionSecretsUpdated({
        room: Room.getRoomInfo(this.room.id),
        encryptSecrets: this.encryptSecrets,
        selectedSecretId: this.selectedSecretId,
        peerInfo: getUserInfo(this.room),
        peerId: this.peerId,
      }));
    }

    canEncrypt(throwError) {
      try {
        if (helpers$1.utils.canEncrypt(this.selectedSecretId, this.encryptSecrets)) {
          return helpers$1.utils.isValidString(this.selectedSecretId) && helpers$1.utils.isValidString(this.encryptSecrets[this.selectedSecretId]);
        }

        return false;
      } catch (err) {
        if (throwError) {
          throw new Error(err.message);
        }
        return false;
      }
    }

    decryptStoredMessages(message, secretId) {
      if (helpers$1.utils.canEncrypt(secretId, this.encryptSecrets) && !Object.keys(this.encryptSecrets).filter(key => key === secretId).length) {
        throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.SECRET_ID_NOT_FOUND);
      }

      return this.decryptMessage(message, secretId);
    }

    decryptMessage(message, secretId = '') {
      if (secretId && helpers$1.utils.canDecrypt(this.encryptSecrets)) {
        return helpers$1.tryDecryptMessage(message, secretId, this.encryptSecrets);
      }

      throw new Error(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.INVALID_SECRETS);
    }

    sendMessage(roomName, message, targetPeerId, isPersistent = false) {
      const roomState = getRoomStateByName(roomName);
      if (getParamValidity(message, 'message', 'sendMessage') && roomState) {
        try {
          logger.log.DEBUG([null, TAGS.ASYNC_MESSAGING, null, MESSAGES.MESSAGING.ENCRYPTION.SEND_MESSAGE]);
          const config = helpers$1.getMessageConfig(roomState, targetPeerId, this.encryptSecrets, this.selectedSecretId, isPersistent);
          const encryptedMessage = helpers$1.encryptMessage(message, this.encryptSecrets[this.selectedSecretId]);
          helpers.sendMessageToSig(roomState, config, message, encryptedMessage, targetPeerId);
        } catch (error) {
          SkylinkError.throwError(MESSAGES.MESSAGING.ERRORS.DROPPING_MESSAGE, error.message);
        }
      }
    }

    static deleteEncryptedInstance(room) {
      delete instance$1[room.id];
    }
  }

  const getMessageConfig$2 = (roomState, targetPeerId) => {
    const config = helpers$1.getMessageConfig(roomState, targetPeerId);
    config.isPersistent = true;

    return config;
  };

  const parseDecryptedMessageData = (message, targetMid) => ({
    targetPeerId: targetMid,
    senderPeerId: message.mid,
    content: message.data,
    timeStamp: parseUNIXTimeStamp(message.timeStamp),
    isPrivate: false,
    isDataChannel: false,
  });

  const helpers$2 = {
    getMessageConfig: getMessageConfig$2,
    parseDecryptedMessageData,
  };

  const instance$2 = {};

  /**
   * @classdesc Class used for handling the asynchronous messaging feature
   * @class
   * @private
   */
  class AsyncMessaging {
    constructor(roomState) {
      const { user, room, hasPersistentMessage } = roomState;

      if (!instance$2[room.id]) {
        instance$2[room.id] = this;
      }

      this.room = room;
      this.peerId = user.sid;
      this.isPersistent = hasPersistentMessage; // Value defaults to hasPersistentMessage
      this.hasPersistentMessage = hasPersistentMessage;

      return instance$2[room.id];
    }

    setMessagePersistence(isPersistent) {
      if (!isABoolean(isPersistent)) {
        throw SkylinkError.throwError(MESSAGES.MESSAGING.PERSISTENCE.ERRORS.FAILED_SETTING_PERSISTENCE, MESSAGES.MESSAGING.PERSISTENCE.ERRORS.INVALID_TYPE);
      } else if (!this.hasPersistentMessage) {
        this.isPersistent = isPersistent;
        throw SkylinkError.throwError(MESSAGES.MESSAGING.PERSISTENCE.ERRORS.PERSISTENT_MESSAGE_FEATURE_NOT_ENABLED);
      }

      this.isPersistent = isPersistent;

      dispatchEvent(persistentMessageState({
        room: Room.getRoomInfo(this.room.id),
        isPersistent: this.isPersistent,
        peerInfo: getUserInfo(this.room),
        peerId: this.peerId,
      }));
    }

    getMessagePersistence() {
      return this.isPersistent;
    }

    sendMessage(roomName, message, targetPeerId) {
      const roomState = getRoomStateByName(roomName);
      const isPublicMessage = !targetPeerId || (Array.isArray(targetPeerId) && isEmptyArray(targetPeerId));
      if (getParamValidity(message, 'message', 'sendMessage') && roomState) {
        try {
          logger.log.DEBUG([null, TAGS.ASYNC_MESSAGING, null, MESSAGES.MESSAGING.PERSISTENCE.SEND_MESSAGE]);
          const encryptedMessaging = new EncryptedMessaging(roomState);
          if (!isPublicMessage) {
            throw new Error(MESSAGES.MESSAGING.PERSISTENCE.ERRORS.PRIVATE_MESSAGE);
          }

          if (encryptedMessaging.canEncrypt(true)) {
            encryptedMessaging.sendMessage(roomName, message, targetPeerId, this.isPersistent);
          }
        } catch (error) {
          SkylinkError.throwError(MESSAGES.MESSAGING.ERRORS.DROPPING_MESSAGE, error.message);
        }
      }
    }

    getStoredMessages() {
      const roomState = Skylink.getSkylinkState(this.room.id);
      if (!this.hasPersistentMessage) {
        logger.log.WARN([this.peerId, TAGS.ASYNC_MESSAGING, null, `${MESSAGES.MESSAGING.PERSISTENCE.ERRORS.PERSISTENT_MESSAGE_FEATURE_NOT_ENABLED}`]);
        return;
      }

      new SkylinkSignalingServer().getStoredMessages(roomState);
    }

    canPersist() {
      if (this.hasPersistentMessage) {
        if (this.isPersistent) {
          return true;
        }

        logger.log.DEBUG([null, TAGS.ASYNC_MESSAGING, null, MESSAGES.MESSAGING.PERSISTENCE.NOT_PERSISTED]);
        return false;
      }

      if (this.isPersistent) {
        logger.log.DEBUG([null, TAGS.ASYNC_MESSAGING, null, `${MESSAGES.MESSAGING.PERSISTENCE.IS_PERSISTENT_CONFIG} ${this.isPersistent}`]);
        throw new Error(MESSAGES.MESSAGING.PERSISTENCE.ERRORS.PERSISTENT_MESSAGE_FEATURE_NOT_ENABLED);
      }

      return false;
    }

    static processStoredMessages(message) {
      const roomState = Skylink.getSkylinkState(message.rid);
      const { room } = roomState;
      const targetMid = message.mid;
      const messageData = JSON.parse(message.data);
      const encryptedMessaging = new EncryptedMessaging(roomState);
      const messages = [];

      logger.log.DEBUG([targetMid, TAGS.ASYNC_MESSAGING, null, MESSAGES.MESSAGING.PERSISTENCE.STORED_MESSAGES], messageData);

      try {
        for (let i = 0; i < messageData.length; i += 1) {
          messageData[i].data = encryptedMessaging.decryptStoredMessages(messageData[i].data, messageData[i].secretId);
          messages.push(helpers$2.parseDecryptedMessageData(messageData[i], targetMid));
        }
      } catch (error) {
        throw SkylinkError.throwError(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.FAILED_DECRYPTING_MESSAGE, error.message);
      }

      dispatchEvent(storedMessages({
        room: Room.getRoomInfo(room.id),
        storedMessages: messages,
        isSelf: false,
        peerId: targetMid,
        peerInfo: PeerData.getPeerInfo(targetMid, room),
      }));
    }

    static deleteAsyncInstance(room) {
      delete instance$2[room.id];
    }
  }

  /**
   * @classdesc Class that manages the messaging feature
   * @class
   * @private
   */
  class Messaging {
    static sendMessage(roomName, message, targetPeerId) {
      const roomState = getRoomStateByName(roomName);
      if (getParamValidity(message, 'message', 'sendMessage') && roomState) {
        const encryptedMessaging = new EncryptedMessaging(roomState);
        const asyncMessaging = new AsyncMessaging(roomState);
        if (asyncMessaging.canPersist()) {
          asyncMessaging.sendMessage(roomName, message, targetPeerId);
        } else if (encryptedMessaging.canEncrypt()) {
          encryptedMessaging.sendMessage(roomName, message, targetPeerId);
        } else {
          helpers.trySendMessage(roomState, message, targetPeerId);
        }
      }
    }

    static sendP2PMessage(roomName, message, targetPeerId) {
      const roomState = getRoomStateByName(roomName);
      if (getParamValidity(message, 'message', 'sendP2PMessage') && roomState) {
        PeerConnection.sendP2PMessage(roomName, message, targetPeerId);
      }
    }

    static processMessage(message, isPublic) {
      const {
        mid,
        target,
        rid,
        secretId,
        data,
      } = message;
      const roomState = Skylink.getSkylinkState(rid);
      const targetMid = mid;

      let messageData = data;
      if (secretId) {
        try {
          const encryptedMessaging = new EncryptedMessaging(roomState);
          messageData = encryptedMessaging.decryptMessage(data, secretId);
        } catch (error) {
          SkylinkError.throwError(MESSAGES.MESSAGING.ENCRYPTION.ERRORS.FAILED_DECRYPTING_MESSAGE, error.message);
        }
      }

      helpers.dispatchOnIncomingMessage(roomState, { isPrivate: isABoolean(isPublic) ? !isPublic : !!target }, messageData, false, targetMid);
    }
  }

  const userMessageHandler = (message, isPublic) => {
    Messaging.processMessage(message, isPublic);
  };

  const defaultIceServerPorts = {
    udp: [3478, 19302, 19303, 19304],
    tcp: [80, 443],
    both: [19305, 19306, 19307, 19308],
  };

  const CONSTANTS = {
    STUN: 'stun',
    TURN: 'turn',
    TEMASYS: 'temasys',
    DEFAULT_TURN_SERVER: 'turn.temasys.io',
    TCP: 'TCP',
    UDP: 'UDP',
  };

  const userIceServer = (iceServer, serverConfig) => {
    const { urls } = iceServer;
    return [{
      urls,
      username: serverConfig.iceServers[1].username || null,
      credential: serverConfig.iceServers[1].credential || null,
    }];
  };

  const getConnectionPortsByTurnTransport = (params) => {
    const {
      TURNServerTransport,
      forceTURNSSL,
      udp,
      tcp,
      both,
    } = params;
    const ports = {
      udp: [],
      tcp: [],
      both: [],
    };
    if (TURNServerTransport === TURN_TRANSPORT.UDP && !forceTURNSSL) {
      ports.udp = udp.concat(both);
      ports.tcp = [];
      ports.both = [];
    } else if (TURNServerTransport === TURN_TRANSPORT.TCP) {
      ports.tcp = tcp.concat(both);
      ports.udp = [];
      ports.both = [];
    } else if (TURNServerTransport === TURN_TRANSPORT.NONE) {
      ports.tcp = [];
      ports.udp = [];
    } else {
      ports.tcp = tcp;
      ports.udp = udp;
      ports.both = both;
    }
    return ports;
  };

  const getIceServerPorts = () => defaultIceServerPorts;

  /**
   * @param {RTCIceServer[]} servers - The list of IceServers passed | {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer}
   * @memberOf IceConnectionHelpers
   * @private
   * @return {filteredIceServers}
   */
  const setIceServers = (servers) => {
    const initOptions = Skylink.getInitOptions();
    const serverConfig = {
      iceServerName: null,
      iceServerPorts: getIceServerPorts(),
      iceServerProtocol: CONSTANTS.STUN,
      iceServers: [{ urls: [] }, { urls: [] }],
    };

    const {
      iceServer,
      enableTURNServer,
      forceTURNSSL,
      TURNServerTransport,
      enableSTUNServer,
      usePublicSTUN,
    } = initOptions;

    servers.forEach((server) => {
      if (server.url.indexOf(`${CONSTANTS.STUN}:`) === 0) {
        if (server.url.indexOf(`${CONSTANTS.TEMASYS}`) > 0) {
          // server[?transport=xxx]
          serverConfig.iceServerName = (server.url.split(':')[1] || '').split('?')[0] || null;
        } else {
          serverConfig.iceServers[0].urls.push(server.url);
        }
      } else if (server.url.indexOf('turn:') === 0 && server.url.indexOf('@') > 0 && server.credential && !(serverConfig.iceServers[1].username || serverConfig.iceServers[1].credential)) {
        /* eslint-disable prefer-destructuring */
        const parts = server.url.split(':');
        const urlParts = (parts[1] || '').split('@');
        serverConfig.iceServerName = (urlParts[1] || '').split('?')[0];
        serverConfig.iceServers[1].username = urlParts[0];
        serverConfig.iceServers[1].credential = server.credential;
        serverConfig.iceServerProtocol = CONSTANTS.TURN;
      }
    });

    if (iceServer) {
      return { iceServers: userIceServer(iceServer, serverConfig) };
    }

    serverConfig.iceServerName = serverConfig.iceServerName || CONSTANTS.DEFAULT_TURN_SERVER;

    if (serverConfig.iceServerProtocol === CONSTANTS.TURN && !enableTURNServer && !forceTURNSSL) {
      serverConfig.iceServerProtocol = CONSTANTS.STUN;
    } else {
      const connectionPortsAndProtocolByBrowser = getConnectionPortsAndProtocolByBrowser({
        forceTURNSSL,
        enableTURNServer,
        CONSTANTS,
        serverConfig,
      });
      serverConfig.iceServerPorts.tcp = connectionPortsAndProtocolByBrowser.tcp;
      serverConfig.iceServerPorts.udp = connectionPortsAndProtocolByBrowser.udp;
      serverConfig.iceServerPorts.both = connectionPortsAndProtocolByBrowser.both;
      serverConfig.iceServerProtocol = connectionPortsAndProtocolByBrowser.iceServerProtocol;
    }

    const connectionPortsByTurnTransport = getConnectionPortsByTurnTransport({
      forceTURNSSL,
      TURNServerTransport,
      udp: serverConfig.iceServerPorts.udp,
      tcp: serverConfig.iceServerPorts.tcp,
      both: serverConfig.iceServerPorts.both,
    });

    serverConfig.iceServerPorts.tcp = connectionPortsByTurnTransport.tcp;
    serverConfig.iceServerPorts.udp = connectionPortsByTurnTransport.udp;
    serverConfig.iceServerPorts.both = connectionPortsByTurnTransport.both;

    if (serverConfig.iceServerProtocol === CONSTANTS.STUN) {
      serverConfig.iceServerPorts.tcp = [];
    }

    if (serverConfig.iceServerProtocol === CONSTANTS.STUN && !enableSTUNServer) {
      serverConfig.iceServers = [];
    } else {
      serverConfig.iceServerPorts.tcp.forEach((tcpPort) => {
        serverConfig.iceServers[1].urls.push(`${serverConfig.iceServerProtocol}:${serverConfig.iceServerName}:${tcpPort}?transport=tcp`);
      });

      serverConfig.iceServerPorts.udp.forEach((udpPort) => {
        serverConfig.iceServers[1].urls.push(`${serverConfig.iceServerProtocol}:${serverConfig.iceServerName}:${udpPort}?transport=udp`);
      });

      serverConfig.iceServerPorts.both.forEach((bothPort) => {
        serverConfig.iceServers[1].urls.push(`${serverConfig.iceServerProtocol}:${serverConfig.iceServerName}:${bothPort}`);
      });

      if (!usePublicSTUN) {
        serverConfig.iceServers.splice(0, 1);
      }

      return {
        iceServers: serverConfig.iceServers,
      };
    }
    return null;
  };

  /**
   * @param {String} targetMid
   * @param {SkylinkRoom} room
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateFromQueue = (targetMid, room) => {
    const state = Skylink.getSkylinkState(room.id);
    const peerCandidatesQueue = state.peerCandidatesQueue[targetMid] || [];
    const peerConnection = state.peerConnections[targetMid];
    const { TAGS, PEER_CONNECTION_STATE } = SkylinkConstants;

    for (let i = 0; i < peerCandidatesQueue.length; i += 1) {
      const candidateArray = peerCandidatesQueue[i];

      if (candidateArray) {
        const nativeCandidate = candidateArray[1];
        const candidateId = candidateArray[0];
        const candidateType = nativeCandidate.candidate.split(' ')[7];
        logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, MESSAGES.ICE_CANDIDATE.ADD_BUFFERED_CANDIDATE]);
        IceConnection.addIceCandidate(targetMid, candidateId, candidateType, nativeCandidate, state);
      } else if (peerConnection && peerConnection.signalingState !== PEER_CONNECTION_STATE.CLOSED) {
        try {
          peerConnection.addIceCandidate(null);
          logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_ADDED]);
        } catch (ex) {
          logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.FAILED_ADDING_CANDIDATE]);
        }
      }
    }

    delete state.peerCandidatesQueue[targetMid];
    PeerConnection.signalingEndOfCandidates(targetMid, state);
  };

  class HandleIceCandidateStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        peer_id: null,
        state: null,
        is_remote: false,
        candidate_id: null,
        candidate_sdp_mid: null,
        candidate_sdp_mindex: null,
        candidate_candidate: null,
        error: null,
      };
    }

    send(roomKey, state, peerId, candidateId, candidate, error) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;
      this.model.client_id = roomState.clientId;
      this.model.state = state;
      this.model.is_remote = !!candidateId;
      this.model.candidate_id = candidateId || null;
      this.model.candidate_sdp_mid = candidate.sdpMid;
      this.model.candidate_sdp_mindex = candidate.sdpMLineIndex;
      this.model.candidate_candidate = candidate.candidate;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.error = (typeof error === 'string' ? error : (error && error.message)) || null;

      this.addToStatsBuffer('iceCandidate', this.model, this.endpoints.iceCandidate);
      this.manageStatsBuffer();
    }
  }

  const handleIceCandidateStats = new HandleIceCandidateStats();

  /**
   * Success callback for adding an IceCandidate
   * @param {SkylinkRoom} room - The current room
   * @param {String} targetMid - The mid of the target peer
   * @param {String} candidateId - The id of the ICE Candidate
   * @param {String} candidateType - Type of the ICE Candidate
   * @param {RTCIceCandidate} candidate - An RTCIceCandidate Object
   * @fires CANDIDATE_PROCESSING_STATE
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateSuccess = (room, targetMid, candidateId, candidateType, candidate) => {
    const { STATS_MODULE, ICE_CANDIDATE } = MESSAGES;
    const { CANDIDATE_PROCESSING_STATE, TAGS } = SkylinkConstants;

    logger.log.INFO([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.CANDIDATE_ADDED]);
    dispatchEvent(candidateProcessingState({
      room: Room.getRoomInfo(room.id),
      state: CANDIDATE_PROCESSING_STATE.PROCESS_SUCCESS,
      peerId: targetMid,
      candidateId,
      candidateType,
      candidate,
      error: null,
    }));
    handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.PROCESS_SUCCESS, targetMid, candidateId, candidate);
  };

  /**
   * Failure callback for adding an IceCandidate
   * @param {SkylinkRoom} room - The current room
   * @param {String} targetMid - The mid of the target peer
   * @param {String} candidateId - The id of the ICE Candidate
   * @param {String} candidateType - Type of the ICE Candidate
   * @param {RTCIceCandidate} candidate - An RTCIceCandidate Object
   * @param {Error} error - Error
   * @fires CANDIDATE_PROCESSING_STATE
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateFailure = (room, targetMid, candidateId, candidateType, candidate, error) => {
    const { STATS_MODULE, ICE_CANDIDATE } = MESSAGES;
    const { CANDIDATE_PROCESSING_STATE, TAGS } = SkylinkConstants;

    logger.log.ERROR([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.FAILED_ADDING_CANDIDATE], error);
    dispatchEvent(candidateProcessingState({
      room: Room.getRoomInfo(room.id),
      state: CANDIDATE_PROCESSING_STATE.PROCESS_ERROR,
      peerId: targetMid,
      candidateId,
      candidateType,
      candidate,
      error,
    }));
    handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.PROCESS_FAILED, targetMid, candidateId, candidate, error);
  };

  /**
   * @param {String} targetMid - The mid of the target peer
   * @param {String} candidateId - The id of the ICE Candidate
   * @param {String} candidateType - Type of the ICE Candidate
   * @param {RTCIceCandidate} nativeCandidate - An RTCIceCandidate Object
   * @param {SkylinkState} roomState - Skylink State
   * @fires CANDIDATE_PROCESSING_STATE
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidate = (targetMid, candidateId, candidateType, nativeCandidate, roomState) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { peerConnections, room } = state;
    const peerConnection = peerConnections[targetMid];
    const candidate = {
      candidate: nativeCandidate.candidate,
      sdpMid: nativeCandidate.sdpMid,
      sdpMLineIndex: nativeCandidate.sdpMLineIndex,
    };
    const { STATS_MODULE, ICE_CANDIDATE, PEER_CONNECTION } = MESSAGES;
    const { CANDIDATE_PROCESSING_STATE, PEER_CONNECTION_STATE, TAGS } = SkylinkConstants;

    logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.ADDING_CANDIDATE]);
    dispatchEvent(candidateProcessingState({
      peerId: targetMid,
      room: Room.getRoomInfo(room.id),
      candidateType,
      candidate,
      candidateId,
      state: CANDIDATE_PROCESSING_STATE.PROCESSING,
      error: null,
    }));
    handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.PROCESSING, targetMid, candidateId, candidate);

    if (!(peerConnection
      && peerConnection.signalingState !== PEER_CONNECTION_STATE.CLOSED
      && peerConnection.remoteDescription
      && peerConnection.remoteDescription.sdp
      && peerConnection.remoteDescription.sdp.indexOf(`\r\na=mid:${candidate.sdpMid}\r\n`) > -1)) {
      logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, `${ICE_CANDIDATE.DROPPING_CANDIDATE} - ${PEER_CONNECTION.NO_PEER_CONNECTION}`]);

      dispatchEvent(candidateProcessingState({
        peerId: targetMid,
        room: Room.getRoomInfo(room.id),
        candidateType,
        candidate,
        candidateId,
        state: CANDIDATE_PROCESSING_STATE$1.DROPPED,
        error: new Error(PEER_CONNECTION.NO_PEER_CONNECTION),
      }));
      handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.PROCESS_FAILED, targetMid, candidateId, candidate, PEER_CONNECTION.NO_PEER_CONNECTION);
    }

    try {
      peerConnection.addIceCandidate(candidate)
        .then(() => { addIceCandidateSuccess(room, targetMid, candidateId, candidateType, candidate); })
        .catch((error) => { addIceCandidateFailure(room, targetMid, candidateId, candidateType, candidate, error); });
    } catch (error) {
      addIceCandidateFailure.bind(peerConnection, room, targetMid, candidateId, candidateType, candidate, error);
    }
  };

  class HandleIceGatheringStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        peer_id: null,
        state: null,
        is_remote: null,
        bundlePolicy: null,
        rtcpMuxPolicy: null,
      };
    }

    send(roomkey, state, peerId, isRemote) {
      const roomState = Skylink.getSkylinkState(roomkey);

      this.model.client_id = roomState.clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.room_id = roomkey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;
      this.model.state = state;
      this.model.is_remote = isRemote;
      this.model.bundlePolicy = retrieveConfig('PEER_CONNECTION').bundlePolicy;
      this.model.rtcpMuxPolicy = retrieveConfig('PEER_CONNECTION').rtcpMuxPolicy;

      this.addToStatsBuffer('iceGathering', this.model, this.endpoints.iceGathering);
      this.manageStatsBuffer();
    }
  }

  const handleIceGatheringStats = new HandleIceGatheringStats();

  /**
   * @param targetMid - The mid of the target peer
   * @param {RTCIceCandidate} candidate - {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate}
   * @param {SkylinkRoom} currentRoom - Current room
   * @memberOf IceConnectionHelpers
   * @fires CANDIDATE_GENERATION_STATE
   * @private
   * @return {null}
   */
  const onIceCandidate = (targetMid, candidate, currentRoom) => {
    const state = Skylink.getSkylinkState(currentRoom.id);
    const peerConnection = state.peerConnections[targetMid];
    const signalingServer = new SkylinkSignalingServer();
    let gatheredCandidates = state.gatheredCandidates[targetMid];
    const { CANDIDATE_GENERATION_STATE, TAGS } = SkylinkConstants;

    if (!peerConnection) {
      logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.PEER_CONNECTION.NO_PEER_CONNECTION], candidate);
      return null;
    }

    if (candidate.candidate) {
      if (!peerConnection.gathering) {
        logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CONNECTION.ICE_GATHERING_STARTED], candidate);
        peerConnection.gathering = true;
        peerConnection.gathered = false;
        dispatchEvent(candidateGenerationState({
          room: Room.getRoomInfo(currentRoom.id),
          peerId: targetMid,
          state: CANDIDATE_GENERATION_STATE$1.GATHERING,
        }));
        handleIceGatheringStats.send(currentRoom.id, CANDIDATE_GENERATION_STATE.GATHERING, targetMid, false);
      }

      const candidateType = candidate.candidate.split(' ')[7];
      logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_GENERATED], candidate);

      if (candidateType === 'endOfCandidates' || !(peerConnection
        && peerConnection.localDescription && peerConnection.localDescription.sdp
        && peerConnection.localDescription.sdp.indexOf(`\r\na=mid:${candidate.sdpMid}\r\n`) > -1)) {
        logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CONNECTION.DROP_EOC], candidate);
        return null;
      }

      if (!gatheredCandidates) {
        gatheredCandidates = {
          sending: { host: [], srflx: [], relay: [] },
          receiving: { host: [], srflx: [], relay: [] },
        };
      }

      gatheredCandidates.sending[candidateType].push({
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
        candidate: candidate.candidate,
      });

      state.gatheredCandidates[targetMid] = gatheredCandidates;
      Skylink.setSkylinkState(state, currentRoom.id);

      logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.SENDING_CANDIDATE], candidate);

      signalingServer.sendCandidate(targetMid, state, candidate);
    } else {
      logger.log.INFO([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CONNECTION.ICE_GATHERING_COMPLETED]);

      if (peerConnection.gathered) {
        return null;
      }

      peerConnection.gathering = false;
      peerConnection.gathered = true;

      dispatchEvent(candidateGenerationState({
        peerId: targetMid,
        state: CANDIDATE_GENERATION_STATE$1.COMPLETED,
        room: currentRoom,
      }));
      handleIceGatheringStats.send(currentRoom.id, CANDIDATE_GENERATION_STATE.COMPLETED, targetMid, false);

      if (state.gatheredCandidates[targetMid]) {
        const sendEndOfCandidates = () => {
          if (!state.gatheredCandidates[targetMid]) return;
          const currentState = Skylink.getSkylinkState(currentRoom.id);
          if (!currentState) {
            logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, null, `${MESSAGES.ICE_CONNECTION.DROP_EOC} peer has left the room`]);
            return;
          }

          signalingServer.sendMessage({
            type: SIG_MESSAGE_TYPE.END_OF_CANDIDATES,
            noOfExpectedCandidates: state.gatheredCandidates[targetMid].sending.srflx.length + state.gatheredCandidates[targetMid].sending.host.length + state.gatheredCandidates[targetMid].sending.relay.length,
            mid: state.user.sid,
            target: targetMid,
            rid: currentRoom.id,
          });
        };
        setTimeout(sendEndOfCandidates, 6000);
      }
    }
    return null;
  };

  /**
   * Method that buffers candidates
   * @param {String} targetMid
   * @param {String} candidateId
   * @param {String} candidateType
   * @param {RTCIceCandidate} nativeCandidate
   * @param {SkylinkState} state
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateToQueue = (targetMid, candidateId, candidateType, nativeCandidate, state) => {
    const { STATS_MODULE: { HANDLE_ICE_GATHERING_STATS } } = MESSAGES;
    const updatedState = state;
    const { room } = updatedState;
    const handleIceCandidateStats = new HandleIceCandidateStats();

    logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, MESSAGES.ICE_CANDIDATE.ADD_CANDIDATE_TO_BUFFER]);

    handleIceCandidateStats.send(room.id, HANDLE_ICE_GATHERING_STATS.BUFFERED, targetMid, candidateId, nativeCandidate);
    dispatchEvent(candidateProcessingState({
      room: Room.getRoomInfo(room.id),
      state: CANDIDATE_PROCESSING_STATE$1.BUFFERED,
      peerId: targetMid,
      candidateId,
      candidateType,
      candidate: nativeCandidate.candidate,
      error: null,
    }));

    updatedState.peerCandidatesQueue[targetMid] = updatedState.peerCandidatesQueue[targetMid] || [];
    updatedState.peerCandidatesQueue[targetMid].push([candidateId, nativeCandidate]);
    Skylink.setSkylinkState(updatedState, room.id);
  };

  /**
   * @namespace IceConnectionHelpers
   * @description All helper and utility functions for <code>{@link IceConnection}</code> class are listed here.
   * @private
   * @type {{setIceServers, addIceCandidateFromQueue, addIceCandidate, onIceCandidate, addIceCandidateToQueue}}
   */
  const helpers$3 = {
    setIceServers,
    addIceCandidateFromQueue,
    addIceCandidate,
    onIceCandidate,
    addIceCandidateToQueue,
  };

  /**
   * @classdesc Class representing an IceConnection. Helper methods are listed inside <code>{@link IceConnectionHelpers}</code>.
   * @private
   * @class
   */
  class IceConnection {
    /**
     * @description Function that filters and configures the ICE servers received from Signaling
     * based on the <code>init()</code> configuration and returns the updated list of ICE servers to be used when constructing Peer connection.
     * @param {RTCIceServer[]} iceServers - The list of IceServers passed | {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer}
     * @return {filteredIceServers}
     */
    static setIceServers(iceServers) {
      return helpers$3.setIceServers(iceServers);
    }

    /**
     * @description Function that adds all the Peer connection buffered ICE candidates received.
     * This should be called only after the remote session description is received and set.
     * @param {String} targetMid - The mid of the target peer
     * @param {SkylinkRoom} room - Current Room
     */
    static addIceCandidateFromQueue(targetMid, room) {
      return helpers$3.addIceCandidateFromQueue(targetMid, room);
    }

    static addIceCandidateToQueue(targetMid, candidateId, candidateType, nativeCandidate, state) {
      return helpers$3.addIceCandidateToQueue(targetMid, candidateId, candidateType, nativeCandidate, state);
    }

    /**
     * Function that adds the ICE candidate to Peer connection.
     * @param {String} targetMid - The mid of the target peer
     * @param {String} candidateId - The id of the ICE Candidate
     * @param {String} candidateType - Type of the ICE Candidate
     * @param {RTCIceCandidate} nativeCandidate - An RTCIceCandidate Object | {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate}
     * @param {SkylinkState} roomState - Skylink State
     * @fires CANDIDATE_PROCESSING_STATE
     */
    static addIceCandidate(targetMid, candidateId, candidateType, nativeCandidate, roomState) {
      return helpers$3.addIceCandidate(targetMid, candidateId, candidateType, nativeCandidate, roomState);
    }

    /**
     *
     * @param targetMid - The mid of the target peer
     * @param {RTCPeerConnectionIceEvent} rtcIceConnectionEvent - {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnectionIceEvent}
     * @param {SkylinkRoom} room - Current room
     * @fires CANDIDATE_GENERATION_STATE
     * @return {null}
     */
    static onIceCandidate(targetMid, rtcIceConnectionEvent, room) {
      return helpers$3.onIceCandidate(targetMid, rtcIceConnectionEvent, room);
    }
  }

  // requires the mid to be set after setOffer both local or remote
  const retrieveTransceiverMid = (room, track) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const { peerConnections } = roomState;
    const RTCPeerConnections = Object.values(peerConnections);
    let transceiverMid = null;

    for (let p = 0; p < RTCPeerConnections.length; p += 1) {
      const transceivers = RTCPeerConnections[p].getTransceivers();
      for (let t = 0; t < transceivers.length; t += 1) {
        if (transceivers[t].sender.track && transceivers[t].sender.track.id === track.id) {
          transceiverMid = transceivers[t].mid;
          break;
        }
      }
    }
    return transceiverMid;
  };

  const retrieveMediaState = (track) => {
    if (track.readyState === TRACK_READY_STATE.ENDED) {
      return MEDIA_STATE.UNAVAILABLE;
    } if (track.muted) {
      return MEDIA_STATE.MUTED;
    }
    return MEDIA_STATE.ACTIVE;
  };

  const retrieveMediaId = (trackKind, streamId) => {
    const prefix = trackKind === TRACK_KIND.AUDIO ? 'AUDIO' : 'VIDEO';
    return `${prefix}_${streamId}`;
  };

  const buildPeerMediaInfo = (room, mid, track, streamId, mediaType) => ({
    publisherId: mid,
    mediaId: helpers$5.retrieveMediaId(track.kind, streamId),
    mediaType,
    mediaState: helpers$5.retrieveMediaState(track),
    transceiverMid: helpers$5.retrieveTransceiverMid(room, track),
    streamId,
    trackId: track.id,
    mediaMetaData: '',
    simulcast: '',
  });

  const isMatchedTrack = (streamTrack, track) => streamTrack.id === track.id;

  const retrieveStreamIdOfTrack = (room, track) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerStreams, user } = state;
    const streams = Object.values(peerStreams[user.sid]);
    let streamId = null;

    for (let i = 0; i < streams.length; i += 1) {
      const tracks = streams[i].getTracks();

      for (let j = 0; j < tracks.length; j += 1) {
        if (isMatchedTrack(tracks[j], track)) {
          streamId = streams[i].id;
          break;
        }
      }
    }

    return streamId;
  };

  const doUpdate = (room, peerId, dispatchEvent, mediaId, key = false, value = false, mediaInfo = false) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    // Check for key + value || mediaInfo but not both
    if (!mediaInfo && key && value) {
      updatedState.peerMedias[peerId][mediaId][key] = value;
      logger.log.INFO([peerId, TAGS.PEER_MEDIA, null, `${MESSAGES.MEDIA_INFO.UPDATE_SUCCESS} -- ${mediaId} - ${key}: ${value}`]);
    } else if (mediaInfo && !key && !value) {
      updatedState.peerMedias[peerId] = updatedState.peerMedias[peerId] || {};
      updatedState.peerMedias[peerId][mediaId] = mediaInfo;
    }

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const dispatchMediaInfoMsg = (room, peerId, dispatchEvent, mediaId) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    if (updatedState.user.sid === peerId && dispatchEvent) {
      // Note: mediaInfoMsg currently only dispatched during mute/unmute events - transceiverMid not sent
      helpers$5.sendMediaInfoMsg(room, updatedState.peerMedias[peerId][mediaId]);
    }
  };

  // dispatch event when:
  // 1) not from offer and answer
  // 2) self mediaInfo is updated
  // 3) a new stream (with new mediaInfo obj) will replace an existing stream - e.g. screen share, send stream

  const updatePeerMediaInfo = (room, peerId, dispatchEvent, mediaId, key = false, value = false, mediaInfo = false) => {
    try {
      doUpdate(room, peerId, dispatchEvent, mediaId, key, value, mediaInfo);
      dispatchMediaInfoMsg(room, peerId, dispatchEvent, mediaId);
    } catch (err) {
      const msg = mediaInfo ? JSON.stringify(mediaInfo) : `${mediaId} - ${key}: ${value}`;
      logger.log.ERROR([peerId, TAGS.PEER_MEDIA, null, `${MESSAGES.MEDIA_INFO.ERRORS.FAILED_UPDATING} -- ${msg}`], err);
    }
  };

  const sendMediaInfoMsg = (room, updatedMediaInfo) => {
    const signaling = new SkylinkSignalingServer();
    const state = Skylink.getSkylinkState(room.id);
    const { user, hasMCU, peerConnections } = state;
    const peerIds = hasMCU ? [PEER_TYPE.MCU] : Object.keys(peerConnections).filter(peerId => (peerId !== user.sid) && (peerId !== PEER_TYPE.MCU));

    peerIds.forEach((target) => {
      signaling.mediaInfoEvent(state, target, updatedMediaInfo);
    });
  };

  const parseSDPForTransceiverMid = (room, peerId, sessionDescription) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerMedias } = state;
    const { beSilentOnParseLogs } = Skylink.getInitOptions();
    const mediaInfos = Object.values(peerMedias[peerId]);
    const mediaMids = SessionDescription.getTransceiverMid(sessionDescription, beSilentOnParseLogs);
    const audioMids = mediaMids.audio;
    const videoMids = mediaMids.video;

    for (let m = 0; m < mediaInfos.length; m += 1) {
      const mediaInfo = mediaInfos[m];
      // If mediaState is unavailable, there is no corresponding transceiverMid in the SDP and mediaInfo.transceiverMid will be 'null'. mediaInfo.transceiverMid cannot be 'null'.
      mediaInfo.transceiverMid = mediaInfo.mediaState === MEDIA_STATE.UNAVAILABLE ? mediaInfo.transceiverMid : null;
      for (let a = 0; a < audioMids.length; a += 1) {
        if (audioMids[a].streamId === mediaInfo.streamId && (audioMids[a].direction === 'sendonly' || audioMids[a].direction === 'sendrecv')) {
          helpers$5.updatePeerMediaInfo(room, peerId, false, mediaInfo.mediaId, MEDIA_INFO.TRANSCEIVER_MID, audioMids[a].transceiverMid);
          break;
        }
      }

      for (let v = 0; v < videoMids.length; v += 1) {
        if (videoMids[v].streamId === mediaInfo.streamId && (videoMids[v].direction === 'sendonly' || videoMids[v].direction === 'sendrecv')) {
          helpers$5.updatePeerMediaInfo(room, peerId, false, mediaInfo.mediaId, MEDIA_INFO.TRANSCEIVER_MID, videoMids[v].transceiverMid);
          break;
        }
      }
    }
  };

  const retrieveValueGivenTransceiverMid = (state, peerId, transceiverMid, key) => {
    const { peerMedias } = state;
    const mediaInfos = Object.values(peerMedias[peerId]);
    for (let m = 0; m < mediaInfos.length; m += 1) {
      if (mediaInfos[m].transceiverMid === transceiverMid) {
        return mediaInfos[m][key];
      }
    }

    return null;
  };

  const retrieveFormattedMediaInfo = (room, peerId) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerMedias } = state;
    const mediaInfos = Object.values(peerMedias[peerId]);
    const formattedMediaInfos = [];

    for (let m = 0; m < mediaInfos.length; m += 1) {
      const mediaInfo = mediaInfos[m];
      const clonedMediaInfo = clone_1(mediaInfo);
      delete clonedMediaInfo.trackId;
      delete clonedMediaInfo.streamId;
      formattedMediaInfos.push(clonedMediaInfo);
    }

    return formattedMediaInfos;
  };

  const resetPeerMedia = (room, peerId) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    const peerMedia = updatedState.peerMedias[peerId];

    if (peerMedia) {
      updatedState.peerMedias[peerId] = {};
    }

    return updatedState;
  };

  // peerMedia will have a previous state if setPeerMediaInfo is called from renegotiation
  const peerMediaHasPreviousState = (clonedPeerMedia, mediaId) => !isEmptyObj(clonedPeerMedia) && clonedPeerMedia[mediaId];

  const populatePeerMediaInfo = (updatedState, clonedPeerMedia, mediaInfo) => {
    const peerMedia = updatedState.peerMedias[mediaInfo.publisherId] || {};
    peerMedia[mediaInfo.mediaId] = mediaInfo;

    if (peerMediaHasPreviousState(clonedPeerMedia, mediaInfo.mediaId)) {
      peerMedia[mediaInfo.mediaId].streamId = (mediaInfo.transceiverMid === clonedPeerMedia[mediaInfo.mediaId].transceiverMid) ? clonedPeerMedia[mediaInfo.mediaId].streamId : '';
    }

    return peerMedia;
  };

  // eslint-disable-next-line consistent-return
  const prepStopStreams = (roomId, streamId, fromLeaveRoom = false, isScreensharing = false) => new Promise((resolve, reject) => {
    const state = Skylink.getSkylinkState(roomId);
    const { user, peerStreams } = state;
    if (!state) {
      reject(new Error(`${MESSAGES.ROOM_STATE.NOT_FOUND} - ${roomId}`));
    }

    if (!peerStreams[user.sid] || (streamId && !peerStreams[user.sid][streamId])) {
      reject(new Error(`${MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM} - ${streamId}`));
    }

    if (isScreensharing) {
      stopStreamHelpers.prepStopScreenStream(state.room, streamId, fromLeaveRoom)
        .then(() => resolve())
        .catch(rej => reject(rej));
    } else {
      stopStreamHelpers.prepStopUserMediaStreams(state, streamId, fromLeaveRoom)
        .then(() => resolve())
        .catch(rej => reject(rej));
    }
  });

  const retrieveUserMediaStreams = (state) => {
    const { peerStreams, user, room } = state;
    const streamIds = Object.keys(peerStreams[user.sid]);
    const streams = streamIds.map((id) => {
      if (!PeerMedia.retrieveScreenMediaInfo(room, user.sid, { streamId: id })) {
        return peerStreams[user.sid][id];
      }
      return null;
    });

    return streams.filter(i => i !== null);
  };

  // eslint-disable-next-line consistent-return
  const prepStopUserMediaStreams = (state, streamId, fromLeaveRoom) => new Promise((resolve, reject) => {
    const { user, peerStreams } = state;
    const mediaStreams = retrieveUserMediaStreams(state);
    const isScreensharing = false;

    try {
      if (!streamId) {
        stopStreamHelpers.stopAddedStreams(state, mediaStreams, isScreensharing, fromLeaveRoom);
      } else {
        const stream = peerStreams[user.sid][streamId];
        stopStreamHelpers.stopAddedStream(state, stream, isScreensharing, fromLeaveRoom);
      }

      return stopStreamHelpers.initRefreshConnectionAndResolve(state.room, fromLeaveRoom, resolve, reject);
    } catch (error) {
      logger.log.DEBUG([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.STOP_USER_MEDIA], error);
      reject(MESSAGES.MEDIA_STREAM.ERRORS.STOP_USER_MEDIA);
    }
  });

  /* eslint-disable camelcase */

  class HandleUserMediaStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        send_audio: null,
        recv_audio: null,
        send_video: null,
        recv_video: null,
        send_screen: null,
        recv_screen: null,
        mode: null,
      };
    }

    // eslint-disable-next-line class-methods-use-this
    getMediaCount(roomState, peerId, streams) {
      let audioCount = 0;
      let videoCount = 0;
      let screenCount = 0;

      const { peerMedias } = roomState;
      Object.values(streams).forEach((stream) => {
        const audioTrack = stream.getAudioTracks()[0]; // there should be only one track per stream
        const videoTrack = stream.getVideoTracks()[0]; // there should be only one track per stream
        if (audioTrack) {
          audioCount += 1;
        } else if (videoTrack) {
          const isScreen = !isEmptyObj(peerMedias) && peerMedias[peerId][`VIDEO_${stream.id}`] && peerMedias[peerId][`VIDEO_${stream.id}`].mediaType === MEDIA_TYPE.VIDEO_SCREEN;

          if (isScreen) {
            screenCount += 1;
          } else {
            videoCount += 1;
          }
        }
      });

      return {
        audioCount,
        videoCount,
        screenCount,
      };
    }

    parseMediaStats(roomState) {
      const { peerStreams, user, peerConnections } = roomState;
      const localStreams = peerStreams[user.sid] || [];

      let send_audio = 0;
      let send_video = 0;
      let send_screen = 0;

      if (!isEmptyObj(peerConnections)) { // count as sending media only if there is a remote peer connected
        const sendMediaCount = this.getMediaCount(roomState, user.sid, localStreams);
        send_audio = sendMediaCount.audioCount;
        send_video = sendMediaCount.videoCount;
        send_screen = sendMediaCount.screenCount;
      }

      let recv_audio = 0;
      let recv_video = 0;
      let recv_screen = 0;

      const peerIds = Object.keys(peerStreams).filter(peerId => peerId !== user.sid);
      peerIds.forEach((peerId) => {
        const remoteStreams = peerStreams[peerId];
        const recvMediaCount = this.getMediaCount(roomState, peerId, remoteStreams);
        recv_audio += recvMediaCount.audioCount;
        recv_video += recvMediaCount.videoCount;
        recv_screen += recvMediaCount.screenCount;
      });

      return {
        send_audio,
        send_video,
        send_screen,
        recv_audio,
        recv_video,
        recv_screen,
      };
    }

    send(roomKey) {
      const roomState = Skylink.getSkylinkState(roomKey);
      this.model.client_id = roomState.clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.mode = roomState.hasMCU ? 'MCU' : 'P2P';

      const mediaStats = this.parseMediaStats(roomState);
      this.model.send_audio = mediaStats.send_audio;
      this.model.recv_audio = mediaStats.recv_audio;
      this.model.send_video = mediaStats.send_video;
      this.model.recv_video = mediaStats.recv_video;
      this.model.send_screen = mediaStats.send_screen;
      this.model.recv_screen = mediaStats.recv_screen;

      this.postStats(this.endpoints.userMedia, this.model);
    }
  }

  class PeerStream {
    static updatePeerStreamWithUserSid(room, sid) {
      const updatedState = Skylink.getSkylinkState(room.id);
      if (!updatedState.peerStreams.null) {
        return;
      }

      updatedState.peerStreams[sid] = Object.assign({}, updatedState.peerStreams.null);
      delete updatedState.peerStreams.null;
      Skylink.setSkylinkState(updatedState, room.id);
    }

    static addStream(peerId, stream = null, roomkey) {
      if (!stream) return;
      const updatedState = Skylink.getSkylinkState(roomkey);
      const { peerStreams } = updatedState;

      if (peerStreams[peerId] && peerStreams[peerId][stream.id]) {
        return;
      }

      peerStreams[peerId] = peerStreams[peerId] || {};
      peerStreams[peerId][stream.id] = stream;
      Skylink.setSkylinkState(updatedState, roomkey);
    }

    static deleteStream(peerId, room, streamId) {
      const updatedState = Skylink.getSkylinkState(room.id);
      const streamIdToRemove = streamId;
      delete updatedState.peerStreams[peerId][streamIdToRemove];

      if (isEmptyObj(updatedState.peerStreams[peerId])) {
        delete updatedState.peerStreams[peerId];
      }

      Skylink.setSkylinkState(updatedState, updatedState.room.id);

      // catch changes in stopped media that happened between the interval
      new HandleUserMediaStats().send(room.id);
    }

    static dispatchStreamEvent(eventName, detail) {
      switch (eventName) {
        case ON_INCOMING_STREAM:
          dispatchEvent(onIncomingStream(detail));
          break;
        case ON_INCOMING_SCREEN_STREAM:
          dispatchEvent(onIncomingScreenStream(detail));
          break;
        case STREAM_ENDED:
          dispatchEvent(streamEnded(detail));
          break;
        case STREAM_MUTED:
          dispatchEvent(streamMuted(detail));
          break;
          // do nothing
      }
    }
  }

  const stopAddedStream = (state, stream, isScreensharing = false, fromLeaveRoom = false) => {
    const { room, user } = state;

    try {
      stopStreamHelpers.tryStopStream(stream, user.sid);

      if (!fromLeaveRoom) {
        stopStreamHelpers.removeTracks(room, stream);
        PeerMedia.setMediaStateToUnavailable(room, user.sid, PeerMedia.retrieveMediaId(stream.getTracks()[0].kind, stream.id));
        PeerStream.deleteStream(user.sid, room, stream.id);
        stopStreamHelpers.listenForEventAndDeleteMediaInfo(room, stream);
        stopStreamHelpers.dispatchEvents(room, stream, isScreensharing);
        stopStreamHelpers.updateMediaStatusMutedSettings(room, stream);

        if (isScreensharing) {
          new ScreenSharing(state).deleteScreensharingInstance(room);
        }
      }

      logger.log.INFO([user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.STOP_SUCCESS} - stream id: ${stream.id} ${(isScreensharing ? '(screenshare)' : '')}`]);
    } catch (err) {
      logger.log.ERROR([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.STOP_ADDED_STREAM], err);
    }
  };

  const stopMediaTracks = (tracks, peerId) => {
    if (!tracks || !tracks[0]) {
      return false;
    }

    tracks.forEach((track) => {
      try {
        track.stop();
      } catch (error) {
        logger.log.ERROR([peerId, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_MEDIA_TRACK} - track id: ${track.id}`], error);
      }
    });

    return true;
  };

  const tryStopStream = (stream, peerId) => {
    if (!stream) return;

    try {
      stopMediaTracks(stream.getAudioTracks());
    } catch (error) {
      logger.log.ERROR([peerId, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_AUDIO_TRACK} - stream id: ${stream.id}`], error);
    }

    try {
      stopMediaTracks(stream.getVideoTracks());
    } catch (error) {
      logger.log.ERROR([peerId, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_VIDEO_TRACK} - stream id: ${stream.id}`], error);
    }
  };

  const removeSenderFromList = (state, peerId, sender) => {
    const { room } = state;
    const updatedState = state;
    let indexToRemove = -1;

    if (!updatedState.currentRTCRTPSenders[peerId]) {
      return;
    }

    const listOfSenders = updatedState.currentRTCRTPSenders[peerId];

    for (let i = 0; i < listOfSenders.length; i += 1) {
      if (sender === listOfSenders[i]) {
        indexToRemove = i;
        break;
      }
    }

    if (indexToRemove !== -1) {
      listOfSenders.splice(indexToRemove, 1);
      updatedState.currentRTCRTPSenders[peerId] = listOfSenders;
      Skylink.setSkylinkState(updatedState, room.id);
    } else {
      logger.log.WARN([peerId, null, null, 'No matching sender was found for the peer.'], sender);
    }
  };

  const removeTrack = (state, peerConnections, track) => {
    const trackId = track.id;
    const peerIds = Object.keys(peerConnections);

    for (let i = 0; i < peerIds.length; i += 1) {
      try {
        const targetMid = peerIds[i];
        const peerConnection = peerConnections[targetMid];

        if (peerConnection.connectionState === PEER_CONNECTION_STATE$1.CLOSED) {
          break;
        }

        const senders = peerConnection.getSenders();
        let sender = null;
        for (let y = 0; y < senders.length; y += 1) {
          if (senders[y].track && senders[y].track.id === trackId) {
            sender = senders[y];
            peerConnection.removeTrack(sender);
            removeSenderFromList(state, targetMid, sender);
          }
        }
      } catch (error) {
        logger.log.ERROR([peerIds[i], TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.ERRORS.REMOVE_TRACK], error);
      }
    }
  };

  /**
   * Function that removes the tracks from the peer connection.
   * @param {SkylinkRoom} room
   * @param {MediaStream} stream
   * @memberOf MediaStreamHelpers
   */
  const removeTracks = (room, stream) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections, user } = state;
    const tracks = stream.getTracks();

    try {
      tracks.forEach((track) => {
        removeTrack(state, peerConnections, track);
      });
    } catch (error) {
      logger.log.ERROR([user.sid, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.ERRORS.REMOVE_TRACK], error);
    }
  };

  const listenForEventAndDeleteMediaInfo = (room, stream) => {
    const state = Skylink.getSkylinkState(room.id);

    const executeOfferCallback = (evt) => {
      const s = stream;
      const { user } = state;
      const { detail } = evt;
      if (detail.state === HANDSHAKE_PROGRESS$1.OFFER) {
        const mediaId = PeerMedia.retrieveMediaId(hasAudioTrack(s) ? TRACK_KIND.AUDIO : TRACK_KIND.VIDEO, s.id);
        PeerMedia.deleteUnavailableMedia(room, user.sid, mediaId);
      }
    };

    const executeMediaDeletedCallback = () => {
      removeEventListener(EVENTS.HANDSHAKE_PROGRESS, executeOfferCallback);
      removeEventListener(EVENTS.MEDIA_INFO_DELETED, executeMediaDeletedCallback);
    };

    addEventListener(EVENTS.HANDSHAKE_PROGRESS, executeOfferCallback);
    addEventListener(EVENTS.MEDIA_INFO_DELETED, executeMediaDeletedCallback);
  };

  const stopAddedStreams = (state, streams, isScreensharing, fromLeaveRoom) => {
    streams.forEach((stream) => {
      stopStreamHelpers.stopAddedStream(state, stream, isScreensharing, fromLeaveRoom);
    });
  };

  const updateMediaInfoMediaState = (room, stream) => {
    const state = Skylink.getSkylinkState(room.id);
    const { user } = state;
    const streamId = stream.id;
    const mediaId = PeerMedia.retrieveMediaId(stream.getTracks()[0].kind, streamId);
    PeerMedia.setMediaStateToUnavailable(room, user.sid, mediaId);
  };

  /**
   * Function that handles the <code>RTCPeerConnection.removeTracks(sender)</code> on the local MediaStream.
   * @param {SkylinkRoom} room
   * @param {MediaStream} stream - The stream.
   * @param {boolean} isScreensharing
   * @memberOf MediaStreamHelpers
   * @fires STREAM_ENDED
   */
  const dispatchEvents = (room, stream, isScreensharing = false) => {
    const state = Skylink.getSkylinkState(room.id);
    const { MEDIA_STREAM } = MESSAGES;
    const { user } = state;
    const isSelf = true;

    logger.log.INFO([user.sid, TAGS.MEDIA_STREAM, null, MEDIA_STREAM.STOP_SETTINGS], {
      peerId: user.sid, isSelf, isScreensharing, stream,
    });

    PeerStream.dispatchStreamEvent(STREAM_ENDED, {
      room: Room.getRoomInfo(room.id),
      peerId: user.sid,
      peerInfo: PeerData.getCurrentSessionInfo(room),
      isSelf,
      isScreensharing,
      streamId: stream.id,
      isVideo: hasVideoTrack(stream),
      isAudio: hasAudioTrack(stream),
    });

    dispatchEvent(mediaAccessStopped({
      isScreensharing,
      streamId: stream.id,
    }));

    dispatchEvent(peerUpdated({
      peerId: user.sid,
      peerInfo: helpers$6.getCurrentSessionInfo(room),
      isSelf: true,
    }));
  };

  const prepStopScreenStream = (room, streamId, fromLeaveRoom = false) => new Promise((resolve, reject) => {
    const state = Skylink.getSkylinkState(room.id);
    const { user, peerStreams } = state;
    const screenStream = peerStreams[user.sid][streamId];
    const isScreensharing = true;

    try {
      stopStreamHelpers.stopAddedStream(state, screenStream, isScreensharing, fromLeaveRoom);
      stopStreamHelpers.initRefreshConnectionAndResolve(state.room, fromLeaveRoom, resolve, reject);
    } catch (error) {
      logger.log.DEBUG([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN], error);
      reject(new Error(MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN));
    }
  });

  const dispatchPeerUpdatedEvent = (roomState) => {
    const { room, user } = roomState;

    dispatchEvent(peerUpdated({
      peerId: user.sid,
      isSelf: true,
      peerInfo: PeerData.getCurrentSessionInfo(room),
    }));
  };

  // eslint-disable-next-line consistent-return
  const initRefreshConnectionAndResolve = (room, fromLeaveRoom, resolve, reject) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;

    try {
      if (!fromLeaveRoom) {
        if (!isEmptyArray(Object.keys(peerConnections))) {
          // eslint-disable-next-line consistent-return
          const executeAnswerAckCallback = (evt) => {
            const { detail } = evt;
            if (detail.state === HANDSHAKE_PROGRESS$1.ANSWER_ACK) {
              return (resolve());
            }
          };

          addEventListener(EVENTS.HANDSHAKE_PROGRESS, executeAnswerAckCallback);

          PeerConnection.refreshConnection(state);
        } else {
          dispatchPeerUpdatedEvent(state);
          PeerMedia.deleteUnavailableMedia(state.room, state.user.sid);
          return resolve();
        }
      }
    } catch (err) {
      reject(err);
    }
  };

  const updateMediaStatusMutedSettings = (room, stream) => {
    const updatedState = Skylink.getSkylinkState(room.id);

    delete updatedState.streamsMediaStatus[stream.id];
    delete updatedState.streamsMutedSettings[stream.id];
    delete updatedState.streamsSettings[stream.id];

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const stopStreamHelpers = {
    prepStopStreams,
    prepStopUserMediaStreams,
    stopAddedStream,
    tryStopStream,
    removeTracks,
    listenForEventAndDeleteMediaInfo,
    stopAddedStreams,
    updateMediaInfoMediaState,
    dispatchEvents,
    prepStopScreenStream,
    initRefreshConnectionAndResolve,
    updateMediaStatusMutedSettings,
  };

  /**
   * @private
   * @classdesc Class used for handling RTCMediaStream. Helper methods are listed inside <code>{@link MediaStreamHelpers}</code>.
   * @class
   */
  class MediaStream {
    /**
     * @description Function that retrieves camera Stream.
     * @param {SkylinkState} state
     * @param {getUserMediaOptions} mediaOptions - The camera Stream configuration options.
     * @return {Promise}
     */
    static getUserMedia(state, mediaOptions = {}) {
      const { room } = state;
      const updatedRoomState = helpers$7.parseMediaOptions(mediaOptions, state);
      const { audio, video } = mediaOptions;
      const useExactConstraints = !!mediaOptions.useExactConstraints;
      Skylink.setSkylinkState(updatedRoomState, room.id);

      return helpers$7.prepMediaAccessRequest({
        useExactConstraints,
        audio,
        video,
        roomKey: room.id,
      });
    }

    /**
     * @description Function that filters user input from getUserMedia public method
     * @param {SkylinkState} roomState
     * @param {getUserMediaOptions} options
     */
    static processUserMediaOptions(roomState, options = null) {
      return new Promise((resolve, reject) => {
        let mediaOptions = {
          audio: true,
          video: true,
        };

        if (!options) {
          logger.log.WARN([roomState.user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.NO_OPTIONS} - ${MESSAGES.MEDIA_STREAM.DEFAULT_OPTIONS}`], mediaOptions);
        }

        if (!isAObj(options)) {
          logger.log.ERROR([roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GUM_OPTIONS], options);
          reject(new Error(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GUM_OPTIONS), null);
        }

        mediaOptions = options;

        const getUserMediaPromise = MediaStream.getUserMedia(roomState, mediaOptions);
        getUserMediaPromise.then((stream) => {
          resolve(stream);
        }).catch((error) => {
          reject(error);
        });
      });
    }

    /**
     * Function that stops the getUserMedia() streams.
     * @param {SkylinkState} roomState
     * @param {String} streamId - The id of the stream to stop if there is more than one getUserMedia stream.
     */
    static stopStreams(roomState, streamId) {
      return stopStreamHelpers.prepStopStreams(roomState.room.id, streamId);
    }

    /**
     * Function that sets User's Stream to send to Peer connection.
     * @param {String} targetMid - The mid of the target peer
     * @param {SkylinkState} roomState - Skylink State of current room
     */
    static addLocalMediaStreams(targetMid, roomState) {
      helpers$7.addLocalMediaStreams(targetMid, roomState);
    }

    /**
     * Function that handles the <code>RTCPeerConnection.ontrack</code> event on remote stream added.
     * @param {MediaStream} stream - {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream}
     * @param {SkylinkState} currentRoomState - Current room state
     * @param {String} targetMid - The mid of the target peer
     * @param {boolean} [isScreensharing=false] - The flag if stream is a screenshare stream.
     */
    static onRemoteTrackAdded(stream, currentRoomState, targetMid, isScreensharing, isVideo, isAudio) {
      helpers$7.onRemoteTrackAdded(stream, currentRoomState, targetMid, isScreensharing, isVideo, isAudio);
    }

    /**
     * Function that mutes the stream.
     * @param {SkylinkState} roomState
     * @param {Object} options
     * @param {boolean} options.audioMuted
     * @param {boolean} options.videoMuted
     * @param {String} streamId
     */
    static muteStreams(roomState, options, streamId) {
      return helpers$7.muteStreams(roomState, options, streamId);
    }

    /**
     * Function that sends the MediaStream object if present or mediaStream settings.
     * @param {SkylinkState} roomState
     * @param {MediaStream|Object} options
     */
    static sendStream(roomState, options) {
      return helpers$7.sendStream(roomState, options);
    }

    static getStreamSources() {
      return helpers$7.getStreamSources();
    }

    /**
     * Function that returns all active streams including screenshare stream if present.
     * @param {SkylinkState} roomState
     * @param {boolean} includeSelf
     * @return {streamList} streamList
     */
    static getStreams(roomState, includeSelf) {
      return helpers$7.getStreams(roomState, includeSelf);
    }

    static usePrefetchedStream(roomKey, prefetchedStream) {
      return new Promise((resolve) => {
        const streamOptions = { audio: prefetchedStream.getAudioTracks().length !== 0, video: prefetchedStream.getVideoTracks().length !== 0 };
        const audioSettings = helpers$7.parseStreamSettings(streamOptions, TRACK_KIND.AUDIO);
        const videoSettings = helpers$7.parseStreamSettings(streamOptions, TRACK_KIND.VIDEO);
        const isAudioFallback = false;
        const stream = helpers$7.onStreamAccessSuccess(roomKey, prefetchedStream, audioSettings, videoSettings, isAudioFallback, false, true);

        resolve(stream);
      });
    }

    static processPrefetchedStreams(roomKey, prefetchedStreams, options = null) {
      return new Promise((resolve, reject) => {
        const streams = [];
        if (prefetchedStreams && options.id) {
          reject(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_PREFETCHED_STREAMS);
          return;
        }

        if (!prefetchedStreams) {
          if (options.id && options.active) { // mediaStream as first argument
            streams.push(options);
          } else if (Array.isArray(options)) { // array of mediaStreams as first argument
            options.forEach((mediaStream) => {
              if (mediaStream && mediaStream.id && mediaStream.active) {
                streams.push(mediaStream);
              }
            });
          }
        } else if (Array.isArray(prefetchedStreams)) { // array of mediaStreams as prefetchedStreams param
          prefetchedStreams.forEach((mediaStream) => {
            if (mediaStream && mediaStream.id && mediaStream.active) {
              streams.push(mediaStream);
            }
          });
        } else {
          streams.push(prefetchedStreams); // mediaStream as prefetchedStreams param
        }

        if (isEmptyArray(streams)) {
          reject(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_PREFETCHED_STREAMS);
          return;
        }

        const usePrefetchedStreamPromises = [];
        streams.forEach((stream) => {
          usePrefetchedStreamPromises.push(MediaStream.usePrefetchedStream(roomKey, stream));
        });

        Promise.all(usePrefetchedStreamPromises)
          .then(result => resolve(result));
      });
    }

    static buildStreamSettings(room, stream, settings) {
      return helpers$7.buildStreamSettings(room, stream, settings);
    }
  }

  class HandleNegotiationStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        peer_id: null,
        state: null,
        is_remote: null,
        weight: null,
        sdp_type: null,
        sdp_sdp: null,
        error: null,
      };
    }

    send(roomKey, state, peerId, sdpOrMessage, isRemote, error) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.client_id = roomState.clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;
      this.model.state = state;
      this.model.is_remote = isRemote;
      this.model.weight = sdpOrMessage.weight || null;
      this.model.error = (typeof error === 'string' ? error : (error && error.msg)) || null;
      this.model.sdp_type = null;
      this.model.sdp_sdp = null;

      // Retrieve the weight for states where the "weight" field is not available.
      if (['enter', 'welcome'].indexOf(this.model.state) === -1) {
        // Retrieve the peer's weight if it from remote end.
        this.model.weight = this.model.is_remote && PeerData.getPeerInfo(this.model.peer_id, roomState.room).config && PeerData.getPeerInfo(this.model.peer_id, roomState.room).config.priorityWeight ? PeerData.getPeerInfo(this.model.peer_id, roomState.room).config.priorityWeight : PeerData.getCurrentSessionInfo(roomState.room).config.priorityWeight;
        this.model.sdp_type = (sdpOrMessage && sdpOrMessage.type) || null;
        this.model.sdp_sdp = (sdpOrMessage && sdpOrMessage.sdp) || null;
      }

      this.addToStatsBuffer('negotiation', this.model, this.endpoints.negotiation);
      this.manageStatsBuffer();
    }
  }

  const handleNegotationStats = new HandleNegotiationStats();

  const getCommonMessage = (resolve, targetMid, roomState, sessionDescription, restartOfferMsg) => {
    // TODO: Full implementation to be done from _setLocalAndSendMessage under peer-handshake.js
    const state = Skylink.getSkylinkState(roomState.room.id);
    const {
      peerConnections, bufferedLocalOffer, peerPriorityWeight, room,
    } = state;
    const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS } } = MESSAGES;
    const peerConnection = peerConnections[targetMid];
    const sd = {
      type: sessionDescription.type,
      sdp: sessionDescription.sdp,
    };

    peerConnection.processingLocalSDP = true;

    logger.log.INFO([targetMid, 'RTCSessionDescription', sessionDescription.type, 'Local session description updated ->'], sd.sdp);

    if (sessionDescription.type === HANDSHAKE_PROGRESS$1.OFFER) {
      handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS.OFFER.offer, targetMid, sessionDescription, false);

      logger.log.INFO([targetMid, 'RTCSessionDescription', sessionDescription.type, 'Local offer saved.']);
      bufferedLocalOffer[targetMid] = sessionDescription;

      const offer = {
        type: sd.type,
        sdp: sd.sdp,
        mid: state.user.sid,
        target: targetMid,
        rid: roomState.room.id,
        userInfo: PeerData.getUserInfo(roomState.room),
        weight: peerPriorityWeight,
        mediaInfoList: PeerMedia.retrieveMediaInfoForOfferAnswer(room, sd),
      };

      // Merging Restart and Offer messages. The already present keys in offer message will not be overwritten.
      // Only new keys from restartOfferMsg are added.
      if (restartOfferMsg && Object.keys(restartOfferMsg).length) {
        const keys = Object.keys(restartOfferMsg);
        const currentMessageKeys = Object.keys(offer);
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex += 1) {
          const key = keys[keyIndex];
          if (currentMessageKeys.indexOf(key) === -1) {
            offer[key] = restartOfferMsg[key];
          }
        }
      }

      resolve(offer);
    } else {
      handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS.ANSWER.answer, targetMid, sessionDescription, false);

      const answer = {
        type: sd.type,
        sdp: sd.sdp,
        mid: state.user.sid,
        target: targetMid,
        rid: roomState.room.id,
        userInfo: PeerData.getUserInfo(roomState.room),
        mediaInfoList: PeerMedia.retrieveMediaInfoForOfferAnswer(room, sd),
      };

      resolve(answer);
    }
  };

  const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS } } = MESSAGES;

  const onOfferCreated = (resolve, targetMid, roomState, restartOfferMsg, offer) => {
    const { room } = roomState;

    logger.log.DEBUG([targetMid, null, null, 'Created offer'], offer);
    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS.OFFER.create, targetMid, offer, false);

    getCommonMessage(resolve, targetMid, roomState, offer, restartOfferMsg);
  };

  const onOfferFailed = (reject, targetMid, roomState, error) => {
    const { room } = roomState;

    logger.log.ERROR([targetMid, null, null, 'Failed creating an offer:'], error);
    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS.OFFER.create_error, targetMid, null, false, error);
    dispatchEvent(handshakeProgress({
      state: HANDSHAKE_PROGRESS$1.ERROR,
      peerId: targetMid,
      error,
      room: Room.getRoomInfo(roomState.room.id),
    }));
    reject(error);
  };

  /**
   * @param {SkylinkRoom} currentRoom
   * @param {String} targetMid
   * @param {Boolean} iceRestart
   * @param {object} restartOfferMsg
   * @return {*}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires HANDSHAKE_PROGRESS
   */
  const createOffer = (currentRoom, targetMid, iceRestart = false, restartOfferMsg) => {
    const state = Skylink.getSkylinkState(currentRoom.id);
    const initOptions = Skylink.getInitOptions();
    const { enableDataChannel } = initOptions;
    const {
      peerConnections,
      hasMCU,
      enableIceRestart,
      peerInformations,
      voiceActivityDetection,
      dataChannels,
    } = state;
    const peerConnection = peerConnections[targetMid];

    const offerConstraints = {
      iceRestart: !!((peerInformations[targetMid] || {}).config || {}).enableIceRestart && iceRestart && enableIceRestart,
      voiceActivityDetection,
    };

    if (hasMCU && typeof peerConnection.addTransceiver !== 'function') {
      offerConstraints.offerToReceiveVideo = true;
    }

    // Add stream only at offer/answer end
    if (!hasMCU || targetMid === PEER_TYPE.MCU) {
      MediaStream.addLocalMediaStreams(targetMid, state);
    }

    if (enableDataChannel && peerInformations[targetMid].config.enableDataChannel) {
      if (!(dataChannels[targetMid] && dataChannels[targetMid].main)) {
        PeerConnection.createDataChannel({
          peerId: targetMid,
          roomState: state,
          createAsMessagingChannel: true,
        });
        state.peerConnections[targetMid].hasMainChannel = true;
      }
    }

    logger.log.DEBUG([targetMid, null, null, 'Creating offer with config:'], offerConstraints);

    peerConnection.endOfCandidates = false;
    peerConnection.negotiating = true;
    peerConnection.sdpConstraints = offerConstraints;

    Skylink.setSkylinkState(state, currentRoom.id);

    return new Promise((resolve, reject) => {
      peerConnection.createOffer(offerConstraints)
        .then(offer => onOfferCreated(resolve, targetMid, state, restartOfferMsg, offer))
        .catch(error => onOfferFailed(reject, targetMid, state, error));
    });
  };

  const createNativePeerConnection = (targetMid, constraints, hasScreenShare, currentRoom) => {
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(currentRoom.id);
    logger.log.DEBUG([targetMid, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.CREATE_NEW], {
      constraints,
    });
    const { RTCPeerConnection, msRTCPeerConnection } = window;
    const rtcPeerConnection = new (initOptions.useEdgeWebRTC && msRTCPeerConnection ? window.msRTCPeerConnection : RTCPeerConnection)(constraints);
    const callbackExtraParams = [rtcPeerConnection, targetMid, state];

    // attributes (added on by Temasys)
    rtcPeerConnection.setOffer = '';
    rtcPeerConnection.setAnswer = '';
    rtcPeerConnection.negotiating = false;
    rtcPeerConnection.hasMainChannel = false;
    rtcPeerConnection.processingLocalSDP = false;
    rtcPeerConnection.processingRemoteSDP = false;
    rtcPeerConnection.gathered = false;
    rtcPeerConnection.gathering = false;

    // candidates
    state.gatheredCandidates[targetMid] = {
      sending: { host: [], srflx: [], relay: [] },
      receiving: { host: [], srflx: [], relay: [] },
    };

    state.peerEndOfCandidatesCounter[targetMid] = state.peerEndOfCandidatesCounter[targetMid] || {};

    // FIXME: ESS-1620 - To check if still needed
    if (targetMid === PEER_TYPE.MCU) {
      logger.log.INFO('Creating an empty transceiver of kind video with MCU');
      if (typeof rtcPeerConnection.addTransceiver === 'function') {
        rtcPeerConnection.addTransceiver('video');
      }
    }

    if (rtcPeerConnection.restartIce) {
      state.enableIceRestart = true;
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    /* CALLBACKS */
    rtcPeerConnection.ontrack = callbacks$2.ontrack.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.ondatachannel = callbacks$2.ondatachannel.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onicecandidate = callbacks$2.onicecandidate.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.oniceconnectionstatechange = callbacks$2.oniceconnectionstatechange.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onconnectionstatechange = callbacks$2.onconnectionstatechange.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onsignalingstatechange = callbacks$2.onsignalingstatechange.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onicegatheringstatechange = callbacks$2.onicegatheringstatechange.bind(rtcPeerConnection, ...callbackExtraParams);

    if (isAgent(BROWSER_AGENT.REACT_NATIVE)) {
      rtcPeerConnection.onsenderadded = callbacks$2.onsenderadded.bind(rtcPeerConnection, ...callbackExtraParams);
      rtcPeerConnection.onremovetrack = callbacks$2.onremovetrack.bind(rtcPeerConnection, targetMid, state.room, false);
    }

    return rtcPeerConnection;
  };

  /**
   * Function that creates the Peer Connection.
   * @param {JSON} params
   * @return {RTCPeerConnection} peerConnection
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires HANDSHAKE_PROGRESS
   */
  const createPeerConnection = (params) => {
    let peerConnection = null;
    const {
      currentRoom,
      targetMid,
      cert,
      hasScreenShare,
    } = params;
    const state = Skylink.getSkylinkState(currentRoom.id);
    const { room } = state;
    const constraints = Object.assign({ iceServers: room.connection.peerConfig.iceServers }, retrieveConfig('PEER_CONNECTION'));

    if (cert) {
      constraints.certificates = [cert];
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    try {
      peerConnection = createNativePeerConnection(targetMid, constraints, hasScreenShare, currentRoom);
      peerConnection.constraints = constraints;
    } catch (error) {
      logger.log.ERROR([targetMid, null, null, 'Failed creating peer connection:'], error);
      peerConnection = null;
      dispatchEvent(handshakeProgress({
        state: HANDSHAKE_PROGRESS$1.ERROR,
        peerId: targetMid,
        error,
        room: Room.getRoomInfo(room.id),
      }));
    }

    return peerConnection;
  };

  /**
   * Function that starts the Peer connection session.
   * @param {object} params - options required to create a PeerConnection
   * @param {SkylinkRoom} params.currentRoom - The currrent room
   * @param {String} params.targetMid - Peer's id
   * @param {Object} params.peerBrowser - Peer's user agent object
   * @param {RTCCertificate} params.cert - Represents a certificate that an RTCPeerConnection uses to authenticate.
   * @param {boolean} params.hasScreenshare - Is screenshare enabled
   * @memberOf PeerConnection.PeerConnectionHelpers
   */
  const addPeer = (params) => {
    let connection = null;
    const {
      currentRoom,
      targetMid,
      peerBrowser,
      cert,
      hasScreenShare,
    } = params;
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(currentRoom.id);
    const { peerConnections, room } = state;

    if (!peerConnections[targetMid]) {
      logger.log.INFO([targetMid, null, null, 'Starting the connection to peer. Options provided:'], {
        peerBrowser,
        enableDataChannel: initOptions.enableDataChannel,
      });

      connection = createPeerConnection({
        currentRoom,
        targetMid,
        hasScreenShare,
        cert,
        sdpSemantics: SDP_SEMANTICS.UNIFIED,
      });

      try {
        const config = connection.getConfiguration();
        // connection.addTransceiver("video");
        if (config.sdpSemantics === SDP_SEMANTICS.UNIFIED) {
          logger.log.INFO([targetMid, 'SDP Semantics', null, 'Peer Connection has Unified plan.']);
        } else if (config.sdpSemantics === SDP_SEMANTICS.PLAN_B) {
          logger.log.INFO([targetMid, 'SDP Semantics', null, 'Peer Connection has Plan-B.']);
        } else {
          logger.log.INFO([targetMid, 'SDP Semantics', null, 'The sdpSemantics parameter is not supported by this browser version.']);
        }
      } catch (ex) {
        logger.log.INFO([targetMid, 'SDP Semantics', null, 'getConfiguration() is not available in this browser version. Ex : '], ex);
      }

      state.peerConnections[targetMid] = connection;
      Skylink.setSkylinkState(state, currentRoom.id);
      handleIceGatheringStats.send(room.id, 'new', targetMid, false);
    } else {
      logger.log.WARN([targetMid, null, null, 'Connection to peer has already been made.']);
    }

    return connection;
  };

  const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS: HANDLE_NEGOTIATION_STATS$1 } } = MESSAGES;

  const onAnswerCreated = (resolve, targetMid, roomState, answer) => {
    const { room } = roomState;

    logger.log.DEBUG([targetMid, null, null, 'Created answer'], answer);
    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS$1.ANSWER.create, targetMid, answer, false);
    getCommonMessage(resolve, targetMid, roomState, answer);
  };

  const onAnswerFailed = (reject, targetMid, roomState, error) => {
    const { room } = roomState;

    logger.log.ERROR([targetMid, null, null, 'Failed creating an answer:'], error);
    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS$1.ANSWER.create_error, targetMid, null, false, error);
    dispatchEvent(handshakeProgress({
      state: HANDSHAKE_PROGRESS$1.ERROR,
      peerId: targetMid,
      error,
      room: Room.getRoomInfo(roomState.room.id),
    }));
    reject(error);
  };

  /**
   * @param {SkylinkState} roomState
   * @param {String} targetMid
   * @return {*}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires HANDSHAKE_PROGRESS
   */
  const createAnswer = (roomState, targetMid) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const {
      peerConnections,
      hasMCU,
      voiceActivityDetection,
    } = state;
    const peerConnection = peerConnections[targetMid];

    const answerConstraints = {
      voiceActivityDetection,
    };

    logger.log.INFO([targetMid, null, null, 'Creating answer with config:'], answerConstraints);

    // Add stream only at offer/answer end
    if (!hasMCU || targetMid === PEER_TYPE.MCU) {
      MediaStream.addLocalMediaStreams(targetMid, roomState);
    }

    return new Promise((resolve, reject) => peerConnection.createAnswer(answerConstraints)
      .then(answer => onAnswerCreated(resolve, targetMid, roomState, answer))
      .catch(error => onAnswerFailed(reject, targetMid, roomState, error)));
  };

  /**
   * Function that sends data over the DataChannel connection.
   * @private
   * @memberOf PeerConnection
   * @since 2.0.0
   * @fires DATA_CHANNEL_STATE
   */
  const sendMessageToDataChannel = (roomState, peerId, data, channelProperty, doNotConvert) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const peerConnection = state.peerConnections[peerId];
    const dataChannel = state.dataChannels[peerId];
    let channelProp = channelProperty;

    if (!channelProp || channelProp === peerId) {
      channelProp = 'main';
    }

    // TODO: What happens when we want to send binary data over or ArrayBuffers?
    if (!(typeof data === 'object' && data) && !(data && typeof data === 'string')) {
      logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Dropping invalid data ->'], data);
      return null;
    }

    if (!(peerConnection && peerConnection.signalingState !== PEER_CONNECTION_STATE$1.CLOSED)) {
      logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Dropping for sending message as Peer connection does not exists or is closed ->'], data);
      return null;
    }

    if (!(dataChannel && dataChannel[channelProp])) {
      logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Dropping for sending message as Datachannel connection does not exists ->'], data);
      return null;
    }

    /* eslint-disable prefer-destructuring */
    const channelName = dataChannel[channelProp].channelName;
    const channelType = dataChannel[channelProp].channelType;
    const readyState = dataChannel[channelProp].channel.readyState;
    const messageType = typeof data === 'object' && data.type === DC_PROTOCOL_TYPE.MESSAGE ? DATA_CHANNEL_MESSAGE_ERROR.MESSAGE : DATA_CHANNEL_MESSAGE_ERROR.TRANSFER;

    if (readyState !== DATA_CHANNEL_STATE$1.OPEN) {
      const notOpenError = new Error(`Failed sending message as Datachannel connection state is not opened. Current readyState is ${readyState}`);
      logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, notOpenError], data);
      dispatchEvent(onDataChannelStateChanged({
        peerId,
        channelName,
        channelType,
        messageType,
        error: notOpenError,
        state: DATA_CHANNEL_STATE$1.SEND_MESSAGE_ERROR,
        bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel[channelProp].channel),
      }));
      throw notOpenError;
    }

    try {
      if (!doNotConvert && typeof data === 'object') {
        logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, `Sending ${data.type} protocol message ->`], data);
        dataChannel[channelProp].channel.send(JSON.stringify(data));
      } else {
        logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, 'Sending data with size ->'], data.size || data.length || data.byteLength);
        dataChannel[channelProp].channel.send(data);
      }
    } catch (error) {
      logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Failed sending data)'], { error, data });
      dispatchEvent(onDataChannelStateChanged({
        peerId,
        channelName,
        channelType,
        messageType,
        error,
        state: DATA_CHANNEL_STATE$1.SEND_MESSAGE_ERROR,
        bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel[channelProp].channel),
      }));
      throw error;
    }
    return null;
  };

  /**
   * Function that handles the "MESSAGE" data transfer protocol.
   * @private
   * @lends PeerConnection
   * @param {SkylinkState} roomState
   * @since 2.0.0
   * @fires ON_INCOMING_MESSAGE
   */
  const messageProtocolHandler = (roomState, peerId, data, channelProp) => {
    const senderPeerId = data.sender || peerId;
    logger.log.INFO([senderPeerId, 'RTCDataChannel', channelProp, 'Received P2P message from peer:'], data);
    dispatchEvent(onIncomingMessage({
      room: roomState.room,
      message: {
        targetPeerId: data.target,
        content: data.data,
        senderPeerId,
        isDataChannel: true,
        isPrivate: data.isPrivate,
      },
      isSelf: false,
      peerId: senderPeerId,
      peerInfo: PeerData.getPeerInfo(senderPeerId, roomState.room),
    }));
  };

  /**
   * Function that handles the data received from Datachannel and
   * routes to the relevant data transfer protocol handler.
   * @lends PeerConnection
   * @private
   * @since 2.0.0
   * @fires DATA_CHANNEL_STATE
   */
  const processDataChannelData = (roomState, rawData, peerId, channelName, channelType) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    let transferId = null;
    let streamId = null;
    // eslint-disable-next-line no-unused-vars
    let isStreamChunk = false;
    const channelProp = channelType === DATA_CHANNEL_TYPE.MESSAGING ? 'main' : channelName;

    // Safe access of _dataChannel object in case dataChannel has been closed unexpectedly | ESS-983
    /* eslint-disable prefer-destructuring */
    /* eslint-disable no-prototype-builtins */
    const objPeerDataChannel = state.dataChannels[peerId] || {};
    if (objPeerDataChannel.hasOwnProperty(channelProp) && typeof objPeerDataChannel[channelProp] === 'object') {
      transferId = objPeerDataChannel[channelProp].transferId;
      streamId = objPeerDataChannel[channelProp].streamId;
    } else {
      return null; // dataChannel not avaialble propbably having being closed abruptly | ESS-983
    }

    if (streamId && state.dataStreams && state.dataStreams[streamId]) {
      isStreamChunk = state.dataStreams[streamId].sessionChunkType === 'string' ? typeof rawData === 'string' : typeof rawData === 'object';
    }

    if (!state.peerConnections[peerId]) {
      logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Dropping data received from Peer as connection is not present ->'], rawData);
      return null;
    }

    if (!(state.dataChannels[peerId] && state.dataChannels[peerId][channelProp])) {
      logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Dropping data received from Peer as Datachannel connection is not present ->'], rawData);
      return null;
    }

    // Expect as string
    if (typeof rawData === 'string') {
      try {
        const protocolData = JSON.parse(rawData);
        isStreamChunk = false;

        logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, `Received protocol ${protocolData.type} message ->`], protocolData);

        // Ignore ACK, ERROR and CANCEL if there is no data transfer session in-progress
        if ([DC_PROTOCOL_TYPE.ACK, DC_PROTOCOL_TYPE.ERROR, DC_PROTOCOL_TYPE.CANCEL].indexOf(protocolData.type) > -1
          && !(transferId && state.dataTransfers[transferId] && state.dataTransfers[transferId].sessions[peerId])) {
          logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Discarded protocol message as data transfer session is not present ->'], protocolData);
          return null;
        }

        // TODO: Complete other DataChannel handlers in the below switch case
        switch (protocolData.type) {
          case DC_PROTOCOL_TYPE.WRQ:
            // Discard iOS bidirectional upload when Datachannel is in-progress for data transfers
            if (transferId && state.dataTransfers[transferId] && state.dataTransfers[transferId].sessions[peerId]) {
              logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Rejecting bidirectional data transfer request as it is currently not supported in the SDK ->'], protocolData);
              sendMessageToDataChannel(roomState, peerId, {
                type: DC_PROTOCOL_TYPE.ACK,
                ackN: -1,
                sender: state.user.sid,
              }, channelProp);
              break;
            }
            // self._WRQProtocolHandler(peerId, protocolData, channelProp);
            break;
          // case self._DC_PROTOCOL_TYPE.ACK:
          //   self._ACKProtocolHandler(peerId, protocolData, channelProp);
          //   break;
          // case self._DC_PROTOCOL_TYPE.ERROR:
          //   self._ERRORProtocolHandler(peerId, protocolData, channelProp);
          //   break;
          // case self._DC_PROTOCOL_TYPE.CANCEL:
          //   self._CANCELProtocolHandler(peerId, protocolData, channelProp);
          //   break;
          case DC_PROTOCOL_TYPE.MESSAGE:
            messageProtocolHandler(state, peerId, protocolData, channelProp);
            break;
          default:
            logger.log.WARN([peerId, 'RTCDataChannel', channelProp, `Discarded unknown ${protocolData.type} message ->`], protocolData);
        }
      } catch (error) {
        // if (rawData.indexOf('{') > -1 && rawData.indexOf('}') > 0) {
        //   logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Failed parsing protocol step data error ->'], {
        //     data: rawData,
        //     error,
        //   });
        //

        dispatchEvent(onDataChannelStateChanged({
          peerId,
          channelName,
          channelType,
          error,
          state: DATA_CHANNEL_STATE$1.ERROR,
          bufferAmount: PeerConnection.getDataChannelBuffer(state.dataChannels[peerId][channelProp].channel),
        }));
        //   throw error;
        // }
        //
        // if (!isStreamChunk && !(transferId && state.dataTransfers[transferId] && state.dataTransfers[transferId].sessions[peerId])) {
        //   logger.log.WARN([peerId, 'RTCDataChannel', channelProp, 'Discarded data chunk without session ->'], rawData);
        //   return null;
        // }
        //
        // if (!isStreamChunk && transferId) {
        //   if (state.dataTransfers[transferId].chunks[state.dataTransfers[transferId].sessions[peerId].ackN]) {
        //     logger.log.WARN([peerId, 'RTCDataChannel', transferId, 'Dropping data chunk ' + (!isStreamChunk ? '@' +
        //       state.dataTransfers[transferId].sessions[peerId].ackN : '') + ' as it has already been added ->'], rawData);
        //     return null;
        //   }
        // }
        //
        // if (!isStreamChunk ? self._dataTransfers[transferId].dataType === self.DATA_TRANSFER_SESSION_TYPE.DATA_URL : true) {
        //   log.debug([peerId, 'RTCDataChannel', channelProp, 'Received string data chunk ' + (!isStreamChunk ? '@' +
        //     self._dataTransfers[transferId].sessions[peerId].ackN : '') + ' with size ->'], rawData.length || rawData.size);
        //
        //   self._DATAProtocolHandler(peerId, rawData, self.DATA_TRANSFER_DATA_TYPE.STRING,
        //     rawData.length || rawData.size || 0, channelProp);
        //
        // } else {
        //   var removeSpaceData = rawData.replace(/\s|\r|\n/g, '');
        //
        //   log.debug([peerId, 'RTCDataChannel', channelProp, 'Received binary string data chunk @' +
        //     self._dataTransfers[transferId].sessions[peerId].ackN + ' with size ->'],
        //     removeSpaceData.length || removeSpaceData.size);
        //
        //   self._DATAProtocolHandler(peerId, self._base64ToBlob(removeSpaceData), self.DATA_TRANSFER_DATA_TYPE.BINARY_STRING,
        //     removeSpaceData.length || removeSpaceData.size || 0, channelProp);
        // }
      }
    }
    return null;
  };

  /**
   * @param {Object} params
   * @param {Event} event
   * @memberOf PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
   */
  const onmessage = (params, event) => {
    const {
      peerId,
      channelName,
      channelType,
      roomState,
    } = params;

    processDataChannelData(roomState, event.data, peerId, channelName, channelType);
  };

  class HandleDataChannelStats extends SkylinkStats {
    constructor() {
      super();
      const { AdapterJS } = window;
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        peer_id: null,
        state: null,
        channel_id: null,
        channel_label: null,
        channel_type: null,
        channel_binary_type: null,
        error: null,
        agent_name: AdapterJS.webrtcDetectedBrowser,
        agent_type: AdapterJS.webrtcDetectedType,
        agent_version: AdapterJS.webrtcDetectedVersion,
      };
    }

    send(roomKey, state, peerId, channel, channelProp, error) {
      const roomState = Skylink.getSkylinkState(roomKey);
      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.uid) || null;
      this.model.peer_id = peerId;
      this.model.client_id = roomState.clientId;
      this.model.state = state;
      this.model.channel = channel;
      this.model.channel_id = channel.id;
      this.model.channel_label = channel.label;
      this.model.channel_type = channelProp === 'main' ? 'persistent' : 'temporal';
      this.model.channel_binary_type = channel.binaryType;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.error = (typeof error === 'string' ? error : (error && error.message)) || null;

      if (this.model.agent_name === 'plugin') {
        this.model.channel_binary_type = 'int8Array';

        // For IE 10 and below browsers, binary support is not available.
        if (this.model.agent_name === 'IE' && this.model.agent_version < 11) {
          this.model.channel_binary_type = 'none';
        }
      }

      this.postStats(this.endpoints.dataChannel, this.model);
    }
  }

  /**
   *
   * @param {Object} params
   * @param {Error} error
   * @fires DATA_CHANNEL_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
   */
  const onerror = (params, error) => {
    const {
      dataChannel,
      peerId,
      channelName,
      channelProp,
      channelType,
      roomState,
    } = params;
    if (error.error.errorDetail === 'NONE' || error.error.code === 0) {
      // "Transport channel close" error triggered on calling dataChannel.close()
      logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, 'Datachannel state ->'], error.error.message);
    } else {
      const state = Skylink.getSkylinkState(roomState.room.id);
      const { room } = state;
      const handleDataChannelStats = new HandleDataChannelStats();

      logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Datachannel has an exception ->'], error);
      handleDataChannelStats.send(room.id, DATA_CHANNEL_STATE$1.ERROR, peerId, dataChannel, channelProp, error);
      dispatchEvent(onDataChannelStateChanged({
        state: DATA_CHANNEL_STATE$1.ERROR,
        peerId,
        channelName,
        channelType,
        bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
        error,
      }));
    }
  };

  /**
   * @param {Object} params
   * @fires DATA_CHANNEL_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
   */
  const onopen = (params) => {
    const {
      dataChannel,
      channelProp,
      channelName,
      channelType,
      peerId,
      roomState,
      bufferThreshold,
    } = params;
    const handleDataChannelStats = new HandleDataChannelStats();
    const { room } = roomState;
    const { STATS_MODULE } = MESSAGES;

    logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, 'Datachannel has opened']);
    dataChannel.bufferedAmountLowThreshold = bufferThreshold || 0;
    handleDataChannelStats.send(room.id, STATS_MODULE.HANDLE_DATA_CHANNEL_STATS.closed, peerId, dataChannel, channelProp);
    dispatchEvent(onDataChannelStateChanged({
      state: DATA_CHANNEL_STATE$1.OPEN,
      peerId,
      channelName,
      channelType,
      bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
    }));
  };

  /**
   *
   * @param {Object} params
   * @fires DATA_CHANNEL_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
   */
  const onbufferedamountlow = (params) => {
    const {
      dataChannel,
      peerId,
      channelName,
      channelProp,
      channelType,
      roomState,
    } = params;

    const state = Skylink.getSkylinkState(roomState.room.id);
    const { room } = state;
    logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, 'Datachannel buffering data transfer low']);

    dispatchEvent(onDataChannelStateChanged({
      state: DATA_CHANNEL_STATE$1.BUFFERED_AMOUNT_LOW,
      room: Room.getRoomInfo(room.id),
      peerId,
      channelName,
      channelType,
      bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
    }));
  };

  /**
   * @param {Object} params
   * @fires DATA_CHANNEL_STATE
   * @fires DATA_CHANNEL_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
   */
  const onclose = (params) => {
    const {
      dataChannel,
      peerId,
      channelName,
      channelProp,
      channelType,
      roomState,
    } = params;
    const { DATA_CHANNEL, STATS_MODULE } = MESSAGES;
    const state = Skylink.getSkylinkState(roomState.room.id) || Object.values(Skylink.getSkylinkState())[0]; // to handle leaveAllRooms method

    if (!state) {
      return;
    }

    const { room, peerConnections } = state;
    const handleDataChannelStats = new HandleDataChannelStats();

    logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, DATA_CHANNEL.closed]);

    try {
      handleDataChannelStats.send(room.id, STATS_MODULE.HANDLE_DATA_CHANNEL_STATS.closed, peerId, dataChannel, channelProp);
      dispatchEvent(onDataChannelStateChanged({
        state: DATA_CHANNEL_STATE$1.CLOSED,
        peerId,
        room: Room.getRoomInfo(room.id),
        channelName,
        channelType,
        bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
      }));

      if (peerConnections[peerId] && peerConnections[peerId].remoteDescription
        && peerConnections[peerId].remoteDescription.sdp && (peerConnections[peerId].remoteDescription.sdp.indexOf(
        // eslint-disable-next-line comma-dangle
        'm=application'
      ) === -1 || peerConnections[peerId].remoteDescription.sdp.indexOf('m=application 0') > 0)) {
        return;
      }

      if (channelType === DATA_CHANNEL_TYPE.MESSAGING) {
        setTimeout(() => {
          if (peerConnections[peerId]
            && peerConnections[peerId].signalingState !== PEER_CONNECTION_STATE$1.CLOSED
            && (peerConnections[peerId].localDescription
              && peerConnections[peerId].localDescription.type === HANDSHAKE_PROGRESS$1.OFFER)) {
            logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, DATA_CHANNEL.reviving_dataChannel]);

            PeerConnection.createDataChannel({
              peerId,
              dataChannel,
              bufferThreshold: PeerConnection.getDataChannelBuffer(dataChannel),
              createAsMessagingChannel: true,
              roomState: state,
            });
            handleDataChannelStats.send(room.id, STATS_MODULE.HANDLE_DATA_CHANNEL_STATS.reconnecting, peerId, { label: channelName }, 'main');
          }
        }, 100);
      }
    } catch (error) {
      logger.log.WARN([peerId, 'RTCDataChannel', channelProp, DATA_CHANNEL.closed]);
    }
  };

  /**
   * @description Callbacks for createDataChannel method
   * @type {{onopen, onmessage, onerror, onbufferedamountlow, onclose}}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @namespace CreateDataChannelCallbacks
   * @private
   */
  const callbacks$1 = {
    onopen,
    onmessage,
    onerror,
    onbufferedamountlow,
    onclose,
  };

  /* eslint-disable prefer-const */
  /**
   * @param params
   * @returns {null}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires DATA_CHANNEL_STATE
   */
  const createDataChannel = (params) => {
    let {
      peerId,
      dataChannel,
      bufferThreshold,
      createAsMessagingChannel,
      roomState,
    } = params;
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { user, peerConnections, dataChannels } = state;
    const peerConnection = peerConnections[peerId];
    let channelName = `-_${peerId}`;
    let channelType = createAsMessagingChannel === true ? DATA_CHANNEL_TYPE.MESSAGING : DATA_CHANNEL_TYPE.DATA;
    let channelProp = channelType === DATA_CHANNEL_TYPE.MESSAGING ? 'main' : channelName;
    if (user && user.sid) {
      channelName = `${user.sid}_${peerId}`;
    } else {
      logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Aborting of creating or initializing DataChannel as User does not have Room session']);
      return null;
    }

    if (!(peerConnection && peerConnection.signalingState !== PEER_CONNECTION_STATE$1.CLOSED)) {
      logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Aborting of creating or initializing Datachannel as Peer connection does not exists']);
      return null;
    }

    if (dataChannel && typeof dataChannel === 'object') {
      channelName = dataChannel.label;
    } else if (typeof dataChannel === 'string') {
      channelName = dataChannel;
      dataChannel = null;
    }

    if (!dataChannels[peerId]) {
      channelProp = 'main';
      channelType = DATA_CHANNEL_TYPE.MESSAGING;
      dataChannels[peerId] = {};
      logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, 'initializing main DataChannel']);
    } else if (dataChannels[peerId].main && dataChannels[peerId].main.channel.label === channelName) {
      channelProp = 'main';
      channelType = DATA_CHANNEL_TYPE.MESSAGING;
    }

    if (!dataChannel) {
      try {
        dataChannel = peerConnection.createDataChannel(channelName, {
          reliable: true,
          ordered: true,
        });
      } catch (error) {
        logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Failed creating Datachannel ->'], error);

        const handleDataChannelStats = new HandleDataChannelStats();
        const { room } = roomState;

        handleDataChannelStats.send(room.id, DATA_CHANNEL_STATE$1.ERROR, peerId, { label: channelName }, channelProp, error);
        dispatchEvent(onDataChannelStateChanged({
          state: DATA_CHANNEL_STATE$1.CREATE_ERROR,
          peerId,
          error,
          channelName,
          channelType,
          buferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
        }));
        return null;
      }
    }

    const callbackExtraParams = {
      dataChannel,
      peerId,
      channelName,
      channelProp,
      channelType,
      roomState,
      bufferThreshold,
    };

    dataChannel.onopen = callbacks$1.onopen.bind(dataChannel, callbackExtraParams);
    dataChannel.onmessage = callbacks$1.onmessage.bind(dataChannel, callbackExtraParams);
    dataChannel.onerror = callbacks$1.onerror.bind(dataChannel, callbackExtraParams);
    dataChannel.onbufferedamountlow = callbacks$1.onbufferedamountlow.bind(dataChannel, callbackExtraParams);
    dataChannel.onclose = callbacks$1.onclose.bind(dataChannel, callbackExtraParams);

    const channel = channelType === DATA_CHANNEL_TYPE.MESSAGING ? 'main' : channelName;
    state.dataChannels[peerId][channel] = {
      channelName,
      channelType,
      transferId: null,
      streamId: null,
      channel: dataChannel,
    };

    Skylink.setSkylinkState(state, roomState.room.id);

    return null;
  };

  /**
   * @param message
   * @param {String} targetPeerId
   * @param {SkylinkState} roomState
   * @returns {null}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires ON_INCOMING_MESSAGE
   */
  const sendP2PMessageForRoom = (roomState, message, targetPeerId) => {
    const initOptions = Skylink.getInitOptions();
    const {
      dataChannels,
      room,
      user,
      hasMCU,
    } = roomState;

    let listOfPeers = Object.keys(dataChannels);
    let isPrivate = false;

    if (Array.isArray(targetPeerId) && targetPeerId.length) {
      listOfPeers = targetPeerId;
      isPrivate = true;
    } else if (targetPeerId && typeof targetPeerId === 'string') {
      listOfPeers = [targetPeerId];
      isPrivate = true;
    }

    if (!room.inRoom || !(user && user.sid)) {
      logger.log.ERROR('Unable to send message as User is not in Room. ->', message);
      return null;
    }

    if (!initOptions.enableDataChannel) {
      logger.log.ERROR('Unable to send message as User does not have DataChannel enabled. ->', message);
      return null;
    }

    // Loop out unwanted Peers
    for (let i = 0; i < listOfPeers.length; i += 1) {
      const peerId = listOfPeers[i];

      if (!dataChannels[peerId] && !hasMCU) {
        logger.log.ERROR([peerId, 'RTCDataChannel', null, 'Dropping of sending message to Peer as DataChannel connection does not exist.']);
        listOfPeers.splice(i, 1);
        i -= 1;
      } else if (peerId === PEER_TYPE.MCU) {
        listOfPeers.splice(i, 1);
        i -= 1;
      } else if (!hasMCU) {
        logger.log.DEBUG([peerId, 'RTCDataChannel', null, `Sending ${isPrivate ? 'private' : ''} P2P message to Peer.`]);

        sendMessageToDataChannel(roomState, peerId, {
          type: DC_PROTOCOL_TYPE.MESSAGE,
          isPrivate,
          sender: user.sid,
          target: targetPeerId ? peerId : null,
          data: message,
        }, 'main');
      }
    }

    if (listOfPeers.length === 0) {
      logger.log.WARN('Currently there are no Peers to send P2P message to.');
    }

    if (hasMCU) {
      logger.log.DEBUG([PEER_TYPE.MCU, 'RTCDataChannel', null, `Broadcasting ${isPrivate ? 'private' : ''} P2P message to Peers.`]);
      sendMessageToDataChannel(roomState, PEER_TYPE.MCU, {
        type: DC_PROTOCOL_TYPE.MESSAGE,
        isPrivate,
        sender: user.sid,
        target: listOfPeers,
        data: message,
      }, 'main');
    }

    if (targetPeerId || !hasMCU) {
      dispatchEvent(onIncomingMessage({
        room: Room.getRoomInfo(roomState.room.id),
        message: {
          targetPeerId: targetPeerId || null,
          content: message,
          senderPeerId: user.sid,
          isDataChannel: true,
          isPrivate,
        },
        isSelf: true,
        peerId: user.sid,
        peerInfo: PeerData.getCurrentSessionInfo(roomState.room),
      }));
    }

    return null;
  };

  const sendP2PMessage = (roomName, message, targetPeerId) => {
    const roomState = getRoomStateByName(roomName);
    if (roomState) {
      sendP2PMessageForRoom(roomState, message, targetPeerId);
    } else {
      // Global P2P Message - Broadcast to all rooms
      const roomStates = Skylink.getSkylinkState();
      const roomKeys = Object.keys(roomStates);
      for (let i = 0; i < roomKeys.length; i += 1) {
        const state = roomStates[roomKeys[i]];
        sendP2PMessageForRoom(state, message, targetPeerId);
      }
    }
  };

  /**
   * @param {String} roomName
   * @return {Object|null}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @private
   */
  const getPeersInRoom = (roomName) => {
    const roomState = getRoomStateByName(roomName);
    if (roomState) {
      const listOfPeersInfo = {};
      const listOfPeers = Object.keys(roomState.peerInformations);

      for (let i = 0; i < listOfPeers.length; i += 1) {
        if (listOfPeers[i] !== PEER_TYPE.MCU) {
          listOfPeersInfo[listOfPeers[i]] = Object.assign({}, PeerData.getPeerInfo(listOfPeers[i], roomState.room));
          listOfPeersInfo[listOfPeers[i]].isSelf = false;
        }
      }

      if (roomState.user && roomState.user.sid) {
        listOfPeersInfo[roomState.user.sid] = Object.assign({}, PeerData.getCurrentSessionInfo(roomState.room));
        listOfPeersInfo[roomState.user.sid].isSelf = true;
      }
      return listOfPeersInfo;
    }
    return null;
  };

  /**
   * @param {String} targetMid
   * @param {SkylinkState} roomState
   * @return {null}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires CANDIDATES_GATHERED
   */
  const signalingEndOfCandidates = (targetMid, roomState) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const peerEndOfCandidatesCounter = state.peerEndOfCandidatesCounter[targetMid];
    const peerConnection = state.peerConnections[targetMid];
    const peerCandidatesQueue = state.peerCandidatesQueue[targetMid];
    const gatheredCandidates = state.gatheredCandidates[targetMid];
    const { TAGS } = SkylinkConstants;
    const { ICE_CONNECTION } = MESSAGES;

    if (!peerEndOfCandidatesCounter) {
      return null;
    }

    if (
      // If peer connection exists first and state is not closed.
      peerConnection && peerConnection.signalingState !== PEER_CONNECTION_STATE$1.CLOSED
      // If remote description is set
      && peerConnection.remoteDescription && peerConnection.remoteDescription.sdp
      // If end-of-candidates signal is received
      && typeof peerEndOfCandidatesCounter.expectedLen === 'number'
      // If all ICE candidates are received
      && peerEndOfCandidatesCounter.len >= peerEndOfCandidatesCounter.expectedLen
      // If there is no ICE candidates queue
      && (peerCandidatesQueue ? peerCandidatesQueue.length === 0 : true)
      // If it has not been set yet
      && !peerEndOfCandidatesCounter.hasSet) {
      logger.log.DEBUG([targetMid, TAGS.PEER_CONNECTION, null, ICE_CONNECTION.END_OF_CANDIDATES_SUCCESS]);

      peerEndOfCandidatesCounter.hasSet = true;

      try {
        if (gatheredCandidates) {
          const candidatesLength = {
            expected: peerEndOfCandidatesCounter.expectedLen || 0,
            received: peerEndOfCandidatesCounter.len || 0,
            processed: gatheredCandidates.receiving.srflx.length + gatheredCandidates.receiving.relay.length + gatheredCandidates.receiving.host.length,
          };
          dispatchEvent(candidatesGathered({
            room: state.room,
            peerId: targetMid,
            candidatesLength,
          }));
        }

        state.peerEndOfCandidatesCounter[targetMid] = peerEndOfCandidatesCounter;
        Skylink.setSkylinkState(state, roomState.room.id);
      } catch (error) {
        logger.log.ERROR([targetMid, TAGS.PEER_CONNECTION, null, ICE_CONNECTION.END_OF_CANDIDATES_FAILURE], error);
      }
    }
    return null;
  };

  /**
   * Get RTCDataChannel buffer thresholds
   * @param {RTCDataChannel.channel} channel
   * @returns {{bufferedAmountLow: number, bufferedAmountLowThreshold: number}}
   * @memberOf PeerConnection.PeerConnectionHelpers
   */
  const getDataChannelBuffer = channel => ({
    bufferedAmountLow: parseInt(channel.bufferedAmountLow, 10) || 0,
    bufferedAmountLowThreshold: parseInt(channel.bufferedAmountLowThreshold, 10) || 0,
  });

  const hasPeerDataChannels = dataChannels => !isEmptyObj(dataChannels);

  /**
   * Function that refreshes the main messaging Datachannel.
   * @param {SkylinkState} state
   * @param {String} peerId
   * @memberOf PeerConnection
   */
  const refreshDataChannel = (state, peerId) => {
    const { dataChannels, peerConnections } = state;

    if (hasPeerDataChannels(dataChannels) && Object.hasOwnProperty.call(dataChannels, peerId)) {
      if (Object.hasOwnProperty.call(dataChannels[peerId], 'main')) {
        const mainDataChannel = dataChannels[peerId].main;
        const { channelName, channelType } = mainDataChannel;
        const bufferThreshold = mainDataChannel.channel.bufferedAmountLowThreshold || 0;

        if (channelType === DATA_CHANNEL_TYPE.MESSAGING) {
          setTimeout(() => {
            if (Object.hasOwnProperty.call(peerConnections, peerId)) {
              if (peerConnections[peerId].signalingState !== PEER_CONNECTION_STATE$1.CLOSED && peerConnections[peerId].localDescription.type === HANDSHAKE_PROGRESS$1.OFFER) {
                PeerConnection.closeDataChannel(state, peerId);
                logger.log.DEBUG([peerId, 'RTCDataChannel', 'main', MESSAGES.DATA_CHANNEL.reviving_dataChannel]);
                PeerConnection.createDataChannel({
                  roomState: state,
                  peerId,
                  dataChannel: channelName,
                  bufferThreshold,
                  createAsMessagingChannel: true,
                });
              }
            }
          }, 100);
        }
      }
    } else {
      logger.log.DEBUG([peerId, 'RTCDataChannel', MESSAGES.DATA_CHANNEL.refresh_error]);
    }
  };

  const closeFn = (roomState, peerId, channelNameProp) => {
    const { dataChannels } = roomState;
    const targetDataChannel = dataChannels[peerId][channelNameProp];
    const { channelName, channelType } = targetDataChannel.channelName;

    if (targetDataChannel.readyState !== DATA_CHANNEL_STATE$1.CLOSED) {
      const { room } = roomState;
      const handleDataChannelStats = new HandleDataChannelStats();
      logger.log.DEBUG([peerId, TAGS.DATA_CHANNEL, channelNameProp, MESSAGES.DATA_CHANNEL.CLOSING]);

      handleDataChannelStats.send(room.id, DATA_CHANNEL_STATE$1.CLOSING, peerId, targetDataChannel.channel, channelNameProp);

      dispatchEvent(onDataChannelStateChanged({
        room,
        peerId,
        state: DATA_CHANNEL_STATE$1.CLOSING,
        channelName,
        channelType,
        bufferAmount: PeerConnection.getDataChannelBuffer(targetDataChannel.channel),
      }));

      targetDataChannel.channel.close();

      delete dataChannels[peerId][channelNameProp];
    }
  };

  const closeAllDataChannels = (roomState, peerId) => {
    const { dataChannels } = roomState;
    const channelNameProp = Object.keys(dataChannels[peerId]);
    for (let i = 0; i < channelNameProp.length; i += 1) {
      if (Object.hasOwnProperty.call(dataChannels[peerId], channelNameProp[i])) {
        closeFn(roomState, peerId, channelNameProp[i]);
      }
    }

    delete dataChannels[peerId];
  };

  /**
   * Function that closes the datachannel.
   * @param {SkylinkState} roomState
   * @param {String} peerId - The Peer Id.
   * @param {String} [channelProp=main] - The channel property.
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires DATA_CHANNEL_STATE
   */
  const closeDataChannel = (roomState, peerId, channelProp = 'main') => {
    try {
      const updatedState = Skylink.getSkylinkState(roomState.room.id);
      const { dataChannels, room } = updatedState;

      if (!dataChannels[peerId] || !dataChannels[peerId][channelProp]) {
        logger.log.WARN([peerId, TAGS.DATA_CHANNEL, channelProp || null,
          MESSAGES.DATA_CHANNEL.ERRORS.NO_SESSIONS]);
        return;
      }

      if (channelProp === 'main') {
        closeAllDataChannels(updatedState, peerId);
        return;
      }

      closeFn(updatedState, peerId, channelProp);
      Skylink.setSkylinkState(updatedState, room.id);
    } catch (error) {
      logger.log.ERROR([peerId, TAGS.DATA_CHANNEL, channelProp || null,
        MESSAGES.DATA_CHANNEL.ERRORS.FAILED_CLOSING], error);
    }
  };

  /**
   * Method that returns the refreshConnection result.
   * @param {String} peerId
   * @param {SkylinkRoom} room
   * @param {boolean} doIceRestart
   * @param {Array} [errors]
   * @private
   */
  const buildRefreshConnectionResult = (peerId, room, doIceRestart, errors) => {
    const state = Skylink.getSkylinkState(room.id);
    const { hasMCU, peerInformations, enableIceRestart } = state;
    const peersCustomSettings = PeerData.getPeersCustomSettings(state);
    const result = {};

    result[peerId] = {
      iceRestart: !hasMCU && peerInformations[peerId] && peerInformations[peerId].config
        && peerInformations[peerId].config.enableIceRestart && enableIceRestart && doIceRestart,
      customSettings: peersCustomSettings[peerId] || {},
    };

    if (errors) {
      result.errors = errors;
    }

    return result;
  };

  /* eslint-disable prefer-promise-reject-errors */

  const buildResult = (listOfPeers, refreshErrors, refreshSettings) => {
    const result = {};
    result.listOfPeers = listOfPeers;
    result.refreshErrors = refreshErrors;
    result.refreshSettings = refreshSettings;

    return result;
  };

  const buildPeerRefreshSettings = (listOfPeers, room, doIceRestart) => {
    const refreshSettings = [];

    Object.keys(listOfPeers).forEach((i) => {
      refreshSettings.push(buildRefreshConnectionResult(listOfPeers[i], room, doIceRestart));
    });

    return refreshSettings;
  };

  const buildPeerRefreshErrors = (peerId, errors) => {
    const peerRefreshError = {};
    peerRefreshError[peerId] = errors;

    return peerRefreshError;
  };

  const filterParams = (targetPeerId, iceRestart, options, peerConnections) => {
    let doIceRestart = false;
    let bwOptions = {};
    let listOfPeers = Object.keys(peerConnections);

    if (Array.isArray(targetPeerId)) {
      listOfPeers = targetPeerId;
    } else if (isAString(targetPeerId)) {
      listOfPeers = [targetPeerId];
    } else if (isABoolean(targetPeerId)) {
      doIceRestart = targetPeerId;
    } else if (targetPeerId && isAObj(targetPeerId)) {
      bwOptions = targetPeerId;
    }

    if (isABoolean(iceRestart)) {
      doIceRestart = iceRestart;
    } else if (iceRestart && isAObj(iceRestart)) {
      bwOptions = iceRestart;
    }

    if (options && isAObj(options)) {
      bwOptions = options;
    }

    return {
      listOfPeers,
      doIceRestart,
      bwOptions,
    };
  };

  /**
   * Function that refreshes Peer connections to update with the current streaming.
   * @param {SkylinkState} roomState
   * @param {String} targetPeerId
   * @param {boolean} iceRestart
   * @param {Object} options
   * @param {Object} options.bandwidth
   * @return {Promise}
   * @memberOf PeerConnection
   */
  const refreshConnection = (roomState, targetPeerId, iceRestart, options) => new Promise((resolve, reject) => {
    if (!roomState) {
      reject(new Error(MESSAGES.ROOM_STATE.NO_ROOM_NAME));
    }

    const { peerConnections, hasMCU, room } = roomState;
    const initOptions = Skylink.getInitOptions();
    const { mcuUseRenegoRestart } = initOptions;
    const { PEER_CONNECTION } = MESSAGES;
    const params = filterParams(targetPeerId, iceRestart, options, peerConnections);
    const { listOfPeers, doIceRestart, bwOptions } = params;

    try {
      if (isEmptyArray(listOfPeers) && !(hasMCU && !mcuUseRenegoRestart)) {
        logger.log.ERROR(PEER_CONNECTION.NO_PEER_CONNECTION);
        reject({
          refreshErrors: { self: PEER_CONNECTION.NO_PEER_CONNECTION },
          listOfPeers,
        });
      }

      logger.log.INFO([null, TAGS.PEER_CONNECTION, null, PEER_CONNECTION.REFRESH_CONNECTION.START]);

      const refreshPeerConnectionPromises = PeerConnection.refreshPeerConnection(listOfPeers, roomState, doIceRestart, bwOptions);
      refreshPeerConnectionPromises
        .then((results) => {
          const mResults = hasMCU ? [results] : results;
          const refreshErrors = [];
          for (let i = 0; i < mResults.length; i += 1) {
            if (Array.isArray(mResults[i])) {
              const error = mResults[i];
              refreshErrors.push(buildPeerRefreshErrors(error[0], error[1]));
              logger.log.WARN([listOfPeers, TAGS.PEER_CONNECTION, null, PEER_CONNECTION.REFRESH_CONNECTION.FAILED], error[0]);
            } else if (isAString(mResults[i])) {
              logger.log.INFO([listOfPeers, TAGS.PEER_CONNECTION, null, PEER_CONNECTION.REFRESH_CONNECTION.SUCCESS], mResults[i]);
            }
          }

          if (refreshErrors.length === listOfPeers.length) {
            reject(buildResult(listOfPeers, refreshErrors, buildPeerRefreshSettings(listOfPeers, room, doIceRestart)));
          } else {
            resolve(buildResult(listOfPeers, refreshErrors, buildPeerRefreshSettings(listOfPeers, room, doIceRestart)));
          }
        })
        .catch(error => logger.log.ERROR([null, TAGS.PEER_CONNECTION, null, PEER_CONNECTION.REFRESH_CONNECTION.FAILED], error))
        .finally(() => logger.log.INFO(PEER_CONNECTION.REFRESH_CONNECTION.COMPLETED));
    } catch (error) {
      reject(error);
    }
  });

  const sendRestartOfferMsg = (state, peerId, doIceRestart) => {
    const { room } = state;
    const signaling = new SkylinkSignalingServer();

    try {
      const restartOfferMsg = signaling.messageBuilder.getRestartOfferMessage(room.id, peerId, doIceRestart);
      signaling.offer(room, peerId, doIceRestart, restartOfferMsg);
      return peerId;
    } catch (ex) {
      return [peerId, ex];
    }
  };

  /**
   * Function that sends restart message to the signaling server.
   * @param {String} peerId
   * @param {SkylinkState} roomState
   * @param {Object} options
   * @param {Object} options.bandwidth
   * @return {Promise}
   * @memberOf PeerConnection.PeerConnectionHelpers
   */
  const restartPeerConnection = (peerId, roomState, options) => {
    const updateState = Skylink.getSkylinkState(roomState.room.id);
    const {
      peerConnections, streamsBandwidthSettings, peerEndOfCandidatesCounter, room, user,
    } = updateState;
    const { doIceRestart, bwOptions } = options;
    const signaling = new SkylinkSignalingServer();
    const errors = [];

    return new Promise((resolve) => {
      // reject with wrong peerId
      if (!peerConnections[peerId]) {
        logger.log.ERROR([peerId, null, null, MESSAGES.PEER_CONNECTION.ERRORS.NOT_FOUND]);
        errors.push(MESSAGES.PEER_CONNECTION.ERRORS.NOT_FOUND);
        return resolve([peerId, errors]);
      }

      const peerConnection = peerConnections[peerId];

      if (errors.length !== 0) {
        return resolve([peerId, errors]);
      }

      // Let's check if the signalingState is stable first.
      // In another galaxy or universe, where the local description gets dropped..
      // In the offerHandler or answerHandler, do the appropriate flags to ignore or drop "extra" descriptions
      if (peerConnection.signalingState === PEER_CONNECTION_STATE$1.STABLE) {
        logger.log.INFO([peerId, null, null, MESSAGES.PEER_CONNECTION.REFRESH_CONNECTION.SEND_RESTART_OFFER], {
          iceRestart: doIceRestart,
          options: bwOptions,
        });

        updateState.streamsBandwidthSettings.bAS = bwOptions.bandwidth || streamsBandwidthSettings.bAS;
        updateState.peerEndOfCandidatesCounter[peerId] = peerEndOfCandidatesCounter[peerId] || {};
        updateState.peerEndOfCandidatesCounter[peerId].len = 0;
        Skylink.setSkylinkState(updateState, updateState.room.id);

        return resolve(sendRestartOfferMsg(updateState, peerId, doIceRestart));
      }

      // Checks if the local description is defined first
      const hasLocalDescription = peerConnection.localDescription && peerConnection.localDescription.sdp;
      // This is when the state is stable and re-handshaking is possible
      // This could be due to previous connection handshaking that is already done
      if (peerConnection.signalingState === PEER_CONNECTION_STATE$1.HAVE_LOCAL_OFFER && hasLocalDescription) {
        signaling.sendMessage({
          type: peerConnection.localDescription.type,
          sdp: peerConnection.localDescription.sdp,
          mid: user.sid,
          target: peerId,
          rid: room.id,
          restart: true,
        });
        return resolve(peerId);
      }

      logger.log.DEBUG([peerId, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.REFRESH_CONNECTION.NO_LOCAL_DESCRIPTION], {
        localDescription: peerConnection.localDescription,
        remoteDescription: peerConnection.remoteDescription,
        signalingState: peerConnection.signalingState,
      });
      errors.push(MESSAGES.PEER_CONNECTION.REFRESH_CONNECTION.NO_LOCAL_DESCRIPTION);

      resolve([peerId, errors]);

      return null;
    });
  };

  /**
   * @param {SkylinkState} roomState
   * @param {boolean} [doIceRestart = false]
   * @param {Object} [bwOptions = {}]
   * @param {JSON} bwOptions.bandwidth
   * @returns {Promise}
   * @memberOf PeerConnection.PeerConnectionHelpers
   */
  const restartMCUConnection = (roomState, doIceRestart, bwOptions) => new Promise((resolve) => {
    const updatedRoomState = roomState;
    const initOptions = Skylink.getInitOptions();
    const { mcuUseRenegoRestart } = initOptions;

    try {
      updatedRoomState.streamsBandwidthSettings.bAS = bwOptions.bandwidth || updatedRoomState.streamsBandwidthSettings.bAS;

      if (mcuUseRenegoRestart) {
        updatedRoomState.peerEndOfCandidatesCounter.MCU = updatedRoomState.peerEndOfCandidatesCounter.MCU || {};
        updatedRoomState.peerEndOfCandidatesCounter.MCU.len = 0;

        Skylink.setSkylinkState(updatedRoomState);
        resolve(sendRestartOfferMsg(updatedRoomState, PEER_TYPE.MCU, doIceRestart));
      }
    } catch (error) {
      resolve([PEER_TYPE.MCU, error]);
    }
  });

  const refreshSinglePeer = (peerId, roomState, options) => restartPeerConnection(peerId, roomState, options);

  /**
   * @param {String<Array>}listOfPeers
   * @param {SkylinkState} roomState
   * @param {boolean} [doIceRestart = false]
   * @param {Object} [bwOptions = {}]
   * @param {JSON} bwOptions.bandwidth
   * @returns {Promise}
   * @memberOf PeerConnection.PeerConnectionHelpers
   */
  const refreshPeerConnection = (listOfPeers, roomState, doIceRestart = false, bwOptions = {}) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { hasMCU } = state;

    try {
      if (!hasMCU) {
        const restartPeerConnectionPromises = [];
        for (let i = 0; i < listOfPeers.length; i += 1) {
          const peerId = listOfPeers[i];
          const options = {
            doIceRestart,
            bwOptions,
          };
          const restartPeerConnectionPromise = refreshSinglePeer(peerId, state, options);
          restartPeerConnectionPromises.push(restartPeerConnectionPromise);
        }

        return Promise.all(restartPeerConnectionPromises);
      }

      return restartMCUConnection(roomState, doIceRestart, bwOptions);
    } catch (error) {
      logger.log.ERROR([null, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.REFRESH_CONNECTION.FAILED], error);
      return null;
    }
  };

  const buildPeerInformations = (userInfo, state) => {
    const peerInfo = userInfo;
    const peerId = peerInfo.sid;

    peerInfo.room = state.room.roomName;
    peerInfo.settings.data = !!(state.dataChannels[peerId] && state.dataChannels[peerId].main && state.dataChannels[peerId].main.channel && state.dataChannels[peerId].main.channel.readyState === DATA_CHANNEL_STATE$1.OPEN);

    return peerInfo;
  };

  const retrieveValidPeerIdsOrErrorMsg = (roomState, peerId) => {
    const { peerConnections, room } = roomState;
    const { PEER_CONNECTION } = MESSAGES;
    let peerIds = null;
    let errorMsg = null;

    if (isEmptyArray(Object.keys(peerConnections))) {
      errorMsg = PEER_CONNECTION.NOT_INITIALISED;
    } else if (Array.isArray(peerId)) {
      peerIds = peerId;
      peerIds.forEach((id) => {
        if (!isValidPeerId(room, id)) {
          errorMsg = `${PEER_CONNECTION.PEER_ID_NOT_FOUND} ${id}`;
        }
      });
    } else if (isAString(peerId)) {
      if (!isValidPeerId(room, peerId)) {
        errorMsg = `${PEER_CONNECTION.PEER_ID_NOT_FOUND} ${peerId}`;
      }

      peerIds = [peerId];
    } else {
      peerIds = Object.keys(peerConnections);
    }

    return {
      peerIds,
      errorMsg,
    };
  };

  const getConnectionStatus = (roomState, peerId = null) => {
    const { ROOM_STATE } = MESSAGES;
    if (!roomState) {
      logger.log.WARN(ROOM_STATE.NO_ROOM_NAME);
      return rejectPromise(ROOM_STATE.NO_ROOM_NAME);
    }

    const { room } = roomState;
    const result = retrieveValidPeerIdsOrErrorMsg(roomState, peerId);

    if (result.errorMsg) {
      logger.log.WARN(result.errorMsg);
      return rejectPromise(result.errorMsg);
    }

    const { peerIds } = result;
    const connectionStatusPromises = [];
    for (let i = 0; i < peerIds.length; i += 1) {
      const peerConnectionStatistics = new PeerConnectionStatistics(room.id, peerIds[i]);
      connectionStatusPromises.push(peerConnectionStatistics.getConnectionStatus());
    }

    return Promise.all(connectionStatusPromises);
  };

  const closePeerConnection = (roomState, peerId) => {
    const updatedState = Skylink.getSkylinkState(roomState.room.id);
    const { peerConnections, room } = updatedState;

    peerConnections[peerId].close();

    Skylink.setSkylinkState(updatedState, room.id);
  };

  /* eslint-disable no-nested-ternary */

  // Mobile SDK is sending mediaStatus  - audioMuted, videoMuted as a boolean
  // 2.0 has switched to storing mediaStatus keyed by streamId with -1, 0 ,1 values
  const buildMediaStatus = (state, peerId, transceiver, stream) => {
    const { peerMedias, peerInformations } = state;
    const peerMedia = peerMedias[peerId];
    const mediaStatus = peerInformations[peerId].mediaStatus || {};
    Object.values(peerMedia).forEach((mediaInfo) => {
      if (mediaInfo.transceiverMid === transceiver.mid) {
        mediaStatus[stream.id] = {
          audioMuted: hasAudioTrack(stream) ? (mediaInfo.mediaState === MEDIA_STATE.MUTED ? 0 : 1) : -1,
          videoMuted: hasVideoTrack(stream) ? (mediaInfo.mediaState === MEDIA_STATE.MUTED ? 0 : 1) : -1,
        };
      }
    });

    delete mediaStatus.audioMuted;
    delete mediaStatus.videoMuted;

    return mediaStatus;
  };

  const updatePeerInformationsMediaStatus = (room, peerId, transceiver, stream) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    const peerInformation = updatedState.peerInformations[peerId];
    peerInformation.mediaStatus = buildMediaStatus(updatedState, peerId, transceiver, stream);
    Skylink.setSkylinkState(updatedState, room.id);
  };

  const processNewSender = (state, targetMid, sender) => {
    const updatedState = state;
    if (!updatedState.currentRTCRTPSenders[targetMid]) {
      updatedState.currentRTCRTPSenders[targetMid] = [];
    }
    updatedState.currentRTCRTPSenders[targetMid].push(sender);
    Skylink.setSkylinkState(updatedState, updatedState.room.id);
  };

  /**
   * @namespace PeerConnectionHelpers
   * @description All helper and utility functions for <code>{@link PeerConnection}</code> class are listed here.
   * @private
   * @memberOf PeerConnection
   * @type {{createOffer, createAnswer, addPeer, createDataChannel, sendP2PMessage, getPeersInRoom, signalingEndOfCandidates, getDataChannelBuffer, refreshDataChannel, closeDataChannel, refreshConnection, refreshPeerConnection, restartPeerConnection, buildPeerInformations, getConnectionStatus, closePeerConnection, updatePeerInformationsMediaStatus, processNewSender  }}
   */
  const helpers$4 = {
    createOffer,
    createAnswer,
    addPeer,
    createDataChannel,
    sendP2PMessage,
    getPeersInRoom,
    signalingEndOfCandidates,
    getDataChannelBuffer,
    refreshDataChannel,
    closeDataChannel,
    refreshConnection,
    refreshPeerConnection,
    restartPeerConnection,
    buildPeerInformations,
    getConnectionStatus,
    closePeerConnection,
    updatePeerInformationsMediaStatus,
    processNewSender,
  };

  /* eslint-disable no-param-reassign */
  /**
   * @param {RTCPeerConnection} peerConnection
   * @param {String} targetMid
   * @param {SkylinkState} currentRoomState
   * @param {Event} event
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const ondatachannel = (peerConnection, targetMid, currentRoomState, event) => {
    const dataChannel = event.channel || event;
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(currentRoomState.room.id);
    const { peerInformations } = state;
    const { enableDataChannel } = initOptions;

    logger.log.DEBUG([targetMid, 'RTCDataChannel', dataChannel.label, 'Received datachannel ->'], dataChannel);
    if (enableDataChannel && peerInformations[targetMid].config.enableDataChannel) {
      // if peer does not have main channel, the first item is main
      if (!peerConnection.hasMainChannel) {
        peerConnection.hasMainChannel = true;
      }
      helpers$4.createDataChannel({ peerId: targetMid, dataChannel, roomState: currentRoomState });
    } else {
      logger.log.WARN([targetMid, 'RTCDataChannel', dataChannel.label, 'Not adding datachannel as enable datachannel is set to false']);
    }
  };

  /**
   *
   * @param {RTCPeerConnection} peerConnection
   * @param {String} targetMid
   * @param {SkylinkState} roomState - The current state.
   * @param {Event} rtcIceConnectionEvent
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const onicecandidate = (peerConnection, targetMid, roomState, rtcIceConnectionEvent) => {
    IceConnection.onIceCandidate(targetMid, rtcIceConnectionEvent.candidate || rtcIceConnectionEvent, roomState.room);
  };

  class HandleIceConnectionStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        peer_id: null,
        state: null,
        local_candidate: {},
        remote_candidate: {},
      };
    }

    send(roomKey, state, peerId) {
      try {
        const roomState = Skylink.getSkylinkState(roomKey);

        if (!roomState) return;

        this.model.room_id = roomKey;
        this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
        this.model.peer_id = peerId;
        this.model.client_id = roomState.clientId;
        this.model.state = state;
        this.model.app_key = Skylink.getInitOptions().appKey;
        this.model.timestamp = (new Date()).toISOString();

        PeerConnection.retrieveStatistics(roomKey, peerId, Skylink.getInitOptions().beSilentOnStatsLogs).then((stats) => {
          if (stats) {
            // Parse the selected ICE candidate pair for both local and remote candidate.
            ['local', 'remote'].forEach((dirType) => {
              const candidate = stats.selectedCandidatePair[dirType];
              if (candidate) {
                const modelCandidate = this.model[`${dirType}_candidate`];
                modelCandidate.ip_address = candidate.ipAddress || null;
                modelCandidate.port_number = candidate.portNumber || null;
                modelCandidate.candidate_type = candidate.candidateType || null;
                modelCandidate.protocol = candidate.transport || null;
                modelCandidate.priority = candidate.priority || null;

                // This is only available for the local ICE candidate.
                if (dirType === 'local') {
                  this.model.local_candidate.network_type = candidate.networkType || null;
                }
              }
            });
          }

          this.postStats(this.endpoints.iceConnection, this.model);
        }).catch((ex) => {
          logger.log.DEBUG(MESSAGES.STATS_MODULE.HANDLE_ICE_CONNECTION_STATS.RETRIEVE_FAILED, ex);
        });
      } catch (error) {
        logger.log.DEBUG(MESSAGES.STATS_MODULE.HANDLE_ICE_CONNECTION_STATS.SEND_FAILED, error);
      }
    }
  }

  const formatValue = (stats, mediaType, directionType, itemKey) => {
    const value = stats[mediaType][directionType === 'send' ? 'sending' : 'receiving'][itemKey];
    if (['number', 'string', 'boolean'].indexOf(typeof value) > -1) {
      return value;
    }
    return null;
  };

  const buildAudioTrackInfo = (stream, track) => ({
    stream_id: stream.id,
    id: track.id,
    label: track.label,
    muted: !track.enabled,
  });

  const buildVideoTrackInfo = (stream, track, settings) => ({
    stream_id: stream.id,
    id: track.id,
    label: track.label,
    height: settings.video.resolution.height,
    width: settings.video.resolution.width,
    muted: !track.enabled,
  });

  class HandleBandwidthStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        peer_id: null,
        audio_send: { tracks: [] },
        audio_recv: {},
        video_send: { tracks: [] },
        video_recv: {},
        error: null,
      };
      this.stats = null;
    }

    gatherSendAudioPacketsStats() {
      this.model.audio_send.bytes = formatValue(this.stats, 'audio', 'send', 'bytes');
      this.model.audio_send.packets = formatValue(this.stats, 'audio', 'send', 'packets');
      this.model.audio_send.echo_return_loss = formatValue(this.stats, 'audio', 'send', 'echoReturnLoss');
      this.model.audio_send.echo_return_loss_enhancement = formatValue(this.stats, 'audio', 'send', 'echoReturnLossEnhancement');
      this.model.audio_send.round_trip_time = formatValue(this.stats, 'audio', 'send', 'roundTripTime');
      this.model.audio_send.audio_level = formatValue(this.stats, 'audio', 'send', 'audioLevel');
      this.model.audio_send.jitter = formatValue(this.stats, 'audio', 'send', 'jitter');
    }

    gatherReceiveAudioPacketsStats() {
      this.model.audio_recv.bytes = formatValue(this.stats, 'audio', 'recv', 'bytes');
      this.model.audio_recv.packets = formatValue(this.stats, 'audio', 'recv', 'packets');
      this.model.audio_recv.packets_lost = formatValue(this.stats, 'audio', 'recv', 'packetsLost');
      this.model.audio_recv.jitter = formatValue(this.stats, 'audio', 'recv', 'jitter');
      this.model.audio_recv.audio_level = formatValue(this.stats, 'audio', 'recv', 'audioLevel');
    }

    gatherSendVideoPacketsStats() {
      this.model.video_send.bytes = formatValue(this.stats, 'video', 'send', 'bytes');
      this.model.video_send.packets = formatValue(this.stats, 'video', 'send', 'packets');
      this.model.video_send.nack_count = formatValue(this.stats, 'video', 'send', 'nacks');
      this.model.video_send.firs_count = formatValue(this.stats, 'video', 'send', 'firs');
      this.model.video_send.plis_count = formatValue(this.stats, 'video', 'send', 'plis');
      this.model.video_send.frames_encoded = formatValue(this.stats, 'video', 'send', 'framesEncoded');
      this.model.video_send.frame_width = formatValue(this.stats, 'video', 'send', 'frameWidth');
      this.model.video_send.frame_height = formatValue(this.stats, 'video', 'send', 'frameHeight');
      this.model.video_send.round_trip_time = formatValue(this.stats, 'video', 'send', 'roundTripTime');
      this.model.video_send.qp_sum = formatValue(this.stats, 'video', 'send', 'qpSum');
      this.model.video_send.jitter = formatValue(this.stats, 'video', 'send', 'jitter');
      this.model.video_send.frames = formatValue(this.stats, 'video', 'send', 'frames');
      this.model.video_send.hugeFrames = formatValue(this.stats, 'video', 'send', 'hugeFramesSent');
      this.model.video_send.framesPerSecond = formatValue(this.stats, 'video', 'send', 'framesPerSecond');
    }

    gatherReceiveVideoPacketsStats() {
      this.model.video_recv.bytes = formatValue(this.stats, 'video', 'recv', 'bytes');
      this.model.video_recv.packets = formatValue(this.stats, 'video', 'recv', 'packets');
      this.model.video_recv.packets_lost = formatValue(this.stats, 'video', 'recv', 'packetsLost');
      this.model.video_recv.nack_count = formatValue(this.stats, 'video', 'recv', 'nacks');
      this.model.video_recv.firs_count = formatValue(this.stats, 'video', 'recv', 'firs');
      this.model.video_recv.plis_count = formatValue(this.stats, 'video', 'recv', 'plis');
      this.model.video_recv.frames_decoded = formatValue(this.stats, 'video', 'recv', 'framesDecoded');
      this.model.video_recv.qp_sum = formatValue(this.stats, 'video', 'recv', 'qpSum');
      this.model.video_recv.frames_decoded = formatValue(this.stats, 'video', 'recv', 'framesDecoded');
      this.model.video_recv.frames_dropped = formatValue(this.stats, 'video', 'recv', 'framesDropped');
      this.model.video_recv.decoderImplementation = formatValue(this.stats, 'video', 'recv', 'decoderImplementation');
    }

    buildTrackInfo(roomKey) {
      const state = Skylink.getSkylinkState(roomKey);
      const { peerStreams, user, streamsSettings } = state;

      if (peerStreams[user.sid]) {
        const streamObjs = Object.values(peerStreams[user.sid]);

        streamObjs.forEach((streamObj) => {
          if (streamObj) {
            const stream = streamObj;
            const { settings } = streamsSettings[streamObj.id];
            const audioTracks = stream.getAudioTracks();
            const videoTracks = stream.getVideoTracks();

            audioTracks.forEach((audioTrack) => {
              const audioTrackInfo = buildAudioTrackInfo(stream, audioTrack);
              this.model.audio_send.tracks.push(audioTrackInfo);
            });

            videoTracks.forEach((videoTrack) => {
              const videoTrackInfo = buildVideoTrackInfo(stream, videoTrack, settings);
              this.model.video_send.tracks.push(videoTrackInfo);
            });
          }
        });
      }
    }

    send(roomKey, peerConnection, peerId) {
      const { STATS_MODULE } = MESSAGES;
      const roomState = Skylink.getSkylinkState(roomKey);

      if (!roomState) {
        logger.log.DEBUG([peerId, 'Statistics', 'Bandwidth_Stats', STATS_MODULE.HANDLE_BANDWIDTH_STATS.NO_STATE]);
        return;
      }

      if (isEmptyObj(roomState.peerStreams)) {
        return;
      }

      this.model.client_id = roomState.clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;

      PeerConnection.retrieveStatistics(roomKey, peerId, Skylink.getInitOptions().beSilentOnStatsLogs).then((stats) => {
        if (stats) {
          this.stats = stats;
          this.gatherSendAudioPacketsStats();
          this.gatherReceiveAudioPacketsStats();
          this.gatherSendVideoPacketsStats();
          this.gatherReceiveVideoPacketsStats();
          this.buildTrackInfo(roomKey);
          this.postStats(this.endpoints.bandwidth, this.model);
        }
      }).catch((error) => {
        this.model.error = error ? error.message : null;
        logger.log.DEBUG(STATS_MODULE.HANDLE_BANDWIDTH_STATS.RETRIEVE_FAILED, error);
      });
    }
  }

  let instance$3 = {};

  class BandwidthAdjuster {
    constructor(params) {
      if (params.roomKey) {
        this.resetBandwidthAdjusterInstance(params.roomKey, params.peerId);
        return null;
      }

      const { peerConnection, state, targetMid } = params;

      if (instance$3[targetMid]) {
        return instance$3[targetMid];
      }

      this.peerId = targetMid;
      this.state = state;
      this.peerConnection = peerConnection;
      this.bandwidth = null;

      instance$3[this.peerId] = this;
    }

    static formatTotalFn(arr) {
      let total = 0;
      for (let i = 0; i < arr.length; i += 1) {
        total += arr[i];
      }
      return total / arr.length;
    }

    setAdjustmentInterval() {
      const { bandwidthAdjuster, peerStats, room } = this.state;
      const { PEER_CONNECTION_STATE } = SkylinkConstants;

      if (this.bandwidth) {
        return;
      }

      const bandwidth = {
        audio: { send: [], recv: [] },
        video: { send: [], recv: [] },
      };
      let currentBlock = 0;

      const adjustmentInterval = setInterval(() => {
        if (!(this.peerConnection && this.peerConnection.signalingState
          !== PEER_CONNECTION_STATE.CLOSED) || !bandwidthAdjuster || !peerStats[this.peerId]) {
          clearInterval(adjustmentInterval);
          return;
        }

        PeerConnection.retrieveStatistics(room.id, this.peerId, Skylink.getInitOptions().beSilentOnStatsLogs, true)
          .then((stats) => {
            if (!(this.peerConnection && this.peerConnection.signalingState
              !== PEER_CONNECTION_STATE.CLOSED) || !bandwidthAdjuster) {
              clearInterval(adjustmentInterval);
            }

            bandwidth.audio.send.push(stats.audio.sending.bytes ? stats.audio.sending.bytes * 8 : 0);
            bandwidth.audio.recv.push(stats.audio.receiving.bytes ? stats.audio.receiving.bytes * 8 : 0);
            bandwidth.video.send.push(stats.video.sending.bytes ? stats.video.sending.bytes * 8 : 0);
            bandwidth.video.recv.push(stats.video.receiving.bytes ? stats.video.receiving.bytes * 8 : 0);

            currentBlock += 1;

            if (currentBlock === bandwidthAdjuster.interval) {
              currentBlock = 0;
              let totalAudioBw = BandwidthAdjuster.formatTotalFn(bandwidth.audio.send);
              let totalVideoBw = BandwidthAdjuster.formatTotalFn(bandwidth.video.send);

              if (!bandwidthAdjuster.useUploadBwOnly) {
                totalAudioBw += BandwidthAdjuster.formatTotalFn(bandwidth.audio.recv);
                totalVideoBw += BandwidthAdjuster.formatTotalFn(bandwidth.video.recv);
                totalAudioBw /= 2;
                totalVideoBw /= 2;
              }

              totalAudioBw = parseInt((totalAudioBw * (bandwidthAdjuster.limitAtPercentage / 100)) / 1000, 10);
              totalVideoBw = parseInt((totalVideoBw * (bandwidthAdjuster.limitAtPercentage / 100)) / 1000, 10);

              PeerConnection.refreshConnection(this.state, this.peerId, false, {
                bandwidth: { audio: totalAudioBw, video: totalVideoBw },
              });
            }
          })
          .catch(() => {
            bandwidth.audio.send.push(0);
            bandwidth.audio.recv.push(0);
            bandwidth.video.send.push(0);
            bandwidth.video.recv.push(0);
          });
      }, 1000);

      this.bandwidth = bandwidth;
    }

    // eslint-disable-next-line class-methods-use-this
    resetBandwidthAdjusterInstance(roomKey, peerId = null) {
      const state = Skylink.getSkylinkState(roomKey);
      state.streamsBandwidthSettings.bAS = {};
      Skylink.setSkylinkState(state, roomKey);

      if (peerId) {
        delete instance$3[peerId];
      } else {
        instance$3 = {};
      }
    }
  }

  const isIceConnectionStateCompleted = (pcIceConnectionState) => {
    const { ICE_CONNECTION_STATE } = SkylinkConstants;
    return [ICE_CONNECTION_STATE.COMPLETED,
      ICE_CONNECTION_STATE.CONNECTED].indexOf(pcIceConnectionState) > -1;
  };

  /**
   * @param {RTCPeerConnection} peerConnection
   * @param {String} targetMid - The Peer Id
   * @param {SkylinkState} currentRoomState
   * @fires ICE_CONNECTION_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const oniceconnectionstatechange = (peerConnection, targetMid, currentRoomState) => {
    const { ROOM_STATE, ICE_CONNECTION, PEER_CONNECTION } = MESSAGES;
    const { ICE_CONNECTION_STATE, PEER_CONNECTION_STATE, BROWSER_AGENT } = SkylinkConstants;
    const state = Skylink.getSkylinkState(currentRoomState.room.id);
    const { peerStreams, user, enableStatsGathering } = state;
    const initOptions = Skylink.getInitOptions();
    let statsInterval = null;
    const pcIceConnectionState = peerConnection.iceConnectionState;

    if (isAgent(BROWSER_AGENT.REACT_NATIVE) && !state && pcIceConnectionState === ICE_CONNECTION_STATE.CLOSED) {
      return;
    }

    if (!state) {
      logger.log.DEBUG([targetMid, 'RTCIceConnectionState', null, ROOM_STATE.NOT_FOUND]);
      return;
    }

    const {
      hasMCU, bandwidthAdjuster, peerStats, streamsBandwidthSettings,
    } = state;

    if (pcIceConnectionState === ICE_CONNECTION_STATE.FAILED) { // peer connection 'failed' state is dispatched in onconnectionstatechange
      if (isAgent(BROWSER_AGENT.FIREFOX) && !peerStreams[user.sid]) {
        // no audio and video requested will throw ice connection state failed although ice candidates are exchanged
        return;
      }
    }

    logger.log.DEBUG([targetMid, 'RTCIceConnectionState', null, ICE_CONNECTION.STATE_CHANGE], pcIceConnectionState);
    const handleIceConnectionStats = new HandleIceConnectionStats();
    handleIceConnectionStats.send(currentRoomState.room.id, peerConnection.iceConnectionState, targetMid);
    dispatchEvent(iceConnectionState({
      state: pcIceConnectionState,
      peerId: targetMid,
    }));

    if (!statsInterval && isIceConnectionStateCompleted(pcIceConnectionState) && !peerStats[targetMid] && enableStatsGathering) {
      statsInterval = true;
      peerStats[targetMid] = {};

      logger.log.DEBUG([targetMid, 'RTCStatsReport', null, 'Retrieving first report to tabulate results']);

      // Do an initial getConnectionStatus() to backfill the first retrieval in order to do (currentTotalStats - lastTotalStats).
      PeerConnection.getConnectionStatus(state, targetMid).then(() => {
        statsInterval = setInterval(() => {
          const currentState = Skylink.getSkylinkState(state.room.id);
          if (!currentState || !currentState.room.inRoom) {
            clearInterval(statsInterval);
            return;
          }
          if (peerConnection.connectionState === PEER_CONNECTION_STATE.CLOSED || peerConnection.iceConnectionState === ICE_CONNECTION_STATE.CLOSED) {
            if (peerConnection.connectionState === PEER_CONNECTION_STATE.CLOSED) { // polyfill for
              // Safari and FF peerConnection state 'closed' when ice failure
              logger.log.DEBUG([targetMid, 'RTCPeerConnectionState', null, PEER_CONNECTION.STATE_CHANGE], peerConnection.connectionState);
              dispatchEvent(peerConnectionState({
                state: PEER_CONNECTION_STATE.CLOSED,
                peerId: targetMid,
              }));
            }

            if (peerConnection.iceConnectionState === ICE_CONNECTION_STATE.CLOSED) {
              logger.log.DEBUG([targetMid, 'RTCIceConnectionState', null, ICE_CONNECTION.STATE_CHANGE], peerConnection.iceConnectionState);
              handleIceConnectionStats.send(currentRoomState.room.id, peerConnection.iceConnectionState, targetMid);
              dispatchEvent(iceConnectionState({
                state: ICE_CONNECTION_STATE.CLOSED,
                peerId: targetMid,
              }));
            }

            clearInterval(statsInterval);
          } else {
            new HandleBandwidthStats().send(state.room.id, peerConnection, targetMid);
          }
        }, initOptions.statsInterval * 1000);
      });
    }

    if (!hasMCU && isIceConnectionStateCompleted(pcIceConnectionState) && !!bandwidthAdjuster && isEmptyObj(streamsBandwidthSettings.bAS)) {
      new BandwidthAdjuster({
        targetMid,
        state,
        peerConnection,
      }).setAdjustmentInterval();
    }
  };

  /**
   * @param {RTCPeerConnection} peerConnection
   * @param {String} targetMid - The Peer Id
   * @param {SkylinkState} roomState - The current state
   * @fires CANDIDATE_GENERATION_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const onicegatheringstatechange = (peerConnection, targetMid, roomState) => {
    const { ICE_CONNECTION } = MESSAGES;
    const { iceGatheringState } = peerConnection;

    logger.log.INFO([targetMid, 'RTCIceGatheringState', null, ICE_CONNECTION.STATE_CHANGE], iceGatheringState);
    dispatchEvent(candidateGenerationState({
      state: iceGatheringState,
      room: Room.getRoomInfo(roomState.room.id),
      peerId: targetMid,
    }));
  };

  /**
   *
   * @param {RTCPeerConnection} peerConnection
   * @param {String} targetMid - The Peer Id
   * @fires PEER_CONNECTION_STATE
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  // eslint-disable-next-line no-unused-vars
  const onsignalingstatechange = (peerConnection, targetMid) => {
    const { PEER_CONNECTION } = MESSAGES;

    logger.log.DEBUG([targetMid, 'RTCPeerConnectionSignalingState', null, PEER_CONNECTION.STATE_CHANGE], peerConnection.signalingState);
    dispatchEvent(peerConnectionState({
      state: peerConnection.signalingState,
      peerId: targetMid,
    }));
  };

  const matchPeerIdWithTransceiverMid = (state, transceiver) => {
    const { peerMedias, user } = state;
    const peerIds = Object.keys(peerMedias);

    for (let i = 0; i < peerIds.length; i += 1) {
      if (peerIds[i] !== user.sid) {
        const mediaInfos = Object.values(peerMedias[peerIds[i]]);
        for (let m = 0; m < mediaInfos.length; m += 1) {
          if (mediaInfos[m].transceiverMid === transceiver.mid) {
            return peerIds[i];
          }
        }
      }
    }

    return null;
  };

  /**
   * Function that handles the <code>RTCPeerConnection.addTrack</code> remote MediaTrack received.
   * @param {RTCPeerConnection} RTCPeerConnection
   * @param {String} targetMid
   * @param {SkylinkState} currentRoomState
   * @param {RTCTrackEvent} rtcTrackEvent
   * @returns {null}
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const ontrack = (RTCPeerConnection, targetMid, currentRoomState, rtcTrackEvent) => {
    const state = Skylink.getSkylinkState(currentRoomState.room.id);
    const {
      peerConnections, room, hasMCU,
    } = state;
    const stream = rtcTrackEvent.streams[0];
    const { transceiver, track } = rtcTrackEvent;
    let peerId = targetMid;

    if (!stream) {
      logger.log.WARN('ontrack stream is null');
      return null;
    }

    if (transceiver.mid === null) {
      logger.log.WARN('Transceiver mid is null', transceiver);
    }

    if (!peerConnections[peerId]) return null;

    if (hasMCU) {
      peerId = matchPeerIdWithTransceiverMid(state, transceiver);
    }

    const isScreensharing = PeerMedia.retrieveScreenMediaInfo(state.room, peerId, { transceiverMid: transceiver.mid });
    const callbackExtraParams = [peerId, room, isScreensharing];
    stream.onremovetrack = callbacks$2.onremovetrack.bind(undefined, ...callbackExtraParams);
    PeerMedia.updateStreamIdFromOntrack(state.room, peerId, transceiver.mid, stream.id);
    PeerConnection.updatePeerInformationsMediaStatus(state.room, peerId, transceiver, stream);
    PeerStream.addStream(peerId, stream, room.id);
    new HandleUserMediaStats().send(room.id);
    MediaStream.onRemoteTrackAdded(stream, currentRoomState, peerId, isScreensharing, track.kind === TRACK_KIND.VIDEO, track.kind === TRACK_KIND.AUDIO);

    return null;
  };

  const dispatchPeerUpdated = (state, peerId) => {
    dispatchEvent(peerUpdated({
      peerId,
      peerInfo: PeerData.getPeerInfo(peerId, state.room),
      isSelf: false,
    }));
  };

  const updatePeerStreamsAndMediaStatus = (state, peerId, streamId) => {
    const updatedState = state;

    delete updatedState.peerInformations[peerId].mediaStatus[streamId];
    PeerStream.deleteStream(peerId, updatedState.room, streamId);

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
  };

  const dispatchStreamEndedEvent = (state, peerId, isScreensharing, rtcTrackEvent, stream) => {
    PeerStream.dispatchStreamEvent(STREAM_ENDED, {
      room: state.room,
      peerId,
      peerInfo: PeerData.getPeerInfo(peerId, state.room),
      isSelf: false,
      isScreensharing,
      streamId: stream.id,
      isVideo: rtcTrackEvent.track.kind === TRACK_KIND.VIDEO,
      isAudio: rtcTrackEvent.track.kind === TRACK_KIND.AUDIO,
    });
  };

  /**
   * @param {String} peerId
   * @param {String} room
   * @param {boolean} isScreensharing
   * @param {MediaStreamTrackEvent} rtcTrackEvent
   * @fires STREAM_ENDED
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const onremovetrack = (peerId, room, isScreensharing, rtcTrackEvent) => {
    const state = getStateByKey(room.id);
    const { peerInformations } = state;
    const { MEDIA_STREAM, PEER_INFORMATIONS } = MESSAGES;
    const stream = isAgent(BROWSER_AGENT.REACT_NATIVE) ? rtcTrackEvent.stream : rtcTrackEvent.target;


    logger.log.INFO([peerId, TAGS.MEDIA_STREAM, null, MEDIA_STREAM.REMOTE_TRACK_REMOVED], {
      peerId, isSelf: false, isScreensharing, track: rtcTrackEvent.track,
    });

    if (!peerInformations[peerId]) {
      // peerInformations[peerId] will be undefined if onremovetrack is called from byeHandler
      logger.log.DEBUG([peerId, TAGS.MEDIA_STREAM, null, `${MEDIA_STREAM.ERRORS.DROPPING_ONREMOVETRACK}` - `${PEER_INFORMATIONS.NO_PEER_INFO} ${peerId}`]);
      return;
    }

    if (!stream) {
      logger.log.DEBUG([peerId, TAGS.MEDIA_STREAM, null, `${MEDIA_STREAM.ERRORS.DROPPING_ONREMOVETRACK}` - `${MEDIA_STREAM.NO_STREAM}`]);
      return;
    }

    updatePeerStreamsAndMediaStatus(state, peerId, stream.id);
    dispatchStreamEndedEvent(state, peerId, isScreensharing, rtcTrackEvent, stream);
    dispatchPeerUpdated(state, peerId);
  };

  /**
   * React Native only callback to retrieve senders from the peer connection as the sender object is not returned from peerConnection.addTrack.
   * @param peerConnection
   * @param targetMid
   * @param currentRoomState
   * @param event
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const onsenderadded = (peerConnection, targetMid, currentRoomState, event) => {
    const updatedState = Skylink.getSkylinkState(currentRoomState.room.id);
    const { sender } = event;
    helpers$4.processNewSender(updatedState, targetMid, sender);
  };

  const onconnectionstatechange = (peerConnection, targetMid, state) => {
    const { room } = state;
    const { connectionState, iceConnectionState } = peerConnection;

    // some states are not dispatched on oniceconnectionstatechange
    const handleIceConnectionStats = new HandleIceConnectionStats();
    handleIceConnectionStats.send(room.id, connectionState === PEER_CONNECTION_STATE$1.FAILED ? ICE_CONNECTION_STATE$1.FAILED : iceConnectionState, targetMid);

    logger.log.DEBUG([targetMid, 'RTCPeerConnectionState', null, MESSAGES.PEER_CONNECTION.STATE_CHANGE], peerConnection.connectionState);
    dispatchEvent(peerConnectionState({
      state: connectionState,
      peerId: targetMid,
    }));
  };

  /**
   * @description Callbacks for createPeerConnection method
   * @type {{ondatachannel, onicecandidate, oniceconnectionstatechange, onicegatheringstatechange, onsignalingstatechange, ontrack, onremovetrack, onsenderadded, onconnectionstatechange}}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @namespace CreatePeerConnectionCallbacks
   * @private
   */
  const callbacks$2 = {
    ontrack,
    ondatachannel,
    onicecandidate,
    oniceconnectionstatechange,
    onicegatheringstatechange,
    onsignalingstatechange,
    onremovetrack,
    onsenderadded,
    onconnectionstatechange,
  };

  const processOnRemoveTrack = (state, peerId, clonedMediaInfo) => {
    // This method is required because react native android does not have a way for the remote to register onremovetrack event
    // onremovetrack needs to be caught in the renegotiation when the remote calls stopStreams and sends an offer
    // the removed track/stream will be set to unavailable
    // Although react native ios has didRemoveReceiver callback, and onremovetrack can be artificially attached to the peerConnection to process
    // a stopped stream, the type of stream is not identifiable i.e is screenshare or not.
    // Therefore react native ios and android will implement the same workaround for now.
    if (isAgent(BROWSER_AGENT.REACT_NATIVE) && clonedMediaInfo) {
      const { room } = state;
      const trackInfo = {
        track: {
          id: null,
          kind: null,
        },
      };
      const stream = {
        id: null,
      };
      trackInfo.track.id = clonedMediaInfo.trackId;
      trackInfo.track.kind = (clonedMediaInfo.mediaType === MEDIA_TYPE.AUDIO || clonedMediaInfo.mediaType === MEDIA_TYPE.AUDIO_MIC) ? TRACK_KIND.AUDIO : TRACK_KIND.VIDEO;
      stream.id = clonedMediaInfo.streamId;
      trackInfo.stream = stream;
      if (!(trackInfo.track.id || trackInfo.track.kind || stream.id)) {
        logger.log.DEBUG([peerId, TAGS.MEDIA_STREAM, null, `${MESSAGES.BROWSER_AGENT.REACT_NATIVE.ERRORS.DROPPING_ONREMOVETRACK}`], trackInfo);
        return;
      }
      callbacks$2.onremovetrack(peerId, room, clonedMediaInfo.mediaType === MEDIA_TYPE.VIDEO_SCREEN, trackInfo);
    }
  };

  const helpers$5 = {
    retrieveTransceiverMid,
    retrieveMediaState,
    retrieveMediaId,
    buildPeerMediaInfo,
    retrieveStreamIdOfTrack,
    updatePeerMediaInfo,
    sendMediaInfoMsg,
    parseSDPForTransceiverMid,
    retrieveValueGivenTransceiverMid,
    retrieveFormattedMediaInfo,
    resetPeerMedia,
    populatePeerMediaInfo,
    processOnRemoveTrack,
  };

  class PeerMedia {
    /**
     * Method that updates local media info with user sid returned from inRoom message. There is no user.sid information prior to inRoom message.
     * @param room
     * @param sid
     * @private
     */
    static updatePeerMediaWithUserSid(room, sid) {
      const updatedState = Skylink.getSkylinkState(room.id);

      updatedState.peerMedias[sid] = Object.assign({}, updatedState.peerMedias.null);
      delete updatedState.peerMedias.null;
      Skylink.setSkylinkState(updatedState, room.id);
      Object.keys(updatedState.peerMedias[sid]).forEach((mediaId) => {
        helpers$5.updatePeerMediaInfo(room, sid, false, mediaId, MEDIA_INFO.PUBLISHER_ID, sid);
      });
    }

    /**
     * Method that updates the stream id of the remote peer in the peer media info
     * @param room
     * @param peerId
     * @param transceiverMid
     * @param streamId
     */
    static updateStreamIdFromOntrack(room, peerId, transceiverMid, streamId) {
      const state = Skylink.getSkylinkState(room.id);
      const mediaId = helpers$5.retrieveValueGivenTransceiverMid(state, peerId, transceiverMid, MEDIA_INFO.MEDIA_ID);
      helpers$5.updatePeerMediaInfo(room, peerId, false, mediaId, MEDIA_INFO.STREAM_ID, streamId);
    }

    /**
     * Method that checks if a transceiver mid corresponds to a screen stream
     * @param state
     * @param peerId
     * @param transceiverMid
     * @returns {boolean}
     */
    static isVideoScreenTrack(state, peerId, transceiverMid) {
      const { peerMedias } = state;
      const mediaInfos = Object.values(peerMedias[peerId]);

      for (let m = 0; m < mediaInfos.length; m += 1) {
        if (mediaInfos[m].transceiverMid === transceiverMid) {
          return mediaInfos[m].mediaType === MEDIA_TYPE.VIDEO_SCREEN;
        }
      }

      return false;
    }

    /**
     * Method that updates the peer media info state to unavailable.
     * @param room
     * @param peerId
     * @param mediaId
     */
    static setMediaStateToUnavailable(room, peerId, mediaId) {
      helpers$5.updatePeerMediaInfo(room, peerId, false, mediaId, MEDIA_INFO.MEDIA_STATE, MEDIA_STATE.UNAVAILABLE);
    }

    /**
     * Method that removes mediaInfo that has mediaState set to unavailable.
     * @param {SkylinkRoom} room
     * @param {String} peerId
     * @param {String|null} mediaId
     */
    static deleteUnavailableMedia(room, peerId, mediaId = null) {
      const updatedState = Skylink.getSkylinkState(room.id);

      if (peerId === PEER_TYPE.MCU || !updatedState.peerMedias[peerId]) {
        return;
      }

      let clonedMediaInfo;
      if (!mediaId) {
        const mediaInfos = updatedState.peerMedias[peerId];
        Object.values(mediaInfos).forEach((mInfo) => {
          if (mInfo.mediaState === MEDIA_STATE.UNAVAILABLE) {
            clonedMediaInfo = clone_1(mInfo);
            delete updatedState.peerMedias[peerId][mInfo.mediaId];
          }
        });
      } else {
        clonedMediaInfo = clone_1(updatedState.peerMedias[peerId][mediaId]);
        delete updatedState.peerMedias[peerId][mediaId];
      }

      Skylink.setSkylinkState(updatedState, room.id);

      helpers$5.processOnRemoveTrack(updatedState, peerId, clonedMediaInfo);

      if (clonedMediaInfo) {
        dispatchEvent(mediaInfoDeleted({
          mediaInfo: clonedMediaInfo,
        }));
      }
    }

    /**
     * Method that updates the peer media info.
     * @param room
     * @param peerId
     * @param mediaId
     * @param key
     * @param value
     * @private
     */
    static updatePeerMediaInfo(room, peerId, mediaId, key, value) {
      helpers$5.updatePeerMediaInfo(room, peerId, true, mediaId, key, value);
    }

    /**
     * Method that sets the remote peer media info from the offer.
     * @param room
     * @param targetMid
     * @param mediaInfoList
     */
    static setPeerMediaInfo(room, targetMid, mediaInfoList = []) {
      try {
        const state = Skylink.getSkylinkState(room.id);

        if (targetMid === PEER_TYPE.MCU && !isEmptyArray(mediaInfoList)) { // targetMid needs to be obtained from
          // mediaInfoList
          const targetPeerIds = [];
          mediaInfoList.forEach((mediaInfo) => {
            if (targetPeerIds.indexOf(mediaInfo.publisherId) === -1) {
              targetPeerIds.push(mediaInfo.publisherId);
            }
          });
          targetPeerIds.forEach((peerId) => {
            // eslint-disable-next-line array-callback-return,consistent-return
            const targetMediaInfoList = mediaInfoList.filter((mediaInfo) => {
              if (mediaInfo.publisherId === peerId) {
                return mediaInfo;
              }
            });
            this.setPeerMediaInfo(room, peerId, targetMediaInfoList);
          });
        } else if (targetMid !== PEER_TYPE.MCU) {
          const clonedPeerMedia = clone_1(state.peerMedias[targetMid]) || {};
          const updatedState = helpers$5.resetPeerMedia(room, targetMid);
          mediaInfoList.forEach((mediaInfo) => {
            updatedState.peerMedias[mediaInfo.publisherId] = helpers$5.populatePeerMediaInfo(updatedState, clonedPeerMedia, mediaInfo);
          });
          Skylink.setSkylinkState(updatedState, room.id);
        }
      } catch (err) {
        logger.log.ERROR([targetMid, TAGS.PEER_MEDIA, null, MESSAGES.MEDIA_INFO.ERRORS.FAILED_SETTING_PEER_MEDIA_INFO]);
      }
    }

    /**
     * Method that returns the streamId from the peer media info.
     * @param room
     * @param peerId
     * @param mediaId
     * @returns {String} streamId
     */
    static retrieveStreamId(room, peerId, mediaId) {
      const state = Skylink.getSkylinkState(room.id);
      const { peerMedias } = state;
      const mediaInfo = peerMedias[peerId][mediaId];
      const { streamId } = mediaInfo;

      if (!streamId) {
        logger.log.ERROR([peerId, TAGS.PEER_MEDIA, null, MESSAGES.MEDIA_INFO.ERRORS.NO_ASSOCIATED_STREAM_ID]);
      }

      return streamId;
    }

    /**
     * Method that returns the mediaId
     * @param trackKind
     * @param streamId
     * @returns {String} mediaId
     */
    static retrieveMediaId(trackKind, streamId) {
      return helpers$5.retrieveMediaId(trackKind, streamId);
    }

    /**
     * Method that returns the local media info format for offer and answer message.
     * @param room
     * @param peerId
     * @param sessionDescription
     * @returns {object} mediaInfo
     * @private
     */
    static retrieveMediaInfoForOfferAnswer(room, sessionDescription) {
      const state = Skylink.getSkylinkState(room.id);
      const peerId = state.user.sid;

      helpers$5.parseSDPForTransceiverMid(room, peerId, sessionDescription);
      return helpers$5.retrieveFormattedMediaInfo(room, peerId);
    }

    /**
     * Method that processes the peer media and adds it to the state after successfully obtaining the stream from getUserMedia. MediaInfoEvent is not dispatched.
     * @param room
     * @param peerId
     * @param stream
     * @param isScreensharing
     * @param dispatchEvt - The flag if the update should dispatch mediaInfoEvent signaling message.
     * @private
     */
    static processPeerMedia(room, peerId, stream, isScreensharing, dispatchEvt = false) {
      const updatedState = Skylink.getSkylinkState(room.id);
      const peerMedia = updatedState.peerMedias[peerId] || {};
      const tracks = stream.getTracks();
      let mediaId = null;

      try {
        tracks.forEach((track) => {
          mediaId = helpers$5.retrieveMediaId(track.kind, stream.id);
          // eslint-disable-next-line no-nested-ternary
          peerMedia[mediaId] = helpers$5.buildPeerMediaInfo(room, peerId, track, stream.id, track.kind === TRACK_KIND.AUDIO ? MEDIA_TYPE.AUDIO_MIC : (isScreensharing ? MEDIA_TYPE.VIDEO_SCREEN : MEDIA_TYPE.VIDEO_CAMERA));
          helpers$5.updatePeerMediaInfo(room, peerId, dispatchEvt, mediaId, null, null, peerMedia[mediaId]);
        });
      } catch (err) {
        logger.log.ERROR([peerId, TAGS.MEDIA_INFO, MESSAGES.MEDIA_INFO.ERRORS.FAILED_PROCESSING_PEER_MEDIA], err);
      }
    }

    /**
     * Method that checks if a given stream is a screen share stream
     * @param room
     * @param peerId
     * @param options
     * @return {boolean|any}
     */
    static retrieveScreenMediaInfo(room, peerId, options) {
      const state = Skylink.getSkylinkState(room.id);
      const { peerMedias } = state;
      const mediaInfos = Object.values(peerMedias[peerId]);
      for (let i = 0; i < mediaInfos.length; i += 1) {
        if (options.streamId && mediaInfos[i].streamId === options.streamId) {
          return mediaInfos[i].mediaType === MEDIA_TYPE.VIDEO_SCREEN ? mediaInfos[i] : false;
        }

        if (options.transceiverMid && mediaInfos[i].transceiverMid === options.transceiverMid) {
          return mediaInfos[i].mediaType === MEDIA_TYPE.VIDEO_SCREEN;
        }

        if (!options) {
          return mediaInfos[i].mediaType === MEDIA_TYPE.VIDEO_SCREEN;
        }
      }

      logger.log.ERROR([peerId, TAGS.PEER_MEDIA, null, MESSAGES.MEDIA_INFO.ERRORS.STREAM_ID_NOT_MATCHED]);
      return false;
    }
  }

  const dispatchIncomingStream = (room, sid) => {
    const state = Skylink.getSkylinkState(room.id);
    if (!state.peerStreams[sid]) {
      return;
    }

    Object.values(state.peerStreams[sid]).forEach((stream) => {
      PeerStream.dispatchStreamEvent(ON_INCOMING_STREAM, {
        stream,
        peerId: sid,
        room: Room.getRoomInfo(room.id),
        isSelf: true,
        peerInfo: PeerData.getCurrentSessionInfo(room),
        streamId: stream.id,
        isVideo: stream.getVideoTracks().length > 0,
        isAudio: stream.getAudioTracks().length > 0,
      });
    });
  };

  const startUserMediaStatsInterval = (roomKey, peerId) => {
    const initOptions = Skylink.getInitOptions();
    new HandleUserMediaStats().send(roomKey); // send first stat

    const interval = setInterval(() => {
      const currentState = Skylink.getSkylinkState(roomKey);
      const userId = currentState ? currentState.user.sid : null;

      if (!currentState || userId !== peerId) { // user has left the room  or there is a new socket connection, so stop sending stats
        clearInterval(interval);
      } else {
        new HandleUserMediaStats().send(currentState.room.id);
      }
    }, initOptions.statsInterval * 1000);
  };

  /**
   * Function that handles the "inRoom" socket message received.
   * @param {JSON} message
   * @memberOf SignalingMessageHandler
   * @fires PEER_JOINED
   * @fires HANDSHAKE_PROGRESS
   * @fires ON_INCOMING_STREAM
   */
  const inRoomHandler = (message) => {
    const {
      pc_config: { iceServers },
      sid,
      rid,
      tieBreaker,
    } = message;
    const roomState = Skylink.getSkylinkState(rid);
    const signaling = new SkylinkSignalingServer();

    roomState.room.connection.peerConfig = IceConnection.setIceServers(iceServers);
    roomState.room.inRoom = true;
    roomState.user.sid = sid;
    logger.log.INFO([null, TAGS.SIG_SERVER, null, `${MESSAGES.PEER_INFORMATIONS.SET_PEER_PRIORITY_WEIGHT}: `], tieBreaker);
    roomState.peerPriorityWeight = tieBreaker;

    PeerMedia.updatePeerMediaWithUserSid(roomState.room, sid);
    PeerStream.updatePeerStreamWithUserSid(roomState.room, sid);
    Skylink.setSkylinkState(roomState, rid);

    dispatchEvent(peerJoined({
      peerId: roomState.user.sid,
      peerInfo: PeerData.getCurrentSessionInfo(roomState.room),
      isSelf: true,
      room: roomState.room,
    }));

    dispatchIncomingStream(roomState.room, sid);
    startUserMediaStatsInterval(roomState.room.id, sid);
    signaling.enterRoom(roomState);
  };

  const parseVersion = (version) => {
    if (!(version && typeof version === 'string')) {
      return 0;
    }
    // E.g. 0.9.6, replace minor "." with 0
    if (version.indexOf('.') > -1) {
      const parts = version.split('.');
      if (parts.length > 2) {
        const majorVer = parts[0] || '0';
        parts.splice(0, 1);
        return parseFloat(`${majorVer}.${parts.join('0')}`, 10);
      }
      return parseFloat(version || '0', 10);
    }
    return parseInt(version || '0', 10);
  };


  const enterAndWelcome = (msg) => {
    const state = Skylink.getSkylinkState(msg.rid);
    const parsedMsg = {};
    const { hasMCU } = state;
    const {
      rid,
      mid,
      enableIceRestart,
      enableDataChannel,
      weight,
      agent,
      os,
      temasysPluginVersion,
      SMProtocolVersion,
      DTProtocolVersion,
      version,
      publisherId,
    } = msg;

    parsedMsg.publisherId = publisherId || null;
    parsedMsg.rid = rid;
    parsedMsg.mid = mid;
    parsedMsg.agent = agent && isAString(agent) ? agent : 'other';
    parsedMsg.version = parseVersion(version);
    parsedMsg.SMProtocolVersion = isAString(SMProtocolVersion) ? SMProtocolVersion : SM_PROTOCOL_VERSION;
    // eslint-disable-next-line no-nested-ternary
    parsedMsg.DTProtocolVersion = isAString(DTProtocolVersion) ? DTProtocolVersion : (hasMCU || mid === PEER_TYPE.MCU ? DT_PROTOCOL_VERSION : '0.1.0');
    parsedMsg.weight = isANumber(weight) ? weight : 0;
    parsedMsg.enableDataChannel = isABoolean(enableDataChannel) ? enableDataChannel : true;
    parsedMsg.enableIceRestart = isABoolean(enableIceRestart) ? enableIceRestart : false;
    parsedMsg.os = os && isAString(os) ? os : null;
    parsedMsg.temasysPluginVersion = temasysPluginVersion && isAString(temasysPluginVersion) ? temasysPluginVersion : null;
    parsedMsg.userInfo = parsers.parseUserInfo(state, msg, parsedMsg);

    if (hasMCU) {
      parsedMsg.peersInRoom = msg.peersInRoom;
    }

    return clone_1(parsedMsg);
  };

  const parseUserInfo = (state, msg, parsedMsg) => {
    const info = Object.assign({}, msg.userInfo);

    info.config = info.config ? info.config : {
      enableDataChannel: parsedMsg.enableDataChannel,
      enableIceRestart: parsedMsg.enableIceRestart,
      priorityWeight: parsedMsg.weight,
    };

    info.agent = info.agent ? info.agent : {
      name: parsedMsg.agent,
      version: parsedMsg.version,
      os: parsedMsg.os,
      pluginVersion: parsedMsg.temasysPluginVersion,
      SMProtocolVersion: parsedMsg.SMProtocolVersion,
      DTProtocolVersion: parsedMsg.DTProtocolVersion,
    };

    info.settings = info.settings ? info.settings : {};
    info.mediaStatus = info.mediaStatus ? info.mediaStatus : {};

    return info;
  };

  const parsers = {
    enterAndWelcome,
    parseUserInfo,
  };

  const setPeerInformations = (state, peerId, userInfo) => {
    const { room } = state;
    // eslint-disable-next-line no-param-reassign
    state.peerInformations[peerId] = PeerConnection.buildPeerInformations(userInfo, state);
    Skylink.setSkylinkState(state, room.id);
  };

  /**
   * Function that adds a Peer Connection and updates the state(Skylink State).
   * @param {JSON} params
   * @memberOf SignalingMessageHandler
   * @fires SERVER_PEER_JOINED
   * @fires PEER_JOINED
   * @fires HANDSHAKE_PROGRESS
   */
  const processPeer = (params) => {
    const {
      currentRoom,
      targetMid,
      cert,
      userInfo,
      message,
      caller,
    } = params;
    let isNewPeer = false;
    const state = Skylink.getSkylinkState(currentRoom.id);
    const { hasMCU } = state;
    const { peerInformations } = state;
    if ((!peerInformations[targetMid] && !hasMCU) || (hasMCU && targetMid === PEER_TYPE.MCU && !peerInformations.MCU)) {
      const hasScreenshare = !!userInfo.screenshare;
      isNewPeer = true;
      state.peerInformations[targetMid] = PeerConnection.buildPeerInformations(message.userInfo, state);

      const peerBrowser = {
        agent: userInfo.agent.name,
        version: userInfo.agent.version,
        os: userInfo.agent.os,
      };

      Skylink.setSkylinkState(state, currentRoom.id);

      PeerConnection.addPeer({
        currentRoom,
        targetMid,
        peerBrowser,
        cert,
        hasScreenshare,
      });

      if (targetMid === PEER_TYPE.MCU) {
        logger.log.INFO([targetMid, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.MCU]);
        state.hasMCU = true;
        dispatchEvent(serverPeerJoined({
          peerId: targetMid,
          serverPeerType: SERVER_PEER_TYPE.MCU,
          room: Room.getRoomInfo(currentRoom.id),
        }));
      } else {
        dispatchEvent(peerJoined({
          peerId: targetMid,
          peerInfo: PeerData.getPeerInfo(targetMid, currentRoom),
          isSelf: false,
          room: Room.getRoomInfo(currentRoom.id),
        }));
      }
    }

    state.peerMessagesStamps[targetMid] = state.peerMessagesStamps[targetMid] || {
      userData: 0,
      audioMuted: 0,
      videoMuted: 0,
    };

    if (caller === CALLERS.WELCOME) {
      state.peerMessagesStamps[targetMid].hasWelcome = false;
    }

    if (caller === CALLERS.WELCOME && hasMCU && Array.isArray(message.peersInRoom) && message.peersInRoom.length) {
      const userId = state.user.sid;
      for (let peersInRoomIndex = 0; peersInRoomIndex < message.peersInRoom.length; peersInRoomIndex += 1) {
        const PEER_ID = message.peersInRoom[peersInRoomIndex].mid;
        if (PEER_ID !== userId) {
          const parsedMsg = parsers.enterAndWelcome(message.peersInRoom[peersInRoomIndex]);
          const peerUserInfo = parsedMsg.userInfo;
          setPeerInformations(state, PEER_ID, peerUserInfo);
          dispatchEvent(peerJoined({
            peerId: PEER_ID,
            peerInfo: PeerData.getPeerInfo(PEER_ID, currentRoom),
            isSelf: false,
            room: Room.getRoomInfo(currentRoom.id),
          }));
        }
      }
    } else if (hasMCU && targetMid !== state.user.sid && targetMid !== PEER_TYPE.MCU) {
      setPeerInformations(state, targetMid, userInfo);
      dispatchEvent(peerJoined({
        peerId: targetMid,
        peerInfo: PeerData.getPeerInfo(targetMid, currentRoom),
        isSelf: false,
        room: Room.getRoomInfo(currentRoom.id),
      }));
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    if (isNewPeer) {
      dispatchEvent(handshakeProgress({
        peerId: targetMid,
        state: HANDSHAKE_PROGRESS$1.WELCOME,
        error: null,
        room: Room.getRoomInfo(currentRoom.id),
      }));
    }
  };

  const CALLERS = {
    ENTER: 'enterHandler',
    WELCOME: 'welcomeHander',
  };

  const getNextNegotiationStep = (params) => {
    let method = 'welcome';

    if (params.caller === CALLERS.WELCOME) {
      const state = Skylink.getSkylinkState(params.currentRoom.id);
      const { peerMessagesStamps, peerPriorityWeight, hasMCU } = state;
      if (hasMCU || peerPriorityWeight > params.message.weight) {
        if (peerMessagesStamps[params.targetMid].hasWelcome) {
          method = 'noop';
          logger.log.WARN([params.targetMid, TAGS.PEER_CONNECTION, null, 'Discarding extra "welcome" received.']);
        } else {
          method = 'offer';
          state.peerMessagesStamps[params.targetMid].hasWelcome = true;
          Skylink.setSkylinkState(state, params.currentRoom.id);
        }
      }
    }
    return method;
  };

  // eslint-disable-next-line consistent-return
  const checkStampBeforeSendingWelcome = (params) => {
    const { currentRoom, targetMid, message } = params;
    const state = Skylink.getSkylinkState(currentRoom.id);
    const { peerConnections, hasMCU } = state;
    const { STATS_MODULE, NEGOTIATION_PROGRESS, PEER_CONNECTION } = MESSAGES;
    const signaling = new SkylinkSignalingServer();
    const method = getNextNegotiationStep(params);

    if (method === 'offer') {
    // Added checks to ensure that connection object is defined first
      if (!peerConnections[targetMid]) {
        logger.log.WARN([targetMid, 'RTCSessionDescription', 'offer', PEER_CONNECTION.NO_PEER_CONNECTION]);
        handleNegotationStats.send(currentRoom.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS.OFFER.dropped, targetMid, message, false, PEER_CONNECTION.NO_PEER_CONNECTION);
        return null;
      }

      const { signalingState } = peerConnections[targetMid];

      // Added checks to ensure that state is "stable" if setting local "offer"
      if (signalingState !== PEER_CONNECTION_STATE$1.STABLE) {
        logger.log.WARN([targetMid, 'RTCSessionDescription', 'offer', NEGOTIATION_PROGRESS.ERRORS.NOT_STABLE], signalingState);
        handleNegotationStats.send(currentRoom.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS.OFFER.dropped, targetMid, message, false, NEGOTIATION_PROGRESS.ERRORS.NOT_STABLE);
        return null;
      }

      signaling[method](params.currentRoom, params.targetMid);
    } else if (!hasMCU) {
      signaling[method](params.currentRoom, params.targetMid);
    }
  };

  const logStats = (caller, targetMid, state, message) => {
    const { room } = state;

    let callerState = 'enter';
    if (caller === CALLERS.WELCOME) {
      callerState = 'welcome';
    }

    logger.log.INFO([targetMid, TAGS.PEER_CONNECTION, null, `Peer ${callerState} received ->`], message);
    handleNegotationStats.send(room.id, callerState, targetMid, message, true);
  };

  /**
   * Function that parses the enterAndWelcome and welcome message and sends the offer or welcome message.
   * @param {JSON} message
   * @param {String} caller
   * @memberOf SignalingMessageHandler
   */
  const parseAndSendWelcome = (message, caller) => {
    const parsedMsg = parsers.enterAndWelcome(message);
    const {
      rid, mid, userInfo, publisherId,
    } = parsedMsg;
    const state = Skylink.getSkylinkState(rid);
    const { hasMCU } = state;
    const targetMid = hasMCU && publisherId ? publisherId : mid;

    logStats(caller, targetMid, state, parsedMsg);

    const peerParams = {
      currentRoom: state.room,
      targetMid,
      userInfo,
      message: parsedMsg,
      caller,
    };

    processPeer(peerParams);
    checkStampBeforeSendingWelcome(peerParams);
  };

  const enterHandler = (message) => {
    parseAndSendWelcome(message, CALLERS.ENTER);
  };

  /* eslint-disable no-unused-vars,no-multi-assign */

  const handleSetOfferAndAnswerSuccess = (state, targetMid, description, isRemote) => {
    const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS } } = MESSAGES;
    const { peerConnections, bufferedLocalOffer, room } = state;
    const peerConnection = peerConnections[targetMid];
    const msgType = description.type === 'offer' ? 'OFFER' : 'ANSWER';

    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS[msgType].set, targetMid, description, isRemote);

    if (isRemote) { // handshake progress is triggered on the local end after sdp it is created
      dispatchEvent(handshakeProgress({
        state: HANDSHAKE_PROGRESS$1[msgType],
        peerId: targetMid,
        room: Room.getRoomInfo(room.id),
      }));
    }

    if (isRemote) {
      if (description.type === 'offer') {
        peerConnection.setOffer = 'remote';
      } else {
        peerConnection.setAnswer = 'remote';
      }
      IceConnection.addIceCandidateFromQueue(targetMid, room);
    } else {
      bufferedLocalOffer[targetMid] = null;
      if (description.type === 'offer') {
        peerConnection.setOffer = 'local';
      } else {
        peerConnection.setAnswer = 'local';
      }
    }

    Skylink.setSkylinkState(state, room.id);
  };

  const handleSetOfferAndAnswerFailure = (state, targetMid, description, isRemote, error) => {
    const { room, user } = state;
    const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS } } = MESSAGES;
    const msgType = description.type === 'offer' ? 'OFFER' : 'ANSWER';

    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS[msgType].set_error, targetMid, description, isRemote, error);

    dispatchEvent(handshakeProgress({
      state: HANDSHAKE_PROGRESS$1.ERROR,
      peerId: isRemote ? targetMid : user.sid,
      error,
      room: Room.getRoomInfo(room.id),
    }));
  };

  // modifying the remote description received
  const mungeSDP = (targetMid, sessionDescription, roomKey) => {
    const mungedSessionDescription = sessionDescription;
    // TODO: Below SDP methods needs to be implemented in the SessionDescription Class.
    mungedSessionDescription.sdp = SessionDescription.setSDPBitrate(targetMid, mungedSessionDescription, roomKey);

    // logger.log.INFO([targetMid, 'RTCSessionDescription', type, `Updated remote ${type} ->`], sessionDescriptionToSet.sdp);
    return mungedSessionDescription;
  };

  const setLocalDescription = (room, targetMid, localDescription) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const { type } = localDescription;
    const peerConnection = peerConnections[targetMid];
    const { STATS_MODULE } = MESSAGES;
    const msgType = type === 'offer' ? 'OFFER' : 'ANSWER';

    peerConnection.processingLocalSDP = true;

    handleNegotationStats.send(room.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS[msgType][type], targetMid, localDescription, false);

    return peerConnection.setLocalDescription(localDescription)
      .then(() => peerConnection);
  };

  const onLocalDescriptionSetSuccess = (RTCPeerConnection, room, targetMid, localDescription) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const { NEGOTIATION_PROGRESS } = MESSAGES;
    const peerConnection = peerConnections[targetMid] = RTCPeerConnection;

    logger.log.DEBUG([targetMid, TAGS.SESSION_DESCRIPTION, localDescription.type, NEGOTIATION_PROGRESS.SET_LOCAL_DESCRIPTION], localDescription);

    peerConnection.processingLocalSDP = false;
    handleSetOfferAndAnswerSuccess(state, targetMid, localDescription, false);
  };

  const onLocalDescriptionSetFailure = (room, targetMid, localDescription, error) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const peerConnection = peerConnections[targetMid];
    const { NEGOTIATION_PROGRESS } = MESSAGES;

    logger.log.ERROR([targetMid, TAGS.SESSION_DESCRIPTION, localDescription.type, NEGOTIATION_PROGRESS.FAILED_SET_LOCAL_DESCRIPTION], error);

    peerConnection.processingLocalSDP = false;
    peerConnection.negotiating = false;

    handleSetOfferAndAnswerFailure(state, targetMid, localDescription, false, error);
  };

  const setRemoteDescription = (room, targetMid, remoteDescription) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const { type } = remoteDescription;
    const { STATS_MODULE } = MESSAGES;
    const peerConnection = peerConnections[targetMid];
    const msgType = type === 'offer' ? 'OFFER' : 'ANSWER';

    peerConnection.processingRemoteSDP = true;
    handleNegotationStats.send(room.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS[msgType][type], targetMid, remoteDescription, true);
    const mungedSessionDescription = mungeSDP(targetMid, remoteDescription, room.id);
    return peerConnection.setRemoteDescription(mungedSessionDescription)
      .then(() => peerConnection);
  };

  const sendAnswerAck = (state, targetMid, success) => {
    const updatedState = state;
    updatedState.peerConnections[targetMid].negotiating = false;
    Skylink.setSkylinkState(updatedState, targetMid);

    const signaling = new SkylinkSignalingServer();
    signaling.answerAck(state, targetMid, success);
  };

  const onRemoteDescriptionSetSuccess = (RTCPeerConnection, room, targetMid, remoteDescription) => {
    const signaling = new SkylinkSignalingServer();
    const { type } = remoteDescription;
    const { NEGOTIATION_PROGRESS, DATA_CHANNEL } = MESSAGES;

    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const peerConnection = peerConnections[targetMid] = RTCPeerConnection;

    logger.log.DEBUG([targetMid, TAGS.SESSION_DESCRIPTION, type, NEGOTIATION_PROGRESS.SET_REMOTE_DESCRIPTION], remoteDescription);

    peerConnection.processingRemoteSDP = false;

    if (type === 'offer') {
      handleSetOfferAndAnswerSuccess(state, targetMid, remoteDescription, true);
      return signaling.answer(state, targetMid);
    }
    // FIXME: why is this needed?
    if (state.peerMessagesStamps[targetMid]) {
      state.peerMessagesStamps[targetMid].hasRestart = false;
    }

    // if remote peer does not have data channel
    if (state.dataChannels[targetMid] && (peerConnection.remoteDescription.sdp.indexOf('m=application') === -1 || peerConnection.remoteDescription.sdp.indexOf('m=application 0') > 0)) {
      logger.log.WARN([targetMid, TAGS.PEER_CONNECTION, null, `${DATA_CHANNEL.CLOSING} - ${DATA_CHANNEL.NO_REMOTE_DATA_CHANNEL}`]);
      PeerConnection.closeDataChannel(state, targetMid);
    }

    handleSetOfferAndAnswerSuccess(state, targetMid, remoteDescription, true);
    sendAnswerAck(state, targetMid, true);
    return true;
  };

  const onRemoteDescriptionSetFailure = (room, targetMid, remoteDescription, error) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const peerConnection = peerConnections[targetMid];
    const { type } = remoteDescription;

    logger.log.ERROR([targetMid, TAGS.SESSION_DESCRIPTION, type, `${MESSAGES.NEGOTIATION_PROGRESS.ERRORS.FAILED_SET_REMOTE_DESCRIPTION} ->`], {
      error,
      state: peerConnection.signalingState,
      [type]: remoteDescription,
    });

    peerConnection.processingRemoteSDP = false;
    peerConnection.negotiating = false;

    handleSetOfferAndAnswerFailure(state, targetMid, remoteDescription, true, error);

    if (type === 'answer') {
      sendAnswerAck(state, targetMid, false);
    }
  };

  const updateState = (state, message) => {
    const updatedState = state;
    const { userInfo, rid, mid } = message;
    const updatedUserInfo = userInfo;
    const targetMid = mid;

    if (userInfo && typeof userInfo === 'object') {
      updatedUserInfo.settings.data = !!(updatedState.dataChannels[targetMid] && updatedState.dataChannels[targetMid].main && updatedState.dataChannels[targetMid].main.channel && updatedState.dataChannels[targetMid].main.channel.readyState === DATA_CHANNEL_STATE$1.OPEN);
      updatedState.peerInformations[targetMid].settings = updatedUserInfo.settings || {};
      updatedState.peerInformations[targetMid].mediaStatus = updatedUserInfo.mediaStatus || {};
      updatedState.peerInformations[targetMid].userData = updatedUserInfo.userData;
    }

    updatedState.peerConnections[targetMid].negotiating = true;

    Skylink.setSkylinkState(updatedState, rid);
  };

  const canProceed = (state, message) => {
    const {
      weight, type, mid, sdp, resend,
    } = message;
    const {
      peerPriorityWeight, bufferedLocalOffer, room, peerConnections,
    } = state;
    const { STATS_MODULE, NEGOTIATION_PROGRESS, PEER_CONNECTION } = MESSAGES;
    const targetMid = mid;
    const peerConnection = peerConnections[targetMid];
    const msgType = type === 'offer' ? 'OFFER' : 'ANSWER';
    let error = null;

    if (!peerConnection) {
      logger.log.ERROR([targetMid, null, type, `${PEER_CONNECTION.NO_PEER_CONNECTION}. Unable to set${type === 'offer' ? 'Remote' : 'Local'}Offer.`]);
      error = PEER_CONNECTION.NO_PEER_CONNECTION;
      handleNegotationStats.send(room.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS[msgType].dropped, targetMid, message, true, error);
      return false;
    }

    const {
      processingRemoteSDP, processingLocalSDP, negotiating,
    } = peerConnection;

    if (type === 'offer' && peerConnections[targetMid].signalingState !== PEER_CONNECTION_STATE$1.STABLE) {
      logger.log.WARN([targetMid, null, type, NEGOTIATION_PROGRESS.ERRORS.NOT_STABLE], {
        signalingState: peerConnections[targetMid].signalingState,
        isRestart: !!resend,
      });
      error = `Peer connection state is ${peerConnections[targetMid].signalingState}.`;
    }

    if (type === 'offer' && bufferedLocalOffer[targetMid] && peerPriorityWeight > weight) {
      logger.log.WARN([targetMid, null, type, NEGOTIATION_PROGRESS.ERRORS.OFFER_TIEBREAKER], {
        selfWeight: peerPriorityWeight,
        messageWeight: weight,
      });
      error = NEGOTIATION_PROGRESS.ERRORS.OFFER_TIEBREAKER;
    }

    // if processing remote SDP
    if (processingRemoteSDP) {
      logger.log.WARN([targetMid, TAGS.SESSION_DESCRIPTION, type, NEGOTIATION_PROGRESS.ERRORS.PROCESSING_EXISTING_SDP], sdp);
      error = NEGOTIATION_PROGRESS.ERRORS.PROCESSING_EXISTING_SDP;

      // or completed processing local and remote sdp but answerAck has not been received
    } else if ((!processingLocalSDP && !processingRemoteSDP && negotiating) && type === 'offer') {
      // add to bufferedRemoteOffer
      const updatedState = state;
      logger.log.DEBUG([targetMid, TAGS.SESSION_DESCRIPTION, type, NEGOTIATION_PROGRESS.ERRORS.ADDING_REMOTE_OFFER_TO_BUFFER], message);
      updatedState.bufferedRemoteOffers[targetMid] = updatedState.bufferedRemoteOffers[targetMid] ? updatedState.bufferedRemoteOffers[targetMid] : [];
      updatedState.bufferedRemoteOffers[targetMid].push(message);
      Skylink.setSkylinkState(updatedState, room.id);
    }

    if (error) {
      handleNegotationStats.send(room.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS[msgType].dropped, targetMid, message, true, error);
    }

    return !error;
  };

  /**
   * Function that parses and sets the remote description for offer and answer.
   * @param {JSON} message
   * @return {null}
   * @memberOf SignalingMessageHandler
   * @fires HANDSHAKE_PROGRESS
   */
  // eslint-disable-next-line import/prefer-default-export
  const parseAndSetRemoteDescription = (message) => {
    const {
      rid,
      mid,
      type,
      sdp,
      mediaInfoList,
    } = message;
    const state = Skylink.getSkylinkState(rid);
    const {
      hasMCU,
      room,
      bufferedLocalOffer,
    } = state;
    const targetMid = mid;
    const msgType = type === 'offer' ? 'OFFER' : 'ANSWER';
    const { NEGOTIATION_PROGRESS } = MESSAGES;

    logger.log.INFO([targetMid, null, type, `Received ${type} from peer. ${msgType}:`], message);

    if (canProceed(state, message)) {
      try {
        updateState(state, message);

        PeerMedia.setPeerMediaInfo(room, targetMid, mediaInfoList);
        PeerMedia.deleteUnavailableMedia(room, targetMid); // mediaState can be unavailable during renegotiation

        if (type === 'offer') {
          let localDescription = null;
          const remoteDescription = {
            type,
            sdp: hasMCU ? sdp.replace(/\r\n/g, '\n').split('\n').join('\r\n') : sdp,
          };

          setRemoteDescription(room, targetMid, remoteDescription)
            .then(peerConnection => onRemoteDescriptionSetSuccess(peerConnection, room, targetMid, remoteDescription))
            .catch(error => onRemoteDescriptionSetFailure(room, targetMid, remoteDescription, error))
            .then((answer) => {
              localDescription = {
                type: answer.type,
                sdp: answer.sdp,
              };
              return setLocalDescription(room, targetMid, localDescription);
            })
            .then(peerConnection => onLocalDescriptionSetSuccess(peerConnection, room, targetMid, localDescription))
            .catch(error => onLocalDescriptionSetFailure(room, targetMid, localDescription, error));
        } else if (bufferedLocalOffer[targetMid]) {
          const localDescription = bufferedLocalOffer[targetMid];
          const remoteDescription = {
            type,
            sdp: hasMCU ? sdp.replace(/\r\n/g, '\n').split('\n').join('\r\n') : sdp,
          };

          setLocalDescription(room, targetMid, localDescription)
            .then(peerConnection => onLocalDescriptionSetSuccess(peerConnection, room, targetMid, localDescription))
            .catch(error => onLocalDescriptionSetFailure(room, targetMid, localDescription, error))
            .then(() => setRemoteDescription(room, targetMid, remoteDescription))
            .then(peerConnection => onRemoteDescriptionSetSuccess(peerConnection, room, targetMid, remoteDescription))
            .catch(error => onRemoteDescriptionSetFailure(room, targetMid, remoteDescription, error));
        } else {
          logger.log.ERROR([targetMid, TAGS.PEER_CONNECTION, null, NEGOTIATION_PROGRESS.ERRORS.NO_LOCAL_BUFFERED_OFFER]);
        }
      } catch (error) {
        logger.log.ERROR([targetMid, TAGS.SESSION_DESCRIPTION, type, `Failed processing ${msgType} ->`], error);
      }
    }

    return null;
  };

  const offerHandler = (message) => {
    parseAndSetRemoteDescription(message);
  };

  const answerHandler = (message) => {
    parseAndSetRemoteDescription(message);
  };

  const renegotiateIfNeeded = (state, peerId) => {
    const { peerConnections, currentRTCRTPSenders } = state;

    return new Promise((resolve) => {
      const peerConnection = peerConnections[peerId];
      const pcSenders = peerConnection.getSenders() ? peerConnection.getSenders() : [];
      const senderGetStatsPromises = [];
      const savedSenders = currentRTCRTPSenders[peerId] || [];
      let isRenegoNeeded = false;

      pcSenders.forEach((pcSender) => {
        senderGetStatsPromises.push(pcSender.getStats());
      });

      const transmittingSenders = {};

      Promise.all(senderGetStatsPromises).then((reslovedResults) => {
        reslovedResults.forEach((reports, senderIndex) => {
          reports.forEach((report) => {
            if (report && report.ssrc && report.bytesSent !== 0) {
              transmittingSenders[report.ssrc] = pcSenders[senderIndex];
            } else if (report && report.type === 'ssrc' && report.id.indexOf('send') > 1) { // required for retrieving sender information for react
              // native ios
              report.values.forEach((value) => {
                if (value.ssrc) {
                  transmittingSenders[value.ssrc] = pcSenders[senderIndex];
                }
              });
            }
          });
        });

        const transmittingSendersKeys = Object.keys(transmittingSenders);

        if (transmittingSendersKeys.length !== savedSenders.length) {
          isRenegoNeeded = true;
        } else {
          let senderMatchedCount = 0;
          for (let tKey = 0; tKey < transmittingSendersKeys.length; tKey += 1) {
            const tSender = transmittingSenders[transmittingSendersKeys[tKey]];
            for (let sIndex = 0; sIndex < savedSenders.length; sIndex += 1) {
              const sSender = savedSenders[sIndex];
              if (tSender === sSender) {
                senderMatchedCount += 1;
                break;
              }
            }
          }
          isRenegoNeeded = senderMatchedCount !== transmittingSendersKeys.length;
        }
        resolve(isRenegoNeeded);
      });
    });
  };

  const hasAppliedBufferedRemoteOffer = (updatedState, targetMid) => {
    if (updatedState.bufferedRemoteOffers[targetMid] && !isEmptyArray(updatedState.bufferedRemoteOffers[targetMid])) {
      const offerMessage = updatedState.bufferedRemoteOffers[targetMid].shift(); // the first buffered message
      logger.log.DEBUG([targetMid, 'RTCSessionDescription', offerMessage.type, MESSAGES.NEGOTIATION_PROGRESS.APPLYING_BUFFERED_REMOTE_OFFER], offerMessage);
      parseAndSetRemoteDescription(offerMessage);
      Skylink.setSkylinkState(updatedState, updatedState.room.id);
      return true;
    }

    return false;
  };

  /**
   * Method that handles the "answerAck" socket message received.
   * See confluence docs for the "answerAck" expected properties to be received
   *   based on the current <code>SM_PROTOCOL_VERSION</code>.
   * @memberOf SignalingMessageHandler
   * @private
   * @since 1.0.0
   */
  const answerAckHandler = (message) => {
    const { mid, rid, success } = message;
    const updatedState = Skylink.getSkylinkState(rid);
    const targetMid = mid;

    dispatchEvent(handshakeProgress({
      state: HANDSHAKE_PROGRESS$1.ANSWER_ACK,
      peerId: targetMid,
      room: updatedState.room,
    }));

    updatedState.peerConnections[targetMid].negotiating = false;
    Skylink.setSkylinkState(updatedState, rid);

    if (!success) {
      logger.log.ERROR([targetMid, TAGS.SESSION_DESCRIPTION, HANDSHAKE_PROGRESS$1.ANSWER, MESSAGES.NEGOTIATION_PROGRESS.ERRORS.FAILED_SET_REMOTE_ANSWER]);
      return;
    }

    if (!hasAppliedBufferedRemoteOffer(updatedState, targetMid)) {
      renegotiateIfNeeded(updatedState, targetMid).then((shouldRenegotiate) => {
        if (shouldRenegotiate) {
          refreshConnection(updatedState, targetMid)
            .catch((error) => {
              logger.log.ERROR([mid, TAGS.SESSION_DESCRIPTION, HANDSHAKE_PROGRESS$1.ANSWER_ACK, MESSAGES.NEGOTIATION_PROGRESS.ERRORS.FAILED_RENEGOTIATION], error);
            });
        }
      });
    }
  };

  const welcomeHandler = (message) => {
    parseAndSendWelcome(message, CALLERS.WELCOME);
  };

  /**
   * Function that handles the "candidate" socket message received.
   * @param {JSON} message
   * @memberOf SignalingMessageHandler
   * @returns {null}
   * @fires CANDIDATE_PROCESSING_STATE
   */
  const candidateHandler = (message) => {
    const { candidate, mid, rid } = message;
    const state = Skylink.getSkylinkState(rid);
    const { room } = state;
    const peerConnection = state.peerConnections[mid];
    const peerEndOfCandidatesCounter = state.peerEndOfCandidatesCounter[mid] || {};
    const { RTCIceCandidate } = window;
    const { ICE_CANDIDATE, PEER_CONNECTION, STATS_MODULE: { HANDLE_ICE_GATHERING_STATS } } = MESSAGES;
    const handleIceCandidateStats = new HandleIceCandidateStats();

    if (!candidate && !message.id) {
      logger.log.WARN([mid, TAGS.CANDIDATE_HANDLER, null, ICE_CANDIDATE.INVALID_CANDIDATE], message);
      return null;
    }

    const nativeCandidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate,
      sdpMid: message.id,
    });
    const candidateId = `can-${nativeCandidate.foundation}`;
    const candidateType = nativeCandidate.candidate.split(' ')[7] || '';

    logger.log.DEBUG([mid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.VALID_CANDIDATE], nativeCandidate);

    peerEndOfCandidatesCounter.len = peerEndOfCandidatesCounter.len || 0;
    peerEndOfCandidatesCounter.hasSet = false;
    peerEndOfCandidatesCounter.len += 1;

    Skylink.setSkylinkState(state, rid);

    const candidateProcessingStateEventDetail = {
      candidate: {
        candidate: nativeCandidate.candidate,
        sdpMid: nativeCandidate.sdpMid,
        sdpMLineIndex: nativeCandidate.sdpMLineIndex,
      },
      error: null,
    };

    dispatchEvent(candidateProcessingState({
      room,
      state: CANDIDATE_PROCESSING_STATE$1.RECEIVED,
      peerId: mid,
      candidateId,
      candidateType,
      candidate: candidateProcessingStateEventDetail.candidate,
      error: candidateProcessingStateEventDetail.error,
    }));

    if (!(peerConnection && peerConnection.signalingState !== PEER_CONNECTION_STATE$1.CLOSED)) {
      logger.log.WARN([mid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, PEER_CONNECTION.NO_PEER_CONNECTION]);

      candidateProcessingStateEventDetail.error = new Error(PEER_CONNECTION.NO_PEER_CONNECTION);
      handleIceCandidateStats.send(room.id, HANDLE_ICE_GATHERING_STATS.PROCESS_FAILED, mid, candidateId, candidateProcessingStateEventDetail.candidate, candidateProcessingStateEventDetail.error);
      dispatchEvent(candidateProcessingState({
        room,
        state: CANDIDATE_PROCESSING_STATE$1.DROPPED,
        peerId: mid,
        candidateId,
        candidateType,
        candidate: candidateProcessingStateEventDetail.candidate,
        error: candidateProcessingStateEventDetail.error,
      }));

      PeerConnection.signalingEndOfCandidates(mid, state);
      return null;
    }

    if (peerConnection.remoteDescription && peerConnection.remoteDescription.sdp && peerConnection.localDescription && peerConnection.localDescription.sdp) {
      IceConnection.addIceCandidate(mid, candidateId, candidateType, nativeCandidate, state);
    } else {
      IceConnection.addIceCandidateToQueue(mid, candidateId, candidateType, nativeCandidate, state);
    }

    PeerConnection.signalingEndOfCandidates(mid, state);

    let gatheredCandidates = state.gatheredCandidates[mid];
    if (!gatheredCandidates) {
      gatheredCandidates = {
        sending: { host: [], srflx: [], relay: [] },
        receiving: { host: [], srflx: [], relay: [] },
      };
    }

    gatheredCandidates.receiving[candidateType].push({
      sdpMid: nativeCandidate.sdpMid,
      sdpMLineIndex: nativeCandidate.sdpMLineIndex,
      candidate: nativeCandidate.candidate,
    });

    state.gatheredCandidates[mid] = gatheredCandidates;
    Skylink.setSkylinkState(state, rid);

    return null;
  };

  /**
   * Function that handles the Signaling Server message from getPeers() method.
   * @param {JSON} message
   * @memberOf SignalingMessageHandler
   * @fires GET_PEERS_STATE_CHANGE
   */
  const getPeerListHandler = (message) => {
    const { result, type } = message;
    const peerList = result;
    logger.log.INFO(['Server', null, type, 'Received list of peers'], peerList);
    dispatchEvent(getPeersStateChange({
      state: GET_PEERS_STATE.DISPATCHED,
      privilegePeerId: null,
      peerList,
    }));
  };

  class HandleSessionStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        state: null,
        contents: null,
      };
    }

    send(roomKey, message) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.client_id = roomState.clientId;
      this.model.state = message.type;
      this.model.contents = message;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();

      this.postStats(this.endpoints.session, this.model);
    }
  }

  /**
   * Function that handles the "introduceError" socket message received.
   * @param {JSON} message
   * @memberOf SignalingMessageHandler
   * @fires INTRODUCE_STATE_CHANGE
   */
  const introduceErrorHandler = (message) => {
    const state = Skylink.getSkylinkState();
    const { room, user } = state;
    logger.log.WARN(['Server', null, message.type, `Introduce failed. Reason: ${message.reason}`]);

    const handleSessionStats = new HandleSessionStats();
    handleSessionStats.send(room.id, message);
    dispatchEvent(introduceStateChange({
      state: INTRODUCE_STATE_CHANGE.ERROR,
      privilegedPeerId: user.sid,
      receivingPeerId: message.receivingPeerId,
      sendingPeerId: message.sendingPeerId,
      reason: message.reason,
    }));
  };

  /**
   * Checks if peer is connected.
   * @param {SkylinkState} roomState
   * @param {String} peerId
   * @private
   */
  const isPeerConnected = (roomState, peerId) => {
    const roomStateObj = roomState;

    if (!roomStateObj) return false;

    if (!roomStateObj.peerConnections[peerId] && !roomStateObj.peerInformations[peerId]) {
      logger.log.DEBUG([peerId, TAGS.PEER_CONNECTION, null, `${MESSAGES.ROOM.LEAVE_ROOM.DROPPING_HANGUP} - ${MESSAGES.PEER_CONNECTION.NO_PEER_CONNECTION}`]);
      return false;
    }

    return true;
  };

  /**
   * Closes a peer connection for a particular peerId.
   * @param {String} roomKey
   * @param {String} peerId
   * @private
   */
  const closePeerConnection$1 = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);
    if (roomState.peerConnections[peerId].signalingState === PEER_CONNECTION_STATE$1.CLOSED) return;

    roomState.peerConnections[peerId].close();
  };

  /**
   * Clears peer information in SkylinkState.
   * @param {String} roomKey
   * @param {String} peerId
   * @private
   */
  const clearPeerInfo = (roomKey, peerId) => {
    const updatedState = Skylink.getSkylinkState(roomKey);

    // Otherwise stats module fails.
    setTimeout(() => {
      const state = Skylink.getSkylinkState(roomKey);
      if (!isEmptyObj(state)) {
        delete state.peerConnections[peerId];
        Skylink.setSkylinkState(state, state.room.id);
      }

      if (!updatedState.hasMCU) {
        // catch media changes when remote peer leaves between the interval
        // not needed for MCU as it will be caught in onremovetrack
        new HandleUserMediaStats().send(roomKey);
      }
      logger.log.INFO([peerId, TAGS.PEER_CONNECTION, null, MESSAGES.ROOM.LEAVE_ROOM.PEER_LEFT.SUCCESS]);
    }, 500);

    if (updatedState.bandwidthAdjuster && !updatedState.hasMCU) {
      // eslint-disable-next-line no-new
      new BandwidthAdjuster({ roomKey: updatedState.room.id, peerId });
    }

    delete updatedState.peerInformations[peerId];
    delete updatedState.peerMedias[peerId];
    delete updatedState.peerMessagesStamps[peerId];
    delete updatedState.peerEndOfCandidatesCounter[peerId];
    delete updatedState.peerCandidatesQueue[peerId];
    delete updatedState.peerStats[peerId];
    delete updatedState.gatheredCandidates[peerId];
    delete updatedState.peerStreams[peerId];
  };

  /**
   * Check if health timer exists.
   * @param {String} roomKey
   * @param {String} peerId
   * @private
   */
  const checksIfHealthTimerExists = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);
    if (!roomState.peerConnections[peerId]) return;

    closePeerConnection$1(roomKey, peerId);
  };

  /**
   * Triggers peerLeft event and changes state for serverPeerLeft.
   * @param {String} roomKey
   * @param {String} peerId
   * @private
   */
  const triggerPeerLeftEventAndChangeState = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);

    if (!isPeerConnected(roomState, peerId)) return;

    const { room } = roomState;
    const peerInfo = PeerData.getPeerInfo(peerId, room);

    if (peerId === PEER_TYPE.MCU) {
      const updatedState = roomState;
      dispatchEvent(serverPeerLeft({
        peerId,
        serverPeerType: SERVER_PEER_TYPE.MCU,
        room,
      }));
      updatedState.hasMCU = false;

      Skylink.setSkylinkState(updatedState, room.id);
      return;
    }

    dispatchEvent(peerLeft({
      peerId,
      peerInfo,
      isSelf: false,
      room,
    }));
  };

  /**
   * Closes datachannel for a particular room.
   * @param {String} roomKey
   * @param {String} peerId
   * @private
   */
  const tryCloseDataChannel = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);
    PeerConnection.closeDataChannel(roomState, peerId);
  };

  /**
   * Function that handles the bye Signaling Server message.
   * @param {JSON} message
   * @memberOf SignalingMessageHandler
   * @private
   */
  const byeHandler = (message) => {
    const { mid, rid, publisherId } = message;
    const roomKey = rid;
    const roomState = Skylink.getSkylinkState(roomKey);
    let peerId = mid;

    if (roomState.hasMCU) {
      peerId = publisherId;
    }

    logger.log.INFO([peerId, TAGS.PEER_CONNECTION, null, MESSAGES.ROOM.LEAVE_ROOM.PEER_LEFT.START]);

    try {
      triggerPeerLeftEventAndChangeState(roomKey, peerId);
      checksIfHealthTimerExists(roomKey, peerId);
      clearPeerInfo(roomKey, peerId);
      tryCloseDataChannel(roomKey, peerId);
    } catch (error) {
      logger.log.DEBUG([peerId, TAGS.ROOM, null, MESSAGES.ROOM.LEAVE_ROOM.PEER_LEFT.ERROR], error);
    }
  };

  /**
   * Function that handles the "stream" socket message received.
   * @param {JSON} message
   * @param {String} message.rid - The room key.
   * @param {SkylinkUser} message.mid - The source peerId.
   * @param {String} message.streamId - The media stream Id.
   * @param {String} message.status - The stream status.
   * @param {Object} message.settings
   * @param {String} message.settings.screenshareId - Id of the screenshare stream.
   * @memberOf SignalingMessageHandler
   */
  const streamHandler = (message) => {
    const {
      mid, rid, status, streamId, settings,
    } = message;
    const roomState = getStateByRid(rid);
    const { room, peerInformations } = roomState;

    if (status === STREAM_STATUS.ENDED) {
      if (settings.isScreensharing) {
        peerInformations[mid].screenshare = false;
        Skylink.setSkylinkState(roomState, room.id);
      }

      dispatchEvent(streamEnded({
        room,
        peerId: mid,
        peerInfo: PeerData.getPeerInfo(mid, room),
        streamId,
        isSelf: false,
        isScreensharing: settings.isScreensharing,
        options: settings,
        isVideo: !!settings.audio,
        isAudio: !!settings.video,
      }));
    }

    return null;
  };

  class HandleRecordingStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        room_id: null,
        user_id: null,
        state: null,
        recording_id: null,
        recordings: null,
        error: null,
      };
    }

    send(roomKey, state, recordingId, recordings, error) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.client_id = roomState.clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.state = state;
      this.model.recording_id = recordingId;
      this.model.recordings = recordings;
      this.error = (typeof error === 'string' ? error : (error && error.message)) || null;

      this.postStats(this.endpoints.recording, this.model);
    }
  }

  const handleRecordingStats = new HandleRecordingStats();

  const dispatchRecordingEvent = (state, recordingId, error) => {
    const detail = {
      state,
      recordingId,
    };

    if (error) {
      detail.error = error;
    }

    dispatchEvent(recordingState(detail));
  };

  /**
   * Recording successfully started
   * @param {SkylinkState} roomState
   * @param {number} recordingId
   * @private
   */
  const recordingStarted = (roomState, recordingId) => {
    const updatedRoomState = Object.assign({}, roomState);
    const { room } = updatedRoomState;

    logger.log.DEBUG([PEER_TYPE.MCU, TAGS.RECORDING, recordingId, MESSAGES.RECORDING.START_SUCCESS]);

    handleRecordingStats.send(room.id, MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.START, recordingId, null, null);

    updatedRoomState.currentRecordingId = recordingId;

    updatedRoomState.recordings[recordingId] = {
      active: true,
      state: RECORDING_STATE$1.START,
      startedDateTime: (new Date()).toISOString(),
      endedDateTime: null,
      error: null,
    };

    updatedRoomState.recordingStartInterval = setTimeout(() => {
      logger.log.INFO([PEER_TYPE.MCU, TAGS.RECORDING, recordingId, MESSAGES.RECORDING.MIN_RECORDING_TIME_REACHED]);
      updatedRoomState.recordingStartInterval = null;
    }, 4000);

    Skylink.setSkylinkState(updatedRoomState, room.id);
    dispatchRecordingEvent(RECORDING_STATE$1.START, recordingId);
  };

  /**
   * Recording successfully stopped
   * @param {SkylinkState} roomState
   * @param {number} recordingId
   * @private
   */
  const recordingStopped = (roomState, recordingId) => {
    const updatedRoomState = Object.assign({}, roomState);
    const { room, recordings } = updatedRoomState;

    handleRecordingStats.send(room.id, MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.STOP, recordingId, null, null);

    if (!recordings[recordingId]) {
      logger.log.ERROR([PEER_TYPE.MCU, TAGS.RECORDING, recordingId, MESSAGES.RECORDING.ERRORS.SESSION_EMPTY]);
      return null;
    }

    updatedRoomState.currentRecordingId = null;

    if (updatedRoomState.recordingStartInterval) {
      clearTimeout(updatedRoomState.recordingStartInterval);
      logger.log.WARN([PEER_TYPE.MCU, TAGS.RECORDING, recordingId, MESSAGES.RECORDING.ERRORS.STOP_ABRUPT]);
      updatedRoomState.recordingStartInterval = null;
    }

    logger.log.DEBUG([PEER_TYPE.MCU, TAGS.RECORDING, recordingId, MESSAGES.RECORDING.STOP_SUCCESS]);

    updatedRoomState.recordings[recordingId].active = false;
    updatedRoomState.recordings[recordingId].state = RECORDING_STATE$1.STOP;
    updatedRoomState.recordings[recordingId].endedDateTime = (new Date()).toISOString();

    Skylink.setSkylinkState(updatedRoomState, room.id);
    dispatchRecordingEvent(RECORDING_STATE$1.STOP, recordingId);

    return null;
  };

  const recordingHandler = (message) => {
    const {
      action, rid, recordingId, error,
    } = message;
    const roomState = getStateByRid(rid);

    if (action === 'on') {
      recordingStarted(roomState, recordingId);
    } else if (action === 'off') {
      recordingStopped(roomState, recordingId);
    } else if (action === 'error') {
      dispatchRecordingEvent(null, recordingId, error);
      logger.log.ERROR([PEER_TYPE.MCU, TAGS.RECORDING, recordingId, MESSAGES.RECORDING.ERRORS.MCU_RECORDING_ERROR], error);
      handleRecordingStats.send(roomState.room.id, MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.MCU_RECORDING_ERROR, recordingId, null, error);
    }
  };

  /**
   * Handles the "redirect" message from the Signaling server.
   * @param {JSON} message
   * @private
   */
  const redirectHandler = (message) => {
    logger.log.INFO(['Server', null, message.type, 'System action warning:'], message);

    if (Object.keys((new SkylinkStates()).getAllStates()).length > 1 && message.action === SYSTEM_ACTION$1.REJECT) {
      disconnect();
    }

    if (message.reason === 'toClose') {
      // eslint-disable-next-line no-param-reassign
      message.reason = 'toclose';
    }

    Skylink.removeSkylinkState(Skylink.getSkylinkState(message.rid));
    // removeRoomStateByState(new SkylinkStates().getState(message.rid));

    dispatchEvent(systemAction({
      action: message.action,
      info: message.info,
      reason: message.reason,
      rid: message.rid,
    }));
  };

  const ACTION = {
    START_SUCCESS: 'startSuccess',
    STOP_SUCCESS: 'stopSuccess',
  };

  const rtmpSessionStartSuccess = (roomState, message) => {
    const { rtmpSessions } = roomState;
    const { rtmpId, peerId, streamId } = message;

    if (!rtmpSessions[rtmpId]) {
      const updatedState = Object.assign({}, roomState);
      logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', MESSAGES.RTMP.started_success]);

      updatedState.rtmpSessions[rtmpId] = {
        active: true,
        state: RTMP_STATE$1.START,
        startedDateTime: (new Date()).toISOString(),
        endedDateTime: null,
        peerId,
        streamId,
      };

      dispatchEvent(rtmpState({
        state: RTMP_STATE$1.START,
        rtmpId,
        error: null,
      }));

      Skylink.setSkylinkState(updatedState, updatedState.room.id);
    }
    return null;
  };

  const rtmpSessionStopSuccess = (roomState, message) => {
    const { rtmpSessions } = roomState;
    const { rtmpId } = message;
    const updatedState = Object.assign({}, roomState);

    if (!rtmpSessions[rtmpId]) {
      logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', MESSAGES.RTMP.stop_session_empty]);
      return false;
    }

    logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', MESSAGES.RTMP.stopped_success]);

    updatedState.rtmpSessions[rtmpId].active = false;
    updatedState.rtmpSessions[rtmpId].state = RTMP_STATE$1.STOP;
    updatedState.rtmpSessions[rtmpId].endedDateTime = (new Date()).toISOString();

    dispatchEvent(rtmpState({
      state: RTMP_STATE$1.STOP,
      rtmpId,
      error: null,
    }));

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
    return null;
  };

  const rtmpSessionFailed = (roomState, message) => {
    const { error, rtmpId } = message;
    const { rtmpSessions } = roomState;
    const rtmpError = new Error(error || 'Unkown Error');
    const updatedState = Object.assign({}, roomState);

    if (!rtmpSessions[rtmpId]) {
      logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', MESSAGES.RTMP.error_session_empty]);
      return null;
    }

    logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', MESSAGES.RTMP.error_session]);

    updatedState.rtmpSessions[rtmpId].state = RTMP_STATE$1.ERROR;
    updatedState.rtmpSessions[rtmpId].error = rtmpError;

    if (rtmpSessions[rtmpId].active) {
      logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', MESSAGES.RTMP.error_Session_abrupt]);
      updatedState.rtmpSessions[rtmpId].active = false;
    }

    dispatchEvent(rtmpState({
      state: RTMP_STATE$1.ERROR,
      rtmpId,
      error: rtmpError,
    }));

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
    return null;
  };

  const rtmpHandler = (message) => {
    const { action, rid } = message;
    const roomState = getStateByRid(rid);

    logger.log.DEBUG([PEER_TYPE.MCU, 'RTMP', null, MESSAGES.RTMP.message_received_from_sig]);

    if (action === ACTION.START_SUCCESS) {
      rtmpSessionStartSuccess(roomState, message);
    } else if (action === ACTION.STOP_SUCCESS) {
      rtmpSessionStopSuccess(roomState, message);
    } else {
      rtmpSessionFailed(roomState, message);
    }
  };

  /**
   * Function that handles the "updateUserEvent" socket message received.
   * See confluence docs for the "updateUserEvent" expected properties to be received
   *   based on the current <code>SM_PROTOCOL_VERSION</code>.
   * @param {JSON} message
   * @param {String} message.type - SIG_MESSAGE_TYPE
   * @param {String} message.mid - The source peerId.
   * @param {String} message.rid - The roomkey.
   * @param {String|Object} message.userData - The updated peer userData.
   * @param {Number} message.stamp - The time stamp for the current updateUserEvent userData.
   * @member SignalingMessageHandler
   * @fires PEER_UPDATED
   * @private
   */
  const setUserDataHandler = (message) => {
    const {
      type, mid, rid, userData, stamp,
    } = message;
    const state = Skylink.getSkylinkState(rid);
    const { peerInformations, peerMessagesStamps } = state;
    const targetMid = mid;
    const { PEER_INFORMATIONS } = MESSAGES;

    let parsedUserData = userData.replace(/&quot;/g, '"');

    try {
      parsedUserData = JSON.parse(parsedUserData);
    } catch (err) {
      logger.log.INFO([targetMid, null, type, `${PEER_INFORMATIONS.USER_DATA_NOT_JSON}`], parsedUserData);
    } finally {
      logger.log.INFO([targetMid, null, type, `${PEER_INFORMATIONS.UPDATE_USER_DATA}`], parsedUserData);
    }

    if (!peerInformations[targetMid]) {
      logger.log.INFO([targetMid, null, type, `${PEER_INFORMATIONS.NO_PEER_INFO} ${targetMid}`]);
      return;
    }

    if (peerMessagesStamps[targetMid] && isANumber(stamp)) {
      if (stamp < peerMessagesStamps[targetMid].userData) {
        logger.log.WARN([targetMid, null, type, `${PEER_INFORMATIONS.OUTDATED_MSG}`], message);
        return;
      }
      peerMessagesStamps[targetMid].userData = stamp;
    }

    peerInformations[targetMid].userData = parsedUserData || {};

    dispatchEvent(peerUpdated({
      peerId: targetMid,
      peerInfo: PeerData.getPeerInfo(targetMid, state.room),
      isSelf: false,
    }));
  };

  const dispatchMediaStateChangeEvents = (state, streamId, peerId, kind, isScreensharing) => {
    const peerInfo = PeerData.getPeerInfo(peerId, state.room);

    dispatchEvent(streamMuted({
      isSelf: false,
      peerId,
      peerInfo,
      streamId,
      isAudio: kind === TRACK_KIND.AUDIO,
      isVideo: kind === TRACK_KIND.VIDEO,
      isScreensharing,
    }));

    dispatchEvent(peerUpdated({
      isSelf: false,
      peerId,
      peerInfo,
    }));
  };

  const mediaInfoEventHelpers = {
    dispatchMediaStateChangeEvents,
  };

  const audioStateChangeHandler = (targetMid, message) => {
    const {
      type, rid, mediaId, mediaState,
    } = message;
    const updatedState = Skylink.getSkylinkState(rid);
    const { room } = updatedState;
    const streamId = PeerMedia.retrieveStreamId(room, targetMid, mediaId);
    const stamp = (new Date()).toISOString();

    logger.log.INFO([targetMid, TAGS.SIG_SERVER, type, MESSAGES.MEDIA_INFO.AUDIO_STATE_CHANGE, mediaState, streamId], message);

    if (!updatedState.peerInformations[targetMid]) {
      logger.log.WARN([targetMid, TAGS.PEER_INFORMATION, type, `${MESSAGES.PEER_INFORMATIONS.NO_PEER_INFO} ${targetMid}`]);
      return;
    }

    if (updatedState.peerMessagesStamps[targetMid]) {
      if (stamp < updatedState.peerMessagesStamps[targetMid].audioMuted) {
        logger.log.WARN([targetMid, TAGS.SIG_SERVER, type, MESSAGES.SIGNALING.OUTDATED_MSG], message);
        return;
      }
      updatedState.peerMessagesStamps[targetMid].audioMuted = stamp;
    }

    if (!updatedState.peerInformations[targetMid].mediaStatus[streamId]) {
      updatedState.peerInformations[targetMid].mediaStatus[streamId] = {};
    }

    updatedState.peerInformations[targetMid].mediaStatus[streamId].audioMuted = (mediaState === MEDIA_STATE.MUTED || mediaState === MEDIA_STATE.STOPPED) ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE;
    Skylink.setSkylinkState(updatedState, room.id);

    mediaInfoEventHelpers.dispatchMediaStateChangeEvents(updatedState, streamId, targetMid, TRACK_KIND.AUDIO, false);
  };

  const videoStateChangeHandler = (targetMid, message) => {
    const {
      type, rid, mediaId, mediaState, mediaType,
    } = message;
    const updatedState = Skylink.getSkylinkState(rid);
    const { room } = updatedState;
    const streamId = PeerMedia.retrieveStreamId(room, targetMid, mediaId);
    const stamp = (new Date()).toISOString();

    logger.log.INFO([targetMid, TAGS.SIG_SERVER, type, MESSAGES.MEDIA_INFO.VIDEO_STATE_CHANGE, mediaState, streamId], message);

    if (!updatedState.peerInformations[targetMid]) {
      logger.log.WARN([targetMid, TAGS.PEER_INFORMATION, type, `${MESSAGES.PEER_INFORMATIONS.NO_PEER_INFO} ${targetMid}`]);
      return;
    }

    if (updatedState.peerMessagesStamps[targetMid]) {
      if (stamp < updatedState.peerMessagesStamps[targetMid].videoMuted) {
        logger.log.WARN([targetMid, TAGS.SIG_SERVER, type, MESSAGES.SIGNALING.OUTDATED_MSG], message);
        return;
      }
      updatedState.peerMessagesStamps[targetMid].videoMuted = stamp;
    }
    if (!updatedState.peerInformations[targetMid].mediaStatus[streamId]) {
      updatedState.peerInformations[targetMid].mediaStatus[streamId] = {};
    }
    updatedState.peerInformations[targetMid].mediaStatus[streamId].videoMuted = (mediaState === MEDIA_STATE.MUTED || mediaState === MEDIA_STATE.STOPPED) ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE;

    Skylink.setSkylinkState(updatedState, room.id);

    mediaInfoEventHelpers.dispatchMediaStateChangeEvents(updatedState, streamId, targetMid, TRACK_KIND.VIDEO, mediaType === MEDIA_TYPE.VIDEO_SCREEN);
  };

  const addNewPeerMediaInfo = (state, message) => {
    const updatedState = state;
    const { mediaId, publisherId } = message;
    updatedState.peerMedias[publisherId] = updatedState.peerMedias[publisherId] || {};

    if (!updatedState.peerMedias[publisherId][mediaId]) {
      updatedState.peerMedias[publisherId][mediaId] = message;
      Skylink.setSkylinkState(updatedState, updatedState.room.id);
      return true;
    }

    return false;
  };

  const processOtherChanges = (targetMid, message, key) => {
    logger.log.WARN([targetMid, TAGS.SIG_SERVER, `${MESSAGES.MEDIA_INFO.WARN.READ_ONLY_VALUE} ${key}`], message);
  };

  const processTransceiverMidChange = (targetMid, message) => {
    const {
      rid, mediaId, transceiverMid,
    } = message;
    const state = Skylink.getSkylinkState(rid);
    PeerMedia.updatePeerMediaInfo(state.room, targetMid, mediaId, MEDIA_INFO.TRANSCEIVER_MID, transceiverMid);
  };

  const processUnavailableStream = (room, mediaType, targetMid, message) => {
    const { mediaId } = message;

    PeerMedia.setMediaStateToUnavailable(room, targetMid, mediaId);
    PeerMedia.deleteUnavailableMedia(room, targetMid, mediaId);
  };

  const processMediaStateChange = (room, mediaType, targetMid, message) => {
    if (message.mediaState === MEDIA_STATE.UNAVAILABLE) {
      processUnavailableStream(room, mediaType, targetMid, message);
    } else {
      switch (mediaType) {
        case MEDIA_TYPE.VIDEO_SCREEN:
        case MEDIA_TYPE.VIDEO_CAMERA:
        case MEDIA_TYPE.VIDEO_OTHER:
        case MEDIA_TYPE.VIDEO:
          setTimeout(() => {
            videoStateChangeHandler(targetMid, message);
          }, 100); // setTimeout to handle joinRoom with audio/video and muted true. Safari browser may not have processed ontrack before the
          // mediaInfoEvent is received resulting in the streamId being undefined
          break;
        case MEDIA_TYPE.AUDIO_MIC:
        case MEDIA_TYPE.AUDIO:
          setTimeout(() => {
            audioStateChangeHandler(targetMid, message);
          }, 100);
          break;
        default: logger.log.ERROR([targetMid, TAGS.SIG_SERVER, `${MESSAGES.MEDIA_INFO.WARN.INVALID_MEDIA_TYPE} ${mediaType}`], message);
      }
    }
  };

  const valueChanged = (roomKey, peerId, mediaId, key, newValue) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { peerMedias } = state;
    const mediaInfo = peerMedias[peerId][mediaId];

    return mediaInfo[key] && mediaInfo[key] !== newValue;
  };

  const mediaInfoEventHandler = (message) => {
    const {
      mid, rid, mediaType, mediaId, publisherId,
    } = message;
    const state = Skylink.getSkylinkState(rid);
    const { hasMCU, room } = state;
    const targetMid = hasMCU ? publisherId : mid;

    try {
      if (!addNewPeerMediaInfo(state, message)) {
        const mediaInfoKeys = Object.values(MEDIA_INFO);

        for (let k = 0; k < mediaInfoKeys.length; k += 1) {
          if (valueChanged(rid, targetMid, mediaId, mediaInfoKeys[k], message[mediaInfoKeys[k]])) {
            PeerMedia.updatePeerMediaInfo(state.room, targetMid, mediaId, mediaInfoKeys[k], message[mediaInfoKeys[k]]);

            if (mediaInfoKeys[k] === MEDIA_INFO.MEDIA_STATE) {
              processMediaStateChange(room, mediaType, targetMid, message);
              return;
            }

            if (mediaInfoKeys[k] === MEDIA_INFO.TRANSCEIVER_MID) {
              processTransceiverMidChange(targetMid, message);
              return;
            }

            processOtherChanges(targetMid, message, mediaInfoKeys[k]);
          }
        }
      }
    } catch (err) {
      logger.log.ERROR([targetMid, TAGS.SIG_SERVER, MESSAGES.MEDIA_INFO.FAILED_PROCESSING_MEDIA_INFO_EVENT], err);
    }
  };

  /**
   * Function that handles the "storedMessages" socket message received.
   * @param {JSON} message
   * @memberOf SignalingMessageHandler
   */
  const storedMessagesHandler = (message) => {
    AsyncMessaging.processStoredMessages(message);
  };

  const roomLockHandler = (message) => {
    const { rid, lock, mid } = message;
    const state = Skylink.getSkylinkState(rid);
    state.room.isLocked = lock;
    Skylink.setSkylinkState(state, state.room.id);

    dispatchEvent(roomLock({
      isLocked: lock,
      peerInfo: PeerData.getPeerInfo(mid, state.room),
      peerId: mid,
      isSelf: false,
      room: Room.getRoomInfo(rid),
    }));
  };

  const handlers = {
    userMessageHandler,
    answer: answerHandler,
    answerAck: answerAckHandler,
    inRoom: inRoomHandler,
    enter: enterHandler,
    offer: offerHandler,
    welcome: welcomeHandler,
    candidate: candidateHandler,
    getPeerList: getPeerListHandler,
    introduceError: introduceErrorHandler,
    stream: streamHandler,
    bye: byeHandler,
    recording: recordingHandler,
    redirect: redirectHandler,
    rtmp: rtmpHandler,
    setUserData: setUserDataHandler,
    mediaInfoEvent: mediaInfoEventHandler,
    storedMessages: storedMessagesHandler,
    roomLock: roomLockHandler,
  };

  /* eslint-disable class-methods-use-this */

  /**
   * @class
   * @classdesc Class representing a SignalingMessageHandler instance.
   * @namespace SignalingMessageHandler
   * @private
   */
  class SignalingMessageHandler {
    userMessageHandler(...args) {
      handlers.userMessageHandler(...args);
    }

    answerHandler(...args) {
      handlers.answer(...args);
    }

    answerAckHandler(...args) {
      handlers.answerAck(...args);
    }

    inRoomHandler(...args) {
      handlers.inRoom(...args);
    }

    enterRoomHandler(...args) {
      handlers.enter(...args);
    }

    offerHandler(...args) {
      handlers.offer(...args);
    }

    welcomeHandler(...args) {
      handlers.welcome(...args);
    }

    candidateHandler(...args) {
      handlers.candidate(...args);
    }

    getPeerListHandler(...args) {
      handlers.getPeerList(...args);
    }

    introduceErrorHandler(...args) {
      handlers.introduceError(...args);
    }

    byeHandler(...args) {
      handlers.bye(...args);
    }

    streamHandler(...args) {
      handlers.stream(...args);
    }

    recordingHandler(...args) {
      handlers.recording(...args);
    }

    redirectHandler(...args) {
      handlers.redirect(...args);
    }

    rtmpHandler(...args) {
      handlers.rtmp(...args);
    }

    setUserDataHandler(...args) {
      handlers.setUserData(...args);
    }

    mediaInfoEventHandler(...args) {
      handlers.mediaInfoEvent(...args);
    }

    storedMessagesHandler(...args) {
      handlers.storedMessages(...args);
    }

    roomLockHandler(...args) {
      handlers.roomLock(...args);
    }
  }

  const getJoinRoomMessage = (roomState) => {
    const { room, user } = roomState;
    const state = Skylink.getSkylinkState(room.id);
    const initOptions = Skylink.getInitOptions();
    const apiResponse = new SkylinkApiResponse(null, room.id);
    return {
      type: SIG_MESSAGE_TYPE.JOIN_ROOM,
      uid: state.user.uid,
      cid: apiResponse.key,
      rid: room.id,
      userCred: user.token,
      timeStamp: user.timeStamp,
      apiOwner: apiResponse.appKeyOwner,
      roomCred: room.token,
      start: room.startDateTime,
      len: room.duration,
      isPrivileged: apiResponse.isPrivileged,
      autoIntroduce: apiResponse.autoIntroduce,
      key: initOptions.appKey,
    };
  };

  const getEnterRoomMessage = (roomState) => {
    // FIXME: Welcome and Enter are exactly same but for targetMid which is extra in welcomeMsg. @Ishan to merge code for Welcome and Enter
    const { room } = roomState;
    const state = Skylink.getSkylinkState(room.id);
    const initOptions = Skylink.getInitOptions();
    const {
      user, peerPriorityWeight, enableIceRestart, hasMCU,
    } = state;
    const { enableDataChannel } = initOptions;
    const { AdapterJS, navigator } = window;
    const userInfo = PeerData.getUserInfo(room);
    const enterMsg = {
      type: SIG_MESSAGE_TYPE.ENTER,
      mid: user.sid,
      rid: room.id,
      agent: AdapterJS.webrtcDetectedBrowser,
      version: (AdapterJS.webrtcDetectedVersion || 0).toString(),
      os: navigator.platform,
      userInfo,
      weight: peerPriorityWeight,
      temasysPluginVersion: null,
      enableDataChannel,
      enableIceRestart,
      SMProtocolVersion: SM_PROTOCOL_VERSION,
      DTProtocolVersion: DT_PROTOCOL_VERSION,
    };

    if (hasMCU) {
      enterMsg.target = PEER_TYPE.MCU;
      enterMsg.publisherId = user.sid;
    }

    return enterMsg;
  };

  const getWelcomeMessage = (currentRoom, targetMid) => {
    // FIXME: Welcome and Enter are exactly same but for targetMid which is extra in welcomeMsg. @Ishan to merge code for Welcome and Enter
    const state = Skylink.getSkylinkState(currentRoom.id);
    const initOptions = Skylink.getInitOptions();
    const {
      user, peerPriorityWeight, enableIceRestart, room,
    } = state;
    const { enableDataChannel } = initOptions;
    const { AdapterJS } = window;
    const userInfo = PeerData.getUserInfo(room);

    return {
      type: SIG_MESSAGE_TYPE.WELCOME,
      mid: user.sid,
      rid: room.id,
      agent: AdapterJS.webrtcDetectedBrowser,
      version: (AdapterJS.webrtcDetectedVersion || 0).toString(),
      os: window.navigator.platform,
      userInfo,
      weight: peerPriorityWeight,
      temasysPluginVersion: null,
      enableDataChannel,
      enableIceRestart,
      SMProtocolVersion: SM_PROTOCOL_VERSION,
      DTProtocolVersion: DT_PROTOCOL_VERSION,
      target: targetMid,
    };
  };

  const getOfferMessage = (...args) => PeerConnection.createOffer(...args);

  const getAnswerMessage = (...args) => PeerConnection.createAnswer(...args);

  const answerAckMessage = (state, targetMid, isSuccess) => {
    const { room, user } = state;

    return {
      type: SIG_MESSAGE_TYPE.ANSWER_ACK,
      rid: room.id,
      mid: user.sid,
      target: targetMid,
      success: isSuccess,
    };
  };

  const candidateMessage = (targetMid, roomState, candidate) => {
    const rid = roomState.room.id;
    const state = Skylink.getSkylinkState(rid);
    return {
      type: SIG_MESSAGE_TYPE.CANDIDATE,
      label: candidate.sdpMLineIndex,
      id: candidate.sdpMid,
      candidate: candidate.candidate,
      mid: state.user.sid,
      target: targetMid,
      rid,
    };
  };

  /**
   * @typedef userDataMessage
   * @property {SkylinkConstants.SIG_MESSAGE_TYPE.UPDATE_USER} type
   * @property {SkylinkUser.sid} mid
   * @property {SkylinkRoom.id} rid
   * @property {SkylinkUser.userData} userData
   * @property {Number} state
   */
  /**
   * @param {SkylinkState} roomState
   * @returns {userDataMessage}
   * @memberOf SignalingMessageBuilder
   * @private
   */
  const setUserDataMessage = roomState => ({
    type: SIG_MESSAGE_TYPE.UPDATE_USER,
    mid: roomState.user.sid,
    rid: roomState.room.id,
    userData: isAString(roomState.user.userData) ? roomState.user.userData : JSON.stringify(roomState.user.userData),
    stamp: (new Date()).getTime(),
  });

  /**
   * @typedef peerListMessage
   * @property {SkylinkConstants.SIG_MESSAGE_TYPE.GET_PEERS} type
   * @property {boolean} showAll
   */

  /**
   * @param {boolean} showAll
   * @return {peerListMessage}
   * @memberOf SignalingMessageBuilder
   * @private
   */
  const getPeerListMessage = showAll => ({
    type: SIG_MESSAGE_TYPE.GET_PEERS,
    showAll,
  });

  const restartOfferMessage = (roomKey, peerId, doIceRestart) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { AdapterJS } = window;
    const initOptions = Skylink.getInitOptions();
    const {
      user, room, enableIceRestart, peerInformations, peerPriorityWeight,
    } = state;

    return {
      type: SIG_MESSAGE_TYPE.RESTART,
      mid: user.sid,
      rid: room.id,
      agent: AdapterJS.webrtcDetectedBrowser,
      version: (AdapterJS.webrtcDetectedVersion || 0).toString(),
      os: window.navigator.platform,
      userInfo: PeerData.getUserInfo(room),
      target: peerId,
      weight: peerPriorityWeight,
      enableDataChannel: initOptions.enableDataChannel,
      enableIceRestart,
      doIceRestart: doIceRestart === true && enableIceRestart && peerInformations[peerId]
        && peerInformations[peerId].config.enableIceRestart,
      isRestartResend: false,
      temasysPluginVersion: null,
      SMProtocolVersion: SM_PROTOCOL_VERSION,
      DTProtocolVersion: DT_PROTOCOL_VERSION,
    };
  };

  /**
   * Function that builds the 'stream' socket message.
   * @param {String} roomKey - The room rid.
   * @param {SkylinkUser} user - The peer sending the streamMessage.
   * @param {MediaStream} stream - The media stream.
   * @param {String} status - The stream status.
   * @param {Object} options
   * @param {String} options.isScreensharing - The flag if the ended stream is a screensharing stream.
   * @returns {JSON}
   * @memberOf SignalingMessageBuilder
   */
  const streamMessage = (roomKey, user, stream, status, options) => ({
    type: SIG_MESSAGE_TYPE.STREAM,
    mid: user.sid,
    rid: roomKey,
    status,
    streamId: stream.id,
    settings: options,
  });

  const recordingMessage = (rid, type) => ({
    type,
    rid,
    target: PEER_TYPE.MCU,
  });

  const rtmpMessage = (type, rid, mid, rtmpId, streamId = null, endpoint = null) => {
    const message = {
      type,
      rid,
      rtmpId,
      streamId,
      endpoint,
      mid,
      target: PEER_TYPE.MCU,
    };

    if (type === SIG_MESSAGE_TYPE.STOP_RTMP) {
      delete message.endpoint;
      delete message.streamId;
    }

    return message;
  };

  const byeMessage = (state, peerId) => {
    const { room, user, hasMCU } = state;
    const byeMsg = {
      type: SIG_MESSAGE_TYPE.BYE,
      rid: room.id,
      mid: user.sid,
      target: peerId,
    };

    if (hasMCU) {
      byeMsg.publisherId = user.sid;
    }

    return byeMsg;
  };

  const roomLockMessage = (roomState) => {
    const { user, room } = roomState;

    return {
      type: SIG_MESSAGE_TYPE.ROOM_LOCK,
      mid: user.sid,
      rid: room.id,
      lock: room.isLocked,
    };
  };

  const mediaInfoEventMessage = (roomState, peerId, mediaInfo) => ({
    type: SIG_MESSAGE_TYPE.MEDIA_INFO_EVENT,
    rid: roomState.room.id,
    mid: mediaInfo.publisherId,
    target: peerId,
    publisherId: mediaInfo.publisherId,
    mediaId: mediaInfo.mediaId,
    mediaType: mediaInfo.mediaType,
    mediaState: mediaInfo.mediaState,
  });

  const getStoredMessagesMessage = (roomState) => {
    const { user, room } = roomState;
    return {
      mid: user.sid,
      rid: room.id,
      target: user.sid,
      type: SIG_MESSAGE_TYPE.GET_STORED_MESSAGES,
    };
  };

  const getUserMessages = (roomState, config, message) => {
    const signalingReadyMessages = [];
    const { user, room } = roomState;
    const {
      listOfPeers, isPrivate, isPersistent, secretId,
    } = config;

    const messageBody = {
      data: message,
      mid: user.sid,
      rid: room.id,
      msgId: generateUUID(),
      type: SIG_MESSAGE_TYPE.MESSAGE,
    };

    if (secretId) {
      messageBody.secretId = secretId;
    }

    if (isPrivate) {
      for (let i = 0; i < listOfPeers.length; i += 1) {
        const peerId = listOfPeers[i];
        const mBody = Object.assign({}, messageBody);
        mBody.target = peerId;
        signalingReadyMessages.push(mBody);
        logger.log.DEBUG([peerId, TAGS.MESSAGING, null, MESSAGES.MESSAGING.PRIVATE_MESSAGE], { message });
      }
    } else {
      if (isPersistent) {
        messageBody.isPersistent = isPersistent;
      }

      signalingReadyMessages.push(messageBody);
      logger.log.DEBUG([null, TAGS.MESSAGING, null, MESSAGES.MESSAGING.BROADCAST_MESSAGE], { message });
    }

    return signalingReadyMessages;
  };

  const messageBuilders = {
    joinRoom: getJoinRoomMessage,
    enterRoom: getEnterRoomMessage,
    welcome: getWelcomeMessage,
    offer: getOfferMessage,
    answer: getAnswerMessage,
    answerAck: answerAckMessage,
    candidate: candidateMessage,
    setUserData: setUserDataMessage,
    getPeerList: getPeerListMessage,
    restartOffer: restartOfferMessage,
    stream: streamMessage,
    recording: recordingMessage,
    rtmp: rtmpMessage,
    bye: byeMessage,
    roomLock: roomLockMessage,
    mediaInfoEvent: mediaInfoEventMessage,
    getStoredMessages: getStoredMessagesMessage,
    userMessages: getUserMessages,
  };

  /**
   * @class
   * @classdesc Class representing a SignalingMessageBuilder instance.
   * @namespace SignalingMessageBuilder
   * @private
   */
  class SignalingMessageBuilder {
    constructor() {
      this.messageBuilders = messageBuilders;
    }

    getJoinRoomMessage(...args) {
      return this.messageBuilders.joinRoom(...args);
    }

    getWelcomeMessage(...args) {
      return this.messageBuilders.welcome(...args);
    }

    getEnterRoomMessage(...args) {
      return this.messageBuilders.enterRoom(...args);
    }

    getAnswerMessage(...args) {
      return this.messageBuilders.answer(...args);
    }

    getAnswerAckMessage(...args) {
      return this.messageBuilders.answerAck(...args);
    }

    getOfferMessage(...args) {
      return this.messageBuilders.offer(...args);
    }

    getCandidateMessage(...args) {
      return this.messageBuilders.candidate(...args);
    }

    getSetUserDataMessage(roomState) {
      return this.messageBuilders.setUserData(roomState);
    }

    getPeerListMessage(...args) {
      return this.messageBuilders.getPeerList(...args);
    }

    getRestartOfferMessage(...args) {
      return this.messageBuilders.restartOffer(...args);
    }

    getStreamMessage(...args) {
      return this.messageBuilders.stream(...args);
    }

    getRecordingMessage(...args) {
      return this.messageBuilders.recording(...args);
    }

    getPeerMessagesForSignaling(...args) {
      return this.messageBuilders.signalingMessages(...args);
    }

    getRTMPMessage(...args) {
      return this.messageBuilders.rtmp(...args);
    }

    getByeMessage(...args) {
      return this.messageBuilders.bye(...args);
    }

    getRoomLockMessage(...args) {
      return this.messageBuilders.roomLock(...args);
    }

    getMediaInfoEventMessage(...args) {
      return this.messageBuilders.mediaInfoEvent(...args);
    }

    getGetStoredMessagesMessage(...args) {
      return this.messageBuilders.getStoredMessages(...args);
    }

    getUserMessages(...args) {
      return this.messageBuilders.userMessages(...args);
    }
  }

  const SOCKET_TYPE$1 = {
    POLLING: 'Polling',
    WEBSOCKET: 'WebSocket',
    XHR_POLLING: 'xhr-polling',
    JSONP_POLLING: 'jsonp-polling',
  };

  let instance$4 = null;

  /**
   * @class
   * @classdesc Singleton class that represents a signaling server
   * @private
   */
  class SkylinkSignalingServer {
    constructor() {
      if (!instance$4) {
        instance$4 = this;
      }
      /**
       * Stores the WebSocket object
       * @type {WebSocket}
       */
      this.socket = null;
      /**
       * Stores the number of socket reconnect attempts
       * @type {number}
       */
      this.attempts = 0;
      /**
       * Current timestamp
       * @type {number}
       */
      this.timestamp = new Date().valueOf();
      /**
       * Handler for incoming messages on the socket
       * @type {SignalingMessageHandler}
       */
      this.messageHandler = new SignalingMessageHandler();
      /**
       * Handler for outbound messages via the socket
       * @type {SignalingMessageBuilder}
       */
      this.messageBuilder = new SignalingMessageBuilder();
      /**
       * Config needed for create a socket and establishing a socket connection with the Signaling Server
       * @type {{protocol: Window.location.protocol, socketType: string, signalingServerProtocol: Window.location.protocol, socketSession: {finalAttempts: number, attempts: number}, fallbackType: null, signalingServerPort: null}}
       */
      this.config = null;
      return instance$4;
    }

    // eslint-disable-next-line class-methods-use-this
    resetSocketConfig(protocol) {
      return {
        protocol,
        socketType: !window.WebSocket ? SOCKET_TYPE$1.POLLING : SOCKET_TYPE$1.WEBSOCKET,
        signalingServerProtocol: protocol,
        socketSession: {
          finalAttempts: 0,
          attempts: 0,
        },
        fallbackType: null,
        signalingServerPort: null,
        socketTimeout: false,
      };
    }

    /**
     * Method that creates a socket - Returns the same instance of socket if already created.
     * @param {SkylinkRoom.id} roomKey
     * @fires SOCKET_ERROR
     * @return {Promise}
     */
    createSocket(roomKey) {
      const roomState = Skylink.getSkylinkState(roomKey);
      roomState.socketSession = this.resetSocketConfig(roomState.signalingServerProtocol);
      Skylink.setSkylinkState(roomState, roomKey);

      return new Promise((resolve, reject) => {
        try {
          if (this.socket !== null && this.socket instanceof window.io.Socket && this.socket.connected) {
            resolve();
          } else {
            this.tryCreateSocket(roomKey, resolve, reject);
          }
        } catch (ex) {
          this.handleCreateSocketFailure(roomKey, resolve, reject, ex);
        }
      });
    }

    tryCreateSocket(roomKey, resolve, reject) {
      try {
        const roomState = Skylink.getSkylinkState(roomKey);
        const { socketSession } = roomState;

        this.socket = createSocket$1({
          config: socketSession,
          roomKey,
        });

        setSocketCallbacks$1(roomKey, this, resolve);
      } catch (error) {
        reject(error);
      }
    }

    // eslint-disable-next-line class-methods-use-this
    handleCreateSocketFailure(roomKey, resolve, reject, error) {
      const roomState = Skylink.getSkylinkState(roomKey);
      const { socketSession } = roomState;
      logger.log.ERROR(MESSAGES.INIT.SOCKET_CREATE_FAILED, error);

      dispatchEvent(socketError({
        session: clone_1(socketSession),
        errorCode: SOCKET_ERROR$1.CONNECTION_FAILED,
        type: socketSession.fallbackType,
        error,
      }));

      reject(error);
    }

    // eslint-disable-next-line class-methods-use-this
    dispatchHandshakeProgress(roomState, state) {
      dispatchEvent(handshakeProgress({
        peerId: roomState.user.sid,
        state: HANDSHAKE_PROGRESS$1[state],
        error: null,
        room: Room.getRoomInfo(roomState.room.id),
      }));
    }

    /**
     *
     * @param args
     */
    answer(...args) {
      return this.messageBuilder.getAnswerMessage(...args).then((answer) => {
        const state = args[0];
        this.sendMessage(answer);
        this.dispatchHandshakeProgress(state, 'ANSWER');
        return answer;
      });
    }

    answerAck(...args) {
      const answerAck = this.messageBuilder.getAnswerAckMessage(...args);
      const roomState = args[0];
      this.sendMessage(answerAck);
      this.dispatchHandshakeProgress(roomState, 'ANSWER_ACK');
    }

    /**
     *
     * @param args
     */
    enterRoom(...args) {
      const enter = this.messageBuilder.getEnterRoomMessage(...args);
      this.sendMessage(enter);
      this.dispatchHandshakeProgress(...args, 'ENTER');
    }

    joinRoom(...args) {
      const join = this.messageBuilder.getJoinRoomMessage(...args);
      this.sendMessage(join);
    }

    offer(...args) {
      const room = args[0];
      const peerId = args[1];
      const state = Skylink.getSkylinkState(room.id);
      if (state.peerConnections[peerId].negotiating) {
        logger.log.DEBUG([peerId, TAGS.SIG_SERVER, null, `${MESSAGES.SIGNALING.ABORTING_OFFER}`]);
        return;
      }

      this.messageBuilder.getOfferMessage(...args).then((offer) => {
        this.sendMessage(offer);
        this.dispatchHandshakeProgress(state, 'OFFER');
      });
    }

    welcome(...args) {
      const welcome = this.messageBuilder.getWelcomeMessage(...args);
      this.sendMessage(welcome);
    }

    // eslint-disable-next-line class-methods-use-this
    noop() {
      return null;
    }

    sendCandidate(...args) {
      const candidate = this.messageBuilder.getCandidateMessage(...args);
      if (candidate) {
        this.sendMessage(candidate);
      }
    }

    /**
     * @param {SkylinkState} roomState
     */
    setUserData(roomState) {
      const userData = this.messageBuilder.getSetUserDataMessage(roomState);
      if (userData) {
        this.sendMessage(userData);
      }
    }

    /**
     * @param {boolean} showAll
     */
    getPeerList(showAll) {
      const peers = this.messageBuilder.getPeerListMessage(showAll);
      if (peers) {
        this.sendMessage(peers);
      }
    }

    stream(...args) {
      const stream = this.messageBuilder.getStreamMessage(...args);
      if (stream) {
        this.sendMessage(stream);
      }
    }

    recording(...args) {
      const recordingMessage = this.messageBuilder.getRecordingMessage(...args);
      this.sendMessage(recordingMessage);
    }

    rtmp(...args) {
      const rtmpMessage = this.messageBuilder.getRTMPMessage(...args);
      this.sendMessage(rtmpMessage);
    }

    roomLock(roomState) {
      const roomLock = this.messageBuilder.getRoomLockMessage(roomState);
      if (roomLock) {
        this.sendMessage(roomLock);
      }
    }

    bye(...args) {
      const byeMessage = this.messageBuilder.getByeMessage(...args);
      this.sendMessage(byeMessage);
    }

    mediaInfoEvent(roomState, peerId, mediaInfo) {
      const mInfo = this.messageBuilder.getMediaInfoEventMessage(roomState, peerId, mediaInfo);
      if (mInfo) {
        this.sendMessage(mInfo);
      }
    }

    getStoredMessages(roomState) {
      const history = this.messageBuilder.getGetStoredMessagesMessage(roomState);
      if (history) {
        this.sendMessage(history);
      }
    }

    onMessage(message) {
      const roomState = Skylink.getSkylinkState(JSON.parse(message).rid);
      if (!roomState) {
        return; // FIXME: to handle multi room when the last peer has left one room and that roomState has been removed but the socket channel is still open as the peer is still in the other room
      }
      const { socketSession } = roomState;
      dispatchEvent(channelMessage({
        message,
        socketSession: clone_1(socketSession),
      }));
      processSignalingMessage$1(this.messageHandler, JSON.parse(message));
    }

    sendMessage(message) {
      if (!shouldBufferMessage$1(message)) {
        logger.log.INFO(['SIG SERVER', null, message.type, 'sent']);
        sendChannelMessage(this.socket, message);
      }
    }

    sendUserMessage(roomState, config, message) {
      const peerMessages = this.messageBuilder.getUserMessages(roomState, config, message);
      if (Array.isArray(peerMessages) && peerMessages.length) {
        peerMessages.map((peerMessage) => {
          this.sendMessage(peerMessage);
          return null;
        });
      }
    }

    updateAttempts(roomKey, key, attempts) {
      this.attempts = attempts;

      const state = Skylink.getSkylinkState(roomKey);
      const { socketSession } = state;
      socketSession.socketSession[key] = attempts;

      Skylink.setSkylinkState(state, roomKey);
    }

    getAttempts() {
      return this.attempts;
    }
  }

  /**
   * Emits the peerLeft event when current peer left the room.
   * @param {SkylinkState} state
   * @param {String} peerId
   * @private
   */
  const executePeerLeftProcess = (state, peerId) => new Promise((resolve) => {
    const { room, peerConnections } = state;
    const { ROOM: { LEAVE_ROOM } } = MESSAGES;
    const { enableDataChannel } = Skylink.getInitOptions();

    logger.log.INFO([peerId, room.roomName, null, LEAVE_ROOM.PEER_LEFT.START]);

    if (peerId === PEER_TYPE.MCU) {
      dispatchEvent(serverPeerLeft({
        peerId,
        serverPeerType: SERVER_PEER_TYPE.MCU,
        room: Room.getRoomInfo(room.id),
      }));
    }

    if (peerConnections[peerId] && peerConnections[peerId].signalingState !== PEER_CONNECTION_STATE$1.CLOSED) {
      PeerConnection.closePeerConnection(state, peerId);
    }

    if (enableDataChannel) {
      const handleDataChannelClose = (evt) => {
        const { detail } = evt;
        if (detail.state === DATA_CHANNEL_STATE$1.CLOSED || detail.state === DATA_CHANNEL_STATE$1.CLOSING) {
          logger.log.INFO([detail.peerId, room.roomName, null, LEAVE_ROOM.PEER_LEFT.SUCCESS]);
          removeEventListener(EVENTS.DATA_CHANNEL_STATE, handleDataChannelClose);
          resolve(detail.peerId);
        }
      };

      addEventListener(EVENTS.DATA_CHANNEL_STATE, handleDataChannelClose);

      PeerConnection.closeDataChannel(state, peerId);
    } else {
      resolve(peerId);
    }
  });

  /**
   * Method that sends a bye message to the all the peers in order remove the peer information or disconnects the socket connection.
   * @param state
   * @returns {Promise<SkylinkState>}
   * @private
   */
  const sendByeOrDisconnectSocket = state => new Promise((resolve) => {
    const updatedState = Skylink.getSkylinkState(state.room.id);
    const { room, peerConnections } = updatedState;
    const { ROOM: { LEAVE_ROOM } } = MESSAGES;
    const skylinkSignalingServer = new SkylinkSignalingServer();
    const isInMoreThanOneRoom = Object.keys(Skylink.getSkylinkState()).length > 1;

    room.inRoom = false;
    Skylink.setSkylinkState(updatedState, room.id);

    if (isInMoreThanOneRoom) {
      // broadcast bye to all peers in the room if there is more than one room
      logger.log.INFO([room.roomName, null, null, LEAVE_ROOM.SENDING_BYE]);
      Object.keys(peerConnections).forEach((peerId) => {
        skylinkSignalingServer.bye(updatedState, peerId);
      });
      resolve(updatedState);
    } else {
      // disconnect socket if it is the last room
      skylinkSignalingServer.config = skylinkSignalingServer.resetSocketConfig(window.location.protocol);

      const handleChannelClose = () => {
        logger.log.INFO([room.roomName, null, null, LEAVE_ROOM.DISCONNECT_SOCKET.SUCCESS]);
        removeEventListener(EVENTS.CHANNEL_CLOSE, handleChannelClose);
        resolve(updatedState);
      };

      addEventListener(EVENTS.CHANNEL_CLOSE, handleChannelClose);

      if (skylinkSignalingServer.socket.connected) {
        skylinkSignalingServer.socket.disconnect();
      } else {
        resolve(updatedState);
      }
    }
  });

  /**
   * Stops streams within a Skylink state.
   * @private
   * @param {SkylinkState} state
   */
  const stopStreams = (state) => {
    const { room, peerStreams, user } = state;

    if (peerStreams[user.sid]) {
      stopStreamHelpers.prepStopStreams(room.id, null, true);
    }

    new ScreenSharing(state).stop(true);
  };

  const clearRoomState = (roomKey) => {
    Skylink.clearRoomStateFromSingletons(roomKey);
    Skylink.removeSkylinkState(roomKey);
  };

  const clearBandwidthAdjuster = (roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    if (state.bandwidthAdjuster && !state.hasMCU) {
      // eslint-disable-next-line no-new
      new BandwidthAdjuster({ roomKey });
    }
  };

  /**
   * Method that starts the peer left process.
   * @param {SkylinkState} roomState
   * @private
   */
  const leaveRoom = roomState => new Promise((resolve, reject) => {
    const {
      peerConnections, peerInformations, room, hasMCU, user,
    } = roomState;
    const { ROOM: { LEAVE_ROOM } } = MESSAGES;

    try {
      // eslint-disable-next-line no-nested-ternary
      const peerIds = hasMCU ? (peerConnections.MCU ? [PEER_TYPE.MCU] : []) : Array.from(new Set([...Object.keys(peerConnections), ...Object.keys(peerInformations)]));

      if (isEmptyArray(peerIds)) {
        logger.log.DEBUG([room.roomName, null, null, LEAVE_ROOM.NO_PEERS]);
        stopStreams(roomState);
        sendByeOrDisconnectSocket(roomState)
          .then((removedState) => {
            logger.log.INFO([room.roomName, null, null, LEAVE_ROOM.REMOVE_STATE.SUCCESS]);
            dispatchEvent(peerLeft({
              peerId: user.sid,
              peerInfo: PeerData.getCurrentSessionInfo(room),
              isSelf: true,
              room: Room.getRoomInfo(room.id),
            }));
            clearBandwidthAdjuster(removedState.room.id);
            clearRoomState(removedState.room.id);
            resolve(removedState.room.roomName);
          });
      } else {
        const peerLeftPromises = [];

        peerIds.forEach((peerId) => {
          peerLeftPromises.push(executePeerLeftProcess(roomState, peerId));
        });

        Promise.all(peerLeftPromises)
          .then(() => {
            stopStreams(roomState);
            return sendByeOrDisconnectSocket(roomState);
          })
          .then((removedState) => {
            logger.log.INFO([room.roomName, null, null, LEAVE_ROOM.REMOVE_STATE.SUCCESS]);
            dispatchEvent(peerLeft({
              peerId: user.sid,
              peerInfo: PeerData.getCurrentSessionInfo(room),
              isSelf: true,
              room: Room.getRoomInfo(room.id),
            }));
            clearBandwidthAdjuster(removedState.room.id);
            clearRoomState(removedState.room.id);
            resolve(removedState.room.roomName);
          });
      }
    } catch (error) {
      logger.log.ERROR([room.roomName, null, null, LEAVE_ROOM.ERROR], error);
      reject(error);
    }
  });

  /**
   * Method that triggers self to leave all rooms.
   * @param {Array} closedRooms - Array of rooms that have been left
   * @param {Array} resolves - Array of resolves for each room that have been left
   * @private
   */
  const leaveAllRooms = (closedRooms = [], resolves = []) => new Promise((resolve, reject) => {
    const { ROOM: { LEAVE_ROOM } } = MESSAGES;

    try {
      const states = Skylink.getSkylinkState();
      const roomStates = Object.values(states);

      if (roomStates[0]) { // Checks for existing roomStates and picks the first in the array
        leaveRoom(roomStates[0])
          .then((roomName) => {
            closedRooms.push(roomName);
            resolves.push(resolve);
            leaveAllRooms(closedRooms, resolves);
          });
      } else {
        logger.log.INFO([closedRooms, 'Room', null, LEAVE_ROOM.LEAVE_ALL_ROOMS.SUCCESS]);
        resolves.forEach(res => res(closedRooms)); // resolves all promises
      }
    } catch (err) {
      logger.log.ERROR([null, 'Room', null, LEAVE_ROOM.LEAVE_ALL_ROOMS.ERROR], err);
      reject(err);
    }
  });

  class HandleClientStats extends SkylinkStats {
    constructor() {
      super();
      const { AdapterJS, navigator } = window;
      this.model = {
        client_id: null,
        app_key: null,
        timestamp: null,
        username: null,
        sdk_name: SDK_NAME.WEB,
        sdk_version: null,
        agent_name: AdapterJS.webrtcDetectedBrowser,
        agent_version: AdapterJS.webrtcDetectedVersion,
        agent_platform: navigator.platform,
        agent_plugin_version: null,
        device_version: null,
        enumerated_devices: null,
        device_muted: null,
        network_type: navigator.connection ? navigator.connection.type : '-',
        language: navigator.language,
      };
    }

    send(roomKey) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.username = (roomState.user && roomState.user.uid) || null;
      this.model.sdk_version = roomState.VERSION;
      this.model.client_id = roomState.clientId;
      this.model.app_key = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();

      this.postStats(this.endpoints.client, this.model);
    }
  }

  /**
   * @class
   * @classdesc Class representing a Skylink State.\
   * @private
   */
  class SkylinkState {
    /**
     * @property {SkylinkApiResponse} skylinkApiResponse
     */
    constructor(initOptions) {
      /**
       * Stores the api response.
       * @name apiResponse
       * @type {SkylinkApiResponse}
       * @since 2.0.0
       * @private
       */
      this.apiResponse = {};
      /**
       * Stores the list of Peer DataChannel connections.
       * @name dataChannels
       * @type {Object}
       * @property {String} peerId - The list of DataChannels associated with Peer ID.
       * @property {RTCDataChannel} channelLabel - The DataChannel connection.
       * The property name <code>"main"</code> is reserved for messaging Datachannel type.
       * @since 0.2.0
       * @private
       */
      this.dataChannels = {};
      /**
       * Stores the list of buffered ICE candidates that is received before
       *   remote session description is received and set.
       * @name peerCandidatesQueue
       * @property {Array} <#peerId> The list of the Peer connection buffered ICE candidates received.
       * @property {RTCIceCandidate} <#peerId>.<#index> The Peer connection buffered ICE candidate received.
       * @type JSON
       * @since 0.5.1
       * @private
       */
      this.peerCandidatesQueue = {};
      /**
       * Stores the list of ICE candidates received before signaling end.
       * @name peerEndOfCandidatesCounter
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.peerEndOfCandidatesCounter = {};
      /**
       * Stores the list of Peer connection ICE candidates.
       * @name gatheredCandidates
       * @property {JSON} <#peerId> The list of the Peer connection ICE candidates.
       * @property {JSON} <#peerId>.sending The list of the Peer connection ICE candidates sent.
       * @property {JSON} <#peerId>.receiving The list of the Peer connection ICE candidates received.
       * @type JSON
       * @since 0.6.14
       * @private
       */
      this.gatheredCandidates = {};
      /**
       * Stores the window number of Peer connection retries that would increase the wait-for-response timeout
       *   for the Peer connection health timer.
       * @name retryCounters
       * @type JSON
       * @since 0.5.10
       * @private
       */
      this.retryCounters = {};
      /**
       * Stores the list of the Peer connections.
       * @name peerConnections
       * @property {RTCPeerConnection} <#peerId> The Peer connection.
       * @type JSON
       * @since 0.1.0
       * @private
       */
      this.peerConnections = {};
      /**
       * Stores the list of the Peer connections stats.
       * @name peerStats
       * @property {JSON} <#peerId> The Peer connection stats.
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.peerStats = {};
      /**
       * Stores the list of Peers session information.
       * @name peerInformations
       * @property {JSON} <#peerId> The Peer session information.
       * @property {JSON|string} <#peerId>.userData The Peer custom data.
       * @property {JSON} <#peerId>.settings The Peer streaming information.
       * @property {JSON} <#peerId>.mediaStatus The Peer streaming media status.
       * @property {JSON} <#peerId>.agent The Peer agent information.
       * @type JSON
       * @since 0.3.0
       * @private
       */
      this.peerInformations = {};
      /**
       * Stores the Signaling user credentials from the API response required for connecting to the Signaling server.
       * @name user
       * @property {String} uid The API result "username".
       * @property {String} token The API result "userCred".
       * @property {String} timeStamp The API result "timeStamp".
       * @property {String} sid The Signaling server receive user Peer ID.
       * @type SkylinkUser
       * @since 0.5.6
       * @private
       */
      this.user = initOptions.user;
      /**
       * Stores the User connection priority weight received from signalling server inRoom message.
       * In case of crossing offers, the offer that contains the lower weight will be dropped.
       * @name peerPriorityWeight
       * @type number
       * @since 0.5.0
       * @private
       */
      this.peerPriorityWeight = 0;
      /**
       * Stores the flag that indicates if "isPrivileged" is enabled.
       * If enabled, the User has Privileged features which has the ability to retrieve the list of
       *   Peers in the same App space with <code>getPeers()</code> method
       *   and introduce Peers to each other with <code>introducePeer</code> method.
       * @name isPrivileged
       * @type boolean
       * @default false
       * @since 0.6.1
       * @private
       */
      this.isPrivileged = initOptions.isPrivileged;
      /**
       * Stores the current socket connection information.
       * @name socketSession
       * @type {socketSession}
       * @since 0.6.13
       * @private
       */
      this.socketSession = {};
      /**
       * Stores the queued socket messages.
       * This is to prevent too many sent over less than a second interval that might cause DROPPED messages
       *   or jams to the Signaling connection.
       * @name socketMessageQueue
       * @type Array
       * @since 0.5.8
       * @private
       */
      this.socketMessageQueue = [];
      /**
       * Stores the flag that indicates if socket connection to the Signaling has opened.
       * @name channelOpen
       * @type boolean
       * @since 0.5.2
       * @private
       */
      this.channelOpen = false;
      /**
       * Stores the Signaling server url.
       * @name signalingServer
       * @type string
       * @since 0.5.2
       * @private
       */
      this.socketServer = initOptions.socketServer;
      /**
       * Stores the Signaling server protocol.
       * @name signalingServerProtocol
       * @type string
       * @since 0.5.4
       * @private
       */
      this.signalingServerProtocol = initOptions.forceSSL ? 'https:' : window.location.protocol;
      /**
       * Stores the value if ICE restart is supported.
       * @name enableIceRestart
       * @type boolean
       * @since 0.6.16
       * @private
       */
      this.enableIceRestart = false;
      /**
       * Stores the flag if MCU environment is enabled.
       * @name hasMCU
       * @type boolean
       * @since 0.5.4
       * @private
       */
      this.hasMCU = initOptions.hasMCU;
      /**
       * Stores the Room credentials information for <code>joinRoom()</code>.
       * @name room
       * @property {String} id The "rid" for <code>joinRoom()</code>.
       * @property {String} token The "roomCred" for <code>joinRoom()</code>.
       * @property {String} startDateTime The "start" for <code>joinRoom()</code>.
       * @property {String} duration The "len" for <code>joinRoom()</code>.
       * @property {String} connection The RTCPeerConnection constraints and configuration. This is not used in the SDK
       *   except for the "mediaConstraints" property that sets the default <code>getUserMedia()</code> settings.
       * @type SkylinkRoom
       * @since 0.5.2
       * @private
       */
      this.room = initOptions.room;
      /**
       * Stores the list of Peer messages timestamp.
       * @name peerMessagesStamps
       * @type JSON
       * @since 0.6.15
       * @private
       */
      this.peerMessagesStamps = {};
      /**
       * Stores all the Stream required muted settings.
       * @name streamsMutedSettings
       * @type JSON
       * @since 0.6.15
       * @private
       */
      this.streamsMutedSettings = {};
      /**
       * Stores all the Stream sending maximum bandwidth settings.
       * @name streamsBandwidthSettings
       * @type JSON
       * @since 0.6.15
       * @private
       */
      this.streamsBandwidthSettings = {
        bAS: {},
      };
      /**
       * Stores the list of recordings.
       * @name recordings
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.recordings = {};
      /**
       * Stores the current active recording session ID.
       * There can only be 1 recording session at a time in a Room
       * @name currentRecordingId
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.currentRecordingId = false;
      /**
       * Stores the recording session timeout to ensure 4 seconds has been recorded.
       * @name recordingStartInterval
       * @type number
       * @since 0.6.16
       * @private
       */
      this.recordingStartInterval = null;
      /**
       * Stores the currently supported codecs.
       * @name currentCodecSupport
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.currentCodecSupport = null;
      /**
       * Stores the flag if voice activity detection should be enabled.
       * @name voiceActivityDetection
       * @type boolean
       * @default true
       * @since 0.6.18
       * @private
       */
      this.voiceActivityDetection = true;
      /**
       * Stores the auto bandwidth settings.
       * @name bandwidthAdjuster
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.bandwidthAdjuster = null;
      /**
       * Stores the list of RTMP Sessions.
       * @name rtmpSessions
       * @type JSON
       * @since 0.6.36
       * @private
       */
      this.rtmpSessions = {};
      /**
       * Offer buffered in order to apply when received answer
       * @name bufferedLocalOffer
       * @type Object
       * @private
       * @since 1.0.0
       */
      this.bufferedLocalOffer = {};
      /**
       * Offers buffered in order to apply when answerAck has been received
       * @name bufferedRemoteOffers
       * @type Object
       * @private
       * @since 2.0.0
       */
      this.bufferedRemoteOffers = {};
      /**
       * Map of RTCRTPSenders that are added via addTrack
       * @name currentRTCRTPSenders
       * @type Object
       * @private
       * @since 1.0.0
       */
      this.currentRTCRTPSenders = {};
      /**
       * Stores the unique random number used for generating the "client_id".
       * @name clientId
       * @type string
       * @private
       * @since 0.6.31
       */
      this.clientId = initOptions.clientId;
      /**
       * Stores all the Stream media status.
       * @name streamsMediaStatus
       * @type Object
       * @private
       * @since 1.0.0
       */
      this.streamsMediaStatus = {};
      /**
       * Stores the media info of all peers.
       * @name peerMedias
       * @type Object
       * @private
       * @since 2.0.0
       */
      this.peerMedias = {};
      /**
       * Stores the flag if messages should be persisted. Value determined by the hasPersistentMessage value returned from the API.
       * This feature is enabled in the Temasys Developer Console by toggling the Persistent Message feature at the key level.
       * @name hasPersistentMessage
       * @type Object
       * @private
       * @since 2.0.0
       */
      this.hasPersistentMessage = initOptions.hasPersistentMessage;
      this.peerStreams = {};
      this.streamsSettings = {};
      this.enableStatsGathering = initOptions.enableStatsGathering;
    }
  }

  const buildCachedApiResponse = (skylinkApiResponse) => {
    const cachedResponse = clone_1(skylinkApiResponse);
    delete cachedResponse.room;
    delete cachedResponse.user;
    return cachedResponse;
  };

  const addNewStateAndCacheApiResponse = (response, options) => {
    const apiServer = new SkylinkAPIServer();
    const skylinkApiResponse = new SkylinkApiResponse(response);
    const initOptions = apiServer.enforceUserInitOptions(skylinkApiResponse);
    const skylinkState = new SkylinkState(initOptions);
    skylinkState.user.userData = options.userData;
    skylinkState.apiResponse = Object.freeze(buildCachedApiResponse(skylinkApiResponse));
    Skylink.setSkylinkState(skylinkState, response.roomName);
    return skylinkState;
  };

  /**
   * @description Method that starts the Room Session.
   * @param {joinRoomOptions} [opts] The options available to join the room and configure the session.
   * @param {MediaStream} [prefetchedStream] The prefetched media stream object obtained when the user calls getUserMedia before joinRoom.
   * @return {Promise} Promise object with MediaStream.
   * @memberOf Room
   * @alias Room.joinRoom
   * @private
   */
  const joinRoom = (opts = {}, prefetchedStream = null) => new Promise((resolve, reject) => {
    const options = opts || {};
    const { navigator } = window;
    const apiServer = new SkylinkAPIServer();
    const signalingServer = new SkylinkSignalingServer();
    const initOptions = Skylink.getInitOptions();
    const handleClientStats = new HandleClientStats();
    const roomName = SkylinkAPIServer.getRoomNameFromParams(options) ? SkylinkAPIServer.getRoomNameFromParams(options) : initOptions.defaultRoom;

    if (!roomName) {
      reject(MESSAGES.ROOM_STATE.NO_ROOM_NAME);
      return;
    }

    dispatchEvent(readyStateChange({
      readyState: READY_STATE_CHANGE$1.LOADING,
      error: null,
      room: { roomName },
    }));

    apiServer.createRoom(roomName).then((result) => {
      const { response } = result;
      response.roomName = roomName;
      const skylinkState = addNewStateAndCacheApiResponse(response, options);

      apiServer.checkCodecSupport(skylinkState.room.id).then(() => {
        handleClientStats.send(skylinkState.room.id);
        return signalingServer.createSocket(response.room_key).then(() => {
          const room = SkylinkAPIServer.getStateByKey(response.room_key);
          const userMediaParams = Object.assign({}, options);

          userMediaParams.room = room;
          // has prefetchedStream or has passed in a mediaStream as first argument or has passed in an array of mediaStreams as first argument
          if (prefetchedStream || (options.id && options.active) || Array.isArray(options)) {
            MediaStream.processPrefetchedStreams(response.room_key, prefetchedStream, options).then(() => {
              signalingServer.joinRoom(room);
              resolve(null);
            }).catch((error) => {
              reject(error);
            });
          } else if (options.audio || options.video) {
            MediaStream.getUserMedia(skylinkState, userMediaParams).then((stream) => {
              signalingServer.joinRoom(room);
              resolve(stream);
            }).catch((streamException) => {
              reject(streamException);
            });
          } else {
            const updatedRoomState = helpers$7.parseMediaOptions(options, skylinkState);
            Skylink.setSkylinkState(updatedRoomState, room.id);
            // If no audio is requested for Safari, audio will not be heard on the Safari peer even if the remote peer has audio. Workaround to
            // request media access but not add the track to the peer connection. Does not seem to apply to video.
            if (isAgent(BROWSER_AGENT.SAFARI)) {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => signalingServer.joinRoom(room));
            } else {
              signalingServer.joinRoom(room);
            }
            resolve(null);
          }
        });
      }).catch((codecError) => {
        reject(codecError);
      });
    }).catch((socketException) => {
      reject(socketException);
    });
  });

  /**
   * @description Method that locks or unlocks a room.
   * @param {SkylinkState} roomState - The room state.
   * @param {boolean} lockRoom - The flag if the room should be locked or unlocked.
   * @private
   */
  const lockOrUnlockRoom = (roomState, lockRoom = true) => {
    const updatedState = roomState;
    const { room, user } = updatedState;
    const signalingServer = new SkylinkSignalingServer();

    updatedState.room.isLocked = lockRoom;
    Skylink.setSkylinkState(updatedState, room.id);

    signalingServer.roomLock(updatedState);

    dispatchEvent(roomLock({
      isLocked: updatedState.room.isLocked,
      peerInfo: PeerData.getCurrentSessionInfo(room),
      peerId: user.sid,
      isSelf: true,
      room: Room.getRoomInfo(room.id),
    }));
  };

  /**
   * @description Method that locks a room.
   * @param {SkylinkState} roomState - The room state.
   * @private
   */
  const lockRoom = roomState => lockOrUnlockRoom(roomState, true);

  /**
   * @description Method that unlocls a room.
   * @param {SkylinkState} roomState - The room state.
   * @private
   */
  const unlockRoom = roomState => lockOrUnlockRoom(roomState, false);

  /**
   * @typedef roomInfo
   * @property {String} roomName - The room name
   * @property {Number} duration - The maximum allowed room duration
   * @property {String} id - The room id
   * @property {Boolean} inRoom - The flag if the peer is in the room
   */
  /**
   * @param roomKey
   * @return {roomInfo}
   * @private
   */
  const getRoomInfo = (roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { room } = state;
    const roomInfo = Object.assign({}, room);
    delete roomInfo.connection;
    delete roomInfo.token;
    delete roomInfo.startDateTime;
    return roomInfo;
  };

  /**
   * @classdesc Class that contains the methods for Room.
   * @private
   */
  class Room {
    /** @lends Room */
    static leaveRoom(...args) {
      return leaveRoom(...args);
    }

    static leaveAllRooms() {
      return leaveAllRooms();
    }

    static lockRoom(roomState) {
      return lockRoom(roomState);
    }

    static unlockRoom(roomState) {
      return unlockRoom(roomState);
    }

    static joinRoom(...args) {
      return joinRoom(...args);
    }

    static getRoomInfo(args) {
      return getRoomInfo(args);
    }
  }

  /**
   * @description Function that returns the current session peerInfo is peer isSelf.
   * @private
   * @param {SkylinkRoom} room
   * @return {peerInfo}
   * @memberOf PeerDataHelpers
   */
  const getCurrentSessionInfo = (room) => {
    const state = Skylink.getSkylinkState(room.id);
    const initOptions = Skylink.getInitOptions();
    const { AdapterJS, navigator } = window;
    const { enableDataChannel } = initOptions;
    const {
      streamsMediaStatus,
      peerPriorityWeight,
      enableIceRestart,
      peerStreams,
      streamsBandwidthSettings,
      streamsSettings,
      user,
    } = state;

    const peerInfo = {
      userData: '',
      settings: {
        audio: false,
        video: false,
      },
      mediaStatus: {},
      agent: {
        name: AdapterJS.webrtcDetectedBrowser,
        version: AdapterJS.webrtcDetectedVersion,
        os: navigator.platform,
        pluginVersion: null,
        SMProtocolVersion: SM_PROTOCOL_VERSION,
        DTProtocolVersion: DT_PROTOCOL_VERSION,
        SDKVersion: SDK_VERSION,
      },
      room: Room.getRoomInfo(room.id),
      config: {
        enableDataChannel,
        enableIceRestart,
        priorityWeight: peerPriorityWeight,
      },
      sid: user.sid,
    };

    if (peerStreams[user.sid]) {
      const streamIds = Object.keys(peerStreams[user.sid]);
      streamIds.forEach((id) => {
        if (streamsSettings[id].settings.audio) {
          peerInfo.settings.audio = peerInfo.settings.audio || {};
          peerInfo.settings.audio[id] = clone_1(streamsSettings[id].settings.audio);
        } else if (streamsSettings[id].settings.video) {
          peerInfo.settings.video = peerInfo.settings.video || {};
          peerInfo.settings.video[id] = clone_1(streamsSettings[id].settings.video);
        }
      });
    }

    peerInfo.mediaStatus = streamsMediaStatus;
    peerInfo.userData = user.userData || null;
    peerInfo.settings.maxBandwidth = clone_1(streamsBandwidthSettings.bAS);
    peerInfo.settings.data = enableDataChannel;

    return clone_1(peerInfo);
  };

  /**
   * @description Function that returns the User / Peer current custom data.
   * @private
   * @param {Skylink} roomState
   * @param {String} peerId
   * @return {roomState.userData}
   * @memberOf PeerDataHelpers
   */
  const getUserData = (roomState, peerId) => {
    if (peerId && roomState.peerInformations[peerId]) {
      let peerUserData = roomState.peerInformations[peerId].userData;

      if (!peerUserData) {
        peerUserData = '';
      }
      return peerUserData;
    }
    return roomState.user.userData;
  };

  /**
   * @description Function that overwrites the User current custom data.
   * @private
   * @param {SkylinkRoom} room
   * @param {String | Object} userData
   * @memberOf PeerDataHelpers
   * @fires PEER_UPDATED
   */
  const setUserData = (room, userData) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const { PEER_INFORMATIONS: { UPDATE_USER_DATA } } = MESSAGES;
    const updatedUserData = userData || '';

    roomState.user.userData = updatedUserData;
    Skylink.setSkylinkState(roomState, roomState.room.id);

    new SkylinkSignalingServer().setUserData(roomState);

    dispatchEvent(peerUpdated({
      peerId: roomState.user.sid,
      peerInfo: helpers$6.getCurrentSessionInfo(room),
      isSelf: true,
    }));

    logger.log.INFO(UPDATE_USER_DATA, updatedUserData);
  };

  const hasPeerDataChannels$1 = dataChannels => !isEmptyObj(dataChannels);

  /**
   * @description Function that gets the current list of connected Peers Datachannel connections in the Room.
   * @private
   * @param {SkylinkState} roomState
   * @return {Object} listOfPeersDataChannels
   * @memberOf PeerDataHelpers
   */
  const getPeersDataChannels = (roomState) => {
    const { dataChannels } = roomState;
    const listOfPeersDataChannels = {};
    const listOfPeers = Object.keys(dataChannels);

    for (let i = 0; i < listOfPeers.length; i += 1) {
      const peerId = listOfPeers[i];
      listOfPeersDataChannels[peerId] = {};

      if (hasPeerDataChannels$1(dataChannels)) {
        const channelProp = Object.keys(dataChannels[peerId]);
        for (let y = 0; y < channelProp.length; y += 1) {
          const channel = dataChannels[peerId][channelProp[y]];
          const {
            channelName,
            channelType,
            transferId,
            streamId,
          } = channel;
          let peerChannel = null;
          peerChannel = PeerConnection.getDataChannelBuffer(channel);
          peerChannel.channelProp = channelProp[y];
          peerChannel.channelName = channelName;
          peerChannel.channelType = channelType;
          peerChannel.currentTransferId = transferId;
          peerChannel.currentStreamId = streamId;
          peerChannel.readyState = channel.channel
            ? channel.channel.readyState : DATA_CHANNEL_STATE$1.CREATE_ERROR;

          listOfPeersDataChannels[peerId][channelName] = peerChannel;
        }
      }
    }

    return listOfPeersDataChannels;
  };

  const hasPeers = peerInformations => !isEmptyObj(peerInformations);

  /**
   * Function that gets a current custom Peer settings.
   * @param {SkylinkState} state
   * @param {String} peerId
   * @private
   * @return {Object}
   * @memberOf PeerDataHelpers
   */
  const getPeerCustomSettings = (state, peerId) => {
    const usePeerId = state.hasMCU ? PEER_TYPE.MCU : peerId;
    let customSettings = {};

    if (state.peerConnections[usePeerId].connectionState !== PEER_CONNECTION_STATE$1.CLOSED) {
      const peerInfo = PeerData.getPeerInfo(peerId, state.room);

      customSettings = clone_1(peerInfo.settings);
    } else {
      logger.log.WARN([peerId, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.NO_PEER_CONNECTION]);
    }

    return customSettings;
  };

  /**
   * @description Function that gets the list of current custom Peer settings sent and set.
   * @param {SkylinkState} roomState
   * @return {Object} customSettingsList
   * @memberOf PeerDataHelpers
   */
  const getPeersCustomSettings = (roomState) => {
    const { peerInformations } = roomState;
    const customSettingsList = {};

    if (hasPeers(peerInformations)) {
      const peerIds = Object.keys(peerInformations);

      for (let peerId = 0; peerId < peerIds.length; peerId += 1) {
        if (peerIds[peerId] !== PEER_TYPE.MCU) {
          customSettingsList[peerIds[peerId]] = getPeerCustomSettings(roomState, peerIds[peerId]);
        }
      }

      return customSettingsList;
    }

    return customSettingsList;
  };

  /**
   * @namespace PeerDataHelpers
   * @description All helper and utility functions for <code>{@link PeerData}</code> class are listed here.
   * @private
   * @type {{getCurrentSessionInfo, getPeerInfo, getUserData, getUserInfo, setUserData, getPeersDataChannels, getPeersCustomSettings}}
   */
  const helpers$6 = {
    getPeerInfo,
    getCurrentSessionInfo,
    getUserInfo,
    getUserData,
    setUserData,
    getPeersDataChannels,
    getPeersCustomSettings,
  };

  /**
   * @classdesc Class that represents PeerData methods
   * @class
   * @private
   */
  class PeerData {
    /**
     * @description Function that returns the User / Peer current session information.
     * @private
     * @param {String} peerId
     * @param {SkylinkRoom} room
     * @return {peerInfo}
     */
    static getPeerInfo(peerId, room) {
      return helpers$6.getPeerInfo(peerId, room);
    }

    /**
     * @private
     * @param {SkylinkRoom} room
     * @return {peerInfo}
     */
    static getCurrentSessionInfo(room) {
      return helpers$6.getCurrentSessionInfo(room);
    }

    /**
     * @description Function that returns the User session information to be sent to Peers.
     * @private
     * @param {SkylinkRoom} room
     * @return {Object}
     */
    static getUserInfo(room) {
      return helpers$6.getUserInfo(room);
    }

    /**
     * @description Function that returns the User / Peer current custom data.
     * @private
     * @param {Skylink} roomState
     * @param {String} peerId
     * @return {roomState.userData}
     */
    static getUserData(roomState, peerId) {
      return helpers$6.getUserData(roomState, peerId);
    }

    /**
     * @description Function that overwrites the User current custom data.
     * @private
     * @param {SkylinkRoom} room
     * @param {String | Object} userData
     */
    static setUserData(room, userData) {
      helpers$6.setUserData(room, userData);
    }

    /**
     * @description  Function that gets the list of connected Peers Streams in the Room.
     * @private
     * @param {SkylinkState} roomState
     * @param {boolean} [includeSelf=true] - The flag if self streams are included.
     * @return {Object}
     */
    static getPeersStreams(roomState, includeSelf) {
      return helpers$6.getPeersStreams(roomState, includeSelf);
    }

    /**
     * @description Function that gets the current list of connected Peers Datachannel connections in the Room.
     * @private
     * @param {SkylinkState} roomState
     * @return {Object} listOfPeersDataChannels
     */
    static getPeersDataChannels(roomState) {
      return helpers$6.getPeersDataChannels(roomState);
    }

    /**
     * @description Function that gets the list of current custom Peer settings sent and set.
     * @param {SkylinkState} roomState
     * @return {Object}
     */
    static getPeersCustomSettings(roomState) {
      return helpers$6.getPeersCustomSettings(roomState);
    }
  }

  const dispatchStreamMutedEvent = (room, stream, isScreensharing) => {
    const roomState = Skylink.getSkylinkState(room.id);
    PeerStream.dispatchStreamEvent(STREAM_MUTED, {
      isSelf: true,
      peerId: roomState.user.sid,
      peerInfo: PeerData.getUserInfo(room),
      streamId: stream.id,
      isScreensharing,
      isAudio: hasAudioTrack(stream),
      isVideo: hasVideoTrack(stream),
    });
  };

  const dispatchPeerUpdatedEvent$1 = (room) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const isSelf = true;
    const peerId = roomState.user.sid;
    const peerInfo = PeerData.getCurrentSessionInfo(room);

    dispatchEvent(peerUpdated({
      isSelf,
      peerId,
      peerInfo,
    }));
  };

  const getAudioTracks = stream => stream.getAudioTracks();

  const getVideoTracks = stream => stream.getVideoTracks();

  const dispatchLocalMediaMutedEvent = (hasToggledVideo, hasToggledAudio, stream, roomKey, isScreensharing = false) => {
    const state = Skylink.getSkylinkState(roomKey);

    if ((hasVideoTrack(stream) && hasToggledVideo) || (hasAudioTrack(stream) && hasToggledAudio)) {
      dispatchEvent(localMediaMuted({
        streamId: stream.id,
        isScreensharing,
        mediaStatus: state.streamsMediaStatus[stream.id],
      }));
    }

    return true;
  };

  const updateMediaInfo = (hasToggledVideo, hasToggledAudio, room, streamId) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const originalStreamId = streamId;
    const { streamsMutedSettings } = roomState;

    if (hasToggledVideo) {
      const mediaId = PeerMedia.retrieveMediaId(TRACK_KIND.VIDEO, originalStreamId);
      PeerMedia.updatePeerMediaInfo(room, roomState.user.sid, mediaId, MEDIA_INFO.MEDIA_STATE, streamsMutedSettings[originalStreamId].videoMuted ? MEDIA_STATE.MUTED : MEDIA_STATE.ACTIVE);
    }

    if (hasToggledAudio) {
      const mediaId = PeerMedia.retrieveMediaId(TRACK_KIND.AUDIO, originalStreamId);
      setTimeout(() => PeerMedia.updatePeerMediaInfo(room, roomState.user.sid, mediaId, MEDIA_INFO.MEDIA_STATE, streamsMutedSettings[originalStreamId].audioMuted ? MEDIA_STATE.MUTED : MEDIA_STATE.ACTIVE), hasToggledVideo ? 1050 : 0);
    }
  };

  const muteFn = (stream, state) => {
    const updatedState = state;
    const { room } = updatedState;
    const audioTracks = getAudioTracks(stream);
    const videoTracks = getVideoTracks(stream);
    updatedState.streamsMediaStatus[stream.id].audioMuted = MEDIA_STATUS.UNAVAILABLE;
    updatedState.streamsMediaStatus[stream.id].videoMuted = MEDIA_STATUS.UNAVAILABLE;

    audioTracks.forEach((audioTrack) => {
      // eslint-disable-next-line no-param-reassign
      audioTrack.enabled = !updatedState.streamsMutedSettings[stream.id].audioMuted;
      updatedState.streamsMediaStatus[stream.id].audioMuted = updatedState.streamsMutedSettings[stream.id].audioMuted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE;
    });

    videoTracks.forEach((videoTrack) => {
      // eslint-disable-next-line no-param-reassign
      videoTrack.enabled = !updatedState.streamsMutedSettings[stream.id].videoMuted;
      updatedState.streamsMediaStatus[stream.id].videoMuted = updatedState.streamsMutedSettings[stream.id].videoMuted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE;
    });

    Skylink.setSkylinkState(updatedState, room.id);

    logger.log.DEBUG(MESSAGES.MEDIA_STREAM.UPDATE_MEDIA_STATUS, updatedState.streamsMediaStatus, stream.id);
  };

  const retrieveToggleState = (state, options, streamId) => {
    const { peerStreams, streamsMutedSettings, user } = state;
    let hasToggledAudio = false;
    let hasToggledVideo = false;

    if (peerStreams[user.sid] && peerStreams[user.sid][streamId]) {
      if (hasAudioTrack(peerStreams[user.sid][streamId]) && streamsMutedSettings[streamId].audioMuted !== options.audioMuted) {
        hasToggledAudio = true;
      }

      if (hasVideoTrack(peerStreams[user.sid][streamId]) && streamsMutedSettings[streamId].videoMuted !== options.videoMuted) {
        hasToggledVideo = true;
      }
    }

    return {
      hasToggledAudio,
      hasToggledVideo,
    };
  };

  const updateStreamsMutedSettings = (state, toggleState, streamId) => {
    const updatedState = state;
    const { room } = updatedState;

    if (toggleState.hasToggledAudio) {
      updatedState.streamsMutedSettings[streamId].audioMuted = !updatedState.streamsMutedSettings[streamId].audioMuted;
    }

    if (toggleState.hasToggledVideo) {
      updatedState.streamsMutedSettings[streamId].videoMuted = !updatedState.streamsMutedSettings[streamId].videoMuted;
    }

    logger.log.DEBUG(MESSAGES.MEDIA_STREAM.UPDATE_MUTED_SETTINGS, updatedState.streamsMutedSettings, streamId);
    Skylink.setSkylinkState(updatedState, room.id);
  };

  const startMuteEvents = (roomKey, streamId, options) => {
    const roomState = Skylink.getSkylinkState(roomKey);
    const {
      room, peerConnections, peerInformations, peerStreams, user,
    } = roomState;
    const toggleState = retrieveToggleState(roomState, options, streamId);
    const { hasToggledAudio, hasToggledVideo } = toggleState;
    let mutedStream = null;

    if (peerStreams[user.sid] && peerStreams[user.sid][streamId]) {
      mutedStream = peerStreams[user.sid][streamId];
    }
    const isScreensharing = !!PeerMedia.retrieveScreenMediaInfo(room, user.sid, { streamId });

    if (!mutedStream) {
      return;
    }

    updateStreamsMutedSettings(roomState, toggleState, streamId);
    muteFn(mutedStream, roomState);
    dispatchLocalMediaMutedEvent(hasToggledVideo, hasToggledAudio, mutedStream, room.id, isScreensharing);
    dispatchPeerUpdatedEvent$1(room);
    dispatchStreamMutedEvent(room, mutedStream, isScreensharing);

    // wait for at least 1 connection before sending mediaInfoEvent otherwise sig message will be dropped at sendMediaInfoMsg if there are no
    // connections
    if ((!peerConnections[PEER_TYPE.MCU] && isEmptyArray(Object.keys(peerConnections))) || (peerConnections[PEER_TYPE.MCU] && isEmptyArray(Object.keys(peerInformations)))) { // no P2P peers || no MCU peers
      const updateMediaInfoAndRemoveListener = (evt) => {
        const { state } = evt.detail;
        if (state === HANDSHAKE_PROGRESS$1.ANSWER_ACK) {
          updateMediaInfo(hasToggledVideo, hasToggledAudio, room, streamId);
          removeEventListener(EVENTS.HANDSHAKE_PROGRESS, updateMediaInfoAndRemoveListener);
        }
      };

      addEventListener(EVENTS.HANDSHAKE_PROGRESS, updateMediaInfoAndRemoveListener);
    } else {
      // Workaround for sendStream with mute option and existing peerConnections throwing "no streamId" error message:
      // delay sending the mediaInfoEvent sig message to ensure that ontrack on the remote is fired and the streamId is populated in mediaInfo
      // before mediaInfoEvent is received
      setTimeout(() => {
        updateMediaInfo(hasToggledVideo, hasToggledAudio, room, streamId);
      }, 500);
    }
  };

  const retrieveMutedSetting = (mediaMutedOption) => {
    switch (mediaMutedOption) {
      case 1:
        return false;
      case 0:
        return true;
      default:
        return true;
    }
  };

  /**
   * @param {SkylinkState} roomState
   * @param {boolean} options
   * @param {boolean} options.audioMuted
   * @param {boolean} options.videoMuted
   * @param {String} streamId
   * @memberOf MediaStreamHelpers
   * @fires STREAM_MUTED
   * @fires PEER_UPDATED
   * @fires LOCAL_MEDIA_MUTED
   */
  const muteStreams = (roomState, options, streamId = null) => {
    const {
      peerStreams, room, user,
    } = roomState;

    if (!isAObj(options)) {
      logger.log.ERROR(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_MUTE_OPTIONS, options);
      return;
    }

    if (!peerStreams[user.sid]) {
      logger.log.WARN(MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM);
      return;
    }

    if (streamId && !peerStreams[user.sid][streamId]) {
      logger.log.ERROR(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_STREAM_ID, streamId);
      return;
    }

    const fOptions = {
      // eslint-disable-next-line no-nested-ternary
      audioMuted: isABoolean(options.audioMuted) ? options.audioMuted : (isANumber(options.audioMuted) ? retrieveMutedSetting(options.audioMuted) : true),
      // eslint-disable-next-line no-nested-ternary
      videoMuted: isABoolean(options.videoMuted) ? options.videoMuted : (isANumber(options.videoMuted) ? retrieveMutedSetting(options.videoMuted) : true),
    };

    const streamIdsThatCanBeMuted = streamId ? [streamId] : (peerStreams[user.sid] && Object.keys(peerStreams[user.sid])) || [];

    if (isEmptyArray(streamIdsThatCanBeMuted)) {
      logger.log.ERROR(MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAMS_MUTED, options);
      return;
    }

    const streamIdsToMute = Object.values(streamIdsThatCanBeMuted).filter(sId => (retrieveToggleState(roomState, fOptions, sId).hasToggledAudio || retrieveToggleState(roomState, fOptions, sId).hasToggledVideo));

    streamIdsToMute.forEach((streamIdToMute) => {
      startMuteEvents(room.id, streamIdToMute, fOptions);
    });
  };

  /**
   * @description Helper function for {@link MediaStream.getUserMedia}
   * @param {getUserMediaOptions} params - The camera Stream configuration options.
   * @memberOf MediaStreamHelpers
   * @return {Promise}
   */
  const prepMediaAccessRequest = params => new Promise((resolve, reject) => {
    const { roomKey, ...rest } = params;
    const audioSettings = helpers$7.parseStreamSettings(rest, TRACK_KIND.AUDIO);
    const videoSettings = helpers$7.parseStreamSettings(rest, TRACK_KIND.VIDEO);
    const { AdapterJS } = window;

    if (!audioSettings.getUserMediaSettings.audio && !videoSettings.getUserMediaSettings.video) {
      reject(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GUM_OPTIONS);
    }

    AdapterJS.webRTCReady(() => {
      window.navigator.mediaDevices.getUserMedia({ audio: audioSettings.getUserMediaSettings.audio, video: videoSettings.getUserMediaSettings.video }).then((stream) => {
        const isAudioFallback = false;

        const streams = helpers$7.onStreamAccessSuccess(roomKey, stream, audioSettings, videoSettings, isAudioFallback);
        const state = Skylink.getSkylinkState(roomKey);
        if (streams[0] && audioSettings.mutedSettings.shouldAudioMuted) {
          muteStreams(state, { audioMuted: audioSettings.mutedSettings.shouldAudioMuted, videoMuted: videoSettings.mutedSettings.shouldVideoMuted }, streams[0].id);
        }

        if (streams[1] && videoSettings.mutedSettings.shouldVideoMuted) {
          muteStreams(state, { audioMuted: audioSettings.mutedSettings.shouldAudioMuted, videoMuted: videoSettings.mutedSettings.shouldVideoMuted }, streams[1].id);
        }

        resolve(streams);
      }).catch(error => helpers$7.onStreamAccessError(error, reject, resolve, roomKey, audioSettings, videoSettings));
    });
  });

  const isSenderTrackAndTrackMatched = (senderTrack, tracks) => {
    for (let x = 0; x < tracks.length; x += 1) {
      if (senderTrack.id === tracks[x].id) {
        return true;
      }
    }

    return false;
  };

  const isStreamOnPC = (peerConnection, stream) => {
    const transceivers = peerConnection.getTransceivers ? peerConnection.getTransceivers() : [];
    const tracks = stream.getTracks();

    if (isEmptyArray(transceivers)) {
      return false;
    }

    for (let i = 0; i < transceivers.length; i += 1) {
      if (transceivers[i].sender.track && isSenderTrackAndTrackMatched(transceivers[i].sender.track, tracks)) {
        return true;
      }
    }

    return false;
  };

  const addTracksToPC = (state, peerId, stream, peerConnection) => {
    const updatedState = state;
    const tracks = stream.getTracks();
    for (let track = 0; track < tracks.length; track += 1) { // there should only be 1 track
      const sender = peerConnection.addTrack(tracks[track], stream);
      if (sender) {
        helpers$4.processNewSender(updatedState, peerId, sender);
      }
    }

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
  };

  const addMediaStreams = (state, peerId, streams, peerConnection) => {
    const mediaStreams = Object.values(streams);
    for (let x = 0; x < mediaStreams.length; x += 1) {
      if (!isStreamOnPC(peerConnection, mediaStreams[x])) {
        addTracksToPC(state, peerId, mediaStreams[x], peerConnection);
      }
    }
  };

  /**
   * Function that sets User's Stream to send to Peer connection.
   * Priority for <code>shareScreen()</code> Stream over <code>{@link MediaStream.getUserMedia}</code> Stream.
   * @param {String} targetMid - The mid of the target peer
   * @param {SkylinkState} roomState - Skylink State of current room
   * @memberOf MediaStreamHelpers
   * @private
   */
  const addLocalMediaStreams = (targetMid, roomState) => {
    // TODO: Full implementation (cross-browser) not done. Refer to stream-media.js for checks on AJS
    const state = Skylink.getSkylinkState(roomState.room.id);
    const {
      peerConnections, user, peerStreams,
    } = state;
    const peerConnection = peerConnections[targetMid];


    if (peerStreams[user.sid] && !isEmptyObj(peerStreams[user.sid])) {
      addMediaStreams(state, targetMid, peerStreams[user.sid], peerConnection);
    }
  };

  /**
   * Function that handles the <code>RTCPeerConnection.ontrack</code> event on remote stream added.
   * @param {MediaStream} stream - {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream}
   * @param {SkylinkState} currentRoomState - Current room state
   * @param {String} targetMid - The mid of the target peer
   * @param {boolean} isScreensharing - The flag if incoming stream is a screenshare stream.
   * @param {boolean} isVideo - The flag if incoming stream has a video track.
   * @param {boolean} isAudio- The flag if incoming stream has an audio track.
   * @memberOf MediaStreamHelpers
   * @fires ON_INCOMING_STREAM
   * @fires PEER_UPDATED
   * @private
   */
  const onRemoteTrackAdded = (stream, currentRoomState, targetMid, isScreensharing, isVideo, isAudio) => {
    const { user, hasMCU, room } = currentRoomState;
    const dispatchOnIncomingStream = (detail) => { dispatchEvent(onIncomingStream(detail)); };
    const dispatchOnIncomingScreenStream = (detail) => {
      dispatchEvent(onIncomingScreenStream(detail));
    };
    const methods = { dispatchOnIncomingStream, dispatchOnIncomingScreenStream };
    const dispatch = { methodName: isScreensharing ? 'dispatchOnIncomingScreenStream' : 'dispatchOnIncomingStream' };
    const detail = {
      stream,
      peerId: targetMid,
      room: Room.getRoomInfo(room.id),
      isSelf: hasMCU ? (targetMid === user.sid || false) : false,
      peerInfo: PeerData.getPeerInfo(targetMid, room),
      streamId: stream.id,
      isVideo,
      isAudio,
    };

    methods[dispatch.methodName](detail);

    dispatchEvent(peerUpdated({
      peerId: targetMid,
      peerInfo: PeerData.getPeerInfo(targetMid, room),
      isSelf: hasMCU ? (targetMid === user.sid || false) : false,
      room,
    }));
  };

  /* eslint-disable consistent-return */

  /**
   *
   * @param {Error} error - The error object.
   * @param {Function} reject - Reject function from promise.
   * @param {String} roomKey - The room rid.
   * @param {JSON} audioSettings - The audio media options.
   * @param {JSON} videoSettings - The video media options.
   * @param {object} resolve - The resolved promise.
   * @return {Promise<MediaStream | never>}
   * @memberOf MediaStreamHelpers
   * @fires MEDIA_ACCESS_ERROR
   * @fires MEDIA_ACCESS_FALLBACK
   */
  const onStreamAccessError = (error, reject, resolve, roomKey, audioSettings, videoSettings) => {
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(roomKey);
    const { audioFallback } = initOptions;

    if (audioSettings.settings.audio && videoSettings.settings.video && audioFallback) {
      const isAudioFallback = true;
      logger.log.DEBUG([state.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.START_FALLBACK]);
      dispatchEvent(mediaAccessFallback({
        error,
        state: MEDIA_ACCESS_FALLBACK_STATE.FALLBACKING,
        isAudioFallback,
      }));

      return window.navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const streams = helpers$7.onStreamAccessSuccess(roomKey, stream, audioSettings, videoSettings, isAudioFallback);
          resolve(streams);
        })
        .catch((fallbackError) => {
          logger.log.ERROR([state.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.FALLBACK, fallbackError]);
          dispatchEvent(mediaAccessError({
            error: fallbackError,
            isAudioFallbackError: true,
          }));
          dispatchEvent(mediaAccessFallback({
            error,
            state: MEDIA_ACCESS_FALLBACK_STATE.ERROR,
            isAudioFallback,
          }));

          reject(fallbackError);
        });
    }

    logger.log.ERROR([state.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.GET_USER_MEDIA], error);
    dispatchEvent(mediaAccessError({
      error,
      isAudioFallbackError: false,
    }));

    reject(error);
  };

  const dispatchEvents$1 = (roomState) => {
    const { user, room } = roomState;
    const isSelf = true;
    const peerId = user.sid;
    const peerInfo = PeerData.getCurrentSessionInfo(room);

    dispatchEvent(peerUpdated({
      isSelf,
      peerId,
      peerInfo,
    }));
  };

  const restartFn = (roomState, streams, resolve, reject) => {
    const { peerConnections, hasMCU } = roomState;

    try {
      dispatchEvents$1(roomState);

      if (Object.keys(peerConnections).length > 0 || hasMCU) {
        const refreshPeerConnectionPromise = PeerConnection.refreshPeerConnection(Object.keys(peerConnections), roomState, false, {});

        refreshPeerConnectionPromise.then(() => {
          resolve(streams);
        }).catch((error) => {
          logger.log.ERROR(MESSAGES.PEER_CONNECTION.REFRESH_CONNECTION.FAILED);
          reject(error);
        });
      } else {
        logger.log.WARN(MESSAGES.ROOM.ERRORS.NO_PEERS);
        resolve(streams);
      }
    } catch (error) {
      logger.log.ERROR(error);
    }
  };

  const processMediaOptions = (roomState, stream, resolve, reject) => {
    const getUserMediaPromise = MediaStream.getUserMedia(roomState, stream);

    return getUserMediaPromise.then((userMediaStreams) => {
      restartFn(roomState, userMediaStreams, resolve, reject);
    }).catch((error) => {
      reject(error);
    });
  };

  const processMediaStream = (roomState, stream, resolve, reject) => {
    const usePrefetchedStreamPromise = MediaStream.usePrefetchedStream(roomState.room.id, stream);

    return usePrefetchedStreamPromise.then((prefetchedStreams) => {
      restartFn(roomState, prefetchedStreams, resolve, reject);
    }).catch((error) => {
      reject(error);
    });
  };

  const processMediaStreamArray = (roomState, streams, resolve, reject) => {
    const usePrefetchedStreamsPromises = [];

    streams.forEach((stream) => {
      usePrefetchedStreamsPromises.push(MediaStream.usePrefetchedStream(roomState.room.id, stream));
    });

    return Promise.all(usePrefetchedStreamsPromises)
      .then((results) => {
        restartFn(roomState, results, resolve, reject);
      })
      .catch((error) => {
        reject(error);
      });
  };

  /**
   * Function that sends a MediaStream if provided or gets and sends an new getUserMedia stream.
   * @param {SkylinkState} roomState
   * @param {MediaStream|Object} options
   * @memberOf MediaStreamHelpers
   * @fires ON_INCOMING_STREAM
   * @fires PEER_UPDATED
   */
  // eslint-disable-next-line consistent-return
  const sendStream = (roomState, options = null) => new Promise((resolve, reject) => {
    if (!roomState) {
      return reject(new Error(MESSAGES.ROOM_STATE.NO_ROOM_NAME));
    }

    const { room } = roomState;
    const isNotObjOrNull = (!isAObj(options) || options === null);

    if (!room.inRoom) {
      logger.log.WARN(MESSAGES.ROOM.ERRORS.NOT_IN_ROOM);
      return reject(new Error(`${MESSAGES.ROOM.ERRORS.NOT_IN_ROOM}`));
    }

    if (isNotObjOrNull) {
      return reject(new Error(`${MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GUM_OPTIONS} ${options}`));
    }

    let isTypeStream = false;

    try {
      if (Array.isArray(options)) {
        let isArrayOfTypeStream = true;
        options.forEach((item) => {
          if (!isAFunction(item.getAudioTracks) || !isAFunction(item.getVideoTracks)) {
            isArrayOfTypeStream = false;
          }
        });

        if (!isArrayOfTypeStream) {
          return reject(new Error(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_MEDIA_STREAM_ARRAY));
        }

        return processMediaStreamArray(roomState, options, resolve, reject);
      }

      isTypeStream = options ? (isAFunction(options.getAudioTracks) || isAFunction(options.getVideoTracks)) : false;
      if (isTypeStream) {
        return processMediaStream(roomState, options, resolve, reject);
      }

      return processMediaOptions(roomState, options, resolve, reject);
    } catch (error) {
      logger.log.ERROR(MESSAGES.MEDIA_STREAM.ERRORS.SEND_STREAM, error);
    }
  });

  const getOutputSources = (sources) => {
    const outputSources = {
      audio: {
        input: [],
        output: [],
      },
      video: {
        input: [],
      },
    };

    sources.forEach((sourceItem) => {
      const item = {
        deviceId: sourceItem.deviceId || sourceItem.sourceId || 'default',
        label: sourceItem.label,
        groupId: sourceItem.groupId || null,
      };

      item.label = item.label || `Source for ${item.deviceId}`;

      if (['audio', 'audioinput'].indexOf(sourceItem.kind) > -1) {
        outputSources.audio.input.push(item);
      } else if (['video', 'videoinput'].indexOf(sourceItem.kind) > -1) {
        outputSources.video.input.push(item);
      } else if (sourceItem.kind === 'audiooutput') {
        outputSources.audio.output.push(item);
      }
    });

    return outputSources;
  };

  /**
   * Function that returns the camera and microphone sources.
   * @return {Promise}
   * @return {Object} outputSources
   * @return {Object} outputSources.audio The list of audio input (microphone) and output (speakers) sources.
   * @return {Array} outputSources.audio.input The list of audio input (microphone) sources.
   * @return {Object} outputSources.audio.input.#index The audio input source item.
   * @return {String} outputSources.audio.input.#index.deviceId The audio input source item device ID.
   * @return {String} outputSources.audio.input.#index.label The audio input source item device label name.
   * @return {String} [outputSources.audio.input.#index.groupId] The audio input source item device physical device ID.
   * <small>Note that there can be different <code>deviceId</code> due to differing sources but can share a
   * <code>groupId</code> because it's the same device.</small>
   * @return {Array} outputSources.audio.output The list of audio output (speakers) sources.
   * @return {Object} outputSources.audio.output.#index The audio output source item.
   * <small>Object signature matches <code>outputSources.audio.input.#index</code> format.</small>
   * @return {Object} outputSources.video The list of video input (camera) sources.
   * @return {Array} outputSources.video.input The list of video input (camera) sources.
   * @return {Object} outputSources.video.input.#index The video input source item.
   * <small>Object signature matches <code>callback.success.audio.input.#index</code> format.</small>
   * @memberOf MediaStreamHelpers
   */
  const getStreamSources = () => {
    const { navigator } = window;

    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && isAFunction(navigator.mediaDevices.enumerateDevices)) {
        navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            resolve(getOutputSources(devices));
          });
      } else {
        reject(getOutputSources([]));
      }
    });
  };

  const buildPeerStreamList = (state, peerId, peerStreams) => {
    const peerStreamList = {};
    peerStreamList.streams = {
      video: null,
      audio: null,
      screenShare: null,
    };
    Object.keys(peerStreams[peerId]).forEach((streamId) => {
      if (hasAudioTrack(peerStreams[peerId][streamId])) {
        peerStreamList.streams.audio = peerStreamList.streams.audio || {};
        peerStreamList.streams.audio[streamId] = peerStreams[peerId][streamId];
      } else if (hasVideoTrack(peerStreams[peerId][streamId]) && PeerMedia.retrieveScreenMediaInfo(state.room, peerId, { streamId })) {
        peerStreamList.streams.screenShare = peerStreamList.streams.screenShare || {};
        peerStreamList.streams.screenShare[streamId] = peerStreams[peerId][streamId];
      } else {
        peerStreamList.streams.video = peerStreamList.streams.video || {};
        peerStreamList.streams.video[streamId] = peerStreams[peerId][streamId];
      }
    });
    return peerStreamList;
  };

  /**
   * @description Function that gets the list of connected Peers Streams in the Room.
   * @param {SkylinkState} roomState
   * @param {boolean} [includeSelf=true] - The flag if self streams are included.
   * @return {Object}
   * @memberOf PeerDataHelpers
   */
  const getStreams = (roomState, includeSelf = true) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { peerStreams, user } = state;
    const streamList = {};
    const peerIds = Object.keys(peerStreams);

    for (let i = 0; i < peerIds.length; i += 1) {
      const peerId = peerIds[i];
      if (includeSelf && peerId === user.sid) {
        streamList[peerId] = buildPeerStreamList(state, peerId, peerStreams);
        streamList[peerId].isSelf = true;
      } else if (peerId !== user.sid) {
        streamList[peerId] = buildPeerStreamList(state, peerId, peerStreams);
      }
    }

    return streamList;
  };

  /* eslint-disable no-nested-ternary */

  const updateStreamsMediaStatus = (roomKey, settings, stream) => {
    const updatedState = Skylink.getSkylinkState(roomKey);
    const { room, streamsMediaStatus } = updatedState;
    const { mutedSettings: { shouldAudioMuted, shouldVideoMuted }, settings: { audio, video } } = settings;

    streamsMediaStatus[stream.id] = {};
    streamsMediaStatus[stream.id].audioMuted = audio ? (shouldAudioMuted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE) : MEDIA_STATUS.UNAVAILABLE;
    streamsMediaStatus[stream.id].videoMuted = video ? (shouldVideoMuted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE) : MEDIA_STATUS.UNAVAILABLE;

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const splitAudioAndVideoStream = (stream) => {
    const { MediaStream } = window;
    const streams = [];
    const audioTracks = stream.getAudioTracks();
    const videoTracks = stream.getVideoTracks();

    if (hasAudioTrack(stream)) {
      streams.push(new MediaStream(audioTracks));
    } else {
      streams.push(null);
    }

    if (hasVideoTrack(stream)) {
      streams.push(new MediaStream(videoTracks));
    } else {
      streams.push(null);
    }

    return streams;
  };

  const updateStreamsMutedSettings$1 = (roomKey, settings, stream) => {
    const updatedState = Skylink.getSkylinkState(roomKey);
    const { room, streamsMutedSettings } = updatedState;
    const { audio, video } = settings.settings;

    streamsMutedSettings[stream.id] = {};
    streamsMutedSettings[stream.id].audioMuted = !audio;
    streamsMutedSettings[stream.id].videoMuted = !video;

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const onStreamAccessSuccess = (roomKey, ogStream, audioSettings, videoSettings, isAudioFallback, isScreensharing = false, isPrefetchedStream) => {
    const streams = isScreensharing ? [ogStream] : helpers$7.splitAudioAndVideoStream(ogStream);
    const state = Skylink.getSkylinkState(roomKey);
    const { room, user } = state;

    streams.forEach((stream) => {
      if (!stream) return;
      PeerStream.addStream(user.sid, stream, roomKey);
      MediaStream.buildStreamSettings(room, stream, hasAudioTrack(stream) ? audioSettings : videoSettings);
      helpers$7.updateStreamsMutedSettings(room.id, hasAudioTrack(stream) ? audioSettings : videoSettings, stream);
      helpers$7.updateStreamsMediaStatus(room.id, hasAudioTrack(stream) ? audioSettings : videoSettings, stream);
      PeerMedia.processPeerMedia(room, user.sid, stream, isScreensharing);
      if (user.sid !== null) { // do not send stats when inRoom has not been received
        new HandleUserMediaStats().send(room.id);
      }

      if (isAudioFallback) {
        logger.log.DEBUG([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.FALLBACK_SUCCESS]);
      }

      if (isScreensharing) {
        logger.log.DEBUG([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.START_SCREEN_SUCCESS]);
        PeerStream.dispatchStreamEvent(ON_INCOMING_SCREEN_STREAM, {
          stream,
          peerId: user.sid,
          room: Room.getRoomInfo(room.id),
          isSelf: true,
          peerInfo: PeerData.getCurrentSessionInfo(room),
          streamId: stream.id,
          isVideo: stream.getVideoTracks().length > 0,
          isAudio: stream.getAudioTracks().length > 0,
        });
      } else if (user.sid) {
        // used.sid is null before inRoom message from sig
        PeerStream.dispatchStreamEvent(ON_INCOMING_STREAM, {
          stream,
          peerId: user.sid,
          room: Room.getRoomInfo(room.id),
          isSelf: true,
          peerInfo: PeerData.getCurrentSessionInfo(room),
          streamId: stream.id,
          isVideo: stream.getVideoTracks().length > 0,
          isAudio: stream.getAudioTracks().length > 0,
        });
      }

      if (!isPrefetchedStream) {
        dispatchEvent(mediaAccessSuccess({
          stream,
          isScreensharing,
          isAudioFallback,
          streamId: stream.id,
          isAudio: hasAudioTrack(stream),
          isVideo: hasVideoTrack(stream),
        }));
      }
    });

    return streams;
  };

  const buildStreamSettings = (room, stream, settings) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    updatedState.streamsSettings[stream.id] = {
      settings: settings.settings,
      constraints: settings.getUserMediaSettings,
    };

    Skylink.setSkylinkState(updatedState, room.id);
  };

  /**
   * @namespace MediaStreamHelpers
   * @description All helper and utility functions for <code>{@link MediaStream}</code> class are listed here.
   * @private
   * @type {{parseMediaOptions, parseStreamSettings, prepMediaAccessRequest, addLocalMediaStreams, onRemoteTrackAdded, onStreamAccessError, buildPeerStreamsInfo, muteStreams, getStreamSources, sendStream, getStreams, updateStreamsMediaStatus, splitAudioAndVideoStream, updateStreamsMutedSettings, onStreamAccessSuccess, buildStreamSettings}}
   */
  const helpers$7 = {
    parseMediaOptions,
    parseStreamSettings,
    prepMediaAccessRequest,
    addLocalMediaStreams,
    onRemoteTrackAdded,
    onStreamAccessError,
    muteStreams,
    sendStream,
    getStreamSources,
    getStreams,
    updateStreamsMediaStatus,
    splitAudioAndVideoStream,
    updateStreamsMutedSettings: updateStreamsMutedSettings$1,
    onStreamAccessSuccess,
    buildStreamSettings,
  };

  /**
   * @namespace UtilHelpers
   * @description Util helper functions
   * @private
   */

  /**
   * Function that tests if an object is empty.
   * @param {Object} obj
   * @return {boolean}
   * @memberOf UtilHelpers
   */
  const isEmptyObj = (obj) => {
    const keys = Object.keys(obj);
    return keys.length === 0;
  };

  /**
   * Function that tests if an array is empty.
   * @param {Array} array
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isEmptyArray = array => array.length === 0;

  /**
   * Function that tests if a string is an empty string.
   * @param string
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isEmptyString = string => string === '';

  /**
   * Function that tests if type is 'Object'.
   * @param {*} param
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isAObj = param => typeof param === 'object' && param !== null;

  /**
   * Function that tests if type is 'Null'.
   * @param {*} param
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isNull = param => typeof param === 'object' && param == null;

  /**
   * Function that tests if type is 'Number'.
   * @param {*} param
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isANumber = param => typeof param === 'number';

  /**
   * Function that tests if type is 'Function'.
   * @param {*} param
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isAFunction = param => typeof param === 'function';

  /**
   * Function that tests if type is 'Boolean'.
   * @param {Object|boolean}
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isABoolean = obj => typeof obj !== 'undefined' && typeof obj === 'boolean';

  /**
   * Function that tests if type is 'String'.
   * @param {*} param
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isAString = param => typeof param === 'string';

  /**
   * Function that tests if a param is null, undefined or a string.
   * @param param
   * @param paramName
   * @param methodName
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const getParamValidity = (param, paramName, methodName) => {
    let proceed = true;
    if (param === null || typeof param === 'undefined' || !isAString(param)) {
      logger.log.ERROR(`${methodName}: ${paramName} is null, undefined or not a string.`);
      proceed = false;
    }
    return proceed;
  };

  /**
   * Function that returns the Skylink state.
   * @param {SkylinkRoom.id} rid
   * @returns {SkylinkState|null} state
   * @memberOf UtilHelpers
   */
  const getStateByRid = (rid) => {
    const proceed = getParamValidity(rid, 'roomId', 'getStateByRid');
    if (proceed) {
      const states = Skylink.getSkylinkState();
      const roomKeys = Object.keys(states);
      let roomState = null;
      for (let i = 0; i < roomKeys.length; i += 1) {
        const key = roomKeys[i];
        if (key === rid) {
          roomState = states[key];
          break;
        }
      }
      return roomState;
    }
    logger.log.ERROR(`getRoomStateByRid: ${MESSAGES.ROOM_STATE.NOT_FOUND} - ${rid}`);
    return null;
  };

  /**
   * Function that returns the Skylink state.
   * @param {String} roomkey - The room key.
   * @returns {SkylinkState}
   * @memberOf UtilHelpers
   */
  const getStateByKey = roomkey => getStateByRid(roomkey);

  /**
   * Function that returns the room state.
   * @param {String} roomName - The room name.
   * @returns {SkylinkState|null} - The room state.
   * @memberOf UtilHelpers
   */
  const getRoomStateByName = (roomName) => {
    const proceed = getParamValidity(roomName, 'roomName', 'getRoomStateByName');
    let matchedRoomState = null;
    if (proceed) {
      const state = Skylink.getSkylinkState();
      const roomKeys = Object.keys(state);
      for (let i = 0; i < roomKeys.length; i += 1) {
        const roomState = state[roomKeys[i]];
        if (roomState.room.roomName.toLowerCase() === roomName.toLowerCase()) {
          matchedRoomState = roomState;
          break;
        }
      }
    }
    if (!matchedRoomState) {
      logger.log.ERROR(`getRoomStateByName: ${MESSAGES.ROOM_STATE.NOT_FOUND} - ${roomName}`);
    }
    return matchedRoomState;
  };

  /**
   * Disconnects from the signaling server.
   * @memberOf UtilHelpers
   */
  const disconnect = () => {
    try {
      new SkylinkSignalingServer().socket.disconnect();
    } catch (error) {
      logger.log.ERROR(error);
    }
  };

  /**
   * Function that generates an <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier">UUID</a> (Unique ID).
   * @returns {String} Returns a generated UUID (Unique ID).
   * @memberOf UtilHelpers
   */
  const generateUUID = () => {
    /* eslint-disable no-bitwise */
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r && 0x7 | 0x8)).toString(16);
    });
    return uuid;
  };

  /**
   * Function that returns the getUserMedia stream when the user had not joined a room (is stateless)
   * @param {Object} options
   * @returns {Promise}
   * @memberOf UtilHelpers
   */
  const statelessGetUserMedia = options => new Promise((resolve, reject) => {
    const { navigator } = window;
    if (!options || !isAObj(options)) {
      reject(new Error(`${MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GUM_OPTIONS} ${options}`));
    }

    navigator.mediaDevices.getUserMedia(options).then((stream) => {
      const streams = helpers$7.splitAudioAndVideoStream(stream);
      resolve(streams);
    }).catch((error) => {
      reject(error);
    });
  });

  /**
   * Function that always returns are rejected Promise.
   * @param {String} errorMsg
   * @returns {Promise}
   * @memberOf UtilHelpers
   */
  const rejectPromise = errorMsg => new Promise((resolve, reject) => {
    reject(new Error(errorMsg));
  });

  /**
   * Function that checks if the peerId exists on the peerConnection
   * @param {SkylinkRoom} room
   * @param {String} peerId
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isValidPeerId = (room, peerId) => {
    const state = Skylink.getSkylinkState(room.id);

    const { peerConnections } = state;
    const peerIds = Object.keys(peerConnections);

    let isValid = false;
    peerIds.forEach((validPeerId) => {
      if (validPeerId === peerId) {
        isValid = true;
      }
    });

    return isValid;
  };

  /**
   * Function that checks if a media stream has an audio track.
   * @param {MediaStream} stream
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const hasAudioTrack = stream => stream.getAudioTracks().length > 0;

  /**
   * Function that checks if a media stream has a video track.
   * @param {MediaStream} stream
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const hasVideoTrack = stream => stream.getVideoTracks().length > 0;

  /**
   * Function that checks the browser agent.
   * @param {String} agent
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isAgent = (agent) => {
    const { AdapterJS } = window;
    switch (agent) {
      case BROWSER_AGENT.CHROME:
        return AdapterJS.webrtcDetectedBrowser === BROWSER_AGENT.CHROME;
      case BROWSER_AGENT.SAFARI:
        return AdapterJS.webrtcDetectedBrowser === BROWSER_AGENT.SAFARI;
      case BROWSER_AGENT.FIREFOX:
        return AdapterJS.webrtcDetectedBrowser === BROWSER_AGENT.FIREFOX;
      case BROWSER_AGENT.REACT_NATIVE:
        return AdapterJS.webrtcDetectedBrowser === BROWSER_AGENT.REACT_NATIVE;
      default:
        logger.log.DEBUG(MESSAGES.UTILS.INVALID_BROWSER_AGENT);
        return false;
    }
  };

  /**
   * Function that parses UNIX timestamp and returns timestamp in ISO string.
   * @param timestamp
   * @returns {string}
   * @memberOf UtilHelpers
   */
  const parseUNIXTimeStamp = timestamp => new Date(timestamp).toISOString();

  /**
   * Function that generates a timestamp in ISO string format.
   * @returns {string}
   * @memberOf UtilHelpers
   */
  const generateISOStringTimesStamp = () => new Date().toISOString();

  const getSDPCommonSupports = (targetMid, sessionDescription = null, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const offer = { audio: false, video: false };
    const { currentCodecSupport, peerInformations } = state;
    const { beSilentOnParseLogs } = Skylink.getInitOptions();

    if (!targetMid || !(sessionDescription && sessionDescription.sdp)) {
      offer.video = !!(currentCodecSupport.video.h264 || currentCodecSupport.video.vp8);
      offer.audio = !!currentCodecSupport.audio.opus;

      if (targetMid) {
        const peerAgent = ((peerInformations[targetMid] || {}).agent || {}).name || '';

        if (isAgent(peerAgent)) {
          offer.video = Object.keys(currentCodecSupport.video).length > 0;
          offer.audio = Object.keys(currentCodecSupport.audio).length > 0;
        }
      }
      return offer;
    }

    const remoteCodecs = helpers$8.getSDPCodecsSupport(targetMid, sessionDescription, beSilentOnParseLogs);
    const localCodecs = currentCodecSupport;

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-prototype-builtins */
    for (const ac in localCodecs.audio) {
      if (localCodecs.audio.hasOwnProperty(ac) && localCodecs.audio[ac] && remoteCodecs.audio[ac]) {
        offer.audio = true;
        break;
      }
    }

    for (const vc in localCodecs.video) {
      if (localCodecs.video.hasOwnProperty(vc) && localCodecs.video[vc] && remoteCodecs.video[vc]) {
        offer.video = true;
        break;
      }
    }

    return offer;
  };

  const getSDPCodecsSupport = (targetMid, sessionDescription, beSilentOnParseLogs) => {
    const codecs = { audio: {}, video: {} };

    if (!(sessionDescription && sessionDescription.sdp)) {
      return codecs;
    }

    const sdpLines = sessionDescription.sdp.split('\r\n');
    let mediaType = '';

    for (let i = 0; i < sdpLines.length; i += 1) {
      /* eslint-disable prefer-destructuring */
      /* eslint-disable no-continue */
      if (sdpLines[i].indexOf('m=') === 0) {
        mediaType = (sdpLines[i].split('m=')[1] || '').split(' ')[0];
        continue;
      }

      if (sdpLines[i].indexOf('a=rtpmap:') === 0) {
        const parts = (sdpLines[i].split(' ')[1] || '').split('/');
        const codec = (parts[0] || '').toLowerCase();
        const info = parts[1] + (parts[2] ? `/${parts[2]}` : '');

        if (['ulpfec', 'red', 'telephone-event', 'cn', 'rtx'].indexOf(codec) > -1) {
          continue;
        }

        codecs[mediaType][codec] = codecs[mediaType][codec] || [];

        if (codecs[mediaType][codec].indexOf(info) === -1) {
          codecs[mediaType][codec].push(info);
        }
      }
    }

    if (!beSilentOnParseLogs) {
      logger.log.INFO([targetMid || null, 'RTCSessionDescription', sessionDescription.type, 'Parsed codecs support ->'], codecs);
    }

    return codecs;
  };

  const getCodecsSupport = roomKey => new Promise((resolve, reject) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { beSilentOnParseLogs } = Skylink.getInitOptions();
    const updatedState = state;
    const { RTCPeerConnection } = window;

    if (state.currentCodecSupport) {
      resolve(state.currentCodecSupport);
    }

    updatedState.currentCodecSupport = { audio: {}, video: {} };

    // Safari 11 REQUIRES a stream first before connection works, hence let's spoof it for now
    if (isAgent(BROWSER_AGENT.SAFARI)) {
      updatedState.currentCodecSupport.audio = {
        opus: ['48000/2'],
      };
      updatedState.currentCodecSupport.video = {
        h264: ['48000'],
      };
      resolve(updatedState.currentCodecSupport);
    }

    try {
      const pc = new RTCPeerConnection(null);
      let offerConstraints = {};
      if (pc.addTransceiver) {
        pc.addTransceiver(TRACK_KIND.VIDEO);
        pc.addTransceiver(TRACK_KIND.AUDIO);
      } else {
        offerConstraints = {
          mandatory: {
            OfferToReceiveVideo: true,
            OfferToReceiveAudio: true,
          },
        };
      }

      pc.createOffer(offerConstraints)
        .then((offer) => {
          updatedState.currentCodecSupport = SessionDescription.getSDPCodecsSupport(null, offer, beSilentOnParseLogs);
          resolve(updatedState.currentCodecSupport);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });

  /* eslint-disable prefer-template */

  const parseFn = (targetMid, sdpLines, sdpType, mediaType, bw) => {
    const mLineType = mediaType === 'data' ? 'application' : mediaType;
    let mLineIndex = -1;
    let cLineIndex = -1;

    for (let i = 0; i < sdpLines.length; i += 1) {
      if (sdpLines[i].indexOf('m=' + mLineType) === 0) {
        mLineIndex = i;
      } else if (mLineIndex > 0) {
        if (sdpLines[i].indexOf('m=') === 0) {
          break;
        }

        if (sdpLines[i].indexOf('c=') === 0) {
          cLineIndex = i;
          // Remove previous b:AS settings
        } else if (sdpLines[i].indexOf('b=AS:') === 0 || sdpLines[i].indexOf('b:TIAS:') === 0) {
          sdpLines.splice(i, 1);
          i -= 1;
        }
      }
    }

    if (!(typeof bw === 'number' && bw > 0)) {
      logger.log.WARN([targetMid, 'RTCSessionDesription', sdpType, `Not limiting ${mediaType} bandwidth`]);
      return;
    }

    if (mLineIndex === -1 || cLineIndex === -1) {
      // Missing c-line means no media of specified type is being sent
      logger.log.WARN([targetMid, 'RTCSessionDesription', sdpType, `Not limiting ${mediaType} bandwidth as ${mediaType} is not being sent`]);
      return;
    }

    // Follow RFC 4566, that the b-line should follow after c-line.
    logger.log.INFO([targetMid, 'RTCSessionDesription', sdpType, `Limiting maximum sending ${mediaType} bandwidth ->`], bw);
    sdpLines.splice(cLineIndex + 1, 0, window.webrtcDetectedBrowser === 'firefox' ? 'b=TIAS:' + (bw * 1000).toFixed(0) : 'b=AS:' + bw);
  };

  // alternative to munging is to implement RTCRtpSender.setParameters()
  const setSDPBitrate = (targetMid, sessionDescription, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const sdpLines = sessionDescription.sdp.split('\r\n');
    const sdpType = sessionDescription.type;
    let bASAudioBw;
    let bASVideoBw;
    let bASDataBw;
    const peerCustomSettings = PeerData.getPeersCustomSettings(state);

    // Apply local peer bandwidth settings if configured
    if (state.streamsBandwidthSettings.bAS) {
      bASAudioBw = state.streamsBandwidthSettings.bAS.audio;
      bASVideoBw = state.streamsBandwidthSettings.bAS.video;
      bASDataBw = state.streamsBandwidthSettings.bAS.data;
    } else if (peerCustomSettings[targetMid] && peerCustomSettings[targetMid].maxBandwidth
    && typeof peerCustomSettings[targetMid].maxBandwidth === 'object') { // else apply remote peer bandwidth settings
      if (typeof peerCustomSettings[targetMid].maxBandwidth.audio === 'number') {
        bASAudioBw = peerCustomSettings[targetMid].maxBandwidth.audio;
      }
      if (typeof peerCustomSettings[targetMid].maxBandwidth.video === 'number') {
        bASVideoBw = peerCustomSettings[targetMid].maxBandwidth.video;
      }
      if (typeof peerCustomSettings[targetMid].maxBandwidth.data === 'number') {
        bASDataBw = peerCustomSettings[targetMid].maxBandwidth.data;
      }
    }

    parseFn(targetMid, sdpLines, sdpType, 'audio', bASAudioBw);
    parseFn(targetMid, sdpLines, sdpType, 'video', bASVideoBw);
    parseFn(targetMid, sdpLines, sdpType, 'data', bASDataBw);

    return sdpLines.join('\r\n');
  };

  const getSDPICECandidates = (targetMid, sessionDescription, beSilentOnParseLogs) => {
    const { RTCIceCandidate } = window;
    const candidates = {
      host: [],
      srflx: [],
      relay: [],
    };

    if (!(sessionDescription && sessionDescription.sdp)) {
      return candidates;
    }

    sessionDescription.sdp.split('m=').forEach((mediaItem, index) => {
      // Ignore the v=0 lines etc..
      if (index === 0) {
        return;
      }

      // Remove a=mid: and \r\n
      const sdpMid = ((mediaItem.match(/a=mid:.*\r\n/gi) || [])[0] || '').replace(/a=mid:/gi, '').replace(/\r\n/, '');
      const sdpMLineIndex = index - 1;

      (mediaItem.match(/a=candidate:.*\r\n/gi) || []).forEach((item) => {
        // Remove \r\n for candidate type being set at the end of candidate DOM string.
        const canType = (item.split(' ')[7] || 'host').replace(/\r\n/g, '');
        candidates[canType] = candidates[canType] || [];
        candidates[canType].push(new RTCIceCandidate({
          sdpMid,
          sdpMLineIndex,
          // Remove initial "a=" in a=candidate
          candidate: (item.split('a=')[1] || '').replace(/\r\n/g, ''),
        }));
      });
    });

    if (!beSilentOnParseLogs) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type,
        'Parsing session description ICE candidates ->'], candidates);
    }

    return candidates;
  };

  /* eslint-disable prefer-destructuring,no-continue */

  const getSDPSelectedCodec = (targetMid, sessionDescription, type, beSilentOnParseLogs) => {
    const codecInfo = {
      name: null,
      implementation: null,
      clockRate: null,
      channels: null,
      payloadType: null,
      params: null,
    };

    if (!(sessionDescription && sessionDescription.sdp)) {
      return codecInfo;
    }

    sessionDescription.sdp.split('m=').forEach((mediaItem, index) => {
      if (index === 0 || mediaItem.indexOf(`${type} `) !== 0) {
        return;
      }

      const codecs = (mediaItem.split('\r\n')[0] || '').split(' ');
      // Remove audio[0] 65266[1] UDP/TLS/RTP/SAVPF[2]
      codecs.splice(0, 3);

      for (let i = 0; i < codecs.length; i += 1) {
        const match = mediaItem.match(new RegExp(`a=rtpmap:${codecs[i]}.*\r\n`, 'gi'));

        if (!match) {
          continue;
        }

        // Format: codec/clockRate/channels
        const parts = ((match[0] || '').replace(/\r\n/g, '').split(' ')[1] || '').split('/');

        // Ignore rtcp codecs, dtmf or comfort noise
        if (['red', 'ulpfec', 'telephone-event', 'cn', 'rtx'].indexOf(parts[0].toLowerCase()) > -1) {
          continue;
        }

        codecInfo.name = parts[0];
        codecInfo.clockRate = parseInt(parts[1], 10) || 0;
        codecInfo.channels = parseInt(parts[2] || '1', 10) || 1;
        codecInfo.payloadType = parseInt(codecs[i], 10);
        codecInfo.params = '';

        // Get the list of codec parameters
        const params = mediaItem.match(new RegExp(`a=fmtp:${codecs[i]}.*\r\n`, 'gi')) || [];
        params.forEach((paramItem) => {
          codecInfo.params += paramItem.replace(new RegExp(`a=fmtp:${codecs[i]}`, 'gi'), '').replace(/ /g, '').replace(/\r\n/g, '');
        });
        break;
      }
    });

    if (!beSilentOnParseLogs) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type,
        `Parsing session description "${type}" codecs ->`], codecInfo);
    }

    return codecInfo;
  };

  /* eslint-disable prefer-destructuring */

  const getTransceiverMid = (sessionDescription, beSilentOnParseLogs) => {
    const results = {
      audio: [],
      video: [],
    };

    sessionDescription.sdp.split('m=').forEach((mediaItem, index) => {
      const msidLines = mediaItem.split(/\n/);
      const mediaType = msidLines[0].split(' ')[0];
      if (mediaType === 'application' || index === 0) {
        return;
      }
      let parsedMline = {};
      for (let i = 0; i < msidLines.length; i += 1) {
        if (msidLines[i].match(/a=recvonly|a=sendonly|a=sendrecv|a=inactive/)) {
          const array = msidLines[i].split('=');
          parsedMline.direction = array[1].trim();
        }

        if (msidLines[i].match(/a=mid:*/)) {
          parsedMline.transceiverMid = msidLines[i].split(/:/)[1].trim();
        }
        if (msidLines[i].match(/a=msid:([\w|-|{]+)/)) { // include '{' character for firefox sdp parsing
          const array = msidLines[i].split(' ');
          const firstItem = array[0].split(/:/)[1].trim();
          parsedMline.streamId = firstItem === '-' ? '' : firstItem;
          parsedMline.trackId = array[1].trim();
        }
        if (parsedMline.transceiverMid && parsedMline.streamId && parsedMline.trackId) {
          results[mediaType].push(parsedMline);
          parsedMline = {};
        }
      }
    });

    if (!beSilentOnParseLogs) {
      logger.log.INFO([null, 'RTCSessionDesription', sessionDescription.type,
        `Parsing session description "${sessionDescription.type}" transceivers ->`], results);
    }

    return results;
  };

  const helpers$8 = {
    getSDPCommonSupports,
    getSDPCodecsSupport,
    getCodecsSupport,
    setSDPBitrate,
    getSDPICECandidates,
    getSDPSelectedCodec,
    getTransceiverMid,
  };

  class SessionDescription {
    static getSDPCommonSupports(...args) {
      return helpers$8.getSDPCommonSupports(...args);
    }

    static getCodecsSupport(...args) {
      return helpers$8.getCodecsSupport(...args);
    }

    static setSDPBitrate(...args) {
      return helpers$8.setSDPBitrate(...args);
    }

    static getSDPCodecsSupport(...args) {
      return helpers$8.getSDPCodecsSupport(...args);
    }

    static getSDPICECandidates(...args) {
      return helpers$8.getSDPICECandidates(...args);
    }

    static getSDPSelectedCodec(...args) {
      return helpers$8.getSDPSelectedCodec(...args);
    }

    static getTransceiverMid(...args) {
      return helpers$8.getTransceiverMid(...args);
    }
  }

  /* eslint-disable prefer-destructuring */

  const formatCanTypeFn = (type) => {
    if (type === 'relay') {
      return 'relayed';
    } if (type === 'host' || type.indexOf('host') > -1) {
      return 'local';
    } if (type === 'srflx') {
      return 'serverreflexive';
    } if (type === 'prflx') {
      return 'peerreflexive';
    }
    return type;
  };

  /**
   * Function that parses the raw stats from the RTCIceCandidatePairStats dictionary.
   * @param {SkylinkState} roomState - The room state.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} type - Stats output report type.
   * @param {String} value - Stats output value.
   * @param {RTCPeerConnection} peerConnection - The peer connection.
   * @param {String} peerId - The peer Id.
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseSelectedCandidatePair = (roomState, output, type, value, peerConnection, peerId) => {
    const { peerStats } = roomState;
    const { raw, selectedCandidatePair } = output;

    const keys = Object.keys(output.raw);
    let transportStats = null;
    let selectedLocalCandidateId = null;
    let selectedRemoteCandidateId = null;

    if (isAgent(BROWSER_AGENT.CHROME)) {
      // selectedCandidatePairId can only be obtained from RTCTransportStats and is needed to identify selected candidate pair
      for (let i = 0; i < keys.length; i += 1) {
        if (raw[keys[i]].type === 'transport') {
          transportStats = raw[keys[i]];
        }
      }
    } else if (isAgent(BROWSER_AGENT.FIREFOX)) {
      // FF has not implemented RTCTransportStats report and uses .selected available in the  'candidate-pair' stats report
      transportStats = {};
    }

    if (transportStats) {
      for (let i = 0; i < keys.length; i += 1) {
        const statsReport = raw[keys[i]];
        if ((statsReport.type === 'candidate-pair' && statsReport.id === transportStats.selectedCandidatePairId) || (statsReport.type === 'candidate-pair' && statsReport.selected)) {
          const candidatePairStats = statsReport;
          selectedLocalCandidateId = candidatePairStats.localCandidateId;
          selectedRemoteCandidateId = candidatePairStats.remoteCandidateId;

          selectedCandidatePair.id = candidatePairStats.id;
          selectedCandidatePair.writable = candidatePairStats.writable;
          selectedCandidatePair.priority = candidatePairStats.priority;
          selectedCandidatePair.nominated = candidatePairStats.nominated;

          const prevStats = peerStats[peerId][statsReport.id];
          // FF has not implemented the following stats
          const totalRoundTripTime = parseInt(statsReport.totalRoundTripTime || '0', 10);
          selectedCandidatePair.totalRoundTripTime = totalRoundTripTime;
          selectedCandidatePair.roundTripTime = parsers$1.tabulateStats(prevStats, statsReport, 'totalRoundTripTime');

          const consentRequestsSent = parseInt(statsReport.consentRequestsSent || '0', 10);
          selectedCandidatePair.consentRequests.totalSent = consentRequestsSent;
          selectedCandidatePair.consentRequests.sent = parsers$1.tabulateStats(prevStats, statsReport, 'consentRequestsSent');

          const requestsReceived = parseInt(statsReport.requestsReceived || '0', 10);
          selectedCandidatePair.requests.totalReceived = requestsReceived;
          selectedCandidatePair.requests.received = parsers$1.tabulateStats(prevStats, statsReport, 'requestsReceived');

          const requestsSent = parseInt(statsReport.requestsSent || '0', 10);
          selectedCandidatePair.requests.totalSent = requestsSent;
          selectedCandidatePair.requests.sent = parsers$1.tabulateStats(prevStats, statsReport, 'requestsSent');

          const responsesSent = parseInt(statsReport.responsesSent || '0', 10);
          selectedCandidatePair.responses.totalSent = responsesSent;
          selectedCandidatePair.responses.sent = parsers$1.tabulateStats(prevStats, statsReport, 'responsesSent');

          const responsesReceived = parseInt(statsReport.responsesReceived || '0', 10);
          selectedCandidatePair.responses.totalReceived = responsesReceived;
          selectedCandidatePair.responses.received = parsers$1.tabulateStats(prevStats, statsReport, 'responsesReceived');
        }
      }
    }

    if (selectedLocalCandidateId && selectedRemoteCandidateId) {
      if (type === 'remote-candidate') {
        const remoteCandidateStats = value;
        if (remoteCandidateStats.id === selectedRemoteCandidateId) {
          // FF uses address instead of ip
          selectedCandidatePair.remote.ipAddress = remoteCandidateStats.ip ? remoteCandidateStats.ip : remoteCandidateStats.address;
          selectedCandidatePair.remote.portNumber = remoteCandidateStats.port;
          selectedCandidatePair.remote.transport = remoteCandidateStats.protocol;
          selectedCandidatePair.remote.priority = remoteCandidateStats.priority;
          selectedCandidatePair.remote.candidateType = formatCanTypeFn(remoteCandidateStats.candidateType);
        }
      }

      if (type === 'local-candidate') {
        const localCandidateStats = value;
        if (localCandidateStats.id === selectedLocalCandidateId) {
          selectedCandidatePair.local.ipAddress = localCandidateStats.ip ? localCandidateStats.ip : localCandidateStats.address;
          selectedCandidatePair.local.portNumber = localCandidateStats.port;
          selectedCandidatePair.local.transport = localCandidateStats.protocol;
          selectedCandidatePair.local.priority = localCandidateStats.priority;
          selectedCandidatePair.local.networkType = localCandidateStats.networkType;
          selectedCandidatePair.local.candidateType = formatCanTypeFn(localCandidateStats.candidateType);
        }
      }
    }
  };

  /**
   * Function that parses the raw stats from the RTCCertificateStats dictionary.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {Object} stats - Stats object.
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseCertificates = (output, stats) => {
    const { certificate, raw } = output;
    const keys = Object.keys(output.raw);
    let transportStats = null;

    for (let i = 0; i < keys.length; i += 1) {
      if (raw[keys[i]].type === 'transport') {
        transportStats = raw[keys[i]];
      }
    }

    if (transportStats) {
      certificate.srtpCipher = transportStats.srtpCipher;
      certificate.dtlsCipher = transportStats.dtlsCipher;
      certificate.tlsVersion = transportStats.tlsVersion;

      const { localCertificateId, remoteCertificateId } = transportStats;

      if (stats.id === localCertificateId) {
        certificate.local = {};
        certificate.local.base64Certificate = stats.base64Certificate;
        certificate.local.fingerprintAlgorithm = stats.fingerprintAlgorithm;
      } else if (stats.id === remoteCertificateId) {
        certificate.remote = {};
        certificate.remote.base64Certificate = stats.base64Certificate;
        certificate.remote.fingerprintAlgorithm = stats.fingerprintAlgorithm;
      }
    }
  };

  /**
   * Function that derives that stats value using the formula Total Current Value - Total Prev Value
   * @param {Object} prevStats - The stats object from the previous retrieval.
   * @param {Object} stats - The stats object.
   * @param {String} prop - Stats dictionary identifier.
   * @return {number}
   * @memberOf PeerConnectionStatisticsParsers
   * was _parseConnectionStats in 0.6.x
   */
  const tabulateStats = (prevStats = null, stats, prop) => {
    const nTime = stats.timestamp;
    const oTime = prevStats ? prevStats.timestamp || (new Date(stats.timestamp).getTime() - 20000) : (new Date(stats.timestamp).getTime() - 20000);
    const nVal = parseFloat(stats[prop] || '0', 10);
    let oVal = parseFloat(prevStats ? prevStats[prop] || '0' : '0', 10);

    if (nVal < oVal) {
      oVal = 0;
    }

    if ((new Date(nTime).getTime()) === (new Date(oTime).getTime())) {
      return nVal;
    }

    return parseFloat(((nVal - oVal) / (nTime - oTime) * 1000).toFixed(3) || '0', 10);
  };

  /**
   * @typedef {Object} audioStats - The Peer connection audio streaming statistics.
   * @property {JSON} audioStats.sending The Peer connection sending audio streaming statistics.
   * @property {number} audioStats.sending.bytes The Peer connection current sending audio streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {number} audioStats.sending.totalBytes The Peer connection total sending audio streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {number} audioStats.sending.packets The Peer connection current sending audio streaming packets.
   * @property {number} audioStats.sending.totalPackets The Peer connection total sending audio streaming packets.
   * @property {number} audioStats.sending.ssrc The Peer connection sending audio streaming RTP packets SSRC.
   * @property {number} audioStats.sending.roundTripTime The Peer connection sending audio streaming round-trip delay time.
   * @property {number} audioStats.sending.jitter The Peer connection sending audio streaming RTP packets jitter in seconds.
   * @property {number} audioStats.sending.retransmittedBytesSent The total number of bytes that were retransmitted for this SSRC, only including
   *   payload bytes. This is a subset of bytesSent.
   * @property {number} audioStats.sending.retransmittedPacketsSent The total number of packets that were retransmitted for this SSRC. This is a subset of packetsSent.
   * @property {JSON} [audioStats.sending.codec] - The Peer connection sending audio streaming selected codec information.
   *   Defined as <code>null</code> if local session description is not available before parsing.
   * @property {String} audioStats.sending.codec.name The Peer connection sending audio streaming selected codec name.
   * @property {number} audioStats.sending.codec.payloadType The Peer connection sending audio streaming selected codec payload type.
   * @property {String} [audioStats.sending.codec.implementation] - The Peer connection sending audio streaming selected codec implementation.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {number} [audioStats.sending.codec.channels] - The Peer connection sending audio streaming selected codec channels (2 for stereo).
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing,
   *   and this is usually present in <code>statistics.audio</code> property.
   * @property {number} [audioStats.sending.codec.clockRate] - The Peer connection sending audio streaming selected codec media sampling rate.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {String} [audioStats.sending.codec.params] - The Peer connection sending audio streaming selected codec parameters.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {number} [audioStats.sending.audioLevel] - The Peer connection audio level of the media source.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {number} [audioStats.sending.totalSamplesDuration] - The Peer connection sending audio total duration in seconds.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {number} [audioStats.sending.echoReturnLoss] - The Peer connection sending audio streaming echo return loss in db (decibels).
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {number} [audioStats.sending.echoReturnLossEnhancement] - The Peer connection sending audio streaming
   *   echo return loss enhancement db (decibels).
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {JSON} audioStats.receiving The Peer connection receiving audio streaming statistics.
   * @property {number} audioStats.receiving.bytes The Peer connection current sending audio streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {number} audioStats.receiving.totalBytes The Peer connection total sending audio streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {number} audioStats.receiving.packets The Peer connection current receiving audio streaming packets.
   * @property {number} audioStats.receiving.totalPackets The Peer connection total receiving audio streaming packets.
   * @property {number} audioStats.receiving.packetsLost The Peer connection current receiving audio streaming packets lost.
   * @property {number} audioStats.receiving.fractionLost The Peer connection current receiving audio streaming fraction packets lost.
   * @property {number} audioStats.receiving.totalPacketsLost The Peer connection total receiving audio streaming packets lost.
   * @property {number} audioStats.receiving.ssrc The Peer connection receiving audio streaming RTP packets SSRC.
   * @property {Number} audioStats.receiving.jitter The Peer connection receiving audio streaming RTP packets jitter in seconds.
   *   Defined as <code>0</code> if it's not present in original raw statistics before parsing.
   * @property {Number} audioStats.receiving.totalSamplesReceived The Peer connection total number of audio samples that
   * have been received.
   * @property {number} [audioStats.receiving.totalSamplesDuration] - The Peer connection receiving audio total duration in seconds.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {JSON} [audioStats.receiving.codec] - The Peer connection receiving audio streaming selected codec information.
   *   Defined as <code>null</code> if remote session description is not available before parsing.
   *   Note that if the value is polyfilled, the value may not be accurate since the remote Peer can override the selected codec.
   *   The value is derived from the remote session description.
   * @property {String} audioStats.receiving.codec.name The Peer connection receiving audio streaming selected codec name.
   * @property {Number} audioStats.receiving.codec.payloadType The Peer connection receiving audio streaming selected codec payload type.
   * @property {String} [audioStats.receiving.codec.implementation] - The Peer connection receiving audio streaming selected codec implementation.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {Number} [audioStats.receiving.codec.channels] - The Peer connection receiving audio streaming selected codec channels (2 for stereo).
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing,
   *   and this is usually present in <code>statistics.audio</code> property.
   * @property {Number} [audioStats.receiving.codec.clockRate] - The Peer connection receiving audio streaming selected codec media sampling rate.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {String} [audioStats.receiving.codec.params] - The Peer connection receiving audio streaming selected codec parameters.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   * @property {Number} [audioStats.receiving.audioLevel] - The Peer connection receiving audio streaming audio level.
   *   Defined as <code>null</code> if it's not available in original raw statistics.before parsing.
   */

  const parseReceiving = (output, value, prevStats) => {
    const parsedStats = output.audio.receiving;

    parsedStats.bytes = parsedStats.bytes || 0;
    if (value.bytesReceived) {
      const bytesReceived = parseInt(value.bytesReceived || '0', 10);
      parsedStats.totalBytes = bytesReceived;
      parsedStats.bytes += parsers$1.tabulateStats(prevStats, value, 'bytesReceived');
    }

    if (value.packetsReceived) {
      const packetsReceived = parseInt(value.packetsReceived || '0', 10);
      parsedStats.totalPackets = packetsReceived;
      parsedStats.packets = parsers$1.tabulateStats(prevStats, value, 'packetsReceived');
    }

    if (Number.isInteger(value.packetsLost)) {
      const packetsLost = parseInt(value.packetsLost || '0', 10);
      parsedStats.totalPacketsLost = packetsLost;
      parsedStats.packetsLost = parsers$1.tabulateStats(prevStats, value, 'packetsLost');
    }

    parsedStats.jitter = parseInt(value.jitter || '0', 10);
    parsedStats.ssrc = value.ssrc;

    const { trackId } = value;
    const audioReceiver = output.raw[trackId];

    if (audioReceiver) {
      parsedStats.audioLevel = audioReceiver.audioLevel ? parseFloat(audioReceiver.audioLevel).toFixed(5) : '0';
      parsedStats.totalSamplesReceived = parseInt(audioReceiver.totalSamplesReceived || '0', 10);
      parsedStats.totalSamplesDuration = parseInt(audioReceiver.totalSamplesDuration || '0', 10);

      // Available but unexposed stats
      // parsedStats.totalAudioLevel = parseFloat(audioReceiver.totalAudioLevel || '0');
      // parsedStats.jitterBufferDelay = parseInt(audioReceiver.jitterBufferDelay || '0', 10);
      // parsedStats.jitterBufferEmittedCount = parseInt(audioReceiver.jitterBufferEmittedCount || '0', 10);
      // parsedStats.concealedSamples = parseInt(audioReceiver.concealedSamples || '0', 10);
      // parsedStats.silentConcealedSamples = parseInt(audioReceiver.silentConcealedSamples || '0', 10);
      // parsedStats.concealmentEvents = parseInt(audioReceiver.concealmentEvents || '0', 10);
      // parsedStats.insertedSamplesForDeceleration = parseInt(audioReceiver.insertedSamplesForDeceleration || '0', 10);
      // parsedStats.removedSamplesForAcceleration = parseInt(audioReceiver.removedSamplesForAcceleration || '0', 10);
    }
  };

  const parseSending = (output, value, prevStats) => {
    const parsedStats = output.audio.sending;

    parsedStats.bytes = parsedStats.bytes || 0;
    if (value.bytesSent) {
      parsedStats.bytes = parsedStats.bytes ? parsedStats.bytes : 0;
      const bytesSent = parseInt(value.bytesSent || '0', 10);
      parsedStats.totalBytes = bytesSent;
      parsedStats.bytes += parsers$1.tabulateStats(prevStats, value, 'bytesSent');
    }

    if (value.packetsSent) {
      const packetsSent = parseInt(value.packetsSent || '0', 10);
      parsedStats.totalPackets = packetsSent;
      parsedStats.packets = parsers$1.tabulateStats(prevStats, value, 'packetsSent');
    }

    if (value.retransmittedBytesSent || isANumber(value.retransmittedBytesSent)) {
      const retransmittedBytesSent = parseInt(value.retransmittedBytesSent || '0', 10);
      parsedStats.totalRetransmittedBytesSent = retransmittedBytesSent;
      parsedStats.retransmittedBytesSent = parsers$1.tabulateStats(prevStats, value, 'retransmittedBytesSent');
    }

    if (value.retransmittedPacketsSent || isANumber(value.retransmittedPacketsSent)) {
      const retransmittedPacketsSent = parseInt(value.retransmittedPacketsSent || '0', 10);
      parsedStats.totalRetransmittedPacketsSent = retransmittedPacketsSent;
      parsedStats.retransmittedPacketsSent = parsers$1.tabulateStats(prevStats, value, 'retransmittedPacketsSent');
    }

    parsedStats.ssrc = value.ssrc;

    if (value.jitter) {
      parsedStats.jitter = parseInt(value.jitter || '0', 10);
    }

    if (value.roundTripTime) {
      parsedStats.roundTripTime = parseInt(value.roundTripTime || '0', 10);
    }

    const { trackId, mediaSourceId } = value;
    const audioSender = output.raw[trackId];
    if (audioSender) {
      parsedStats.echoReturnLoss = parseInt(audioSender.echoReturnLoss || '0', 10);
      parsedStats.echoReturnLossEnhancement = parseInt(audioSender.echoReturnLossEnhancement || '0', 10);
    }

    // Available but unexposed stats
    // parsedStats.totalAudioLevel = parseFloat(audioSender.totalAudioLevel || '0');

    const audioSource = output.raw[mediaSourceId];

    if (audioSource) {
      parsedStats.audioLevel = audioSource.audioLevel ? parseFloat(audioSource.audioLevel).toFixed(5) : '0';
      parsedStats.totalSamplesDuration = parseInt(audioSource.totalSamplesDuration || '0', 10);
    }
  };

  /**
   * Function that parses the raw stats from the RTCInboundRtpStreamStats and RTCOutboundRtpStreamStats dictionary.
   * @param {SkylinkState} state - The room state.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} type - Stats dictionary identifier.
   * @param {RTCPeerConnection} value - Stats value.
   * @param {String} peerId - The peer Id.
   * @param {String} direction - The direction of the media flow, i.e. sending or receiving
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseAudio = (state, output, type, value, peerId, direction) => {
    const { peerStats } = state;
    const prevStats = peerStats[peerId][value.id];
    switch (direction) {
      case 'receiving':
        parseReceiving(output, value, prevStats);
        break;
      case 'sending':
        parseSending(output, value, prevStats);
        break;
      default:
        logger.log.DEBUG([peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED]);
    }
  };

  /**
   * @typedef videoStats - The Peer connection video streaming statistics.
   * @property {JSON} videoStats.sending The Peer connection sending video streaming statistics.
   * @property {Number} videoStats.sending.ssrc The Peer connection sending video streaming RTP packets SSRC.
   * @property {Number} videoStats.sending.bytes The Peer connection current sending video streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {Number} videoStats.sending.totalBytes The Peer connection total sending video streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {Number} videoStats.sending.packets The Peer connection current sending video streaming packets.
   * @property {Number} videoStats.sending.totalPackets The Peer connection total sending video streaming packets.
   * @property {Number} videoStats.sending.roundTripTime The Peer connection sending video streaming Round-trip delay time.
   *   Defined as <code>0</code> if it's not present in original raw statistics before parsing.
   * @property {Number} videoStats.sending.jitter <blockquote class="info">
   *   This property has been deprecated and would be removed in future releases
   *   as it should not be in <code>sending</code> property.
   *   </blockquote> The Peer connection sending video streaming RTP packets jitter in seconds.
   *   Defined as <code>0</code> if it's not present in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.qpSum] - The Peer connection sending video streaming sum of the QP values of frames passed.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.frames] - The Peer connection sending video streaming frames.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.frameWidth] - The Peer connection sending video streaming frame width.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.frameHeight] - The Peer connection sending video streaming frame height.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.hugeFramesSent] - The Peer connection sending video streaming number
   * of huge frames sent by this RTP stream. Huge frames, by definition, are frames that have an encoded size at least 2.5 times the average size of the frames.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.framesPerSecond] - The Peer connection sending video streaming fps.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.framesEncoded] - The Peer connection sending video streaming frames encoded.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.nacks] - The Peer connection current sending video streaming nacks.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.totalNacks] - The Peer connection total sending video streaming nacks.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.plis] - The Peer connection current sending video streaming plis.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.totalPlis] - The Peer connection total sending video streaming plis.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.firs] - The Peer connection current sending video streaming firs.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.totalFirs] - The Peer connection total sending video streaming firs.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {JSON} [videoStats.sending.codec] - The Peer connection sending video streaming selected codec information.
   *   Defined as <code>null</code> if local session description is not available before parsing.
   * @property {String} videoStats.sending.codec.name The Peer connection sending video streaming selected codec name.
   * @property {Number} videoStats.sending.codec.payloadType The Peer connection sending video streaming selected codec payload type.
   * @property {String} [videoStats.sending.codec.implementation] - The Peer connection sending video streaming selected codec implementation.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.sending.codec.channels] - The Peer connection sending video streaming selected codec channels (2 for stereo).
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing,
   *   and this is usually present in <code>statistics.audio</code> property.
   * @property {Number} [videoStats.sending.codec.clockRate] - The Peer connection sending video streaming selected codec media sampling rate.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {String} [videoStats.sending.codec.params] - The Peer connection sending video streaming selected codec parameters.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {JSON} videoStats.receiving The Peer connection receiving video streaming statistics.
   * @property {Number} videoStats.receiving.ssrc The Peer connection receiving video streaming RTP packets SSRC.
   * @property {Number} videoStats.receiving.bytes The Peer connection current receiving video streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {Number} videoStats.receiving.totalBytes The Peer connection total receiving video streaming bytes.
   *   Note that value is in bytes so you have to convert that to bits for displaying for an example kbps.
   * @property {Number} videoStats.receiving.packets The Peer connection current receiving video streaming packets.
   * @property {Number} videoStats.receiving.totalPackets The Peer connection total receiving video streaming packets.
   * @property {Number} videoStats.receiving.packetsLost The Peer connection current receiving video streaming packets lost.
   * @property {Number} videoStats.receiving.totalPacketsLost The Peer connection total receiving video streaming packets lost.
   * @property {Number} [videoStats.receiving.frames] - The Peer connection receiving video streaming frames.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.frameWidth] - The Peer connection sending video streaming frame width.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.frameHeight] - The Peer connection sending video streaming frame height.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.framesDecoded] - The Peer connection receiving video streaming frames decoded.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.framesDroped] - The Peer connection receiving video streaming frames dropped.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.nacks] - The Peer connection current receiving video streaming nacks.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.totalNacks] - The Peer connection total receiving video streaming nacks.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.plis] - The Peer connection current receiving video streaming plis.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.totalPlis] - The Peer connection total receiving video streaming plis.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.firs] - The Peer connection current receiving video streaming firs.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.totalFirs] - The Peer connection total receiving video streaming firs.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {JSON} [videoStats.receiving.codec] - The Peer connection receiving video streaming selected codec information.
   *   Defined as <code>null</code> if remote session description is not available before parsing.
   *   Note that if the value is polyfilled, the value may not be accurate since the remote Peer can override the selected codec.
   *   The value is derived from the remote session description.
   * @property {String} videoStats.receiving.codec.name The Peer connection receiving video streaming selected codec name.
   * @property {Number} videoStats.receiving.codec.payloadType The Peer connection receiving video streaming selected codec payload type.
   * @property {String} [videoStats.receiving.codec.implementation] - The Peer connection receiving video streaming selected codec implementation.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {Number} [videoStats.receiving.codec.channels] - The Peer connection receiving video streaming selected codec channels (2 for stereo).
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing,
   *   and this is usually present in <code>statistics.audio</code> property.
   * @property {Number} [videoStats.receiving.codec.clockRate] - The Peer connection receiving video streaming selected codec media sampling rate.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   * @property {String} [videoStats.receiving.codec.params] - The Peer connection receiving video streaming selected codec parameters.
   *   Defined as <code>null</code> if it's not available in original raw statistics before parsing.
   */

  const parseReceiving$1 = (output, value, prevStats) => {
    const parsedStats = output.video.receiving;

    parsedStats.bytes = parsedStats.bytes || 0;
    if (value.bytesReceived) {
      const bytesReceived = parseInt(value.bytesReceived || '0', 10);
      parsedStats.totalBytes = bytesReceived;
      parsedStats.bytes += parsers$1.tabulateStats(prevStats, value, 'bytesReceived');
    }

    if (value.packetsReceived) {
      const packetsReceived = parseInt(value.packetsReceived || '0', 10);
      parsedStats.totalPackets = packetsReceived;
      parsedStats.packets = parsers$1.tabulateStats(prevStats, value, 'packetsReceived');
    }

    if (Number.isInteger(value.packetsLost)) {
      const packetsLost = parseInt(value.packetsLost || '0', 10);
      parsedStats.totalPacketsLost = packetsLost;
      parsedStats.packetsLost = parsers$1.tabulateStats(prevStats, value, 'packetsLost');
    }

    if (Number.isInteger(value.firCount)) {
      const firsSent = parseInt(value.firCount || '0', 10);
      parsedStats.totalFirs = firsSent;
      parsedStats.firs = parsers$1.tabulateStats(prevStats, value, 'firCount');
    }

    if (Number.isInteger(value.nackCount)) {
      const nacksSent = parseInt(value.nackCount || '0', 10);
      parsedStats.totalNacks = nacksSent;
      parsedStats.nacks = parsers$1.tabulateStats(prevStats, value, 'nackCount');
    }

    if (value.pliCount || Number.isInteger(value.pliCount)) {
      const plisSent = parseInt(value.pliCount || '0', 10);
      parsedStats.totalPlis = plisSent;
      parsedStats.plis = parsers$1.tabulateStats(prevStats, value, 'pliCount');
    }

    parsedStats.ssrc = value.ssrc;
    parsedStats.qpSum = parseInt(value.qpSum || '0', 10);
    parsedStats.decoderImplementation = value.decoderImplementation;

    const { trackId } = value;
    const videoReceiver = output.raw[trackId];

    if (videoReceiver) {
      parsedStats.framesDropped = parseFloat(videoReceiver.framesDropped || '0');
      parsedStats.frames = parseInt(videoReceiver.framesReceived || '0', 10);
      parsedStats.framesDecoded = parseInt(videoReceiver.framesDecoded || '0', 10);
      parsedStats.frameWidth = parseInt(videoReceiver.frameWidth || '0', 10);
      parsedStats.frameHeight = parseInt(videoReceiver.frameHeight || '0', 10);
    }
  };

  const parseSending$1 = (output, value, prevStats) => {
    const parsedStats = output.video.sending;

    parsedStats.bytes = parsedStats.bytes || 0;
    if (value.bytesSent) {
      const bytesSent = parseInt(value.bytesSent || '0', 10);
      parsedStats.totalBytes = bytesSent;
      parsedStats.bytes += parsers$1.tabulateStats(prevStats, value, 'bytesSent');
    }

    if (value.packetsSent) {
      const packetsSent = parseInt(value.packetsSent || '0', 10);
      parsedStats.totalPackets = packetsSent;
      parsedStats.packets = parsers$1.tabulateStats(prevStats, value, 'packetsSent');
    }

    if (Number.isInteger(value.firCount)) {
      const firsReceived = parseInt(value.firCount || '0', 10);
      parsedStats.totalFirs = firsReceived;
      parsedStats.firs = parsers$1.tabulateStats(prevStats, value, 'firCount');
    }

    if (Number.isInteger(value.nackCount)) {
      const nacksReceived = parseInt(value.nackCount || '0', 10);
      parsedStats.totalNacks = nacksReceived;
      parsedStats.nacks = parsers$1.tabulateStats(prevStats, value, 'nackCount');
    }

    if (Number.isInteger(value.pliCount)) {
      const plisReceived = parseInt(value.pliCount || '0', 10);
      parsedStats.totalPlis = plisReceived;
      parsedStats.plis = parsers$1.tabulateStats(prevStats, value, 'pliCount');
    }

    if (value.jitter) {
      parsedStats.jitter = parseInt(value.jitter || '0', 10);
    }

    if (value.roundTripTime) {
      parsedStats.roundTripTime = parseInt(value.roundTripTime || '0', 10);
    }

    if (Number.isInteger(value.framesEncoded)) {
      parsedStats.framesEncoded = parseInt(value.framesEncoded || '0', 10);
    }

    parsedStats.ssrc = value.ssrc;
    parsedStats.qpSum = parseInt(value.qpSum || '0', 10);

    const { trackId, mediaSourceId } = value;
    const videoSender = output.raw[trackId];

    if (videoSender) {
      parsedStats.frameWidth = parseInt(videoSender.frameWidth || '0', 10);
      parsedStats.frameHeight = parseInt(videoSender.frameHeight || '0', 10);
      parsedStats.frames = parseInt(videoSender.framesSent || '0', 10);
      parsedStats.hugeFramesSent = parseInt(videoSender.hugeFramesSent || '0', 10);
    }

    const videoSource = output.raw[mediaSourceId];

    if (videoSource) {
      parsedStats.framesPerSecond = parseInt(videoSource.framesPerSecond || '0', 10);
    }
  };

  /**
   * Function that parses the raw stats from the RTCInboundRtpStreamStats and RTCOutboundRtpStreamStats dictionary.
   * @param {SkylinkState} state - The room state.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} type - Stats dictionary identifier.
   * @param {RTCPeerConnection} value - Stats value.
   * @param {String} peerId - The peer Id.
   * @param {String} direction - The direction of the media flow, i.e. sending or receiving
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseVideo = (state, output, type, value, peerId, direction) => {
    const { peerStats } = state;
    const prevStats = peerStats[peerId][value.id];
    switch (direction) {
      case 'receiving':
        parseReceiving$1(output, value, prevStats);
        break;
      case 'sending':
        parseSending$1(output, value, prevStats);
        break;
      default:
        logger.log.DEBUG([peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED]);
    }
  };

  const parseMedia = (state, output, type, value, peerConnection, peerId, direction) => {
    const trackKind = value.kind || value.mediaType; // Safari uses mediaType key

    if (trackKind === TRACK_KIND.AUDIO) {
      parsers$1.parseAudio(state, output, type, value, peerId, direction);
    } else if (trackKind === TRACK_KIND.VIDEO) {
      parsers$1.parseVideo(state, output, type, value, peerId, direction);
    } else {
      logger.log.DEBUG([peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.INVALID_TRACK_KIND], value);
    }
  };

  /**
   * @namespace PeerConnectionStatisticsParsers
   * @description Parser functions for PeerConnectionStatistics
   * @private
   * @type {{parseVideo: parseVideo, parseAudio: parseAudio, tabulateStats: tabulateStats, parseSelectedCandidatePair: parseSelectedCandidatePair, parseCertificates: parseCertificates, parseMedia: parseMedia}}
   */
  const parsers$1 = {
    parseSelectedCandidatePair,
    parseCertificates,
    tabulateStats,
    parseAudio,
    parseVideo,
    parseMedia,
  };

  /**
   * @classdesc This class is used to fetch the statistics for a RTCPeerConnection
   * @class
   * @private
   */
  class PeerConnectionStatistics {
    constructor(roomKey, peerId) {
      /**
       * The current skylink state of the room
       * @type {SkylinkState}
       */
      this.roomState = Skylink.getSkylinkState(roomKey);
      /**
       * Current RTCPeerConnection based on the peerId
       * @type {RTCPeerConnection}
       */
      this.peerConnection = this.roomState.peerConnections[peerId] || null;
      this.dataChannel = this.roomState.dataChannels[peerId] || null;
      this.peerId = peerId;
      this.roomKey = roomKey;
      this.output = {
        peerId,
        raw: {},
        connection: {},
        audio: {
          sending: {},
          receiving: {},
        },
        video: {
          sending: {},
          receiving: {},
        },
        selectedCandidatePair: {
          id: null,
          local: {},
          remote: {},
          consentRequests: {},
          responses: {},
          requests: {},
        },
        certificate: {},
      };
      this.beSilentOnLogs = Skylink.getInitOptions().beSilentOnStatsLogs;
      this.beSilentOnParseLogs = Skylink.getInitOptions().beSilentOnParseLogs;
      this.bandwidth = null;
    }

    /**
     * Helper function for getting RTC Connection Statistics
     * @returns {Promise<statistics>}
     */
    getConnectionStatus() {
      return this.getStatistics(false, false);
    }

    getStatsSuccess(promiseResolve, promiseReject, stats) {
      if (!stats && isAgent(BROWSER_AGENT.REACT_NATIVE)) {
        // get stats in react native will resolve with 'null'
        promiseResolve(this.output);
        return;
      }
      const { peerStats, room } = this.roomState;
      // TODO: Need to do full implementation of success function
      if (typeof stats.forEach === 'function') {
        stats.forEach((item, prop) => {
          this.output.raw[prop] = item;
        });
      } else {
        this.output.raw = stats;
      }

      try {
        if (isEmptyObj(peerStats)) {
          logger.log.DEBUG([this.peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.STATS_DISCARDED]);
          return;
        }

        const rawEntries = Object.entries(this.output.raw);
        rawEntries.forEach((entry) => {
          const key = entry[0];
          const value = entry[1];
          const { type } = value;
          switch (type) {
            case 'remote-inbound-rtp': // sender stats
            case 'outbound-rtp':
            case 'inbound-rtp':
              if (type === 'inbound-rtp') {
                parsers$1.parseMedia(this.roomState, this.output, type, value, this.peerConnection, this.peerId, 'receiving');
              } else {
                parsers$1.parseMedia(this.roomState, this.output, type, value, this.peerConnection, this.peerId, 'sending');
              }
              break;
            case 'certificate':
              parsers$1.parseCertificates(this.output, value);
              break;
            case 'local-candidate':
            case 'remote-candidate':
              parsers$1.parseSelectedCandidatePair(this.roomState, this.output, type, value, this.peerConnection, this.peerId);
              break;
            case 'media-source':
              parsers$1.parseSelectedCandidatePair(this.roomState, this.output, type, value, this.peerConnection, this.peerId);
              break;
            default:
              // do nothing
          }

          peerStats[this.peerId][key] = this.output.raw[key];

          Skylink.setSkylinkState(this.roomState, room.id);
        });
      } catch (err) {
        this.getStatsFailure(promiseReject, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED, err);
      }

      if (!this.beSilentOnLogs) {
        dispatchEvent(getConnectionStatusStateChange({
          state: GET_CONNECTION_STATUS_STATE.RETRIEVE_SUCCESS,
          peerId: this.peerId,
          stats: this.output,
        }));
      }

      promiseResolve(this.output);
    }

    getStatsFailure(promiseReject, errorMsg, error) {
      const errMsg = errorMsg || MESSAGES.STATS_MODULE.RETRIEVE_STATS_FAILED;

      if (!this.beSilentOnLogs) {
        logger.log.ERROR([this.peerId, TAGS.STATS_MODULE, null, errMsg], error);
        dispatchEvent(getConnectionStatusStateChange({
          state: GET_CONNECTION_STATUS_STATE.RETRIEVE_ERROR,
          peerId: this.peerId,
          error,
        }));
      }
      promiseReject(error);
    }

    /**
     * Fetch webRTC stats of a RTCPeerConnection
     * @param beSilentOnLogs
     * @param isAutoBwStats
     * @return {Promise<statistics>}
     * @fires GET_CONNECTION_STATUS_STATE_CHANGE
     */
    // eslint-disable-next-line consistent-return
    getStatistics(beSilentOnLogs = false, isAutoBwStats = false) {
      const { STATS_MODULE } = MESSAGES;
      return new Promise((resolve, reject) => {
        if (!this.roomState.peerStats[this.peerId] && !isAutoBwStats) {
          logger.log.WARN(STATS_MODULE.NOT_INITIATED);
          resolve(null);
        } else {
          this.beSilentOnLogs = beSilentOnLogs;
          this.isAutoBwStats = isAutoBwStats;

          try {
            // obtain stats from SDP that are not available in stats report or not complete
            this.gatherRTCPeerConnectionDetails();
            this.gatherSDPIceCandidates();
            this.gatherSDPCodecs();
            this.gatherRTCDataChannelDetails();
          } catch (err) {
            logger.log.WARN([this.peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED], err);
          }

          if (typeof this.peerConnection.getStats !== 'function') {
            this.getStatsFailure(reject, MESSAGES.PEER_CONNECTION.STATS_API_UNAVAILABLE);
          }

          if (!this.beSilentOnLogs) {
            dispatchEvent(getConnectionStatusStateChange({
              state: GET_CONNECTION_STATUS_STATE.RETRIEVING,
              peerId: this.peerId,
            }));
          }

          this.peerConnection.getStats()
            .then((stats) => { this.getStatsSuccess(resolve, reject, stats); })
            .catch((error) => {
              if (error.message === MESSAGES.STATS_MODULE.ERRORS.STATS_IS_NULL) {
                logger.log.WARN([this.peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.ERRORS.RETRIEVE_STATS_FAILED], error.message);
                return;
              }
              this.getStatsFailure(reject, null, error);
            });
        }
      });
    }

    /**
     * Formats output object with RTCPeerConnection details
     * @private
     */
    gatherRTCPeerConnectionDetails() {
      const { peerConnection } = this;
      this.output.connection.iceConnectionState = peerConnection.iceConnectionState;
      this.output.connection.iceGatheringState = peerConnection.iceGatheringState;
      this.output.connection.signalingState = peerConnection.signalingState;

      this.output.connection.remoteDescription = {
        type: (peerConnection.remoteDescription && peerConnection.remoteDescription.type) || '',
        sdp: (peerConnection.remoteDescription && peerConnection.remoteDescription.sdp) || '',
      };

      this.output.connection.localDescription = {
        type: (peerConnection.localDescription && peerConnection.localDescription.type) || '',
        sdp: (peerConnection.localDescription && peerConnection.localDescription.sdp) || '',
      };

      this.output.connection.constraints = this.peerConnection.constraints ? this.peerConnection.constraints : null;
      this.output.connection.sdpConstraints = this.peerConnection.sdpConstraints ? this.peerConnection.sdpConstraints : null;
    }

    /**
     * Formats output object with Ice Candidate details
     * @private
     */
    gatherSDPIceCandidates() {
      const { peerConnection, beSilentOnParseLogs } = this;
      this.output.connection.candidates = {
        sending: SessionDescription.getSDPICECandidates(this.peerId, peerConnection.localDescription, beSilentOnParseLogs),
        receiving: SessionDescription.getSDPICECandidates(this.peerId, peerConnection.remoteDescription, beSilentOnParseLogs),
      };
    }

    /**
     * Formats output object with SDP codecs
     * @private
     */
    gatherSDPCodecs() {
      const { peerConnection, beSilentOnParseLogs } = this;
      this.output.audio.sending.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.remoteDescription, 'audio', beSilentOnParseLogs);
      this.output.video.sending.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.remoteDescription, 'video', beSilentOnParseLogs);
      this.output.audio.receiving.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.localDescription, 'audio', beSilentOnParseLogs);
      this.output.video.receiving.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.localDescription, 'video', beSilentOnParseLogs);
    }

    /**
     * Formats output object with RTCDataChannel details
     * @private
     */
    gatherRTCDataChannelDetails() {
      const { dataChannel } = this;
      if (dataChannel) {
        const dcKeys = Object.keys(dataChannel);

        this.output.connection.dataChannels = {};

        dcKeys.forEach((prop) => {
          const channel = dataChannel[prop];
          this.output.connection.dataChannels[channel.channel.label] = {
            label: channel.channel.label,
            readyState: channel.channel.readyState,
            channelType: DATA_CHANNEL_TYPE[prop === 'main' ? 'MESSAGING' : 'DATA'],
            currentTransferId: channel.transferId || null,
            currentStreamId: channel.streamId || null,
          };
        });
      }
    }
  }

  /**
   * @classdesc Class that represents a PeerConnection
   * @class
   * @private
   */
  class PeerConnection {
    /**
     * @static
     * @param {object} params - options required to create a PeerConnection
     * @param {SkylinkRoom} params.currentRoom - The currrent state
     * @param {String} params.targetMid - Peer's id
     * @param {Object} params.peerBrowser - Peer's user agent object
     * @param {RTCCertificate} params.cert - Represents a certificate that an RTCPeerConnection uses to authenticate.
     * @param {boolean} hasScreenshare - Is screenshare enabled
     */
    static addPeer(params) {
      helpers$4.addPeer(params);
    }

    /**
     * @static
     * @param args
     */
    static createOffer(...args) {
      return helpers$4.createOffer(...args);
    }

    /**
     * @static
     * @param args
     */
    static createAnswer(...args) {
      return helpers$4.createAnswer(...args);
    }

    /**
     * @static
     * @param args
     */
    static createDataChannel(...args) {
      return helpers$4.createDataChannel(...args);
    }

    /**
     * @static
     * @param args
     */
    static sendP2PMessage(...args) {
      return helpers$4.sendP2PMessage(...args);
    }

    /**
     * @static
     * @param args
     */
    static getPeersInRoom(...args) {
      return helpers$4.getPeersInRoom(...args);
    }

    /**
     * Get webRTC statistics via the getStats() method of RTCPeerConnection inside a Room
     * @param {SkylinkRoom.id} roomKey
     * @param {String} peerId
     * @param {boolean} beSilentOnLogs
     * @param {boolean} isAutoBwStats - The flag if retrieveStatistics is called from BandwidthAdjuster
     * @static
     * @return {Promise}
     */
    static retrieveStatistics(roomKey, peerId, beSilentOnLogs, isAutoBwStats) {
      const peerConnectionStatistics = new PeerConnectionStatistics(roomKey, peerId);
      return peerConnectionStatistics.getStatistics(beSilentOnLogs, isAutoBwStats);
    }

    /**
     * @static
     * @param args
     */
    static signalingEndOfCandidates(...args) {
      return helpers$4.signalingEndOfCandidates(...args);
    }

    /**
     * Get RTCPeerConnection status
     * @param {SkylinkState} roomState
     * @param {String|Array} peerId
     * @static
     * @return {Promise<statistics>}
     */
    static getConnectionStatus(roomState, peerId) {
      return helpers$4.getConnectionStatus(roomState, peerId);
    }

    /**
     * Get RTCDataChannel buffer thresholds
     * @param {RTCDataChannel.channel} channel
     * @static
     * @return {{bufferedAmountLow: number, bufferedAmountLowThreshold: number}}
     */
    static getDataChannelBuffer(channel) {
      return helpers$4.getDataChannelBuffer(channel);
    }

    static refreshDataChannel(roomState, peerId) {
      return helpers$4.refreshDataChannel(roomState, peerId);
    }

    static closeDataChannel(roomState, peerId) {
      return helpers$4.closeDataChannel(roomState, peerId);
    }

    static refreshConnection(roomState, targetPeerId, iceRestart, options, callback) {
      return helpers$4.refreshConnection(roomState, targetPeerId, iceRestart, options, callback);
    }

    static refreshPeerConnection(listOfPeers, roomState, doIceRestart, bwOptions) {
      return helpers$4.refreshPeerConnection(listOfPeers, roomState, doIceRestart, bwOptions);
    }

    static buildPeerInformations(...args) {
      return helpers$4.buildPeerInformations(...args);
    }

    static closePeerConnection(roomState, peerId) {
      return helpers$4.closePeerConnection(roomState, peerId);
    }

    static updatePeerInformationsMediaStatus(roomState, peerId, transceiverMid, stream) {
      return helpers$4.updatePeerInformationsMediaStatus(roomState, peerId, transceiverMid, stream);
    }
  }

  const retrievePeersScreenStreamId = (state) => {
    const { peerMedias, user } = state;
    const peersScreenStreamId = {};

    const peerIds = Object.keys(peerMedias).filter(peerId => peerId !== user.sid);
    for (let i = 0; i < peerIds.length; i += 1) {
      const peerId = peerIds[i];
      Object.values(peerMedias[peerId]).forEach((mInfo) => {
        if (mInfo.mediaType === MEDIA_TYPE.VIDEO_SCREEN) {
          peersScreenStreamId[peerId] = mInfo.streamId;
        }
      });
    }

    return peersScreenStreamId;
  };

  const stopScreenStream = (room, screenStream, peerId, fromLeaveRoom = false) => {
    const isScreensharing = true;
    stopStreamHelpers.prepStopStreams(room.id, screenStream.id, fromLeaveRoom, isScreensharing)
      .then(() => logger.log.DEBUG([peerId, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.STOP_SCREEN_SUCCESS}`]))
      .catch(error => logger.log.DEBUG([peerId, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN}`], error));
  };

  const addScreenStreamCallbacks = (state, stream) => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      // eslint-disable-next-line no-param-reassign
      track.onended = () => stopScreenStream(state.room, stream, state.user.sid);
    });
  };

  const onScreenStreamAccessSuccess = (roomKey, stream, audioSettings, videoSettings, isAudioFallback, isScreensharing) => {
    helpers$7.onStreamAccessSuccess(roomKey, stream, audioSettings, videoSettings, isAudioFallback, isScreensharing);
  };

  const helpers$9 = {
    addScreenStreamCallbacks,
    retrievePeersScreenStreamId,
    stopScreenStream,
    onScreenStreamAccessSuccess,
  };

  const screensharingInstance = {};

  /**
   * @classdesc Class used for handling Screensharing.
   * @class
   * @private
   */
  class ScreenSharing {
    constructor(roomState) {
      const { room } = roomState;

      if (screensharingInstance[room.id]) {
        return screensharingInstance[room.id];
      }

      this.roomState = roomState;
      this.stream = null;
      this.signaling = new SkylinkSignalingServer();
      this.streamId = null;
      this.settings = null;

      screensharingInstance[room.id] = this;
    }

    streamExists() {
      const streamList = helpers$7.getStreams(this.roomState, this.roomState.room.name);
      const streamIds = Object.keys(streamList.userMedia);

      for (let i = 0; i < streamIds.length; i += 1) {
        if (streamIds[i] === this.streamId) {
          return true;
        }
      }
      return false;
    }

    /**
     * Function that starts the screenshare.
     * @param {String} streamId
     * @param {Object} options
     * @return {MediaStream}
     */
    async start(streamId = null, options) {
      this.streamId = streamId;
      this.settings = this.isValidOptions(options) ? helpers$7.parseStreamSettings(options) : helpers$7.parseStreamSettings(DEFAULTS.MEDIA_OPTIONS.SCREENSHARE);
      if (!options || !(options.video && options.video.resolution)) {
        // defaults for video were set so delete video width and height constraints if not provided in options
        delete this.settings.getUserMediaSettings.video.width;
        delete this.settings.settings.video.width;
        delete this.settings.getUserMediaSettings.video.height;
        delete this.settings.settings.video.height;
      }

      try {
        this.checkForExistingScreenStreams();

        this.stream = await this.startScreenCapture(options);
        if (!this.stream) {
          this.deleteScreensharingInstance(this.roomState.room);
          return null;
        }

        helpers$9.onScreenStreamAccessSuccess(this.roomState.room.id, this.stream, null, this.settings, false, true);
        helpers$9.addScreenStreamCallbacks(this.roomState, this.stream);
        this.addScreenshareStream();
      } catch (error) {
        logger.log.ERROR([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.START_SCREEN], error);
      }

      return this.stream;
    }

    /**
     * Function that stops the screenshare.
     * @param {Boolean} fromLeaveRoom
     * @return {MediaStream}
     */
    stop(fromLeaveRoom = false) {
      if (!this.stream) {
        logger.log.DEBUG([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN} - ${MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM}`]);
        return null;
      }

      try {
        helpers$9.stopScreenStream(this.roomState.room, this.stream, this.roomState.user.sid, fromLeaveRoom);
        this.streamId = null;
        this.stream = null;
      } catch (error) {
        logger.log.ERROR([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN}`], error);
      }
      return null;
    }

    // eslint-disable-next-line
    startScreenCapture() {
      const { navigator } = window;
      const displayMediaOptions = this.settings.getUserMediaSettings;
      if (navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
          .then(stream => stream)
          .catch((error) => {
            if (error.name === 'NotAllowedError') {
              logger.log.WARN(error);
            } else {
              logger.log.ERROR(error);
            }
            return null;
          });
      }

      displayMediaOptions.video.mediaSource = 'screen';
      return navigator.mediaDevices.getUserMedia(displayMediaOptions)
        .then(stream => stream)
        .catch((error) => {
          logger.log.ERROR(error);
          return null;
        });
    }

    // eslint-disable-next-line class-methods-use-this
    isValidOptions(options) {
      if (options && isAObj(options) && options.video) {
        return true;
      }

      if (options) {
        logger.log.WARN([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GDM_OPTIONS], options);
      }

      return false;
    }

    checkForExistingScreenStreams() {
      const peersScreenStream = helpers$9.retrievePeersScreenStreamId(this.roomState);

      if (!isEmptyObj(peersScreenStream)) {
        logger.log.WARN([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.PEER_SCREEN_ACTIVE]);
      }
    }

    addScreenshareStream() {
      const { peerConnections } = this.roomState;

      if (!isEmptyObj(peerConnections)) {
        PeerConnection.refreshConnection(this.roomState)
          .catch(error => logger.log.ERROR([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.START_SCREEN], error));
      }
    }

    // eslint-disable-next-line class-methods-use-this
    deleteScreensharingInstance(room) {
      delete screensharingInstance[room.id];
    }
  }

  let instance$5 = null;

  /**
   * @class SkylinkStates
   * @hideconstructor
   * @classdesc Singleton Class that provides methods to access and update Skylink State
   * @private
   */
  class SkylinkStates {
    constructor() {
      if (!instance$5) {
        instance$5 = this;
      }

      this.states = {};

      return instance$5;
    }

    /**
     * @param {SkylinkState} skylinkState
     */
    setState(skylinkState) {
      this.states[skylinkState.room.id] = skylinkState;
    }

    /**
     *
     * @return {Object}
     */
    getAllStates() {
      return this.states;
    }

    /**
     *
     * @param {String} roomId
     * @return {SkylinkState}
     */
    getState(roomId) {
      return this.states[roomId];
    }

    /**
     *
     * @param {String} roomId
     * @return boolean
     */
    removeStateByRoomId(roomId) {
      return delete this.states[roomId];
    }

    /**
     *
     * @param {String} roomKey
     */
    clearRoomStateFromSingletons(roomKey) {
      const roomState = this.getState(roomKey);
      new ScreenSharing(roomState).deleteScreensharingInstance(roomState.room);
      AsyncMessaging.deleteAsyncInstance(roomState.room);
      EncryptedMessaging.deleteEncryptedInstance(roomState.room);
      new SkylinkApiResponse(null, roomKey).deleteApiResponseInstance(roomKey);
    }
  }

  /**
   * @classdesc Class that represents a Privilege Peer methods
   * @class
   * @private
   */
  class PeerPrivileged {
    static shouldProceed(state, appKey, reject) {
      let errMsg = null;

      if (!state.isPrivileged) {
        errMsg = MESSAGES.PEER_PRIVILEGED.not_privileged;
      }

      if (!appKey) {
        errMsg = MESSAGES.PEER_PRIVILEGED.no_appkey;
      }

      if (errMsg) {
        logger.log.DEBUG(errMsg);
        reject(new Error(errMsg));
      }

      return !errMsg;
    }

    /**
     * Function that retrieves the list of Peer IDs from Rooms within the same App space.
     * @param {SkylinkRoom} room
     * @param {boolean} showAll
     * @return {Promise<object>}
     * @fires GET_PEERS_STATE_CHANGE
     */
    static getPeerList(room, showAll) {
      return new Promise((resolve, reject) => {
        try {
          const state = Skylink.getSkylinkState(room.id);
          const initOptions = Skylink.getInitOptions();
          const pShowAll = showAll || false;

          const executeCallbackAndRemoveEvtListener = (evt) => {
            const result = evt.detail;

            if (result.state === GET_PEERS_STATE.DISPATCHED) {
              removeEventListener(EVENTS.GET_PEERS_STATE_CHANGE, executeCallbackAndRemoveEvtListener);

              dispatchEvent(getPeersStateChange({
                state: GET_PEERS_STATE.RECEIVED,
                privilegePeerId: state.user.sid,
                peerList: result.peerList,
              }));

              resolve(result.peerList);
            }
          };

          if (this.shouldProceed(state, initOptions.appKey, reject)) {
            new SkylinkSignalingServer().getPeerList(pShowAll);

            dispatchEvent(getPeersStateChange({
              state: GET_PEERS_STATE.ENQUIRED,
              privilegePeerId: state.user.sid,
              peerList: null,
            }));

            logger.log.INFO(MESSAGES.PEER_PRIVILEGED.getPeerListFromServer);

            addEventListener(EVENTS.GET_PEERS_STATE_CHANGE, executeCallbackAndRemoveEvtListener);
          }
        } catch (error) {
          logger.log.ERROR(error);
          reject(error);
        }
      });
    }
  }

  const sendRecordingMessageViaSig = (roomState, isStartRecording, currentRecordingId = null) => {
    const signaling = new SkylinkSignalingServer();
    const handleRecordingStats = new HandleRecordingStats();

    signaling.recording(roomState.room.id, isStartRecording ? SIG_MESSAGE_TYPE.START_RECORDING : SIG_MESSAGE_TYPE.STOP_RECORDING);
    handleRecordingStats.send(roomState.room.id, isStartRecording ? MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.REQUEST_START : MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.REQUEST_STOP, currentRecordingId, null, null);
  };

  const manageRecordingEventListeners = (resolve, isStartRecording) => {
    const executeCallbackAndRemoveEvtListener = (evt) => {
      const result = evt.detail;
      const stateToCompare = isStartRecording ? RECORDING_STATE$1.START : RECORDING_STATE$1.STOP;

      if (result.state === stateToCompare) {
        removeEventListener(EVENTS.RECORDING_STATE, executeCallbackAndRemoveEvtListener);
        resolve(result.recordingId);
      }
    };

    addEventListener(EVENTS.RECORDING_STATE, executeCallbackAndRemoveEvtListener);
  };

  const manageErrorStatsAndCallback = (roomState, errorMessage, statsKey, currentRecordingId = null, recordings = null) => {
    const handleRecordingStats = new HandleRecordingStats();
    logger.log.ERROR(errorMessage);
    handleRecordingStats.send(roomState.room.id, statsKey, currentRecordingId, recordings, errorMessage);
    return new Error(errorMessage);
  };

  /**
   * @param {SkylinkState} roomState
   * @param {boolean} isStartRecording
   * @private
   */
  const commonRecordingOperations = (roomState, isStartRecording) => new Promise((resolve, reject) => {
    const { hasMCU, currentRecordingId, recordingStartInterval } = roomState;
    let errorMessage = isStartRecording ? MESSAGES.RECORDING.START_FAILED : MESSAGES.RECORDING.STOP_FAILED;

    if (!hasMCU) {
      errorMessage = `${errorMessage} - ${MESSAGES.RECORDING.ERRORS.MCU_NOT_CONNECTED}`;
      const statsStateKey = isStartRecording ? MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.ERROR_NO_MCU_START : MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.ERROR_NO_MCU_STOP;
      const error = manageErrorStatsAndCallback(roomState, errorMessage, statsStateKey, null, null);
      reject(error);
    }

    if (isStartRecording && currentRecordingId) {
      const error = manageErrorStatsAndCallback(roomState, `${errorMessage} - ${MESSAGES.RECORDING.ERRORS.EXISTING_RECORDING_IN_PROGRESS}`, MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.ERROR_START_ACTIVE, currentRecordingId, null);
      reject(error);
    }

    if (!isStartRecording && !currentRecordingId) {
      const error = manageErrorStatsAndCallback(roomState, `${errorMessage} - ${MESSAGES.RECORDING.ERRORS.NO_RECORDING_IN_PROGRESS}`, MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.ERROR_STOP_ACTIVE, currentRecordingId, null);
      reject(error);
    }

    if (!isStartRecording && recordingStartInterval) {
      const error = manageErrorStatsAndCallback(roomState, `${errorMessage} - ${MESSAGES.RECORDING.ERRORS.MIN_RECORDING_TIME}`, MESSAGES.STATS_MODULE.HANDLE_RECORDING_STATS.ERROR_MIN_STOP, currentRecordingId, null);
      reject(error);
    }

    manageRecordingEventListeners(resolve, isStartRecording);
    sendRecordingMessageViaSig(roomState, isStartRecording, currentRecordingId);
  });

  /**
   * The current room's Skylink state
   * @param {SkylinkState} roomState
   * @private
   */
  const startRecording = roomState => commonRecordingOperations(roomState, true);

  /**
   * The current room's Skylink state
   * @param {SkylinkState} roomState
   * @private
   */
  const stopRecording = roomState => commonRecordingOperations(roomState, false);

  class Recording {
    static start(...args) {
      return startRecording(...args);
    }

    static stop(...args) {
      return stopRecording(...args);
    }

    static getRecordings(roomState) {
      const { recordings } = roomState;
      return Object.assign({}, recordings);
    }
  }

  /**
   * Checks dependencies to start or stop an RTMP session
   * @param {boolean} isStartSession
   * @param {SkylinkState} roomState
   * @param {String|null} streamId
   * @param {String|null} endpoint
   * @private
   * @return {{shouldProceed: boolean, errorMessage: string}}
   */
  const checkRTMPDependencies = (isStartSession, roomState, streamId = null, endpoint = null) => {
    const toReturn = { shouldProceed: true, errorMessage: '' };
    const { hasMCU } = roomState;

    if (!hasMCU) {
      toReturn.errorMessage = isStartSession ? MESSAGES.RTMP.start_no_mcu : MESSAGES.RTMP.stop_no_mcu;
      toReturn.shouldProceed = false;
      return toReturn;
    }

    if (isStartSession && !streamId) {
      toReturn.errorMessage = MESSAGES.RTMP.start_no_stream_id;
      toReturn.shouldProceed = false;
      return toReturn;
    }

    if (isStartSession && !endpoint) {
      toReturn.errorMessage = MESSAGES.RTMP.start_no_endpoint;
      toReturn.shouldProceed = false;
      return toReturn;
    }

    return toReturn;
  };

  const registerRTMPEventListenersAndResolve = (isStartRTMPSession, resolve) => {
    const executeCallbackAndRemoveEvtListener = (evt) => {
      const result = evt.detail;
      const stateToCompare = isStartRTMPSession ? RTMP_STATE$1.START : RTMP_STATE$1.STOP;

      if (result.state === stateToCompare) {
        removeEventListener(EVENTS.RTMP_STATE, executeCallbackAndRemoveEvtListener);
        resolve(result.rtmpId);
      }
    };

    addEventListener(EVENTS.RTMP_STATE, executeCallbackAndRemoveEvtListener);
  };

  /**
   * Method sends START_RTMP or STOP_RTMP message to Signaling Server
   * @param {SkylinkState} roomState
   * @param {boolean} isStartRTMPSession
   * @param {String} rtmpId
   * @param {String} streamId
   * @param {String} endpoint
   * @private
   */
  const sendRTMPMessageViaSig = (roomState, isStartRTMPSession, rtmpId, streamId = null, endpoint = null) => {
    const { room, user } = roomState;
    const signaling = new SkylinkSignalingServer();
    const messageType = isStartRTMPSession ? SIG_MESSAGE_TYPE.START_RTMP : SIG_MESSAGE_TYPE.STOP_RTMP;

    signaling.rtmp(messageType, room.id, user.sid, rtmpId, streamId, endpoint);
  };

  var helpers$a = {
    checkRTMPDependencies,
    registerRTMPEventListenersAndResolve,
    sendRTMPMessageViaSig,
  };

  class RTMP {
    /**
     * Start an RTMP session
     * @param {SkylinkState} roomState
     * @param {String} streamId
     * @param {String} endpoint
     */
    static startSession(roomState, streamId, endpoint) {
      return this.commonRTMPOperations(roomState, streamId, null, endpoint, true, MESSAGES.RTMP.starting_rtmp);
    }

    /**
     * Stop a RTMP Session
     * @param {SkylinkState} roomState
     * @param {String} rtmpId
     */
    static stopSession(roomState, rtmpId) {
      return this.commonRTMPOperations(roomState, null, rtmpId, null, false, MESSAGES.RTMP.stopping_rtmp);
    }

    static logErrorAndReject(error, reject) {
      logger.log.ERROR(error);
      reject(error);
    }

    static commonRTMPOperations(roomState, streamId, rtmpId, endpoint, isStartRTMPSession, msg) {
      return new Promise((resolve, reject) => {
        try {
          const result = helpers$a.checkRTMPDependencies(isStartRTMPSession, roomState, streamId, endpoint);
          const gRtmpId = rtmpId || generateUUID();

          if (result.shouldProceed) {
            helpers$a.registerRTMPEventListenersAndResolve(isStartRTMPSession, resolve);
            helpers$a.sendRTMPMessageViaSig(roomState, isStartRTMPSession, gRtmpId, streamId, endpoint);
            logger.log.INFO([PEER_TYPE.MCU, 'RTMP', msg]);
          } else {
            this.logErrorAndReject(new Error(result.errorMessage), reject);
          }
        } catch (error) {
          this.logErrorAndReject(error, reject);
        }
      });
    }
  }

  /* eslint-disable class-methods-use-this */

  /**
   * @classdesc This class lists all the public methods of Skylink.
   * @interface
   * @private
   */
  class SkylinkPublicInterface {
    /**
     * @description Method that starts a room session.
     * <p>Resolves with an array of <code>MediaStreams</code> or null if pre-fetched
     * stream was passed into <code>joinRoom</code> method. First item in array is <code>MediaStream</code> of kind audio and second item is
     * <code>MediaStream</code> of kind video.</p>
     * @param {joinRoomOptions} [options] - The options available to join the room and configure the session.
     * @param {MediaStream} [prefetchedStream] - The pre-fetched media stream object obtained when the user calls {@link Skylink#getUserMedia|getUserMedia} method before {@link Skylink#joinRoom|joinRoom} method.
     * @return {Promise.<MediaStreams>}
     * @example
     * Example 1: Calling joinRoom with options
     *
     * const joinRoomOptions = {
     *    audio: true,
     *    video: true,
     *    roomName: "Room_1",
     *    userData: {
     *        username: "GuestUser_1"
     *    },
     * };
     *
     * skylink.joinRoom(joinRoomOptions)
     *    .then((streams) => {
     *        if (streams[0]) {
     *          window.attachMediaStream(audioEl, streams[0]); // first item in array is an audio stream
     *        }
     *        if (streams[1]) {
     *          window.attachMediaStream(videoEl, streams[1]); // second item in array is a video stream
     *        }
     *    })
     *    .catch((error) => {
     *        // handle error
     *    });
     * @example
     * Example 2: Retrieving a pre-fetched stream before calling joinRoom
     *
     * // REF: {@link Skylink#getUserMedia|getUserMedia}
     * const prefetchedStreams = skylink.getUserMedia();
     *
     * const joinRoomOptions = {
     *    roomName: "Room_1",
     *    userData: {
     *        username: "GuestUser_1"
     *    },
     * };
     *
     * skylink.joinRoom(joinRoomOptions, prefetchedStreams)
     *    .catch((error) => {
     *    // handle error
     *    });
     * @alias Skylink#joinRoom
     */
    async joinRoom(options = {}, prefetchedStream) {
      return Room.joinRoom(options, prefetchedStream);
    }

    /**
     * @description Method that sends a message to peers via the data channel connection.
     * @param {String} [roomName] - The name of the room the message is intended for.
     * When not provided, the message will be broadcast to all rooms where targetPeerId(s) are found (if provided).
     * Note when roomName is provided, targetPeerId should be provided as null.
     * @param {String|JSON} message - The message.
     * @param {String|Array} [targetPeerId] - The target peer id to send message to.
     * When provided as an Array, it will send the message to only peers which ids are in the list.
     * When not provided, it will broadcast the message to all connected peers with data channel connection in a room.
     * @example
     * Example 1: Broadcasting to all peers in all rooms
     *
     * const message = "Hello everyone!";
     *
     * skylink.sendP2PMessage(message);
     * @example
     * Example 2: Broadcasting to all peers in a room
     *
     * const message = "Hello everyone!";
     * const roomName = "Room_1";
     *
     * skylink.sendP2PMessage(message, null, roomName);
     * @example
     * Example 3: Sending message to a peer in all rooms
     *
     * const message = "Hello!";
     * const targetPeerId = "peerId";
     *
     * skylink.sendP2PMessage(message, targetPeerId);
     * @example
     * Example 4: Sending message to a peer in a room
     *
     * const message = "Hello!";
     * const targetPeerId = "peerId";
     * const roomName = "Room_1";
     *
     * skylink.sendP2PMessage(message, targetPeerId, roomName);
     * @example
     * Example 5: Sending message to selected Peers in a room
     *
     * const message = "Hello!";
     * const selectedPeers = ["peerId_1", "peerId_2"];
     * const roomName = "Room_1";
     *
     * skylink.sendP2PMessage(message, selectedPeers, roomName);
     * @example
     * // Listen for onIncomingMessage event
     * skylink.addEventListener(SkylinkEvents.ON_INCOMING_MESSAGE, (evt) => {
     *   const detail = evt.detail;
     *   if (detail.isSelf) {
     *     // handle message from self
     *   } else {
     *     // handle message from remote peer
     *   }
     * }
     * @fires {@link SkylinkEvents.event:ON_INCOMING_MESSAGE|ON_INCOMING_MESSAGE} event
     * @alias Skylink#sendP2PMessage
     */
    sendP2PMessage(roomName = '', message = '', targetPeerId = '') {
      PeerConnection.sendP2PMessage(roomName, message, targetPeerId);
    }

    /**
     * @description Function that sends a message to peers via the Signaling socket connection.
     * <p><code>sendMessage</code> can also be used to trigger call actions on the remote. Refer to Example 3 for muting the remote peer.</p>
     * @param {String} roomName - room name to send the message.
     * @param {String|JSON} message - The message.
     * @param {String|Array} [targetPeerId] - The target peer id to send message to.
     * - When provided as an Array, it will send the message to only peers which ids are in the list.
     * - When not provided, it will broadcast the message to all connected peers in the room.
     * @example
     * Example 1: Broadcasting to all peers
     *
     * let sendMessage = (roomName) => {
     *    const message = "Hi!";
     *    const selectedPeers = this.state[location]['selectedPeers'];
     *    skylink.sendMessage(roomName, message, selectedPeers);
     * }
     * @example
     * Example 2: Broadcasting to selected peers
     *
     * let sendMessage = (roomName) => {
     *    const message = "Hi all!";
     *    const selectedPeers = ["PeerID_1", "PeerID_2"];
     *    skylink.sendMessage(roomName, message, selectedPeers);
     * }
     * @example
     * Example 3: Muting the remote peer
     *
     * // The local peer - send custom message object
     * const msgObject = JSON.stringify({ data: "data-content", type: "muteStreams", audio: true, video: false });
     * this.skylink.sendP2PMessage(roomName, msgObject);
     *
     * // The remote peer - add an event listener for ON_INCOMING_MESSAGE and check for the custom message object
     * SkylinkEventManager.addEventListener(skylinkConstants.EVENTS.ON_INCOMING_MESSAGE, (evt) => {
     *    const {message, peerId, isSelf, room} = evt.detail;
     *    const msg = JSON.parse(message.content);
     *    if (msg.type === "muteStreams") {
     *       skylink.muteStreams(roomName, { audioMuted: msg.audio, videoMuted: msg.video });
     *      }
     *    });
     * @fires {@link SkylinkEvents.event:ON_INCOMING_MESSAGE|ON_INCOMING_MESSAGE} event
     * @alias Skylink#sendMessage
     * @since 0.4.0
     */
    sendMessage(roomName = '', message = '', targetPeerId = '') {
      Messaging.sendMessage(roomName, message, targetPeerId);
    }

    /**
     * @description Method that retrieves the message history from server if Persistent Message feature is enabled for the key.
     * @param {String} roomName - The name of the room.
     * @example
     * Example 1: Retrieving stored messages
     *
     * // add event listener to catch storedMessages event
     * SkylinkEventManager.addEventListener(SkylinkConstants.EVENTS.STORED_MESSAGES, (evt) => {
     *    const { storedMessages } = evt.detail;
     *    storedMessages.content.forEach((message) => {
     *      // do something
     *    })
     * });
     *
     * let getStoredMessages = (roomName) => {
     *    this.skylink.getStoredMessages(roomName);
     * }
     * @fires {@link SkylinkEvents.event:STORED_MESSAGES|STORED_MESSAGES} event
     * @alias Skylink#getStoredMessages
     * @since 2.1
     */
    getStoredMessages(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        new AsyncMessaging(roomState).getStoredMessages();
      }
    }

    /**
     * @description Method that gets the list of connected peers in the room.
     * @param {String} roomName - The name of the room.
     * @return {JSON.<String, peerInfo>|null} <code>peerInfo</code> keyed by peer id. Additional <code>isSelf</code> flag to determine if peer is user or not. Null is returned if room has not been created.
     * @example
     * Example 1: Get the list of currently connected peers in the same room
     *
     * const peers = skylink.getPeersInRoom();
     * @alias Skylink#getPeersInRoom
     */
    getPeersInRoom(roomName) {
      if (getParamValidity(roomName, 'roomName', 'getPeersInRoom')) {
        return PeerConnection.getPeersInRoom(roomName);
      }

      return null;
    }

    /**
     * @description Method that returns the user / peer current session information.
     * @param {String} roomName - The name of the room.
     * @param {String|null} [peerId] The peer id to return the current session information from.
     * - When not provided or that the peer id is does not exists, it will return
     *   the user current session information.
     * @return {peerInfo|null} The user / peer current session information.
     * @example
     * Example 1: Get peer current session information
     *
     * const peerPeerInfo = skylink.getPeerInfo(peerId);
     * @example
     * Example 2: Get user current session information
     *
     * const userPeerInfo = skylink.getPeerInfo();
     * @alias Skylink#getPeerInfo
     */
    getPeerInfo(roomName, peerId = null) {
      const roomState = getRoomStateByName(roomName);
      if (peerId && roomState) {
        return PeerData.getPeerInfo(peerId, roomState.room);
      }

      if (!peerId && roomState) {
        return PeerData.getCurrentSessionInfo(roomState.room);
      }

      return null;
    }

    /**
     * @description Method that returns the user / peer current custom data.
     * @param {String} roomName - The room name.
     * @param {String} [peerId] - The peer id to return the current custom data from.
     * - When not provided or that the peer id is does not exists, it will return
     *   the user current custom data.
     * @return {Object|null} The user / peer current custom data.
     * @example
     * Example 1: Get peer current custom data
     *
     * const peerUserData = skylink.getUserData(peerId);
     * @example
     * Example 2: Get user current custom data
     *
     * const userUserData = skylink.getUserData();
     * @alias Skylink#getUserData
     */
    getUserData(roomName, peerId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState && roomState.room) {
        return PeerData.getUserData(roomState, peerId);
      }

      return null;
    }

    /**
     * @description Method that overwrites the user current custom data.
     * @param {String} roomName - The room name.
     * @param {JSON|String} userData - The updated custom data.
     * @fires {@link SkylinkEvents.event:PEER_UPDATED|PEER_UPDATED} event if peer is in room with <code>isSelf=true</code>.
     * @example
     * Example 1: Update user custom data after joinRoom()
     *
     * // add event listener to catch setUserData changes
     * SkylinkEventManager.addEventListener(SkylinkConstants.peerUpdated, (evt) => {
     *    const { detail } = evt;
     *   // do something
     * });
     *
     * const userData = "afterjoin";
     * skylink.setUserData(userData);
     * @alias Skylink#setUserData
     */
    setUserData(roomName, userData) {
      const roomState = getRoomStateByName(roomName);
      if (roomState && roomState.room) {
        return PeerData.setUserData(roomState.room, userData);
      }

      return null;
    }

    /**
     * @description Method that retrieves peer connection bandwidth and ICE connection stats.
     * @description Method that retrieves peer connection bandwidth and ICE connection stats.
     * @param {String} roomName - The room name.
     * @param {String|Array} [peerId] The target peer id to retrieve connection stats from.
     * - When provided as an Array, it will retrieve all connection stats from all the peer ids provided.
     * - When not provided, it will retrieve all connection stats from the currently connected peers in the room.
     * @return {Promise<Array.<object.<String|statistics>>>}
     * @example
     * Example 1: Retrieving connection statistics from all peers in a room
     *
     * skylink.getConnectionStatus("Room_1")
     *  .then((statistics) => {
     *    // handle statistics
     *  }
     *  .catch((error) => {
     *    // handle error
     *  }
     * @example
     * Example 2: Retrieving connection statistics from selected peers
     *
     * const selectedPeers = ["peerId_1", "peerId_2"];
     * skylink.getConnectionStatus("Room_1", selectedPeers)
     *  .then((statistics) => {
     *    // handle statistics
     *  }
     *  .catch((error) => {
     *    // handle error
     *  }
     * @alias Skylink#getConnectionStats
     */
    getConnectionStatus(roomName, peerId) {
      const roomState = getRoomStateByName(roomName);

      return PeerConnection.getConnectionStatus(roomState, peerId);
    }

    /**
     * @description Method that retrieves the list of peer ids from rooms within the same App space.
     * <blockquote class="info">
     *   Note that this feature requires <code>"isPrivileged"</code> flag to be enabled for the App Key
     *   provided in the {@link initOptions}, as only Users connecting using
     *   the App Key with this flag enabled (which we call privileged Users / peers) can retrieve the list of
     *   peer ids from rooms within the same App space.
     *   {@link http://support.temasys.io/support/solutions/articles/12000012342-what-is-a-privileged-key-|What is a privileged key?}
     * </blockquote>
     * @param {String} roomName - The room name
     * @param {Boolean} [showAll=false] - The flag if Signaling server should also return the list of privileged peer ids.
     * By default, the Signaling server does not include the list of privileged peer ids in the return result.
     * @return {Promise.<Object.<String, Array<String>>>} peerList - Array of peer ids, keyed by room name.
     * @fires {@link SkylinkEvents.event:GET_PEERS_STATE_CHANGE|GET PEERS STATE CHANGE} event with parameter payload <code>state=ENQUIRED</code> upon calling <code>getPeers</code> method.
     * @fires {@link SkylinkEvents.event:GET_PEERS_STATE_CHANGE|GET PEERS STATE CHANGE} event with parameter payload <code>state=RECEIVED</code> when peer list is received from Signaling server.
     * @example
     * Example 1: Retrieve un-privileged peers
     *
     * skylink.getPeers(location)
     *  .then((result) => {
     *      // do something
     *  })
     *  .catch((error) => {
     *      // handle error
     *  })
     *
     * Example 2: Retrieve all (privileged and un-privileged) peers
     *
     * skylink.getPeers(location, true)
     *  .then((result) => {
     *      // do something
     *  })
     *  .catch((error) => {
     *      // handle error
     *  })
     * @alias Skylink#getPeers
     * @since 0.6.1
     */
    getPeers(roomName, showAll = false) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerPrivileged.getPeerList(roomState.room, showAll);
      }

      return null;
    }

    /**
     * @typedef {Object} dataChannelInfo
     * @property {String} channelName - The data channel id.
     * @property {String} channelProp - The data channel property.
     * @property {String} channelType - The data channel type.
     * @property {String} currentTransferId - The data channel connection
     *   current progressing transfer session. Defined as <code>null</code> when there is
     *   currently no transfer session progressing on the data channel connection
     * @property {String} currentStreamId - The data channel connection
     *   current data streaming session id. Defined as <code>null</code> when there is currently
     *   no data streaming session on the data channel connection.
     * @property {String} readyState - The data channel connection readyState.
     * @property {String} bufferedAmountLow - The data channel buffered amount.
     * @property {String} bufferedAmountLowThreshold - The data channel
     *   buffered amount threshold.
     */
    /**
     * @description Method that gets the current list of connected peers data channel connections in the room.
     * @param {String} roomName - The room name.
     * @return {Object.<string, Object.<String, dataChannelInfo>>} - The list of peer data channels keyed by peer id, keyed by data channel id.
     * @example
     * Example 1: Get the list of current peers data channels in the same room
     *
     * const channels = skylink.getPeersDataChannels("Room_1");
     * @alias Skylink#getPeersDataChannels
     * @since 0.6.18
     */
    getPeersDataChannels(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerData.getPeersDataChannels(roomState);
      }
      return null;
    }

    /**
     * @typedef {Object} customSettings - The peer stream and data settings.
     * @property {Boolean|JSON} data - The flag if peer has any data channel connections enabled.
     *   If <code>isSelf</code> value is <code>true</code>, this determines if user allows
     *   data channel connections, else if value is <code>false</code>, this determines if peer has any active
     *   data channel connections (where {@link SkylinkEvents.event:onDataChannelStateChanged|onDataChannelStateChangedEvent}
     *   triggers <code>state</code> as <code>OPEN</code> and <code>channelType</code> as
     *   <code>MESSAGING</code> for peer) with peer.
     * @property {Boolean|JSON} audio - The peer stream audio settings keyed by stream id.
     *   When defined as <code>false</code>, it means there is no audio being sent from peer.
     * @property {Boolean} audio[streamId].stereo - The flag if stereo band is configured
     *   when encoding audio codec is <code>OPUS</code> for receiving audio data.
     * @property {Boolean} audio[streamId].echoCancellation - The flag if echo cancellation is enabled for audio tracks.
     * @property {String} [audio[streamId].deviceId] - The peer stream audio track source id of the device used.
     * @property {Boolean} audio[streamId].exactConstraints - The flag if peer stream audio track is sending exact
     *   requested values of <code>audio.deviceId</code> when provided.
     * @property {Boolean|JSON} video - The peer stream video settings keyed by stream id.
     *   When defined as <code>false</code>, it means there is no video being sent from peer.
     * @property {JSON} [video[streamId].resolution] - The peer stream video resolution.
     *   [Rel: {@link SkylinkConstants.VIDEO_RESOLUTION|VIDEO_RESOLUTION}]
     * @property {Number|JSON} video[streamId].resolution.width - The peer stream video resolution width or
     *   video resolution width settings.
     *   When defined as a JSON Object, it is the user set resolution width settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Number|JSON} video[streamId].resolution.height - The peer stream video resolution height or
     *   video resolution height settings.
     *   When defined as a JSON Object, it is the user set resolution height settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Number|JSON} [video[streamId].frameRate] - The peer stream video
     *   <a href="https://en.wikipedia.org/wiki/Frame_rate">frameRate</a> per second (fps) or video frameRate settings.
     *   When defined as a JSON Object, it is the user set frameRate settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Boolean} video[streamId].screenshare - The flag if peer stream is a screensharing stream.
     * @property {String} [video[streamId].deviceId] - The peer stream video track source id of the device used.
     * @property {Boolean} video[streamId].exactConstraints The flag if peer stream video track is sending exact
     *   requested values of <code>video.resolution</code>,
     *   <code>video.frameRate</code> and <code>video.deviceId</code>
     *   when provided.
     * @property {String|JSON} [video[streamId].facingMode] - The peer stream video camera facing mode.
     *   When defined as a JSON Object, it is the user set facingMode settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Object} maxBandwidth The maximum streaming bandwidth sent from peer.
     * @property {Number} [maxBandwidth.audio] - The maximum audio streaming bandwidth sent from peer.
     * @property {Number} [maxBandwidth.video] - The maximum video streaming bandwidth sent from peer.
     * @property {Number} [maxBandwidth.data] - The maximum data streaming bandwidth sent from peer.
     * @property {Object} mediaStatus The peer streaming media status.
     * @property {Boolean} mediaStatus.audioMuted -  The value of the audio status.
     *   <small>If peer <code>mediaStatus</code> is <code>-1</code>, audio is not present in the stream. If peer <code>mediaStatus</code> is <code>1</code>, audio is present
     *   in the stream and active (not muted). If peer <code>mediaStatus</code> is <code>0</code>, audio is present in the stream and muted.
     *   </small>
     * @property {Boolean} mediaStatus.videoMuted - The value of the video status.
     *   <small>If peer <code>mediaStatus</code> is <code>-1</code>, video is not present in the stream. If peer <code>mediaStatus</code> is <code>1</code>, video is present
     *   in the stream and active (not muted). If peer <code>mediaStatus</code> is <code>0</code>, video is present in the stream and muted.
     *   </small>
     */
    /**
     * @description Method that gets the list of current custom peer settings sent and set.
     * @param {String} roomName - The room name.
     * @return {Object.<String, customSettings>|null} - The peer custom settings keyed by peer id.
     * @example
     * Example 1: Get the list of current peer custom settings from peers in a room.
     *
     * const currentPeerSettings = skylink.getPeersCustomSettings("Room_1");
     * @alias Skylink#getPeersCustomSettings
     * @since 0.6.18
     */
    getPeersCustomSettings(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerData.getPeersCustomSettings(roomState);
      }

      return null;
    }

    /**
     * @description Method that refreshes the main messaging data channel.
     * @param {String} roomName - The room name.
     * @param {String} peerId - The target peer id of the peer data channel to refresh.
     * @return {null}
     * @example
     * Example 1: Initiate refresh data channel
     *
     * skylink.refreshDatachannel("Room_1", "peerID_1");
     *
     * @alias Skylink#refreshDatachannel
     * @since 0.6.30
     */
    refreshDatachannel(roomName, peerId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerConnection.refreshDataChannel(roomState, peerId);
      }

      return null;
    }

    /**
     * @description Method that refreshes peer connections to update with the current streaming.
     * <blockquote class="info">
     *   Note that Edge browser does not support renegotiation.
     *   For MCU enabled peer connections with <code>options.mcuUseRenegoRestart</code> set to <code>false</code>
     *   in the {@link initOptions}, the restart method may differ, you
     *   may learn more about how to workaround it in this article
     *   {@link http://support.temasys.io/support/discussions/topics/12000002853|here}.
     *   For restarts with peers connecting from Android, iOS or C++ SDKs, restarts might not work as written in this article
     *   {@link http://support.temasys.io/support/discussions/topics/12000005188|here}.
     *   Note that this functionality should be used when peer connection stream freezes during a connection.
     *   For a better user experience for only MCU enabled peer connections, the method is throttled when invoked many
     *   times in less than the milliseconds interval configured in {@link initOptions}.
     * </blockquote>
     * @param {String} roomName - The name of the room.
     * @param {String|Array} [targetPeerId] <blockquote class="info">
     *   Note that this is ignored if MCU is enabled for the App Key provided in
     *   {@link initOptions}. <code>refreshConnection()</code> will "refresh"
     *   all peer connections. </blockquote>
     *   - The target peer id to refresh connection with.
     * - When provided as an Array, it will refresh all connections with all the peer ids provided.
     * - When not provided, it will refresh all the currently connected peers in the room.
     * @param {Boolean} [iceRestart=false] <blockquote class="info">
     *   Note that this flag will not be honoured for MCU enabled peer connections where
     *   <code>options.mcuUseRenegoRestart</code> flag is set to <code>false</code> as it is not necessary since for MCU
     *   "restart" case is to invoke {@link Skylink#joinRoom|joinRoom} again, or that it is
     *   not supported by the MCU.</blockquote>
     *   The flag if ICE connections should restart when refreshing peer connections.
     *   This is used when ICE connection state is <code>FAILED</code> or <code>DISCONNECTED</code>, which
     *   can be retrieved with the {@link SkylinkEvents.event:ICE_CONNECTION_STATE|ICE CONNECTION STATE} event.
     * @param {JSON} [options] <blockquote class="info">
     *   Note that for MCU connections, the <code>bandwidth</code>
     *   settings will override for all peers or the current room connection session settings.</blockquote>
     *   The custom peer configuration settings.
     * @param {JSON} [options.bandwidth] The configuration to set the maximum streaming bandwidth to send to peers.
     *   Object signature follows {@link Skylink#joinRoom|joinRoom}
     *   <code>options.bandwidth</code> settings.
     * @return {Promise.<refreshConnectionResolve>} - The Promise will always resolve.
     * @example
     * Example 1: Refreshing a peer connection
     *
     * skylink.refreshConnection(roomName, peerId)
     * .then((result) => {
     *   const failedRefreshIds = Object.keys(result.refreshErrors);
     *   failedRefreshIds.forEach((peerId) => {
     *     // handle error
     *   });
     * });
     *
     * @example
     * Example 2: Refreshing a list of peer connections
     * let selectedPeers = ["peerID_1", "peerID_2"];
     *
     * skylink.refreshConnection(roomName, selectedPeers)
     * .then((result) => {
     *   const failedRefreshIds = Object.keys(result.refreshErrors);
     *   failedRefreshIds.forEach((peerId) => {
     *     // handle error
     *   });
     * });
     * @example
     * Example 3: Refreshing all peer connections
     *
     * skylink.refreshConnection(roomName)
     * .then((result) => {
     *   const failedRefreshIds = Object.keys(result.refreshErrors);
     *   failedRefreshIds.forEach((peerId) => {
     *    // handle error
     *   });
     * });
     * @alias Skylink#refreshConnection
     * @since 0.5.5
     */
    refreshConnection(roomName, targetPeerId, iceRestart, options) {
      const roomState = getRoomStateByName(roomName);

      return PeerConnection.refreshConnection(roomState, targetPeerId, iceRestart, options);
    }

    /**
     * @description Method that returns starts screenshare and returns the stream.
     * @param {String} roomName - The room name.
     * @param {getDisplayMediaOptions} options - Screen share options.
     * @return {MediaStream|null} - The screen share stream.
     * @alias Skylink#shareScreen
     * @since 2.0.0
     */
    shareScreen(roomName, options) {
      const streamId = null;
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        const screenSharing = new ScreenSharing(roomState);
        return screenSharing.start(streamId, options);
      }

      return null;
    }

    /**
     * <blockquote class="info">
     *   For a better user experience, the functionality is throttled when invoked many times in less
     *   than the milliseconds interval configured in the {@link initOptions}.
     * </blockquote>
     * @description Method that retrieves camera stream.
     * <p>Resolves with an array of <code>MediaStreams</code>. First item in array is <code>MediaStream</code> of kind audio and second item is
     * <code>MediaStream</code> of kind video.</p>
     * @param {String|null} roomName - The room name.
     * - If no roomName is passed or <code>getUserMedia()</code> is called before {@link Skylink#joinRoom|joinRoom}, the returned stream will not be associated with a room. The stream must be maintained independently.
     * To stop the stream, call {@link Skylink#stopPrefetchedStream|stopPrefetchedStream} method.
     * @param {getUserMediaOptions} [options] - The camera stream configuration options.
     * - When not provided, the value is set to <code>{ audio: true, video: true }</code>.
     * @return {Promise.<MediaStreams>}
     * @example
     * Example 1: Get both audio and video after joinRoom
     *
     * skylink.getUserMedia(roomName, {
     *     audio: true,
     *     video: true,
     * }).then((streams) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 2: Get only audio
     *
     * skylink.getUserMedia(roomName, {
     *     audio: true,
     *     video: false,
     * }).then((streams) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 3: Configure resolution for video
     *
     * skylink.getUserMedia(roomName, {
     *     audio: true,
     *     video: { resolution: skylinkConstants.VIDEO_RESOLUTION.HD },
     * }).then((streams) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 4: Configure stereo flag for OPUS codec audio (OPUS is always used by default)
     *
     * this.skylink.getUserMedia(roomName, {
     *     audio: {
     *         stereo: true,
     *     },
     *     video: true,
     * }).then((streams) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 5: Get both audio and video before joinRoom
     *
     * // Note: the prefetched stream must be maintained independently
     * skylink.getUserMedia({
     *     audio: true,
     *     video: true,
     * }).then((streams) => // do something)
     * .catch((error) => // handle error);
     * @fires <b>If retrieval of fallback audio stream is successful:</b> <br/> - {@link SkylinkEvents.event:MEDIA_ACCESS_SUCCESS|MEDIA ACCESS SUCCESS} event with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallback=false</code> if initial retrieval is successful.
     * @fires <b>If initial retrieval is unsuccessful:</b> <br/> Fallback to retrieve audio only stream is triggered (configured in {@link initOptions} <code>audioFallback</code>) <br/>&emsp; - {@link SkylinkEvents.event:MEDIA_ACCESS_SUCCESS|MEDIA ACCESS SUCCESS} event{@link SkylinkEvents.event:MEDIA_ACCESS_FALLBACK|MEDIA ACCESS FALLBACK} event with parameter payload <code>state=FALLBACKING</code>, <code>isScreensharing=false</code> and <code>isAudioFallback=true</code> and <code>options.video=true</code> and <code>options.audio=true</code>. <br/> No fallback to retrieve audio only stream <br/> - {@link SkylinkEvents.event:MEDIA_ACCESS_ERROR|MEDIA ACCESS ERROR} event with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallbackError=false</code>.
     * @fires <b>If retrieval of fallback audio stream is successful:</b> <br/> - {@link SkylinkEvents.event:MEDIA_ACCESS_SUCCESS|MEDIA ACCESS SUCCESS} event with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallback=true</code>.
     * @fires <b>If retrieval of fallback audio stream is unsuccessful:</b> <br/> - {@link SkylinkEvents.event:MEDIA_ACCESS_SUCCESS|MEDIA ACCESS SUCCESS} event{@link SkylinkEvents.event:MEDIA_ACCESS_FALLBACK|MEDIA ACCESS FALLBACK} event with parameter payload <code>state=ERROR</code>, <code>isScreensharing=false</code> and <code>isAudioFallback=true</code>. <br/> - {@link SkylinkEvents.event:MEDIA_ACCESS_ERROR|MEDIA ACCESS ERROR} event with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallbackError=true</code>.
     * @alias Skylink#getUserMedia
     * @since 0.5.6
     */
    // eslint-disable-next-line consistent-return
    getUserMedia(roomName = null, options) {
      if (!roomName) {
        return statelessGetUserMedia(options);
      }

      if (isAString(roomName)) {
        const roomState = getRoomStateByName(roomName);
        if (roomState) {
          return MediaStream.processUserMediaOptions(roomState, options);
        }
      } else if (isAObj(roomName)) {
        return statelessGetUserMedia(roomName);
      }
    }

    /**
     * @description Method that stops the {@link Skylink#getUserMedia} stream that is called without roomName param or before {@link Skylink#joinRoom|joinRoom} is called.
     * @param {MediaStream} stream - The prefetched stream.
     * @return {null}
     * @fires {@link SkylinkEvents.event:STREAM_ENDED|STREAM ENDED} event
     * @alias Skylink#stopPrefetchedStream
     * @since 2.0
     * @ignore
     */
    stopPrefetchedStream(stream) {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        dispatchEvent(streamEnded({
          room: null,
          peerId: null,
          peerInfo: null,
          isSelf: true,
          isScreensharing: false,
          streamId: stream.id,
        }));
      }

      return null;
    }

    /**
     * @description Method that stops the screen share stream returned from {@link Skylink#shareScreen|shareScreen} method.
     * @param {String} roomName - The room name.
     * @return {null}
     * @example
     * Example 1
     *
     * skylink.stopScreen(roomName);
     *
     * @fires {@link SkylinkEvents.event:MEDIA_ACCESS_STOPPED|MEDIA ACCESS STOPPED} event with parameter payload <code>isScreensharing</code> value as <code>true</code> and <code>isAudioFallback</code> value as <code>false</code> if there is a screen stream
     * @fires {@link SkylinkEvents.event:STREAM_ENDED|STREAM ENDED} event with parameter payload <code>isSelf</code> value as <code>true</code> and <code>isScreensharing</code> value as <code>true</code> if user is in the room
     * @fires {@link SkylinkEvents.event:PEER_UPDATED|PEER UPDATED} event with parameter payload <code>isSelf</code> value as <code>true</code>
     * @fires {@link SkylinkEvents.event:ON_INCOMING_STREAM|ON INCOMING STREAM} event  with parameter payload <code>isSelf</code> value as <code>true</code> and <code>stream</code> as {@link Skylink#getUserMedia} stream</a> if there is an existing <code>userMedia</code> stream
     * @alias Skylink#stopScreen
     * @since 0.6.0
     */
    stopScreen(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        const screenSharing = new ScreenSharing(roomState);
        screenSharing.stop();
      }

      return null;
    }

    /**
     * @description Method that stops the <code>userMedia</code> stream returned from {@link Skylink#getUserMedia|getUserMedia}</a> method.
     * @param {String} roomName - The room name.
     * @param {String} streamId - The stream id of the stream to stop. If streamId is not set, all <code>userMedia</code> streams will be stopped.
     * @return {Promise}
     * @example
     * skylink.stopStreams(roomName)
     * .then(() => // do some thing);
     * @fires {@link SkylinkEvents.event:MEDIA_ACCESS_STOPPED|MEDIA ACCESS STOPPED} event with parameter payload <code>isSelf=true</code> and <code>isScreensharing=false</code> if there is a <code>getUserMedia</code> stream.
     * @fires {@link SkylinkEvents.event:STREAM_ENDED|STREAM ENDED} event with parameter payload <code>isSelf=true</code> and <code>isScreensharing=false</code> if there is a <code>getUserMedia</code> stream and user is in a room.
     * @fires {@link SkylinkEvents.event:PEER_UPDATED|PEER UPDATED} event with parameter payload <code>isSelf=true</code>.
     * @alias Skylink#stopStreams
     * @since 0.5.6
     */
    stopStreams(roomName, streamId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return MediaStream.stopStreams(roomState, streamId);
      }

      return null;
    }

    /**
     * @description Method that stops the room session.
     * @param {String} roomName  - The room name to leave.
     * @return {Promise.<String>}
     * @example
     * Example 1:
     *
     * // add event listener to catch peerLeft events when remote peer leaves room
     * SkylinkEventManager.addEventListener(SkylinkConstants.EVENTS.PEER_LEFT, (evt) => {
     *    const { detail } = evt;
     *   // handle remote peer left
     * });
     *
     * skylink.leaveRoom(roomName)
     * .then((roomName) => {
     *   // handle local peer left
     * })
     * .catch((error) => // handle error);
     * @fires {@link SkylinkEvents.event:PEER_LEFT|PEER LEFT} event on the remote end of the connection.
     * @alias Skylink#leaveRoom
     * @since 0.5.5
     */
    leaveRoom(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return Room.leaveRoom(roomState);
      }

      return null;
    }

    /**
     * @description Method that stops all room sessions.
     * @return {Promise.<Array.<String>>}
     * @alias Skylink#leaveAllRooms
     * @since 2.0.0
     */
    leaveAllRooms() {
      return Room.leaveAllRooms();
    }

    /**
     * @description Method that starts a recording session.
     * <blockquote class="info">
     *   Note that this feature requires MCU and recording to be enabled for the App Key provided in
     *   {@link initOptions}. If recording feature is not available to
     *   be enabled in the {@link https://console.temasys.io|Temasys Developer Console}, please contact us on our support portal {@link http://support.temasys.io|here}.
     * </blockquote>
     * @param {String} roomName - The room name.
     * @return {Promise<String>} recordingId - The recording session id.
     * @example
     * Example 1: Start a recording session
     *
     * skylink.startRecording(roomName)
     * .then(recordingId => {
     *   // do something
     * })
     * .catch(error => {
     *   // handle error
     * });
     * @fires {@link SkylinkEvents.event:RECORDING_STATE|RECORDING STATE} event with payload <code>state=START</code> if recording has started
     * successfully.
     * @fires {@link SkylinkEvents.event:RECORDING_STATE|RECORDING STATE} event with payload <code>error</code> if an error occurred during recording.
     * @alias Skylink#startRecording
     * @since 0.6.16
     */
    startRecording(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return Recording.start(roomState);
      }

      return null;
    }

    /**
     * @description Method that stops a recording session.
     * <blockquote class="info">
     *   <ul>
     *     <li>
     *      Note that this feature requires MCU and recording to be enabled for the App Key provided in the
     *      {@link initOptions}. If recording feature is not available to be enabled in the {@link https://console.temasys.io|Temasys Developer Console},
     *      please contact us on our support portal {@link http://support.temasys.io|here}.
     *    </li>
     *    <li>
     *      It is mandatory for the recording session to have elapsed for more than 4 minutes before calling <code>stopRecording</code> method.
     *    </li>
     *   </ul>
     * </blockquote>
     * @param {String} roomName - The room name.
     * @return {Promise<String>} recordingId - The recording session id.
     * @example
     * Example 1: Stop the recording session
     *
     * skylink.stopRecording(roomName)
     * .then(recordingId => {
     *   // do something
     * })
     * .catch(error => {
     *   // handle error
     * });
     * @fires {@link SkylinkEvents.event:RECORDING_STATE|RECORDING STATE} event with payload <code>state=STOP</code> if recording has stopped
     * successfully.
     * @fires {@link SkylinkEvents.event:RECORDING_STATE|RECORDING STATE} event with payload <code>error</code> if an error occurred during recording.
     * @alias Skylink#stopRecording
     * @since 0.6.16
     */
    stopRecording(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return Recording.stop(roomState);
      }

      return null;
    }

    /**
     * @description Method that locks a room.
     * @param {String} roomName - The room name.
     * @return {Boolean}
     * @fires {@link SkylinkEvents.event:ROOM_LOCK|ROOM LOCK} event with payload parameters <code>isLocked=true</code> when the room is successfully locked.
     * @example
     * // add event listener to listen for room locked state when peer tries to join a locked room
     * skylinkEventManager.addEventListener(SkylinkEvents.SYSTEM_ACTION, (evt) => {
     *   const { detail } = evt;
     *   if (detail.reason === SkylinkConstants.SYSTEM_ACTION.LOCKED') {
     *     // handle event
     *   }
     * }
     *
     * // add event listener to listen for room locked/unlocked event after calling lockRoom method
     * skylinkEventManager.addEventListener(SkylinkEvents.ROOM_LOCK, (evt) => {
     *   const { detail } = evt;
     *   if (detail.isLocked) {
     *     // handle room lock event
     *   } else {
     *     // handle room unlock event
     *   }
     * }
     *
     * skylink.lockRoom(roomName);
     * @alias Skylink#lockRoom
     * @since 0.5.0
     */
    lockRoom(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return Room.lockRoom(roomState);
      }

      return null;
    }

    /**
     * @description Method that unlocks a room.
     * @param {String} roomName - The room name.
     * @return {Boolean}
     * @fires {@link SkylinkEvents.event:ROOM_LOCK|ROOM LOCK} event with payload parameters <code>isLocked=false</code> when the room is successfully locked.
     * @alias Skylink#unlockRoom
     * @since 0.5.0
     */
    unlockRoom(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return Room.unlockRoom(roomState);
      }

      return null;
    }

    /**
     * @typedef {Object} recordingSessions
     * @property {Object<string, Object>} #recordingId - The recording session keyed by recording id.
     * @property {Boolean} #recordingId.active - The flag that indicates if the recording session is currently active.
     * @property {String} #recordingId.state - The current recording state. [Rel: {@link SkylinkConstants.RECORDING_STATE|RECORDING_STATE}]
     * @property {String} #recordingId.startedStateTime - The recording session started DateTime in
     *   {@link https://en.wikipedia.org/wiki/ISO_8601|ISO}.Note that this value may not be
     *   very accurate as this value is recorded when the start event is received.
     * @property {String} #recordingId.endedDateTime - The recording session ended DateTime in
     *   {@link https://en.wikipedia.org/wiki/ISO_8601|ISO}.Note that this value may not be
     *   very accurate as this value is recorded when the stop event is received.
     *   Defined only after <code>state</code> has triggered <code>STOP</code>.
     * @property {String} #recordingId.mixingDateTime - The recording session mixing completed DateTime in
     *   {@link https://en.wikipedia.org/wiki/ISO_8601|ISO}.Note that this value may not be
     *   very accurate as this value is recorded when the mixing completed event is received.
     *   Defined only when <code>state</code> is <code>LINK</code>.
     * @property {String} #recordingId.links - The recording session links.
     *   Object signature matches the <code>link</code> parameter payload received in the
     *   {@link SkylinkEvents.event:RECORDING_STATE|RECORDING STATE} event event.
     * @property {Error} #recordingId.error - The recording session error.
     *   Defined only when <code>state</code> is <code>ERROR</code>.
     */
    /**
     * Gets the list of current recording sessions since user has connected to the room.
     * @description Method that retrieves the list of recording sessions.
     * <blockquote class="info">
     *   Note that this feature requires MCU and recording to be enabled for the App Key provided in
     *   {@link initOptions}. If recording feature is not available to be enabled in the {@link https://console.temasys.io|Temasys Developer Console},
     *   please contact us on our support portal {@link http://support.temasys.io|here}.
     * </blockquote>
     * @param {String} roomName - The room name.
     * @return {recordingSessions|{}} The list of recording sessions.
     * @example
     * Example 1: Get recording sessions
     *
     * skylink.getRecordings(roomName);
     * @alias Skylink#getRecordings
     * @since 0.6.16
     */
    getRecordings(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return Recording.getRecordings(roomState);
      }

      return null;
    }

    /**
     * @description Method that mutes both <code>userMedia</code> [{@link Skylink#getUserMedia|getUserMedia}] stream and
     * <code>screen</code> [{@link Skylink#shareScreen|shareScreen}] stream.
     * @param {String} roomName - The room name.
     * @param {JSON} options - The streams muting options.
     * @param {Boolean} [options.audioMuted=true] - The flag if all streams audio
     *   tracks should be muted or not.
     * @param {Boolean} [options.videoMuted=true] - The flag if all streams video
     *   tracks should be muted or not.
     * @param {String} [streamId] - The id of the stream to mute.
     * @return {null}
     * @example
     * Example 1: Mute both audio and video tracks in all streams
     *
     * skylink.muteStreams(roomName, {
     *    audioMuted: true,
     *    videoMuted: true
     * });
     * @example
     * Example 2: Mute only audio tracks in all streams
     *
     * skylink.muteStreams(roomName, {
     *    audioMuted: true,
     *    videoMuted: false
     * });
     * @example
     * Example 3: Mute only video tracks in all streams
     *
     * skylink.muteStreams(roomName, {
     *    audioMuted: false,
     *    videoMuted: true
     * });
     * @fires <b>On local peer:</b> {@link SkylinkEvents.event:LOCAL_MEDIA_MUTED|LOCAL MEDIA MUTED} event, {@link SkylinkEvents.event:STREAM_MUTED|STREAM MUTED} event, {@link SkylinkEvents.event:PEER_UPDATED|PEER UPDATED} event with payload parameters <code>isSelf=true</code> and <code>isAudio=true</code> if a local audio stream is muted or <code>isVideo</code> if local video stream is muted.
     * @fires <b>On remote peer:</b> {@link SkylinkEvents.event:STREAM_MUTED|STREAM MUTED} event, {@link SkylinkEvents.event:PEER_UPDATED|PEER UPDATED} event with with parameter payload <code>isSelf=false</code> and <code>isAudio=true</code> if a remote audio stream is muted or <code>isVideo</code> if remote video stream is muted.
     * @alias Skylink#muteStreams
     * @since 0.5.7
     */
    muteStreams(roomName, options = { audioMuted: true, videoMuted: true }, streamId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return MediaStream.muteStreams(roomState, options, streamId);
      }

      return null;
    }

    /**
     * @description Method that starts a RTMP session. [Beta]
     * <blockquote class="info">
     *   Note that this feature requires MCU to be enabled for the App Key provided in the
     *   {@link initOptions}.
     * </blockquote>
     * @param {String} roomName - The room name.
     * @param {String} streamId - The stream id to live stream for the session.
     * @param {String} endpoint - The RTMP endpoint.
     * @return {Promise<String>} rtmpId - The RTMP session id.
     * @example
     * Example 1: Start a rtmp session
     *
     * skylink.startRTMPSession(roomName, streamId, endpoint)
     * .then(rtmpId => {
     *   // do something
     * })
     * .catch(error => {
     *   // handle error
     * });
     * @fires {@link SkylinkEvents.event:RTMP_STATE|RTMP STATE} event with parameter payload <code>state=START</code>.
     * @alias Skylink#startRTMPSession
     * @since 0.6.36
     */
    startRTMPSession(roomName, streamId, endpoint) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return RTMP.startSession(roomState, streamId, endpoint);
      }

      return null;
    }

    /**
     * @description Method that stops a RTMP session. [Beta]
     * <blockquote class="info">
     *   Note that this feature requires MCU to be enabled for the App Key provided in {@link initOptions}.
     * </blockquote>
     * @param {String} roomName - The room name.
     * @param {String} rtmpId - The RTMP session id.
     * @return {Promise<String>}
     * @example
     * Example 1: Stop rtmp session
     *
     * skylink.stopRTMPSession(roomName, rtmpId)
     * .then(rtmpId => {
     *   // do something
     * })
     * .catch(error => {
     *   // handle error
     * });
     * @fires {@link SkylinkEvents.event:RTMP_STATE|RTMP STATE} event with parameter payload <code>state=STOP</code>.
     * @alias Skylink#stopRTMPSession
     * @since 0.6.36
     */
    stopRTMPSession(roomName, rtmpId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return RTMP.stopSession(roomState, rtmpId);
      }
      return null;
    }

    /**
       * @typedef {Object} streamSources
       * @property {Object} audio - The list of audio input (microphone) and output (speakers) sources.
       * @property {Array.<Object>} audio.input - The list of audio input (microphone) sources.
       * @property {String} audio.input.deviceId The audio input source item device id.
       * @property {String} audio.input.label The audio input source item device label name.
       * @property {String} [audio.input.groupId] The audio input source item device physical device id.
       * Note that there can be different <code>deviceId</code> due to differing sources but can share a
       * <code>groupId</code> because it's the same device.
       * @property {Array.<Object>} audio.output - The list of audio output (speakers) sources.
       * Object signature matches <code>audio.input</code> format.
       * @property {Object} video - The list of video input (camera) sources.
       * @property {Array.<Object>} video.input - The list of video input (camera) sources.
       * Object signature matches <code>audio.input</code> format.
       */
    /**
     * @description Method that returns the camera and microphone sources.
     * @return {Promise.<streamSources>} outputSources
     * @alias Skylink#getStreamSources
     * @example
     * Example 1: Get media sources before joinRoom - only available on Chrome browsers
     *
     * const audioInputDevices = [];
     * const videoInputDevices = [];
     *
     * skylink.getStreamSources.then((sources) => {
     *   audioInputDevices = sources.audio.input;
     *   videoInputDevices = sources.video.input;
     * }).catch((error) => // handle error);
     *
     * skylink.getUserMedia(roomName, {
     *   audio: {
     *     deviceId: audioInputDevices[0].deviceId,
     *   },
     *   video: {
     *     deviceId: videoInputDevices[0].deviceId,
     *   }
     * }).then((streams) => // do something)
     * .catch((error) => // handle error);
     */
    getStreamSources() {
      return MediaStream.getStreamSources();
    }

    /**
     * @description Method that sends a new <code>userMedia</code> stream to all connected peers in a room.
     * <p>If options are passed as argument into the method, it resolves with an array of <code>MediaStreams</code>. First item in array is
     * <code>MediaStream</code> of kind audio and second item is <code>MediaStream</code> of kind video. Otherwise it resolves with the array or
     * <code>MediaStream</code></p>
     * @param {String} roomName - The room name.
     * @param {JSON|MediaStream|Array.<MediaStream>} options - The {@link Skylink#getUserMedia|getUserMedia} <code>options</code> parameter
     * settings. The MediaStream to send to the remote peer or array of MediaStreams.
     * - When provided as a <code>MediaStream</code> object, this configures the <code>options.audio</code> and
     *   <code>options.video</code> based on the tracks available in the <code>MediaStream</code> object.
     *   Object signature matches the <code>options</code> parameter in the
     *   <code>{@link Skylink#getUserMedia|getUserMedia}</code> method</a>.
     * @return {Promise.<MediaStreams>}
     * @example
     * Example 1: Send new MediaStream with audio and video
     *
     * let sendStream = (roomName) => {
     * const options = { audio: true, video: true };
     *
     * // Add listener to incomingStream event
     * SkylinkEventManager.addEventListener(SkylinkConstants.EVENTS.ON_INCOMING_STREAM, (evt) => {
     *   const { detail } = evt;
     *   window.attachMediaStream(localVideoEl, detail.stream);
     * })
     *
     * skylink.sendStream(roomName, options)
     *  // streams can also be obtained from resolved promise
     *  .then((streams) => {
     *        if (streams[0]) {
     *          window.attachMediaStream(audioEl, streams[0]); // first item in array is an audio stream
     *        }
     *        if (streams[1]) {
     *          window.attachMediaStream(videoEl, streams[1]); // second item in array is a video stream
     *        }
     *    })
     *   .catch((error) => { console.error(error) });
     * }
     *
     * Example 2: Use pre-fetched media streams
     *
     * const prefetchedStreams = null;
     * skylink.getUserMedia(null, {
     *    audio: { stereo: true },
     *    video: true,
     *    })
     *    .then((streams) => {
     *      prefetchedStream = streams
     * });
     *
     * skylink.sendStream(roomName, prefetchedStreams)
     *   .catch((error) => { console.error(error) });
     * }
     *
     * @fires {@link SkylinkEvents.event:MEDIA_ACCESS_SUCCESS|MEDIA ACCESS SUCCESS} event with parameter payload <code>isScreensharing=false</code> and
     * <code>isAudioFallback=false</code> if <code>userMedia</code> <code>options</code> is passed into
     * <code>sendStream</code> method.
     * @fires {@link SkylinkEvents.event:ON_INCOMING_STREAM|ON INCOMING STREAM} event with parameter payload <code>isSelf=true</code> and
     * <code>stream</code> as <code>userMedia</code> stream.
     * @fires {@link SkylinkEvents.event:PEER_UPDATED|PEER UPDATED} event with parameter payload <code>isSelf=true</code>.
     * @alias Skylink#sendStream
     * @since 0.5.6
     */
    sendStream(roomName, options) {
      const roomState = getRoomStateByName(roomName);

      return MediaStream.sendStream(roomState, options);
    }

    /**
     * @typedef {Object.<String, Object>} streamsList
     * @property {Object.<String, Object>} #peerId - Peer streams info keyed by peer id.
     * @property {Boolean} #peerId.isSelf - The flag if the peer is local or remote.
     * @property {Object} #peerId.streams - The peer streams.
     * @property {Object} #peerId.streams.audio - The peer audio streams keyed by streamId.
     * @property {MediaStream} #peerId.streams.audio#streamId - streams keyed by stream id.
     * @property {Object} #peerId.streams.video - The peer video streams keyed by streamId.
     * @property {MediaStream} #peerId.streams.video#streamId - streams keyed by stream id.
     * @property {Object} #peerId.streams.screenShare - The peer screen share streams keyed by streamId.
     * @property {MediaStream} #peerId.streams.screenShare#streamId - streams keyed by stream id.
     */
    /**
     * @description Method that returns the list of connected peers streams in the room both user media streams and screen share streams.
     * @param {String} roomName - The room name.
     * @param {Boolean} [includeSelf=true] - The flag if self streams are included.
     * @return {JSON.<String, streamsList>} - The list of peer stream objects keyed by peer id.
     * @example
     * Example 1: Get the list of current peers streams in the same room
     *
     * const streams = skylink.getStreams("Room_1");
     * @alias Skylink#getStreams
     * @since 0.6.16
     */
    getStreams(roomName, includeSelf = true) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return MediaStream.getStreams(roomState, includeSelf);
      }

      return null;
    }

    /**
     * @description Method that generates an <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier">UUID</a> (Unique ID).
     * @return {String} Returns a generated UUID (Unique ID).
     * @alias Skylink#generateUUID
     * @since 0.5.9
     */
    generateUUID() {
      return generateUUID();
    }

    /**
     * @description Method that stores a secret and secret id pair used for encrypting and decrypting messages.
     * @param {String} roomName - The room name.
     * @param {String} secret - A secret to use for encrypting and decrypting messages.
     * @param {String} secretId - The id of the secret.
     * @alias Skylink#setEncryptSecret
     * @since 2.0.0
     */
    setEncryptSecret(roomName = '', secret = '', secretId = '') {
      const roomState = getRoomStateByName(roomName);
      const encryption = new EncryptedMessaging(roomState);
      return encryption.setEncryptSecret(secret, secretId);
    }

    /**
     * @description Method that returns all the secret and secret id pairs.
     * @param {String} roomName - The room name.
     * @returns {Object|{}}
     * @alias Skylink#getEncryptSecrets
     * @since 2.0.0
     */
    getEncryptSecrets(roomName = '') {
      const roomState = getRoomStateByName(roomName);
      const encryption = new EncryptedMessaging(roomState);
      return encryption.getEncryptSecrets();
    }

    /**
     * @description Method that deletes an encrypt secret.
     * @param {String} roomName - The room name.
     * @param {String} [secretId] - The id of the secret to be deleted. If no secret id is provided, all secrets will be deleted.
     * @alias Skylink#deleteEncryptSecrets
     * @since 2.0.0
     */
    deleteEncryptSecrets(roomName = '', secretId = '') {
      const roomState = getRoomStateByName(roomName);
      const encryption = new EncryptedMessaging(roomState);
      return encryption.deleteEncryptSecrets(secretId);
    }

    /**
     * @description Method that sets the secret to be used in encrypting and decrypting messages.
     * @param {String} roomName - The room name.
     * @param {String} secretId - The id of the secret to be used for encrypting and decrypting messages.
     * @alias Skylink#setSelectedSecret
     * @since 2.0.0
     */
    setSelectedSecret(roomName = '', secretId = '') {
      const roomState = getRoomStateByName(roomName);
      const encryption = new EncryptedMessaging(roomState);
      encryption.setSelectedSecretId(secretId);
    }

    /**
     * @description Method that returns the secret used in encrypting and decrypting messages.
     * @param {String} roomName - The room name.
     * @param {String} secretId - The id of the secret.
     * @returns {String} secret - The secret used for encrypting and decrypting messages.
     * @alias Skylink#getSelectedSecret
     * @since 2.0.0
     */
    getSelectedSecret(roomName, secretId) {
      const roomState = getRoomStateByName(roomName);
      const encryption = new EncryptedMessaging(roomState);
      return encryption.getSelectedSecretId(secretId);
    }

    /**
     * @description Method that overrides the persistent message feature configured at the key level.
     * <blockquote class="info">
     *   Note that to set message persistence at the app level, the persistent message feature MUST be enabled at the key level in the Temasys
     *   Developers Console. Messages will also only be persisted if the messages are encrypted, are public messages and, are sent via the signaling
     *   server using the {@link Skylink#sendMessage|sendMessage} method.
     * </blockquote>
     * @param {String} roomName - The room name.
     * @param {Boolean} isPersistent - The flag if messages should be persisted.
     * @alias Skylink#setMessagePersistence
     * @since 2.0.0
     */
    setMessagePersistence(roomName, isPersistent) {
      const roomState = getRoomStateByName(roomName);
      const asyncMessaging = new AsyncMessaging(roomState);
      return asyncMessaging.setMessagePersistence(isPersistent);
    }

    /**
     * @description Method that retrieves the persistent message feature configured.
     * @param {String} roomName - The room name.
     * @returns {Boolean} isPersistent
     * @alias Skylink#getMessagePersistence
     * @since 2.0.0
     */
    getMessagePersistence(roomName) {
      const roomState = getRoomStateByName(roomName);
      const asyncMessaging = new AsyncMessaging(roomState);
      return asyncMessaging.getMessagePersistence();
    }

    /**
     * @description Method that retrieves the sdk version.
     * @alias Skylink#getSdkVersion
     * @since 2.1.6
     */
    getSdkVersion() {
      return SDK_VERSION;
    }
  }

  /**
   * @description Exports {@link Skylink}, {@link SkylinkLogger} and {@link SkylinkConstants}
   * */

  /**
   * @description AdapterJS provides polyfills and cross-browser mediaStreamHelpers for WebRTC.
   * @see {@link https://github.com/Temasys/AdapterJS}
   * @global
   */
  window.AdapterJS = AdapterJS;
  /**
   * @description Socket.IO enables real-time, bidirectional and event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.
   * @see {@link https://socket.io/}
   * @global
   */
  window.io = io;

  /**
   * @description State manager for accessing SkylinkJS states.
   * @type {SkylinkStates}
   * @private
   */
  const skylinkStates = new SkylinkStates();

  /**
   * @description Stores options passed into init.
   * @type {initOptions}
   * @private
   */
  let initOptions = {};
  let userInitOptions = {};

  /**
   * @class Skylink
   * @classdesc Class representing a SkylinkJS instance.
   * @param {initOptions} options - Skylink authentication and initialisation configuration options.
   * @example
   * import Skylink from 'skylinkjs';
   *
   * const initOptions = {
   *    // Obtain your app key from {@link https://console.temasys.io}
   *    appKey: 'temasys-appKey-XXXXX-XXXXXX',
   *    defaultRoom: "Default_Room",
   * };
   *
   * const skylink = new Skylink(initOptions);
   */
  class Skylink extends SkylinkPublicInterface {
    /**
     * @description Creates a SkylinkJS instance.
     * @param {initOptions} options - Skylink authentication and initialisation configuration options.
     * @private
     */
    constructor(options) {
      super();

      /**
       * @description Init options passed to API server to set certain values.
       * @type {initOptions}
       * @private
       */
      const parsedOptions = new SkylinkAPIServer().init(options);

      Skylink.setInitOptions(parsedOptions);
    }

    /**
     * @description Method that retrieves the Skylink state.
     * @param {SkylinkRoom.id} roomKey - The id/key of the room.
     * @return {SkylinkState| Object}
     * @private
     */
    static getSkylinkState(roomKey = null) {
      if (roomKey) {
        return skylinkStates.getState(roomKey);
      }
      return skylinkStates.getAllStates();
    }

    /**
     * @description Method that sets the Skylink state keyed by room id.
     * @param {SkylinkState} state
     * @param {SkylinkRoom.id} roomKey - The id/key of the room.
     * @private
     */
    static setSkylinkState(state, roomKey) {
      if (roomKey) {
        skylinkStates.setState(state);
      }
    }

    // eslint-disable-next-line consistent-return
    static removeSkylinkState(roomKey) {
      if (roomKey) {
        return skylinkStates.removeStateByRoomId(roomKey);
      }
    }

    // eslint-disable-next-line consistent-return
    static clearRoomStateFromSingletons(roomKey) {
      if (roomKey) {
        return skylinkStates.clearRoomStateFromSingletons(roomKey);
      }
    }

    /**
     * @description Method that retrieves the complete initOptions values (default + user specified).
     * @return {initOptions}
     * @private
     */
    static getInitOptions() {
      return initOptions;
    }

    /**
     * @description Method that stores the complete initOptions values (default + user specified).
     * @param {initOptions} options
     * @private
     */
    static setInitOptions(options) {
      initOptions = options;
    }

    /**
     * @description Method that stores the initOptions specified by the user.
     * @param {initOptions} options
     * @private
     */
    static setUserInitOptions(options) {
      userInitOptions = options;
    }

    /**
     * @description Method that retrieves the initOptions specified by the user.
     * @private
     */
    static getUserInitOptions() {
      return userInitOptions;
    }
  }

  /**
   * This sets the imports that are required for bundling Skylink_RN
   */

  Skylink.SkylinkConstants = SkylinkConstants;
  Skylink.SkylinkEventManager = skylinkEventManager;
  Skylink.SkylinkLogger = logger;

  module.exports = { Skylink };

}(temasysReactNativeWebrtc, io, AdapterJS, CryptoJS));
