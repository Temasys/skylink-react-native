/* SkylinkJS-React-Native v1.0.0 Fri Dec 06 2019 13:59:38 GMT+0800 (Singapore Standard Time) */
    
import io from './node_modules/socket.io-client/dist/socket.io.dev';
import  AdapterJS from 'adapterjs_rn'; // TODO: update once package name is set
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  permissions
} from 'react-native-webrtc'; // TODO: update once package name is set
const reactNativeWebrtc = {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  permissions
};

(function (reactNativeWebrtc, AdapterJS, io) {
  'use strict';

  AdapterJS = AdapterJS && AdapterJS.hasOwnProperty('default') ? AdapterJS['default'] : AdapterJS;
  io = io && io.hasOwnProperty('default') ? io['default'] : io;

  /* AdapterJS-React-Native Fri Dec 06 2019 13:59:38 GMT+0800 (Singapore Standard Time) */

  // AdapterJS_RN will be bundled with Skylink and replace all AdapterJS references
  const AdapterJS_RN = {
    WebRTCPlugin: {
      plugin: null,
    },
    webrtcDetectedBrowser: "react-native",
    webrtcDetectedVersion: "2.x",
    webrtcDetectedType: "react-native",
  };
  AdapterJS_RN.windowClone = Object.create(global.window);

  // SkylinkJS checks for AdapterJS_RN.webRTCReady during init and must return success before it can proceed
  // This is not required in React Native so callback is immediately executed
  AdapterJS_RN.webRTCReady = (callback) => {
    callback();
  };


  AdapterJS_RN.window = {
    getUserMedia: reactNativeWebrtc.mediaDevices.getUserMedia,
    RTCPeerConnection: reactNativeWebrtc.RTCPeerConnection,
    RTCIceCandidate: reactNativeWebrtc.RTCIceCandidate,
    RTCSessionDescription: reactNativeWebrtc.RTCSessionDescription,
    RTCView: reactNativeWebrtc.RTCView,
    MediaStream: reactNativeWebrtc.MediaStream,
    MediaStreamTrack: reactNativeWebrtc.MediaStreamTrack,
    navigator: {
      "getUserMedia": reactNativeWebrtc.mediaDevices.getUserMedia,
      "enumerateDevices": reactNativeWebrtc.mediaDevices.enumerateDevices,
      "platform": "React-Native",
      "userAgent": "React-Native",
      "mediaDevices": {
        "getUserMedia": reactNativeWebrtc.mediaDevices.getUserMedia,
      }
    },
    location: {
      "protocol": "https:",
    },
    logLovel: null,
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
  };

  AdapterJS_RN.deleteWindowAndLocation = () => {
    delete global["window"];
    delete global["location"];
  };

  AdapterJS_RN.assignWindow = () => {
    global.window = Object.assign(AdapterJS_RN.windowClone, AdapterJS_RN.window);
  };

  AdapterJS_RN.initOverride = () => {
    AdapterJS_RN.deleteWindowAndLocation();
    AdapterJS_RN.assignWindow();
  };

  AdapterJS_RN.initOverride();

  let instance = null;

  /**
   * @class SkylinkStates
   * @hideconstructor
   * @classdesc Singleton Class that provides methods to access and update Skylink State
   * @private
   */
  class SkylinkStates {
    constructor() {
      if (!instance) {
        instance = this;
      }

      this.states = {};

      return instance;
    }

    /**
     * @param {SkylinkState} skylinkState
     */
    setState(skylinkState) {
      this.states[skylinkState.room.id] = skylinkState;
    }

    /**
     *
     * @return {SkylinkState}
     */
    getAllStates() {
      return this.states;
    }

    /**
     *
     * @param {string} roomId
     * @return {SkylinkState}
     */
    getState(roomId) {
      return this.states[roomId];
    }

    /**
     *
     * @param {string} roomId
     * @return boolean
     */
    removeStateByRoomId(roomId) {
      return delete this.states[roomId];
    }
  }

  const INCOMING_STREAM = 'onIncomingStream';
  const INCOMING_SCREEN_STREAM = 'onIncomingScreenStream';
  const STREAM_ENDED = 'streamEnded';
  const PEER_UPDATED = 'peerUpdated';
  const PEER_JOINED = 'peerJoined';
  const PEER_LEFT = 'peerLeft';
  const PEER_RESTART = 'peerRestart';
  const PEER_CONNECTION_STATE = 'peerConnectionState';
  const DATA_CHANNEL_STATE = 'dataChannelState';
  const ON_INCOMING_MESSAGE = 'onIncomingMessage';
  const HANDSHAKE_PROGRESS = 'handshakeProgress';
  const SERVER_PEER_JOINED = 'serverPeerJoined';
  const SERVER_PEER_RESTART = 'serverPeerRestart';
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

  var SkylinkEventsConstants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    INCOMING_STREAM: INCOMING_STREAM,
    INCOMING_SCREEN_STREAM: INCOMING_SCREEN_STREAM,
    STREAM_ENDED: STREAM_ENDED,
    PEER_UPDATED: PEER_UPDATED,
    PEER_JOINED: PEER_JOINED,
    PEER_LEFT: PEER_LEFT,
    PEER_RESTART: PEER_RESTART,
    PEER_CONNECTION_STATE: PEER_CONNECTION_STATE,
    DATA_CHANNEL_STATE: DATA_CHANNEL_STATE,
    ON_INCOMING_MESSAGE: ON_INCOMING_MESSAGE,
    HANDSHAKE_PROGRESS: HANDSHAKE_PROGRESS,
    SERVER_PEER_JOINED: SERVER_PEER_JOINED,
    SERVER_PEER_RESTART: SERVER_PEER_RESTART,
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
    MEDIA_INFO_DELETED: MEDIA_INFO_DELETED
  });

  class SkylinkEvent {
    constructor(name, detail) {
      this.name = name;
      this.detail = detail;
    }
  }

  /**
   * @event SkylinkEvents.onIncomingStream
   * @description Event triggered when receiving Peer Stream.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {MediaStream} detail.stream - The Stream object. To attach it to an element: <code>attachMediaStream(videoElement, stream);</code>.
   * @param {string} detail.streamId - The stream id.
   * @param {boolean} detail.isSelf -The flag if Peer is User.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   * @param {string} detail.isReplace - The The flag if the incoming stream has replaced an existing stream.
   * @param {string} detail.replacedStreamId - The streamId of the replaced stream.
   * @param {boolean} detail.isVideo - The flag if the incoming stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the incoming stream has an audio track.
   * @alias SkylinkEvents.onIncomingStream
   * */
  const onIncomingStream = (detail = {}) => new SkylinkEvent(INCOMING_STREAM, { detail });

  /**
   * @event SkylinkEvents.onIncomingScreenStream
   * @description Event triggered when receving Peer Screenshare Stream.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room.
   * @param {string} detail.peerId - The peer's id.
   * @param {MediaStream} detail.stream - The Stream object.
   * @param {string} detail.streamId - The Stream id.
   * @param {Boolean} detail.isSelf - The flag if Peer is User.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   * @param {Boolean} detail.isReplace - The flag if the incoming screenshare stream results from shareScreen() called with replaceUserMediaStream = true.
   * @param {boolean} detail.isVideo - The flag if the incoming screen stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the incoming screen stream has an audio track.
   * */
  const onIncomingScreenStream = (detail = {}) => new SkylinkEvent(INCOMING_SCREEN_STREAM, { detail });

  /**
   * @event SkylinkEvents.streamEnded
   * @description Event triggered when a Peer Stream streaming has stopped. Note that it may not be the currently sent Stream to User, and it also triggers when User leaves the Room for any currently sent Stream to User from Peer.
   * @param {Object} detail - Event's payload.
   * @param {string} detail.peerId - The Peer ID.
   * @param {SkylinkRoom} detail.room - The room.
   * @param {peerInfo} detail.peerInfo - The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code>peerJoined</code> event.
   * @param {Boolean} detail.isSelf The flag if Peer is User.
   * @param {Boolean} detail.isScreensharing The flag if Peer Stream is a screensharing Stream.
   * @param {string} detail.streamId The Stream ID.
   * @param {boolean} detail.isVideo - The flag if the ended stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the ended stream has an audio track.
   * */
  const streamEnded = (detail = {}) => new SkylinkEvent(STREAM_ENDED, { detail });

  /**
   * @event SkylinkEvents.streamMuted
   * @description Event triggered when Peer Stream audio or video tracks has been muted / unmuted.
   * @param {Object} detail - Event's payload.
   * @param {string} detail.peerId -  The Peer ID.
   * @param {peerInfo} detail.peerInfo The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code>peerJoined</code> event.
   * @param {Boolean} detail.isSelf The flag if Peer is User.
   * @param {boolean} detail.isVideo - The flag if the ended stream has a video track.
   * @param {boolean} detail.isAudio - The flag if the ended stream has an audio track.
   * */
  const streamMuted = (detail = {}) => new SkylinkEvent(STREAM_MUTED, { detail });

  /**
   * @event SkylinkEvents.onDataChannelStateChanged
   * @description Event triggered when a Datachannel connection state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {SkylinkConstants.DATA_CHANNEL_STATE} detail.state - The current Datachannel connection state.
   * @param {Error} detail.error - The error object. Defined only when <code>state</code> payload is <code>ERROR</code> or <code>SEND_MESSAGE_ERROR</code>.
   * @param {string} detail.channelName - The Datachannel ID.
   * @param {SkylinkConstants.DATA_CHANNEL_TYPE} detail.channelType - The Datachannel type.
   * @param {SkylinkConstants.DATA_CHANNEL_MESSAGE_ERROR} detail.messageType - The Datachannel sending Datachannel message error type.
   *   Defined only when <cod>state</code> payload is <code>SEND_MESSAGE_ERROR</code>.
   * @param {Object} detail.bufferAmount The Datachannel - buffered amount information.
   * @param {number} detail.bufferAmount.bufferedAmount - The size of currently queued data to send on the Datachannel connection.
   * @param {number} detail.bufferAmount.bufferedAmountLowThreshold - Threshold The current buffered amount low threshold configured.
   */
  const onDataChannelStateChanged = (detail = {}) => new SkylinkEvent(DATA_CHANNEL_STATE, { detail });

  /**
   * @event SkylinkEvents.onIncomingMessage
   * @description Event triggered when receiving message from Peer.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {JSON} detail.message - The message result.
   * @param {JSON|string} detail.message.content - The message object.
   * @param {string} detail.message.senderPeerId - The sender Peer ID.
   * @param {string|Array} [detail.message.targetPeerId] The value of the <code>targetPeerId</code>
   *   defined in {@link Skylink#sendP2PMessage} or
   *   {@link Skylink#sendMessage}.
   *   Defined as User's Peer ID when <code>isSelf</code> payload value is <code>false</code>.
   *   Defined as <code>null</code> when provided <code>targetPeerId</code> in
   *   {@link Skylink#sendP2PMessage} or
   *   {@link Skylink#sendMessage} is not defined.
   * @param {Array} [detail.message.listOfPeers] The list of Peers that the message has been sent to.
   *  Defined only when <code>isSelf</code> payload value is <code>true</code>.
   * @param {boolean} detail.message.isPrivate The flag if message is targeted or not, basing
   *   off the <code>targetPeerId</code> parameter being defined in
   *   {@link Skylink#sendP2PMessage} or
   *   {@link Skylink#sendMessage}.
   * @param {boolean} detail.message.isDataChannel The flag if message is sent from
   *   {@link Skylink#sendP2PMessage}.
   * @param {string} detail.peerId The Peer ID.
   * @param {peerInfo} detail.peerInfo The Peer session information.
   *   Object signature matches the <code>peerInfo</code> parameter payload received in the
   *   {@link SkylinkEvents.event:peerJoined|peerJoinedEvent}.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   */
  const onIncomingMessage = (detail = {}) => new SkylinkEvent(ON_INCOMING_MESSAGE, { detail });

  /**
   * @description Event triggered when a Peer connection establishment state has changed.
   * @event SkylinkEvents.handshakeProgress
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.HANDSHAKE_PROGRESS} detail.state The current Peer connection establishment state.
   * @param {String} detail.peerId The Peer ID.
   * @param {SkylinkRoom} detail.room The room.
   * @param {Error|String} [detail.error] The error object.
   *   Defined only when <code>state</code> is <code>ERROR</code>.
   */
  const handshakeProgress = (detail = {}) => new SkylinkEvent(HANDSHAKE_PROGRESS, { detail });

  /**
   * @description Event triggered when {@link Skylink#introducePeer}
   * introduction request state changes.
   * @event SkylinkEvents.introduceStateChange
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.INTRODUCE_STATE} detail.state The current <code>introducePeer()</code> introduction request state.
   * @param {String} detail.privilegedPeerId The User's privileged Peer ID.
   * @param {String} detail.sendingPeerId The Peer ID to be connected with <code>receivingPeerId</code>.
   * @param {String} detail.receivingPeerId The Peer ID to be connected with <code>sendingPeerId</code>.
   * @param {String} [detail.reason] The error object.
   *   Defined only when <code>state</code> payload is <code>ERROR</code>.
   */
  const introduceStateChange = (detail = {}) => new SkylinkEvent(INTRODUCE_STATE_CHANGE, { detail });

  /* eslint-disable import/prefer-default-export */

  /**
   * @event SkylinkEvents.readyStateChange
   * @description Event triggered when <code>init()</code> method ready state changes.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.READY_STATE_CHANGE} detail.readyState - The current <code>init()</code> ready state.
   * @param {JSON} detail.error - The error result. Defined only when <code>state</code> is <code>ERROR</code>.
   * @param {Number} detail.error.status - The HTTP status code when failed.
   * @param {SkylinkConstants.READY_STATE_CHANGE_ERROR} detail.error.errorCode - The ready state change failure code.
   * @param {Error} detail.error.content - The error object.
   * @param {string} detail.room - The Room to The Room to retrieve session token for.
   */
  const readyStateChange = (detail = {}) => new SkylinkEvent(READY_STATE_CHANGE, { detail });

  /**
   * @event SkylinkEvents.candidateProcessingState
   * @description Event triggered when remote ICE candidate processing state has changed when Peer is using trickle ICE.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {SkylinkConstants.CANDIDATE_PROCESSING_STATE} detail.state - The ICE candidate processing state.
   * @param {string} detail.candidateId - The remote ICE candidate session ID.
   * @param {string} detail.candidateType - The remote ICE candidate type.
   * @param {Object} detail.candidate - The remote ICE candidate.
   * @param {string} detail.candidate.candidate - The remote ICE candidate connection description.
   * @param {string} detail.candidate.sdpMid- The remote ICE candidate identifier based on the remote session description.
   * @param {number} detail.candidate.sdpMLineIndex - The remote ICE candidate media description index (starting from 0) based on the remote session description.
   * @param {Error} detail.error - The error object.
   */
  const candidateProcessingState = detail => new SkylinkEvent(CANDIDATE_PROCESSING_STATE, { detail });

  /**
   * @event SkylinkEvents.candidateGenerationState
   * @description Event triggered when a Peer connection ICE gathering state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {SkylinkConstants.CANDIDATE_GENERATION_STATE} detail.state - The current Peer connection ICE gathering state.
   */
  const candidateGenerationState = detail => new SkylinkEvent(CANDIDATE_GENERATION_STATE, { detail });

  /**
   * @event SkylinkEvents.candidatesGathered
   * @description Event triggered when all remote ICE candidates gathering has completed and been processed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {Object} detail.candidatesLength - The remote ICE candidates length.
   * @param {number} detail.candidatesLength.expected - The expected total number of remote ICE candidates to be received.
   * @param {number} detail.candidatesLength.received - The actual total number of remote ICE candidates received.
   * @param {number} detail.candidatesLength.processed - The total number of remote ICE candidates processed.
   */
  const candidatesGathered = detail => new SkylinkEvent(CANDIDATES_GATHERED, { detail });

  /**
   * @description Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * Event triggered when a Peer connection ICE connection state has changed.
   * @event SkylinkEvent.iceConnectionState
   * @param {SkylinkEvents.ICE_CONNECTION_STATE} state The current Peer connection ICE connection state.
   * @param {String} peerId The Peer ID.
   */
  const iceConnectionState = detail => new SkylinkEvent(ICE_CONNECTION_STATE, { detail });

  /**
   * @event SkylinkEvents.roomLock
   * @description Event triggered when Room locked status has changed.
   * @param {Object} detail - Event's payload
   * @param {Boolean} detail.isLocked The flag if Room is locked.
   * @param {String} detail.peerId The Peer ID.
   * @param {peerInfo} detail.peerInfo The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code>peerJoined</code> event.
   * @param {Boolean} detail.isSelf The flag if User changed the Room locked status.
   */
  const roomLock = (detail = {}) => new SkylinkEvent(ROOM_LOCK, { detail });

  /**
   * @description Event triggered when a data transfer state has changed.
   * @event SkylinkEvents.dataTransferState
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.DATA_TRANSFER_STATE} detail.state The current data transfer state.
   * @param {string} detail.transferId The data transfer ID.
   *   Note that this is defined as <code>null</code> when <code>state</code> payload is <code>START_ERROR</code>.
   * @param {string} detail.peerId The Peer ID.
   *   Note that this could be defined as <code>null</code> when <code>state</code> payload is
   *   <code>START_ERROR</code> and there is no Peers to start data transfer with.
   * @param {JSON} detail.transferInfo The data transfer information.
   * @param {Blob|String} [detail.transferInfo.data] The data object.
   *   Defined only when <code>state</code> payload is <code>UPLOAD_STARTED</code> or
   *   <code>DOWNLOAD_COMPLETED</code>.
   * @param {string} detail.transferInfo.name The data transfer name.
   * @param {Number} detail.transferInfo.size The data transfer data object size.
   * @param {SkylinkConstants.DATA_TRANSFER_SESSION_TYPE} detail.transferInfo.dataType The data transfer session type.
   * @param {SkylinkConstants.DATA_TRANSFER_DATA_TYPE} detail.transferInfo.chunkType The data transfer type of data chunk being used to send to Peer for transfers.
   *   For {@link Skylink#sendBlobData} data transfers, the
   *   initial data chunks value may change depending on the currently received data chunk type or the
   *   agent supported sending type of data chunks.
   *   For {@link Skylink#sendURLData} data transfers, it is
   *   <code>STRING</code> always.
   * @param {string} [detail.transferInfo.mimeType] The data transfer data object MIME type.
   *   Defined only when {@link Skylink#sendBlobData}
   *   data object sent MIME type information is defined.
   * @param {Number} detail.transferInfo.chunkSize The data transfer data chunk size.
   * @param {Number} detail.transferInfo.percentage The data transfer percentage of completion progress.
   * @param {Number} detail.transferInfo.timeout The flag if data transfer is targeted or not, basing
   *   off the <code>targetPeerId</code> parameter being defined in
   *   {@link Skylink#sendURLData} or
   *   {@link Skylink#sendBlobData}.
   * @param {Boolean} detail.transferInfo.isPrivate The flag if message is targeted or not, basing
   *   off the <code>targetPeerId</code> parameter being defined in
   *   {@link Skylink#sendBlobData} or
   *   {@link Skylink#sendURLData}.
   * @param {SkylinkConstants.DATA_TRANSFER_TYPE} detail.transferInfo.direction The data transfer direction.
   * @param {JSON} [detail.error] The error result.
   *   Defined only when <code>state</code> payload is <code>ERROR</code>, <code>CANCEL</code>,
   *   <code>REJECTED</code>, <code>START_ERROR</code> or <code>USER_REJECTED</code>.
   * @param {Error|String} detail.error.message The error object.
   * @param {SkylinkConstants.DATA_TRANSFER_TYPE} detail.error.transferType The data transfer direction from where the error occurred.
   */
  const dataTransferState = detail => new SkylinkEvent(DATA_TRANSFER_STATE, { detail });

  /**
   * @event SkylinkEvents.peerUpdated
   * @description Event triggered when a Peer session information has been updated.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {boolean} detail.isSelf -The flag if Peer is User.
   * @param {peerInfo} detail.peerInfo - The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the <code>peerJoined</code> event.
   */
  const peerUpdated = (detail = {}) => new SkylinkEvent(PEER_UPDATED, { detail });

  /**
   * @event SkylinkEvents.peerJoined
   * @description Event triggered when a Peer joins the room.
   * @param {Object} detail - Event's payload
   * @param {SkylinkRoom} detail.room - The current room.
   * @param {string} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   */
  const peerJoined = (detail = {}) => new SkylinkEvent(PEER_JOINED, { detail });

  /**
   * @event SkylinkEvents.peerLeft
   * @description Event triggered when a Peer leaves the room.
   * @param {Object} detail - Event's payload.
   * @param {string} detail.peerId - The Peer ID.
   * @param {peerInfo} detail.peerInfo - The Peer session information. Object signature matches the <code>peerInfo</code> parameter payload received in the<code>peerJoined</code> event.
   * @param {boolean} detail.isSelf - The flag if Peer is User.
   */
  const peerLeft = (detail = {}) => new SkylinkEvent(PEER_LEFT, { detail });

  /**
   * @event SkylinkEvents.serverPeerJoined
   * @description Event triggered when a server Peer joins the room.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkRoom} detail.room - The current room
   * @param {string} detail.peerId - The peer's id
   * @param {SkylinkConstants.SERVER_PEER_TYPE} detail.serverPeerType - The server Peer type
   */
  const serverPeerJoined = (detail = {}) => new SkylinkEvent(SERVER_PEER_JOINED, { detail });

  /**
   * @event SkylinkEvents.serverPeerLeft
   * @description Event triggered when a server Peer leaves the room.
   * @param {Object} detail - Event's payload
   * @param {string} detail.peerId - The Peer ID
   * @param {SkylinkRoom} detail.room - The room.
   * @param {SkylinkConstants.SERVER_PEER_TYPE} detail.serverPeerType - The server Peer type
   */
  const serverPeerLeft = (detail = {}) => new SkylinkEvent(SERVER_PEER_LEFT, { detail });

  /**
   * @event SkylinkEvents.getPeersStateChange
   * @description Event triggered when <code>getPeers()</code> method retrieval state changes.
   * @param {Object} detail - Event's payload
   * @param {SkylinkConstants.GET_PEERS_STATE} detail.state - The current <code>getPeers()</code> retrieval state.
   * @param {SkylinkUser.sid} detail.privilegePeerId - The Users privileged Peer Id.
   * @param {Object} detail.peerList - The list of Peer IDs Rooms within the same App space.
   * @param {Array} detail.peerList.#room - The list of Peer IDs associated with the Room defined in <code>#room</code> property.
   * @memberOf SkylinkEvents
   */
  const getPeersStateChange = (detail = {}) => new SkylinkEvent(GET_PEERS_STATE_CHANGE, { detail });

  /**
   * @event SkylinkEvents.peerConnectionState
   * @description Event triggered when a Peer connection session description exchanging state has changed.
   *  <blockquote class="info">
   *   Learn more about how ICE works in this
   *   <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * @param {Object} detail - Event's payload
   * @param {SkylinkConstants.PEER_CONNECTION_STATE} detail.state - The current Peer connection session description exchanging states.
   * @param {string} detail.peerId - The Peer ID
   */
  const peerConnectionState = (detail = {}) => new SkylinkEvent(PEER_CONNECTION_STATE, { detail });

  /**
   * @event SkylinkEvents.sessionDisconnect
   * @description Event triggered when Room session has ended abruptly due to network disconnections.
   * @param {Object} detail - Event's payload.
   * @param {string} detail.peerId - The User's Room session Peer ID
   * @param {peerInfo} detail.peerInfo - The User's Room session information. Object signature matches the <code>peerInfo</code> parameter payload received in the<code>peerJoined</code> event.
   */
  const sessionDisconnect = (detail = {}) => new SkylinkEvent(SESSION_DISCONNECT, { detail });

  /**
   * Event triggered when <code>{@link PeerConnection.getConnectionStatus}</code> method
   * retrieval state changes.
   * @event SkylinkEvents.getConnectionStatusStateChange
   * @param {Object} detail - Event's payload/
   * @param {SkylinkConstants.GET_CONNECTION_STATUS_STATE} detail.state The current <code>getConnectionStatus()</code> retrieval state.
   * @param {string} detail.peerId The Peer ID.
   * @param {statistics} [detail.stats] The Peer connection current stats.
   * @param {Error} detail.error - The error object. Defined only when <code>state</code> payload is <code>RETRIEVE_ERROR</code>.
   */
  const getConnectionStatusStateChange = (detail = {}) => new SkylinkEvent(GET_CONNECTION_STATUS_STATE_CHANGE, { detail });

  /* eslint-disable */

  /**
   * @event SkylinkEvents.channelOpen
   * @description Event triggered when socket connection to Signaling server has opened.
   * @param {Object} detail - Event's payload.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelOpen = detail => new SkylinkEvent(CHANNEL_OPEN, { detail });

  /**
   * @event SkylinkEvents.channelReopen
   * @description Event triggered when socket connection to Signaling server has re-opened.
   * @param {Object} detail - Event's payload.
   * @param {socketSession} detail.session The socket connection session information.
   * @example
   * Example 1: Listen on channelReopen to handle successful socket reconnection if socket was disconnected
   * (channelClose event emitted).
   * SkylinkEventManager.addEventListener(SkylinkConstants.EVENTS.CHANNEL_REOPEN, evt => {
   *   const { detail } = evt;
   *   skylink.leaveRoom() // call leaveRoom to ensure that previous peer information will be removed
   *   .then(() => skylink.joinRoom(joinRoomOptions))
   *   .then((streams) => {
   *     window.attachMediaStream(el, stream);
   *   })
   * });
   */
  const channelReopen = detail => new SkylinkEvent(CHANNEL_REOPEN, { detail });

  /**
   * @description Event triggered when socket connection to Signaling server has closed.
   * @event SkylinkEvents.channelClose
   * @param {Object} detail - Event's payload.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelClose = detail => new SkylinkEvent(CHANNEL_CLOSE, { detail });

  /**
   * @description This may be caused by Javascript errors in the event listener when subscribing to events.<br>
   * It may be resolved by checking for code errors in your Web App in the event subscribing listener.<br>
   * Event triggered when socket connection encountered exception.
   * @event SkylinkEvents.channelError
   * @param {Object} detail - Event's payload.
   * @param {Error|String} detail.error The error object.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelError = detail => new SkylinkEvent(CHANNEL_ERROR, { detail });

  /**
   * @description Note that this is used only for SDK developer purposes.
   * Event triggered when receiving socket message from the Signaling server.
   * @event SkylinkEvents.channelMessage
   * @param {Object} detail - Event's payload.
   * @param {Object} detail.message The socket message object.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelMessage = detail => new SkylinkEvent(CHANNEL_MESSAGE, { detail });

  /**
   * @description Event triggered when attempting to establish socket connection to Signaling server when failed.
   * @event SkylinkEvents.channelRetry
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.SOCKET_FALLBACK} detail.fallbackType The current fallback state.
   * @param {Number} detail.currentAttempt The current socket reconnection attempt.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const channelRetry = detail => new SkylinkEvent(CHANNEL_RETRY, { detail });

  /**
   * @description Event triggered when attempt to establish socket connection to Signaling server has failed.
   * @event SkylinkEvents.socketError
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.SOCKET_ERROR} detail.errorCode The socket connection error code.
   * @param {Error|String|Number} detail.error The error object.
   * @param {SkylinkConstants.SOCKET_FALLBACK} detail.type The fallback state of the socket connection attempt.
   * @param {socketSession} detail.session The socket connection session information.
   */
  const socketError = detail => new SkylinkEvent(SOCKET_ERROR, { detail });

  /**
   * @description Event triggered when Signaling server reaction state has changed.
   * @event SkylinkEvents.systemAction
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.SYSTEM_ACTION} detail.action The current Signaling server reaction state.
   *   [Rel: Skylink.SYSTEM_ACTION]
   * @param {string} detail.message The message.
   * @param {SkylinkConstants.SYSTEM_ACTION_REASON} detail.reason The Signaling server reaction state reason of action code.
   */
  const systemAction = detail => new SkylinkEvent(SYSTEM_ACTION, { detail });

  /**
   * @event SkylinkEvents.mediaAccessFallback
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
   * @param {boolean} detail.isScreensharing - The flag if event occurred during <code>shareScreen()</code> method and not <code>getUserMedia()</code> method.
   * @param {boolean} detail.isAudioFallback - The flag if event occurred during retrieval of audio tracks only when <code>getUserMedia()</code> method had failed to retrieve both audio and video tracks.
   * @param {String} detail.streamId - The Stream ID. Defined only when <code>state</code> payload is <code>FALLBACKED</code>.
   */
  const mediaAccessFallback = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_FALLBACK, { detail });

  /**
   * @event SkylinkEvents.mediaAccessStopped
   * @description Event triggered when Stream has stopped streaming.
   * @param {Object} detail.isScreensharing - The flag if event occurred during <code>shareScreen()</code> method and not <code>getUserMedia()</code> method.
   * @param {boolean} detail.isAudioFallback - The flag if event occurred during retrieval of audio tracks only when <code>getUserMedia()</code> method had failed to retrieve both audio and video tracks.
   * @param {String} detail.streamId - The Stream ID.
   */
  const mediaAccessStopped = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_STOPPED, { detail });

  /**
   * @event SkylinkEvents.mediaAccessSuccess
   * @description Event triggered when retrieval of Stream is successful.
   * @param {Object} detail
   * @param {MediaStream} detail.stream - The Stream object. To attach it to an element: <code>attachMediaStream(videoElement, stream);</code>.
   * @param {Boolean} detail.isScreensharing - The flag if event occurred during <code>shareScreen()</code> method and not <code>getUserMedia()</code> method.
   * @param {Boolean} detail.isAudioFallback - The flag if event occurred during retrieval of audio tracks only when <code>getUserMedia()</code> method had failed to retrieve both audio and video tracks.
   * @param {String} detail.streamId - The Stream ID.
   * @alias SkylinkEvents.mediaAccessSuccess
   */
  const mediaAccessSuccess = (detail = {}) => new SkylinkEvent(MEDIA_ACCESS_SUCCESS, { detail });

  /**
   * @event SkylinkEvents.recordingState
   * @description Event triggered when recording session state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.RECORDING_STATE} detail.state - The current recording session state.
   * @param {String} detail.recordingId - The recording session ID.
   * @param {Error | String} detail.error - The error object. Defined only when <code>state</code> payload is <code>ERROR</code>.
   */
  const recordingState = (detail = {}) => new SkylinkEvent(RECORDING_STATE, { detail });

  /**
   * @event SkylinkEvents.rtmpState
   * @description Event triggered when rtmp session state has changed.
   * @param {Object} detail - Event's payload.
   * @param {SkylinkConstants.RTMP_STATE} detail.state - The current recording session state.
   * @param {String} detail.rtmpId - The rtmp session ID.
   * @param {Error | String} detail.error - The error object. Defined only when <code>state</code> payload is <code>ERROR</code>.
   */
  const rtmpState = (detail = {}) => new SkylinkEvent(RTMP_STATE, { detail });

  /**
   * @event SkylinkEvents.localMediaMuted
   * @description Event triggered when <code>muteStream()</code> method changes User Streams audio and video tracks muted status.
   * @param {Object} detail - Event's payload.
   * @param {String} detail.streamId - The muted Stream Id.
   * @param {Boolean} detail.isScreensharing - The flag if the media muted was screensharing.
   * @param {JSON} detail.mediaStatus - The Peer streaming media status. This indicates the media status for both <code>getUserMedia()</code> Stream and <code>shareScreen()</code> Stream.
   * @param {Boolean} detail.mediaStatus.audioMuted - The value of the audio status. If Peer <code>mediaStatus</code> is <code>-1</code>, audio is not present in the stream. If Peer <code>mediaStatus</code> is <code>1</code>, audio is present
   *   in the stream and active (not muted). If Peer <code>mediaStatus</code> is <code>0</code>, audio is present in the stream and muted.
   * @param {Boolean} detail.mediaStatus.videoMuted - The value of the video status. If Peer <code>mediaStatus</code> is <code>-1</code>, video is not present in the stream. If Peer <code>mediaStatus</code> is <code>1</code>, video is present
   *   in the stream and active (not muted). If Peer <code>mediaStatus</code> is <code>0</code>, video is present in the stream and muted.
   */
  const localMediaMuted = (detail = {}) => new SkylinkEvent(LOCAL_MEDIA_MUTED, { detail });

  /**
   * @event SkylinkEvents.mediaAccessError
   * @description Event triggered when retrieval of Stream failed.
   * @param {Object} detail - Event's payload.
   * @param {Error | String} detail.error - The error object.
   * @param {Boolean} detail.isScreensharing - The flag if event occurred during <code>shareScreen()</code> method and not <code>getUserMedia()</code> method.
   * @param {Boolean} detail.isAudioFallbackError - The flag if event occurred during retrieval of audio tracks only when <code>getUserMedia()</code> method had failed to retrieve both audio and video tracks.
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
   */
  const loggedOnConsole = (detail = {}) => new SkylinkEvent(LOGGED_ON_CONSOLE, { detail });

  /**
   * @namespace SkylinkConstants
   * @description Constants used by SkylinkJS are described here.
   */

  /**
   * The list of Datachannel connection states.
   * @typedef DATA_CHANNEL_STATE
   * @property {string} CONNECTING          Value <code>"connecting"</code>
   *   The value of the state when Datachannel is attempting to establish a connection.
   * @property {string} OPEN                Value <code>"open"</code>
   *   The value of the state when Datachannel has established a connection.
   * @property {string} CLOSING             Value <code>"closing"</code>
   *   The value of the state when Datachannel connection is closing.
   * @property {string} CLOSED              Value <code>"closed"</code>
   *   The value of the state when Datachannel connection has closed.
   * @property {string} ERROR               Value <code>"error"</code>
   *   The value of the state when Datachannel has encountered an exception during connection.
   * @property {string} CREATE_ERROR        Value <code>"createError"</code>
   *   The value of the state when Datachannel has failed to establish a connection.
   * @property {string} BUFFERED_AMOUNT_LOW Value <code>"bufferedAmountLow"</code>
   *   The value of the state when Datachannel when the amount of data buffered to be sent
   *   falls below the Datachannel threshold.
   *   This state should occur only during after {@link Skylink#sendBlobData} or {@link Skylink#sendURLData} or
   *   {@link Skylink#sendP2PMessage}.
   * @property {string} SEND_MESSAGE_ERROR  Value <code>"sendMessageError"</code>
   *   The value of the state when Datachannel when data transfer packets or P2P message fails to send.
   *   This state should occur only during after {@link Skylink#sendBlobData} or {@link Skylink#sendURLData} or
   *   {@link Skylink#sendP2PMessage}.
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
   * @property {string} MESSAGING Value <code>"messaging"</code>
   *   The value of the Datachannel type that is used only for messaging in
   *   {@link Skylink#sendP2PMessage}.
   *   However for Peers that do not support simultaneous data transfers, this Datachannel
   *   type will be used to do data transfers (1 at a time).
   *   Each Peer connections will only have one of this Datachannel type and the
   *   connection will only close when the Peer connection is closed (happens when {@link SkylinkEvents.event:peerConnectionState|peerConnectionStateEvent} triggers parameter payload <code>state</code> as
   *   <code>CLOSED</code> for Peer).
   * @property {string} DATA Value <code>"data"</code>
   *   The value of the Datachannel type that is used only for a data transfer in
   *   {@link Skylink#sendURLData} and
   *   {@link Skylink#sendBlobData}.
   *   The connection will close after the data transfer has been completed or terminated (happens when
   *   {@link SkylinkEvents.event:dataTransferStatedataTransferStateEvent} triggers parameter payload
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
   * @property {string} MESSAGE  Value <code>"message"</code>
   *   The value of the Datachannel sending message error type when encountered during
   *   sending P2P message from {@link Skylink#sendP2PMessage}.
   * @property {string} TRANSFER Value <code>"transfer"</code>
   *   The value of the Datachannel sending message error type when encountered during
   *   data transfers from {@link Skylink#sendURLData} or
   *   {@link Skylink#sendBlobData}.
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
   * @property {string} BINARY_STRING Value <code>"binaryString"</code>
   *   The value of data transfer data type when Blob binary data chunks encoded to Base64 encoded string are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendBlobData} when
   *   parameter <code>sendChunksAsBinary</code> value is <code>false</code>.
   * @property {string} ARRAY_BUFFER  Value <code>"arrayBuffer"</code>
   *   The value of data transfer data type when ArrayBuffer binary data chunks are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendBlobData} when
   *   parameter <code>sendChunksAsBinary</code> value is <code>true</code>.
   * @property {string} BLOB          Value <code>"blob"</code>
   *   The value of data transfer data type when Blob binary data chunks are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendBlobData} when
   *   parameter <code>sendChunksAsBinary</code> value is <code>true</code>.
   * @property {string} STRING        Value <code>"string"</code>
   *   The value of data transfer data type when only string data chunks are
   *   sent or received over the Datachannel connection for the data transfer session.
   *   Used only in {@link Skylink#sendURLData}.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
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
   * @property {string} UPLOAD Value <code>"upload"</code>
   *   The value of the data transfer direction when User is uploading data to Peer.
   * @property {string} DOWNLOAD Value <code>"download"</code>
   *   The value of the data transfer direction when User is downloading data from Peer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   */
  const DATA_TRANSFER_TYPE = {
    UPLOAD: 'upload',
    DOWNLOAD: 'download',
  };

  /**
   * The list of data transfers session types.
   * @typedef DATA_TRANSFER_SESSION_TYPE
   * @property {string} BLOB     Value <code>"blob"</code>
   *   The value of the session type for
   *   {@link Skylink#sendURLData} data transfer.
   * @property {string} DATA_URL Value <code>"dataURL"</code>
   *   The value of the session type for
   *   {@link Skylink#sendBlobData} data transfer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.1.0
   */
  const DATA_TRANSFER_SESSION_TYPE = {
    BLOB: 'blob',
    DATA_URL: 'dataURL',
  };

  /**
   * The list of data transfer states.
   * @typedef DATA_TRANSFER_STATE
   * @property {string} UPLOAD_REQUEST     Value <code>"request"</code>
   *   The value of the state when receiving an upload data transfer request from Peer to User.
   *   At this stage, the upload data transfer request from Peer may be accepted or rejected with the
   *   {@link Skylink#acceptDataTransfer} invoked by User.
   * @param {string} USER_UPLOAD_REQUEST Value <code>"userRequest"</code>
   *   The value of the state when User sent an upload data transfer request to Peer.
   *   At this stage, the upload data transfer request to Peer may be accepted or rejected with the
   *   {@link Skylink#acceptDataTransfer}invoked by Peer.
   * @property {string} UPLOAD_STARTED     Value <code>"uploadStarted"</code>
   *   The value of the state when the data transfer request has been accepted
   *   and data transfer will start uploading data to Peer.
   *   At this stage, the data transfer may be terminated with the
   *   {@link Skylink#cancelDataTransfer}.
   * @property {string} DOWNLOAD_STARTED   Value <code>"downloadStarted"</code>
   *   The value of the state when the data transfer request has been accepted
   *   and data transfer will start downloading data from Peer.
   *   At this stage, the data transfer may be terminated with the
   *   {@link Skylink#cancelDataTransfer}.
   * @property {string} REJECTED           Value <code>"rejected"</code>
   *   The value of the state when upload data transfer request to Peer has been rejected and terminated.
   * @property {string} USER_REJECTED      Value <code>"userRejected"</code>
   *   The value of the state when User rejected and terminated upload data transfer request from Peer.
   * @property {string} UPLOADING          Value <code>"uploading"</code>
   *   The value of the state when data transfer is uploading data to Peer.
   * @property {string} DOWNLOADING        Value <code>"downloading"</code>
   *   The value of the state when data transfer is downloading data from Peer.
   * @property {string} UPLOAD_COMPLETED   Value <code>"uploadCompleted"</code>
   *   The value of the state when data transfer has uploaded successfully to Peer.
   * @property {string} DOWNLOAD_COMPLETED Value <code>"downloadCompleted"</code>
   *   The value of the state when data transfer has downloaded successfully from Peer.
   * @property {string} CANCEL             Value <code>"cancel"</code>
   *   The value of the state when data transfer has been terminated from / to Peer.
   * @property {string} ERROR              Value <code>"error"</code>
   *   The value of the state when data transfer has errors and has been terminated from / to Peer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.4.0
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
   * The list of data streaming states.
   * @typedef DATA_STREAM_STATE
   * @property {string} SENDING_STARTED   Value <code>"sendStart"</code>
   *   The value of the state when data streaming session has started from User to Peer.
   * @property {string} RECEIVING_STARTED Value <code>"receiveStart"</code>
   *   The value of the state when data streaming session has started from Peer to Peer.
   * @property {string} RECEIVED          Value <code>"received"</code>
   *   The value of the state when data streaming session data chunk has been received from Peer to User.
   * @property {string} SENT              Value <code>"sent"</code>
   *   The value of the state when data streaming session data chunk has been sent from User to Peer.
   * @property {string} SENDING_STOPPED   Value <code>"sendStop"</code>
   *   The value of the state when data streaming session has stopped from User to Peer.
   * @property {string} RECEIVING_STOPPED Value <code>"receivingStop"</code>
   *   The value of the state when data streaming session has stopped from Peer to User.
   * @property {string} ERROR             Value <code>"error"</code>
   *   The value of the state when data streaming session has errors.
   *   At this stage, the data streaming state is considered <code>SENDING_STOPPED</code> or
   *   <code>RECEIVING_STOPPED</code>.
   * @property {string} START_ERROR       Value <code>"startError"</code>
   *   The value of the state when data streaming session failed to start from User to Peer.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.18
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
   * @property {string} GATHERING Value <code>"gathering"</code>
   *   The value of the state when Peer connection is gathering ICE candidates.
   *   These ICE candidates are sent to Peer for its connection to check for a suitable matching
   *   pair of ICE candidates to establish an ICE connection for stream audio, video and data.
   *   See {@link SkylinkConstants.ICE_CONNECTION_STATE|ICE_CONNECTION_STATE} for ICE connection status.
   *   This state cannot happen until Peer connection remote <code>"offer"</code> / <code>"answer"</code>
   *   session description is set. See {@link SkylinkConstants.PEER_CONNECTION_STATE|PEER_CONNECTION_STATE} for session description exchanging status.
   * @property {string} COMPLETED Value <code>"completed"</code>
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
   * @property {string} RECEIVED Value <code>"received"</code>
   *   The value of the state when the remote ICE candidate was received.
   * @property {string} DROPPED  Value <code>"received"</code>
   *   The value of the state when the remote ICE candidate is dropped.
   * @property {string} BUFFERED  Value <code>"buffered"</code>
   *   The value of the state when the remote ICE candidate is buffered.
   * @property {string} PROCESSING  Value <code>"processing"</code>
   *   The value of the state when the remote ICE candidate is being processed.
   * @property {string} PROCESS_SUCCESS  Value <code>"processSuccess"</code>
   *   The value of the state when the remote ICE candidate has been processed successfully.
   *   The ICE candidate that is processed will be used to check against the list of
   *   locally generated ICE candidate to start matching for the suitable pair for the best ICE connection.
   * @property {string} PROCESS_ERROR  Value <code>"processError"</code>
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
   * @property {string} CHECKING       Value <code>"checking"</code>
   *   The value of the state when Peer connection is checking for a suitable matching pair of
   *   ICE candidates to establish ICE connection.
   *   Exchanging of ICE candidates happens during {@link SkylinkEvents.event:candidateGenerationState|candidateGenerationStateEvent}.
   * @property {string} CONNECTED      Value <code>"connected"</code>
   *   The value of the state when Peer connection has found a suitable matching pair of
   *   ICE candidates to establish ICE connection but is still checking for a better
   *   suitable matching pair of ICE candidates for the best ICE connectivity.
   *   At this state, ICE connection is already established and audio, video and
   *   data streaming has already started.
   * @property {string} COMPLETED      Value <code>"completed"</code>
   *   The value of the state when Peer connection has found the best suitable matching pair
   *   of ICE candidates to establish ICE connection and checking has stopped.
   *   At this state, ICE connection is already established and audio, video and
   *   data streaming has already started. This may happpen after <code>CONNECTED</code>.
   * @property {string} FAILED         Value <code>"failed"</code>
   *   The value of the state when Peer connection ICE connection has failed.
   * @property {string} DISCONNECTED   Value <code>"disconnected"</code>
   *   The value of the state when Peer connection ICE connection is disconnected.
   *   At this state, the Peer connection may attempt to revive the ICE connection.
   *   This may happen due to flaky network conditions.
   * @property {string} CLOSED         Value <code>"closed"</code>
   *   The value of the state when Peer connection ICE connection has closed.
   *   This happens when Peer connection is closed and no streaming can occur at this stage.
   * @property {string} TRICKLE_FAILED Value <code>"trickeFailed"</code>
   *   The value of the state when Peer connection ICE connection has failed during trickle ICE.
   *   Trickle ICE is enabled in Skylink {@link initOptions}
   *   <code>enableIceTrickle</code> option.
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
    TRICKLE_FAILED: 'trickleFailed',
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
   * @property {string} TCP Value  <code>"tcp"</code>
   *   The value of the option to configure using only TCP network transport protocol.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=tcp"</code>,
   *   <code>"turn:server1.com:3478?transport=tcp"</code>]
   * @property {string} UDP Value  <code>"udp"</code>
   *   The value of the option to configure using only UDP network transport protocol.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=udp"</code>,
   *   <code>"turn:server1.com:3478?transport=udp"</code>]
   * @property {string} ANY Value  <code>"any"</code>
   *   The value of the option to configure using any network transport protocols configured from the Signaling server.
   *   Example <code>.urls</code> output: [<code>"turn:server.com?transport=tcp"</code>,
   *   <code>"turn:server1.com:3478"</code>, <code>"turn:server.com?transport=udp"</code>]
   * @property {string} NONE Value <code>"none"</code>
   *   The value of the option to not configure using any network transport protocols.
   *   Example <code>.urls</code> output: [<code>"turn:server.com"</code>, <code>"turn:server1.com:3478"</code>]
   *   Configuring this does not mean that no protocols will be used, but
   *   rather removing <code>?transport=(protocol)</code> query option in
   *   the TURN ICE server <code>.urls</code> when constructing the Peer connection.
   * @property {string} ALL Value  <code>"all"</code>
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
   * @property {string} STABLE            Value <code>"stable"</code>
   *   The value of the state when there is no session description being exchanged between Peer connection.
   * @property {string} HAVE_LOCAL_OFFER  Value <code>"have-local-offer"</code>
   *   The value of the state when local <code>"offer"</code> session description is set.
   *   This should transition to <code>STABLE</code> state after remote <code>"answer"</code>
   *   session description is set.
   *   See {@link SkylinkConstants.HANDSHAKE_PROGRESS|HANDSHAKE_PROGRESS} for a more
   *   detailed exchanging of session description states.
   * @property {string} HAVE_REMOTE_OFFER Value <code>"have-remote-offer"</code>
   *   The value of the state when remote <code>"offer"</code> session description is set.
   *   This should transition to <code>STABLE</code> state after local <code>"answer"</code>
   *   session description is set.
   *   See {@link SkylinkConstants.HANDSHAKE_PROGRESS|HANDSHAKE_PROGRESS} for a more
   *   detailed exchanging of session description states.
   * @property {string} CLOSED            Value <code>"closed"</code>
   *   The value of the state when Peer connection is closed and no session description can be exchanged and set.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.0
   */
  const PEER_CONNECTION_STATE$1 = {
    STABLE: 'stable',
    HAVE_LOCAL_OFFER: 'have-local-offer',
    HAVE_REMOTE_OFFER: 'have-remote-offer',
    CLOSED: 'closed',
  };

  /**
   * The list of {@link Skylink#getConnectionStatus} retrieval states.
   * @typedef GET_CONNECTION_STATUS_STATE
   * @property {number} RETRIEVING Value <code>0</code>
   *   The value of the state when {@link Skylink#getConnectionStatus} is retrieving the Peer connection stats.
   * @property {number} RETRIEVE_SUCCESS Value <code>1</code>
   *   The value of the state when {@link Skylink#getConnectionStatus} has retrieved the Peer connection stats successfully.
   * @property {number} RETRIEVE_ERROR Value <code>-1</code>
   *   The value of the state when {@link Skylink#getConnectionStatus} has failed retrieving the Peer connection stats.
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
   * @property {string} MCU Value <code>"mcu"</code>
   *   The value of the server Peer type that is used for MCU connection.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.1
   */
  const SERVER_PEER_TYPE = {
    MCU: 'mcu',
    // SIP: 'sip'
  };

  /**
   * <blockquote class="info">
   *  Learn more about how ICE works in this
   *  <a href="https://temasys.com.sg/ice-what-is-this-sorcery/">article here</a>.
   * </blockquote>
   * The list of available Peer connection bundle policies.
   * @typedef BUNDLE_POLICY
   * @property {string} MAX_COMPAT Value <code>"max-compat"</code>
   *   The value of the bundle policy to generate ICE candidates for each media type
   *   so each media type flows through different transports.
   * @property {string} MAX_BUNDLE Value <code>"max-bundle"</code>
   *   The value of the bundle policy to generate ICE candidates for one media type
   *   so all media type flows through a single transport.
   * @property {string} BALANCED   Value <code>"balanced"</code>
   *   The value of the bundle policy to use <code>MAX_BUNDLE</code> if Peer supports it,
   *   else fallback to <code>MAX_COMPAT</code>.
   * @property {string} NONE       Value <code>"none"</code>
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
   * @property {string} REQUIRE   Value <code>"require"</code>
   *   The value of the RTCP mux policy to generate ICE candidates for RTP only and RTCP shares the same ICE candidates.
   * @property {string} NEGOTIATE Value <code>"negotiate"</code>
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
   * @property {string} RSA   Value <code>"RSA"</code>
   *   The value of the Peer connection certificate algorithm to use RSA-1024.
   * @property {string} ECDSA Value <code>"ECDSA"</code>
   *   The value of the Peer connection certificate algorithm to use ECDSA.
   * @property {string} AUTO  Value <code>"AUTO"</code>
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
   * @property {string} ENTER   Value <code>"enter"</code>
   *   The value of the connection state when Peer has just entered the Room.
   *   At this stage, {@link SkylinkConstants.PEER_JOINED|PEER_JOINED}
   *   is triggered.
   * @property {string} WELCOME Value <code>"welcome"</code>
   *   The value of the connection state when Peer is aware that User has entered the Room.
   *   At this stage, {@link SkylinkConstants.PEER_JOINED|PEER_JOINED}
   *   is triggered and Peer connection may commence.
   * @property {string} OFFER   Value <code>"offer"</code>
   *   The value of the connection state when Peer connection has set the local / remote <code>"offer"</code>
   *   session description to start streaming connection.
   * @property {string} ANSWER  Value <code>"answer"</code>
   *   The value of the connection state when Peer connection has set the local / remote <code>"answer"</code>
   *   session description to establish streaming connection.
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
   * The list of <a href="#method_getPeers"><code>getPeers()</code> method</a> retrieval states.
   * @typedef GET_PEERS_STATE
   * @property {string} ENQUIRED Value <code>"enquired"</code>
   *   The value of the state when <code>getPeers()</code> is retrieving the list of Peer IDs
   *   from Rooms within the same App space from the Signaling server.
   * @property {string} RECEIVED Value <code>"received"</code>
   *   The value of the state when <code>getPeers()</code> has retrieved the list of Peer IDs
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
   * @property {string} INTRODUCING Value <code>"enquired"</code>
   *   The value of the state when introduction request for the selected pair of Peers has been made to the Signaling server.
   * @property {string} ERROR       Value <code>"error"</code>
   *   The value of the state when introduction request made to the Signaling server
   *   for the selected pair of Peers has failed.
   * @readOnly
   * @constant
   * @memberOf SkylinkConstants
   * @since 0.6.1
   */
  const INTRODUCE_STATE = {
    INTRODUCING: 'introducing',
    ERROR: 'error',
  };

  /**
   * The list of Signaling server reaction states during {@link Skylink#joinRoom}.
   * @typedef SYSTEM_ACTION
   * @property {string} WARNING Value <code>"warning"</code>
   *   The value of the state when Room session is about to end.
   * @property {string} REJECT  Value <code>"reject"</code>
   *   The value of the state when Room session has failed to start or has ended.
   * @property {string} LOCKED  Value <code>"locked"</code>
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
   * {@link Skylink#joinRoom}.
   * @typedef SYSTEM_ACTION_REASON
   * @property {string} CREDENTIALS_EXPIRED Value <code>"oldTimeStamp"</code>
   *   The value of the reason code when Room session token has expired.
   *   Happens during {@link Skylink#joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {string} CREDENTIALS_ERROR   Value <code>"credentialError"</code>
   *   The value of the reason code when Room session token provided is invalid.
   *   Happens during {@link Skylink#joinRoom} request.
   * @property {string} DUPLICATED_LOGIN    Value <code>"duplicatedLogin"</code>
   *   The value of the reason code when Room session token has been used already.
   *   Happens during {@link Skylink#joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {string} ROOM_NOT_STARTED    Value <code>"notStart"</code>
   *   The value of the reason code when Room session has not started.
   *   Happens during {@link Skylink#joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {string} EXPIRED             Value <code>"expired"</code>
   *   The value of the reason code when Room session has ended already.
   *   Happens during {@link Skylink#joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {string} ROOM_LOCKED         Value <code>"locked"</code>
   *   The value of the reason code when Room is locked.
   *   Happens during {@link Skylink#joinRoom} request.
   *   Results with: <code>REJECT</code>
   * @property {string} FAST_MESSAGE        Value <code>"fastmsg"</code>
   *    The value of the reason code when User is flooding socket messages to the Signaling server
   *    that is sent too quickly within less than a second interval.
   *    Happens after Room session has started. This can be caused by various methods like
   *    {@link Skylink#sendMessage},
   *    {@link Skylink#muteStream},
   *    {@link Skylink#enableAudio},
   *    {@link Skylink#enableVideo},
   *    {@link Skylink#disableAudio},
   *    {@link Skylink#disableVideo},
   *    Results with: <code>WARNING</code>
   * @property {string} ROOM_CLOSING        Value <code>"toClose"</code>
   *    The value of the reason code when Room session is ending.
   *    Happens after Room session has started. This serves as a prerequisite warning before
   *    <code>ROOM_CLOSED</code> occurs.
   *    Results with: <code>WARNING</code>
   * @property {string} ROOM_CLOSED         Value <code>"roomclose"</code>
   *    The value of the reason code when Room session has just ended.
   *    Happens after Room session has started.
   *    Results with: <code>REJECT</code>
   * @property {string} SERVER_ERROR        Value <code>"serverError"</code>
   *    The value of the reason code when Room session fails to start due to some technical errors.
   *    Happens during {@link Skylink#joinRoom} request.
   *    Results with: <code>REJECT</code>
   * @property {string} KEY_ERROR           Value <code>"keyFailed"</code>
   *    The value of the reason code when Room session fails to start due to some technical error pertaining to
   *    App Key initialization.
   *    Happens during {@link Skylink#joinRoom} request.
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
   *   in {@link Skylink#joinRoom}.
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
   * The list of User's priority weight schemes for {@link Skylink#joinRoom} connections.
   * @typedef PRIORITY_WEIGHT_SCHEME
   * @property {string} ENFORCE_OFFERER  Value <code>"enforceOfferer"</code>
   *   The value of the priority weight scheme to enforce User as the offerer.
   * @property {string} ENFORCE_ANSWERER Value <code>"enforceAnswerer"</code>
   *   The value of the priority weight scheme to enforce User as the answerer.
   * @property {string} AUTO             Value <code>"auto"</code>
   *   The value of the priority weight scheme to let User be offerer or answerer based on Signaling server selection.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.6.18
   */
  const PRIORITY_WEIGHT_SCHEME = {
    ENFORCE_OFFERER: 'enforceOfferer',
    ENFORCE_ANSWERER: 'enforceAnswerer',
    AUTO: 'auto',
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
   * The list of {@link Skylink#joinRoom} socket connection failure states.
   * @typedef SOCKET_ERROR
   * @property {number} CONNECTION_FAILED    Value <code>0</code>
   *   The value of the failure state when <code>joinRoom()</code> socket connection failed to establish with
   *   the Signaling server at the first attempt.
   * @property {number} RECONNECTION_FAILED  Value <code>-1</code>
   *   The value of the failure state when <code>joinRoom()</code> socket connection failed to establish
   *   the Signaling server after the first attempt.
   * @property {number} CONNECTION_ABORTED   Value <code>-2</code>
   *   The value of the failure state when <code>joinRoom()</code> socket connection will not attempt
   *   to reconnect after the failure of the first attempt in <code>CONNECTION_FAILED</code> as there
   *   are no more ports or transports to attempt for reconnection.
   * @property {number} RECONNECTION_ABORTED Value <code>-3</code>
   *   The value of the failure state when <code>joinRoom()</code> socket connection will not attempt
   *   to reconnect after the failure of several attempts in <code>RECONNECTION_FAILED</code> as there
   *   are no more ports or transports to attempt for reconnection.
   * @property {number} RECONNECTION_ATTEMPT Value <code>-4</code>
   *   The value of the failure state when <code>joinRoom()</code> socket connection is attempting
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
   * The list of {@link Skylink#joinRoom} socket connection reconnection states.
   * @typedef SOCKET_FALLBACK
   * @property {string} NON_FALLBACK      Value <code>"nonfallback"</code>
   *   The value of the reconnection state when <code>joinRoom()</code> socket connection is at its initial state
   *   without transitioning to any new socket port or transports yet.
   * @property {string} FALLBACK_PORT     Value <code>"fallbackPortNonSSL"</code>
   *   The value of the reconnection state when <code>joinRoom()</code> socket connection is reconnecting with
   *   another new HTTP port using WebSocket transports to attempt to establish connection with Signaling server.
   * @property {string} FALLBACK_PORT_SSL Value <code>"fallbackPortSSL"</code>
   *   The value of the reconnection state when <code>joinRoom()</code> socket connection is reconnecting with
   *   another new HTTPS port using WebSocket transports to attempt to establish connection with Signaling server.
   * @property {string} LONG_POLLING      Value <code>"fallbackLongPollingNonSSL"</code>
   *   The value of the reconnection state when <code>joinRoom()</code> socket connection is reconnecting with
   *   another new HTTP port using Polling transports to attempt to establish connection with Signaling server.
   * @property {string} LONG_POLLING_SSL  Value <code>"fallbackLongPollingSSL"</code>
   *   The value of the reconnection state when <code>joinRoom()</code> socket connection is reconnecting with
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
   *   Current version: <code>0.1.4</code>
   * </blockquote>
   * The value of the current version of the Signaling socket message protocol.
   * @typedef SM_PROTOCOL_VERSION
   * @constant
   * @type string
   * @memberOf SkylinkConstants
   * @since 0.6.0
   */
  const SM_PROTOCOL_VERSION = '1.0.0';

  /**
   * <blockquote class="info">
   *   Note that if the video codec is not supported, the SDK will not configure the local <code>"offer"</code> or
   *   <code>"answer"</code> session description to prefer the codec.
   * </blockquote>
   * The list of available video codecs to set as the preferred video codec to use to encode
   * sending video data when available encoded video codec for Peer connections
   * configured in Skylink {@link initOptions}.
   * @typedef VIDEO_CODEC
   * @property {string} AUTO Value <code>"auto"</code>
   *   The value of the option to not prefer any video codec but rather use the created
   *   local <code>"offer"</code> / <code>"answer"</code> session description video codec preference.
   * @property {string} VP8  Value <code>"VP8"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/VP8">VP8</a> video codec.
   * @property {string} VP9  Value <code>"VP9"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/VP9">VP9</a> video codec.
   * @property {string} H264 Value <code>"H264"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC">H264</a> video codec.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.10
   */
  const VIDEO_CODEC = {
    AUTO: 'auto',
    VP8: 'VP8',
    H264: 'H264',
    VP9: 'VP9',
    // H264UC: 'H264UC'
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
   * @property {string} AUTO Value <code>"auto"</code>
   *   The value of the option to not prefer any audio codec but rather use the created
   *   local <code>"offer"</code> / <code>"answer"</code> session description audio codec preference.
   * @property {string} OPUS Value <code>"opus"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/Opus_(audio_format)">OPUS</a> audio codec.
   * @property {string} ISAC Value <code>"ISAC"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/Internet_Speech_Audio_Codec">ISAC</a> audio codec.
   * @property {string} ILBC Value <code>"ILBC"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/Internet_Low_Bitrate_Codec">iLBC</a> audio codec.
   * @property {string} G722 Value <code>"G722"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/G.722">G722</a> audio codec.
   * @property {string} PCMA Value <code>"PCMA"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/G.711">G711u</a> audio codec.
   * @property {string} PCMU Value <code>"PCMU"</code>
   *   The value of the option to prefer the <a href="https://en.wikipedia.org/wiki/G.711">G711a</a> audio codec.
   * @constant
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 0.5.10
   */
  const AUDIO_CODEC = {
    AUTO: 'auto',
    ISAC: 'ISAC',
    OPUS: 'opus',
    ILBC: 'ILBC',
    G722: 'G722',
    PCMU: 'PCMU',
    PCMA: 'PCMA',
    // SILK: 'SILK'
  };

  /**
   * The list of available screensharing media sources configured in the
   * {@link Skylink#shareScreen}.
   * @typedef MEDIA_SOURCE
   * @property {string} SCREEN Value <code>"screen"</code>
   *   The value of the option to share entire screen.
   * @property {string} WINDOW Value <code>"window"</code>
   *   The value of the option to share application windows.
   * @property {string} TAB Value <code>"tab"</code>
   *   The value of the option to share browser tab.
   *   Note that this is only supported by from Chrome 52+ and Opera 39+.
   * @property {string} TAB_AUDIO Value <code>"audio"</code>
   *   The value of the option to share browser tab audio.
   *   Note that this is only supported by Chrome 52+ and Opera 39+.
   *   <code>options.audio</code> has to be enabled with <code>TAB</code> also requested to enable sharing of tab audio.
   * @property {string} APPLICATION Value <code>"application"</code>
   *   The value of the option to share applications.
   *   Note that this is only supported by Firefox currently.
   * @property {string} BROWSER Value <code>"browser"</code>
   *   The value of the option to share browser.
   *   Note that this is only supported by Firefox currently, and requires toggling the <code>media.getUserMedia.browser.enabled</code>
   *   in <code>about:config</code>.
   * @property {string} CAMERA Value <code>"camera"</code>
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
   *   Note that currently {@link Skylink#getUserMedia} only configures
   *   the maximum resolution of the Stream due to browser interopability and support.
   * </blockquote>
   * The list of <a href="https://en.wikipedia.org/wiki/Graphics_display_resolution#Video_Graphics_Array">
   * video resolutions</a> sets configured in the {@link Skylink#getUserMedia}.
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
   * The list of {@link Skylink#getUserMedia} or
   * {@link Skylink#shareScreen} Stream fallback states.
   * @typedef MEDIA_ACCESS_FALLBACK_STATE
   * @property {Object} FALLBACKING Value <code>0</code>
   *   The value of the state when <code>getUserMedia()</code> will retrieve audio track only
   *   when retrieving audio and video tracks failed.
   *   This can be configured by Skylink {@link initOptions}
   *   <code>audioFallback</code> option.
   * @property {Object} FALLBACKED  Value <code>1</code>
   *   The value of the state when <code>getUserMedia()</code> or <code>shareScreen()</code>
   *   retrieves camera / screensharing Stream successfully but with missing originally required audio or video tracks.
   * @property {Object} ERROR       Value <code>-1</code>
   *   The value of the state when <code>getUserMedia()</code> failed to retrieve audio track only
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
   */
  const CHUNK_DATAURL_SIZE = 1212;

  /**
   * Stores the list of data transfer protocols.
   * @typedef DC_PROTOCOL_TYPE
   * @property {string} WRQ The protocol to initiate data transfer.
   * @property {string} ACK The protocol to request for data transfer chunk.
   *   Give <code>-1</code> to reject the request at the beginning and <code>0</code> to accept
   *   the data transfer request.
   * @property {string} CANCEL The protocol to terminate data transfer.
   * @property {string} ERROR The protocol when data transfer has errors and has to be terminated.
   * @property {string} MESSAGE The protocol that is used to send P2P messages.
   * @constant
   * @type Object
   * @readOnly
   * @private
   * @memberOf SkylinkConstants
   * @since 0.5.2
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
   * @property {string} JOIN_ROOM Value <code>joinRoom</code>
   * Message sent by peer to Signalling server to join the room.
   * @property {string} IN_ROOM Value <code>inRoom</code>
   * Message received by peer from Signalling server when peer successfully connects to the room.
   * @property {string} ENTER Value <code>enter</code>
   * Message sent by peer to all peers in the room (after <code>inRoom</code> message).
   * @property {string} WELCOME Value <code>welcome</code>
   * Message sent by peer in response to <code>enter</code> message.
   * @property {string} OFFER Value <code>offer</code>
   * Messsage sent by the peer with the higher weight to the targeted peer after the enter/welcome message.
   * Message is sent after the local offer is created and set, or after all its local ICE candidates have been gathered completely for non-trickle ICE connections (gathering process happens after the local offer is set).
   * The targeted peer will have to set the received remote offer, create and set the local answer and send to sender peer the <code>answer</code> message to end the offer/answer handshaking process.
   * @property {string} ANSWER Value <code>answer</code>
   * Message sent by the targeted peer with the lower weight back to the peer in response to <code>offer</code> message.
   * The peer will have to set the received remote answer, which ends the offer/answer handshaking process.
   * @property {string} CANDIDATE Value <code>candidate</code>
   * Message sent by peer to targeted peer when it has gathered a local ICE candidate.
   * @property {string} BYE Value <code>bye</code>
   * Message that is broadcast by Signalling server when a peer's socket connection has been disconnected. This happens when a peer leaves the room.
   * @property {string} REDIRECT Value <code>redirect</code>
   * Message received from Signalling server when a peer fails to connect to the room (after <code>joinRoom</code> message).
   * @property {string} UPDATE_USER Value <code>updateUserEvent</code>
   * Message that is broadcast by peer to all peers in the room when the peer's custom userData has changed.
   * @property {string} ROOM_LOCK Value <code>roomLockEvent</code>
   * Message that is broadcast by peer to all peers in the room to toggle the Signaling server Room lock status
   * @property {string} MUTE_VIDEO_EVENT Value <code>muteVideoEvent</code>
   * Message that is broadcast by peer to all peers in the room to inform other peers that its sent stream object video tracks muted status have changed.
   * @property {string} MUTE_AUDIO_EVENT Value <code>muteAudioEvent</code>
   * Message that is broadcast by peer to all peers in the room to inform other peers that its sent stream object audio tracks muted status have changed.
   * @property {string} PUBLIC_MESSAGE Value <code>public</code>
   * Message sent by peer to all peers in the room as a public message.
   * @property {string} PRIVATE_MESSAGE Value <code>private</code>
   * Message sent to a targeted peer as a private message.
   * @property {string} STREAM Value <code>stream</code>
   * Message that is boradcast by peer to all peers in the room to indicate the sender peer's stream object status.
   * @property {string} GROUP Value <code>group</code>
   * Message that is boradcast by peer to all peers in the room for bundled messages that was sent before a second interval.
   * @property {string} GET_PEERS Value <code>getPeers</code>
   * Message sent by peer (connecting from a Privileged Key) to the Signaling server to retrieve a list of peer IDs in each room within the same App space (app keys that have the same parent app).
   * @property {string} PEER_LIST Value <code>peerList</code>
   * Message sent by Signalling server to the peer (connecting from a Privileged Key) containing the list of peer IDs.
   * @property {string} INTRODUCE Value <code>introduce</code>
   * Message sent by peer (connecting from a Privileged Key) to the Signaling server to introduce a peer to another peer in the same room. Peers can be a Privileged Key Peer or non-Privileged Key Peer.
   * @property {string} INTRODUCE_ERROR Value <code>introduceError</code>
   * Message sent by Signaling server to requestor peer (connecting from a Privileged Key) when introducing two peers fails.
   * @property {string} APPROACH Value <code>approach</code>
   * Message sent by Signaling server to the peer defined in the "sendingPeerId" in the <code>introduce</code> message.
   * @property {string} START_RECORDING Value <code>startRecordingRoom</code>
   * Message sent by peer to a peer (connecting from an MCU Key) to start recording session.
   * @property {string} STOP_RECORDING Value <code>stopRecordingRooms</code>
   * Message sent by peer to a peer (connecting from an MCU Key) to stop recording session.
   * @property {string} RECORDING Value <code>recordingEvent</code>
   * Message that is broadcast by peer (connecting from an MCU Key) to all peers to indicate the status of the recording session.
   * @property {string} END_OF_CANDIDATES Value <code>endOfCandidates</code>
   * Message that is sent by peer to the targeted peer after all its local ICE candidates gathering has completed.
   * @property {string} MEDIA_INFO_EVENT Value <code>mediaStateChangeEvent</code>
   * Message that is sent by peer to all peers to communicate change of media state.
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
    MUTE_VIDEO_EVENT: 'muteVideoEvent',
    MUTE_AUDIO_EVENT: 'muteAudioEvent',
  };

  const STREAM_STATUS = {
    ENDED: 'ended',
    REPLACED_STREAM_ENDED: 'replacedStreamEnded',
    SCREENSHARE_REPLACE_START: 'screenshareStart',
    USER_MEDIA_REPLACE_START: 'userMediaReplaceStart',
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
    SIG_MESSAGE_TYPE.MUTE_AUDIO_EVENT,
    SIG_MESSAGE_TYPE.MUTE_VIDEO_EVENT,
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
   * @property {string} PLAN_B
   *   The value of option to prefer plan-b sdp.
   * @property {string} UNIFIED
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
   * @property {string} STATS_MODULE
   * @property {string} SESSION_DESCRIPTION
   * @property {string} PEER_CONNECTION
   * @property {string} CANDIDATE_HANDLER
   * @property {string} SIG_SERVER
   * @property {string} PEER_MEDIA
   * @property {string} PEER_INFORMATION
   * @property {string} MEDIA_STREAM
   * @constant
   * @private
   * @type Object
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const TAGS = {
    SKYLINK_EVENT: 'SKYLINK EVENT',
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
    MEDIA_STREAM: 'MEDIA_STREAM',
  };

  /**
   * The list of media types.
   * @typedef MEDIA_TYPE
   * @property {string} AUDIO_MIC - Audio from a microphone.
   * @property {string} VIDEO_CAMERA - Video from a Camera of any type.
   * @property {string} VIDEO_SCREEN - Video of the Screen captured for screen sharing.
   * @property {string} VIDEO_OTHER - Video from source other than Camera.
   * @property {string} AUDIO - Audio from an unspecified MediaType.
   * @property {string} VIDEO - Video from an unspecified MediaType.
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
   * @property {string} MUTED - The state when the MediaTrack enabled flag is set to false. The MediaTrack is sending black frames.
   * @property {string} ACTIVE - The state when the MediaTrack enabled flag and active flag is set to true. The MediaTrack is sending frames with content.
   * @property {string} STOPPED - The state when the MediaTrack active flag is false. The MediaTrack is not sending any frames.
   * @property {string} UNAVAILABLE - The state when the MediaTrack is no longer available or has been disposed.
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
   * @type {string}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const SDK_VERSION = '2.0';

  /**
   * The SDK type.
   * @typedef SDK_TYPE
   * @type {Object}
   * @private
   * @constant
   * @readOnly
   * @memberOf SkylinkConstants
   * @since 2.0
   */
  const SDK_TYPE = {
    WEB: 'WEB_SDK',
    ANDROID: 'Android',
    IOS: 'iOS',
    CPP: 'cpp',
  };

  /**
   * The API version.
   * @typedef API_VERSION
   * @type {string}
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
   * @type {string}
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
    ERROR: 'error',
    RECONNECT_FAILED: 'reconnect_failed',
    RECONNECT_ERROR: 'reconnect_error',
    MESSAGE: 'message',
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

  /**
   * @namespace SkylinkConstants.EVENTS
   * @type {object}
   * @property {string} INCOMING_STREAM - 'onIncomingStream'
   * @property {string} INCOMING_SCREEN_STREAM - 'onIncomingScreenStream'
   * @property {string} STREAM_ENDED - 'streamEnded'
   * @property {string} PEER_UPDATED - 'peerUpdated'
   * @property {string} PEER_JOINED - 'peerJoined'
   * @property {string} PEER_LEFT - 'peerLeft'
   * @property {string} PEER_RESTART - 'peerRestart'
   * @property {string} PEER_CONNECTION_STATE - 'peerConnectionState'
   * @property {string} DATA_CHANNEL_STATE - 'dataChannelState'
   * @property {string} ON_INCOMING_MESSAGE - 'onIncomingMessage'
   * @property {string} HANDSHAKE_PROGRESS - 'handshakeProgress'
   * @property {string} SERVER_PEER_JOINED - 'serverPeerJoined'
   * @property {string} SERVER_PEER_RESTART - 'serverPeerRestart'
   * @property {string} SERVER_PEER_LEFT - 'serverPeerLeft'
   * @property {string} CANDIDATE_PROCESSING_STATE - 'candidateProcessingState'
   * @property {string} CANDIDATE_GENERATION_STATE - 'candidateGenerationState'
   * @property {string} CANDIDATES_GATHERED - 'candidatesGathered'
   * @property {string} DATA_STREAM_STATE - 'dataStreamState'
   * @property {string} DATA_TRANSFER_STATE - 'dataTransferState'
   * @property {string} ON_INCOMING_DATA - 'onIncomingData'
   * @property {string} ON_INCOMING_DATA_REQUEST - 'onIncomingDataRequest'
   * @property {string} ON_INCOMING_DATA_STREAM - 'onIncomingDataStream'
   * @property {string} ON_INCOMING_DATA_STREAM_STARTED - 'onIncomingDataStreamStarted'
   * @property {string} ON_INCOMING_DATA_STREAM_STOPPED - 'onIncomingDataStreamStopped'
   * @property {string} GET_PEERS_STATE_CHANGE - 'getPeersStateChange'
   * @property {string} SESSION_DISCONNECT - 'sessionDisconnect'
   * @property {string} STREAM_MUTED - 'streamMuted'
   * @property {string} CHANNEL_OPEN - 'channelOpen'
   * @property {string} CHANNEL_CLOSE - 'channelClose'
   * @property {string} CHANNEL_MESSAGE - 'channelMessage'
   * @property {string} CHANNEL_ERROR - 'channelError'
   * @property {string} CHANNEL_RETRY - 'channelRetry'
   * @property {string} SOCKET_ERROR - 'socketError'
   * @property {string} SYSTEM_ACTION - 'systemAction'
   * @property {string} MEDIA_ACCESS_FALLBACK - 'mediaAccessFallback'
   * @property {string} MEDIA_ACCESS_REQUIRED - 'mediaAccessRequired'
   * @property {string} MEDIA_ACCESS_STOPPED - 'mediaAccessStopped'
   * @property {string} MEDIA_ACCESS_SUCCESS - 'mediaAccessSuccess'
   * @property {string} RECORDING_STATE - 'recordingState'
   * @property {string} LOCAL_MEDIA_MUTED - 'localMediaMuted'
   * @property {string} MEDIA_ACCESS_ERROR - 'mediaAccessError'
   * @property {string} GET_CONNECTION_STATUS_STATE_CHANGE - 'getConnectionStatusStateChange'
   * @property {string} READY_STATE_CHANGE - 'readyStateChange'
   * @property {string} ROOM_LOCK - 'roomLock'
   * @property {string} INTRODUCE_STATE_CHANGE - 'introduceStateChange'
   * @property {string} ICE_CONNECTION_STATE - 'iceConnectionState'
   * @property {string} BYE - 'bye'
   * @property {string} RTMP_STATE - 'rtmpState'
   * @property {string} LOGGED_ON_CONSOLE - 'loggedOnConsole'
   * @property {string} MEDIA_INFO_DELETED - 'mediaInfoDeleted'
   * @memberOf SkylinkConstants
   * @constant
   * @readonly
   * @since 2.0
   */
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
    PRIORITY_WEIGHT_SCHEME: PRIORITY_WEIGHT_SCHEME,
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
    SDK_TYPE: SDK_TYPE,
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
      INFO: {
        API_SUCCESS: 'Promise resolved: APP Authenticated Successfully!',
      },
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
    },
    PEER_CONNECTION: {
      NO_PEER_CONNECTION: 'No Peer Connection detected',
      ERRORS: {
        REMOVE_TRACK: 'Error removing track from peer connection',
        REPLACE_TRACK: 'Error replacing track in peer connection',
        REFRESH: 'Error refreshing peer connection',
      },
      end_of_candidates: 'Signaling of end-of-candidates remote ICE gathering',
      end_of_candidate_failure: 'Failed signaling end-of-candidates ->',
      not_initialised: 'Peer connection is not initialised',
      getstats_api_not_available: 'getStats() API is not available',
      connection_status_no_pc: 'There is currently no peer connections to retrieve connection status',
      ice_connection_state: 'Ice connection state changed ->',
      peer_connection_state: 'Peer connection state changed ->',
      ice_gathering_state: 'Ice gathering state changed ->',
      refresh_start: 'START: Refreshing peer connections',
      refresh_failed: 'FAILED: Refreshing peer connections',
      refresh_completed: 'All peer connections refreshed with resolve or errors',
      refresh_peer_failed: 'Peer connection failed to refresh: ',
      refresh_peer_success: 'Peer connection refreshed successfully: ',
      refresh_no_peer_connection: 'There is currently no peer connections to restart',
      refresh_peerId_no_match: 'PeerId does not match existing peer connections',
      refresh_no_edge_support: 'Edge browser currently does not support renegotiation',
      refresh_not_supported: 'Failed restarting with other agents connecting from other SDKs as re-negotiation is not supported by other SDKs',
      peerId_does_not_exist: 'Peer Id does not exist ->',
    },
    PEER_PRIVILEGED: {
      not_privileged: 'Please upgrade your key to privileged to use this function',
      no_appkey: 'App key is not defined - Please authenticate again',
      getPeerListFromServer: 'Enquired server for peers within the App space',
    },
    ICE_CANDIDATE: {
      CANDIDATE_HANDLER: {
        DROPPING_ICE_CANDIDATE: 'Dropping ICE candidate',
        invalid_candidate_message: 'Received invalid ICE candidate message ->',
        valid_candidate_message: 'Received ICE candidate ->',
        no_peer_connection_event_log: 'Failed processing ICE candidate as Peer connection does not exists or is closed',
        matched_filtering_flag: 'Dropping received ICE candidate as it matches ICE candidate filtering flag ->',
        matched_filtering_flag_event_log: 'Dropping of processing ICE candidate as it matches ICE candidate filtering flag',
        filtering_flag_not_honored: 'Not dropping received ICE candidate as TURN connections are enforced as MCU is present (and act as a TURN itself) so filtering of ICE candidate flags are not honoured ->',
        added_ice_candidate: 'Added ICE candidate successfully',
        adding_ice_candidate: 'Adding ICE Candidate',
        failed_adding_ice_candidate: 'Failed adding ICE candidate ->',
        add_buffered_candidate: 'Adding buffered ICE candidate',
        end_of_candidate_success: 'Signaling of end-of-candidates remote ICE gathering',
        end_of_candidate_failure: 'Failed signaling of end-of-candidates remote ICE gathering',
        ice_gathering_started: 'ICE gathering has started',
        ice_gathering_completed: 'ICE gathering has completed',
        generate_ice_candidate: 'Generated ICE candidate ->',
        drop_eoc_signal: 'Dropping of sending ICE candidate end-of-candidates signal or unused ICE candidates to prevent errors ->',
        ice_trickle_disabled: 'Dropping of sending ICE candidate as trickle ICE is disabled ->',
        sending_ice_candidate: 'Sending ICE candidate ->',
        no_sdp: 'Not sending any session description after ICE gathering completed as it is not present',
      },
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
      ERRORS: {
        FAILED_CLOSING: 'Failed closing DataChannels --> ',
        NO_SESSIONS: 'Peer Connection does not have DataChannel sessions',
      },
    },
    NEGOTIATION_PROGRESS: {
      ERRORS: {
        no_peer_connection: 'Dropping of message as connection does not exist',
        not_stable: 'Dropping of message as signalingState is not stable',
        processing_existing_sdp: 'Dropping message as there is another sessionDescription being processed ->',
        offer_tiebreaker: 'Dropping the received offer: self weight is greater than incoming offer weight ->',
        no_local_buffered_offer: 'FATAL: No buffered local offer found - Unable to setLocalDescription',
      },
    },
    SIGNALING: {
      OUTDATED_MSG: 'Dropping outdated status ->',
      DROPPING_MUTE_EVENT: 'Dropping mute audio / video event message as it is processed by mediaInfoEvent',
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
      STOP_SETTINGS: 'Stopped streams with settings',
      STOP_SUCCESS: 'Successfully stopped and removed stream from state',
      REMOTE_TRACK_REMOVED: 'Remote MediaStreamTrack removed',
      START_FALLBACK: 'Fall back to retrieve audio only stream',
      NO_OPTIONS: 'No user media options provided',
      DEFAULT_OPTIONS: 'Using default options',
      FALLBACK_SUCCESS: 'Successfully retrieved audio fallback stream',
      START_SCREEN_SUCCESS: 'Successfully retrieved screen share stream',
      UPDATE_MUTED_SETTINGS: 'Updated stream muted setting',
      UPDATE_MEDIA_STATUS: 'Updated stream media status',
      AUDIO_MUTED: 'Peers\'s audio muted: ',
      VIDEO_MUTED: 'Peers\'s video muted: ',
      ERRORS: {
        STOP_SCREEN: 'Error stopping screen share stream',
        START_SCREEN: 'Error starting screen share stream',
        STOP_ADDED_STREAM: 'Error stopping added stream',
        STOP_REPLACED_STREAM: 'Error stopping replaced stream',
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
        REPLACE_SCREEN: 'Error replacing user media stream with screenshare stream',
        FALLBACK: 'Error retrieving fallback audio stream',
        INVALID_GUM_OPTIONS: 'Invalid user media options',
        GET_USER_MEDIA: 'Error retrieving stream from \'getUserMedia\' method',
        INVALID_MUTE_OPTIONS: 'Invalid muteStream options provided',
        SEND_STREAM: 'Error sending stream',
        INVALID_MEDIA_STREAM_ARRAY: 'Array is not of type MediaStream',
        ACTIVE_STREAMS: 'There are currently active streams being sent to remote peers. Please stop streams.',
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
      },
      HANDLE_ICE_GATHERING_STATS: {
        process_failed: 'process_failed',
        process_success: 'process_success',
        processing: 'processing',
        dropped: 'dropped',
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

      if (!this.events[evt.name]) {
        logger.log.DEBUG([null, TAGS.SKYLINK_EVENT, evt.name, MESSAGES.LOGGER.EVENT_DISPATCHED]);
        return;
      }

      const userCallbacks = this.events[evt.name].callbacks;
      const privateCallbacks = this.privateEvents[evt.name] ? this.privateEvents[evt.name].callbacks : [];
      const allEventCallbacks = userCallbacks.concat(privateCallbacks);
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

  const logFn = (logger, level, message, debugObject = null) => {
    const currentLevel = logger.level;
    const { logLevels } = logger;
    if (currentLevel <= level && currentLevel !== logLevels.SILENT) {
      const methodName = logMethods[level];
      if (checkSupport(methodName)) {
        const formattedMessage = getFormattedMessage(message);
        console[methodName](formattedMessage, debugObject || ''); // eslint-disable-line no-console
        dispatchEvent(loggedOnConsole({ level: methodName, message: formattedMessage, debugObject }));
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
   * import { SkylinkLogger } from 'skylink.esm.js';
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
    }

    /**
     * @description Method that sets the log level.
     * @param {number} level - The log level to be set. REF: {@link SkylinkLogger#logLevels|logLevels}
     * @public
     * @example
     * skylinkLogger.setLogLevels(skylinkLogger.logLevels.TRACE);
     * @alias SkylinkLogger#setLevel
     */
    setLevel(level = this.levels.ERROR) {
      if (typeof level === 'number') {
        this.level = level;
        persistLogLevel(this.level);
      } else {
        this.level = this.levels.ERROR;
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
   * @param {GetUserMediaOptions} options
   * @param {SkylinkState} roomState
   * @return {SkylinkState}
   * @memberOf MediaStreamHelpers
   * @private
   */
  const parseMediaOptions = (options, roomState) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const mediaOptions = options || {};

    state.userData = mediaOptions.userData || state.userData || '';
    state.streamsBandwidthSettings = {
      googleX: {},
      bAS: {},
    };
    state.publishOnly = false;
    state.sdpSettings = {
      connection: {
        audio: true,
        video: true,
        data: true,
      },
      direction: {
        audio: { send: true, receive: true },
        video: { send: true, receive: true },
      },
    };
    state.voiceActivityDetection = typeof mediaOptions.voiceActivityDetection === 'boolean' ? mediaOptions.voiceActivityDetection : true;
    state.peerConnectionConfig = {
      bundlePolicy: BUNDLE_POLICY.BALANCED,
      rtcpMuxPolicy: RTCP_MUX_POLICY.REQUIRE,
      iceCandidatePoolSize: 0,
      certificate: PEER_CERTIFICATE.AUTO,
      disableBundle: false,
    };
    state.bandwidthAdjuster = null;

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

    if (mediaOptions.googleXBandwidth) {
      if (typeof mediaOptions.googleXBandwidth.min === 'number') {
        state.streamsBandwidthSettings.googleX.min = mediaOptions.googleXBandwidth.min;
      }

      if (typeof mediaOptions.googleXBandwidth.max === 'number') {
        state.streamsBandwidthSettings.googleX.max = mediaOptions.googleXBandwidth.max;
      }
    }

    if (mediaOptions.sdpSettings) {
      if (mediaOptions.sdpSettings.direction) {
        if (mediaOptions.sdpSettings.direction.audio) {
          state.sdpSettings.direction.audio.receive = typeof mediaOptions.sdpSettings.direction.audio.receive === 'boolean' ? mediaOptions.sdpSettings.direction.audio.receive : true;
          state.sdpSettings.direction.audio.send = typeof mediaOptions.sdpSettings.direction.audio.send === 'boolean' ? mediaOptions.sdpSettings.direction.audio.send : true;
        }

        if (mediaOptions.sdpSettings.direction.video) {
          state.sdpSettings.direction.video.receive = typeof mediaOptions.sdpSettings.direction.video.receive === 'boolean' ? mediaOptions.sdpSettings.direction.video.receive : true;
          state.sdpSettings.direction.video.send = typeof mediaOptions.sdpSettings.direction.video.send === 'boolean' ? mediaOptions.sdpSettings.direction.video.send : true;
        }
      }
      if (mediaOptions.sdpSettings.connection) {
        state.sdpSettings.connection.audio = typeof mediaOptions.sdpSettings.connection.audio === 'boolean' ? mediaOptions.sdpSettings.connection.audio : true;
        state.sdpSettings.connection.video = typeof mediaOptions.sdpSettings.connection.video === 'boolean' ? mediaOptions.sdpSettings.connection.video : true;
        state.sdpSettings.connection.data = typeof mediaOptions.sdpSettings.connection.data === 'boolean' ? mediaOptions.sdpSettings.connection.data : true;
      }
    }

    if (mediaOptions.publishOnly) {
      state.sdpSettings.direction.audio.send = true;
      state.sdpSettings.direction.audio.receive = false;
      state.sdpSettings.direction.video.send = true;
      state.sdpSettings.direction.video.receive = false;
      state.publishOnly = true;
    }

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-prototype-builtins */
    if (mediaOptions.peerConnection && typeof mediaOptions.peerConnection === 'object') {
      if (typeof mediaOptions.peerConnection.bundlePolicy === 'string') {
        for (const bpProp in BUNDLE_POLICY) {
          if (BUNDLE_POLICY.hasOwnProperty(bpProp) && BUNDLE_POLICY[bpProp] === mediaOptions.peerConnection.bundlePolicy) {
            state.peerConnectionConfig.bundlePolicy = mediaOptions.peerConnection.bundlePolicy;
          }
        }
      }
      if (typeof mediaOptions.peerConnection.rtcpMuxPolicy === 'string') {
        for (const rmpProp in RTCP_MUX_POLICY) {
          if (RTCP_MUX_POLICY.hasOwnProperty(rmpProp) && RTCP_MUX_POLICY[rmpProp] === mediaOptions.peerConnection.rtcpMuxPolicy) {
            state.peerConnectionConfig.rtcpMuxPolicy = mediaOptions.peerConnection.rtcpMuxPolicy;
          }
        }
      }
      if (typeof mediaOptions.peerConnection.iceCandidatePoolSize === 'number' && mediaOptions.peerConnection.iceCandidatePoolSize > 0) {
        state.peerConnectionConfig.iceCandidatePoolSize = mediaOptions.peerConnection.iceCandidatePoolSize;
      }
      if (typeof mediaOptions.peerConnection.certificate === 'string') {
        for (const pcProp in PEER_CERTIFICATE) {
          if (PEER_CERTIFICATE.hasOwnProperty(pcProp) && PEER_CERTIFICATE[pcProp] === mediaOptions.peerConnection.certificate) {
            state.peerConnectionConfig.certificate = mediaOptions.peerConnection.certificate;
          }
        }
      }
      state.peerConnectionConfig.disableBundle = mediaOptions.peerConnection.disableBundle === true;
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
    const { streams } = state;
    const streamObjs = Object.values(streams.userMedia);
    let streamId = null;

    for (let i = 0; i < streamObjs.length; i += 1) {
      const tracks = streamObjs[i].stream.getTracks();

      for (let j = 0; j < tracks.length; j += 1) {
        if (isMatchedTrack(tracks[j], track)) {
          streamId = streamObjs[i].id;
          break;
        }
      }
    }

    return streamId;
  };

  const retrieveTracks = (room) => {
    const state = Skylink.getSkylinkState(room.id);
    const { streams } = state;
    const tracks = [];

    const fStreams = Object.values(streams.userMedia).map(streamObj => streamObj.stream);
    fStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        tracks.push(track);
      });
    });

    return tracks;
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
      helpers$5.sendMediaInfoMsg(room, updatedState.peerMedias[peerId][mediaId]);
    }
  };

  // dispatch event when:
  // 1) not from offer and answer
  // 2) self mediaInfo is updated
  // 3) self a new stream (with new mediaInfo obj) will replace an existing stream - e.g. screen share, send stream

  const updatePeerMediaInfo = (room, peerId, dispatchEvent, mediaId, key = false, value = false, mediaInfo = false) => {
    try {
      doUpdate(room, peerId, dispatchEvent, mediaId, key, value, mediaInfo);
      dispatchMediaInfoMsg(room, peerId, dispatchEvent, mediaId);
    } catch (err) {
      const msg = mediaInfo ? JSON.stringify(mediaInfo) : `${mediaId} - ${key}: ${value}`;
      logger.log.ERROR([peerId, TAGS.PEER_MEDIA, null, `${MESSAGES.MEDIA_INFO.ERRORS.FAILED_UPDATING} -- ${msg}`], err);
    }
  };

  const SOCKET_DEFAULTS = {
    RECONNECTION_ATTEMPTS: {
      WEBSOCKET: 5,
      POLLING: 4,
    },
    RECONNECTION_DELAY_MAX: 5000,
    RECONNECTION_DELAY: 1000,
    RECONNECTION_FINAL_ATTEMPTS: 10,
  };

  const SOCKET_CONFIG = options => ({
    forceNew: true,
    reconnection: true,
    timeout: options.socketTimeout,
    path: options.socketServerPath,
    reconnectionAttempts: SOCKET_DEFAULTS.RECONNECTION_ATTEMPTS.WEBSOCKET,
    reconnectionDelayMax: SOCKET_DEFAULTS.RECONNECTION_DELAY_MAX,
    reconnectionDelay: SOCKET_DEFAULTS.RECONNECTION_DELAY,
    transports: [SOCKET_TYPE.WEBSOCKET.toLowerCase()],
    query: {
      Skylink_SDK_type: SDK_TYPE.WEB,
      Skylink_SDK_version: SDK_VERSION,
      Skylink_API_version: API_VERSION,
      'X-Server-Select': SIGNALING_VERSION,
    },
    extraHeaders: {
      Skylink_SDK_type: SDK_TYPE.WEB,
      Skylink_SDK_version: SDK_VERSION,
      Skylink_API_version: API_VERSION,
      'X-Server-Select': SIGNALING_VERSION,
    },
  });

  const CONFIGS = {
    SOCKET: SOCKET_CONFIG,
  };

  const DEFAULTS = {
    SOCKET: SOCKET_DEFAULTS,
  };

  const retrieveConfig = (name, options) => CONFIGS[name](options);

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

    if (isAString(socketServer)) {
      url = socketServer;
    } else if (socketServer && isAObj(socketServer) && socketServer.protocol) {
      url = `${socketServer.protocol}//${socketServer.url}:${signalingServerPort}?rand=${Date.now()}`;
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
    const { socketPorts } = skylinkState;
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
      signalingServer: skylinkState.signalingServer,
      signalingServerPort: config.signalingServerPort,
      socketServer,
    });

    config.socketServer = url;
    config.socketServerPath = socketServerPath;
    skylinkState.socketSession = config;
    Skylink.setSkylinkState(skylinkState, params.roomKey);

    return window.io(url, socketConfig);
  };

  const processSignalingMessage = (messageHandler, message) => {
    const { type } = message;
    logger.log.INFO(['SIG SERVER', null, type, 'received']);
    switch (type) {
      case SIG_MESSAGE_TYPE.PUBLIC_MESSAGE: messageHandler.peerMessageFromSignaling(message, true); break;
      case SIG_MESSAGE_TYPE.PRIVATE_MESSAGE: messageHandler.peerMessageFromSignaling(message, false); break;
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
      // Backward compatibility for 0.9.x
      case SIG_MESSAGE_TYPE.MUTE_AUDIO_EVENT: messageHandler.muteAudioEventHandler(message); break;
      case SIG_MESSAGE_TYPE.MUTE_VIDEO_EVENT: messageHandler.muteVideoEventHandler(message); break;
    }
  };

  const isUser = (peerId, roomState) => {
    const { user } = roomState;
    return peerId === user.sid;
  };

  /**
   * @description Function that returns the User / Peer current session information.
   * @private
   * @param {string} peerId
   * @param {SkylinkState} roomState
   * @return {peerInfo}
   * @memberOf PeerDataHelpers
   */
  const getPeerInfo = (peerId, roomState) => {
    let peerInfo = null;
    if (!peerId) {
      return null;
    }
    const state = Skylink.getSkylinkState(roomState.room.id);

    if (!state) {
      Skylink.logNoRoomState(roomState.room.id);
      return peerInfo;
    }

    if (isUser(peerId, roomState)) {
      return PeerData.getCurrentSessionInfo(roomState.room);
    }

    peerInfo = clone_1(state.peerInformations[peerId]);

    if (!peerInfo) {
      logger.log.ERROR(`${MESSAGES.PEER_INFORMATIONS.NO_PEER_INFO} ${peerId}`);
      return peerInfo;
    }

    // FIXME: would there ever be a case of !peerInfo.settings?
    // if (!peerInfo.settings) {
    //   peerInfo.settings = {};
    // }

    // if (!peerInfo.mediaStatus) {
    //   peerInfo.mediaStatus = {};
    // }

    peerInfo.room = clone_1(roomState.room.roomName);

    peerInfo.settings.data = !!(state.dataChannels[peerId] && state.dataChannels[peerId].main && state.dataChannels[peerId].main.channel && state.dataChannels[peerId].main.channel.readyState === DATA_CHANNEL_STATE$1.OPEN);
    peerInfo.connected = state.peerConnStatus[peerId] && !!state.peerConnStatus[peerId].connected;
    peerInfo.init = state.peerConnStatus[peerId] && !!state.peerConnStatus[peerId].init;

    // peerInfo.settings.bandwidth = peerInfo.settings.bandwidth || {};
    // peerInfo.settings.googleXBandwidth = peerInfo.settings.googleXBandwidth || {};

    // if (!(typeof peerInfo.settings.video === 'boolean' || typeof peerInfo.settings.video === 'object')) {
    //   // peerInfo.settings.video = false;
    //   peerInfo.mediaStatus.audioMuted = true;
    // }

    // if (!(typeof peerInfo.settings.audio === 'boolean' || typeof peerInfo.settings.audio === 'object')) {
    //   // peerInfo.settings.audio = false;
    //   peerInfo.mediaStatus.audioMuted = true;
    // }

    // if (typeof peerInfo.mediaStatus.audioMuted !== 'boolean') {
    //   peerInfo.mediaStatus.audioMuted = true;
    // }

    // if (typeof peerInfo.mediaStatus.videoMuted !== 'boolean') {
    //   peerInfo.mediaStatus.videoMuted = true;
    // }

    // if (peerInfo.settings.maxBandwidth) {
    //   peerInfo.settings.bandwidth = clone(peerInfo.settings.maxBandwidth);
    //   delete peerInfo.settings.maxBandwidth;
    // }

    // if (peerInfo.settings.video && typeof peerInfo.settings.video === 'object' && peerInfo.settings.video.customSettings && typeof peerInfo.settings.video.customSettings === 'object') {
    // // if (peerInfo.settings.video.customSettings && typeof peerInfo.settings.video.customSettings === 'object') {
    //   if (peerInfo.settings.video.customSettings.frameRate) {
    //     peerInfo.settings.video.frameRate = clone(peerInfo.settings.video.customSettings.frameRate);
    //   }
    //   if (peerInfo.settings.video.customSettings.facingMode) {
    //     peerInfo.settings.video.facingMode = clone(peerInfo.settings.video.customSettings.facingMode);
    //   }
    //   if (peerInfo.settings.video.customSettings.width) {
    //     peerInfo.settings.video.resolution = peerInfo.settings.video.resolution || {};
    //     peerInfo.settings.video.resolution.width = clone(peerInfo.settings.video.customSettings.width);
    //   }
    //   if (peerInfo.settings.video.customSettings.height) {
    //     peerInfo.settings.video.resolution = peerInfo.settings.video.resolution || {};
    //     peerInfo.settings.video.resolution.height = clone(peerInfo.settings.video.customSettings.height);
    //   }
    // }

    // if (peerInfo.settings.audio && typeof peerInfo.settings.audio === 'object') {
    //   peerInfo.settings.audio.stereo = peerInfo.settings.audio.stereo === true;
    // }

    // TODO: check if receiveOnly and publishOnly is required
    if (peerId === PEER_TYPE.MCU) {
      peerInfo.config.receiveOnly = true;
      peerInfo.config.publishOnly = false;
    } else if (state.hasMCU) {
      peerInfo.config.receiveOnly = false;
      peerInfo.config.publishOnly = true;
    }

    // TODO: check if the sdp parsing is required
    // parse sdp to update media settings and status
    // if (!state.sdpSettings.direction.audio.receive) {
    //   peerInfo.settings.audio = false;
    //   peerInfo.mediaStatus.audioMuted = true;
    // }
    //
    // if (!state.sdpSettings.direction.video.receive) {
    //   peerInfo.settings.video = false;
    //   peerInfo.mediaStatus.videoMuted = true;
    // }
    //
    // if (!state.sdpSettings.connection.audio) {
    //   peerInfo.settings.audio = false;
    //   peerInfo.mediaStatus.audioMuted = true;
    // }
    //
    // if (!state.sdpSettings.connection.video) {
    //   peerInfo.settings.video = false;
    //   peerInfo.mediaStatus.videoMuted = true;
    // }

    // Makes sense to be send direction since we are retrieving information if Peer is sending anything to us
    // if (state.sdpSessions[peerId] && state.sdpSessions[peerId].remote && state.sdpSessions[peerId].remote.connection && typeof state.sdpSessions[peerId].remote.connection === 'object') {
    //   if (!(state.sdpSessions[peerId].remote.connection.audio && state.sdpSessions[peerId].remote.connection.audio.indexOf('send') > -1)) {
    //     peerInfo.settings.audio = false;
    //     peerInfo.mediaStatus.audioMuted = true;
    //   }
    //   if (!(state.sdpSessions[peerId].remote.connection.video && state.sdpSessions[peerId].remote.connection.video.indexOf('send') > -1)) {
    //     peerInfo.settings.video = false;
    //     peerInfo.mediaStatus.videoMuted = true;
    //   }
    //   if (!(state.sdpSessions[peerId].remote.connection.data && state.sdpSessions[peerId].remote.connection.data.indexOf('send') > -1)) {
    //     peerInfo.settings.data = false;
    //   }
    // }

    // if (!(peerInfo.userData !== null && typeof peerInfo.userData !== 'undefined')) {
    //   peerInfo.userData = '';
    // }

    // if (!peerInfo.settings.audio) {
    //   peerInfo.mediaStatus.audioMuted = true;
    // }
    //
    // if (!peerInfo.settings.video) {
    //   peerInfo.mediaStatus.videoMuted = true;
    // }

    if (!peerInfo.settings.audio && !peerInfo.settings.video) {
      peerInfo.config.receiveOnly = true;
      peerInfo.config.publishOnly = false;
    }

    return peerInfo;
  };

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
    const { AdapterJS } = window;
    const { enableDataChannel, enableIceTrickle, codecParams } = initOptions;
    const { roomName } = room;
    const {
      streamsMediaStatus,
      userData,
      peerPriorityWeight,
      enableIceRestart,
      publishOnly,
      SMProtocolVersion,
      DTProtocolVersion,
      streams,
      streamsBandwidthSettings,
      sdpSettings,
      user,
    } = state;

    const peerInfo = {
      userData,
      settings: {
        audio: false,
        video: false,
      },
      mediaStatus: {},
      agent: {
        name: AdapterJS.webrtcDetectedBrowser,
        version: AdapterJS.webrtcDetectedVersion,
        os: window.navigator.platform,
        pluginVersion: AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null,
        SMProtocolVersion,
        DTProtocolVersion,
        SDKVersion: SDK_VERSION,
      },
      room: roomName,
      config: {
        enableDataChannel,
        enableIceTrickle,
        enableIceRestart,
        priorityWeight: peerPriorityWeight,
        receiveOnly: false,
        publishOnly,
      },
      sid: user.sid,
      screenshare: false,
    };

    if (streams && streams.userMedia) {
      const streamIds = Object.keys(streams.userMedia);
      if (streams.userMedia[streamIds[0]]) { // assume that all the streams have the same settings
        peerInfo.settings = clone_1(streams.userMedia[streamIds[0]].settings);
      }
    }

    peerInfo.mediaStatus = streamsMediaStatus;

    peerInfo.userData = userData || null;

    peerInfo.config.receiveOnly = !peerInfo.settings.video && !peerInfo.settings.audio;

    if (streams.screenshare) {
      peerInfo.screenshare = true;
    }

    peerInfo.settings.maxBandwidth = clone_1(streamsBandwidthSettings.bAS);
    peerInfo.settings.googleXBandwidth = clone_1(streamsBandwidthSettings.googleX);

    if (peerInfo.settings.bandwidth) {
      peerInfo.settings.maxBandwidth = clone_1(peerInfo.settings.bandwidth);
      delete peerInfo.settings.bandwidth;
    }

    peerInfo.settings.data = enableDataChannel && sdpSettings.connection.data;

    if (peerInfo.settings.audio && isAObj(peerInfo.settings.audio)) {
      // Override the settings.audio.usedtx
      if (isABoolean(typeof codecParams.audio.opus.stereo)) {
        peerInfo.settings.audio.stereo = codecParams.audio.opus.stereo;
      }
      // Override the settings.audio.usedtx
      if (isABoolean(codecParams.audio.opus.usedtx)) {
        peerInfo.settings.audio.usedtx = codecParams.audio.opus.usedtx;
      }
      // Override the settings.audio.maxplaybackrate
      if (isANumber(codecParams.audio.opus.maxplaybackrate)) {
        peerInfo.settings.audio.maxplaybackrate = codecParams.audio.opus.maxplaybackrate;
      }
      // Override the settings.audio.useinbandfec
      if (isABoolean(codecParams.audio.opus.useinbandfec)) {
        peerInfo.settings.audio.useinbandfec = codecParams.audio.opus.useinbandfec;
      }
    }

    if (peerInfo.settings.video && isAObj(peerInfo.settings.video)) {
      peerInfo.settings.video.customSettings = {};

      if (peerInfo.settings.video.frameRate && isAObj(peerInfo.settings.video.frameRate)) {
        peerInfo.settings.video.customSettings.frameRate = clone_1(peerInfo.settings.video.frameRate);
        peerInfo.settings.video.frameRate = -1;
      }

      if (peerInfo.settings.video.facingMode && isAObj(peerInfo.settings.video.facingMode)) {
        peerInfo.settings.video.customSettings.facingMode = clone_1(peerInfo.settings.video.facingMode);
        peerInfo.settings.video.facingMode = '-1';
      }

      if (peerInfo.settings.video.resolution && isAObj(peerInfo.settings.video.resolution)) {
        if (peerInfo.settings.video.resolution.width && isAObj(peerInfo.settings.video.resolution.width)) {
          peerInfo.settings.video.customSettings.width = clone_1(peerInfo.settings.video.width);
          peerInfo.settings.video.resolution.width = -1;
        }

        if (peerInfo.settings.video.resolution.height && isAObj(peerInfo.settings.video.resolution.height)) {
          peerInfo.settings.video.customSettings.height = clone_1(peerInfo.settings.video.height);
          peerInfo.settings.video.resolution.height = -1;
        }
      }
    }

    if (!peerInfo.settings.audio && !peerInfo.settings.video) {
      peerInfo.config.receiveOnly = true;
      peerInfo.config.publishOnly = false;
    }

    return clone_1(peerInfo);
  };

  /**
   * @description Function that returns the userInfo to be sent to Signaling.
   * @private
   * @param {SkylinkRoom} room
   * @return {Object}
   * @memberOf PeerDataHelpers
   */
  const getUserInfo = (room) => {
    const userInfo = helpers$4.getCurrentSessionInfo(room);
    delete userInfo.room;
    // delete userInfo.config;
    // delete userInfo.settings.data;
    return userInfo;
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
    return roomState.userData;
  };

  /**
   * @description Function that overwrites the User current custom data.
   * @private
   * @param {SkylinkRoom} room
   * @param {string | Object} userData
   * @memberOf PeerDataHelpers
   * @fires peerUpdated
   */
  const setUserData = (room, userData) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const { PEER_INFORMATIONS: { UPDATE_USER_DATA } } = MESSAGES;

    let updatedUserData = userData;

    if (!updatedUserData) {
      updatedUserData = '';
    }

    roomState.userData = updatedUserData;

    new SkylinkSignalingServer().setUserData(roomState);

    dispatchEvent(peerUpdated({
      peerId: roomState.user.sid,
      peerInfo: helpers$4.getCurrentSessionInfo(room),
      isSelf: true,
    }));

    Skylink.setSkylinkState(roomState, roomState.room.id);
    logger.log.INFO(UPDATE_USER_DATA, updatedUserData);
  };

  const prepStopStream = (roomId, streamId, fromLeaveRoom = false, isScreensharing = false) => {
    const state = Skylink.getSkylinkState(roomId);
    const { streams, user } = state;

    if (!state || !streams) {
      logger.log.WARN([user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.ROOM_STATE.NOT_FOUND} - ${roomId}`]);
      return false;
    }

    if (!streams || (!isScreensharing && !streams.userMedia) || (isScreensharing && !streams.screenshare) || (isScreensharing && streams.screenshare && (streams.screenshare.id !== streamId))) {
      logger.log.WARN([user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM} - ${streamId}`]);
      return false;
    }

    if (isScreensharing) {
      return stopStreamHelpers.prepStopScreenStream(state.room, streamId, fromLeaveRoom);
    }

    return stopStreamHelpers.prepStopUserMediaStream(state, streamId, fromLeaveRoom);
  };

  const hasStreamBeenReplaced = (state, stoppedStream) => {
    const { streams } = state;

    if (!streams.userMedia) {
      return false;
    }

    const streamObjs = Object.values(streams.userMedia);

    return streamObjs.some(streamObj => streamObj.isReplaced && (streamObj.id === stoppedStream.id));
  };

  const filterUserMediaStreams = (state) => {
    const { streams } = state;
    const filteredStreams = {
      replacedStreams: [],
      addedStreams: [],
    };
    const streamIds = Object.keys(streams.userMedia);
    streamIds.forEach((userMediaStreamId) => {
      if (hasStreamBeenReplaced(state, streams.userMedia[userMediaStreamId].stream)) {
        filteredStreams.replacedStreams.push(streams.userMedia[userMediaStreamId].stream);
      } else {
        filteredStreams.addedStreams.push(streams.userMedia[userMediaStreamId].stream);
      }
    });

    return filteredStreams;
  };

  const prepStopUserMediaStream = (state, streamId, fromLeaveRoom) => {
    const { user } = state;
    const filteredStreams = filterUserMediaStreams(state);
    const isScreensharing = false;

    try {
      if (!streamId) {
        stopStreamHelpers.stopAddedStreams(state, filteredStreams.addedStreams, isScreensharing, fromLeaveRoom);

        // TODO:
        // added streams must be stopped first and renegotiation started before replaced streams are stopped
        // add event listener to listen for handshake offer to trigger stopReplacedStreams

        stopStreamHelpers.stopReplacedStreams(state, filteredStreams.replacedStreams, isScreensharing, fromLeaveRoom);
      } else {
        const { stream } = state.streams.userMedia[streamId];
        if (hasStreamBeenReplaced(state, stream)) {
          // TODO
          stopStreamHelpers.stopReplacedStream(state, stream, fromLeaveRoom);
        } else {
          stopStreamHelpers.stopAddedStream(state, stream, isScreensharing, fromLeaveRoom);
        }
      }

      stopStreamHelpers.initRefreshConnection(state.room, fromLeaveRoom);
    } catch (error) {
      logger.log.ERROR([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.STOP_USER_MEDIA], error);
    }
  };

  const getSDPCommonSupports = (targetMid, sessionDescription = null, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const offer = { audio: false, video: false };
    const { AdapterJS } = window;
    const { currentCodecSupport, peerInformations } = state;

    if (!targetMid || !(sessionDescription && sessionDescription.sdp)) {
      // TODO: Implement getCodecsSupport inside room-init
      offer.video = !!(currentCodecSupport.video.h264 || currentCodecSupport.video.vp8);
      offer.audio = !!currentCodecSupport.audio.opus;

      if (targetMid) {
        const peerAgent = ((peerInformations[targetMid] || {}).agent || {}).name || '';

        if (AdapterJS.webrtcDetectedBrowser === peerAgent) {
          offer.video = Object.keys(currentCodecSupport.video).length > 0;
          offer.audio = Object.keys(currentCodecSupport.audio).length > 0;
        }
      }
      return offer;
    }

    const remoteCodecs = helpers.getSDPCodecsSupport(targetMid, sessionDescription);
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

  const getSDPCodecsSupport = (targetMid, sessionDescription) => {
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

    logger.log.INFO([targetMid || null, 'RTCSessionDescription', sessionDescription.type, 'Parsed codecs support ->'], codecs);
    return codecs;
  };

  const getCodecsSupport = roomKey => new Promise((resolve, reject) => {
    const state = Skylink.getSkylinkState(roomKey);
    const updatedState = state;
    const { AdapterJS, RTCRtpSender, RTCPeerConnection } = window;

    if (state.currentCodecSupport) {
      resolve(state.currentCodecSupport);
    }

    updatedState.currentCodecSupport = { audio: {}, video: {} };

    // Safari 11 REQUIRES a stream first before connection works, hence let's spoof it for now
    if (AdapterJS.webrtcDetectedType === 'AppleWebKit') {
      updatedState.currentCodecSupport.audio = {
        opus: ['48000/2'],
      };
      updatedState.currentCodecSupport.video = {
        h264: ['48000'],
      };
      resolve(updatedState.currentCodecSupport);
    }

    try {
      if (window.webrtcDetectedBrowser === 'edge') {
        const { codecs } = RTCRtpSender.getCapabilities();

        for (let i = 0; i < codecs.length; i += 1) {
          if (['audio', 'video'].indexOf(codecs[i].kind) > -1 && codecs[i].name) {
            const codec = codecs[i].name.toLowerCase();
            updatedState.currentCodecSupport[codecs[i].kind][codec] = codecs[i].clockRate + (codecs[i].numChannels > 1 ? `/${codecs[i].numChannels}` : '');
          }
        }
        // Ignore .fecMechanisms for now
        resolve(updatedState.currentCodecSupport);
      } else {
        const pc = new RTCPeerConnection(null);
        const offerConstraints = AdapterJS.webrtcDetectedType !== 'plugin' ? {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        } : {
          mandatory: {
            OfferToReceiveVideo: true,
            OfferToReceiveAudio: true,
          },
        };

        // Prevent errors and proceed with create offer still...
        try {
          const channel = pc.createDataChannel('test');
          updatedState.binaryChunkType = channel.binaryType || state.binaryChunkType;
          updatedState.binaryChunkType = state.binaryChunkType.toLowerCase().indexOf('array') > -1 ? DATA_TRANSFER_DATA_TYPE.ARRAY_BUFFER : state.binaryChunkType;
          // Set the value according to the property
          const prop = Object.keys(DATA_TRANSFER_DATA_TYPE);
          for (let i = 0; i < prop.length; i += 1) {
            // eslint-disable-next-line no-prototype-builtins
            if (DATA_TRANSFER_DATA_TYPE.hasOwnProperty(prop)
                && state.binaryChunkType.toLowerCase() === DATA_TRANSFER_DATA_TYPE[prop].toLowerCase()) {
              updatedState.binaryChunkType = DATA_TRANSFER_DATA_TYPE[prop];
              break;
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}

        pc.createOffer(offerConstraints)
          .then((offer) => {
            updatedState.currentCodecSupport = SessionDescription.getSDPCodecsSupport(null, offer, roomKey);
            resolve(updatedState.currentCodecSupport);
          })
          .catch((error) => {
            reject(error);
          });
      }
    } catch (error) {
      reject(error);
    }
  });

  /* eslint-disable prefer-template */

  const parseFn = (sessionDescription, type, codecName, samplingRate, settings) => {
    const mLine = sessionDescription.sdp.match(new RegExp('m=' + type + '\ .*\r\n', 'gi'));
    // Find the m= line
    if (Array.isArray(mLine) && mLine.length > 0) {
      const codecsList = sessionDescription.sdp.match(new RegExp('a=rtpmap:.*\ ' + codecName + '\/'
        + (samplingRate ? samplingRate + (type === 'audio' ? '[\/]*.*' : '.*') : '.*') + '\r\n', 'gi'));
      // Get the list of codecs related to it
      if (Array.isArray(codecsList) && codecsList.length > 0) {
        for (let i = 0; i < codecsList.length; i += 1) {
          const payload = (codecsList[i].split('a=rtpmap:')[1] || '').split(' ')[0];
          if (!payload) {
            continue;
          }
          const fmtpLine = sessionDescription.sdp.match(new RegExp('a=fmtp:' + payload + '\ .*\r\n', 'gi'));
          let updatedFmtpLine = 'a=fmtp:' + payload + ' ';
          const addedKeys = [];
          // Check if a=fmtp: line exists
          if (Array.isArray(fmtpLine) && fmtpLine.length > 0) {
            const fmtpParts = (fmtpLine[0].split('a=fmtp:' + payload + ' ')[1] || '').replace(/ /g, '').replace(/\r\n/g, '').split(';');
            for (let j = 0; j < fmtpParts.length; j += 1) {
              if (!fmtpParts[j]) {
                continue;
              }
              const keyAndValue = fmtpParts[j].split('=');
              if (settings.hasOwnProperty(keyAndValue[0])) {
                // Dont append parameter key+value if boolean and false
                updatedFmtpLine += typeof settings[keyAndValue[0]] === 'boolean' ? (settings[keyAndValue[0]]
                  ? keyAndValue[0] + '=1;' : '') : keyAndValue[0] + '=' + settings[keyAndValue[0]] + ';';
              } else {
                updatedFmtpLine += fmtpParts[j] + ';';
              }
              addedKeys.push(keyAndValue[0]);
            }
            sessionDescription.sdp = sessionDescription.sdp.replace(fmtpLine[0], '');
          }
          for (const key in settings) {
            if (settings.hasOwnProperty(key) && addedKeys.indexOf(key) === -1) {
              // Dont append parameter key+value if boolean and false
              updatedFmtpLine += typeof settings[key] === 'boolean' ? (settings[key] ? key + '=1;' : '') : key + '=' + settings[key] + ';';
              addedKeys.push(key);
            }
          }
          if (updatedFmtpLine !== 'a=fmtp:' + payload + ' ') {
            sessionDescription.sdp = sessionDescription.sdp.replace(codecsList[i], codecsList[i] + updatedFmtpLine + '\r\n');
          }
        }
      }
    }
  };

  const setSDPCodecParams = (targetMid, sessionDescription, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const initOptions = Skylink.getInitOptions();

    // Set audio codecs -> OPUS
    // RFC: https://tools.ietf.org/html/draft-ietf-payload-rtp-opus-11
    parseFn(sessionDescription, 'audio', AUDIO_CODEC.OPUS, 48000, (() => {
      const opusOptions = {};
      // let audioSettings = state.streams.screenshare ? state.streams.screenshare.settings.audio : (state.streams.userMedia ? state.streams.userMedia.settings.audio : {});
      // TODO: check if settings across different streams are the same
      // FIXME: Quickfix to pass in first stream
      const streamIds = Object.keys(state.streams.userMedia);
      let audioSettings = state.streams.userMedia ? state.streams.userMedia[streamIds[0]].settings.audio : {};
      audioSettings = audioSettings && typeof audioSettings === 'object' ? audioSettings : {};
      if (typeof initOptions.codecParams.audio.opus.stereo === 'boolean') {
        opusOptions.stereo = initOptions.codecParams.audio.opus.stereo;
      } else if (typeof audioSettings.stereo === 'boolean') {
        opusOptions.stereo = audioSettings.stereo;
      }
      if (typeof initOptions.codecParams.audio.opus['sprop-stereo'] === 'boolean') {
        opusOptions['sprop-stereo'] = initOptions.codecParams.audio.opus['sprop-stereo'];
      } else if (typeof audioSettings.stereo === 'boolean') {
        opusOptions['sprop-stereo'] = audioSettings.stereo;
      }
      if (typeof initOptions.codecParams.audio.opus.usedtx === 'boolean') {
        opusOptions.usedtx = initOptions.codecParams.audio.opus.usedtx;
      } else if (typeof audioSettings.usedtx === 'boolean') {
        opusOptions.usedtx = audioSettings.usedtx;
      }
      if (typeof initOptions.codecParams.audio.opus.useinbandfec === 'boolean') {
        opusOptions.useinbandfec = initOptions.codecParams.audio.opus.useinbandfec;
      } else if (typeof audioSettings.useinbandfec === 'boolean') {
        opusOptions.useinbandfec = audioSettings.useinbandfec;
      }
      if (typeof initOptions.codecParams.audio.opus.maxplaybackrate === 'number') {
        opusOptions.maxplaybackrate = initOptions.codecParams.audio.opus.maxplaybackrate;
      } else if (typeof audioSettings.maxplaybackrate === 'number') {
        opusOptions.maxplaybackrate = audioSettings.maxplaybackrate;
      }
      if (typeof initOptions.codecParams.audio.opus.minptime === 'number') {
        opusOptions.minptime = initOptions.codecParams.audio.opus.minptime;
      } else if (typeof audioSettings.minptime === 'number') {
        opusOptions.minptime = audioSettings.minptime;
      }
      // Possible future params: sprop-maxcapturerate, maxaveragebitrate, sprop-stereo, cbr
      // NOT recommended: maxptime, ptime, rate, minptime
      return opusOptions;
    })());

    // RFC: https://tools.ietf.org/html/rfc4733
    // Future: Set telephone-event: 100 0-15,66,70

    // RFC: https://tools.ietf.org/html/draft-ietf-payload-vp8-17
    // Set video codecs -> VP8
    parseFn(sessionDescription, 'video', VIDEO_CODEC.VP8, null, (() => {
      const vp8Options = {};
      // NOT recommended: max-fr, max-fs (all are codec decoder capabilities)
      if (typeof initOptions.codecParams.video.vp8.maxFr === 'number') {
        vp8Options['max-fr'] = initOptions.codecParams.video.vp8.maxFr;
      }
      if (typeof initOptions.codecParams.video.vp8.maxFs === 'number') {
        vp8Options['max-fs'] = initOptions.codecParams.video.vp8.maxFs;
      }
      return vp8Options;
    })());

    // RFC: https://tools.ietf.org/html/draft-ietf-payload-vp9-02
    // Set video codecs -> VP9
    parseFn(sessionDescription, 'video', VIDEO_CODEC.VP9, null, (() => {
      const vp9Options = {};
      // NOT recommended: max-fr, max-fs (all are codec decoder capabilities)
      if (typeof initOptions.codecParams.video.vp9.maxFr === 'number') {
        vp9Options['max-fr'] = initOptions.codecParams.video.vp9.maxFr;
      }
      if (typeof initOptions.codecParams.video.vp9.maxFs === 'number') {
        vp9Options['max-fs'] = initOptions.codecParams.video.vp9.maxFs;
      }
      return vp9Options;
    })());

    // RFC: https://tools.ietf.org/html/rfc6184
    // Set the video codecs -> H264
    parseFn(sessionDescription, 'video', VIDEO_CODEC.H264, null, (() => {
      const h264Options = {};
      if (typeof initOptions.codecParams.video.h264.levelAsymmetryAllowed === 'string') {
        h264Options['profile-level-id'] = initOptions.codecParams.video.h264.profileLevelId;
      }
      if (typeof initOptions.codecParams.video.h264.levelAsymmetryAllowed === 'boolean') {
        h264Options['level-asymmetry-allowed'] = initOptions.codecParams.video.h264.levelAsymmetryAllowed;
      }
      if (typeof initOptions.codecParams.video.h264.packetizationMode === 'boolean') {
        h264Options['packetization-mode'] = initOptions.codecParams.video.h264.packetizationMode;
      }
      // Possible future params (remove if they are decoder/encoder capabilities or info):
      //   max-recv-level, max-mbps, max-smbps, max-fs, max-cpb, max-dpb, max-br,
      //   max-mbps, max-smbps, max-fs, max-cpb, max-dpb, max-br, redundant-pic-cap, sprop-parameter-sets,
      //   sprop-level-parameter-sets, use-level-src-parameter-sets, in-band-parameter-sets,
      //   sprop-interleaving-depth, sprop-deint-buf-req, deint-buf-cap, sprop-init-buf-time,
      //   sprop-max-don-diff, max-rcmd-nalu-size, sar-understood, sar-supported
      //   NOT recommended: profile-level-id (WebRTC uses "42e00a" for the moment)
      //   https://bugs.chromium.org/p/chromium/issues/detail?id=645599
      return h264Options;
    })());

    return sessionDescription.sdp;
  };

  /* eslint-disable no-param-reassign */
  const removeSDPFilteredCandidates = (targetMid, sessionDescription, roomKey) => {
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(roomKey);
    // Handle Firefox MCU Peer ICE candidates
    if (targetMid === PEER_TYPE.MCU && sessionDescription.type === HANDSHAKE_PROGRESS$1.ANSWER
      && window.webrtcDetectedBrowser === 'firefox') {
      sessionDescription.sdp = sessionDescription.sdp.replace(/ generation 0/g, '');
      sessionDescription.sdp = sessionDescription.sdp.replace(/ udp /g, ' UDP ');
    }

    if (initOptions.forceTURN && state.hasMCU) {
      logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Not filtering ICE candidates as '
      + 'TURN connections are enforced as MCU is present (and act as a TURN itself) so filtering of ICE candidate '
      + 'flags are not honoured']);
      return sessionDescription.sdp;
    }

    if (initOptions.filterCandidatesType.host) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Removing "host" ICE candidates.']);
      sessionDescription.sdp = sessionDescription.sdp.replace(/a=candidate:.*host.*\r\n/g, '');
    }

    if (initOptions.filterCandidatesType.srflx) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Removing "srflx" ICE candidates.']);
      sessionDescription.sdp = sessionDescription.sdp.replace(/a=candidate:.*srflx.*\r\n/g, '');
    }

    if (initOptions.filterCandidatesType.relay) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Removing "relay" ICE candidates.']);
      sessionDescription.sdp = sessionDescription.sdp.replace(/a=candidate:.*relay.*\r\n/g, '');
    }
    // sessionDescription.sdp = sessionDescription.sdp.replace(/a=candidate:(?!.*relay.*).*\r\n/g, '');
    return sessionDescription.sdp;
  };

  /* eslint-disable prefer-template */

  const setSDPCodec = (targetMid, sessionDescription, roomKey, overrideSettings) => {
    const initOptions = Skylink.getInitOptions(roomKey);
    const parseFn = (type, codecSettings) => {
      const codec = typeof codecSettings === 'object' ? codecSettings.codec : codecSettings;
      let samplingRate = typeof codecSettings === 'object' ? codecSettings.samplingRate : null;
      let channels = typeof codecSettings === 'object' ? codecSettings.channels : null;

      if (codec === SkylinkConstants[type === 'audio' ? 'AUDIO_CODEC' : 'VIDEO_CODEC'].AUTO) {
        logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type, `Not preferring any codec for ${type} streaming. Using browser selection.`]);
        return;
      }

      const mLine = sessionDescription.sdp.match(new RegExp('m=' + type + ' .*\r\n', 'gi'));

      if (!(Array.isArray(mLine) && mLine.length > 0)) {
        logger.log.ERROR([targetMid, 'RTCSessionDesription', sessionDescription.type, `Not preferring any codec for ${type} streaming as m= line is not found.`]);
        return;
      }

      const setLineFn = (codecsList, isSROk, isChnlsOk) => {
        if (Array.isArray(codecsList) && codecsList.length > 0) {
          if (!isSROk) {
            samplingRate = null;
          }
          if (!isChnlsOk) {
            channels = null;
          }
          logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Preferring "' + codec + '" (samplingRate: ' + (samplingRate || 'n/a') + ', channels: ' + (channels || 'n/a') + ') for "' + type + '" streaming.']);

          let line = mLine[0];
          const lineParts = line.replace('\r\n', '').split(' ');
          // Set the m=x x UDP/xxx
          line = lineParts[0] + ' ' + lineParts[1] + ' ' + lineParts[2] + ' ';
          // Remove them to leave the codecs only
          lineParts.splice(0, 3);
          // Loop for the codecs list to append first
          for (let i = 0; i < codecsList.length; i += 1) {
            const parts = (codecsList[i].split('a=rtpmap:')[1] || '').split(' ');
            if (parts.length < 2) {
              continue;
            }
            line += parts[0] + ' ';
          }
          // Loop for later fallback codecs to append
          for (let j = 0; j < lineParts.length; j += 1) {
            if (line.indexOf(' ' + lineParts[j]) > 0) {
              lineParts.splice(j, 1);
              j -= 1;
            } else if (sessionDescription.sdp.match(new RegExp('a=rtpmap:' + lineParts[j] + '\ ' + codec + '/.*\r\n', 'gi'))) {
              line += lineParts[j] + ' ';
              lineParts.splice(j, 1);
              j -= 1;
            }
          }
          // Append the rest of the codecs
          line += lineParts.join(' ') + '\r\n';
          sessionDescription.sdp = sessionDescription.sdp.replace(mLine[0], line);
          return true;
        }
      };

      // If samplingRate & channels
      if (samplingRate) {
        if (type === 'audio' && channels && setLineFn(sessionDescription.sdp.match(new RegExp('a=rtpmap:.*\ '
          + codec + '\/' + samplingRate + (channels === 1 ? '[\/1]*' : '\/' + channels) + '\r\n', 'gi')), true, true)) {
          return;
        } else if (setLineFn(sessionDescription.sdp.match(new RegExp('a=rtpmap:.*\ ' + codec + '\/' + samplingRate + '[\/]*.*\r\n', 'gi')), true)) {
          return;
        }
      }
      if (type === 'audio' && channels && setLineFn(sessionDescription.sdp.match(new RegExp('a=rtpmap:.*\ ' + codec + '\/.*\/' + channels + '\r\n', 'gi')), false, true)) {
        return;
      }

      setLineFn(sessionDescription.sdp.match(new RegExp('a=rtpmap:.*\ ' + codec + '\/.*\r\n', 'gi')));
    };

    parseFn('audio', overrideSettings ? overrideSettings.audio : initOptions.audioCodec);
    parseFn('video', overrideSettings ? overrideSettings.video : initOptions.videoCodec);

    return sessionDescription.sdp;
  };

  /* eslint-disable prefer-template */

  const setSDPBitrate = (targetMid, sessionDescription, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const sdpLines = sessionDescription.sdp.split('\r\n');
    const parseFn = function (type, bw) {
      let mLineType = type;
      let mLineIndex = -1;
      let cLineIndex = -1;

      if (type === 'data') {
        mLineType = 'application';
      }

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
        logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type, `Not limiting ${type} bandwidth`]);
        return;
      }

      if (cLineIndex === -1) {
        logger.log.ERROR([targetMid, 'RTCSessionDesription', sessionDescription.type, `Failed setting ${type} bandwidth as c-line is missing.`]);
        return;
      }

      // Follow RFC 4566, that the b-line should follow after c-line.
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, `Limiting maximum sending ${type} bandwidth ->`], bw);
      sdpLines.splice(cLineIndex + 1, 0, window.webrtcDetectedBrowser === 'firefox' ? 'b=TIAS:' + (bw * 1000 * (window.webrtcDetectedVersion > 52 && window.webrtcDetectedVersion < 55 ? 1000 : 1)).toFixed(0) : 'b=AS:' + bw);
    };

    let bASAudioBw = state.streamsBandwidthSettings.bAS.audio;
    let bASVideoBw = state.streamsBandwidthSettings.bAS.video;
    let bASDataBw = state.streamsBandwidthSettings.bAS.data;
    let googleXMinBw = state.streamsBandwidthSettings.googleX.min;
    let googleXMaxBw = state.streamsBandwidthSettings.googleX.max;

    if (state.peerCustomConfigs[targetMid]) {
      if (state.peerCustomConfigs[targetMid].bandwidth
        && typeof state.peerCustomConfigs[targetMid].bandwidth === 'object') {
        if (typeof state.peerCustomConfigs[targetMid].bandwidth.audio === 'number') {
          bASAudioBw = state.peerCustomConfigs[targetMid].bandwidth.audio;
        }
        if (typeof state.peerCustomConfigs[targetMid].bandwidth.video === 'number') {
          bASVideoBw = state.peerCustomConfigs[targetMid].bandwidth.video;
        }
        if (typeof state.peerCustomConfigs[targetMid].bandwidth.data === 'number') {
          bASDataBw = state.peerCustomConfigs[targetMid].bandwidth.data;
        }
      }
      if (state.peerCustomConfigs[targetMid].googleXBandwidth && typeof state.peerCustomConfigs[targetMid].googleXBandwidth === 'object') {
        if (typeof state.peerCustomConfigs[targetMid].googleXBandwidth.min === 'number') {
          googleXMinBw = state.peerCustomConfigs[targetMid].googleXBandwidth.min;
        }
        if (typeof state.peerCustomConfigs[targetMid].googleXBandwidth.max === 'number') {
          googleXMaxBw = state.peerCustomConfigs[targetMid].googleXBandwidth.max;
        }
      }
    }

    parseFn('audio', bASAudioBw);
    parseFn('video', bASVideoBw);
    parseFn('data', bASDataBw);

    // Sets the experimental google bandwidth
    if ((typeof googleXMinBw === 'number') || (typeof googleXMaxBw === 'number')) {
      let codec = null;
      let codecRtpMapLineIndex = -1;
      let codecFmtpLineIndex = -1;

      for (let j = 0; j < sdpLines.length; j += 1) {
        if (sdpLines[j].indexOf('m=video') === 0) {
          codec = sdpLines[j].split(' ')[3];
        } else if (codec) {
          if (sdpLines[j].indexOf('m=') === 0) {
            break;
          }

          if (sdpLines[j].indexOf('a=rtpmap:' + codec + ' ') === 0) {
            codecRtpMapLineIndex = j;
          } else if (sdpLines[j].indexOf('a=fmtp:' + codec + ' ') === 0) {
            sdpLines[j] = sdpLines[j].replace(/x-google-(min|max)-bitrate=[0-9]*[;]*/gi, '');
            codecFmtpLineIndex = j;
            break;
          }
        }
      }

      if (codecRtpMapLineIndex > -1) {
        let xGoogleParams = '';

        if (typeof googleXMinBw === 'number') {
          xGoogleParams += 'x-google-min-bitrate=' + googleXMinBw + ';';
        }

        if (typeof googleXMaxBw === 'number') {
          xGoogleParams += 'x-google-max-bitrate=' + googleXMaxBw + ';';
        }

        logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Limiting x-google-bitrate ->'], xGoogleParams);

        if (codecFmtpLineIndex > -1) {
          sdpLines[codecFmtpLineIndex] += (sdpLines[codecFmtpLineIndex].split(' ')[1] ? ';' : '') + xGoogleParams;
        } else {
          sdpLines.splice(codecRtpMapLineIndex + 1, 0, 'a=fmtp:' + codec + ' ' + xGoogleParams);
        }
      }
    }

    return sdpLines.join('\r\n');
  };

  /* eslint-disable prefer-template,no-param-reassign */

  const removeSDPCodecs = (targetMid, sessionDescription, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const audioSettings = PeerData.getCurrentSessionInfo(state.room).settings.audio;
    const initOptions = Skylink.getInitOptions();

    const parseFn = (type, codec) => {
      const payloadList = sessionDescription.sdp.match(new RegExp('a=rtpmap:(\\d*)\\ ' + codec + '.*', 'gi'));

      if (!(Array.isArray(payloadList) && payloadList.length > 0)) {
        logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type, `Not removing ${codec} as it does not exists.`]);
        return;
      }

      for (let i = 0; i < payloadList.length; i += 1) {
        const payload = payloadList[i].split(' ')[0].split(':')[1];

        logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type,
          'Removing "' + codec + '" payload ->'], payload);

        sessionDescription.sdp = sessionDescription.sdp.replace(new RegExp('a=rtpmap:' + payload + '\\ .*\\r\\n', 'g'), '');
        sessionDescription.sdp = sessionDescription.sdp.replace(new RegExp('a=fmtp:' + payload + '\\ .*\\r\\n', 'g'), '');
        sessionDescription.sdp = sessionDescription.sdp.replace(new RegExp('a=rtpmap:\\d+ rtx\\/\\d+\\r\\na=fmtp:\\d+ apt=' + payload + '\\r\\n', 'g'), '');

        // Remove the m-line codec
        const sdpLines = sessionDescription.sdp.split('\r\n');

        for (let j = 0; j < sdpLines.length; j += 1) {
          if (sdpLines[j].indexOf('m=' + type) === 0) {
            const parts = sdpLines[j].split(' ');

            if (parts.indexOf(payload) >= 3) {
              parts.splice(parts.indexOf(payload), 1);
            }

            sdpLines[j] = parts.join(' ');
            break;
          }
        }

        sessionDescription.sdp = sdpLines.join('\r\n');
      }
    };

    if (initOptions.disableVideoFecCodecs) {
      if (state.hasMCU) {
        logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type,
          'Not removing "ulpfec" or "red" codecs as connected to MCU to prevent connectivity issues.']);
      } else {
        parseFn('video', 'red');
        parseFn('video', 'ulpfec');
      }
    }

    if (initOptions.disableComfortNoiseCodec && audioSettings && typeof audioSettings === 'object' && audioSettings.stereo) {
      parseFn('audio', 'CN');
    }

    if (window.webrtcDetectedBrowser === 'edge' && (((state.peerInformations[targetMid] || {}).agent || {}).name || 'unknown').name !== 'edge') {
      // eslint-disable-next-line no-useless-escape
      sessionDescription.sdp = sessionDescription.sdp.replace(/a=rtcp-fb:.*\ x-message\ .*\r\n/gi, '');
    }

    return sessionDescription.sdp;
  };

  const removeSDPREMBPackets = (targetMid, sessionDescription) => {
    const initOptions = Skylink.getInitOptions();
    if (!initOptions.disableREMB) {
      return sessionDescription.sdp;
    }

    logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Removing REMB packets.']);
    return sessionDescription.sdp.replace(/a=rtcp-fb:\d+ goog-remb\r\n/g, '');
  };

  /* eslint-disable no-continue,no-nested-ternary */

  const handleSDPConnectionSettings = (targetMid, sessionDescription, roomKey, direction) => {
    const state = Skylink.getSkylinkState(roomKey);

    if (!state.sdpSessions[targetMid]) {
      return sessionDescription.sdp;
    }

    let sessionDescriptionStr = sessionDescription.sdp;

    // Handle a=end-of-candidates signaling for non-trickle ICE before setting remote session description
    if (direction === 'remote' && !PeerData.getPeerInfo(targetMid, state).config.enableIceTrickle) {
      sessionDescriptionStr = sessionDescriptionStr.replace(/a=end-of-candidates\r\n/g, '');
    }

    const sdpLines = sessionDescriptionStr.split('\r\n');
    const peerAgent = ((state.peerInformations[targetMid] || {}).agent || {}).name || '';
    const bundleLineMids = [];
    const settings = clone_1(state.sdpSettings);
    let mediaType = '';
    let bundleLineIndex = -1;
    let mLineIndex = -1;

    if (targetMid === PEER_TYPE.MCU) {
      settings.connection.audio = true;
      settings.connection.video = true;
      settings.connection.data = true;
    }

    // Patches for MCU sending empty video stream despite audio+video is not sending at all
    // Apply as a=inactive when supported
    if (state.hasMCU) {
      const peerStreamSettings = clone_1(PeerData.getPeerInfo(targetMid, state)).settings || {};
      settings.direction.audio.receive = targetMid === PEER_TYPE.MCU ? true : !!peerStreamSettings.audio;
      settings.direction.audio.send = targetMid === PEER_TYPE.MCU;
      settings.direction.video.receive = targetMid === PEER_TYPE.MCU ? true : !!peerStreamSettings.video;
      settings.direction.video.send = targetMid === PEER_TYPE.MCU;
    }

    if (direction === 'remote') {
      const offerCodecs = SessionDescription.getSDPCommonSupports(targetMid, sessionDescription, roomKey);

      if (!offerCodecs.audio) {
        settings.connection.audio = false;
      }

      if (!offerCodecs.video) {
        settings.connection.video = false;
      }
    }

    // ANSWERER: Reject only the m= lines. Returned rejected m= lines as well.
    // OFFERER: Remove m= lines

    state.sdpSessions[targetMid][direction].mLines = [];
    state.sdpSessions[targetMid][direction].bundleLine = '';
    state.sdpSessions[targetMid][direction].connection = {
      audio: null,
      video: null,
      data: null,
    };

    for (let i = 0; i < sdpLines.length; i += 1) {
      // Cache the a=group:BUNDLE line used for remote answer from Edge later
      if (sdpLines[i].indexOf('a=group:BUNDLE') === 0) {
        state.sdpSessions[targetMid][direction].bundleLine = sdpLines[i];
        bundleLineIndex = i;

        // Check if there's a need to reject m= line
      } else if (sdpLines[i].indexOf('m=') === 0) {
        mediaType = (sdpLines[i].split('m=')[1] || '').split(' ')[0] || '';
        mediaType = mediaType === 'application' ? 'data' : mediaType;
        mLineIndex += 1;

        state.sdpSessions[targetMid][direction].mLines[mLineIndex] = sdpLines[i];

        // Check if there is missing unsupported video codecs support and reject it regardles of MCU Peer or not
        if (!settings.connection[mediaType]) {
          logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, `Removing rejected m=${mediaType} line ->`], sdpLines[i]);

          // Check if answerer and we do not have the power to remove the m line if index is 0
          // Set as a=inactive because we do not have that power to reject it somehow.
          // first m= line cannot be rejected for BUNDLE
          if (state.peerConnectionConfig.bundlePolicy === BUNDLE_POLICY.MAX_BUNDLE && bundleLineIndex > -1 && mLineIndex === 0 && (direction === 'remote' ? sessionDescription.type === HANDSHAKE_PROGRESS$1.OFFER : sessionDescription.type === HANDSHAKE_PROGRESS$1.ANSWER)) {
            logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type, `Not removing rejected m='${mediaType} line ->`], sdpLines[i]);
            settings.connection[mediaType] = true;
            if (['audio', 'video'].indexOf(mediaType) > -1) {
              settings.direction[mediaType].send = false;
              settings.direction[mediaType].receive = false;
            }
            continue;
          }

          if (window.webrtcDetectedBrowser === 'edge') {
            sdpLines.splice(i, 1);
            i -= 1;
            continue;
          } else if (direction === 'remote' || sessionDescription.type === HANDSHAKE_PROGRESS$1.ANSWER) {
            const parts = sdpLines[i].split(' ');
            parts[1] = 0;
            sdpLines[i] = parts.join(' ');
            continue;
          }
        }
      }

      if (direction === 'remote' && sdpLines[i].indexOf('a=candidate:') === 0
        && !PeerData.getPeerInfo(targetMid, state).config.enableIceTrickle) {
        if (sdpLines[i + 1] ? !(sdpLines[i + 1].indexOf('a=candidate:') === 0 || sdpLines[i + 1].indexOf('a=end-of-candidates') === 0) : true) {
          logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Appending end-of-candidates signal for non-trickle ICE connection.']);
          sdpLines.splice(i + 1, 0, 'a=end-of-candidates');
          i += 1;
        }
      }

      if (mediaType) {
        // Remove lines if we are rejecting the media and ensure unless (rejectVideoMedia is true), MCU has to enable those m= lines
        if (!settings.connection[mediaType]) {
          sdpLines.splice(i, 1);
          i -= 1;

          // Store the mids session description
        } else if (sdpLines[i].indexOf('a=mid:') === 0) {
          bundleLineMids.push(sdpLines[i].split('a=mid:')[1] || '');

          // Configure direction a=sendonly etc for local sessiondescription
        } else if (mediaType && ['a=sendrecv', 'a=sendonly', 'a=recvonly'].indexOf(sdpLines[i]) > -1) {
          if (['audio', 'video'].indexOf(mediaType) === -1) {
            state.sdpSessions[targetMid][direction].connection.data = sdpLines[i];
            continue;
          }

          if (direction === 'local') {
            if (settings.direction[mediaType].send && !settings.direction[mediaType].receive) {
              sdpLines[i] = sdpLines[i].indexOf('send') > -1 ? 'a=sendonly' : 'a=inactive';
            } else if (!settings.direction[mediaType].send && settings.direction[mediaType].receive) {
              sdpLines[i] = sdpLines[i].indexOf('recv') > -1 ? 'a=recvonly' : 'a=inactive';
            } else if (!settings.direction[mediaType].send && !settings.direction[mediaType].receive) {
              // MCU currently does not support a=inactive flag.. what do we do here?
              sdpLines[i] = 'a=inactive';
            }

            // Handle Chrome bundle bug. - See: https://bugs.chromium.org/p/webrtc/issues/detail?id=6280
            if (!state.hasMCU && window.webrtcDetectedBrowser !== 'firefox' && peerAgent === 'firefox'
              && sessionDescription.type === HANDSHAKE_PROGRESS$1.OFFER && sdpLines[i] === 'a=recvonly') {
              logger.log.WARN([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Overriding any original settings to receive only to send and receive to resolve chrome BUNDLE errors.']);
              sdpLines[i] = 'a=sendrecv';
              settings.direction[mediaType].send = true;
              settings.direction[mediaType].receive = true;
            }
            // Patch for incorrect responses
          } else if (sessionDescription.type === HANDSHAKE_PROGRESS$1.ANSWER) {
            const localOfferRes = state.sdpSessions[targetMid].local.connection[mediaType];
            // Parse a=sendonly response
            if (localOfferRes === 'a=sendonly') {
              sdpLines[i] = ['a=inactive', 'a=recvonly'].indexOf(sdpLines[i]) === -1 ? (sdpLines[i] === 'a=sendonly' ? 'a=inactive' : 'a=recvonly') : sdpLines[i];
              // Parse a=recvonly
            } else if (localOfferRes === 'a=recvonly') {
              sdpLines[i] = ['a=inactive', 'a=sendonly'].indexOf(sdpLines[i]) === -1 ? (sdpLines[i] === 'a=recvonly' ? 'a=inactive' : 'a=sendonly') : sdpLines[i];
              // Parse a=sendrecv
            } else if (localOfferRes === 'a=inactive') {
              sdpLines[i] = 'a=inactive';
            }
          }
          state.sdpSessions[targetMid][direction].connection[mediaType] = sdpLines[i];
        }
      }

      // Remove weird empty characters for Edge case.. :(
      // eslint-disable-next-line
      if (!(sdpLines[i] || '').replace(/\n|\r|\s|\ /gi, '')) {
        sdpLines.splice(i, 1);
        i -= 1;
      }
    }

    // Fix chrome "offerToReceiveAudio" local offer not removing audio BUNDLE
    if (bundleLineIndex > -1) {
      if (state.peerConnectionConfig.bundlePolicy === BUNDLE_POLICY.MAX_BUNDLE) {
        // eslint-disable-next-line
        sdpLines[bundleLineIndex] = 'a=group:BUNDLE ' + bundleLineMids.join(' ');
        // Remove a=group:BUNDLE line
      } else if (state.peerConnectionConfig.bundlePolicy === BUNDLE_POLICY.NONE) {
        sdpLines.splice(bundleLineIndex, 1);
      }
    }

    // Append empty space below
    if (window.webrtcDetectedBrowser !== 'edge') {
      if (!sdpLines[sdpLines.length - 1].replace(/\n|\r|\s/gi, '')) {
        sdpLines[sdpLines.length - 1] = '';
      } else {
        sdpLines.push('');
      }
    }

    logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Handling connection lines and direction ->'], settings);

    return sdpLines.join('\r\n');
  };

  /* eslint-disable no-useless-escape */
  /* eslint-disable no-param-reassign */
  /* eslint-disable prefer-template */
  const formatRtx = (str) => {
    (str.match(/a=rtpmap:.*\ rtx\/.*\r\n/gi) || []).forEach((line) => {
      const payload = (line.split('a=rtpmap:')[1] || '').split(' ')[0] || '';
      const fmtpLine = (str.match(new RegExp('a=fmtp:' + payload + '\ .*\r\n', 'gi')) || [])[0];

      if (!fmtpLine) {
        str = str.replace(new RegExp(line, 'g'), '');
        return;
      }

      const codecPayload = (fmtpLine.split(' apt=')[1] || '').replace(/\r\n/gi, '');
      const rtmpLine = str.match(new RegExp('a=rtpmap:' + codecPayload + '\ .*\r\n', 'gi'));

      if (!rtmpLine) {
        str = str.replace(new RegExp(line, 'g'), '');
        str = str.replace(new RegExp(fmtpLine, 'g'), '');
      }
    });

    return str;
  };

  // Remove unmapped fmtp and rtcp-fb lines
  const formatFmtpRtcpFb = (str) => {
    (str.match(/a=(fmtp|rtcp-fb):.*\ rtx\/.*\r\n/gi) || []).forEach((line) => {
      const payload = (line.split('a=' + (line.indexOf('rtcp') > 0 ? 'rtcp-fb' : 'fmtp'))[1] || '').split(' ')[0] || '';
      const rtmpLine = str.match(new RegExp('a=rtpmap:' + payload + '\ .*\r\n', 'gi'));

      if (!rtmpLine) {
        str = str.replace(new RegExp(line, 'g'), '');
      }
    });

    return str;
  };

  const removeSDPUnknownAptRtx = (targetMid, sessionDescription) => {
    const mediaLines = sessionDescription.sdp.split('m=');

    // Remove unmapped rtx lines
    // Remove rtx or apt= lines that prevent connections for browsers without VP8 or VP9 support
    // See: https://bugs.chromium.org/p/webrtc/issues/detail?id=3962
    for (let m = 0; m < mediaLines.length; m += 1) {
      mediaLines[m] = formatRtx(mediaLines[m]);
      mediaLines[m] = formatFmtpRtcpFb(mediaLines[m]);
    }

    return mediaLines.join('m=');
  };

  const removeSDPFirefoxH264Pref = (targetMid, sessionDescription) => {
    logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Removing Firefox experimental H264 flag to ensure interopability reliability']);
    return sessionDescription.sdp.replace(/a=fmtp:0 profile-level-id=0x42e00c;packetization-mode=1\r\n/g, '');
  };

  /* eslint-disable prefer-template */

  const renderSDPOutput = (targetMid, sessionDescription, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const initOptions = Skylink.getInitOptions();
    let localStream = null;
    let localStreamId = null;

    if (!(sessionDescription && sessionDescription.sdp)) {
      return;
    }

    if (!state.peerConnections[targetMid]) {
      return sessionDescription.sdp;
    }

    if (state.peerConnections[targetMid].localStream) {
      localStream = state.peerConnections[targetMid].localStream;
      localStreamId = state.peerConnections[targetMid].localStreamId || state.peerConnections[targetMid].localStream.id;
    }

    // For non-trickle ICE, remove the a=end-of-candidates line first to append it properly later
    const sdpLines = (!initOptions.enableIceTrickle ? sessionDescription.sdp.replace(/a=end-of-candidates\r\n/g, '') : sessionDescription.sdp).split('\r\n');

    // Parse and replace with the correct msid to prevent unwanted streams.
    // Making it simple without replacing with the track IDs or labels, neither setting prefixing "mslabel" and "label" as required labels.
    if (localStream) {
      let mediaType = '';

      for (let i = 0; i < sdpLines.length; i += 1) {
        if (sdpLines[i].indexOf('m=') === 0) {
          mediaType = (sdpLines[i].split('m=')[1] || '').split(' ')[0] || '';
          mediaType = ['audio', 'video'].indexOf(mediaType) === -1 ? '' : mediaType;
        } else if (mediaType) {
          if (sdpLines[i].indexOf('a=msid:') === 0) {
            const msidParts = sdpLines[i].split(' ');
            msidParts[0] = 'a=msid:' + localStreamId;
            sdpLines[i] = msidParts.join(' ');
          } else if (sdpLines[i].indexOf('a=ssrc:') === 0) {
            let ssrcParts = null;

            // Replace for "msid:" and "mslabel:"
            if (sdpLines[i].indexOf(' msid:') > 0) {
              ssrcParts = sdpLines[i].split(' msid:');
            } else if (sdpLines[i].indexOf(' mslabel:') > 0) {
              ssrcParts = sdpLines[i].split(' mslabel:');
            }

            if (ssrcParts) {
              const ssrcMsidParts = (ssrcParts[1] || '').split(' ');
              ssrcMsidParts[0] = localStreamId;
              ssrcParts[1] = ssrcMsidParts.join(' ');

              if (sdpLines[i].indexOf(' msid:') > 0) {
                sdpLines[i] = ssrcParts.join(' msid:');
              } else if (sdpLines[i].indexOf(' mslabel:') > 0) {
                sdpLines[i] = ssrcParts.join(' mslabel:');
              }
            }
          }
        }
      }
    }

    // For non-trickle ICE, append the signaling of end-of-candidates properly
    if (!initOptions.enableIceTrickle) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type,
        'Appending end-of-candidates signal for non-trickle ICE connection.']);

      for (let e = 0; e < sdpLines.length; e += 1) {
        if (sdpLines[e].indexOf('a=candidate:') === 0) {
          if (sdpLines[e + 1] ? !(sdpLines[e + 1].indexOf('a=candidate:') === 0 || sdpLines[e + 1].indexOf('a=end-of-candidates') === 0) : true) {
            sdpLines.splice(e + 1, 0, 'a=end-of-candidates');
            e += 1;
          }
        }
      }
    }

    // Replace the bundle policy to prevent complete removal of m= lines for some cases that do not accept missing m= lines except edge.
    if (sessionDescription.type === HANDSHAKE_PROGRESS$1.ANSWER && state.sdpSessions[targetMid]) {
      let mLineIndex = -1;

      for (let j = 0; j < sdpLines.length; j += 1) {
        if (sdpLines[j].indexOf('a=group:BUNDLE') === 0 && state.sdpSessions[targetMid].remote.bundleLine && state.peerConnectionConfig.bundlePolicy === BUNDLE_POLICY.MAX_BUNDLE) {
          sdpLines[j] = state.sdpSessions[targetMid].remote.bundleLine;
        } else if (sdpLines[j].indexOf('m=') === 0) {
          mLineIndex += 1;
          const compareA = sdpLines[j].split(' ');
          const compareB = (state.sdpSessions[targetMid].remote.mLines[mLineIndex] || '').split(' ');

          if (compareA[0] && compareB[0] && compareA[0] !== compareB[0]) {
            compareB[1] = 0;
            logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Appending middle rejected m= line ->'], compareB.join(' '));
            sdpLines.splice(j, 0, compareB.join(' '));
            j += 1;
            mLineIndex += 1;
          }
        }
      }

      while (state.sdpSessions[targetMid].remote.mLines[mLineIndex + 1]) {
        mLineIndex += 1;
        let appendIndex = sdpLines.length;
        if (!sdpLines[appendIndex - 1].replace(/\s/gi, '')) {
          appendIndex -= 1;
        }
        const parts = (state.sdpSessions[targetMid].remote.mLines[mLineIndex] || '').split(' ');
        parts[1] = 0;
        logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type,
          'Appending later rejected m= line ->'], parts.join(' '));
        sdpLines.splice(appendIndex, 0, parts.join(' '));
      }
    }

    // Ensure for chrome case to have empty "" at last line or it will return invalid SDP errors
    if (window.webrtcDetectedBrowser === 'edge' && sessionDescription.type === HANDSHAKE_PROGRESS$1.OFFER && !sdpLines[sdpLines.length - 1].replace(/\s/gi, '')) {
      logger.log.INFO([targetMid, 'RTCSessionDesription', sessionDescription.type, 'Removing last empty space for Edge browsers']);
      sdpLines.splice(sdpLines.length - 1, 1);
    }

    logger.log.INFO([targetMid, 'RTCSessionDescription', sessionDescription.type, 'Formatted output ->'], sdpLines.join('\r\n'));

    return sdpLines.join('\r\n');
  };

  const getSDPICECandidates = (targetMid, sessionDescription, beSilentOnLogs) => {
    const { RTCIceCandidate } = window;
    // TODO: implement getSDPICECandidates
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

    if (!beSilentOnLogs) {
      logger.log.DEBUG([targetMid, 'RTCSessionDesription', sessionDescription.type,
        'Parsing session description ICE candidates ->'], candidates);
    }

    return candidates;
  };

  /* eslint-disable prefer-destructuring,no-continue */

  const getSDPSelectedCodec = (targetMid, sessionDescription, type, beSilentOnLogs) => {
    // TODO implement getSDPSelectedCodec
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

    if (!beSilentOnLogs) {
      logger.log.DEBUG([targetMid, 'RTCSessionDesription', sessionDescription.type,
        `Parsing session description "${type}" codecs ->`], codecInfo);
    }

    return codecInfo;
  };

  /* eslint-disable prefer-destructuring */

  const getSDPFingerprint = (targetMid, sessionDescription, beSilentOnLogs) => {
    // TODO implement getSDPFingerprint
    const fingerprint = {
      fingerprint: null,
      fingerprintAlgorithm: null,
      base64Certificate: null,
    };

    if (!(sessionDescription && sessionDescription.sdp)) {
      return fingerprint;
    }

    const sdpLines = sessionDescription.sdp.split('\r\n');

    for (let i = 0; i < sdpLines.length; i += 1) {
      if (sdpLines[i].indexOf('a=fingerprint') === 0) {
        const parts = sdpLines[i].replace('a=fingerprint:', '').split(' ');
        fingerprint.fingerprint = parts[1];
        fingerprint.fingerprintAlgorithm = parts[0];
        break;
      }
    }

    if (!beSilentOnLogs) {
      logger.log.DEBUG([targetMid, 'RTCSessionDesription', sessionDescription.type,
        'Parsing session description fingerprint ->'], fingerprint);
    }

    return fingerprint;
  };

  const getSDPMediaSSRC = (targetMid, sessionDescription, beSilentOnLogs) => {
    const ssrcs = {
      audio: 0,
      video: 0,
    };

    if (!(sessionDescription && sessionDescription.sdp)) {
      return ssrcs;
    }

    sessionDescription.sdp.split('m=').forEach((mediaItem, index) => {
      // Ignore the v=0 lines etc..
      if (index === 0) {
        return;
      }

      const mediaType = (mediaItem.split(' ')[0] || '');
      const ssrcLine = (mediaItem.match(/a=ssrc:.*\r\n/) || [])[0];

      if (typeof ssrcs[mediaType] !== 'number') {
        return;
      }

      if (ssrcLine) {
        ssrcs[mediaType] = parseInt((ssrcLine.split('a=ssrc:')[1] || '').split(' ')[0], 10) || 0;
      }
    });

    if (!beSilentOnLogs) {
      logger.log.DEBUG([targetMid, TAGS.SESSION_DESCRIPTION, sessionDescription.type, MESSAGES.SESSION_DESCRIPTION.parsing_media_ssrc], ssrcs);
    }

    return ssrcs;
  };

  /**
   * Function sets the original DTLS role which was negotiated on first offer/ansswer exchange
   * This needs to be done until https://bugzilla.mozilla.org/show_bug.cgi?id=1240897 is released in Firefox 68
   * Estimated release date for Firefox 68 : 2019-07-09 (https://wiki.mozilla.org/Release_Management/Calendar)
   * @private
   */
  const setOriginalDTLSRole = (state, sessionDescription, isRemote) => {
    const { room } = state;
    const { type } = sessionDescription;
    const invertRoleMap = { active: 'passive', passive: 'active' };
    const aSetupPattern = sessionDescription.sdp.match(/a=setup:([a-z]+)/);

    if (state.originalDTLSRole !== null || type === 'offer') {
      return;
    }

    if (!aSetupPattern) {
      return;
    }

    const role = aSetupPattern[1];
    // eslint-disable-next-line
    state.originalDTLSRole = isRemote ? invertRoleMap[role] : role;
    Skylink.setSkylinkState(state, room.id);
  };

  /* eslint-disable no-param-reassign */
  /**
   * Function that modifies the DTLS role in answer sdp
   * This needs to be done until https://bugzilla.mozilla.org/show_bug.cgi?id=1240897 is released in Firefox 68
   * Estimated release date for Firefox 68 : 2019-07-09 (https://wiki.mozilla.org/Release_Management/Calendar)
   * @private
   */
  const modifyDTLSRole = (state, sessionDescription) => {
    const { originalDTLSRole } = state;
    const { type } = sessionDescription;

    if (originalDTLSRole === null || type === 'offer') {
      return sessionDescription.sdp;
    }

    sessionDescription.sdp = sessionDescription.sdp.replace(/a=setup:[a-z]+/g, `a=setup:${originalDTLSRole}`);

    return sessionDescription.sdp;
  };

  /* eslint-disable prefer-destructuring */
  const getTransceiverMid = (sessionDescription) => {
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
        if (msidLines[i].match(/a=msid:([\w|-]+)/)) {
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

    return results;
  };

  const helpers = {
    getSDPCommonSupports,
    getSDPCodecsSupport,
    getCodecsSupport,
    setSDPCodecParams,
    removeSDPFilteredCandidates,
    setSDPCodec,
    setSDPBitrate,
    removeSDPCodecs,
    removeSDPREMBPackets,
    handleSDPConnectionSettings,
    removeSDPUnknownAptRtx,
    removeSDPFirefoxH264Pref,
    renderSDPOutput,
    getSDPICECandidates,
    getSDPSelectedCodec,
    getSDPFingerprint,
    getSDPMediaSSRC,
    setOriginalDTLSRole,
    modifyDTLSRole,
    getTransceiverMid,
  };

  class SessionDescription {
    static getSDPCommonSupports(...args) {
      return helpers.getSDPCommonSupports(...args);
    }

    static getCodecsSupport(...args) {
      return helpers.getCodecsSupport(...args);
    }

    static setSDPCodecParams(...args) {
      return helpers.setSDPCodecParams(...args);
    }

    static removeSDPFilteredCandidates(...args) {
      return helpers.removeSDPFilteredCandidates(...args);
    }

    static setSDPCodec(...args) {
      return helpers.setSDPCodec(...args);
    }

    static setSDPBitrate(...args) {
      return helpers.setSDPBitrate(...args);
    }

    static removeSDPCodecs(...args) {
      return helpers.removeSDPCodecs(...args);
    }

    static removeSDPREMBPackets(...args) {
      return helpers.removeSDPREMBPackets(...args);
    }

    static handleSDPConnectionSettings(...args) {
      return helpers.handleSDPConnectionSettings(...args);
    }

    static removeSDPUnknownAptRtx(...args) {
      return helpers.removeSDPUnknownAptRtx(...args);
    }

    static getSDPCodecsSupport(...args) {
      return helpers.getSDPCodecsSupport(...args);
    }

    static removeSDPFirefoxH264Pref(...args) {
      return helpers.removeSDPFirefoxH264Pref(...args);
    }

    static renderSDPOutput(...args) {
      return helpers.renderSDPOutput(...args);
    }

    static getSDPICECandidates(...args) {
      return helpers.getSDPICECandidates(...args);
    }

    static getSDPSelectedCodec(...args) {
      return helpers.getSDPSelectedCodec(...args);
    }

    static getSDPFingerprint(...args) {
      return helpers.getSDPFingerprint(...args);
    }

    static getSDPMediaSSRC(...args) {
      return helpers.getSDPMediaSSRC(...args);
    }

    static setOriginalDTLSRole(...args) {
      return helpers.setOriginalDTLSRole(...args);
    }

    static modifyDTLSRole(...args) {
      return helpers.modifyDTLSRole(...args);
    }

    static getTransceiverMid(...args) {
      return helpers.getTransceiverMid(...args);
    }
  }

  /* eslint-disable prefer-destructuring */

  // eslint-disable-next-line no-restricted-properties
  const computePriortyFn = (controller, controlled) => (Math.pow(2, 32) * Math.min(controller, controlled)) + (2 * Math.max(controller, controlled)) + (controller > controlled ? 1 : 0);

  const formatCanTypeFn = (type) => {
    if (type === 'relay') {
      return 'relayed';
    } if (type === 'host' || type.indexOf('host') > -1) {
      return 'local';
    } if (type === 'srflx') {
      return 'serverreflexive';
    }
    return type;
  };

  /**
   * Function that parses the raw stats from the RTCIceCandidatePairStats dictionary.
   * @param {SkylinkState} roomState - The room state.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} prop - Stats dictionary identifier
   * @param {RTCPeerConnection} peerConnection - The peer connection.
   * @param {String} peerId - The peer Id.
   * @param {boolean} isAutoBwStats - The flag if auto bandwidth adjustment is true.
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseSelectedCandidatePair = (roomState, output, prop, peerConnection, peerId, isAutoBwStats) => {
    const { peerBandwidth, peerStats } = roomState;
    const { raw, selectedCandidate } = output;

    if (raw[prop].type === 'candidate-pair') {
      // Use the nominated pair, else use the one that has succeeded but not yet nominated.
      // This is to handle the case where none of the ICE candidates appear nominated.
      if (raw[prop].state !== 'succeeded' || !raw[prop].nominated || (selectedCandidate.nominated ? true
        : (raw[prop].priority < (selectedCandidate.priority || 0)))) {
        return;
      }

      const prevStats = isAutoBwStats ? peerBandwidth[peerId][prop] : peerStats[peerId][prop];

      // Map the selected ICE candidate pair based on computed priority
      const sending = (peerConnection.localDescription && peerConnection.localDescription.sdp && peerConnection.localDescription.sdp.match(/a=candidate:.*\r\n/gi)) || [];
      const receiving = (peerConnection.remoteDescription && peerConnection.remoteDescription.sdp && peerConnection.remoteDescription.sdp.match(/a=candidate:.*\r\n/gi)) || [];

      for (let s = 0; s < sending.length; s += 1) {
        const sendCanParts = sending[s].split(' ');

        for (let r = 0; r < receiving.length; r += 1) {
          const recvCanParts = receiving[r].split(' ');
          let priority = null;

          if (raw[prop].writable) {
            // Compute the priority since we are the controller
            priority = computePriortyFn(parseInt(sendCanParts[3], 10), parseInt(recvCanParts[3], 10));
          } else {
            // Compute the priority since we are the controlled
            priority = computePriortyFn(parseInt(recvCanParts[3], 10), parseInt(sendCanParts[3], 10));
          }

          if (priority === raw[prop].priority) {
            selectedCandidate.local.ipAddress = sendCanParts[4];
            selectedCandidate.local.portNumber = parseInt(sendCanParts[5], 10);
            selectedCandidate.local.transport = sendCanParts[2];
            selectedCandidate.local.priority = parseInt(sendCanParts[3], 10);
            selectedCandidate.local.candidateType = formatCanTypeFn(sendCanParts[7]);
            selectedCandidate.local.networkType = raw[raw[prop].localCandidateId].networkType;

            selectedCandidate.remote.ipAddress = recvCanParts[4];
            selectedCandidate.remote.portNumber = parseInt(recvCanParts[5], 10);
            selectedCandidate.remote.transport = recvCanParts[2];
            selectedCandidate.remote.priority = parseInt(recvCanParts[3], 10);
            selectedCandidate.remote.candidateType = formatCanTypeFn(recvCanParts[7]);
            break;
          }

          if (isEmptyObj(selectedCandidate.local) && isEmptyObj(selectedCandidate.remote)) {
            break;
          }
        }
      }

      selectedCandidate.writable = raw[prop].writable;
      selectedCandidate.priority = raw[prop].priority;
      selectedCandidate.nominated = raw[prop].nominated;

      // FF has not implemented the following stats
      const totalRoundTripTime = parseInt(raw[prop].totalRoundTripTime || '0', 10);
      selectedCandidate.totalRoundTripTime = totalRoundTripTime;
      selectedCandidate.totalRoundTripTime = parsers.tabulateStats(prevStats, raw[prop], 'totalRoundTripTime');

      const consentRequestsSent = parseInt(raw[prop].consentRequestsSent || '0', 10);
      selectedCandidate.consentRequests.totalSent = consentRequestsSent;
      selectedCandidate.consentRequests.sent = parsers.tabulateStats(prevStats, raw[prop], 'consentRequestsSent');

      const requestsReceived = parseInt(raw[prop].requestsReceived || '0', 10);
      selectedCandidate.requests.totalReceived = requestsReceived;
      selectedCandidate.requests.received = parsers.tabulateStats(prevStats, raw[prop], 'requestsReceived');

      const requestsSent = parseInt(raw[prop].requestsSent || '0', 10);
      selectedCandidate.requests.totalSent = requestsSent;
      selectedCandidate.requests.sent = parsers.tabulateStats(prevStats, raw[prop], 'requestsSent');

      const responsesSent = parseInt(raw[prop].responsesSent || '0', 10);
      selectedCandidate.responses.totalSent = responsesSent;
      selectedCandidate.responses.sent = parsers.tabulateStats(prevStats, raw[prop], 'responsesSent');

      const responsesReceived = parseInt(raw[prop].responsesReceived || '0', 10);
      selectedCandidate.responses.totalReceived = responsesReceived;
      selectedCandidate.responses.received = parsers.tabulateStats(prevStats, raw[prop], 'responsesReceived');
    }
    // TODO:
    //  // FF has not fully implemented candidate-pair
    //  // test for Plugin
    // else if (raw[prop].type === 'googCandidatePair') {
    //   const prevStats = isAutoBwStats ? self._peerBandwidth[peerId][prop] : self._peerStats[peerId][prop];
    //
    //   selectedCandidate.writable = raw[prop].googWritable === 'true';
    //   selectedCandidate.readable = raw[prop].googReadable === 'true';
    //
    //   var rtt = parseInt(raw[prop].googRtt || '0', 10);
    //   selectedCandidate.totalRtt = rtt;
    //   selectedCandidate.rtt = self._parseConnectionStats(prevStats, raw, 'rtt');
    //
    //   if (raw[prop].consentResponsesReceived) {
    //     var consentResponsesReceived = parseInt(raw[prop].consentResponsesReceived || '0', 10);
    //     selectedCandidate.consentResponses.totalReceived = consentResponsesReceived;
    //     selectedCandidate.consentResponses.received = self._parseConnectionStats(prevStats, raw, 'consentResponsesReceived');
    //   }
    //
    //   if (raw[prop].consentResponsesSent) {
    //     var consentResponsesSent = parseInt(raw[prop].consentResponsesSent || '0', 10);
    //     selectedCandidate.consentResponses.totalSent = consentResponsesSent;
    //     selectedCandidate.consentResponses.sent = self._parseConnectionStats(prevStats, raw, 'consentResponsesSent');
    //   }
    //
    //   if (raw[prop].responsesReceived) {
    //     var responsesReceived = parseInt(raw[prop].responsesReceived || '0', 10);
    //     selectedCandidate.responses.totalReceived = responsesReceived;
    //     selectedCandidate.responses.received = self._parseConnectionStats(prevStats, raw, 'responsesReceived');
    //   }
    //
    //   if (raw[prop].responsesSent) {
    //     var responsesSent = parseInt(raw[prop].responsesSent || '0', 10);
    //     selectedCandidate.responses.totalSent = responsesSent;
    //     selectedCandidate.responses.sent = self._parseConnectionStats(prevStats, raw, 'responsesSent');
    //   }
    //
    //   var localCanItem = raw[raw[prop].localCandidateId || ''] || {};
    //   selectedCandidate.local.ipAddress = localCanItem.ipAddress;
    //   selectedCandidate.local.portNumber = parseInt(localCanItem.portNumber, 10);
    //   selectedCandidate.local.priority = parseInt(localCanItem.priority, 10);
    //   selectedCandidate.local.networkType = localCanItem.networkType;
    //   selectedCandidate.local.transport = localCanItem.transport;
    //   selectedCandidate.local.candidateType = localCanItem.candidateType;
    //
    //   var remoteCanItem = raw[raw[prop].remoteCandidateId || ''] || {};
    //   selectedCandidate.remote.ipAddress = remoteCanItem.ipAddress;
    //   selectedCandidate.remote.portNumber = parseInt(remoteCanItem.portNumber, 10);
    //   selectedCandidate.remote.priority = parseInt(remoteCanItem.priority, 10);
    //   selectedCandidate.remote.transport = remoteCanItem.transport;
    //   selectedCandidate.remote.candidateType = remoteCanItem.candidateType;
    // }
  };

  /**
   * Function that parses the raw stats from the RTCCertificateStats dictionary.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} prop - Stats dictionary identifier.
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseCertificates = (output, prop) => {
    const { raw, certificate } = output;
    if (raw[prop].type === 'certificate') {
      // Map other certificate data based on the fingerprint obtained from SessionDescription.getSDPFingerprint
      if (raw[prop].fingerprint === certificate.local.fingerprint) {
        certificate.local.base64Certificate = raw[prop].base64Certificate;
        certificate.local.fingerprintAlgorithm = raw[prop].fingerprintAlgorithm;
      } else if (raw[prop].fingerprint === certificate.remote.fingerprint) {
        certificate.remote.base64Certificate = raw[prop].base64Certificate;
        certificate.remote.fingerprintAlgorithm = raw[prop].fingerprintAlgorithm;
      }
    }
    // TODO:
    //  // FF has not implemented ceritificate
    //  // test for Plugin
    // else if (prop.indexOf('ssrc_') === 0 && raw[prop].transportId) { // raw[prop].type === 'stream' && raw[prop].ssrc ?
    //   const pairItem = raw[raw[prop].transportId] || {};
    //   certificate.srtpCipher = pairItem.srtpCipher;
    //   certificate.dtlsCipher = pairItem.dtlsCipher;
    //
    //   const localCertItem = raw[pairItem.localCertificateId || ''] || {};
    //   certificate.local.fingerprint = localCertItem.fingerprint;
    //   certificate.local.fingerprintAlgorithm = localCertItem.fingerprintAlgorithm;
    //   certificate.local.base64Certificate = localCertItem.base64Certificate;
    //
    //   const remoteCertItem = raw[pairItem.remoteCertificateId || ''] || {};
    //   certificate.remote.fingerprint = remoteCertItem.fingerprint;
    //   certificate.remote.fingerprintAlgorithm = remoteCertItem.fingerprintAlgorithm;
    //   certificate.remote.base64Certificate = remoteCertItem.base64Certificate;
    // }
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
    const oTime = prevStats ? prevStats.timestamp || 0 : 0;
    const nVal = parseFloat(stats[prop] || '0', 10);
    const oVal = parseFloat(prevStats ? prevStats[prop] || '0' : '0', 10);

    if ((new Date(nTime).getTime()) === (new Date(oTime).getTime())) {
      return nVal;
    }

    return parseFloat(((nVal - oVal) / (nTime - oTime) * 1000).toFixed(3) || '0', 10);
  };

  const parseCodecs = () => {
    // FIXME: Codecs being gathered from sdp in gatherSDPCodecs prior to getStats
    // for Chrome and FF

    // const { raw } = output;
    // Plugin
    // if (prop.indexOf('ssrc_') === 0) {
    // const direction = prop.indexOf('_send') > 0 ? 'sending' : 'receiving';
    //
    // raw[prop].codecImplementationName = raw[prop].codecImplementationName === 'unknown' ? null : raw[prop].codecImplementationName;
    // output[raw[prop].mediaType][direction].codec.implementation = raw[prop].codecImplementationName || null;
    //
    // raw[prop].googCodecName = raw[prop].googCodecName === 'unknown' ? null : raw[prop].googCodecName;
    // output[raw[prop].mediaType][direction].codec.name = raw[prop].googCodecName || output[raw[prop].mediaType][direction].codec.name;
    // } else {
    //   console.log('No codec parsing');
    // }
  };

  /**
   * Function that parses the raw stats from the RTCInboundRtpStreamStats and RTCOutboundRtpStreamStats dictionary.
   * @param {SkylinkState} state - The room state.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} prop - Stats dictionary identifier.
   * @param {RTCPeerConnection} peerConnection - The peer connection.
   * @param {String} peerId - The peer Id.
   * @param {Boolean} isAutoBwStats - The flag if auto bandwidth adjustment is true.
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseAudio = (state, output, prop, peerConnection, peerId, isAutoBwStats) => {
    const { peerBandwidth, peerStats } = state;
    const { raw, audio } = output;
    const prevStats = isAutoBwStats ? peerBandwidth[peerId][prop] : peerStats[peerId][prop];

    // Chrome / Safari 12
    if (raw[prop].mediaType === 'audio' && (raw[prop].type === 'inbound-rtp' || raw[prop].type === 'outbound-rtp')) {
      const direction = raw[prop].type === 'inbound-rtp' ? 'receiving' : 'sending';

      if (direction === 'receiving') {
        const bytesReceived = parseInt(raw[prop].bytesReceived || '0', 10);
        audio[direction].totalBytes = bytesReceived;
        audio[direction].bytes = parsers.tabulateStats(prevStats, raw[prop], 'bytesReceived');

        const packetsLost = parseInt(raw[prop].packetsLost || '0', 10);
        audio[direction].totalPacketsLost = packetsLost;
        audio[direction].packetsLost = parsers.tabulateStats(prevStats, raw[prop], 'packetsLost');

        const packetsReceived = parseInt(raw[prop].packetsReceived || '0', 10);
        audio[direction].totalPackets = packetsReceived;
        audio[direction].packets = parsers.tabulateStats(prevStats, raw[prop], 'packetsReceived');

        const nacksSent = parseInt(raw[prop].nackCount || '0', 10);
        audio[direction].totalNacks = nacksSent;
        audio[direction].nacks = parsers.tabulateStats(prevStats, raw[prop], 'nackCount');

        audio[direction].fractionLost = parseInt(raw[prop].fractionLost || '0', 10);
        audio[direction].jitter = parseInt(raw[prop].jitter || '0', 10);

        const { trackId } = raw[prop];
        const audioReceiver = raw[trackId];
        if (audioReceiver) {
          audio[direction].audioLevel = parseFloat(audioReceiver.audioLevel || '0');
          audio[direction].totalAudioEnergy = parseInt(audioReceiver.totalAudioEnergy || '0', 10);
          audio[direction].jitterBufferDelay = parseInt(audioReceiver.jitterBufferDelay || '0', 10);
          audio[direction].jitterBufferEmittedCount = parseInt(audioReceiver.jitterBufferEmittedCount || '0', 10);
        }
      }

      if (direction === 'sending') {
        const bytesSent = parseInt(raw[prop].bytesSent || '0', 10);
        audio[direction].totalBytes = bytesSent;
        audio[direction].bytes = parsers.tabulateStats(prevStats, raw[prop], 'bytesSent');

        const packetsSent = parseInt(raw[prop].packetsSent || '0', 10);
        audio[direction].totalPackets = packetsSent;
        audio[direction].packets = parsers.tabulateStats(prevStats, raw[prop], 'packetsSent');

        const nacksReceived = parseInt(raw[prop].nackCount || '0', 10);
        audio[direction].totalNacks = nacksReceived;
        audio[direction].nacks = parsers.tabulateStats(prevStats, raw[prop], 'nackCount');

        const { trackId } = raw[prop];
        const audioSender = raw[trackId];
        if (audioSender) {
          audio[direction].echoReturnLoss = parseInt(audioSender.echoReturnLoss || '0', 10);
          audio[direction].echoReturnLossEnhancement = parseInt(audioSender.echoReturnLoss || '0', 10);
        }
      }
    }
    // TODO:
    //  // Test for Edge (WebRTC not ORTC shim) (Inbound stats) - Stats may not be accurate as it returns 0.
    //  // FF not full implmentation of inbound-rtp and outbound-rtp
    //  // https://webrtc-stats.callstats.io/
    // } else if (AdapterJS.webrtcDetectedBrowser === 'edge' && item.type === 'inboundrtp' && item.mediaType === 'audio' && item.isRemote) {
    //   output.audio.receiving.fractionLost = item.fractionLost;
    //   output.audio.receiving.jitter = item.jitter;
    //
    //   output.audio.receiving.totalBytes = item.bytesReceived;
    //   output.audio.receiving.bytes = self._parseConnectionStats(prevStats, item, 'bytesReceived');
    //
    //   output.audio.receiving.totalPackets = item.packetsReceived;
    //   output.audio.receiving.packets = self._parseConnectionStats(prevStats, item, 'packetsReceived');
    //
    //   output.audio.receiving.totalPacketsLost = item.packetsLost;
    //   output.audio.receiving.packetsLost = self._parseConnectionStats(prevStats, item, 'packetsLost');
    //
    //   output.audio.receiving.totalNacks = item.nackCount;
    //   output.audio.receiving.nacks = self._parseConnectionStats(prevStats, item, 'nackCount');
    //
    //   // Edge (WebRTC not ORTC shim) (Outbound stats) - Stats may not be accurate as it returns 0.
    // } else if (AdapterJS.webrtcDetectedBrowser === 'edge' && item.type === 'outboundrtp' && item.mediaType === 'audio' && !item.isRemote) {
    //   output.audio.sending.targetBitrate = item.targetBitrate;
    //   output.audio.sending.rtt = item.roundTripTime;
    //
    //   output.audio.sending.totalBytes = item.bytesSent;
    //   output.audio.sending.bytes = self._parseConnectionStats(prevStats, item, 'bytesSent');
    //
    //   output.audio.sending.totalPackets = item.packetsSent;
    //   output.audio.sending.packets = self._parseConnectionStats(prevStats, item, 'packetsSent');
    //
    //   output.audio.sending.totalNacks = item.nackCount;
    //   output.audio.sending.nacks = self._parseConnectionStats(prevStats, item, 'nackCount');
    //
    //   var trackItem = output.raw[item.mediaTrackId || ''] || {};
    //   output.audio.sending.audioInputLevel = trackItem.audioLevel;
    //   output.audio.sending.echoReturnLoss = trackItem.echoReturnLoss;
    //   output.audio.sending.echoReturnLossEnhancement = trackItem.echoReturnLossEnhancement;
  };

  /**
   * Function that parses the raw stats from the RTCInboundRtpStreamStats and RTCOutboundRtpStreamStats dictionary.
   * @param {SkylinkState} state - The room state.
   * @param {Object} output - Stats output object that stores the parsed stats values.
   * @param {String} prop - Stats dictionary identifier.
   * @param {RTCPeerConnection} peerConnection - The peer connection.
   * @param {String} peerId - The peer Id.
   * @param {Boolean} isAutoBwStats - The flag if auto bandwidth adjustment is true.
   * @memberOf PeerConnectionStatisticsParsers
   */
  const parseVideo = (state, output, prop, peerConnection, peerId, isAutoBwStats) => {
    const { peerBandwidth, peerStats } = state;
    const { raw, video } = output;
    const prevStats = isAutoBwStats ? peerBandwidth[peerId][prop] : peerStats[peerId][prop];

    if (raw[prop].mediaType === 'video' && (raw[prop].type === 'inbound-rtp' || raw[prop].type === 'outbound-rtp')) {
      const direction = raw[prop].type === 'inbound-rtp' ? 'receiving' : 'sending';

      if (direction === 'receiving') {
        const bytesReceived = parseInt(raw[prop].bytesReceived || '0', 10);
        video[direction].totalBytes = bytesReceived;
        video[direction].bytes = parsers.tabulateStats(prevStats, raw[prop], 'bytesReceived');

        const packetsReceived = parseInt(raw[prop].packetsReceived || '0', 10);
        video[direction].totalPackets = packetsReceived;
        video[direction].packets = parsers.tabulateStats(prevStats, raw[prop], 'packetsReceived');

        const packetsLost = parseInt(raw[prop].packetsLost || '0', 10);
        video[direction].totalPacketsLost = packetsLost;
        video[direction].packetsLost = parsers.tabulateStats(prevStats, raw[prop], 'packetsLost');

        const firsSent = parseInt(raw[prop].firCount || '0', 10);
        video[direction].totalFirs = firsSent;
        video[direction].firs = parsers.tabulateStats(prevStats, raw[prop], 'firCount');

        const nacksSent = parseInt(raw[prop].nackCount || '0', 10);
        video[direction].totalNacks = nacksSent;
        video[direction].nacks = parsers.tabulateStats(prevStats, raw[prop], 'nackCount');

        const plisSent = parseInt(raw[prop].pliCount || '0', 10);
        video[direction].totalPlis = plisSent;
        video[direction].plis = parsers.tabulateStats(prevStats, raw[prop], 'pliCount');

        video[direction].fractionLost = parseInt(raw[prop].fractionLost || '0', 10);
        video[direction].framesDecoded = parseInt(raw[prop].framesDecoded || '0', 10);
        video[direction].qpSum = parseInt(raw[prop].qpSum || '0', 10);

        const { trackId } = raw[prop];
        const videoReceiver = raw[trackId];
        if (videoReceiver) {
          video[direction].framesDropped = parseFloat(videoReceiver.framesDropped || '0');
          video[direction].framesReceived = parseInt(videoReceiver.framesReceived || '0', 10);
        }
      }

      if (direction === 'sending') {
        const bytesSent = parseInt(raw[prop].bytesSent || '0', 10);
        video[direction].totalBytes = bytesSent;
        video[direction].bytes = parsers.tabulateStats(prevStats, raw[prop], 'bytesSent');

        const packetsSent = parseInt(raw[prop].packetsSent || '0', 10);
        video[direction].totalPackets = packetsSent;
        video[direction].packets = parsers.tabulateStats(prevStats, raw[prop], 'packetsSent');

        const firsReceived = parseInt(raw[prop].firCount || '0', 10);
        video[direction].totalFirs = firsReceived;
        video[direction].firs = parsers.tabulateStats(prevStats, raw[prop], 'firCount');

        const nacksReceived = parseInt(raw[prop].nackCount || '0', 10);
        video[direction].totalNacks = nacksReceived;
        video[direction].nacks = parsers.tabulateStats(prevStats, raw[prop], 'nackCount');

        const plisReceived = parseInt(raw[prop].pliCount || '0', 10);
        video[direction].totalPlis = plisReceived;
        video[direction].plis = parsers.tabulateStats(prevStats, raw[prop], 'pliCount');

        video[direction].framesEncoded = parseInt(raw[prop].framesEncoded || '0', 10);
        video[direction].qpSum = parseInt(raw[prop].qpSum || '0', 10);

        const { trackId } = raw[prop];
        const videoSender = raw[trackId];
        if (videoSender) {
          video[direction].frameWidth = parseInt(videoSender.frameWidth || '0', 10);
          video[direction].frameHeight = parseInt(videoSender.frameHeight || '0', 10);
          video[direction].framesSent = parseInt(videoSender.framesSent || '0', 10);
          video[direction].hugeFramesSent = parseInt(videoSender.hugeFramesSent || '0', 10);
        }
      }
    }
    // TODO:
    //  // Test for Edge (WebRTC not ORTC shim) (Inbound stats) - Stats may not be accurate as it returns 0.
    //  // FF not full implmentation of inbound-rtp and outbound-rtp
    //  // https://webrtc-stats.callstats.io/
  };

  /* eslint-disable no-param-reassign */
  const parseVideoE2EDelay = (state, output, prop, peerConnection, peerId, beSilentOnLogs) => {
    const { raw } = output;
    const { AdapterJS, document } = window;
    // Chrome / Plugin (Inbound e2e stats)
    // FIXME: conditions seem to never be fulilled
    if (prop.indexOf('ssrc_') === 0 && raw[prop].mediaType === 'video') {
      const captureStartNtpTimeMs = parseInt(raw[prop].googCaptureStartNtpTimeMs || '0', 10);
      const remoteStream = peerConnection.getRemoteStreams()[0]; // is deprecated

      if (!(captureStartNtpTimeMs > 0 && prop.indexOf('_recv') > 0 && remoteStream
        && document && typeof document.getElementsByTagName === 'function')) {
        return;
      }

      try {
        let elements = document.getElementsByTagName(AdapterJS.webrtcDetectedType === 'plugin' ? 'object' : 'video');

        if (AdapterJS.webrtcDetectedType !== 'plugin' && elements.length === 0) {
          elements = document.getElementsByTagName('audio');
        }

        for (let e = 0; e < elements.length; e += 1) {
          let videoStreamId = null;

          // For Plugin case where they use the <object> element
          if (AdapterJS.webrtcDetectedType === 'plugin') {
            // Precautionary check to return if there is no children like <param>, which means something is wrong..
            if (!(elements[e].children && typeof elements[e].children === 'object'
              && typeof elements[e].children.length === 'number' && elements[e].children.length > 0)) {
              break;
            }

            // Retrieve the "streamId" parameter
            for (let ec = 0; ec < elements[e].children.length; ec += 1) {
              if (elements[e].children[ec].name === 'streamId') {
                videoStreamId = elements[e].children[ec].value || null;
                break;
              }
            }

            // For Chrome case where the srcObject can be obtained and determine the streamId
          } else {
            videoStreamId = (elements[e].srcObject && (elements[e].srcObject.id || elements[e].srcObject.label)) || null;
          }

          if (videoStreamId && videoStreamId === (remoteStream.id || remoteStream.label)) {
            output.video.receiving.e2eDelay = ((new Date()).getTime() + 2208988800000) - captureStartNtpTimeMs - elements[e].currentTime * 1000;
            break;
          }
        }
      } catch (error) {
        if (!beSilentOnLogs) {
          logger.log.WARN([peerId, 'RTCStatsReport', null, 'Failed retrieving e2e delay ->'], error);
        }
      }
    }
  };

  /**
   * @namespace PeerConnectionStatisticsParsers
   * @description Parser functions for PeerConnectionStatistics
   * @private
   * @type {{parseVideo: parseVideo, parseVideoE2EDelay: parseVideoE2EDelay, parseAudio: parseAudio, parseCodecs: parseCodecs, tabulateStats: tabulateStats, parseSelectedCandidatePair: parseSelectedCandidatePair, parseCertificates: parseCertificates}}
   */
  const parsers = {
    parseSelectedCandidatePair,
    parseCertificates,
    tabulateStats,
    parseCodecs,
    parseAudio,
    parseVideo,
    parseVideoE2EDelay,
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
      this.peerConnStatus = this.roomState.peerConnStatus[peerId] || null;
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
        selectedCandidate: {
          local: {},
          remote: {},
          // consentResponses: {}, TODO: remove
          consentRequests: {},
          responses: {},
          requests: {},
        },
        certificate: {},
      };
      this.beSilentOnLogs = Skylink.getInitOptions().beSilentOnStatsLogs;
      this.isAutoBwStats = false;
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
      const { AdapterJS } = window;
      const { peerBandwidth, peerStats } = this.roomState;
      // TODO: Need to do full implementation of success function
      if (typeof stats.forEach === 'function') {
        stats.forEach((item, prop) => {
          this.output.raw[prop] = item;
        });
      } else {
        this.output.raw = stats;
      }

      const edgeTracksKind = {
        remote: {},
        local: {},
      };

      try {
        if (isEmptyObj(peerStats)) {
          logger.log.DEBUG([this.peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.STATS_DISCARDED]);
          return;
        }
        // Polyfill for Plugin missing "mediaType" stats item
        const rawOutput = Object.keys(this.output.raw);
        for (let i = 0; i < rawOutput.length; i += 1) {
          try {
            if (rawOutput[i].indexOf('ssrc_') === 0 && !this.output.raw[rawOutput[i]].mediaType) {
              this.output.raw[rawOutput[i]].mediaType = this.output.raw[rawOutput[i]].audioInputLevel || this.output.raw[rawOutput[i]].audioOutputLevel ? 'audio' : 'video';

              // Polyfill for Edge 15.x missing "mediaType" stats item
            } else if (AdapterJS.webrtcDetectedBrowser === 'edge' && !this.output.raw[rawOutput[i]].mediaType
              && ['inboundrtp', 'outboundrtp'].indexOf(this.output.raw[rawOutput[i]].type) > -1) {
              const trackItem = this.output.raw[this.output.raw[rawOutput[i]].mediaTrackId] || {};
              this.output.raw[rawOutput[i]].mediaType = edgeTracksKind[this.output.raw[rawOutput[i]].isRemote ? 'remote' : 'local'][trackItem.trackIdentifier] || '';
            }

            // Parse DTLS certificates and ciphers used
            parsers.parseCertificates(this.output, rawOutput[i]);
            parsers.parseSelectedCandidatePair(this.roomState, this.output, rawOutput[i], this.peerConnection, this.peerId, this.isAutoBwStats);
            parsers.parseCodecs(this.output, rawOutput[i]);
            parsers.parseAudio(this.roomState, this.output, rawOutput[i], this.peerConnection, this.peerId, this.isAutoBwStats);
            parsers.parseVideo(this.roomState, this.output, rawOutput[i], this.peerConnection, this.peerId, this.isAutoBwStats);
            parsers.parseVideoE2EDelay(this.roomState, this.output, rawOutput[i], this.peerConnection, this.peerId, this.beSilentOnLogs);

            if (this.isAutoBwStats && !peerBandwidth[this.peerId][rawOutput[i]]) {
              peerBandwidth[this.peerId][rawOutput[i]] = this.output.raw[rawOutput[i]];
            } else if (!this.isAutoBwStats && !peerStats[this.peerId][rawOutput[i]]) {
              peerStats[this.peerId][rawOutput[i]] = this.output.raw[rawOutput[i]];
            }
          } catch (err) {
            logger.log.DEBUG([this.peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED], err);
            break;
          }
        }
      } catch (err) {
        this.getStatsFailure(promiseReject, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED, err);
      }

      dispatchEvent(getConnectionStatusStateChange({
        state: GET_CONNECTION_STATUS_STATE.RETRIEVE_SUCCESS,
        peerId: this.peerId,
        stats: this.output,
      }));

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
     * @fires getConnectionStatusStateChange
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
            this.gatherRTCPeerConnectionDetails();
            this.gatherSDPIceCandidates();
            this.gatherSDPCodecs();
            this.gatherCertificateDetails();
            this.gatherSSRCDetails();
            this.gatherRTCDataChannelDetails();
          } catch (err) {
            logger.log.WARN([this.peerId, TAGS.STATS_MODULE, null, MESSAGES.STATS_MODULE.ERRORS.PARSE_FAILED], err);
          }

          if (typeof this.peerConnection.getStats !== 'function') {
            this.getStatsFailure(reject, MESSAGES.PEER_CONNECTION.getstats_api_not_available);
          }

          dispatchEvent(getConnectionStatusStateChange({
            state: GET_CONNECTION_STATUS_STATE.RETRIEVING,
            peerId: this.peerId,
          }));

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

      this.output.connection.constraints = this.peerConnStatus ? this.peerConnStatus.constraints : null;
      this.output.connection.optional = this.peerConnStatus ? this.peerConnStatus.optional : null;
      this.output.connection.sdpConstraints = this.peerConnStatus ? this.peerConnStatus.sdpConstraints : null;
    }

    /**
     * Formats output object with Ice Candidate details
     * @private
     */
    gatherSDPIceCandidates() {
      const { peerConnection, beSilentOnLogs } = this;
      this.output.connection.candidates = {
        sending: SessionDescription.getSDPICECandidates(this.peerId, peerConnection.localDescription, beSilentOnLogs),
        receiving: SessionDescription.getSDPICECandidates(this.peerId, peerConnection.remoteDescription, beSilentOnLogs),
      };
    }

    /**
     * Formats output object with SDP codecs
     * @private
     */
    gatherSDPCodecs() {
      const { peerConnection, beSilentOnLogs } = this;
      this.output.audio.sending.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.remoteDescription, 'audio', beSilentOnLogs);
      this.output.video.sending.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.remoteDescription, 'video', beSilentOnLogs);
      this.output.audio.receiving.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.localDescription, 'audio', beSilentOnLogs);
      this.output.video.receiving.codec = SessionDescription.getSDPSelectedCodec(this.peerId, peerConnection.localDescription, 'video', beSilentOnLogs);
    }

    /**
     * Formats output object with SDP certificate details
     * @private
     */
    gatherCertificateDetails() {
      const { peerConnection, beSilentOnLogs } = this;
      this.output.certificate.local = SessionDescription.getSDPFingerprint(this.peerId, peerConnection.localDescription, beSilentOnLogs);
      this.output.certificate.remote = SessionDescription.getSDPFingerprint(this.peerId, peerConnection.remoteDescription, beSilentOnLogs);
    }

    /**
     * Formats output object with audio and video ssrc details
     * @private
     */
    gatherSSRCDetails() {
      const { peerConnection, beSilentOnLogs } = this;
      const inboundSSRCs = SessionDescription.getSDPMediaSSRC(this.peerId, peerConnection.remoteDescription, beSilentOnLogs);
      const outboundSSRCs = SessionDescription.getSDPMediaSSRC(this.peerId, peerConnection.localDescription, beSilentOnLogs);
      this.output.audio.receiving.ssrc = inboundSSRCs.audio;
      this.output.video.receiving.ssrc = inboundSSRCs.video;
      this.output.audio.sending.ssrc = outboundSSRCs.audio;
      this.output.video.sending.ssrc = outboundSSRCs.video;
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

  const config = {
    apiBase: 'https://api.temasys.io',
    stats: {
      endPoints: {
        client: '/client',
        session: '/session',
        auth: '/auth',
        signaling: '/signaling',
        iceConnection: '/client/iceconnection',
        iceCandidate: '/client/icecandidate',
        iceGathering: '/client/icegathering',
        negotiation: '/client/negotiation',
        bandwidth: '/client/bandwidth',
        recording: '/client/recording',
        dataChannel: '/client/datachannel',
      },
    },
  };

  config.stats.statsBase = `${config.apiBase}/rest/stats`;

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
      const { fetch } = window;

      try {
        const initOptions = Skylink.getInitOptions();
        const { enableStatsGathering } = initOptions;

        if (enableStatsGathering) {
          fetch(`${config.stats.statsBase}${endpoint}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
          });
        }
      } catch (err) {
        logger.log.WARN(STATS_MODULE.ERRORS.POST_FAILED, err);
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

  class HandleNegotiationStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        room_id: null,
        user_id: null,
        peer_id: null,
        client_id: null,
        state: null,
        is_remote: null,
        weight: null,
        sdp_or_msg: null,
        sdp_type: null,
        sdp_sdp: null,
        error: null,
      };
    }

    send(roomKey, state, peerId, sdpOrMessage, isRemote, error) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;
      this.model.client_id = roomState.clientId;
      this.model.state = state;
      this.model.is_remote = isRemote;
      this.model.sdp_or_msg = sdpOrMessage;
      this.model.weight = sdpOrMessage.weight || null;
      this.model.appKey = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
      this.model.error = (typeof error === 'string' ? error : (error && error.msg)) || null;

      // Retrieve the weight for states where the "weight" field is not available.
      if (['enter', 'welcome', 'restart'].indexOf(this.model.state) === -1) {
        // Retrieve the peer's weight if it from remote end.
        this.model.weight = this.model.is_remote && PeerData.getPeerInfo(this.model.peer_id, roomState).config && PeerData.getPeerInfo(this.model.peer_id, roomState).config.priorityWeight ? PeerData.getPeerInfo(this.model.peer_id, roomState).config.priorityWeight : PeerData.getCurrentSessionInfo(roomState.room).config.priorityWeight;
        this.model.sdp_type = (this.model.sdp_or_msg && this.model.sdp_or_msg.type) || null;
        this.model.sdp_sdp = (this.model.sdp_or_msg && this.model.sdp_or_msg.sdp) || null;
      }

      this.addToStatsBuffer('negotiation', this.model, this.endpoints.negotiation);
      this.manageStatsBuffer();
    }
  }

  const handleNegotationStats = new HandleNegotiationStats();

  /* eslint-disable no-unused-vars */

  const getCommonMessage = (resolve, targetMid, roomState, sessionDescription, restartOfferMsg) => {
    // TODO: Full implementation to be done from _setLocalAndSendMessage under peer-handshake.js
    const state = Skylink.getSkylinkState(roomState.room.id);
    // const initOptions = Skylink.getInitOptions();
    const {
      peerConnections, peerConnectionConfig, bufferedLocalOffer, peerPriorityWeight, room,
    } = state;
    const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS } } = MESSAGES;
    const { AdapterJS } = window;
    const peerConnection = peerConnections[targetMid];
    const sd = {
      type: sessionDescription.type,
      sdp: sessionDescription.sdp,
    };

    peerConnection.processingLocalSDP = true;

    // sd.sdp = SessionDescription.removeSDPFirefoxH264Pref(targetMid, sd, roomState.room.id);
    // sd.sdp = SessionDescription.setSDPCodecParams(targetMid, sd, roomState.room.id);
    // sd.sdp = SessionDescription.removeSDPUnknownAptRtx(targetMid, sd, roomState.room.id);
    // sd.sdp = SessionDescription.removeSDPCodecs(targetMid, sd, roomState.room.id);
    // sd.sdp = SessionDescription.handleSDPConnectionSettings(targetMid, sd, roomState.room.id, 'local');
    // sd.sdp = SessionDescription.removeSDPREMBPackets(targetMid, sd, roomState.room.id);

    if (AdapterJS.webrtcDetectedBrowser === 'firefox') {
      SessionDescription.setOriginalDTLSRole(state, sd, false);
      sd.sdp = SessionDescription.modifyDTLSRole(state, sessionDescription);
    }

    if (peerConnectionConfig.disableBundle) {
      sd.sdp = sd.sdp.replace(/a=group:BUNDLE.*\r\n/gi, '');
    }

    logger.log.INFO([targetMid, 'RTCSessionDescription', sessionDescription.type, 'Local session description updated ->'], sd.sdp);

    if (sessionDescription.type === HANDSHAKE_PROGRESS$1.OFFER) {
      handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS.OFFER.offer, targetMid, sessionDescription, false);

      logger.log.INFO([targetMid, 'RTCSessionDescription', sessionDescription.type, 'Local offer saved.']);
      bufferedLocalOffer[targetMid] = sessionDescription;

      const offer = {
        type: sd.type,
        sdp: sd.sdp, // SessionDescription.renderSDPOutput(targetMid, sd, roomState.room.id),
        mid: state.user.sid,
        target: targetMid,
        rid: roomState.room.id,
        userInfo: PeerData.getUserInfo(roomState.room),
        weight: peerPriorityWeight,
        mediaInfoList: PeerMedia.retrieveMediaInfoForOfferAnswer(room, sd),
      };

      // Merging Restart and Offer messages. The already present keys in offer message will not be overwritten.
      // Only news keys from restartOfferMsg are added.
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
      room: roomState.room,
    }));
    reject(error);
  };

  /**
   * @param {SkylinkRoom} currentRoom
   * @param {string} targetMid
   * @param {Boolean} iceRestart
   * @param {object} restartOfferMsg
   * @return {*}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires handshakeProgress
   */
  const createOffer = (currentRoom, targetMid, iceRestart = false, restartOfferMsg) => {
    const state = Skylink.getSkylinkState(currentRoom.id);
    const initOptions = Skylink.getInitOptions();
    const { enableDataChannel } = initOptions;
    const {
      peerConnections,
      // sdpSettings,
      hasMCU,
      enableIceRestart,
      peerInformations,
      voiceActivityDetection,
      peerConnStatus,
      dataChannels,
    } = state;
    const { AdapterJS } = window;
    const peerConnection = peerConnections[targetMid];

    const offerConstraints = {
      offerToReceiveAudio: !(!state.sdpSettings.connection.audio && targetMid !== PEER_TYPE.MCU) && SessionDescription.getSDPCommonSupports(targetMid, null, currentRoom.id).video,
      offerToReceiveVideo: !(!state.sdpSettings.connection.video && targetMid !== PEER_TYPE.MCU) && SessionDescription.getSDPCommonSupports(targetMid, null, currentRoom.id).audio,
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
        });
        state.peerConnections[targetMid].hasMainChannel = true;
      }
    }

    logger.log.DEBUG([targetMid, null, null, 'Creating offer with config:'], offerConstraints);

    peerConnection.endOfCandidates = false;

    if (peerConnStatus[targetMid]) {
      state.peerConnStatus[targetMid].sdpConstraints = offerConstraints;
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    return new Promise((resolve, reject) => {
      peerConnection.createOffer(AdapterJS.webrtcDetectedType === 'plugin' ? {
        mandatory: {
          OfferToReceiveAudio: offerConstraints.offerToReceiveAudio,
          OfferToReceiveVideo: offerConstraints.offerToReceiveVideo,
          iceRestart: offerConstraints.iceRestart,
          voiceActivityDetection: offerConstraints.voiceActivityDetection,
        },
      } : offerConstraints)
        .then((offer) => {
          onOfferCreated(resolve, targetMid, state, restartOfferMsg, offer);
        })
        .catch((err) => {
          onOfferFailed(reject, targetMid, state, err);
        });
    });
  };

  /* eslint-disable no-param-reassign */
  /**
   * @param {RTCPeerConnection} peerConnection
   * @param {string} targetMid
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
      helpers$2.createDataChannel({ peerId: targetMid, dataChannel, roomState: currentRoomState });
    } else {
      logger.log.WARN([targetMid, 'RTCDataChannel', dataChannel.label, 'Not adding datachannel as enable datachannel is set to false']);
    }
  };

  /**
   * @private
   * @description Checks for the dependencies required for SkylinkJS
   * @memberOf module:Compatibility
   * @return {{fulfilled: boolean, message: string}}
   */
  const validateDepencies = () => {
    const dependencies = {
      fulfilled: true,
      message: '',
    };
    const { AdapterJS, io, fetch } = window;
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
    if (!dependencies.fulfilled) {
      logger.log.ERROR(['Validating Dependencies', null, null, dependencies.message]);
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
    const { forceTURNSSL, CONSTANTS, serverConfig } = params;
    const { AdapterJS } = window;
    const connectionConfig = {
      tcp: serverConfig.iceServerPorts.tcp,
      udp: serverConfig.iceServerPorts.udp,
      both: serverConfig.iceServerPorts.both,
      iceServerProtocol: serverConfig.iceServerProtocol,
      iceServerPorts: serverConfig.iceServerPorts,
    };

    if (AdapterJS.webrtcDetectedBrowser === 'edge') {
      connectionConfig.tcp = [];
      connectionConfig.udp = [3478];
      connectionConfig.iceServerPorts.both = [];
      connectionConfig.iceServerProtocol = CONSTANTS.TURN;
    } else if (forceTURNSSL) {
      if (AdapterJS.webrtcDetectedBrowser === 'firefox' && AdapterJS.webrtcDetectedVersion < 53) {
        connectionConfig.udp = [];
        connectionConfig.tcp = [443];
        connectionConfig.both = [];
        connectionConfig.iceServerProtocol = CONSTANTS.TURN;
      } else {
        connectionConfig.iceServerPorts.udp = [];
        connectionConfig.iceServerProtocol = 'turns';
      }
    } else if (AdapterJS.webrtcDetectedBrowser === 'firefox') {
      connectionConfig.udp = [3478];
      connectionConfig.tcp = [443, 80];
      connectionConfig.both = [];
    }

    return connectionConfig;
  };

  /**
   * @description Function that updates the removeStream method for Firefox.
   * @param peerConnection
   * @return {Function}
   * @memberOf module:Compatibility
   */
  const updateRemoveStream = (peerConnection) => {
    const { getSenders, removeTrack } = peerConnection;

    return (stream) => {
      const { getTracks } = stream;
      const senders = getSenders();

      for (let s = 0; s < senders.length; s += 1) {
        const tracks = getTracks();
        for (let t = 0; t < tracks.length; t += 1) {
          if (tracks[t] === senders[s].track) {
            removeTrack(senders[s]);
          }
        }
      }
    };
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
   * @param {string} targetMid
   * @param {SkylinkRoom} room
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateFromQueue = (targetMid, room) => {
    const state = Skylink.getSkylinkState(room.id);
    const peerCandidatesQueue = state.peerCandidatesQueue[targetMid] || [];
    const peerConnection = state.peerConnections[targetMid];
    const { AdapterJS } = window;
    const { TAGS, PEER_CONNECTION_STATE } = SkylinkConstants;

    for (let i = 0; i < peerCandidatesQueue.length; i += 1) {
      const candidateArray = peerCandidatesQueue[i];

      if (candidateArray) {
        const cType = candidateArray[1].candidate.split(' ')[7];
        logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, `${cType[0]}:${cType}`, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.add_buffered_candidate]);
        IceConnection.addIceCandidate(targetMid, candidateArray[0], cType, candidateArray[1], state);
      } else if (peerConnection && peerConnection.signalingState !== PEER_CONNECTION_STATE.CLOSED && AdapterJS && isLowerThanVersion(AdapterJS.VERSION, '0.14.0')) {
        try {
          peerConnection.addIceCandidate(null);
          logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.end_of_candidate_success]);
        } catch (ex) {
          logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.end_of_candidate_failure]);
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
        room_id: null,
        user_id: null,
        peer_id: null,
        client_id: null,
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
      this.model.appKey = Skylink.getInitOptions().appKey;
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
   * @param {string} targetMid - The mid of the target peer
   * @param {string} candidateId - The id of the ICE Candidate
   * @param {string} candidateType - Type of the ICE Candidate
   * @param {RTCIceCandidate} candidate - An RTCIceCandidate Object
   * @fires candidateProcessingState
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateSuccess = (room, targetMid, candidateId, candidateType, candidate) => {
    const { STATS_MODULE, ICE_CANDIDATE } = MESSAGES;
    const { CANDIDATE_PROCESSING_STATE, TAGS } = SkylinkConstants;

    logger.log.INFO([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.CANDIDATE_HANDLER.added_ice_candidate]);
    dispatchEvent(candidateProcessingState({
      room,
      state: CANDIDATE_PROCESSING_STATE.PROCESS_SUCCESS,
      peerId: targetMid,
      candidateId,
      candidateType,
      candidate,
      error: null,
    }));
    handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.process_success, targetMid, candidateId, candidate);
  };

  /**
   * Failure callback for adding an IceCandidate
   * @param {SkylinkRoom} room - The current room
   * @param {string} targetMid - The mid of the target peer
   * @param {string} candidateId - The id of the ICE Candidate
   * @param {string} candidateType - Type of the ICE Candidate
   * @param {RTCIceCandidate} candidate - An RTCIceCandidate Object
   * @param {Error} error - Error
   * @fires candidateProcessingState
   * @memberOf IceConnectionHelpers
   * @private
   */
  const addIceCandidateFailure = (room, targetMid, candidateId, candidateType, candidate, error) => {
    const { STATS_MODULE, ICE_CANDIDATE } = MESSAGES;
    const { CANDIDATE_PROCESSING_STATE, TAGS } = SkylinkConstants;

    logger.log.ERROR([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.CANDIDATE_HANDLER.failed_adding_ice_candidate], error);
    dispatchEvent(candidateProcessingState({
      room,
      state: CANDIDATE_PROCESSING_STATE.PROCESS_ERROR,
      peerId: targetMid,
      candidateId,
      candidateType,
      candidate,
      error,
    }));
    handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.process_failed, targetMid, candidateId, candidate, error);
  };

  /**
   * @param {string} targetMid - The mid of the target peer
   * @param {string} candidateId - The id of the ICE Candidate
   * @param {string} candidateType - Type of the ICE Candidate
   * @param {RTCIceCandidate} nativeCandidate - An RTCIceCandidate Object
   * @param {SkylinkState} roomState - Skylink State
   * @fires candidateProcessingState
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

    logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, ICE_CANDIDATE.CANDIDATE_HANDLER.adding_ice_candidate]);
    dispatchEvent(candidateProcessingState({
      peerId: targetMid,
      room,
      candidateType,
      candidate,
      candidateId,
      state: CANDIDATE_PROCESSING_STATE.PROCESSING,
      error: null,
    }));
    handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.processing, targetMid, candidateId, candidate);

    if (!(peerConnection
      && peerConnection.signalingState !== PEER_CONNECTION_STATE.CLOSED
      && peerConnection.remoteDescription
      && peerConnection.remoteDescription.sdp
      && peerConnection.remoteDescription.sdp.indexOf(`\r\na=mid:${candidate.sdpMid}\r\n`) > -1)) {
      logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, `${candidateId}:${candidateType}`, `${ICE_CANDIDATE.CANDIDATE_HANDLER.DROPPING_ICE_CANDIDATE} - ${PEER_CONNECTION.NO_PEER_CONNECTION}`]);

      dispatchEvent(candidateProcessingState({
        peerId: targetMid,
        room: roomState.room,
        candidateType,
        candidate,
        candidateId,
        state: CANDIDATE_PROCESSING_STATE$1.DROPPED,
        error: new Error(ICE_CANDIDATE.CANDIDATE_HANDLER.no_peer_connection_event_log),
      }));
      handleIceCandidateStats.send(room.id, STATS_MODULE.HANDLE_ICE_GATHERING_STATS.process_failed, targetMid, candidateId, candidate, PEER_CONNECTION.NO_PEER_CONNECTION);
    }

    try {
      peerConnection.addIceCandidate(
        candidate,
        addIceCandidateSuccess.bind(peerConnection, room, targetMid, candidateId, candidateType, candidate),
        addIceCandidateFailure.bind(peerConnection, room, targetMid, candidateId, candidateType, candidate),
      );
    } catch (error) {
      addIceCandidateFailure.bind(peerConnection, room, targetMid, candidateId, candidateType, candidate, error);
    }
  };

  class HandleIceGatheringStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        room_id: null,
        user_id: null,
        peer_id: null,
        client_id: null,
        state: null,
        is_remote: null,
      };
    }

    send(roomkey, state, peerId, isRemote) {
      const roomState = Skylink.getSkylinkState(roomkey);

      this.model.room_id = roomkey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;
      this.model.client_id = roomState.clientId;
      this.model.state = state;
      this.model.is_remote = isRemote;
      this.model.appKey = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();

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
   * @fires candidateGenerationState
   * @private
   * @return {null}
   */
  const onIceCandidate = (targetMid, candidate, currentRoom) => {
    const state = Skylink.getSkylinkState(currentRoom.id);
    const initOptions = Skylink.getInitOptions();
    const peerConnection = state.peerConnections[targetMid];
    const signalingServer = new SkylinkSignalingServer();
    let gatheredCandidates = state.gatheredCandidates[targetMid];
    const { CANDIDATE_GENERATION_STATE, TAGS } = SkylinkConstants;

    if (!peerConnection) {
      logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.no_peer_connection], candidate);
      return null;
    }

    if (candidate.candidate) {
      if (!peerConnection.gathering) {
        logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.ice_gathering_started], candidate);
        peerConnection.gathering = true;
        peerConnection.gathered = false;
        dispatchEvent(candidateGenerationState({
          room: currentRoom,
          peerId: targetMid,
          state: CANDIDATE_GENERATION_STATE$1.GATHERING,
        }));
        handleIceGatheringStats.send(currentRoom.id, CANDIDATE_GENERATION_STATE.GATHERING, targetMid, false);
      }

      const candidateType = candidate.candidate.split(' ')[7];
      logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.generate_ice_candidate], candidate);

      if (candidateType === 'endOfCandidates' || !(peerConnection
        && peerConnection.localDescription && peerConnection.localDescription.sdp
        && peerConnection.localDescription.sdp.indexOf(`\r\na=mid:${candidate.sdpMid}\r\n`) > -1)) {
        logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.drop_eoc_signal], candidate);
        return null;
      }

      if (initOptions.filterCandidatesType[candidateType]) {
        if (!(state.hasMCU && initOptions.forceTURN)) {
          logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.matched_filtering_flag], candidate);
          return null;
        }

        logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.filtering_flag_not_honored], candidate);
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

      if (!initOptions.enableIceTrickle) {
        logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.ice_trickle_disabled], candidate);
        return null;
      }

      logger.log.DEBUG([targetMid, TAGS.CANDIDATE_HANDLER, candidateType, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.sending_ice_candidate], candidate);

      signalingServer.sendCandidate(targetMid, state, candidate);
    } else {
      logger.log.INFO([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.ice_gathering_completed]);

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

      // Disable Ice trickle option
      if (!initOptions.enableIceTrickle) {
        const sessionDescription = peerConnection.localDescription;

        if (!(sessionDescription && sessionDescription.type && sessionDescription.sdp)) {
          logger.log.WARN([targetMid, TAGS.CANDIDATE_HANDLER, null, MESSAGES.ICE_CANDIDATE.CANDIDATE_HANDLER.no_sdp]);
          return null;
        }
        // a=end-of-candidates should present in non-trickle ICE connections so no need to send endOfCandidates message
        signalingServer.sendMessage({
          type: sessionDescription.type,
          sdp: SessionDescription.renderSDPOutput(targetMid, sessionDescription, currentRoom.id),
          mid: state.user.sid,
          userInfo: PeerData.getUserInfo(currentRoom),
          target: targetMid,
          rid: currentRoom.id,
        });
      } else if (state.gatheredCandidates[targetMid]) {
        const sendEndOfCandidates = () => {
          if (!state.gatheredCandidates[targetMid]) return;

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
   * @namespace IceConnectionHelpers
   * @description All helper and utility functions for <code>{@link IceConnection}</code> class are listed here.
   * @private
   * @type {{setIceServers, addIceCandidateFromQueue, addIceCandidate, onIceCandidate}}
   */
  const helpers$1 = {
    setIceServers,
    addIceCandidateFromQueue,
    addIceCandidate,
    onIceCandidate,
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
      return helpers$1.setIceServers(iceServers);
    }

    /**
     * @description Function that adds all the Peer connection buffered ICE candidates received.
     * This should be called only after the remote session description is received and set.
     * @param {string} targetMid - The mid of the target peer
     * @param {SkylinkRoom} room - Current Room
     */
    static addIceCandidateFromQueue(targetMid, room) {
      return helpers$1.addIceCandidateFromQueue(targetMid, room);
    }

    /**
     * Function that adds the ICE candidate to Peer connection.
     * @param {string} targetMid - The mid of the target peer
     * @param {string} candidateId - The id of the ICE Candidate
     * @param {string} candidateType - Type of the ICE Candidate
     * @param {RTCIceCandidate} nativeCandidate - An RTCIceCandidate Object | {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate}
     * @param {SkylinkState} roomState - Skylink State
     * @fires candidateProcessingState
     */
    static addIceCandidate(targetMid, candidateId, candidateType, nativeCandidate, roomState) {
      return helpers$1.addIceCandidate(targetMid, candidateId, candidateType, nativeCandidate, roomState);
    }

    /**
     *
     * @param targetMid - The mid of the target peer
     * @param {RTCPeerConnectionIceEvent} rtcIceConnectionEvent - {@link https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnectionIceEvent}
     * @param {SkylinkRoom} room - Current room
     * @fires candidateGenerationState
     * @return {null}
     */
    static onIceCandidate(targetMid, rtcIceConnectionEvent, room) {
      return helpers$1.onIceCandidate(targetMid, rtcIceConnectionEvent, room);
    }
  }

  /**
   *
   * @param {RTCPeerConnection} peerConnection
   * @param {string} targetMid
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
        room_id: null,
        user_id: null,
        peer_id: null,
        client_id: null,
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
        this.model.appKey = Skylink.getInitOptions().appKey;
        this.model.timestamp = (new Date()).toISOString();

        PeerConnection.retrieveStatistics(roomKey, peerId, Skylink.getInitOptions().beSilentOnStatsLogs).then((stats) => {
          if (stats) {
            // Parse the selected ICE candidate pair for both local and remote candidate.
            ['local', 'remote'].forEach((dirType) => {
              const candidate = stats.selectedCandidate[dirType];
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
        room_id: null,
        user_id: null,
        peer_id: null,
        client_id: null,
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
      this.model.audio_send.nack_count = formatValue(this.stats, 'audio', 'send', 'nacks');
      this.model.audio_send.echo_return_loss = formatValue(this.stats, 'audio', 'send', 'echoReturnLoss');
      this.model.audio_send.echo_return_loss_enhancement = formatValue(this.stats, 'audio', 'send', 'echoReturnLossEnhancement');
      // this.model.audio_send.round_trip_time = formatValue(this.stats,'audio', 'send', 'rtt');
    }

    gatherReceiveAudioPacketsStats() {
      this.model.audio_recv.bytes = formatValue(this.stats, 'audio', 'recv', 'bytes');
      this.model.audio_recv.packets = formatValue(this.stats, 'audio', 'recv', 'packets');
      this.model.audio_recv.packets_lost = formatValue(this.stats, 'audio', 'recv', 'packetsLost');
      this.model.audio_recv.jitter = formatValue(this.stats, 'audio', 'recv', 'jitter');
      this.model.audio_recv.nack_count = formatValue(this.stats, 'audio', 'recv', 'nacks');
      this.model.audio_recv.audio_level = formatValue(this.stats, 'audio', 'recv', 'audioLevel');
      this.model.audio_recv.audio_energy = formatValue(this.stats, 'audio', 'recv', 'totalAudioEnergy');
      this.model.audio_recv.jitter_buffer_delay = formatValue(this.stats, 'audio', 'recv', 'jitterBufferDelay');
      this.model.audio_recv.jitter_buffer_emmited_count = formatValue(this.stats, 'audio', 'recv', 'jitterBufferEmittedCount');
      // this.model.video_recv.packets_discarded = formatValue(this.stats,'audio', 'recv', 'packetsDiscarded');
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
      // this.model.video_send.round_trip_time = formatValue(this.stats,'video', 'send', 'rtt');
      // this.model.video_send.frames = formatValue(this.stats,'video', 'send', 'frames');
      // this.model.video_send.frames_dropped = formatValue(this.stats,'video', 'send', 'framesDropped');
      // this.model.video_send.framerate = formatValue(this.stats,'video', 'send', 'frameRate');
      // this.model.video_send.framerate_input = formatValue(this.stats,'video', 'send', 'frameRateInput');
      // this.model.video_send.framerate_encoded = formatValue(this.stats,'video', 'send', 'frameRateEncoded');
      // this.model.video_send.framerate_mean = formatValue(this.stats,'video', 'send', 'frameRateMean');
      // this.model.video_send.framerate_std_dev = formatValue(this.stats,'video', 'send', 'frameRateStdDev');
      // this.model.video_send.cpu_limited_resolution = formatValue(this.stats,'video', 'send', 'cpuLimitedResolution');
      // this.model.video_send.bandwidth_limited_resolution = formatValue(this.stats,'video', 'send', 'bandwidthLimitedResolution');
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
      // this.model.video_recv.packets_discarded = formatValue(this.stats,'video', 'recv', 'packetsDiscarded');
      // this.model.video_recv.jitter = formatValue(this.stats,'video', 'recv', 'jitter');
      // this.model.video_recv.frames = formatValue(this.stats,'video', 'recv', 'frames');
      // this.model.video_recv.frame_width = formatValue(this.stats,'video', 'recv', 'frameWidth');
      // this.model.video_recv.frame_height = formatValue(this.stats,'video', 'recv', 'frameHeight');
      // this.model.video_recv.framerate = formatValue(this.stats,'video', 'recv', 'frameRate');
      // this.model.video_recv.framerate_output = formatValue(this.stats,'video', 'recv', 'frameRateOutput');
      // this.model.video_recv.framerate_decoded = formatValue(this.stats,'video', 'recv', 'frameRateDecoded');
      // this.model.video_recv.framerate_mean = formatValue(this.stats,'video', 'recv', 'frameRateMean');
      // this.model.video_recv.framerate_std_dev = formatValue(this.stats,'video', 'recv', 'frameRateStdDev');
    }

    buildTrackInfo(roomKey) {
      const state = Skylink.getSkylinkState(roomKey);
      const { streams } = state;
      const streamObjs = Object.values(Object.values(streams.userMedia));
      streamObjs.forEach((streamObj) => {
        if (streamObj) {
          const stream = streamObj.stream ? streamObj.stream : streamObj[Object.keys(streamObj)[0]].stream;
          const settings = streamObj.settings ? streamObj.settings : streamObj[Object.keys(streamObj)[0]].settings;
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

    send(roomKey, peerConnection, peerId) {
      const { STATS_MODULE } = MESSAGES;
      const roomState = Skylink.getSkylinkState(roomKey);

      if (!roomState) {
        logger.log.DEBUG([peerId, 'Statistics', 'Bandwidth_Stats', STATS_MODULE.HANDLE_BANDWIDTH_STATS.NO_STATE]);
        return;
      }

      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.peer_id = peerId;
      this.model.client_id = roomState.clientId;
      this.model.appKey = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();

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

  const instance$1 = {};

  class BandwidthAdjuster {
    constructor(params) {
      const { peerConnection, state, targetMid } = params;

      if (instance$1[targetMid]) {
        return instance$1[targetMid];
      }

      this.peerId = targetMid;
      this.state = state;
      this.peerConnection = peerConnection;
      this.bandwidth = null;

      instance$1[this.peerId] = this;
    }

    static formatTotalFn(arr) {
      let total = 0;
      for (let i = 0; i < arr.length; i += 1) {
        total += arr[i];
      }
      return total / arr.length;
    }

    setAdjustmentInterval() {
      const { bandwidthAdjuster, peerBandwidth, room } = this.state;
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
          !== PEER_CONNECTION_STATE.CLOSED) || !bandwidthAdjuster || !peerBandwidth[this.peerId]) {
          clearInterval(adjustmentInterval);
          return;
        }

        PeerConnection.retrieveStatistics(room.id, this.peerId, Skylink.getIniOptions().beSilentOnStatsLogs, true)
          .then((stats) => {
            if (!(this.peerConnection && this.peerConnection.signalingState
              !== PEER_CONNECTION_STATE.CLOSED) || !bandwidthAdjuster) {
              clearInterval(adjustmentInterval);
            }

            bandwidth.audio.send.push(stats.audio.sending.bytes * 8);
            bandwidth.audio.recv.push(stats.audio.receiving.bytes * 8);
            bandwidth.video.send.push(stats.video.sending.bytes * 8);
            bandwidth.video.recv.push(stats.video.receiving.bytes * 8);

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
   * @fires iceConnectionState
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const oniceconnectionstatechange = (peerConnection, targetMid, currentRoomState) => {
    const { PEER_CONNECTION } = MESSAGES;
    const { ICE_CONNECTION_STATE, PEER_CONNECTION_STATE } = SkylinkConstants;
    const { AdapterJS } = window;
    const { webrtcDetectedBrowser, webrtcDetectedType } = AdapterJS;
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(currentRoomState.room.id);

    if (!state) {
      logger.log.DEBUG([targetMid, 'RTCIceConnectionState', null, PEER_CONNECTION.no_room_state]);
      return;
    }

    const {
      hasMCU, bandwidthAdjuster, peerInformations, peerConnStatus, peerStats,
    } = state;
    const handleIceConnectionStats = new HandleIceConnectionStats();

    let statsInterval = null;
    let pcIceConnectionState = peerConnection.iceConnectionState;

    logger.log.DEBUG([targetMid, 'RTCIceConnectionState', null, PEER_CONNECTION.ice_connection_state], pcIceConnectionState);

    if (webrtcDetectedBrowser === 'edge') {
      if (pcIceConnectionState === 'connecting') {
        pcIceConnectionState = ICE_CONNECTION_STATE.CHECKING;
      } else if (pcIceConnectionState === 'new') {
        pcIceConnectionState = ICE_CONNECTION_STATE.FAILED;
      }
    }

    if (webrtcDetectedType === 'AppleWebKit' && pcIceConnectionState === ICE_CONNECTION_STATE.CLOSED) {
      setTimeout(() => {
        if (!peerConnection.iceConnectionStateClosed) {
          handleIceConnectionStats.send(currentRoomState.room.id, ICE_CONNECTION_STATE.CLOSED, targetMid);
          dispatchEvent(iceConnectionState({
            state: ICE_CONNECTION_STATE.CLOSED,
            peerId: targetMid,
          }));
        }
      }, 10);
      return;
    }

    if (state) {
      handleIceConnectionStats.send(currentRoomState.room.id, peerConnection.iceConnectionState, targetMid);
    }

    dispatchEvent(iceConnectionState({
      state: pcIceConnectionState,
      peerId: targetMid,
    }));

    if (pcIceConnectionState === ICE_CONNECTION_STATE.FAILED && initOptions.enableIceTrickle) {
      dispatchEvent(iceConnectionState({
        state: ICE_CONNECTION_STATE.TRICKLE_FAILED,
        peerId: targetMid,
      }));
    }

    if (peerConnStatus && peerConnStatus[targetMid]) {
      peerConnStatus[targetMid].connected = isIceConnectionStateCompleted(pcIceConnectionState);
    }

    if (!statsInterval && isIceConnectionStateCompleted(pcIceConnectionState) && !peerStats[targetMid]) {
      statsInterval = true;
      peerStats[targetMid] = {};

      logger.log.DEBUG([targetMid, 'RTCStatsReport', null, 'Retrieving first report to tabulate results']);

      // Do an initial getConnectionStatus() to backfill the first retrieval in order to do (currentTotalStats - lastTotalStats).
      PeerConnection.getConnectionStatus(state, targetMid).then(() => {
        statsInterval = setInterval(() => {
          if (peerConnection.signalingState === PEER_CONNECTION_STATE.CLOSED) {
            clearInterval(statsInterval);
          } else {
            new HandleBandwidthStats().send(state.room.id, peerConnection, targetMid);
          }
        }, 20000);
      });
    }

    if (!hasMCU && isIceConnectionStateCompleted(pcIceConnectionState) && !!bandwidthAdjuster && AdapterJS.webrtcDetectedBrowser !== 'edge'
          && (((peerInformations[targetMid] || {}).agent || {}).name || 'edge') !== 'edge') {
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
   * @fires candidateGenerationState
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const onicegatheringstatechange = (peerConnection, targetMid, roomState) => {
    const { PEER_CONNECTION } = MESSAGES;
    const { iceGatheringState } = peerConnection;

    logger.log.INFO([targetMid, 'RTCIceGatheringState', null, PEER_CONNECTION.ice_gathering_state], iceGatheringState);
    dispatchEvent(candidateGenerationState({
      state: iceGatheringState,
      room: roomState.room,
      peerId: targetMid,
    }));
  };

  /**
   *
   * @param {RTCPeerConnection} peerConnection
   * @param {string} targetMid - The Peer Id
   * @param {SkylinkState} roomState - The current state.
   * @fires peerConnectionState
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  // eslint-disable-next-line no-unused-vars
  const onsignalingstatechange = (peerConnection, targetMid) => {
    const { AdapterJS } = window;
    const { PEER_CONNECTION } = MESSAGES;
    const { PEER_CONNECTION_STATE } = SkylinkConstants;
    const { signalingState, signalingStateClosed } = peerConnection;

    logger.log.DEBUG([targetMid, 'RTCSignalingState', null, PEER_CONNECTION.peer_connection_state], signalingState);

    if (AdapterJS.webrtcDetectedType === 'AppleWebKit' && signalingState === PEER_CONNECTION_STATE.CLOSED) {
      setTimeout(() => {
        if (!signalingStateClosed) {
          dispatchEvent(peerConnectionState({
            state: PEER_CONNECTION_STATE.CLOSED,
            peerId: targetMid,
          }));
        }
      }, 10);
      return;
    }

    dispatchEvent(peerConnectionState({
      state: signalingState,
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
    const { receiver } = rtcTrackEvent;
    const { AdapterJS } = window;
    const stream = rtcTrackEvent.streams[0];

    // eslint-disable-next-line prefer-const
    let { transceiver, track } = rtcTrackEvent;
    let peerId = targetMid;

    if (AdapterJS.webrtcDetectedBrowser === 'safari') {
      const transceivers = peerConnections[targetMid].getTransceivers();
      transceivers.forEach((tscvr) => {
        if (tscvr.receiver.track.id === receiver.track.id) {
          transceiver = tscvr;
        }
      });
    }

    if (transceiver.mid === null) {
      logger.log.WARN('Transceiver mid is null', transceiver);
    }

    if (!peerConnections[peerId]) return null;

    if (hasMCU) {
      peerId = matchPeerIdWithTransceiverMid(state, transceiver);
    }

    const isScreensharing = PeerMedia.isVideoScreenTrack(state, peerId, transceiver.mid);
    const callbackExtraParams = [peerId, room, isScreensharing];
    stream.onremovetrack = callbacks.onremovetrack.bind(undefined, ...callbackExtraParams);
    PeerMedia.updateStreamIdFromOntrack(state.room, peerId, transceiver.mid, stream.id);
    PeerConnection.updatePeerInformationsMediaStatus(state.room, peerId, transceiver, stream);
    MediaStream.updateRemoteStreams(state.room, peerId, stream);
    MediaStream.onRemoteTrackAdded(stream, currentRoomState, peerId, isScreensharing, track.kind === TRACK_KIND.VIDEO, track.kind === TRACK_KIND.AUDIO);

    return null;
  };

  const dispatchPeerUpdated = (state, peerId) => {
    dispatchEvent(peerUpdated({
      peerId,
      peerInfo: PeerData.getPeerInfo(peerId, state),
      isSelf: false,
    }));
  };

  const updateMediaStatus = (state, peerId, streamId) => {
    const updatedState = state;

    delete updatedState.peerInformations[peerId].mediaStatus[streamId];

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
  };

  const dispatchStreamEndedEvent = (state, peerId, isScreensharing, rtcTrackEvent) => {
    dispatchEvent(streamEnded({
      room: state.room,
      peerId,
      peerInfo: PeerData.getPeerInfo(peerId, state),
      isSelf: false,
      isScreensharing,
      streamId: rtcTrackEvent.track.id,
      isVideo: rtcTrackEvent.track.kind === TRACK_KIND.VIDEO,
      isAudio: rtcTrackEvent.track.kind === TRACK_KIND.AUDIO,
    }));
  };

  const dispatchIncomingCameraStream = (state) => {
    const { streams, room, user } = state;
    const userMediaStreams = streams.userMedia ? Object.values(streams.userMedia) : [];
    userMediaStreams.forEach((streamObj) => {
      if (hasVideoTrack(streamObj.stream)) {
        dispatchEvent(onIncomingStream({
          stream: streamObj.stream,
          streamId: streamObj.id,
          peerId: user.sid,
          room,
          isSelf: true,
          peerInfo: PeerData.getCurrentSessionInfo(room),
          isVideo: true,
          isAudio: false,
        }));
      }
    });
  };

  /**
   * @param {String} peerId
   * @param {String} room
   * @param {boolean} isScreensharing
   * @param {MediaStreamTrackEvent} rtcTrackEvent
   * @fires streamEnded
   * @memberOf PeerConnection.PeerConnectionHelpers.CreatePeerConnectionCallbacks
   */
  const onremovetrack = (peerId, room, isScreensharing, rtcTrackEvent) => {
    const state = getStateByKey(room.id);
    const { peerInformations } = state;
    const { MEDIA_STREAM, PEER_INFORMATIONS } = MESSAGES;
    const stream = rtcTrackEvent.target;


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

    updateMediaStatus(state, peerId, stream.id);
    dispatchStreamEndedEvent(state, peerId, isScreensharing, rtcTrackEvent);

    if (isScreensharing) {
      // Dispatch to ensure that the client has a way of retrieving the camera stream. Camera stream was not added to pc and therefore ontrack will not trigger on remote.
      dispatchIncomingCameraStream(state);
    }

    dispatchPeerUpdated(state, peerId);
  };

  /**
   * @description Callbacks for createPeerConnection method
   * @type {{ondatachannel, onicecandidate, oniceconnectionstatechange, onicegatheringstatechange, onsignalingstatechange, ontrack, onremovetrack}}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @namespace CreatePeerConnectionCallbacks
   * @private
   */
  const callbacks = {
    ontrack,
    ondatachannel,
    onicecandidate,
    oniceconnectionstatechange,
    onicegatheringstatechange,
    onsignalingstatechange,
    onremovetrack,
  };

  const createNativePeerConnection = (targetMid, constraints, optional, hasScreenShare, currentRoom) => {
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(currentRoom.id);
    const { AdapterJS } = window;
    logger.log.DEBUG([targetMid, 'RTCPeerConnection', null, 'Creating peer connection ->'], {
      constraints,
      optional,
    });
    const { RTCPeerConnection, msRTCPeerConnection } = window;
    const rtcPeerConnection = new (initOptions.useEdgeWebRTC && msRTCPeerConnection ? window.msRTCPeerConnection : RTCPeerConnection)(constraints, optional);
    const callbackExtraParams = [rtcPeerConnection, targetMid, state];

    // attributes (added on by Temasys)
    rtcPeerConnection.setOffer = '';
    rtcPeerConnection.setAnswer = '';
    rtcPeerConnection.hasStream = false;
    rtcPeerConnection.hasMainChannel = false;
    rtcPeerConnection.firefoxStreamId = '';
    rtcPeerConnection.processingLocalSDP = false;
    rtcPeerConnection.processingRemoteSDP = false;
    rtcPeerConnection.gathered = false;
    rtcPeerConnection.gathering = false;
    rtcPeerConnection.localStream = null;
    rtcPeerConnection.localStreamId = null;

    // Used for safari 11
    rtcPeerConnection.iceConnectionStateClosed = false;
    rtcPeerConnection.signalingStateClosed = false;

    // candidates
    state.gatheredCandidates[targetMid] = {
      sending: { host: [], srflx: [], relay: [] },
      receiving: { host: [], srflx: [], relay: [] },
    };

    // self._streamsSession[targetMid] = self._streamsSession[targetMid] || {}; from SkylinkJS
    state.peerEndOfCandidatesCounter[targetMid] = state.peerEndOfCandidatesCounter[targetMid] || {};
    state.sdpSessions[targetMid] = { local: {}, remote: {} };
    state.peerBandwidth[targetMid] = {};
    // state.peerStats[targetMid] = {}; // initialised only after peerConnationStatus === 'completed'

    // FIXME: ESS-1620 - To check if still needed
    if (targetMid === PEER_TYPE.MCU) {
      logger.log.INFO('Creating an empty transceiver of kind video with MCU');
      if (typeof rtcPeerConnection.addTransceiver === 'function') {
        rtcPeerConnection.addTransceiver('video');
      }
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    if (AdapterJS.webrtcDetectedBrowser === 'firefox') {
      rtcPeerConnection.removeStream = updateRemoveStream(rtcPeerConnection);
    }

    /* CALLBACKS */
    rtcPeerConnection.ontrack = callbacks.ontrack.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.ondatachannel = callbacks.ondatachannel.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onicecandidate = callbacks.onicecandidate.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.oniceconnectionstatechange = callbacks.oniceconnectionstatechange.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onsignalingstatechange = callbacks.onsignalingstatechange.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onicegatheringstatechange = callbacks.onicegatheringstatechange.bind(rtcPeerConnection, ...callbackExtraParams);
    rtcPeerConnection.onaddstream = (evt) => {
      console.log('REMOTE PEER STREAM EVT', evt);
    };

    return rtcPeerConnection;
  };

  /**
   * Function that creates the Peer Connection.
   * @param {JSON} params
   * @return {RTCPeerConnection} peerConnection
   * @memberof PeerConnection.PeerConnectionHelpers
   * @fires handshakeProgress
   */
  const createPeerConnection = (params) => {
    let peerConnection = null;
    const {
      currentRoom,
      targetMid,
      cert,
      hasScreenShare,
    } = params;
    const initOptions = Skylink.getInitOptions();
    const { filterCandidatesType } = initOptions;
    const state = Skylink.getSkylinkState(currentRoom.id);
    const {
      peerConnectionConfig,
      room,
    } = state;
    const constraints = {
      iceServers: state.room.connection.peerConfig.iceServers,
      iceTransportPolicy: filterCandidatesType.host && filterCandidatesType.srflx && !filterCandidatesType.relay ? 'relay' : 'all',
      bundlePolicy: peerConnectionConfig.bundlePolicy === BUNDLE_POLICY.NONE ? BUNDLE_POLICY.BALANCED : peerConnectionConfig.bundlePolicy,
      rtcpMuxPolicy: peerConnectionConfig.rtcpMuxPolicy,
      iceCandidatePoolSize: peerConnectionConfig.iceCandidatePoolSize,
    };
    const optional = {
      optional: [
        { DtlsSrtpKeyAgreement: true },
        { googIPv6: true },
      ],
    };

    if (cert) {
      constraints.certificates = [cert];
    }

    if (state.peerConnStatus[targetMid]) {
      state.peerConnStatus[targetMid].constraints = constraints;
      state.peerConnStatus[targetMid].optional = optional;
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    try {
      peerConnection = createNativePeerConnection(targetMid, constraints, optional, hasScreenShare, currentRoom);
    } catch (error) {
      logger.log.ERROR([targetMid, null, null, 'Failed creating peer connection:'], error);
      peerConnection = null;
      dispatchEvent(handshakeProgress({
        state: HANDSHAKE_PROGRESS$1.ERROR,
        peerId: targetMid,
        error,
        room,
      }));
    }

    return peerConnection;
  };

  /**
   * Function that starts the Peer connection session.
   * @param {object} params - options required to create a PeerConnection
   * @param {SkylinkRoom} params.currentRoom - The currrent room
   * @param {string} params.targetMid - Peer's id
   * @param {Object} params.peerBrowser - Peer's user agent object
   * @param {RTCCertificate} params.cert - Represents a certificate that an RTCPeerConnection uses to authenticate.
   * @param {boolean} params.receiveOnly
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
      receiveOnly,
      hasScreenShare,
    } = params;
    const initOptions = Skylink.getInitOptions();
    const state = Skylink.getSkylinkState(currentRoom.id);
    const { peerConnections, room } = state;
    const handleIceConnectionStats = new HandleIceConnectionStats();

    if (!peerConnections[targetMid]) {
      state.peerConnStatus[targetMid] = {
        connected: false,
        init: false,
      };

      logger.log.INFO([targetMid, null, null, 'Starting the connection to peer. Options provided:'], {
        peerBrowser,
        receiveOnly,
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
      handleIceConnectionStats.send(room.id, connection.iceConnectionState, targetMid);
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
      room: roomState.room,
    }));
    reject(error);
  };

  /**
   * @param {SkylinkState} roomState
   * @param {string} targetMid
   * @return {*}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires handshakeProgress
   */
  const createAnswer = (roomState, targetMid) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const {
      peerConnections,
      hasMCU,
      peerConnStatus,
      voiceActivityDetection,
    } = state;
    const peerConnection = peerConnections[targetMid];
    const { AdapterJS } = window;

    logger.log.INFO([targetMid, null, null, 'Creating answer with config:'], roomState.room.connection.sdpConstraints);

    const answerConstraints = AdapterJS.webrtcDetectedBrowser === 'edge' ? {
      offerToReceiveVideo: !(!state.sdpSettings.connection.audio && targetMid !== PEER_TYPE.MCU) && SessionDescription.getSDPCommonSupports(targetMid, peerConnection.remoteDescription, roomState.room.id).video,
      offerToReceiveAudio: !(!state.sdpSettings.connection.video && targetMid !== PEER_TYPE.MCU) && SessionDescription.getSDPCommonSupports(targetMid, peerConnection.remoteDescription, roomState.room.id).audio,
      voiceActivityDetection,
    } : undefined;

    // Add stream only at offer/answer end
    if (!hasMCU || targetMid === PEER_TYPE.MCU) {
      MediaStream.addLocalMediaStreams(targetMid, roomState);
    }

    if (peerConnStatus[targetMid]) {
      state.peerConnStatus[targetMid].sdpConstraints = answerConstraints;
    }

    // No ICE restart constraints for createAnswer as it fails in chrome 48
    // { iceRestart: true }
    return new Promise((resolve, reject) => {
      peerConnection.createAnswer(answerConstraints)
        .then((answer) => {
          onAnswerCreated(resolve, targetMid, roomState, answer);
        })
        .catch((err) => {
          onAnswerFailed(reject, targetMid, roomState, err);
        });
    });
  };

  /**
   * Function that sends data over the DataChannel connection.
   * @private
   * @memberOf PeerConnection
   * @since 2.0.0
   * @fires onDataChannelStateChanged
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
   * @fires onIncomingMessage
   */
  const messageProtocolHandler = (roomState, peerId, data, channelProp) => {
    const senderPeerId = data.sender || peerId;
    logger.log.INFO([senderPeerId, 'RTCDataChannel', channelProp, 'Received P2P message from peer:'], data);
    dispatchEvent(onIncomingMessage({
      room: roomState.room,
      message: {
        targetPeerId: roomState.user.sid,
        content: data.data,
        senderPeerId,
        isDataChannel: true,
        isPrivate: data.isPrivate,
      },
      isSelf: false,
      peerId: senderPeerId,
      peerInfo: PeerData.getPeerInfo(senderPeerId, roomState),
    }));
  };

  /**
   * Function that handles the data received from Datachannel and
   * routes to the relevant data transfer protocol handler.
   * @lends PeerConnection
   * @private
   * @since 2.0.0
   * @fires onDataChannelStateChanged
   */
  const processDataChannelData = (roomState, rawData, peerId, channelName, channelType) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    let transferId = null;
    let streamId = null;
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

    if (streamId && state.dataStreams[streamId]) {
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
        console.log(isStreamChunk);
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
   * @memberof PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
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
        room_id: null,
        user_id: null,
        peer_id: null,
        client_id: null,
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
      this.model.appKey = Skylink.getInitOptions().appKey;
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
   * @fires onDataChannelStateChanged
   * @memberof PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
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
    const state = PeerConnection.getSkylinkState(roomState.room.id);
    const { room } = state;
    const handleDataChannelStats = new HandleDataChannelStats();

    logger.log.ERROR([peerId, 'RTCDataChannel', channelProp, 'Datachannel has an exception ->'], error);
    handleDataChannelStats.send(room.id, DATA_CHANNEL_STATE$1.ERROR, peerId, dataChannel, channelProp, error);
    dispatchEvent(onDataChannelStateChanged({
      state: DATA_CHANNEL_STATE$1.ERROR,
      room,
      peerId,
      channelName,
      channelType,
      bufferAmount: Skylink.getDataChannelBuffer(dataChannel),
      error,
    }));
  };

  /**
   * @param {Object} params
   * @fires onDataChannelStateChanged
   * @memberof PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
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
   * @fires onDataChannelStateChanged
   * @memberof PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
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
      state: DATA_CHANNEL_STATE.BUFFERED_AMOUNT_LOW,
      room,
      peerId,
      channelName,
      channelType,
      bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
    }));
  };

  const getTransferIDByPeerId = (pid, state) => {
    const { dataTransfers } = state;
    const transferIds = Object.keys(dataTransfers);

    for (let i = 0; i < transferIds.length; i += 1) {
      if (transferIds[i].indexOf(pid) !== -1) {
        return transferIds[i];
      }
    }
    return null;
  };

  /**
   * @param {Object} params
   * @fires onDataChannelStateChanged
   * @fires dataTransferState
   * @memberof PeerConnection.PeerConnectionHelpers.CreateDataChannelCallbacks
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
    const transferId = getTransferIDByPeerId(peerId, state);
    const handleDataChannelStats = new HandleDataChannelStats();

    logger.log.DEBUG([peerId, 'RTCDataChannel', channelProp, DATA_CHANNEL.closed]);

    try {
      handleDataChannelStats.send(room.id, STATS_MODULE.HANDLE_DATA_CHANNEL_STATS.closed, peerId, dataChannel, channelProp);
      dispatchEvent(onDataChannelStateChanged({
        state: DATA_CHANNEL_STATE$1.CLOSED,
        peerId,
        room,
        channelName,
        channelType,
        bufferAmount: PeerConnection.getDataChannelBuffer(dataChannel),
      }));

      // ESS-983 Handling dataChannel unexpected close to trigger dataTransferState Error.
      if (transferId) {
        dispatchEvent(dataTransferState({
          state: DATA_CHANNEL_STATE$1.ERROR,
          transferId,
          peerId,
          transferInfo: null, // TODO: implement self._getTransferInfo(transferId, peerId, true, false, false) data-transfer
          error: new Error(DATA_CHANNEL.closed),
        }));
      }

      if (peerConnections[peerId] && peerConnections[peerId].remoteDescription
        && peerConnections[peerId].remoteDescription.sdp && (peerConnections[peerId].remoteDescription.sdp.indexOf(
        'm=application',
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
            handleDataChannelStats.send(STATS_MODULE.HANDLE_DATA_CHANNEL_STATS.reconnecting, peerId, { label: channelName }, 'main');
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
   * @fires onDataChannelStateChanged
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
   * @param {String} roomName
   * @returns {null}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires onIncomingMessage
   */
  const sendP2PMessageForRoom = (message, targetPeerId = null, roomName = null) => {
    const state = getRoomStateByName(roomName);
    const initOptions = Skylink.getInitOptions();
    const {
      dataChannels,
      inRoom,
      user,
      hasMCU,
    } = state;

    if (!state) {
      Skylink.logNoRoomState(roomName);
      return null;
    }

    let listOfPeers = Object.keys(dataChannels);
    let isPrivate = false;

    if (Array.isArray(targetPeerId) && targetPeerId.length) {
      listOfPeers = targetPeerId;
      isPrivate = true;
    } else if (targetPeerId && typeof targetPeerId === 'string') {
      listOfPeers = [targetPeerId];
      isPrivate = true;
    }

    if (!inRoom || !(user && user.sid)) {
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

      if (!dataChannels[peerId]) {
        logger.log.ERROR([peerId, 'RTCDataChannel', null, 'Dropping of sending message to Peer as DataChannel connection does not exist.']);
        listOfPeers.splice(i, 1);
        i -= 1;
      } else if (peerId === PEER_TYPE.MCU) {
        listOfPeers.splice(i, 1);
        i -= 1;
      } else if (!hasMCU) {
        logger.log.DEBUG([peerId, 'RTCDataChannel', null, `Sending ${isPrivate ? 'private' : ''} P2P message to Peer.`]);

        sendMessageToDataChannel(state, peerId, {
          type: DC_PROTOCOL_TYPE.MESSAGE,
          isPrivate,
          sender: user.sid,
          target: peerId,
          data: message,
        }, 'main');
      }
    }

    if (listOfPeers.length === 0) {
      logger.log.WARN('Currently there are no Peers to send P2P message to.');
    }

    if (hasMCU) {
      logger.log.DEBUG([PEER_TYPE.MCU, 'RTCDataChannel', null, `Broadcasting ${isPrivate ? 'private' : ''} P2P message to Peers.`]);
      sendMessageToDataChannel(state, PEER_TYPE.MCU, {
        type: DC_PROTOCOL_TYPE.MESSAGE,
        isPrivate,
        sender: user.sid,
        target: listOfPeers,
        data: message,
      }, 'main');
    }

    dispatchEvent(onIncomingMessage({
      room: state.room,
      message: {
        targetPeerId: targetPeerId || null,
        content: message,
        senderPeerId: user.sid,
        isDataChannel: true,
        isPrivate,
      },
      isSelf: true,
      peerId: user.sid,
      peerInfo: PeerData.getCurrentSessionInfo(state.room),
    }));

    return null;
  };

  const sendP2PMessage = (message, targetPeerId = null, roomName = null) => {
    if (roomName) {
      sendP2PMessageForRoom(message, targetPeerId, roomName);
    } else {
      // Global P2P Message - BroadCast to all rooms
      const roomStates = Skylink.getSkylinkState();
      const roomKeys = Object.keys(roomStates);
      for (let i = 0; i < roomKeys.length; i += 1) {
        const roomState = roomStates[roomKeys[i]];
        sendP2PMessageForRoom(message, targetPeerId, roomState.room.roomName);
      }
    }
  };

  /**
   * @param {string} roomName
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
        listOfPeersInfo[listOfPeers[i]] = Object.assign({}, PeerData.getPeerInfo(listOfPeers[i], roomState));
        listOfPeersInfo[listOfPeers[i]].isSelf = false;
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
   * @param {string} targetMid
   * @param {SkylinkState} roomState
   * @return {null}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires candidatesGathered
   */
  const signalingEndOfCandidates = (targetMid, roomState) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const peerEndOfCandidatesCounter = state.peerEndOfCandidatesCounter[targetMid];
    const peerConnection = state.peerConnections[targetMid];
    const peerCandidatesQueue = state.peerCandidatesQueue[targetMid];
    const peerConnectionConfig = state.peerConnectionConfig[targetMid];
    const gatheredCandidates = state.gatheredCandidates[targetMid];
    const { AdapterJS, RTCIceCandidate } = window;
    const { TAGS } = SkylinkConstants;
    const { PEER_CONNECTION } = MESSAGES;

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
      logger.log.DEBUG([targetMid, TAGS.PEER_CONNECTION, null, PEER_CONNECTION.end_of_candidates]);

      peerEndOfCandidatesCounter.hasSet = true;

      try {
        if (AdapterJS.webrtcDetectedBrowser === 'edge') {
          let mLineCounter = -1;
          const addedMids = [];
          const sdpLines = peerConnection.remoteDescription.sdp.split('\r\n');
          let rejected = false;

          for (let i = 0; i < sdpLines.length; i += 1) {
            if (sdpLines[i].indexOf('m=') === 0) {
              rejected = sdpLines[i].split(' ')[1] === '0';
              mLineCounter += 1;
            } else if (sdpLines[i].indexOf('a=mid:') === 0 && !rejected) {
              const mid = sdpLines[i].split('a=mid:')[1] || '';
              if (mid && addedMids.indexOf(mid) === -1) {
                addedMids.push(mid);
                IceConnection.addIceCandidate(targetMid, `endofcan-${(new Date()).getTime()}`, 'endOfCandidates', new RTCIceCandidate({
                  sdpMid: mid,
                  sdpMLineIndex: mLineCounter,
                  candidate: 'candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates',
                }), state);
                // Start breaking after the first add because of max-bundle option
                if (peerConnectionConfig.bundlePolicy === BUNDLE_POLICY.MAX_BUNDLE) {
                  break;
                }
              }
            }
          }
        } else if (AdapterJS && !isLowerThanVersion(AdapterJS.VERSION, '0.14.0')) {
          peerConnection.addIceCandidate(null);
        }

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
        logger.log.ERROR([targetMid, TAGS.PEER_CONNECTION, null, PEER_CONNECTION.end_of_candidate_failure], error);
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
   * @fires onDataChannelStateChanged
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
   * @param {string} peerId
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
   * @param {Object} options.andwidth
   * @param {Object} options.googleXBandwidth
   * @return {Promise}
   * @memberof PeerConnection
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
        logger.log.ERROR(PEER_CONNECTION.refresh_no_peer_connection);
        reject({
          refreshErrors: { self: PEER_CONNECTION.refresh_no_peer_connection },
          listOfPeers,
        });
      }

      logger.log.INFO([null, 'PeerConnection', null, PEER_CONNECTION.refresh_start]);

      const refreshPeerConnectionPromises = PeerConnection.refreshPeerConnection(listOfPeers, roomState, doIceRestart, bwOptions);
      refreshPeerConnectionPromises
        .then((results) => {
          const mResults = hasMCU ? [results] : results;
          const refreshErrors = [];
          for (let i = 0; i < mResults.length; i += 1) {
            if (Array.isArray(mResults[i])) {
              const error = mResults[i];
              refreshErrors.push(buildPeerRefreshErrors(error[0], error[1]));
              logger.log.WARN([listOfPeers, 'PeerConnection', null, PEER_CONNECTION.refresh_peer_failed], error[0]);
            } else if (typeof mResults[i] === 'string') {
              logger.log.INFO([listOfPeers, 'PeerConnection', null, PEER_CONNECTION.refresh_peer_success], mResults[i]);
            }
          }

          if (refreshErrors.length === listOfPeers.length) {
            reject(buildResult(listOfPeers, refreshErrors, buildPeerRefreshSettings(listOfPeers, room, doIceRestart)));
          } else {
            resolve(buildResult(listOfPeers, refreshErrors, buildPeerRefreshSettings(listOfPeers, room, doIceRestart)));
          }
        })
        .catch(error => logger.log.ERROR([null, 'RTCPeerConnection', null, PEER_CONNECTION.refresh_failed], error))
        .finally(() => logger.log.INFO(PEER_CONNECTION.refresh_completed));
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
   * @param {string} peerId
   * @param {SkylinkState} roomState
   * @param {Object} options
   * @param {Object} options.bandwidth
   * @param {Object} options.googleXBandwidth
   * @return {Promise}
   * @memberOf PeerConnection.PeerConnectionHelpers
   * @fires peerRestart
   */
  const restartPeerConnection = (peerId, roomState, options) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { AdapterJS } = window;
    const {
      peerConnections, peerCustomConfigs, peerEndOfCandidatesCounter, room, user,
    } = state;
    const { doIceRestart, bwOptions } = options;
    const signaling = new SkylinkSignalingServer();
    const { PEER_CONNECTION } = MESSAGES;
    const errors = [];

    return new Promise((resolve) => {
      // reject with wrong peerId
      if (!peerConnections[peerId]) {
        logger.log.ERROR([peerId, null, null, PEER_CONNECTION.refresh_peerId_no_match]);
        errors.push(PEER_CONNECTION.refresh_peerId_no_match);
        return resolve([peerId, errors]);
      }

      const peerConnection = peerConnections[peerId];
      // refresh not supported in edge
      if (AdapterJS.webrtcDetectedBrowser === 'edge') {
        logger.log.WARN([peerId, 'RTCPeerConnection', null, PEER_CONNECTION.refresh_not_supported]);
        errors.push(PEER_CONNECTION.refresh_no_edge_support);
      }

      if (errors.length !== 0) {
        return resolve([peerId, errors]);
      }

      // Let's check if the signalingState is stable first.
      // In another galaxy or universe, where the local description gets dropped..
      // In the offerHandler or answerHandler, do the appropriate flags to ignore or drop "extra" descriptions
      if (peerConnection.signalingState === PEER_CONNECTION_STATE$1.STABLE) {
        logger.log.INFO([peerId, null, null, 'Sending restart message to signaling server ->'], {
          iceRestart: doIceRestart,
          options: bwOptions,
        });

        peerCustomConfigs[peerId] = peerCustomConfigs[peerId] || {};
        peerCustomConfigs[peerId].bandwidth = peerCustomConfigs[peerId].bandwidth || {};
        peerCustomConfigs[peerId].googleXBandwidth = peerCustomConfigs[peerId].googleXBandwidth || {};

        if (bwOptions.bandwidth && typeof bwOptions.bandwidth === 'object') {
          if (typeof bwOptions.bandwidth.audio === 'number') {
            peerCustomConfigs[peerId].bandwidth.audio = bwOptions.bandwidth.audio;
          }
          if (typeof bwOptions.bandwidth.video === 'number') {
            peerCustomConfigs[peerId].bandwidth.video = bwOptions.bandwidth.video;
          }
          if (typeof bwOptions.bandwidth.data === 'number') {
            peerCustomConfigs[peerId].bandwidth.data = bwOptions.bandwidth.data;
          }
        }

        if (bwOptions.googleXBandwidth && typeof bwOptions.googleXBandwidth === 'object') {
          if (typeof bwOptions.googleXBandwidth.min === 'number') {
            peerCustomConfigs[peerId].googleXBandwidth.min = bwOptions.googleXBandwidth.min;
          }
          if (typeof bwOptions.googleXBandwidth.max === 'number') {
            peerCustomConfigs[peerId].googleXBandwidth.max = bwOptions.googleXBandwidth.max;
          }
        }

        peerEndOfCandidatesCounter[peerId] = peerEndOfCandidatesCounter[peerId] || {};
        peerEndOfCandidatesCounter[peerId].len = 0;

        return resolve(sendRestartOfferMsg(state, peerId, doIceRestart));
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

      const unableToRestartError = `Failed restarting as peer connection state is ${peerConnection.signalingState} and there is no localDescription set to connection. There could be a handshaking step error.`;
      logger.log.DEBUG([peerId, 'RTCPeerConnection', null, unableToRestartError], {
        localDescription: peerConnection.localDescription,
        remoteDescription: peerConnection.remoteDescription,
      });
      errors.push(unableToRestartError);

      resolve([peerId, errors]);

      return null;
    });
  };

  /**
   * @param {SkylinkState} roomState
   * @param {boolean} [doIceRestart = false]
   * @param {Object} [bwOptions = {}]
   * @param {JSON} bwOptions.bandwidth
   * @param {JSON} bwOptions.googleXBandwidth
   * @returns {Promise}
   * @memberof PeerConnection.PeerConnectionHelpers
   */
  const restartMCUConnection = (roomState, doIceRestart, bwOptions) => new Promise((resolve) => {
    const updatedRoomState = roomState;
    const initOptions = Skylink.getInitOptions();
    const { mcuUseRenegoRestart } = initOptions;

    try {
      if (bwOptions.bandwidth && typeof bwOptions.bandwidth === 'object') {
        if (typeof bwOptions.bandwidth.audio === 'number') {
          updatedRoomState.streamsBandwidthSettings.bAS.audio = bwOptions.bandwidth.audio;
        }
        if (typeof bwOptions.bandwidth.video === 'number') {
          updatedRoomState.streamsBandwidthSettings.bAS.video = bwOptions.bandwidth.video;
        }
        if (typeof bwOptions.bandwidth.data === 'number') {
          updatedRoomState.streamsBandwidthSettings.bAS.data = bwOptions.bandwidth.data;
        }
      }

      if (bwOptions.googleXBandwidth && typeof bwOptions.googleXBandwidth === 'object') {
        if (typeof bwOptions.googleXBandwidth.min === 'number') {
          updatedRoomState.streamsBandwidthSettings.googleX.min = bwOptions.googleXBandwidth.min;
        }
        if (typeof bwOptions.googleXBandwidth.max === 'number') {
          updatedRoomState.streamsBandwidthSettings.googleX.max = bwOptions.googleXBandwidth.max;
        }
      }

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

  const refreshSinglePeer = (peerId, roomState, options) => {
    logger.log.INFO([peerId, 'PeerConnection', null, 'Restarting peer connection.']);
    return restartPeerConnection(peerId, roomState, options);
  };

  /**
   * @param {String<Array>}listOfPeers
   * @param {SkylinkState} roomState
   * @param {boolean} [doIceRestart = false]
   * @param {Object} [bwOptions = {}]
   * @param {JSON} bwOptions.bandwidth
   * @param {JSON} bwOptions.googleXBandwidth
   * @returns {Promise}
   * @memberof PeerConnection.PeerConnectionHelpers
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
      logger.log.ERROR([null, 'RTCPeerConnection', null, 'Failed restarting.'], error);
      return null;
    }
  };

  const buildPeerInformations = (userInfo, state) => {
    const peerInfo = userInfo;
    const peerId = peerInfo.sid;

    peerInfo.room = state.room.roomName;
    peerInfo.settings.data = !!(state.dataChannels[peerId] && state.dataChannels[peerId].main && state.dataChannels[peerId].main.channel && state.dataChannels[peerId].main.channel.readyState === DATA_CHANNEL_STATE$1.OPEN);

    delete peerInfo.publishOnly;

    return peerInfo;
  };

  const retrieveValidPeerIdsOrErrorMsg = (roomState, peerId) => {
    const { peerConnections, room } = roomState;
    const { PEER_CONNECTION } = MESSAGES;
    let peerIds = null;
    let errorMsg = null;

    if (isEmptyArray(Object.keys(peerConnections))) {
      errorMsg = PEER_CONNECTION.not_initialised;
    } else if (Array.isArray(peerId)) {
      peerIds = peerId;
      peerIds.forEach((id) => {
        if (!isValidPeerId(room, id)) {
          errorMsg = `${PEER_CONNECTION.peerId_does_not_exist} ${id}`;
        }
      });
    } else if (isAString(peerId)) {
      if (!isValidPeerId(room, peerId)) {
        errorMsg = `${PEER_CONNECTION.peerId_does_not_exist} ${peerId}`;
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
    const { AdapterJS } = window;

    peerConnections[peerId].close();

    // FIXME: Check if needed. Polyfill for safari 11 "closed" event not triggered for "iceConnectionState" and "signalingState".
    if (AdapterJS.webrtcDetectedType === 'AppleWebKit') {
      if (!updatedState.peerConnections[peerId].signalingStateClosed) {
        updatedState.peerConnections[peerId].signalingStateClosed = true;
        // trigger('peerConnectionState', this.PEER_CONNECTION_STATE.CLOSED, peerId);
      }
      if (!updatedState.peerConnections[peerId].iceConnectionStateClosed) {
        updatedState.peerConnections[peerId].iceConnectionStateClosed = true;
        // handleIceConnectionStats(ICE_CONNECTION_STATE.CLOSED, peerId);
        // trigger('iceConnectionState', this.ICE_CONNECTION_STATE.CLOSED, peerId);
      }
    }

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

  /**
   * @namespace PeerConnectionHelpers
   * @description All helper and utility functions for <code>{@link PeerConnection}</code> class are listed here.
   * @private
   * @memberof PeerConnection
   * @type {{createOffer, createAnswer, addPeer, createDataChannel, sendP2PMessage, getPeersInRoom, signalingEndOfCandidates, getDataChannelBuffer, refreshDataChannel, closeDataChannel, refreshConnection, refreshPeerConnection, restartPeerConnection, buildPeerInformations, getConnectionStatus, closePeerConnection, updatePeerInformationsMediaStatus }}
   */
  const helpers$2 = {
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
  };

  const addScreenStreamToState = (state, stream) => {
    const { room, user } = state;
    const settings = helpers$6.parseStreamSettings({ video: true });
    const isScreensharing = true;
    const isAudioFallback = false;
    helpers$6.processStreamInState(stream, settings, room.id, isScreensharing, isAudioFallback);

    dispatchEvent(onIncomingScreenStream({
      stream,
      peerId: user.sid,
      room,
      isSelf: true,
      peerInfo: PeerData.getCurrentSessionInfo(room),
      streamId: stream.id,
      isVideo: stream.getVideoTracks().length > 0,
      isAudio: stream.getAudioTracks().length > 0,
    }));
  };

  const removeScreenStreamFromState = (state) => {
    const { room, streams } = state;
    streams.screenshare = null;
    Skylink.setSkylinkState(state, room.id);
  };

  const setScreenStateToUnavailable = (state, stream) => {
    const { user, room } = state;
    const mediaId = PeerMedia.retrieveMediaId(TRACK_KIND.VIDEO, stream.id);
    PeerMedia.setMediaStateToUnavailable(room, user.sid, mediaId);
  };

  var handleScreenStreamStates = {
    addScreenStreamToState,
    removeScreenStreamFromState,
    setScreenStateToUnavailable,
  };

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

  const retrievePeerScreenStream = (state) => {
    const { remoteStreams } = state;
    const peersScreenStreamId = retrievePeersScreenStreamId(state);

    if (isEmptyObj(peersScreenStreamId)) {
      return null;
    }

    const peersScreenStream = {};

    Object.keys(peersScreenStreamId).forEach((peerId) => {
      const peerRemoteStreams = Object.values(remoteStreams[peerId]);
      // eslint-disable-next-line prefer-destructuring
      peersScreenStream[peerId] = peerRemoteStreams.filter(stream => stream.id === peersScreenStreamId[peerId].id);
    });

    return peersScreenStream;
  };

  const stopScreenStream = (room, screenStream) => {
    const fromLeaveRoom = false;
    const isScreensharing = true;
    stopStreamHelpers.prepStopStream(room.id, screenStream.id, fromLeaveRoom, isScreensharing);
  };

  const addScreenStreamCallbacks = (state, stream) => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      // eslint-disable-next-line no-param-reassign
      track.onended = () => stopScreenStream(state.room, stream);
    });
  };

  const helpers$3 = {
    handleScreenStreamStates,
    addScreenStreamCallbacks,
    retrievePeersScreenStreamId,
    retrievePeerScreenStream,
    stopScreenStream,
  };

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
     * @param {string} params.targetMid - Peer's id
     * @param {Object} params.peerBrowser - Peer's user agent object
     * @param {RTCCertificate} params.cert - Represents a certificate that an RTCPeerConnection uses to authenticate.
     * @param {boolean} receiveOnly
     * @param {boolean} hasScreenshare - Is screenshare enabled
     */
    static addPeer(params) {
      helpers$2.addPeer(params);
    }

    /**
     * @static
     * @param args
     */
    static createOffer(...args) {
      return helpers$2.createOffer(...args);
    }

    /**
     * @static
     * @param args
     */
    static createAnswer(...args) {
      return helpers$2.createAnswer(...args);
    }

    /**
     * @static
     * @param args
     */
    static createDataChannel(...args) {
      return helpers$2.createDataChannel(...args);
    }

    /**
     * @static
     * @param args
     */
    static sendP2PMessage(...args) {
      return helpers$2.sendP2PMessage(...args);
    }

    /**
     * @static
     * @param args
     */
    static getPeersInRoom(...args) {
      return helpers$2.getPeersInRoom(...args);
    }

    /**
     * Get webRTC statistics via the getStats() method of RTCPeerConnection inside a Room
     * @param {SkylinkRoom.id} roomKey
     * @param {string} peerId
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
      return helpers$2.signalingEndOfCandidates(...args);
    }

    /**
     * Get RTCPeerConnection status
     * @param {SkylinkState} roomState
     * @param {string|Array} peerId
     * @static
     * @return {Promise<statistics>}
     */
    static getConnectionStatus(roomState, peerId) {
      return helpers$2.getConnectionStatus(roomState, peerId);
    }

    /**
     * Get RTCDataChannel buffer thresholds
     * @param {RTCDataChannel.channel} channel
     * @static
     * @return {{bufferedAmountLow: number, bufferedAmountLowThreshold: number}}
     */
    static getDataChannelBuffer(channel) {
      return helpers$2.getDataChannelBuffer(channel);
    }

    static refreshDataChannel(roomState, peerId) {
      return helpers$2.refreshDataChannel(roomState, peerId);
    }

    static closeDataChannel(roomState, peerId) {
      return helpers$2.closeDataChannel(roomState, peerId);
    }

    static refreshConnection(roomState, targetPeerId, iceRestart, options, callback) {
      return helpers$2.refreshConnection(roomState, targetPeerId, iceRestart, options, callback);
    }

    static refreshPeerConnection(listOfPeers, roomState, doIceRestart, bwOptions) {
      return helpers$2.refreshPeerConnection(listOfPeers, roomState, doIceRestart, bwOptions);
    }

    static getPeerScreenshare(roomState) {
      return helpers$3.retrievePeerScreenStream(roomState);
    }

    static buildPeerInformations(...args) {
      return helpers$2.buildPeerInformations(...args);
    }

    static closePeerConnection(roomState, peerId) {
      return helpers$2.closePeerConnection(roomState, peerId);
    }

    static updatePeerInformationsMediaStatus(roomState, peerId, transceiverMid, stream) {
      return helpers$2.updatePeerInformationsMediaStatus(roomState, peerId, transceiverMid, stream);
    }
  }

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
      this.isReplace = null;
      this.streamId = null;

      screensharingInstance[room.id] = this;
    }

    streamExists() {
      const streamList = helpers$6.retrieveStreams(this.roomState, this.roomState.room.name);
      const streamIds = Object.keys(streamList.userMedia);

      for (let i = 0; i < streamIds.length; i += 1) {
        if (streamIds[i] === this.streamId) {
          return true;
        }
      }
      return false;
    }

    // eslint-disable-next-line class-methods-use-this
    hasMoreThanOneVideoStream() {
      return helpers$6.retrieveVideoStreams(this.roomState.room).length > 1;
    }

    hasUserMediaStream() {
      const { streams } = this.roomState;

      return streams.userMedia;
    }

    // TODO: Implement replace logic
    /**
     * Function that starts the screenshare.
     * @param {boolean} isReplace
     * @param {String} streamId
     * @return {MediaStream}
     */
    async start(isReplace, streamId = null) {
      this.isReplace = false;
      this.streamId = streamId;

      try {
        this.checkForExistingScreenStreams();
        this.checksForReplaceScreen();

        this.stream = await this.startScreenCapture();
        if (!this.stream) {
          this.deleteScreensharingInstance(this.roomState.room);
          return null;
        }

        helpers$3.handleScreenStreamStates.addScreenStreamToState(this.roomState, this.stream, this.isReplace);
        helpers$3.addScreenStreamCallbacks(this.roomState, this.stream);

        if (this.isReplace) {
          this.replaceUserMediaStream();
        } else {
          this.addScreenshareStream();
        }
      } catch (error) {
        logger.log.ERROR([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.REPLACE_SCREEN], error);
      }

      return this.stream;
    }

    /**
     * Function that stops the screenshare.
     * @return {MediaStream}
     */
    stop() {
      if (!this.stream) {
        logger.log.DEBUG([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN} - ${MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM}`]);
        return null;
      }

      try {
        helpers$3.stopScreenStream(this.roomState.room, this.stream);

        this.isReplace = null;
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
      if (navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia({ video: true })
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
      return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } })
        .then(stream => stream)
        .catch((error) => {
          logger.log.ERROR(error);
          return null;
        });
    }

    checksForReplaceScreen() {
      if (!this.isReplace) return;

      if (!this.hasUserMediaStream()) {
        throw new Error(MESSAGES.MEDIA_STREAM.ERRORS.NO_USER_MEDIA_STREAMS);
      }

      if (this.hasMoreThanOneVideoStream() && !this.streamId) {
        throw new Error(MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM_ID);
      }

      if (this.streamId && !isAString(this.streamId)) {
        throw new Error(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_STREAM_ID_TYPE);
      }

      if (this.streamId && !this.streamExists()) {
        throw new Error(`${MESSAGES.MEDIA_STREAM.ERRORS.INVALID_STREAM_ID} - ${this.streamId}`);
      }
    }

    checkForExistingScreenStreams() {
      const peersScreenStream = helpers$3.retrievePeersScreenStreamId(this.roomState);

      if (!isEmptyObj(peersScreenStream)) {
        logger.log.WARN([this.roomState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.PEER_SCREEN_ACTIVE]);
      }
    }

    replaceUserMediaStream() {
      const { peerConnections, streams } = this.roomState;
      const peerIds = Object.keys(peerConnections);
      const oldStream = this.streamId ? streams.userMedia[this.streamId].stream : helpers$6.retrieveVideoStreams(this.roomState.room)[0];
      const newStream = this.stream;

      this.streamId = oldStream.id;
      updateReplacedStreamInState(oldStream, newStream, this.roomState, true);

      peerIds.forEach((peerId) => {
        helpers$6.replaceTrack(oldStream, newStream, peerId, this.roomState);
      });
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

    isReplaceScreenStream() {
      return this.isReplace;
    }
  }

  const stopAddedStream = (state, stream, isScreensharing = false, fromLeaveRoom = false) => {
    const { room, user } = state;

    try {
      stopStreamHelpers.tryStopStream(stream, user.sid);

      if (!fromLeaveRoom) {
        stopStreamHelpers.removeTracks(room, stream);
        stopStreamHelpers.updateMediaInfoMediaState(room, stream);
        stopStreamHelpers.deleteStreamFromState(room, stream, isScreensharing);
        stopStreamHelpers.listenForEventAndDeleteMediaInfo(room, stream);
        stopStreamHelpers.dispatchOnLocalStreamEnded(room, stream, isScreensharing);

        if (isScreensharing) {
          new ScreenSharing(state).deleteScreensharingInstance(room);
        }
      }
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

  const deleteStreamFromState = (room, stream, isScreensharing = null) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    const { user } = updatedState;
    const streamIdToRemove = stream.id;

    if (isScreensharing) {
      delete updatedState.streams.screenshare;

      logger.log.INFO([user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.STOP_SUCCESS} - stream id: ${stream.id} (screenshare)`]);
    } else {
      delete updatedState.streams.userMedia[streamIdToRemove];
      delete updatedState.streamsMediaStatus[stream.id];
      delete updatedState.streamsMutedSettings[stream.id];

      if (isEmptyObj(updatedState.streams.userMedia)) {
        updatedState.streams.userMedia = null;
      }

      logger.log.INFO([user.sid, TAGS.MEDIA_STREAM, null, `${MESSAGES.MEDIA_STREAM.STOP_SUCCESS} - stream id: ${stream.id}`]);
    }

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
  };

  /**
   * Function that handles the <code>RTCPeerConnection.removeTracks(sender)</code> on the local MediaStream.
   * @param {SkylinkRoom} room
   * @param {MediaStream} stream - The stream.
   * @param {boolean} isScreensharing
   * @memberOf MediaStreamHelpers
   * @fires streamEnded
   */
  const dispatchOnLocalStreamEnded = (room, stream, isScreensharing = false) => {
    const state = Skylink.getSkylinkState(room.id);
    const { MEDIA_STREAM } = MESSAGES;
    const { user } = state;
    const isSelf = true;

    logger.log.INFO(MEDIA_STREAM.STOP_SETTINGS, {
      peerId: user.sid, isSelf, isScreensharing, stream,
    });

    dispatchEvent(streamEnded({
      room,
      peerId: user.sid,
      peerInfo: PeerData.getCurrentSessionInfo(room),
      isSelf,
      isScreensharing,
      streamId: stream.id,
      isVideo: hasVideoTrack(stream),
      isAudio: hasAudioTrack(stream),
    }));

    dispatchEvent(mediaAccessStopped({
      isScreensharing,
      streamId: stream.id,
    }));

    dispatchEvent(peerUpdated({
      peerId: user.sid,
      peerInfo: helpers$4.getCurrentSessionInfo(room),
      isSelf: true,
    }));
  };

  const hasStreamBeenReplaced$1 = (state, stoppedStream) => {
    const { streams } = state;

    if (!streams.userMedia) {
      return false;
    }

    const streamObjs = Object.values(streams.userMedia);

    return streamObjs.some(streamObj => streamObj.isReplaced && (streamObj.id === stoppedStream.id));
  };

  const prepStopScreenStream = (room, streamId, fromLeaveRoom = false) => {
    const state = Skylink.getSkylinkState(room.id);
    const { user, streams } = state;
    const screenStream = streams.screenshare.stream;
    const isScreensharing = true;

    try {
      if (hasStreamBeenReplaced$1(state, screenStream)) {
        stopStreamHelpers.stopReplacedStream(state, screenStream, isScreensharing, fromLeaveRoom);
      } else {
        stopStreamHelpers.stopAddedStream(state, screenStream, isScreensharing, fromLeaveRoom);
      }

      stopStreamHelpers.initRefreshConnection(state.room, fromLeaveRoom);
    } catch (error) {
      logger.log.ERROR([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.STOP_SCREEN], error);
    }
  };

  const dispatchPeerUpdatedEvent = (roomState) => {
    const { room, user } = roomState;

    dispatchEvent(peerUpdated({
      room,
      peerId: user.sid,
      isSelf: true,
      peerInfo: PeerData.getCurrentSessionInfo(room),
    }));
  };

  const initRefreshConnection = (room, fromLeaveRoom) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;

    if (!fromLeaveRoom) {
      if (!isEmptyArray(Object.keys(peerConnections))) {
        PeerConnection.refreshConnection(state);
      } else {
        dispatchPeerUpdatedEvent(state);
        PeerMedia.deleteUnavailableMedia(state.room, state.user.sid);
      }
    }
  };

  const sendStreamReplaceEndedMsg = (state, stoppedStream) => {
    const { room, user } = state;
    const signaling = new SkylinkSignalingServer();
    signaling.stream(room.id, user, stoppedStream, STREAM_STATUS.REPLACED_STREAM_ENDED, null);
  };

  // TODO:
  //  implement stop user media stream
  //  stop screen stream will be implemented diff - need to replace the screen stream with the original user media stream
  //  ref: onScreenStreamEnded for previous implementation
  const stopReplacedStream = (state, stream, isScreensharing, fromLeaveRoom) => {
    const { user, room } = state;

    try {
      stopStreamHelpers.tryStopStream(stream);

      if (!fromLeaveRoom) {
        sendStreamReplaceEndedMsg(state, stream);
        stopStreamHelpers.deleteStreamFromState(room, stream, isScreensharing);
        stopStreamHelpers.dispatchOnLocalStreamEnded(room, stream);
      }
    } catch (err) {
      logger.log.ERROR([user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.ERRORS.STOP_REPLACED_STREAM], err);
    }
  };

  const stopReplacedStreams = (state, streams, isScreensharing, fromLeaveRoom) => {
    streams.forEach((stream) => {
      stopStreamHelpers.stopReplacedStream(state, stream, isScreensharing, fromLeaveRoom);
    });
  };

  const stopStreamHelpers = {
    prepStopStream,
    prepStopUserMediaStream,
    stopAddedStream,
    tryStopStream,
    removeTracks,
    listenForEventAndDeleteMediaInfo,
    stopAddedStreams,
    updateMediaInfoMediaState,
    deleteStreamFromState,
    dispatchOnLocalStreamEnded,
    prepStopScreenStream,
    initRefreshConnection,
    stopReplacedStream,
    stopReplacedStreams,
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
     * @param {GetUserMediaOptions} mediaOptions - The camera Stream configuration options.
     * @return {Promise}
     */
    static getUserMedia(state, mediaOptions = {}) {
      const { room } = state;
      const updatedRoomState = helpers$6.parseMediaOptions(mediaOptions, state);
      const { audio, video } = mediaOptions;
      const useExactConstraints = !!mediaOptions.useExactConstraints;
      Skylink.setSkylinkState(updatedRoomState, room.id);

      return helpers$6.prepMediaAccessRequest({
        useExactConstraints,
        audio,
        video,
        roomKey: room.id,
      });
    }

    /**
     * @description Function that filters user input from getUserMedia public method
     * @param {SkylinkState} roomState
     * @param {GetUserMediaOptions} options
     */
    static getUserMediaLayer(roomState, options = null) {
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
     * @param {string} streamId - The id of the stream to stop if there is more than one getUserMedia stream.
     */
    static stopStream(roomState, streamId) {
      stopStreamHelpers.prepStopStream(roomState.room.id, streamId);
      return null;
    }

    /**
     * Function that sets User's Stream to send to Peer connection.
     * @param {string} targetMid - The mid of the target peer
     * @param {SkylinkState} roomState - Skylink State of current room
     */
    static addLocalMediaStreams(targetMid, roomState) {
      helpers$6.addLocalMediaStreams(targetMid, roomState);
    }

    /**
     * Function that handles the <code>RTCPeerConnection.ontrack</code> event on remote stream added.
     * @param {MediaStream} stream - {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream}
     * @param {SkylinkState} currentRoomState - Current room state
     * @param {string} targetMid - The mid of the target peer
     * @param {boolean} [isScreensharing=false] - The flag if stream is a screenshare stream.
     */
    static onRemoteTrackAdded(stream, currentRoomState, targetMid, isScreensharing, isVideo, isAudio) {
      helpers$6.onRemoteTrackAdded(stream, currentRoomState, targetMid, isScreensharing, isVideo, isAudio);
    }

    /**
     * Function that mutes the stream.
     * @param {SkylinkState} roomState
     * @param {Object} options
     * @param {boolean} options.audioMuted
     * @param {boolean} options.videoMuted
     * @param {string} streamId
     */
    static muteStream(roomState, options, streamId) {
      return helpers$6.muteStream(roomState, options, streamId);
    }

    /**
     * Function that sends the MediaStream object if present or mediaStream settings.
     * @param {SkylinkState} roomState
     * @param {MediaStream|Object} options
     */
    static sendStream(roomState, options) {
      return helpers$6.sendStream(roomState, options);
    }

    static getStreamSources() {
      return helpers$6.getStreamSources();
    }

    static getScreenSources() {
      return helpers$6.getScreenSources();
    }

    static updateRemoteStreams(room, peerId, stream) {
      return helpers$6.updateRemoteStreams(room, peerId, stream);
    }

    /**
     * Function that returns all active streams including screenshare stream if present.
     * @param {SkylinkState} roomState
     * @return {streamList} streamList
     */
    static retrieveStreams(roomState) {
      return helpers$6.retrieveStreams(roomState);
    }

    static usePrefetchedStream(roomKey, stream, options = null) {
      return new Promise((resolve) => {
        if (!stream && (options.id && options.active)) {
          // eslint-disable-next-line no-param-reassign
          stream = options;
        }

        const streamOptions = { audio: stream.getAudioTracks().length !== 0, video: stream.getVideoTracks().length !== 0 };
        const audioSettings = helpers$6.parseStreamSettings(streamOptions, TRACK_KIND.AUDIO);
        const videoSettings = helpers$6.parseStreamSettings(streamOptions, TRACK_KIND.VIDEO);
        const isAudioFallback = false;
        return helpers$6.onStreamAccessSuccess(roomKey, stream, audioSettings, videoSettings, isAudioFallback, resolve);
      });
    }
  }

  const hasPeerConnections = (peerConnections, hasMCU) => (hasMCU ? !!peerConnections.MCU.maps : !isEmptyObj(peerConnections));

  const getSelfStreams = (streams) => {
    if (streams.userMedia) {
      return streams.userMedia;
    }
    return null;
  };

  const getSelfScreen = (streams) => {
    if (streams.screenshare) {
      return streams.screenshare;
    }
    return null;
  };

  /**
   * @description Function that gets the list of connected Peers Streams in the Room.
   * @param {SkylinkState} roomState
   * @param {boolean} [includeSelf=true] - The flag if self streams are included.
   * @return {Object}
   * @memberof PeerDataHelpers
   */
  const getPeersStream = (roomState, includeSelf = true) => {
    const listOfPeersStreams = {};
    const {
      peerConnections,
      user,
      streams,
      hasMCU,
    } = roomState;

    if (user && user.sid && includeSelf) {
      const selfStreams = getSelfStreams(streams);
      const selfScreen = getSelfScreen(streams);
      listOfPeersStreams[user.sid] = selfStreams || selfScreen ? {} : null;

      if (selfStreams) {
        Object.keys(selfStreams).forEach((streamId) => {
          listOfPeersStreams[user.sid].isSelf = true;
          listOfPeersStreams[user.sid][streamId] = selfStreams[streamId].stream;
        });
      }

      if (selfScreen) {
        listOfPeersStreams[user.sid].isSelf = true;
        listOfPeersStreams[user.sid][selfScreen.id] = selfScreen;
      }
    }

    if (hasPeerConnections(peerConnections, hasMCU)) {
      const listOfPeers = hasMCU ? Object.keys(peerConnections.MCU.maps) : Object.keys(peerConnections);
      for (let i = 0; i < listOfPeers.length; i += 1) {
        listOfPeersStreams[listOfPeers[i]] = {};
        const remoteStreams = MediaStream.retrieveRemoteStreams(roomState, listOfPeers[i]);
        remoteStreams.forEach((stream) => {
          listOfPeersStreams[listOfPeers[i]][stream.id] = stream;
        });
      }
    }

    return isEmptyObj(listOfPeersStreams) ? null : listOfPeersStreams;
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
   * @memberof PeerDataHelpers
   */
  const getPeerCustomSettings = (state, peerId) => {
    const { streams } = state;
    const customSettings = {};
    customSettings.settings = {
      audio: false,
      video: false,
      data: false,
      bandwidth: clone_1(state.streamsBandwidthSettings.bAS),
      googleXBandwidth: clone_1(state.streamsBandwidthSettings.googleX),
    };

    const usePeerId = state.hasMCU ? PEER_TYPE.MCU : peerId;

    if (state.peerConnections[usePeerId].signalingState !== PEER_CONNECTION_STATE$1.CLOSED) {
      const initOptions = Skylink.getInitOptions();
      const peerInfo = PeerData.getPeerInfo(usePeerId, state);

      customSettings.settings = clone_1(peerInfo.settings);
      customSettings.settings.data = initOptions.enableDataChannel && state.peerInformations[usePeerId].config.enableDataChannel;

      // TODO: check logic - why the need to build again and not take from getPeerInfo since the signature is the same
      if (streams.userMedia || streams.screenshare) ;
    }

    //  update default conifg with peer custom config TODO: check if parsing of state.peerCustomConfigs is required or if it can be assigned directly
    if (state.peerCustomConfigs[usePeerId]) {
      if (Object.hasOwnProperty.call(state.peerCustomConfigs[usePeerId], 'bandwidth')) {
        const peerCustomConfigBandwidth = state.peerCustomConfigs[usePeerId].bandwidth;

        if (isAObj(peerCustomConfigBandwidth)) {
          if (isANumber(peerCustomConfigBandwidth.audio)) {
            customSettings.settings.bandwidth.audio = peerCustomConfigBandwidth.audio;
          }
          if (isANumber(peerCustomConfigBandwidth.video)) {
            customSettings.settings.bandwidth.video = peerCustomConfigBandwidth.video;
          }
          if (isANumber(peerCustomConfigBandwidth.data)) {
            customSettings.settings.bandwidth.data = peerCustomConfigBandwidth.data;
          }
        }
      }

      if (Object.hasOwnProperty.call(state.peerCustomConfigs[usePeerId], 'googleXBandwidth')) {
        const peerCustomConfigGoogleXBandwidth = state.peerCustomConfigs[usePeerId].googleXBandwidth;

        if (isAObj(peerCustomConfigGoogleXBandwidth)) {
          if (isANumber(peerCustomConfigGoogleXBandwidth.min)) {
            customSettings.settings.googleXBandwidth.min = peerCustomConfigGoogleXBandwidth.min;
          }
          if (isANumber(peerCustomConfigGoogleXBandwidth.max)) {
            customSettings.settings.googleXBandwidth.max = peerCustomConfigGoogleXBandwidth.max;
          }
        }
      }
    }

    // Check we are going to send data to peer // TODO: is the above check enough or do we need to parse it from sdp
    // if (state.sdpSessions[usePeerId]) {
    //   const peerLocalConnection = state.sdpSessions[usePeerId].local.connection;
    //   if (isAObj(peerLocalConnection)) {
    //     if (state.sdpSessions[usePeerId].local.connection.audio
    //       && state.sdpSessions[usePeerId].local.connection.audio.indexOf('send') > -1) {
    //       customSettings.settings.audio = true;
    //       customSettings.mediaStatus.audioMuted = false;
    //     }
    //     if (state.sdpSessions[usePeerId].local.connection.video
    //       && state.sdpSessions[usePeerId].local.connection.video.indexOf('send') > -1) {
    //       customSettings.settings.video = true;
    //       customSettings.mediaStatus.videoMuted = false;
    //     }
    //     if (state.sdpSessions[usePeerId].local.connection.data
    //       && state.sdpSessions[usePeerId].local.connection.data.indexOf('send') > -1) {
    //       customSettings.settings.data = true;
    //     }
    //   }
    // }

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
        customSettingsList[peerIds[peerId]] = getPeerCustomSettings(roomState, peerIds[peerId]);
      }

      return customSettingsList;
    }

    return customSettingsList;
  };

  /**
   * Iterates through all connected peers to find the greatest peerPriorityWeight and sets the current users peerPriorityWeight to max.
   * @param {SkylinkState} roomState
   * @private
   */
  const setGreatestPeerPriorityWeight = (roomState) => {
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { peerInformations } = state;
    const informationList = Object.entries(peerInformations);
    const selfPriorityWeight = state.peerPriorityWeight;

    let maxPeerPriority = selfPriorityWeight;
    for (let i = 0; i < informationList.length; i += 1) {
      const peerInformation = informationList[i][1];
      const { config: { priorityWeight } } = peerInformation;

      if (priorityWeight > maxPeerPriority) {
        maxPeerPriority = priorityWeight;
        state.peerPriorityWeight = maxPeerPriority + 1;
      }
    }
    Skylink.setSkylinkState(state, state.room.id);
    logger.log.DEBUG(`User's priorityWeight is set to ${maxPeerPriority}`);
  };

  /**
   * @namespace PeerDataHelpers
   * @description All helper and utility functions for <code>{@link PeerData}</code> class are listed here.
   * @private
   * @type {{getCurrentSessionInfo, getPeerInfo, getUserData, getUserInfo, setUserData, getPeersStream, getPeersDataChannels, getPeersCustomSettings, setGreatestPeerPriorityWeight}}
   */
  const helpers$4 = {
    getPeerInfo,
    getCurrentSessionInfo,
    getUserInfo,
    getUserData,
    setUserData,
    getPeersStream,
    getPeersDataChannels,
    getPeersCustomSettings,
    setGreatestPeerPriorityWeight,
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
     * @param {string} peerId
     * @param {SkylinkState} roomState
     * @return {peerInfo}
     */
    static getPeerInfo(peerId, roomState) {
      return helpers$4.getPeerInfo(peerId, roomState);
    }

    /**
     * @private
     * @param {SkylinkRoom} room
     * @return {peerInfo}
     */
    static getCurrentSessionInfo(room) {
      return helpers$4.getCurrentSessionInfo(room);
    }

    /**
     * @description Function that returns the User session information to be sent to Peers.
     * @private
     * @param {SkylinkRoom} room
     * @return {Object}
     */
    static getUserInfo(room) {
      return helpers$4.getUserInfo(room);
    }

    /**
     * @description Function that returns the User / Peer current custom data.
     * @private
     * @param {Skylink} roomState
     * @param {string} peerId
     * @return {roomState.userData}
     */
    static getUserData(roomState, peerId) {
      return helpers$4.getUserData(roomState, peerId);
    }

    /**
     * @description Function that overwrites the User current custom data.
     * @private
     * @param {SkylinkRoom} room
     * @param {string | Object} userData
     */
    static setUserData(room, userData) {
      helpers$4.setUserData(room, userData);
    }

    /**
     * @description  Function that gets the list of connected Peers Streams in the Room.
     * @private
     * @param {SkylinkState} roomState
     * @param {boolean} [includeSelf=true] - The flag if self streams are included.
     * @return {Object}
     */
    static getPeersStream(roomState, includeSelf) {
      return helpers$4.getPeersStream(roomState, includeSelf);
    }

    /**
     * @description Function that gets the current list of connected Peers Datachannel connections in the Room.
     * @private
     * @param {SkylinkState} roomState
     * @return {Object} listOfPeersDataChannels
     */
    static getPeersDataChannels(roomState) {
      return helpers$4.getPeersDataChannels(roomState);
    }

    /**
     * @description Function that gets the list of current custom Peer settings sent and set.
     * @param {SkylinkState} roomState
     * @return {Object}
     */
    static getPeersCustomSettings(roomState) {
      return helpers$4.getPeersCustomSettings(roomState);
    }

    /**
     * Iterates through all connected peers to find the greatest peerPriorityWeight and sets the current users peerPriorityWeight to max.
     * @param {SkylinkState} roomState
     * @return {*|void}
     */
    static setGreatestPeerPriorityWeight(roomState) {
      return helpers$4.setGreatestPeerPriorityWeight(roomState);
    }
  }

  const handleSocketClose = (roomKey, reason) => {
    const state = Skylink.getSkylinkState(roomKey) || Object.values(Skylink.getSkylinkState())[0]; // to handle leaveAllRooms method

    const {
      socketSession, inRoom, room, user,
    } = state;

    logger.log.INFO([null, 'Socket', null, `Channel closed. Reason - ${reason}`]);

    state.channelOpen = false;
    Skylink.setSkylinkState(state, roomKey);

    dispatchEvent(channelClose({
      socketSession: clone_1(socketSession),
    }));

    if (inRoom && user && user.sid) {
      dispatchEvent(sessionDisconnect({
        peerId: user.sid,
        peerInfo: PeerData.getCurrentSessionInfo(room),
      }));
    }
  };

  class HandleSignalingStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        room_id: null,
        user_id: null,
        client_id: null,
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
      this.model.signaling_transport = null;
      this.model.attempts = socketSession.socketSession.finalAttempts === 0 ? socketSession.socketSession.attempts : (socketSession.socketSession.finalAttempts * 2) + socketSession.socketSession.attempts;
      this.model.appKey = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
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

    if (socketSession.socketSession.finalAttempts !== 0 || socketSession.socketSession.attempts !== 0) {
      dispatchEvent(channelReopen({
        socketSession: clone_1(socketSession),
      }));
    } else {
      dispatchEvent(channelOpen({
        socketSession: clone_1(socketSession),
      }));
    }

    resolve();
  };

  const onDisconnect = (roomKey, reason) => {
    const state = Skylink.getSkylinkState(roomKey) || Object.values(Skylink.getSkylinkState())[0]; // to handle leaveAllRooms method
    const isChannelOpen = state.channelOpen;
    const { room } = state;

    new HandleSignalingStats().send(room.id, STATES.SIGNALING.DISCONNECT, null);

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

  // eslint-disable-next-line no-unused-vars
  const onReconnectAttempt = (roomKey, attempt) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { socketSession } = state;
    const signaling = new SkylinkSignalingServer();
    let currentAttempt = 0;

    signaling.updateAttempts(roomKey, 'attempts', attempt);

    if (socketSession.socketSession.finalAttempts === 0) {
      currentAttempt = attempt;
    } else {
      currentAttempt = (socketSession.socketSession.finalAttempts * 2) + socketSession.socketSession.attempts;
    }

    new HandleSignalingStats().send(roomKey, STATES.SIGNALING.RECONNECT_ATTEMPT, currentAttempt);

    dispatchEvent(channelRetry({
      fallbackType: socketSession.fallbackType,
      currentAttempt,
      session: clone_1(Skylink.getSkylinkState(roomKey).socketSession),
    }));
  };

  const onReconnectFailed = (resolve, reject, roomKey) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { socketSession } = state;
    const signaling = new SkylinkSignalingServer();

    // try next port or transport
    if (socketSession.socketSession.attempts === DEFAULTS.SOCKET.RECONNECTION_ATTEMPTS.WEBSOCKET && socketSession.socketSession.finalAttempts < DEFAULTS.SOCKET.RECONNECTION_FINAL_ATTEMPTS && !socketSession.socketTimeout) {
      signaling.socket.connect();
      signaling.updateAttempts(roomKey, 'attempts', socketSession.socketSession.attempts === DEFAULTS.SOCKET.RECONNECTION_ATTEMPTS.WEBSOCKET ? 0 : socketSession.socketSession.attempts += 1);
      signaling.updateAttempts(roomKey, 'finalAttempts', socketSession.socketSession.finalAttempts += 1);
    } else {
      new HandleSignalingStats().send(roomKey, STATES.SIGNALING.RECONNECT_FAILED, MESSAGES.INIT.ERRORS.SOCKET_ERROR_ABORT);

      dispatchEvent(socketError({
        session: clone_1(socketSession),
        errorCode: SOCKET_ERROR$1.RECONNECTION_ABORTED,
        type: socketSession.fallbackType,
        error: new Error(MESSAGES.INIT.ERRORS.SOCKET_ERROR_ABORT),
      }));

      reject(new Error(MESSAGES.INIT.ERRORS.SOCKET_ERROR_ABORT));
    }
  };

  const onReconnectError = (roomKey, error) => {
    const state = Skylink.getSkylinkState(roomKey);
    const { socketSession } = state;

    new HandleSignalingStats().send(roomKey, STATES.SIGNALING.RECONNECT_ERROR, error);

    if (!socketSession.socketTimeout && error ? error === 'timeout' : false) {
      logger.log.ERROR([null, 'Socket', null, `${socketSession.socketType} connection timed out.`]);
      socketSession.socketTimeout = true;
      Skylink.setSkylinkState(state, roomKey);
    }
  };

  const callbacks$2 = {
    onConnection,
    onDisconnect,
    onError,
    onReconnectAttempt,
    onReconnectFailed,
    onReconnectError,
  };

  const setSocketCallbacks = (roomKey, signaling, resolve, reject) => {
    signaling.socket.on(SOCKET_EVENTS.CONNECT, callbacks$2.onConnection.bind(signaling, resolve, roomKey));
    signaling.socket.on(SOCKET_EVENTS.MESSAGE, signaling.onMessage.bind(signaling));
    signaling.socket.on(SOCKET_EVENTS.DISCONNECT, callbacks$2.onDisconnect.bind(signaling, roomKey));
    signaling.socket.on(SOCKET_EVENTS.ERROR, callbacks$2.onError.bind(signaling, roomKey));
    signaling.socket.on(SOCKET_EVENTS.RECONNECT_ATTEMPT, callbacks$2.onReconnectAttempt.bind(signaling, roomKey));
    signaling.socket.on(SOCKET_EVENTS.RECONNECT_ERROR, callbacks$2.onReconnectError.bind(signaling, roomKey));
    signaling.socket.on(SOCKET_EVENTS.RECONNECT_FAILED, callbacks$2.onReconnectFailed.bind(signaling, resolve, reject, roomKey));
  };

  const createSocket$1 = params => createSocket(params);

  const processSignalingMessage$1 = (...args) => {
    processSignalingMessage(...args);
  };

  const sendChannelMessage = (socket, message) => {
    socket.send(JSON.stringify(message));
  };

  const handleSocketClose$1 = (...args) => {
    handleSocketClose(...args);
  };

  const setSocketCallbacks$1 = (...args) => {
    setSocketCallbacks(...args);
  };

  const peerMessageFromSignalingHandler = (message, isPublic) => {
    const {
      mid,
      type,
      data,
      target,
      rid,
    } = message;
    const roomState = Skylink.getSkylinkState(rid);

    logger.log.INFO([mid, null, type, `Received ${isPublic ? 'public' : 'private'} message from peer: `], data);

    dispatchEvent(onIncomingMessage({
      room: roomState.room,
      message: {
        content: data,
        isPrivate: !isPublic,
        targetPeerId: !isPublic ? target : null,
        isDataChannel: false,
        senderPeerId: mid,
      },
      isSelf: false,
      peerId: mid,
      peerInfo: PeerData.getPeerInfo(mid, roomState),
    }));
  };

  /**
   * Function that handles the "inRoom" socket message received.
   * @param {JSON} message
   * @memberof SignalingMessageHandler
   * @fires peerJoined
   * @fires handshakeProgress
   * @fires onIncomingStream
   */
  const inRoomHandler = (message) => {
    const {
      pc_config: { iceServers },
      sid,
      rid,
      tieBreaker,
    } = message;
    const roomState = Skylink.getSkylinkState(rid);
    const initOptions = Skylink.getInitOptions();
    const { priorityWeightScheme } = initOptions;
    const signaling = new SkylinkSignalingServer();
    let weightAppendValue = 0;

    roomState.room.connection.peerConfig = IceConnection.setIceServers(iceServers);
    roomState.room.inRoom = true;

    if (priorityWeightScheme === PRIORITY_WEIGHT_SCHEME.AUTO) {
      weightAppendValue = 0;
    } else if (priorityWeightScheme === PRIORITY_WEIGHT_SCHEME.ENFORCE_OFFERER) {
      weightAppendValue = 2e+15;
    } else {
      weightAppendValue = -(2e+15);
    }

    roomState.peerPriorityWeight = tieBreaker + weightAppendValue;
    roomState.user.sid = sid;
    roomState.inRoom = true;

    PeerMedia.updatePeerMediaWithUserSid(roomState.room, sid);

    dispatchEvent(peerJoined({
      peerId: roomState.user.sid,
      peerInfo: PeerData.getCurrentSessionInfo(roomState.room),
      isSelf: true,
      room: roomState.room,
    }));

    dispatchEvent(handshakeProgress({
      peerId: roomState.user.sid,
      state: HANDSHAKE_PROGRESS$1.ENTER,
      error: null,
      room: roomState.room,
    }));

    if (roomState.streams.userMedia) {
      const streamIds = Object.keys(roomState.streams.userMedia);
      streamIds.forEach((streamId) => {
        const mediaStream = roomState.streams.userMedia[streamId].stream;
        dispatchEvent(onIncomingStream({
          stream: mediaStream,
          streamId: mediaStream.id,
          peerId: roomState.user.sid,
          room: roomState.room,
          isSelf: true,
          peerInfo: PeerData.getCurrentSessionInfo(roomState.room),
          isVideo: hasVideoTrack(mediaStream),
          isAudio: hasAudioTrack(mediaStream),
        }));
      });
    }

    // if (roomState.streams.screenshare && roomState.streams.screenshare.stream) {
    //   streamId = roomState.streams.screenshare.stream.id || roomState.streams.screenshare.stream.label;
    //   dispatchEvent(onIncomingStream({
    //     stream: roomState.streams.screenshare.stream,
    //     streamId,
    //     peerId: roomState.user.sid,
    //     room: roomState.room,
    //     isScreensharing: true,
    //     isSelf: true,
    //     peerInfo: PeerData.getCurrentSessionInfo(roomState.room),
    //   }));
    // } else if (roomState.streams.userMedia && roomState.streams.userMedia.stream) {
    //   streamId = roomState.streams.userMedia.stream.id || roomState.streams.userMedia.stream.label;
    //   dispatchEvent(onIncomingStream({
    //     stream: roomState.streams.userMedia.stream,
    //     streamId,
    //     peerId: roomState.user.sid,
    //     room: roomState.room,
    //     isScreensharing: false,
    //     isSelf: true,
    //     peerInfo: PeerData.getCurrentSessionInfo(roomState.room),
    //   }));
    // }

    Skylink.setSkylinkState(roomState, rid);
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
      enableIceTrickle,
      enableIceRestart,
      enableDataChannel,
      weight,
      receiveOnly,
      publishOnly,
      agent,
      os,
      temasysPluginVersion,
      SMProtocolVersion,
      DTProtocolVersion,
      version,
      parentId,
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
    parsedMsg.receiveOnly = receiveOnly && receiveOnly !== false;
    parsedMsg.enableDataChannel = isABoolean(enableDataChannel) ? enableDataChannel : true;
    parsedMsg.enableIceRestart = isABoolean(enableIceRestart) ? enableIceRestart : false;
    parsedMsg.enableIceTrickle = isABoolean(enableIceTrickle) ? enableIceTrickle : true;
    parsedMsg.os = os && isAString(os) ? os : null;
    parsedMsg.temasysPluginVersion = temasysPluginVersion && isAString(temasysPluginVersion) ? temasysPluginVersion : null;
    parsedMsg.publishOnly = !!publishOnly;
    parsedMsg.parentId = !!publishOnly && parentId && isAString(parentId) ? parentId : null;
    parsedMsg.userInfo = parsers$1.parseUserInfo(state, msg, parsedMsg);

    if (hasMCU) {
      parsedMsg.peersInRoom = msg.peersInRoom;
    }

    return clone_1(parsedMsg);
  };

  const parseUserInfo = (state, msg, parsedMsg) => {
    const info = Object.assign({}, msg.userInfo);

    info.config = info.config ? info.config : {
      enableDataChannel: parsedMsg.enableDataChannel,
      enableIceTrickle: parsedMsg.enableIceTrickle,
      enableIceRestart: parsedMsg.enableIceRestart,
      priorityWeight: parsedMsg.weight,
      receiveOnly: parsedMsg.receiveOnly,
      publishOnly: parsedMsg.publishOnly,
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

  const parsers$1 = {
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
   * @memberof SignalingMessageHandler
   * @fires serverPeerJoined
   * @fires peerJoined
   * @fires handshakeProgress
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
        receiveOnly: message.receiveOnly,
        hasScreenshare,
      });

      if (targetMid === PEER_TYPE.MCU) {
        logger.log.INFO([targetMid, 'RTCPeerConnection', null, 'MCU feature has been enabled']);
        state.hasMCU = true;
        dispatchEvent(serverPeerJoined({
          peerId: targetMid,
          serverPeerType: SERVER_PEER_TYPE.MCU,
          room: currentRoom,
        }));
      } else {
        dispatchEvent(peerJoined({
          peerId: targetMid,
          peerInfo: PeerData.getPeerInfo(targetMid, state),
          isSelf: false,
          room: currentRoom,
        }));
      }

      let eventState = HANDSHAKE_PROGRESS$1.ENTER;
      if (caller === CALLERS.WELCOME) {
        eventState = HANDSHAKE_PROGRESS$1.WELCOME;
      }
      dispatchEvent(handshakeProgress({
        peerId: targetMid,
        state: eventState,
        error: null,
        room: currentRoom,
      }));
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
          const parsedMsg = parsers$1.enterAndWelcome(message.peersInRoom[peersInRoomIndex]);
          const peerUserInfo = parsedMsg.userInfo;
          setPeerInformations(state, PEER_ID, peerUserInfo);
          dispatchEvent(peerJoined({
            peerId: PEER_ID,
            peerInfo: PeerData.getPeerInfo(PEER_ID, state),
            isSelf: false,
            room: currentRoom,
          }));
        }
      }
    } else if (hasMCU && targetMid !== state.user.sid && targetMid !== PEER_TYPE.MCU) {
      setPeerInformations(state, targetMid, userInfo);
      dispatchEvent(peerJoined({
        peerId: targetMid,
        peerInfo: PeerData.getPeerInfo(targetMid, state),
        isSelf: false,
        room: currentRoom,
      }));
    }

    Skylink.setSkylinkState(state, currentRoom.id);

    if (isNewPeer) {
      dispatchEvent(handshakeProgress({
        peerId: targetMid,
        state: HANDSHAKE_PROGRESS$1.WELCOME,
        error: null,
        room: currentRoom,
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
          logger.log.WARN([params.targetMid, 'RTCPeerConnection', null, 'Discarding extra "welcome" received.']);
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
    const { STATS_MODULE, NEGOTIATION_PROGRESS } = MESSAGES;
    const signaling = new SkylinkSignalingServer();
    const method = getNextNegotiationStep(params);

    if (method === 'offer') {
    // Added checks to ensure that connection object is defined first
      if (!peerConnections[targetMid]) {
        logger.log.WARN([targetMid, 'RTCSessionDescription', 'offer', NEGOTIATION_PROGRESS.ERRORS.no_peer_connection]);
        handleNegotationStats.send(currentRoom.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS.OFFER.dropped, targetMid, message, false, NEGOTIATION_PROGRESS.ERRORS.no_peer_connection);
        return null;
      }

      const { signalingState } = peerConnections[targetMid];

      // Added checks to ensure that state is "stable" if setting local "offer"
      if (signalingState !== PEER_CONNECTION_STATE$1.STABLE) {
        logger.log.WARN([targetMid, 'RTCSessionDescription', 'offer', NEGOTIATION_PROGRESS.ERRORS.not_stable], signalingState);
        handleNegotationStats.send(currentRoom.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS.OFFER.dropped, targetMid, message, false, NEGOTIATION_PROGRESS.ERRORS.not_stable);
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

    logger.log.INFO([targetMid, 'RTCPeerConnection', null, `Peer ${callerState} received ->`], message);
    handleNegotationStats.send(room.id, callerState, targetMid, message, true);
  };

  /**
   * Function that parses the enterAndWelcome and welcome message and sends the offer or welcome message.
   * @param {JSON} message
   * @param {string} caller
   * @memberOf SignalingMessageHandler
   */
  const parseAndSendWelcome = (message, caller) => {
    const parsedMsg = parsers$1.enterAndWelcome(message);
    const {
      rid, mid, userInfo, publisherId,
    } = parsedMsg;
    const state = Skylink.getSkylinkState(rid);
    const { hasMCU } = state;
    const targetMid = hasMCU && publisherId ? publisherId : mid;
    const { RTCPeerConnection } = window;

    logStats(caller, targetMid, state, parsedMsg);

    let callerState = 'enter';
    if (caller === CALLERS.WELCOME) {
      callerState = 'welcome';
    }
    if (targetMid !== PEER_TYPE.MCU && hasMCU && state.publishOnly) {
      logger.log.WARN([targetMid, 'RTCPeerConnection', null, `Discarding ${callerState} for publishOnly case -> `], message);
      return;
    }

    const peerParams = {
      currentRoom: state.room,
      targetMid,
      userInfo,
      message: parsedMsg,
      caller,
    };

    if (state.peerConnectionConfig.certificate !== PEER_CERTIFICATE.AUTO && typeof RTCPeerConnection.generateCertificate === 'function') {
      let certOptions = {};
      if (state.peerConnectionConfig.certificate === PEER_CERTIFICATE.ECDSA) {
        certOptions = {
          name: 'ECDSA',
          namedCurve: 'P-256',
        };
      } else {
        certOptions = {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        };
      }
      RTCPeerConnection.generateCertificate(certOptions).then((cert) => {
        peerParams.cert = cert;
        processPeer(peerParams);
        checkStampBeforeSendingWelcome(peerParams);
      });
    } else {
      processPeer(peerParams);
      checkStampBeforeSendingWelcome(peerParams);
    }
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

    dispatchEvent(handshakeProgress({
      state: HANDSHAKE_PROGRESS$1[msgType],
      peerId: targetMid,
      room,
    }));

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
    const { room } = state;
    const { STATS_MODULE: { HANDLE_NEGOTIATION_STATS } } = MESSAGES;
    const msgType = description.type === 'offer' ? 'OFFER' : 'ANSWER';

    handleNegotationStats.send(room.id, HANDLE_NEGOTIATION_STATS[msgType].set_error, targetMid, description, isRemote, error);

    dispatchEvent(handshakeProgress({
      state: HANDSHAKE_PROGRESS$1.ERROR,
      peerId: targetMid,
      error,
      room,
    }));
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
    const { peerConnections, user } = state;
    const peerConnection = peerConnections[targetMid] = RTCPeerConnection;

    logger.log.DEBUG([targetMid, 'RTCSessionDescription', localDescription.type, 'SUCCESS: Local session description has been set ->'], localDescription);

    peerConnection.processingLocalSDP = false;
    handleSetOfferAndAnswerSuccess(state, targetMid, localDescription, false);

    // FIXME: to check if this apply to local offer only or local answer as well?
    // if (!initOptions.enableIceTrickle && !peerConnection.gathered) {
    //   logger.log.WARN([targetMid, 'RTCSessionDescription', sessionDescription.type, 'Local session description sending is halted to complete ICE gathering.']);
    //   return;
    // }
  };

  const onLocalDescriptionSetFailure = (room, targetMid, localDescription, error) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const peerConnection = peerConnections[targetMid];

    logger.log.ERROR([targetMid, 'RTCSessionDescription', localDescription.type, 'FAILED: Set local description -> '], error);

    peerConnection.processingLocalSDP = false;
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

    logger.log.INFO([targetMid, 'RTCSessionDescription', type, 'Session description object created:'], remoteDescription);

    handleNegotationStats.send(room.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS[msgType][type], targetMid, remoteDescription, true);

    return peerConnection.setRemoteDescription(remoteDescription)
      .then(() => peerConnection);
  };

  const onRemoteDescriptionSetSuccess = (RTCPeerConnection, room, targetMid, remoteDescription) => {
    const signaling = new SkylinkSignalingServer();
    const { type } = remoteDescription;

    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const peerConnection = peerConnections[targetMid] = RTCPeerConnection;

    logger.log.DEBUG([targetMid, 'RTCSessionDescription', type, 'SUCCESS: Remote session description has been set ->'], remoteDescription);

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
      logger.log.WARN([targetMid, 'RTCPeerConnection', null, 'Closing all datachannels as they were rejected.']);
      PeerConnection.closeDataChannel(state, targetMid);
    }

    handleSetOfferAndAnswerSuccess(state, targetMid, remoteDescription, true);
    signaling.answerAck(state, targetMid, true);
    return true;
  };

  const onRemoteDescriptionSetFailure = (room, targetMid, remoteDescription, error) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerConnections } = state;
    const peerConnection = peerConnections[targetMid];
    const { type } = remoteDescription;

    logger.log.ERROR([targetMid, 'RTCSessionDescription', type, 'FAILED: Set remote description -> '], {
      error,
      state: peerConnection.signalingState,
      [type]: remoteDescription,
    });

    peerConnection.processingRemoteSDP = false;
    handleSetOfferAndAnswerFailure(state, targetMid, remoteDescription, true, error);

    if (type === 'answer') {
      const signaling = new SkylinkSignalingServer();
      signaling.answerAck(state, targetMid, false);
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
      // updatedState.peerInformations[targetMid].midSourceMap = updatedUserInfo.midSourceMap;
    }

    Skylink.setSkylinkState(updatedState, rid);
  };

  const hasError = (state, message) => {
    const {
      weight, type, mid, sdp, resend,
    } = message;
    const {
      peerPriorityWeight, bufferedLocalOffer, room, processingRemoteSDP, peerConnections,
    } = state;
    const targetMid = mid;
    const { STATS_MODULE, NEGOTIATION_PROGRESS } = MESSAGES;
    const msgType = type === 'offer' ? 'OFFER' : 'ANSWER';
    let error = null;

    if (!peerConnections[targetMid]) {
      logger.log.ERROR([targetMid, null, type, `${NEGOTIATION_PROGRESS.ERRORS.no_peer_connection}. Unable to set${type === 'offer' ? 'Remote' : 'Local'}Offer.`]);
      error = NEGOTIATION_PROGRESS.ERRORS.no_peer_connection;
    }

    if (type === 'offer' && peerConnections[targetMid].signalingState !== PEER_CONNECTION_STATE$1.STABLE) {
      logger.log.WARN([targetMid, null, type, NEGOTIATION_PROGRESS.ERRORS.not_stable], {
        signalingState: peerConnections[targetMid].signalingState,
        isRestart: !!resend,
      });
      error = `Peer connection state is ${peerConnections[targetMid].signalingState}.`;
    }

    if (processingRemoteSDP) {
      logger.log.WARN([targetMid, 'RTCSessionDescription', type, NEGOTIATION_PROGRESS.ERRORS.processing_existing_sdp], sdp);
      error = NEGOTIATION_PROGRESS.ERRORS.processing_existing_sdp;
    }

    if (type === 'offer' && bufferedLocalOffer[targetMid] && peerPriorityWeight > weight) {
      logger.log.WARN([targetMid, null, type, NEGOTIATION_PROGRESS.ERRORS.offer_tiebreaker], {
        selfWeight: peerPriorityWeight,
        messageWeight: weight,
      });
      error = NEGOTIATION_PROGRESS.ERRORS.offer_tiebreaker;
    }

    if (error) {
      handleNegotationStats.send(room.id, STATS_MODULE.HANDLE_NEGOTIATION_STATS[msgType].dropped, targetMid, message, true, error);
    }

    return !!error;
  };

  /**
   * Function that parses and sets the remote description for offer and answer.
   * @param {JSON} message
   * @return {null}
   * @memberOf SignalingMessageHandler
   * @fires handshakeProgress
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

    if (!hasError(state, message)) {
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
          logger.log.ERROR([targetMid, 'RTCPeerConnection', null, NEGOTIATION_PROGRESS.ERRORS.no_local_buffered_offer]);
        }
      } catch (error) {
        logger.log.ERROR([targetMid, 'RTCSessionDescription', type, `Failed processing ${msgType} ->`], error);
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
      const pcSenders = peerConnection.getSenders();
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
            if (report && report.ssrc) {
              transmittingSenders[report.ssrc] = pcSenders[senderIndex];
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

  /**
   * Method that handles the "answerAck" socket message received.
   * See confluence docs for the "answerAck" expected properties to be received
   *   based on the current <code>SM_PROTOCOL_VERSION</code>.
   * @memberof SignalingMessageHandler
   * @private
   * @since 1.0.0
   */
  const answerAckHandler = (message) => {
    const { mid, rid } = message;
    const state = Skylink.getSkylinkState(rid);
    renegotiateIfNeeded(state, mid).then((shouldRenegotiate) => {
      if (shouldRenegotiate) {
        refreshConnection(state, mid)
          .catch(error => console.log(error));
      }
    });
  };

  const welcomeHandler = (message) => {
    parseAndSendWelcome(message, CALLERS.WELCOME);
  };

  const handleIceCandidateStats$1 = new HandleIceCandidateStats();

  /**
   * Function that handles the "candidate" socket message received.
   * @param {JSON} message
   * @memberof SignalingMessageHandler
   * @returns {null}
   * @fires candidateProcessingState
   */
  const candidateHandler = (message) => {
    const { candidate, mid, rid } = message;
    const state = Skylink.getSkylinkState(rid);
    const { room } = state;
    const initOptions = Skylink.getInitOptions();
    const peerConnection = state.peerConnections[mid];
    const peerEndOfCandidatesCounter = state.peerEndOfCandidatesCounter[mid] || {};
    const { RTCIceCandidate } = window;
    const { ICE_CANDIDATE: { CANDIDATE_HANDLER } } = MESSAGES;
    const { STATS_MODULE: { HANDLE_ICE_GATHERING_STATS } } = MESSAGES;

    if (!candidate && !message.id) {
      logger.log.WARN([mid, CANDIDATE_HANDLER.tag, null, CANDIDATE_HANDLER.invalid_candidate_message], message);
      return null;
    }

    const candidateId = `can-${(new Date()).getTime()}`;
    const candidateType = message.candidate.split(' ')[7] || '';
    const nativeCandidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate,
      sdpMid: message.id,
    });

    logger.log.DEBUG([mid, CANDIDATE_HANDLER.tag, `${candidateId}:${candidateType}`, CANDIDATE_HANDLER.valid_candidate_message], nativeCandidate);

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
      logger.log.WARN([mid, CANDIDATE_HANDLER.tag, `${candidateId}:${candidateType}`, CANDIDATE_HANDLER.no_peer_connection]);

      candidateProcessingStateEventDetail.error = new Error(CANDIDATE_HANDLER.no_peer_connection_event_log);
      handleIceCandidateStats$1.send(room.id, HANDLE_ICE_GATHERING_STATS.process_failed, mid, candidateId, candidate, candidateProcessingStateEventDetail.error);
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

    if (initOptions.filterCandidatesType[candidateType]) {
      if (!(state.hasMCU && initOptions.forceTURN)) {
        logger.log.WARN([mid, CANDIDATE_HANDLER.tag, `${candidateId}:${candidateType}`, CANDIDATE_HANDLER.matched_filtering_flag], nativeCandidate);

        candidateProcessingStateEventDetail.error = new Error(CANDIDATE_HANDLER.matched_filtering_flag_event_log);
        handleIceCandidateStats$1.send(room.id, HANDLE_ICE_GATHERING_STATS.dropped, mid, candidateId, candidate, candidateProcessingStateEventDetail.error);
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

      logger.log.WARN([mid, CANDIDATE_HANDLER.tag, `${candidateId}:${candidateType}`, CANDIDATE_HANDLER.filtering_flag_not_honored], nativeCandidate);
    }

    if (peerConnection.remoteDescription && peerConnection.remoteDescription.sdp && peerConnection.localDescription && peerConnection.localDescription.sdp) {
      IceConnection.addIceCandidate(mid, candidateId, candidateType, nativeCandidate, state);
    } else {
      IceConnection.addIceCandidateFromQueue(mid, room);
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
   * @memberof SignalingMessageHandler
   * @fires getPeersStateChange
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
        room_id: null,
        user_id: null,
        client_id: null,
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
      this.model.appKey = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();

      this.postStats(this.endpoints.session, this.model);
    }
  }

  /**
   * Function that handles the "introduceError" socket message received.
   * @param {JSON} message
   * @memberof SignalingMessageHandler
   * @fires introduceStateChange
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
   * @param {string} peerId
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
   * Sets to true signalingStateClosed and dispatches peer connection state closed.
   * @param {SkylinkState} roomState
   * @param {string} peerId
   * @private
   */
  const processPeerConnectionState = (roomState, peerId) => {
    const state = roomState;

    if (state.peerConnections[peerId].signalingStateClosed) return;

    state.peerConnections[peerId].signalingStateClosed = true;

    dispatchEvent(peerConnectionState({
      peerId,
      state: PEER_CONNECTION_STATE$1.CLOSED,
    }));
  };

  /**
   * Sets to true iceConnectionStateClosed and dispatches ICE connection state closed.
   * @param {SkylinkState} roomState
   * @param {string} peerId
   * @private
   */
  const processIceConnectionState = (roomState, peerId) => {
    const state = roomState;

    if (state.peerConnections[peerId].iceConnectionStateClosed) return;

    state.peerConnections[peerId].iceConnectionStateClosed = true;

    new HandleIceConnectionStats().send(state.room.id, peerId, roomState);

    dispatchEvent(iceConnectionState({
      peerId,
      state: ICE_CONNECTION_STATE$1.CLOSED,
    }));
  };

  /**
   * Closes a peer connection for a particular peerId.
   * @param {string} roomKey
   * @param {string} peerId
   * @private
   */
  const closePeerConnection$1 = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);
    if (roomState.peerConnections[peerId].signalingState === PEER_CONNECTION_STATE$1.CLOSED) return;

    roomState.peerConnections[peerId].close();

    // Polyfill for safari 11 "closed" event not triggered for "iceConnectionState" and "signalingState".
    if (isAgent(BROWSER_AGENT.SAFARI) && isVersion(11)) {
      processPeerConnectionState(roomState, peerId);
      processIceConnectionState(roomState, peerId);
    }
  };

  /**
   * Clears peer information in SkylinkState.
   * @param {string} roomKey
   * @param {string} peerId
   * @private
   */
  const clearPeerInfo = (roomKey, peerId) => {
    const updatedState = Skylink.getSkylinkState(roomKey);

    // Otherwise stats module fails.
    setTimeout(() => {
      delete updatedState.peerConnections[peerId];
      Skylink.setSkylinkState(updatedState, updatedState.room.id);
      logger.log.INFO([peerId, TAGS.PEER_CONNECTION, null, MESSAGES.ROOM.LEAVE_ROOM.PEER_LEFT.SUCCESS]);
    }, 500);

    delete updatedState.peerInformations[peerId];
    delete updatedState.peerMedias[peerId];
    delete updatedState.remoteStreams[peerId];
    delete updatedState.peerMessagesStamps[peerId];
    delete updatedState.peerEndOfCandidatesCounter[peerId];
    delete updatedState.peerCandidatesQueue[peerId];
    delete updatedState.sdpSessions[peerId];
    delete updatedState.peerStats[peerId];
    delete updatedState.peerBandwidth[peerId];
    delete updatedState.gatheredCandidates[peerId];
    delete updatedState.peerCustomConfigs[peerId];
    delete updatedState.peerConnStatus[peerId];
  };

  /**
   * Check if health timer exists.
   * @param {string} roomKey
   * @param {string} peerId
   * @private
   */
  const checksIfHealthTimerExists = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);
    if (!roomState.peerConnections[peerId]) return;

    closePeerConnection$1(roomKey, peerId);
  };

  /**
   * Triggers peerLeft event and changes state for serverPeerLeft.
   * @param {string} roomKey
   * @param {string} peerId
   * @private
   */
  const triggerPeerLeftEventAndChangeState = (roomKey, peerId) => {
    const roomState = Skylink.getSkylinkState(roomKey);

    if (!isPeerConnected(roomState, peerId)) return;

    const peerInfo = PeerData.getPeerInfo(peerId, roomState);
    const { room } = roomState;

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
   * @param {string} roomKey
   * @param {string} peerId
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
   * @param {string} message.rid - The room key.
   * @param {SkylinkUser} message.mid - The source peerId.
   * @param {string} message.streamId - The media stream Id.
   * @param {string} message.status - The stream status.
   * @param {Object} message.settings
   * @param {string} message.settings.screenshareId - Id of the screenshare stream.
   * @memberof SignalingMessageHandler
   */
  const streamHandler = (message) => {
    const {
      mid, rid, status, streamId, settings,
    } = message;
    const roomState = getStateByRid(rid);
    const { room, peerInformations } = roomState;

    if (status === STREAM_STATUS.SCREENSHARE_REPLACE_START) {
      peerInformations[mid].screenshare = true;
      Skylink.setSkylinkState(roomState, room.id);

      dispatchEvent(onIncomingScreenStream({
        room,
        peerId: mid,
        isSelf: false,
        peerInfo: PeerData.getPeerInfo(mid, roomState),
        stream: null,
        isReplace: true,
        streamId,
        isVideo: !!settings.audio,
        isAudio: !!settings.video,
      }));
    }

    if (status === STREAM_STATUS.USER_MEDIA_REPLACE_START) {
      dispatchEvent(onIncomingStream({
        room,
        peerId: mid,
        isSelf: false,
        peerInfo: PeerData.getPeerInfo(mid, roomState),
        stream: null,
        streamId,
        isReplace: true,
        replacedStreamId: settings.replacedStreamId,
        isVideo: !!settings.audio,
        isAudio: !!settings.video,
      }));
    }

    if (status === STREAM_STATUS.ENDED) {
      if (settings.isScreensharing) {
        peerInformations[mid].screenshare = false;
        Skylink.setSkylinkState(roomState, room.id);
      }

      dispatchEvent(streamEnded({
        room,
        peerId: mid,
        peerInfo: PeerData.getPeerInfo(mid, roomState),
        streamId,
        isSelf: false,
        isScreensharing: settings.isScreensharing,
        options: settings,
        isVideo: !!settings.audio,
        isAudio: !!settings.video,
      }));
    }

    // Handle stopped streams that are not present in sdp and therefore do not require renegotiation and therefore do not trigger onremovetrack
    if (status === STREAM_STATUS.REPLACED_STREAM_ENDED) {
      const remoteStreams = MediaStream.retrieveRemoteStreams(roomState, mid);

      if (!remoteStreams) {
        return null;
      }

      const remoteStreamsObj = Object.values(remoteStreams);
      let stoppedStream = null;

      for (let i = 0; i < remoteStreamsObj.length; i += 1) {
        if (remoteStreams[i].id === streamId) {
          stoppedStream = remoteStreamsObj[i];
          break;
        }
      }

      if (!stoppedStream) {
        return null;
      }

      const tracks = stoppedStream.getTracks();
      tracks.forEach((track) => {
        callbacks.onremovetrack(mid, room, streamId, track, false);
      });
    }

    return null;
  };

  class HandleRecordingStats extends SkylinkStats {
    constructor() {
      super();
      this.model = {
        room_id: null,
        user_id: null,
        client_id: null,
        state: null,
        recording_id: null,
        recordings: null,
        error: null,
      };
    }

    send(roomKey, state, recordingId, recordings, error) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.room_id = roomKey;
      this.model.user_id = (roomState && roomState.user && roomState.user.sid) || null;
      this.model.client_id = roomState.clientId;
      this.model.state = state;
      this.model.recording_id = recordingId;
      this.model.recordings = recordings;
      this.model.appKey = Skylink.getInitOptions().appKey;
      this.model.timestamp = (new Date()).toISOString();
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
   * @fires peerUpdated
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

    logger.log.INFO([targetMid, null, type, `${PEER_INFORMATIONS.UPDATE_USER_DATA}`], userData);

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

    peerInformations[targetMid].userData = userData || {};

    dispatchEvent(peerUpdated({
      peerId: targetMid,
      peerInfo: PeerData.getPeerInfo(targetMid, state),
      isSelf: false,
    }));
  };

  const dispatchMediaStateChangeEvents = (state, streamId, peerId) => {
    const peerInfo = PeerData.getPeerInfo(peerId, state);

    dispatchEvent(streamMuted({
      isSelf: false,
      peerId,
      peerInfo,
      streamId,
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
      type, rid, mediaId, mediaState, transceiverMid,
    } = message;
    const updatedState = Skylink.getSkylinkState(rid);
    const { room } = updatedState;
    const streamId = PeerMedia.retrieveStreamId(room, targetMid, mediaId, transceiverMid);
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

    mediaInfoEventHelpers.dispatchMediaStateChangeEvents(updatedState, streamId, targetMid);
  };

  const videoStateChangeHandler = (targetMid, message) => {
    const {
      type, rid, mediaId, mediaState, transceiverMid,
    } = message;
    const updatedState = Skylink.getSkylinkState(rid);
    const { room } = updatedState;
    const streamId = PeerMedia.retrieveStreamId(room, targetMid, mediaId, transceiverMid);
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

    mediaInfoEventHelpers.dispatchMediaStateChangeEvents(updatedState, streamId, targetMid);
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
        case MEDIA_TYPE.VIDEO: videoStateChangeHandler(targetMid, message); break;
        case MEDIA_TYPE.AUDIO_MIC:
        case MEDIA_TYPE.AUDIO: audioStateChangeHandler(targetMid, message); break;
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

  const shouldDropMessage = (state, peerId) => {
    const peerInfo = PeerData.getPeerInfo(peerId, state);

    if (peerInfo.agent.SDKVersion && peerInfo.agent.SDKVersion === SDK_VERSION) {
      logger.log.INFO([peerId, TAGS.SIG_SERVER, null, MESSAGES.SIGNALING.DROPPING_MUTE_EVENT]);
      return true;
    }

    return false;
  };

  const muteEventHelpers = {
    dispatchMuteEvents: dispatchMediaStateChangeEvents,
    shouldDropMessage,
  };

  const muteVideoEventHandler = (message) => {
    const {
      type, mid, muted, rid, stamp, streamId,
    } = message;
    const targetMid = mid;
    const updatedState = Skylink.getSkylinkState(rid);
    const { room } = updatedState;

    if (muteEventHelpers.shouldDropMessage(updatedState, targetMid)) {
      return;
    }

    logger.log.INFO([targetMid, null, type, MESSAGES.MEDIA_STREAM.VIDEO_MUTED, muted, streamId], message);

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
    updatedState.peerInformations[targetMid].mediaStatus[streamId].videoMuted = muted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE;

    Skylink.setSkylinkState(updatedState, room.id);

    muteEventHelpers.dispatchMuteEvents(updatedState, streamId, targetMid);
  };

  const muteAudioEventHandler = (message) => {
    const {
      type, mid, rid, muted, stamp, streamId,
    } = message;
    const targetMid = mid;
    const updatedState = Skylink.getSkylinkState(rid);
    const { room } = updatedState;

    if (muteEventHelpers.shouldDropMessage(updatedState, targetMid)) {
      return;
    }

    logger.log.INFO([targetMid, TAGS.SIG_SERVER, type, MESSAGES.MEDIA_STREAM.AUDIO_MUTED, muted, streamId], message);

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
    updatedState.peerInformations[targetMid].mediaStatus[streamId].audioMuted = muted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE;
    Skylink.setSkylinkState(updatedState, room.id);

    muteEventHelpers.dispatchMuteEvents(updatedState, streamId, targetMid);
  };

  const handlers = {
    peerMessageFromSignaling: peerMessageFromSignalingHandler,
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
    muteVideoEvent: muteVideoEventHandler,
    muteAudioEvent: muteAudioEventHandler,
    setUserData: setUserDataHandler,
    mediaInfoEvent: mediaInfoEventHandler,
  };

  /* eslint-disable class-methods-use-this */

  /**
   * @class
   * @classdesc Class representing a SignalingMessageHandler instance.
   * @namespace SignalingMessageHandler
   * @private
   */
  class SignalingMessageHandler {
    peerMessageFromSignaling(...args) {
      handlers.peerMessageFromSignaling(...args);
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

    muteAudioEventHandler(...args) {
      handlers.muteAudioEvent(...args);
    }

    muteVideoEventHandler(...args) {
      handlers.muteVideoEvent(...args);
    }
  }

  const getJoinRoomMessage = (roomState) => {
    const { room } = roomState;
    const state = Skylink.getSkylinkState(room.id);
    const initOptions = Skylink.getInitOptions();
    return {
      type: SIG_MESSAGE_TYPE.JOIN_ROOM,
      uid: state.user.uid,
      cid: state.key,
      rid: room.id,
      userCred: state.user.token,
      timeStamp: state.user.timeStamp,
      apiOwner: state.appKeyOwner,
      roomCred: room.token,
      start: room.startDateTime,
      len: room.duration,
      isPrivileged: state.isPrivileged,
      autoIntroduce: state.autoIntroduce,
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
    const { enableIceTrickle, enableDataChannel } = initOptions;
    const { AdapterJS } = window;
    const userInfo = PeerData.getUserInfo(room);
    const enterMsg = {
      type: SIG_MESSAGE_TYPE.ENTER,
      mid: user.sid,
      rid: room.id,
      agent: AdapterJS.webrtcDetectedBrowser,
      version: (AdapterJS.webrtcDetectedVersion || 0).toString(),
      os: window.navigator.platform,
      userInfo,
      receiveOnly: PeerData.getCurrentSessionInfo(room).config.receiveOnly,
      weight: peerPriorityWeight,
      temasysPluginVersion: AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null,
      enableIceTrickle,
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
    const { enableIceTrickle, enableDataChannel } = initOptions;
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
      receiveOnly: PeerData.getCurrentSessionInfo(room).config.receiveOnly,
      weight: peerPriorityWeight,
      temasysPluginVersion: AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null,
      enableIceTrickle,
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
   * @memberof SignalingMessageBuilder
   * @private
   */
  const setUserDataMessage = roomState => ({
    type: SIG_MESSAGE_TYPE.UPDATE_USER,
    mid: roomState.user.sid,
    rid: roomState.room.id,
    userData: roomState.userData,
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
   * @memberof SignalingMessageBuilder
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
      receiveOnly: PeerData.getCurrentSessionInfo(room).config.receiveOnly,
      publishOnly: PeerData.getCurrentSessionInfo(room).config.publishOnly,
      enableIceTrickle: initOptions.enableIceTrickle,
      enableDataChannel: initOptions.enableDataChannel,
      enableIceRestart,
      doIceRestart: doIceRestart === true && enableIceRestart && peerInformations[peerId]
        && peerInformations[peerId].config.enableIceRestart,
      isRestartResend: false,
      temasysPluginVersion: AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null,
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
   * @memberof SignalingMessageBuilder
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

  const enumeratePeersAndGetMessages = (listOfPeers, message, isPrivate, peerInformations, roomState, targetPeerId) => {
    const signalingReadyMessages = [];
    const { key, user, room } = roomState;

    for (let i = 0; i < listOfPeers.length; i += 1) {
      const peerId = listOfPeers[i];

      if (!peerInformations[peerId]) {
        logger.log.ERROR([peerId, 'Socket', null, 'Dropping of sending message to Peer as Peer session does not exists']);
        listOfPeers.splice(i, 1);
        i -= 1;
      } else if (peerId === PEER_TYPE.MCU) {
        listOfPeers.splice(i, 1);
        i -= 1;
      } else if (isPrivate) {
        logger.log.DEBUG([peerId, 'Socket', null, 'Sending private message to Peer']);
        signalingReadyMessages.push({
          cid: key,
          data: message,
          mid: user.sid,
          rid: room.id,
          target: peerId,
          type: SIG_MESSAGE_TYPE.PRIVATE_MESSAGE,
        });
      }
    }

    if (listOfPeers.length === 0) {
      logger.log.WARN('Currently there are no Peers to send message to (unless the message is queued and there are Peer connected by then).');
    }

    if (!isPrivate) {
      logger.log.DEBUG([null, 'Socket', null, 'Broadcasting message to Peers']);
      signalingReadyMessages.push({
        cid: key,
        data: message,
        mid: user.sid,
        rid: room.id,
        type: SIG_MESSAGE_TYPE.PUBLIC_MESSAGE,
      });
    }
    dispatchEvent(onIncomingMessage({
      room,
      message: {
        targetPeerId: targetPeerId || null,
        content: message,
        senderPeerId: user.sid,
        isDataChannel: false,
        isPrivate,
        listOfPeers,
      },
      isSelf: true,
      peerId: user.id,
      peerInfo: PeerData.getCurrentSessionInfo(room),
    }));

    return signalingReadyMessages;
  };

  /**
   * Send a message to a peer or a list of peers via the Signaling Server
   * @param {SkylinkState} roomState
   * @param {String} message
   * @param {String|Array} targetPeerId
   * @private
   */
  const peerMessageViaSignaling = (roomState, message, targetPeerId) => {
    const {
      peerInformations,
      inRoom,
      user,
    } = roomState;
    let listOfPeers = Object.keys(peerInformations);
    let isPrivate = false;
    if (!inRoom || !user) {
      logger.log.ERROR(`${MESSAGES.ROOM.ERRORS.NOT_IN_ROOM} -> `, message);
      return null;
    }

    if (Array.isArray(targetPeerId)) {
      listOfPeers = targetPeerId;
      isPrivate = true;
    } else if (targetPeerId && typeof targetPeerId === 'string') {
      listOfPeers = [targetPeerId];
      isPrivate = true;
    }

    return enumeratePeersAndGetMessages(listOfPeers, message, isPrivate, peerInformations, roomState, targetPeerId);
  };

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
    const { user, room, roomLocked } = roomState;

    return {
      type: SIG_MESSAGE_TYPE.ROOM_LOCK,
      mid: user.sid,
      rid: room.id,
      lock: roomLocked,
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
    transceiverMid: mediaInfo.transceiverMid,
  });

  const muteAudioEventMessage = (room, streamId) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const { user, streamsMutedSettings } = roomState;

    return {
      type: SIG_MESSAGE_TYPE.MUTE_AUDIO_EVENT,
      mid: user.sid,
      rid: room.id,
      muted: streamsMutedSettings[streamId].audioMuted,
      stamp: (new Date()).getTime(),
      streamId,
    };
  };

  const muteVideoEventMessage = (room, streamId) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const { user, streamsMutedSettings } = roomState;

    return {
      type: SIG_MESSAGE_TYPE.MUTE_VIDEO_EVENT,
      mid: user.sid,
      rid: room.id,
      muted: streamsMutedSettings[streamId].videoMuted,
      stamp: (new Date()).getTime(),
      streamId,
    };
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
    signalingMessages: peerMessageViaSignaling,
    bye: byeMessage,
    roomLock: roomLockMessage,
    mediaInfoEvent: mediaInfoEventMessage,
    muteAudioEvent: muteAudioEventMessage,
    muteVideoEvent: muteVideoEventMessage,
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

    getMuteAudioMessage(...args) {
      return this.messageBuilders.muteAudioEvent(...args);
    }

    getMuteVideoMessage(...args) {
      return this.messageBuilders.muteVideoEvent(...args);
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
  }

  const SOCKET_TYPE$1 = {
    POLLING: 'Polling',
    WEBSOCKET: 'WebSocket',
    XHR_POLLING: 'xhr-polling',
    JSONP_POLLING: 'jsonp-polling',
  };

  let instance$2 = null;

  /**
   * @class
   * @classdesc Singleton class that represents a signaling server
   * @private
   */
  class SkylinkSignalingServer {
    constructor() {
      if (!instance$2) {
        instance$2 = this;
      }
      const { location: { protocol } } = window;
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
      this.config = this.resetSocketConfig(protocol);
      return instance$2;
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
     * @fires socketError
     * @return {Promise}
     */
    createSocket(roomKey) {
      const roomState = Skylink.getSkylinkState(roomKey);
      roomState.socketSession = this.config;
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
      const roomState = Skylink.getSkylinkState(roomKey);
      const { socketSession } = roomState;

      this.socket = createSocket$1({
        config: socketSession,
        roomKey,
      });

      setSocketCallbacks$1(roomKey, this, resolve, reject);
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

    /**
     *
     * @param args
     */
    answer(...args) {
      return this.messageBuilder.getAnswerMessage(...args).then((answer) => {
        this.sendMessage(answer);
        return answer;
      });
    }

    answerAck(...args) {
      const answerAck = this.messageBuilder.getAnswerAckMessage(...args);
      this.sendMessage(answerAck);
    }

    /**
     *
     * @param args
     */
    enterRoom(...args) {
      const enter = this.messageBuilder.getEnterRoomMessage(...args);
      this.sendMessage(enter);
    }

    joinRoom(...args) {
      const join = this.messageBuilder.getJoinRoomMessage(...args);
      this.sendMessage(join);
    }

    offer(...args) {
      this.messageBuilder.getOfferMessage(...args).then((offer) => {
        this.sendMessage(offer);
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

    muteAudioEvent(roomState, streamIds) {
      const muteAudio = this.messageBuilder.getMuteAudioMessage(roomState, streamIds);
      if (muteAudio) {
        this.sendMessage(muteAudio);
      }
    }

    muteVideoEvent(roomState, streamId) {
      const muteVideo = this.messageBuilder.getMuteVideoMessage(roomState, streamId);
      if (muteVideo) {
        this.sendMessage(muteVideo);
      }
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
      logger.log.INFO(['SIG SERVER', null, message.type, 'sent']);
      sendChannelMessage(this.socket, message);
    }

    sendUserMessage(...args) {
      const peerMessages = this.messageBuilder.getPeerMessagesForSignaling(...args);
      if (peerMessages !== null && Array.isArray(peerMessages) && peerMessages.length) {
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

  const sendMediaInfoMsg = (room, updatedMediaInfo) => {
    const signaling = new SkylinkSignalingServer();
    const state = Skylink.getSkylinkState(room.id);
    const { peerMedias, user, hasMCU } = state;
    const peerIds = hasMCU ? [PEER_TYPE.MCU] : Object.keys(peerMedias).filter(peerId => peerId !== user.sid);

    peerIds.forEach((target) => {
      signaling.mediaInfoEvent(state, target, updatedMediaInfo);
    });
  };

  const parseSDPForTransceiverMid = (room, peerId, sessionDescription) => {
    const state = Skylink.getSkylinkState(room.id);
    const { peerMedias } = state;
    const mediaInfos = Object.values(peerMedias[peerId]);
    const mediaMids = SessionDescription.getTransceiverMid(sessionDescription);
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

  const helpers$5 = {
    retrieveTransceiverMid,
    retrieveMediaState,
    retrieveMediaId,
    buildPeerMediaInfo,
    retrieveStreamIdOfTrack,
    retrieveTracks,
    updatePeerMediaInfo,
    sendMediaInfoMsg,
    parseSDPForTransceiverMid,
    retrieveValueGivenTransceiverMid,
    retrieveFormattedMediaInfo,
    resetPeerMedia,
    populatePeerMediaInfo,
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
     * @param {string} peerId
     * @param {string|null} mediaId
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

      dispatchEvent(mediaInfoDeleted({
        mediaInfo: clonedMediaInfo,
      }));
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
     * Method that updates the transceiver mid value of local media info after set local description.
     * @param room
     * @param peerId
     * @private
     */
    static updateTransceiverMid(room, peerId) {
      try {
        const tracks = helpers$5.retrieveTracks(room);
        tracks.forEach((track) => {
          const transceiverMid = helpers$5.retrieveTransceiverMid(room, track);
          const streamId = helpers$5.retrieveStreamIdOfTrack(room, track);
          const mediaId = helpers$5.retrieveMediaId(track.kind, streamId);
          helpers$5.updatePeerMediaInfo(room, peerId, false, mediaId, MEDIA_INFO.TRANSCEIVER_MID, transceiverMid);
        });
      } catch (err) {
        logger.log.ERROR([peerId, TAGS.PEER_MEDIA, null, MESSAGES.MEDIA_INFO.ERRORS.FAILED_UPDATING_TRANSCEIVER_MID], err);
      }
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
        const clonedPeerMedia = clone_1(state.peerMedias[targetMid]) || {};
        const updatedState = helpers$5.resetPeerMedia(room, targetMid);
        mediaInfoList.forEach((mediaInfo) => {
          updatedState.peerMedias[mediaInfo.publisherId] = helpers$5.populatePeerMediaInfo(updatedState, clonedPeerMedia, mediaInfo);
        });
        Skylink.setSkylinkState(updatedState, room.id);
      } catch (err) {
        logger.log.ERROR([targetMid, TAGS.PEER_MEDIA, null, MESSAGES.MEDIA_INFO.ERRORS.FAILED_SETTING_PEER_MEDIA_INFO]);
      }
    }

    /**
     * Method that returns the streamId from the peer media info.
     * @param room
     * @param peerId
     * @param mediaId
     * @param transceiverMid
     * @returns {string} streamId
     */
    static retrieveStreamId(room, peerId, mediaId, transceiverMid) {
      const state = Skylink.getSkylinkState(room.id);
      const { peerMedias } = state;
      const mediaInfo = peerMedias[peerId][mediaId];
      const streamId = mediaInfo.transceiverMid === transceiverMid ? mediaInfo.streamId : null;

      if (!streamId) {
        logger.log.ERROR([peerId, TAGS.PEER_MEDIA, null, MESSAGES.MEDIA_INFO.ERRORS.NO_ASSOCIATED_STREAM_ID]);
      }

      return streamId;
    }

    /**
     * Method that returns the mediaId
     * @param trackKind
     * @param streamId
     * @returns {string} mediaId
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
  }

  const isStreamInState = (state, stream) => {
    const { streams } = state;

    if (!streams.userMedia && !streams.screenshare) {
      return false;
    }

    const streamObjs = Object.values(streams.userMedia);
    if (streamObjs.some(streamObj => streamObj.id === stream.id)) {
      return true;
    }

    return streams.screenshare && streams.screenshare.id === stream.id;
  };

  /**
   * Function that processes the streams object in the state.
   * @param {MediaStream} stream - User MediaStream object
   * @param {GetUserMediaOptions} settings - Options used to get the peer-media stream
   * @param {SkylinkRoom.id} roomkey - Room's id
   * @param {boolean} [isScreensharing=false] isScreensharing
   * @param {boolean} [isAudioFallback=false] isAudioFallback
   * @memberOf MediaStreamHelpers
   * @fires mediaAccessSuccess
   * @private
   * */
  const processStreamInState = (stream = null, settings = {}, roomkey, isScreensharing = false, isAudioFallback = false) => {
    if (!stream) return;
    const updatedState = Skylink.getSkylinkState(roomkey);

    if (isStreamInState(updatedState, stream)) {
      return;
    }

    helpers$6.processNewStream(updatedState.room, stream, settings, isScreensharing);
    PeerMedia.processPeerMedia(updatedState.room, updatedState.user.sid, stream, isScreensharing);

    if (isAudioFallback) {
      logger.log.DEBUG([updatedState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.FALLBACK_SUCCESS]);
    }

    if (isScreensharing) {
      logger.log.DEBUG([updatedState.user.sid, TAGS.MEDIA_STREAM, null, MESSAGES.MEDIA_STREAM.START_SCREEN_SUCCESS]);
    }

    dispatchEvent(mediaAccessSuccess({
      stream,
      isScreensharing,
      isAudioFallback,
      streamId: stream.id,
    }));
  };

  /**
   * Parse the options provided to make sure they are compatible
   * @param {GetUserMediaOptions} options
   * @param {string|null} type - The type of stream i.e. audio or video
   * @memberOf MediaStreamHelpers
   * @private
   * @return {{settings: {audio: boolean, video: boolean}, mutedSettings: {shouldAudioMuted: boolean, shouldVideoMuted: boolean}, getUserMediaSettings: {audio: boolean, video: boolean}}}
   */
  const parseStreamSettings = (options, type = null) => {
    const { AdapterJS } = window;
    const settings = {
      settings: { audio: false, video: false },
      mutedSettings: { shouldAudioMuted: false, shouldVideoMuted: false },
      getUserMediaSettings: { audio: false, video: false },
    };

    if ((options.audio && !type) || (options.audio && type === TRACK_KIND.AUDIO)) {
      // For Edge to work since they do not support the advanced constraints yet
      settings.settings.audio = {
        stereo: false,
        exactConstraints: !!options.useExactConstraints,
        echoCancellation: true,
      };
      settings.getUserMediaSettings.audio = {
        echoCancellation: true,
      };

      if (typeof options.audio === 'object') {
        if (typeof options.audio.stereo === 'boolean') {
          settings.settings.audio.stereo = options.audio.stereo;
        }

        if (typeof options.audio.useinbandfec === 'boolean') {
          settings.settings.audio.useinbandfec = options.audio.useinbandfec;
        }

        if (typeof options.audio.usedtx === 'boolean') {
          settings.settings.audio.usedtx = options.audio.usedtx;
        }

        if (typeof options.audio.maxplaybackrate === 'number'
          && options.audio.maxplaybackrate >= 8000 && options.audio.maxplaybackrate <= 48000) {
          settings.settings.audio.maxplaybackrate = options.audio.maxplaybackrate;
        }

        if (typeof options.audio.mute === 'boolean') {
          settings.mutedSettings.shouldAudioMuted = options.audio.mute;
        }

        // Not supported in Edge browser features
        if (AdapterJS.webrtcDetectedBrowser !== 'edge') {
          if (typeof options.audio.echoCancellation === 'boolean') {
            settings.settings.audio.echoCancellation = options.audio.echoCancellation;
            settings.getUserMediaSettings.audio.echoCancellation = options.audio.echoCancellation;
          }

          if (Array.isArray(options.audio.optional)) {
            settings.settings.audio.optional = clone_1(options.audio.optional);
            settings.getUserMediaSettings.audio.optional = clone_1(options.audio.optional);
          }

          if (options.audio.deviceId && typeof options.audio.deviceId === 'string'
            && AdapterJS.webrtcDetectedBrowser !== 'firefox') {
            settings.settings.audio.deviceId = options.audio.deviceId;
            settings.getUserMediaSettings.audio.deviceId = options.useExactConstraints
              ? { exact: options.audio.deviceId } : { ideal: options.audio.deviceId };
          }
        }
      }

      if (AdapterJS.webrtcDetectedBrowser === 'edge') {
        settings.getUserMediaSettings.audio = true;
      }
    }

    if ((options.video && !type) || (options.video && type === TRACK_KIND.VIDEO)) {
      // For Edge to work since they do not support the advanced constraints yet
      settings.settings.video = {
        resolution: clone_1(VIDEO_RESOLUTION.VGA),
        // screenshare: false,
        exactConstraints: !!options.useExactConstraints,
      };
      settings.getUserMediaSettings.video = {};

      if (typeof options.video === 'object') {
        if (typeof options.video.mute === 'boolean') {
          settings.mutedSettings.shouldVideoMuted = options.video.mute;
        }

        if (Array.isArray(options.video.optional)) {
          settings.settings.video.optional = clone_1(options.video.optional);
          settings.getUserMediaSettings.video.optional = clone_1(options.video.optional);
        }

        if (options.video.deviceId && typeof options.video.deviceId === 'string') {
          settings.settings.video.deviceId = options.video.deviceId;
          settings.getUserMediaSettings.video.deviceId = options.useExactConstraints
            ? { exact: options.video.deviceId } : { ideal: options.video.deviceId };
        }

        if (options.video.resolution && typeof options.video.resolution === 'object') {
          if ((options.video.resolution.width && typeof options.video.resolution.width === 'object')
            || typeof options.video.resolution.width === 'number') {
            settings.settings.video.resolution.width = options.video.resolution.width;
          }
          if ((options.video.resolution.height && typeof options.video.resolution.height === 'object')
            || typeof options.video.resolution.height === 'number') {
            settings.settings.video.resolution.height = options.video.resolution.height;
          }
        }

        /* eslint-disable no-nested-ternary */
        /* eslint-disable no-mixed-operators */
        settings.getUserMediaSettings.video.width = typeof settings.settings.video.resolution.width === 'object'
          ? settings.settings.video.resolution.width : (options.useExactConstraints
            ? { exact: settings.settings.video.resolution.width } : { max: settings.settings.video.resolution.width });

        settings.getUserMediaSettings.video.height = typeof settings.settings.video.resolution.height === 'object'
          ? settings.settings.video.resolution.height : (options.useExactConstraints
            ? { exact: settings.settings.video.resolution.height } : { max: settings.settings.video.resolution.height });

        if ((options.video.frameRate && typeof options.video.frameRate === 'object')
          || typeof options.video.frameRate === 'number' && AdapterJS.webrtcDetectedType !== 'plugin') {
          settings.settings.video.frameRate = options.video.frameRate;
          settings.getUserMediaSettings.video.frameRate = typeof settings.settings.video.frameRate === 'object'
            ? settings.settings.video.frameRate : (options.useExactConstraints
              ? { exact: settings.settings.video.frameRate } : { max: settings.settings.video.frameRate });
        }

        if (options.video.facingMode && ['string', 'object'].indexOf(typeof options.video.facingMode) > -1 && AdapterJS.webrtcDetectedType === 'plugin') {
          settings.settings.video.facingMode = options.video.facingMode;
          settings.getUserMediaSettings.video.facingMode = typeof settings.settings.video.facingMode === 'object'
            ? settings.settings.video.facingMode : (options.useExactConstraints
              ? { exact: settings.settings.video.facingMode } : { max: settings.settings.video.facingMode });
        }
      } else {
        settings.getUserMediaSettings.video = {
          width: options.useExactConstraints ? { exact: settings.settings.video.resolution.width }
            : { max: settings.settings.video.resolution.width },
          height: options.useExactConstraints ? { exact: settings.settings.video.resolution.height }
            : { max: settings.settings.video.resolution.height },
        };
      }

      if (AdapterJS.webrtcDetectedBrowser === 'edge') {
        settings.settings.video = {
          // screenshare: false,
          exactConstraints: !!options.useExactConstraints,
        };
        settings.getUserMediaSettings.video = true;
      }
    }

    return settings;
  };

  /**
   * @description Helper function for {@link MediaStream.getUserMedia}
   * @param {GetUserMediaOptions} params - The camera Stream configuration options.
   * @memberOf MediaStreamHelpers
   * @return {Promise}
   */
  const prepMediaAccessRequest = params => new Promise((resolve, reject) => {
    const { roomKey, ...rest } = params;
    const audioSettings = helpers$6.parseStreamSettings(rest, TRACK_KIND.AUDIO);
    const videoSettings = helpers$6.parseStreamSettings(rest, TRACK_KIND.VIDEO);
    const { AdapterJS } = window;

    if (!audioSettings.getUserMediaSettings.audio && !videoSettings.getUserMediaSettings.video) {
      reject(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_GUM_OPTIONS);
    }

    AdapterJS.webRTCReady(() => {
      window.navigator.mediaDevices.getUserMedia({ audio: audioSettings.getUserMediaSettings.audio, video: videoSettings.getUserMediaSettings.video }).then((stream) => {
        const isAudioFallback = false;
        return helpers$6.onStreamAccessSuccess(roomKey, stream, audioSettings, videoSettings, isAudioFallback, resolve);
      }).catch(error => helpers$6.onStreamAccessError(error, reject, resolve, roomKey, audioSettings, videoSettings));
    });
  });

  const isSenderTrackAndTrackMatched = (senderTrack, tracks) => {
    for (let x = 0; x < tracks.length; x += 1) {
      if (senderTrack === tracks[x]) {
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
    for (let track = 0; track < tracks.length; track += 1) {
      const sender = peerConnection.addTrack(tracks[track], stream);
      if (!updatedState.currentRTCRTPSenders[peerId]) {
        updatedState.currentRTCRTPSenders[peerId] = [];
      }

      updatedState.currentRTCRTPSenders[peerId].push(sender);
    }

    Skylink.setSkylinkState(updatedState, updatedState.room.id);
  };

  const addUserMediaStreams = (state, peerId, userMediaStreams, peerConnection) => {
    const streamIds = Object.keys(userMediaStreams);
    for (let x = 0; x < streamIds.length; x += 1) {
      const { stream } = userMediaStreams[streamIds[x]];
      if (!isStreamOnPC(peerConnection, stream)) {
        addTracksToPC(state, peerId, stream, peerConnection);
      }
    }
  };

  const addScreenshareStream = (state, peerId, screenshareStream, peerConnection) => {
    const { stream } = screenshareStream;
    if (!isStreamOnPC(peerConnection, stream)) {
      addTracksToPC(state, peerId, stream, peerConnection);
    }
  };

  /**
   * Function that sets User's Stream to send to Peer connection.
   * Priority for <code>shareScreen()</code> Stream over <code>{@link MediaStream.getUserMedia}</code> Stream.
   * @param {string} targetMid - The mid of the target peer
   * @param {SkylinkState} roomState - Skylink State of current room
   * @memberOf MediaStreamHelpers
   * @private
   */
  const addLocalMediaStreams = (targetMid, roomState) => {
    // TODO: Full implementation (cross-browser) not done. Refer to stream-media.js for checks on AJS
    const state = Skylink.getSkylinkState(roomState.room.id);
    const { peerConnections, streams } = state;
    const peerConnection = peerConnections[targetMid];

    if (streams.userMedia) {
      addUserMediaStreams(state, targetMid, streams.userMedia, peerConnection);
    }

    if (streams.screenshare) {
      addScreenshareStream(state, targetMid, streams.screenshare, peerConnection);
    }
  };

  /**
   * Function that handles the <code>RTCPeerConnection.ontrack</code> event on remote stream added.
   * @param {MediaStream} stream - {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStream}
   * @param {SkylinkState} currentRoomState - Current room state
   * @param {string} targetMid - The mid of the target peer
   * @param {boolean} isScreensharing - The flag if incoming stream is a screenshare stream.
   * @param {boolean} isVideo - The flag if incoming stream has a video track.
   * @param {boolean} isAudio- The flag if incoming stream has an audio track.
   * @memberOf MediaStreamHelpers
   * @fires onIncomingStream
   * @fires peerUpdated
   * @private
   */
  const onRemoteTrackAdded = (stream, currentRoomState, targetMid, isScreensharing, isVideo, isAudio) => {
    const { user, hasMCU } = currentRoomState;
    const dispatchOnIncomingStream = (detail) => { dispatchEvent(onIncomingStream(detail)); };
    const dispatchOnIncomingScreenStream = (detail) => {
      // eslint-disable-next-line no-param-reassign
      detail.isReplace = false;
      dispatchEvent(onIncomingScreenStream(detail));
    };
    const methods = { dispatchOnIncomingStream, dispatchOnIncomingScreenStream };
    const dispatch = { methodName: isScreensharing ? 'dispatchOnIncomingScreenStream' : 'dispatchOnIncomingStream' };
    const detail = {
      stream,
      peerId: targetMid,
      room: currentRoomState.room,
      isSelf: hasMCU ? (targetMid === user.sid || false) : false,
      peerInfo: PeerData.getPeerInfo(targetMid, currentRoomState),
      streamId: stream.id,
      isVideo,
      isAudio,
    };

    methods[dispatch.methodName](detail);

    dispatchEvent(peerUpdated({
      peerId: targetMid,
      peerInfo: PeerData.getPeerInfo(targetMid, currentRoomState),
      isSelf: hasMCU ? (targetMid === user.sid || false) : false,
      room: currentRoomState.room,
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
   * @fires mediaAccessError
   * @fires mediaAccessFallback
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

      return window.navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => helpers$6.onStreamAccessSuccess(roomKey, stream, audioSettings, videoSettings, isAudioFallback, resolve)).catch((fallbackError) => {
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

  const getTrackSender = (state, peerId, trackId, mediaType) => {
    const { peerConnections } = state;
    const senders = peerConnections[peerId].getSenders();
    let trackSender = null;

    if (!trackId) {
      return trackSender;
    }
    senders.forEach((sender) => {
      if (sender.track && (sender.track.id === trackId) && (sender.track.kind === mediaType)) {
        trackSender = sender;
      }
    });

    return trackSender;
  };

  /**
   * Function that replaces a track screensharing track.
   * @param {MediaStream} oldStream - The stream to be replaced with newStream
   * @param {MediaStream} newStream - The new stream
   * @param {String} peerId - The PeerId
   * @param {SkylinkState} state
   * @private
   */
  const replaceTrack = (oldStream, newStream, peerId, state) => {
    const oldVideoTrack = oldStream.getVideoTracks()[0];
    const oldAudioTrack = oldStream.getAudioTracks()[0];
    const videoSender = getTrackSender(state, peerId, oldVideoTrack ? oldVideoTrack.id : null, 'video');
    const audioSender = getTrackSender(state, peerId, oldAudioTrack ? oldAudioTrack.id : null, 'audio');
    const newVideoTrack = newStream.getVideoTracks()[0];
    const newAudioTrack = newStream.getAudioTracks()[0];

    try {
      if (oldVideoTrack && newVideoTrack && videoSender) {
        videoSender.replaceTrack(newVideoTrack);
      }

      if (oldAudioTrack && newAudioTrack && audioSender) {
        audioSender.replaceTrack(newAudioTrack);
      }
    } catch (error) {
      logger.log.ERROR([peerId, TAGS.PEER_CONNECTION, null, MESSAGES.PEER_CONNECTION.ERRORS.REPLACE_TRACK], error);
    }
  };

  /* eslint-disable no-nested-ternary */

  const dispatchStreamMutedEvent = (room, streamId, isScreensharing) => {
    const roomState = Skylink.getSkylinkState(room.id);
    dispatchEvent(streamMuted({
      isSelf: true,
      peerId: roomState.user.sid,
      peerInfo: PeerData.getUserInfo(room),
      streamId,
      isScreensharing,
    }));
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

  const retrieveOriginalActiveStreamId = (roomState, currentActiveStreamId, replacedStreamIds) => {
    let originalActiveStreamId = currentActiveStreamId;
    const { streams: { userMedia } } = roomState;
    const pReplacedStreamIds = replacedStreamIds || Object.keys(userMedia).filter(streamId => userMedia[streamId].isReplaced);

    if (pReplacedStreamIds.length === 0) {
      return originalActiveStreamId;
    }

    if (pReplacedStreamIds.indexOf(originalActiveStreamId) > -1) {
      pReplacedStreamIds.splice(pReplacedStreamIds.indexOf(originalActiveStreamId), 1);
    }

    if (pReplacedStreamIds.length > 1) {
      for (let i = 0; i < pReplacedStreamIds.length; i += 1) {
        if (userMedia[pReplacedStreamIds[i]].newStream && userMedia[pReplacedStreamIds[i]].newStream.id === originalActiveStreamId) {
          originalActiveStreamId = pReplacedStreamIds[i];
          retrieveOriginalActiveStreamId(roomState, originalActiveStreamId, pReplacedStreamIds);
          break;
        }
      }
    }

    return pReplacedStreamIds[0];
  };

  const updateMediaInfo = (hasToggledVideo, hasToggledAudio, room, streamId) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const originalStreamId = retrieveOriginalActiveStreamId(roomState, streamId);
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

  const sendSigMsgs = (hasToggledVideo, hasToggledAudio, room, streamId) => {
    const roomState = Skylink.getSkylinkState(room.id);
    const signaling = new SkylinkSignalingServer();
    const originalStreamId = retrieveOriginalActiveStreamId(roomState, streamId);

    if (hasToggledVideo) {
      signaling.muteVideoEvent(room, originalStreamId);
    }

    if (hasToggledAudio) {
      setTimeout(() => signaling.muteAudioEvent(room, originalStreamId), hasToggledVideo ? 1050 : 0);
    }
  };

  // TODO: check if this is needed since Edge is not built on Chrome
  // const muteForEdge = (roomState, streamId, hasToggledVideo, hasToggledAudio) => {
  //   const { peerConnections } = roomState;
  //   const peerIds = Object.keys(peerConnections);
  //   peerIds.forEach((peerId) => {
  //     const localStreams = peerConnections[peerId].getLocalStreams();
  //     if (streamId) {
  //       for (let i = 0; i < localStreams.length; i += 1) {
  //         if (streamId === localStreams[i].id) {
  //           muteFn(localStreams[i], roomState);
  //           dispatchLocalMediaMutedEvent(hasToggledVideo, hasToggledAudio, localStreams[i], roomState);
  //           sendMuteAudioAndMuteVideoSigMsg(hasToggledVideo, hasToggledAudio, roomState, streamId);
  //           break;
  //         }
  //       }
  //     } else {
  //       localStreams.forEach((stream, i) => {
  //         muteFn(stream, roomState);
  //         dispatchLocalMediaMutedEvent(hasToggledVideo, hasToggledAudio, stream, roomState);
  //         setTimeout(sendMuteAudioAndMuteVideoSigMsg, i === 0 ? 0 : 1000);
  //       });
  //     }
  //   });
  // };

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
    const { streams, streamsMutedSettings } = state;
    let hasToggledAudio = false;
    let hasToggledVideo = false;

    if (hasAudioTrack(streams.userMedia[streamId].stream) && streamsMutedSettings[streamId].audioMuted !== options.audioMuted) {
      hasToggledAudio = true;
    }

    if (hasVideoTrack(streams.userMedia[streamId].stream) && streamsMutedSettings[streamId].videoMuted !== options.videoMuted) {
      hasToggledVideo = true;
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
    const state = Skylink.getSkylinkState(roomKey);
    const { streams, room } = state;
    const toggleState = retrieveToggleState(state, options, streamId);
    const { hasToggledAudio, hasToggledVideo } = toggleState;

    if (streams.userMedia) {
      updateStreamsMutedSettings(state, toggleState, streamId);
      muteFn(streams.userMedia[streamId].stream, state);
      dispatchLocalMediaMutedEvent(hasToggledVideo, hasToggledAudio, streams.userMedia[streamId].stream, room.id);
      dispatchPeerUpdatedEvent$1(room); // TODO: Currently peerUpdatedEvent will fire after each stream is updated. Suggest to refactor to have last stream trigger peerUpdatedEvent after a timeout since only one peerUpdatedEvent is needed
      dispatchStreamMutedEvent(room, streamId);
      sendSigMsgs(hasToggledVideo, hasToggledAudio, room, streamId);
      updateMediaInfo(hasToggledVideo, hasToggledAudio, room, streamId);
    }

    if (streams.screenshare) {
      if ((streamId && streams.screenshare.stream.id === streamId) || !streamId) {
        updateStreamsMutedSettings(state, toggleState, streamId);
        muteFn(streams.screenshare.stream, state);
        dispatchLocalMediaMutedEvent(hasToggledVideo, hasToggledAudio, streams.screenshare.stream, room.id, true);
        dispatchPeerUpdatedEvent$1(room);
        dispatchStreamMutedEvent(room, streamId, true);
        sendSigMsgs(hasToggledVideo, hasToggledAudio, room, streamId);
        updateMediaInfo(hasToggledVideo, hasToggledAudio, room, streamId);
      }
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

  const isValidStreamId = (streamId, state) => {
    const { streams } = state;
    let isValid = false;

    Object.keys(streams.userMedia).forEach((gumStreamId) => {
      if (gumStreamId === streamId) {
        isValid = true;
      }
    });

    return isValid;
  };

  /**
   * @param {SkylinkState} roomState
   * @param {boolean} options
   * @param {boolean} options.audioMuted
   * @param {boolean} options.videoMuted
   * @param {String} streamId
   * @memberof MediaStreamHelpers
   * @fires streamMuted, peerUpdated, localMediaMuted
   */
  const muteStream = (roomState, options, streamId = null) => {
    const {
      streams, room,
    } = roomState;

    if (!isAObj(options)) {
      logger.log.ERROR(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_MUTE_OPTIONS, options);
      return;
    }

    if (!streams.userMedia && !streams.screenshare) {
      logger.log.WARN(MESSAGES.MEDIA_STREAM.ERRORS.NO_STREAM);
      return;
    }

    if (streamId && !isValidStreamId(streamId, roomState)) {
      logger.log.ERROR(MESSAGES.MEDIA_STREAM.ERRORS.INVALID_MUTE_OPTIONS, options);
      return;
    }

    const fOptions = {
      audioMuted: isABoolean(options.audioMuted) ? options.audioMuted : (isANumber(options.audioMuted) ? retrieveMutedSetting(options.audioMuted) : true),
      videoMuted: isABoolean(options.videoMuted) ? options.videoMuted : (isANumber(options.videoMuted) ? retrieveMutedSetting(options.videoMuted) : true),
    };

    const streamIdsThatCanBeMuted = streamId ? [streamId] : Object.keys(streams.userMedia).filter(id => !streams.userMedia[id].isReplaced);
    const streamIdsToMute = Object.values(streamIdsThatCanBeMuted).filter(sId => (retrieveToggleState(roomState, fOptions, sId).hasToggledAudio || retrieveToggleState(roomState, fOptions, sId).hasToggledVideo));

    streamIdsToMute.forEach((streamIdToMute, i) => {
      setTimeout(() => startMuteEvents(room.id, streamIdToMute, fOptions), i === 0 ? 0 : 1050);
      // TODO: Implement peerUpdatedEvent timeout here?
    });
  };

  const dispatchEvents = (roomState, stream) => {
    const { user, room } = roomState;
    const isSelf = true;
    const peerId = user.sid;
    const peerInfo = PeerData.getCurrentSessionInfo(room);

    dispatchEvent(onIncomingStream({
      room,
      stream,
      streamId: stream.id,
      isSelf,
      peerId,
      peerInfo,
      isScreensharing: false,
      isVideo: hasVideoTrack(stream),
      isAudio: hasAudioTrack(stream),
    }));

    dispatchEvent(peerUpdated({
      isSelf,
      peerId,
      peerInfo,
    }));
  };

  const dispatchEventsToLocalEnd = (roomState, streams) => {
    for (let i = 0; i < streams.length; i += 1) {
      if (!streams[i]) break;

      if (Array.isArray(streams[i])) {
        for (let x = 0; x < streams[i].length; x += 1) {
          if (streams[i][x]) {
            dispatchEvents(roomState, streams[i][x]);
          }
        }
      } else {
        dispatchEvents(roomState, streams[i]);
      }
    }
  };

  const restartFn = (roomState, streams, resolve, reject) => {
    const { AdapterJS } = window;
    const { peerConnections, hasMCU } = roomState;

    if (AdapterJS.webrtcDetectedBrowser === 'edge') {
      reject(new Error(MESSAGES.PEER_CONNECTION.refresh_no_edge_support));
    }

    try {
      dispatchEventsToLocalEnd(roomState, streams);

      if (Object.keys(peerConnections).length > 0 || hasMCU) {
        const refreshPeerConnectionPromise = PeerConnection.refreshPeerConnection(Object.keys(peerConnections), roomState, false, {});

        refreshPeerConnectionPromise.then(() => {
          resolve(streams);
        }).catch((error) => {
          logger.log.ERROR(MESSAGES.PEER_CONNECTION.ERRORS.REFRESH);
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
   * @fires onIncomingStream, peerUpdated
   */
  // eslint-disable-next-line consistent-return
  const sendStream = (roomState, options = null) => new Promise((resolve, reject) => {
    if (!roomState) {
      return reject(new Error(MESSAGES.ROOM_STATE.NO_ROOM_NAME));
    }

    const { inRoom, streams } = roomState;
    const { AdapterJS } = window;
    const isNotObjOrNullOrPlugin = (!isAObj(options) || options === null) && !(AdapterJS && AdapterJS.WebRTCPlugin && AdapterJS.WebRTCPlugin.plugin);

    if (!inRoom) {
      logger.log.WARN(MESSAGES.ROOM.ERRORS.NOT_IN_ROOM);
      return reject(new Error(`${MESSAGES.ROOM.ERRORS.NOT_IN_ROOM}`));
    }

    if (streams.userMedia) {
      return reject(new Error(MESSAGES.MEDIA_STREAM.ERRORS.ACTIVE_STREAMS));
    }

    if (isNotObjOrNullOrPlugin) {
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

  /**
   * Function that returns all active streams including screenshare stream if present.
   * @param {SkylinkState} roomState
   * @return {streamList} streamList
   * @memberOf MediaStreamHelpers
   */
  const retrieveStreams = (roomState) => {
    const { streams: { userMedia, screenshare } } = roomState;
    const streamList = {
      userMedia: null,
      screenshare: null,
    };

    if (!userMedia && !screenshare) {
      return streamList;
    }

    const streamIds = Object.keys(userMedia);

    if (userMedia) {
      streamList.userMedia = {};
      streamIds.forEach((streamId) => {
        streamList.userMedia[streamId] = userMedia[streamId].stream;
      });
    }

    if (screenshare) {
      streamList.screenshare = screenshare.stream;
    }

    return streamList;
  };

  const getScreenSources = () => new Promise((resolve) => {
    const { navigator, AdapterJS } = window;
    const outputSources = {
      mediaSource: [],
      mediaSourceInput: [],
    };

    // For chrome android 59+ has screensharing support behind chrome://flags (needs to be enabled by user)
    // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=487935
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
      if (AdapterJS.webrtcDetectedBrowser === 'chrome' && AdapterJS.webrtcDetectedVersion >= 59) {
        outputSources.mediaSource = ['screen'];
      }
      resolve(outputSources);
      return null;
    }

    // TODO: Check if AdapterJS.webrtcDetectedType === 'plugin' is needed for IE/Safari Commercial support. If they do not support gDM method, then we will need a plugin

    if ((AdapterJS.webrtcDetectedBrowser === 'chrome' && AdapterJS.webrtcDetectedVersion >= 34)
        || (AdapterJS.webrtcDetectedBrowser === 'firefox' && AdapterJS.webrtcDetectedVersion >= 38)
        || (AdapterJS.webrtcDetectedBrowser === 'opera' && AdapterJS.webrtcDetectedVersion >= 21)) {
      // Just warn users for those who did not configure the Opera screensharing extension settings, it will not work!
      if (AdapterJS.webrtcDetectedBrowser === 'opera' && !(AdapterJS.extensionInfo
          && AdapterJS.extensionInfo.opera && AdapterJS.extensionInfo.opera.extensionId)) {
        logger.log.WARN('Please ensure that your application allows Opera screensharing!');
      }

      outputSources.mediaSource = ['window', 'screen'];

      // Chrome 52+ and Opera 39+ supports tab and audio
      // Reference: https://developer.chrome.com/extensions/desktopCapture
      if ((AdapterJS.webrtcDetectedBrowser === 'chrome' && AdapterJS.webrtcDetectedVersion >= 52)
          || (AdapterJS.webrtcDetectedBrowser === 'opera' && AdapterJS.webrtcDetectedVersion >= 39)) {
        outputSources.mediaSource.push('tab', 'audio');

        // Firefox supports some other sources
        // Reference: http://fluffy.github.io/w3c-screen-share/#screen-based-video-constraints
        //            https://bugzilla.mozilla.org/show_bug.cgi?id=1313758
        //            https://bugzilla.mozilla.org/show_bug.cgi?id=1037405
        //            https://bugzilla.mozilla.org/show_bug.cgi?id=1313758
      } else if (AdapterJS.webrtcDetectedBrowser === 'firefox') {
        outputSources.mediaSource.push('browser', 'camera', 'application');
      }
    }
    resolve(outputSources);
    return null;
  });

  /* eslint-disable no-nested-ternary */

  const updateStreamsMediaStatus = (roomKey, settings, stream) => {
    const updatedState = Skylink.getSkylinkState(roomKey);
    const { room, streamsMediaStatus } = updatedState;
    const { mutedSettings: { shouldAudioMuted }, settings: { audio, video } } = settings;

    streamsMediaStatus[stream.id] = {};
    streamsMediaStatus[stream.id].audioMuted = audio ? (shouldAudioMuted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE) : MEDIA_STATUS.UNAVAILABLE;
    streamsMediaStatus[stream.id].videoMuted = video ? (shouldAudioMuted ? MEDIA_STATUS.MUTED : MEDIA_STATUS.ACTIVE) : MEDIA_STATUS.UNAVAILABLE;

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const updateRemoteStreams = (room, peerId, stream) => {
    const updatedState = Skylink.getSkylinkState(room.id);

    updatedState.remoteStreams[peerId] = updatedState.remoteStreams[peerId] || {};
    updatedState.remoteStreams[peerId][stream.id] = stream;

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const retrieveVideoStreams = (room) => {
    const state = Skylink.getSkylinkState(room.id);
    const { streams } = state;
    const videoStreams = [];
    Object.values(streams.userMedia).forEach((streamObj) => {
      if (streamObj.stream.getVideoTracks().length > 0) {
        videoStreams.push(streamObj.stream);
      }
    });

    return videoStreams;
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

  const buildStreamObject = (room, user, stream, settings) => ({
    id: stream.id,
    stream,
    isReplaced: false,
    settings: settings.settings,
    constraints: settings.getUserMediaSettings,
  });

  const addStreamToState = (room, stream, settings, isScreensharing) => {
    const updatedState = Skylink.getSkylinkState(room.id);
    const streamKey = isScreensharing ? 'screenshare' : 'userMedia';

    if (isScreensharing) {
      updatedState.streams[streamKey] = buildStreamObject(updatedState.room, updatedState.user, stream, settings);
    } else {
      updatedState.streams[streamKey] = updatedState.streams[streamKey] ? updatedState.streams[streamKey] : {};
      updatedState.streams[streamKey][stream.id] = buildStreamObject(updatedState.room, updatedState.user, stream, settings);
    }

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const processNewStream = (room, stream, settings, isScreensharing) => {
    addStreamToState(room, stream, settings, isScreensharing);
    helpers$6.updateStreamsMutedSettings(room.id, settings, stream);
    helpers$6.updateStreamsMediaStatus(room.id, settings, stream);
  };

  const updateStreamsMutedSettings$1 = (roomKey, settings, stream) => {
    const updatedState = Skylink.getSkylinkState(roomKey);
    const { room, streamsMutedSettings } = updatedState;
    const { mutedSettings: { shouldAudioMuted, shouldVideoMuted }, settings: { audio, video } } = settings;

    streamsMutedSettings[stream.id] = {};
    streamsMutedSettings[stream.id].audioMuted = audio ? shouldAudioMuted : true;
    streamsMutedSettings[stream.id].videoMuted = video ? shouldVideoMuted : true;

    Skylink.setSkylinkState(updatedState, room.id);
  };

  const onStreamAccessSuccess = (roomKey, stream, audioSettings, videoSettings, isAudioFallback, resolve) => {
    const isScreensharing = false;
    const streams = helpers$6.splitAudioAndVideoStream(stream);

    streams.forEach((st) => {
      if (!st) return;
      helpers$6.processStreamInState(st, hasAudioTrack(st) ? audioSettings : videoSettings, roomKey, isScreensharing, isAudioFallback);
    });

    resolve(streams);
  };

  /**
   * @namespace MediaStreamHelpers
   * @description All helper and utility functions for <code>{@link MediaStream}</code> class are listed here.
   * @private
   * @type {{parseMediaOptions, processStreamInState, parseStreamSettings, prepMediaAccessRequest, addLocalMediaStreams, onRemoteTrackAdded, onStreamAccessError, buildPeerStreamsInfo, replaceTrack, muteStream, getStreamSources, sendStream, retrieveStreams, getScreenSources, updateStreamsMediaStatus, updateRemoteStreams, retrieveVideoStreams, splitAudioAndVideoStream, processNewStream, updateStreamsMutedSettings, onStreamAccessSuccess}}
   */
  const helpers$6 = {
    parseMediaOptions,
    processStreamInState,
    parseStreamSettings,
    prepMediaAccessRequest,
    addLocalMediaStreams,
    onRemoteTrackAdded,
    onStreamAccessError,
    replaceTrack,
    muteStream,
    sendStream,
    getStreamSources,
    retrieveStreams,
    getScreenSources,
    updateStreamsMediaStatus,
    updateRemoteStreams,
    retrieveVideoStreams,
    splitAudioAndVideoStream,
    processNewStream,
    updateStreamsMutedSettings: updateStreamsMutedSettings$1,
    onStreamAccessSuccess,
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
   * Function that tests if type is 'Object'.
   * @param {*} param
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isAObj = param => typeof param === 'object' && param !== null;

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
   * Function that checks the agent version compatibility.
   * @param {String} agentVer
   * @param {String} requiredVer
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isLowerThanVersion = (agentVer, requiredVer) => {
    const partsA = (agentVer || '').split('.');
    const partsB = (requiredVer || '').split('.');

    for (let i = 0; i < partsB.length; i += 1) {
      if ((partsA[i] || '0') < (partsB[i] || '0')) {
        return true;
      }
    }
    return false;
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
      const streams = helpers$6.splitAudioAndVideoStream(stream);
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
   * Function that updates the replaced state of the streams
   * @param {MediaStream} replacedStream
   * @param {MediaStream} newStream
   * @param {SkylinkState} state
   * @param {boolean} isReplaced
   * @memberOf UtilHelpers
   */
  const updateReplacedStreamInState = (replacedStream, newStream, state, isReplaced) => {
    const { streams, room } = state;
    const streamObjs = Object.values(streams.userMedia);
    for (let i = 0; i < streamObjs.length; i += 1) {
      if (streamObjs[i].id === replacedStream.id) {
        streamObjs[i].isReplaced = isReplaced;
        streamObjs[i].newStream = newStream;
      }
    }

    Skylink.setSkylinkState(state, room.id);
  };

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
   * @param {string} agent
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
      default:
        logger.log.DEBUG(MESSAGES.UTILS.INVALID_BROWSER_AGENT);
        return false;
    }
  };

  /**
   * Function that checks the browser version.
   * @param {number} version
   * @returns {boolean}
   * @memberOf UtilHelpers
   */
  const isVersion = (version) => {
    const { AdapterJS } = window;
    return AdapterJS.webrtcDetectedVersion === version;
  };

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
     * @fires getPeersStateChange
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

  /**
   * @namespace initOptions
   * @private
   * @module skylink/defaultOptions
   */
  const defaultOptions = {
    /*
     * @param {string} options.appKey The App Key.
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
    defaultRoom: new Date().valueOf(),
    appKey: null,
    roomServer: 'https://api.temasys.io',
    enableIceTrickle: true,
    enableDataChannel: true,
    enableSTUNServer: true,
    enableTURNServer: true,
    socketServerPath: null,
    enableStatsGathering: true,
    audioFallback: true,
    socketTimeout: 7000,
    apiTimeout: 4000,
    forceTURNSSL: false,
    forceTURN: false,
    forceSSL: true,
    usePublicSTUN: false,
    disableVideoFecCodecs: false,
    disableComfortNoiseCodec: false,
    disableREMB: false,
    throttleShouldThrowError: false,
    mcuUseRenegoRestart: true,
    useEdgeWebRTC: false,
    enableSimultaneousTransfers: true,
    priorityWeightScheme: PRIORITY_WEIGHT_SCHEME.AUTO,
    TURNServerTransport: TURN_TRANSPORT.ANY,
    credentials: null,
    filterCandidatesType: {
      host: false,
      srflx: false,
      relay: false,
    },
    throttleIntervals: {
      shareScreen: 10000,
      refreshConnection: 5000,
      getUserMedia: 0,
    },
    iceServer: null,
    socketServer: 'signaling.temasys.io',
    audioCodec: AUDIO_CODEC.AUTO,
    videoCodec: VIDEO_CODEC.AUTO,
    codecParams: {
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
       * @type {string}
       */
      this.id = rawApiResponse.room_key;
      /**
       * The room's credentials
       * @type {string}
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
       * @type {string}
       */
      this.roomName = rawApiResponse.roomName;
      /**
       * The peer connection configuration
       * @type {{mediaConstraints: any, peerConstraints: any, offerConstraints: any, peerConfig: {iceServers: Array}, sdpConstraints: {mandatory: {OfferToReceiveAudio: boolean, OfferToReceiveVideo: boolean}}}}
       */
      this.connection = {
        peerConstraints: JSON.parse(rawApiResponse.pc_constraints),
        offerConstraints: JSON.parse(rawApiResponse.offer_constraints),
        sdpConstraints: {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
          },
        },
        peerConfig: {
          iceServers: [],
        },
        mediaConstraints: JSON.parse(rawApiResponse.media_constraints),
      };
    }

    /**
     * Get the ID/KEY of this room
     * @return {string} id - The generated ID of the room
     * @private
     */
    getRoomKey() {
      return this.id;
    }

    /**
     * Get the name of this room
     * @return {string} roomName - The name of this room
     * @private
     */
    getRoomName() {
      return this.roomName;
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
       * @type {string}
       */
      this.uid = rawApiResponse.username;
      /**
       * The user credentials or token of the user
       * @type {string}
       */
      this.token = rawApiResponse.userCred;
      /**
       * TimeStamp returned by API
       * @type {Date}
       */
      this.timeStamp = rawApiResponse.timeStamp;
      /**
       * The MediaStreams for this user
       * @type {MediaStreams[]}
       */
      this.streams = [];
      /**
       * Information about this user
       * @type {JSON}
       */
      this.info = {};
      /**
       * The socket ID of the user
       * @type {JSON}
       */
      this.sid = null;
    }
  }

  /* eslint-disable camelcase */
  /**
   * @classdesc Class representing a Skylink API response.
   * @class SkylinkApiResponse
   * @private
   * @param {RawApiResponse} rawApiResponse - API response received from the API Server
   */
  class SkylinkApiResponse {
    constructor(rawApiResponse) {
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
      } = rawApiResponse;

      if (!offer_constraints && !pc_constraints) {
        logger.log.ERROR(['API', null, 'init', 'pc_constraints or offer_constraints are null']);
      }
      logger.log.DEBUG(['API', null, 'init', 'Parsed Peer Connection constraints:'], JSON.parse(pc_constraints));
      logger.log.DEBUG(['API', null, 'init', 'Parsed Offer constraints'], JSON.parse(offer_constraints));

      /**
       * This is the cid received from API
       * @type {string}
       */
      this.key = cid;
      /**
       * The owner of the App Key
       * @type {string}
       */
      this.appKeyOwner = apiOwner;
      /**
       * The URL of the signaling server
       * @type {string}
       */
      this.signalingServer = ipSigserver;
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

      this.socketServer = ipSigserver;

      this.socketServerPath = ipSigserverPath;

      this.socketPorts = {
        'http:': Array.isArray(httpPortList) && httpPortList.length > 0 ? httpPortList : [80, 3000],
        'https:': Array.isArray(httpsPortList) && httpsPortList.length > 0 ? httpsPortList : [443, 3443],
      };
    }
  }

  const getEndPoint = (options) => {
    const {
      roomServer,
      appKey,
      defaultRoom,
      credentials,
    } = options;
    let path = `${roomServer}/api/${appKey}/${defaultRoom}`;
    let urlChar = '?';
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
      updatedOptions.filterCandidatesType.host = true;
      updatedOptions.filterCandidatesType.srflx = true;
      updatedOptions.filterCandidatesType.relay = false;
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
    const apiResponse = await fetch(endpoint, {
      headers: {
        Skylink_SDK_type: SDK_TYPE.WEB,
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
    const { AdapterJS } = window;
    const returnObject = {
      ready: true,
      message: '',
    };
    if (!testRTCPeerConnection()) {
      if (window.RTCPeerConnection && AdapterJS.webrtcDetectedType === 'plugin') {
        returnObject.message = 'Plugin is not available. Please check plugin status.';
      } else {
        returnObject.message = 'WebRTC not supported. Please upgrade your browser';
      }
      returnObject.ready = false;
      dispatchEvent(readyStateChange({
        readyState: READY_STATE_CHANGE$1.ERROR,
        error: {
          status: -2,
          content: new Error(AdapterJS.webrtcDetectedType === 'plugin' && window.RTCPeerConnection ? 'Plugin is not available' : 'WebRTC not available'),
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
            room: room.roomName,
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
          room: room.roomName,
        }));
        reject(new Error(error.message || error.toString()));
      });
  });

  /* eslint-disable class-methods-use-this */

  let instance$3 = null;

  /**
   * @class
   * @classdesc Singleton class that represents a API server.
   * @private
   */
  class SkylinkAPIServer {
    constructor() {
      if (!instance$3) {
        instance$3 = this;
      }

      this.options = {};

      return instance$3;
    }

    // eslint-disable-next-line class-methods-use-this
    init(options = defaultOptions) {
      if (options) {
        Skylink.setUserInitOptions(options);
      }
      dispatchEvent(readyStateChange({
        readyState: READY_STATE_CHANGE$1.INIT,
        error: null,
        room: null,
      }));
      const dependencies = validateDepencies();
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
            reject(response.json());
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

  /**
   * Emits the peerLeft event when current peer left the room.
   * @param {SkylinkState} state
   * @param {string} peerId
   * @private
   */
  const executePeerLeftProcess = (state, peerId) => new Promise((resolve) => {
    const { room, peerConnections } = state;
    const { ROOM: { LEAVE_ROOM } } = MESSAGES;

    logger.log.INFO([peerId, room.roomName, null, LEAVE_ROOM.PEER_LEFT.START]);

    if (peerId === PEER_TYPE.MCU) {
      dispatchEvent(serverPeerLeft({
        peerId,
        serverPeerType: SERVER_PEER_TYPE.MCU,
        room,
      }));
    } else {
      dispatchEvent(peerLeft({
        peerId,
        peerInfo: PeerData.getCurrentSessionInfo(room),
        isSelf: false,
        room,
      }));
    }

    if (peerConnections[peerId] && peerConnections[peerId].signalingState !== PEER_CONNECTION_STATE$1.CLOSED) {
      PeerConnection.closePeerConnection(state, peerId);
    }

    addEventListener(EVENTS.DATA_CHANNEL_STATE, (evt) => {
      const { detail } = evt;
      if (detail.state === DATA_CHANNEL_STATE$1.CLOSED || detail.state === DATA_CHANNEL_STATE$1.CLOSING) {
        logger.log.INFO([detail.peerId, room.roomName, null, LEAVE_ROOM.PEER_LEFT.SUCCESS]);
        resolve(detail.peerId);
      }
    });

    PeerConnection.closeDataChannel(state, peerId);
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

    updatedState.inRoom = false;
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

      addEventListener(EVENTS.CHANNEL_CLOSE, () => {
        logger.log.INFO([room.roomName, null, null, LEAVE_ROOM.DISCONNECT_SOCKET.SUCCESS]);
        resolve(updatedState);
      });

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
    const { room } = state;

    stopStreamHelpers.prepStopStream(room.id, null, true);
    new ScreenSharing(state).stop();
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
      const peerIds = hasMCU ? [PEER_TYPE.MCU] : Array.from(new Set([...Object.keys(peerConnections), ...Object.keys(peerInformations)]));

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
              room,
            }));
            Skylink.removeSkylinkState(removedState.room.id);
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
              room,
            }));
            Skylink.removeSkylinkState(removedState.room.id);
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
        username: null,
        sdk_name: 'web',
        sdk_version: null,
        agent_name: AdapterJS.webrtcDetectedBrowser,
        agent_version: AdapterJS.webrtcDetectedVersion,
        agent_platform: navigator.platform,
        agent_plugin_version: (AdapterJS.WebRTCPlugin.plugin && AdapterJS.WebRTCPlugin.plugin.VERSION) || null,
      };
    }

    send(roomKey) {
      const roomState = Skylink.getSkylinkState(roomKey);

      this.model.username = (roomState.user && roomState.user.uid) || null;
      this.model.sdk_version = roomState.VERSION;
      this.model.client_id = roomState.clientId;
      this.model.appKey = Skylink.getInitOptions().appKey;
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
    constructor(skylinkApiResponse) {
      /**
       * Stores the list of Peer DataChannel connections.
       * @name dataChannels
       * @type {Object}
       * @property {string} peerId - The list of DataChannels associated with Peer ID.
       * @property {RTCDataChannel} channeLabel - The DataChannel connection.
       * The property name <code>"main"</code> is reserved for messaging Datachannel type.
       * @since 0.2.0
       * @private
       */
      this.dataChannels = {};
      /**
       * Stores the list of data transfers from / to Peers.
       * @name dataTransfers
       * @property {JSON} #transferId The data transfer session.
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.dataTransfers = {};
      /**
       * Stores the list of sending data streaming sessions to Peers.
       * @name dataStreams
       * @property {JSON} #streamId The data stream session.
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.dataStreams = {};
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
       * Stores the list of the Peer connections stats.
       * @name peerBandwidth
       * @property {JSON} <#peerId> The Peer connection stats.
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.peerBandwidth = {};
      /**
       * Stores the list of the Peer custom configs.
       * @name peerCustomConfigs
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.peerCustomConfigs = {};
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
       * @property {string} uid The API result "username".
       * @property {string} token The API result "userCred".
       * @property {string} timeStamp The API result "timeStamp".
       * @property {string} sid The Signaling server receive user Peer ID.
       * @type SkylinkUser
       * @since 0.5.6
       * @private
       */
      this.user = skylinkApiResponse.user;
      /**
       * Stores the User custom data.
       * By default, if no custom user data is set, it is an empty string <code>""</code>.
       * @name userData
       * @type JSON|string
       * @default ""
       * @since 0.5.6
       * @private
       */
      this.userData = '';
      /**
       * Stores the User connection priority weight.
       * If Peer has a higher connection weight, it will do the offer from its Peer connection first.
       * @name peerPriorityWeight
       * @type number
       * @since 0.5.0
       * @private
       */
      this.peerPriorityWeight = 0;
      /**
       * Stores the flag that indicates if "autoIntroduce" is enabled.
       * If enabled, the Peers connecting the same Room will receive each others "enter" message ping.
       * @name autoIntroduce
       * @type boolean
       * @default true
       * @since 0.6.1
       * @private
       */
      this.autoIntroduce = skylinkApiResponse.autoIntroduce;
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
      this.isPrivileged = skylinkApiResponse.isPrivileged;
      /**
       * Stores the current Room name that User is connected to.
       * @name selectedRoom
       * @type string
       * @since 0.3.0
       * @private
       */
      this.selectedRoom = null;
      /**
       * Stores the flag that indicates if Room is locked.
       * @name roomLocked
       * @type boolean
       * @since 0.5.2
       * @private
       */
      this.roomLocked = false;
      /**
       * Stores the flag that indicates if User is connected to the Room.
       * @name inRoom
       * @type boolean
       * @since 0.4.0
       * @private
       */
      this.inRoom = false;
      /**
      /**
       * Stores the timestamps data used for throttling.
       * @name timestamp
       * @type JSON
       * @since 0.5.8
       * @private
       */
      this.timestamp = {
        socketMessage: null,
        shareScreen: null,
        refreshConnection: null,
        getUserMedia: null,
        lastRestart: null,
      };
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
       * This is to prevent too many sent over less than a second interval that might cause dropped messages
       *   or jams to the Signaling connection.
       * @name socketMessageQueue
       * @type Array
       * @since 0.5.8
       * @private
       */
      this.socketMessageQueue = [];
      /**
       * Stores the <code>setTimeout</code> to sent queued socket messages.
       * @name socketMessageTimeout
       * @type Object
       * @since 0.5.8
       * @private
       */
      this.socketMessageTimeout = null;
      /**
       * Stores the list of socket ports to use to connect to the Signaling.
       * These ports are defined by default which is commonly used currently by the Signaling.
       * Should re-evaluate this sometime.
       * @name socketPorts
       * @property {Array} http: The list of HTTP socket ports.
       * @property {Array} https: The list of HTTPS socket ports.
       * @type JSON
       * @since 0.5.8
       * @private
       */
      this.socketPorts = skylinkApiResponse.socketPorts;
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
      this.signalingServer = skylinkApiResponse.signalingServer;
      /**
       * Stores the Signaling server protocol.
       * @name signalingServerProtocol
       * @type string
       * @since 0.5.4
       * @private
       */
      this.signalingServerProtocol = window.location.protocol;
      /**
       * Stores the Signaling server port.
       * @name signalingServerPort
       * @type number
       * @since 0.5.4
       * @private
       */
      this.signalingServerPort = null;
      /**
       * Stores the Signaling socket connection object.
       * @name socket
       * @type io
       * @since 0.1.0
       * @private
       */
      this.socket = null;
      /**
       * Stores the flag that indicates if XDomainRequest is used for IE 8/9.
       * @name socketUseXDR
       * @type boolean
       * @since 0.5.4
       * @private
       */
      this.socketUseXDR = false;
      /**
       * Stores the value if ICE restart is supported.
       * @name enableIceRestart
       * @type string
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
      this.hasMCU = skylinkApiResponse.hasMCU;
      /**
       * Stores the construct API REST path to obtain Room credentials.
       * @name path
       * @type string
       * @since 0.1.0
       * @private
       */
      this.path = null;
      /**
       * Stores the current <code>init()</code> readyState.
       * @name readyState
       * @type number
       * @since 0.1.0
       * @private
       */
      /**
       * Stores the "cid" used for <code>joinRoom()</code>.
       * @name key
       * @type string
       * @since 0.1.0
       * @private
       */
      this.key = skylinkApiResponse.key;
      /**
       * Stores the "apiOwner" used for <code>joinRoom()</code>.
       * @name appKeyOwner
       * @type string
       * @since 0.5.2
       * @private
       */
      this.appKeyOwner = skylinkApiResponse.appKeyOwner;
      /**
       * Stores the Room credentials information for <code>joinRoom()</code>.
       * @name room
       * @property {string} id The "rid" for <code>joinRoom()</code>.
       * @property {string} token The "roomCred" for <code>joinRoom()</code>.
       * @property {string} startDateTime The "start" for <code>joinRoom()</code>.
       * @property {string} duration The "len" for <code>joinRoom()</code>.
       * @property {string} connection The RTCPeerConnection constraints and configuration. This is not used in the SDK
       *   except for the "mediaConstraints" property that sets the default <code>getUserMedia()</code> settings.
       * @type SkylinkRoom
       * @since 0.5.2
       * @private
       */
      this.room = skylinkApiResponse.room;
      /**
       * Stores the list of Peer messages timestamp.
       * @name peerMessagesStamps
       * @type JSON
       * @since 0.6.15
       * @private
       */
      this.peerMessagesStamps = {};
      /**
       * Stores the Streams.
       * @name streams
       * @type JSON
       * @since 0.6.15
       * @private
       */
      this.streams = {
        userMedia: null,
        screenshare: null,
      };
      /**
       * Stores the default camera Stream settings.
       * @name streamsDefaultSettings
       * @type JSON
       * @since 0.6.15
       * @private
       */
      this.streamsDefaultSettings = {
        userMedia: {
          audio: {
            stereo: false,
          },
          video: {
            resolution: {
              width: 640,
              height: 480,
            },
            frameRate: 50,
          },
        },
        screenshare: {
          video: true,
        },
      };
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
        googleX: {},
        bAS: {},
      };
      /**
       * Stores all the Stream stopped callbacks.
       * @name streamsStoppedCbs
       * @type JSON
       * @since 0.6.15
       * @private
       */
      /**
       * Stores the session description settings.
       * @name sdpSettings
       * @type JSON
       * @since 0.6.16
       * @private
       */
      this.sdpSettings = {
        connection: {
          audio: true,
          video: true,
          data: true,
        },
        direction: {
          audio: { send: true, receive: true },
          video: { send: true, receive: true },
        },
      };
      /**
       * Stores the publish only settings.
       * @name publishOnly
       * @type boolean
       * @since 0.6.16
       * @private
       */
      this.publishOnly = false;
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
       * Stores the session description orders and info.
       * @name sdpSessions
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.sdpSessions = {};
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
       * Stores the datachannel binary data chunk type.
       * @name binaryChunkType
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.binaryChunkType = DATA_TRANSFER_DATA_TYPE.ARRAY_BUFFER;
      /**
       * Stores the RTCPeerConnection configuration.
       * @name peerConnectionConfig
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.peerConnectionConfig = {};
      /**
       * Stores the auto bandwidth settings.
       * @name bandwidthAdjuster
       * @type JSON
       * @since 0.6.18
       * @private
       */
      this.bandwidthAdjuster = null;
      /**
       * Stores the Peer connection status.
       * @name peerConnStatus
       * @type JSON
       * @since 0.6.19
       * @private
       */
      this.peerConnStatus = {};
      /**
       * Stores the flag to temporarily halt joinRoom() from processing.
       * @name joinRoomManager
       * @type boolean
       * @since 0.6.19
       * @private
       */
      this.joinRoomManager = {
        timestamp: 0,
        socketsFn: [],
      };
      /**
       * Stores the unique random number used for generating the "client_id".
       * @name statIdRandom
       * @type number
       * @since 0.6.31
       * @private
       */
      this.statIdRandom = Date.now() + Math.floor(Math.random() * 100000000);
      /**
       * Stores the list of RTMP Sessions.
       * @name rtmpSessions
       * @type JSON
       * @since 0.6.36
       * @private
       */
      this.rtmpSessions = {};
      /**
       * Stores the SM Protocol Version
       * @type {string}
       */
      this.SMProtocolVersion = SM_PROTOCOL_VERSION;
      /**
       * Stores the DT Protocol Version
       * @type {string}
       */
      this.DTProtocolVersion = DT_PROTOCOL_VERSION;
      /**
       * Originally negotiated DTLS role of this peer.
       * @name originalDTLSRole
       * @type string
       * @since 1.0.0
       * @private
       */
      this.originalDTLSRole = null;
      /**
       * Offer bufferred in order to apply when received answer
       * @name bufferedLocalOffer
       * @type Object
       * @private
       * @since 1.0.0
       */
      this.bufferedLocalOffer = {};
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
      this.clientId = generateUUID();
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
       * Stores the remote streams of all peers.
       * @name remoteStreams
       * @type Object
       * @private
       * @since 2.0.0
       */
      this.remoteStreams = {};
    }
  }

  /**
   * @description Method that starts the Room Session.
   * @param {joinRoomOptions} [options] The options available to join the room and configure the session.
   * @param {MediaStream} [prefetchedStream] The prefetched media stream object obtained when the user calls getUserMedia before joinRoom.
   * @return {Promise} Promise object with MediaStream.
   * @memberOf Room
   * @alias Room.joinRoom
   * @private
   */
  const joinRoom = (options = {}, prefetchedStream) => new Promise((resolve, reject) => {
    const apiServer = new SkylinkAPIServer();
    const signalingServer = new SkylinkSignalingServer();
    let initOptions = Skylink.getInitOptions();
    const handleClientStats = new HandleClientStats();
    const roomName = SkylinkAPIServer.getRoomNameFromParams(options) ? SkylinkAPIServer.getRoomNameFromParams(options) : initOptions.defaultRoom;

    dispatchEvent(readyStateChange({
      readyState: READY_STATE_CHANGE$1.LOADING,
      error: null,
      room: roomName,
    }));

    apiServer.createRoom(roomName).then((result) => {
      const { endpoint, response } = result;
      response.roomName = roomName;
      const skylinkApiResponse = new SkylinkApiResponse(response);
      initOptions = apiServer.enforceUserInitOptions(skylinkApiResponse);
      const skylinkState = new SkylinkState(initOptions);

      skylinkState.userData = options.userData || '';
      skylinkState.path = endpoint;
      Skylink.setSkylinkState(skylinkState, roomName);

      apiServer.checkCodecSupport(skylinkState.room.id).then(() => {
        handleClientStats.send(skylinkState.room.id);
        return signalingServer.createSocket(response.room_key).then(() => {
          const room = SkylinkAPIServer.getStateByKey(response.room_key);
          const userMediaParams = Object.assign({}, options);

          userMediaParams.room = room;
          if (prefetchedStream || (options.id && options.active)) { // check for prefetched stream as the only arg
            MediaStream.usePrefetchedStream(response.room_key, prefetchedStream, options).then(() => {
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
            signalingServer.joinRoom(room);
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

    updatedState.roomLocked = lockRoom;
    Skylink.setSkylinkState(updatedState, room.id);

    signalingServer.roomLock(updatedState);

    dispatchEvent(roomLock({
      isLocked: updatedState.roomLocked,
      peerInfo: PeerData.getCurrentSessionInfo(room),
      peerId: user.sid,
      isSelf: true,
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
   * @classdesc Class that contains the methods for Room.
   * @private
   */
  class Room {
    /** @lends Room */
    static leaveRoom(args) {
      return leaveRoom(args);
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

    static joinRoom(args) {
      return joinRoom(args);
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
   * @param {string|null} streamId
   * @param {string|null} endpoint
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

  var helpers$7 = {
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
          const result = helpers$7.checkRTMPDependencies(isStartRTMPSession, roomState, streamId, endpoint);
          const gRtmpId = rtmpId || generateUUID();

          if (result.shouldProceed) {
            helpers$7.registerRTMPEventListenersAndResolve(isStartRTMPSession, resolve);
            helpers$7.sendRTMPMessageViaSig(roomState, isStartRTMPSession, gRtmpId, streamId, endpoint);
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
     * @param {joinRoomOptions} [options] - The options available to join the room and configure the session.
     * @param {MediaStream} [prefetchedStream] - The pre-fetched media stream object obtained when the user calls {@link Skylink#getUserMedia|getUserMedia} method before {@link Skylink#joinRoom|joinRoom} method.
     * @return {Promise.<Array<MediaStream|null>>} Promise object with an array of
     * <code>MediaStreams</code> or null if pre-fetched stream was passed into <code>joinRoom</code> method.
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
     * const prefetchedStream = skylink.getUserMedia();
     *
     * skylink.joinRoom(prefetchedStream)
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
     * Consider using {@link Skylink#sendURLData|sendURLData} if you are sending large strings to peers.
     * @param {String|JSON} message - The message.
     * @param {String|Array|null} [targetPeerId] - The target peer id to send message to.
     * When provided as an Array, it will send the message to only peers which ids are in the list.
     * When not provided, it will broadcast the message to all connected peers with data channel connection in a room.
     * @param {String|null} [roomName] - The name of the room the message is intended for.
     * When not provided, the message will be broadcast to all rooms where targetPeerId(s) are found (if provided).
     * Note when roomName is provided, targetPeerId should be provided as null.
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
     * @fires {@link SkylinkEvents.event:onIncomingMessage|onIncomingMessage}
     * @alias Skylink#sendP2PMessage
     */
    sendP2PMessage(message, targetPeerId = null, roomName = null) {
      if (getParamValidity(message, 'message', 'sendP2PMessage')) {
        return PeerConnection.sendP2PMessage(message, targetPeerId, roomName);
      }

      return null;
    }

    /**
     * @description Function that sends a message to peers via the Signaling socket connection.
     * @param {String} roomName - room name to send the message.
     * @param {String|JSON} message - The message.
     * @param {String|Array} [targetPeerId] - The target peer id to send message to.
     * - When provided as an Array, it will send the message to only peers which ids are in the list.
     * - When not provided, it will broadcast the message to all connected peers in the room.
     * @return {null}
     * @example
     * Example 1: Broadcasting to all peers
     *
     * let sendMessage = (roomName) => {
     *    const message = "Hi!";
     *    const selectedPeers = this.state[location]['selectedPeers'];
     *    this.skylink.sendMessage(roomName, message, selectedPeers);
     * }
     * @example
     * Example 2: Broadcasting to selected peers
     *
     * let sendMessage = (roomName) => {
     *    const message = "Hi all!";
     *    const selectedPeers = ["PeerID_1", "PeerID_2"];
     *    this.skylink.sendMessage(roomName, message, selectedPeers);
     * }
     * @fires {@link SkylinkEvents.event:onIncomingMessage|onIncomingMessage}
     * @alias Skylink#sendMessage
     * @since 0.4.0
     */
    sendMessage(roomName = null, message, targetPeerId) {
      const roomState = getRoomStateByName(roomName);
      const signaling = new SkylinkSignalingServer();
      if (roomState) {
        signaling.sendUserMessage(roomState, message, targetPeerId);
      }

      return null;
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
        return PeerData.getPeerInfo(peerId, roomState);
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
     * @fires {@link SkylinkEvents.event:peerUpdated|peerUpdatedEvent} event if peer is in room with <code>isSelf=true</code>.
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
     * <blockquote class="info">
     * Note that this is not well supported in the Edge browser.
     * </blockquote>
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
     * @param {Boolean} showAll - The flag if Signaling server should also return the list of privileged peer ids.
     * @param {Boolean} showAll - The flag if Signaling server should also return the list of privileged peer ids.
     * By default, the Signaling server does not include the list of privileged peer ids in the return result.
     * @return {Promise.<Object.<String, Array<String>>>} peerList - Array of peer ids, keyed by room name.
     * @fires {@link SkylinkEvents.event:getPeersStateChange|getPeersStateChangeEvent} with parameter payload <code>state=ENQUIRED</code> upon calling <code>getPeers</code> method.
     * @fires {@link SkylinkEvents.event:getPeersStateChange|getPeersStateChangeEvent} with parameter payload <code>state=RECEIVED</code> when peer list is received from Signaling server.
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
    getPeers(roomName, showAll) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerPrivileged.getPeerList(roomState.room, showAll);
      }

      return null;
    }

    /**
     * @typedef {Object.<String, Object>} peersStreamsInfo
     * @property {Object.<String, Object>} #peerId - Peer streams info keyed by peer id.
     * @property {Boolean} #peerId.isSelf - The flag if the peer is local or remote.
     * @property {MediaStream} #peerId.#streamId - streams keyed by stream id.
    /**
     * @description Method that returns the list of connected peers streams in the room both user media streams and screen share streams.
     * @param {String} roomName - The room name.
     * @param {Boolean} [includeSelf=true] - The flag if self streams are included.
     * @return {JSON.<String, peersStreamsInfo>} - The list of peer stream objects keyed by peer id.
     * @example
     * Example 1: Get the list of current peers streams in the same room
     *
     * const streams = skylink.getPeersStream("Room_1");
     * @alias Skylink#getPeersStream
     * @since 0.6.16
     */
    getPeersStream(roomName, includeSelf) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerData.getPeersStream(roomState, includeSelf);
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
     * @typedef {Object} customSettings
     * @property {Object} settings - The peer stream and data settings.
     * @property {Boolean|JSON} settings.data - The flag if peer has any data channel connections enabled.
     *   If <code>isSelf</code> value is <code>true</code>, this determines if user allows
     *   data channel connections, else if value is <code>false</code>, this determines if peer has any active
     *   data channel connections (where {@link SkylinkEvents.event:onDataChannelStateChanged|onDataChannelStateChangedEvent}
     *   triggers <code>state</code> as <code>OPEN</code> and <code>channelType</code> as
     *   <code>MESSAGING</code> for peer) with peer.
     * @property {Boolean|JSON} settings.audio - The peer stream audio settings.
     *   When defined as <code>false</code>, it means there is no audio being sent from peer.
     *   When defined as <code>true</code>, the <code>settings.audio.stereo</code> value is
     *   considered as <code>false</code> and the <code>settings.audio.exactConstraints</code>
     *   value is considered as <code>false</code>.
     * @property {Boolean} settings.audio.stereo - The flag if stereo band is configured
     *   when encoding audio codec is <a href="#attr_AUDIO_CODEC"><code>OPUS</code></a> for receiving audio data.
     * @property {Boolean} [settings.audio.usedtx]
     *   Note that this feature might not work depending on the browser support and implementation.
     *   The flag if DTX (Discontinuous Transmission) is configured when encoding audio codec
     *   is <a href="#attr_AUDIO_CODEC"><code>OPUS</code></a> for sending audio data.
     *   This might help to reduce bandwidth it reduces the bitrate during silence or background noise.
     *   When not defined, the default browser configuration is used.
     * @property {Boolean} [settings.audio.useinbandfec]
     *   Note that this feature might not work depending on the browser support and implementation.
     *   The flag if capability to take advantage of in-band FEC (Forward Error Correction) is
     *   configured when encoding audio codec is <a href="#attr_AUDIO_CODEC"><code>OPUS</code></a> for sending audio data.
     *   This might help to reduce the harm of packet loss by encoding information about the previous packet.
     *   When not defined, the default browser configuration is used.
     * @property {Number} [settings.audio.maxplaybackrate]
     *   Note that this feature might not work depending on the browser support and implementation.
     *   The maximum output sampling rate rendered in Hertz (Hz) when encoding audio codec is
     *   <a href="#attr_AUDIO_CODEC"><code>OPUS</code></a> for sending audio data.
     *   This value must be between <code>8000</code> to <code>48000</code>.
     *   When not defined, the default browser configuration is used.
     * @property {Boolean} settings.audio.echoCancellation - The flag if echo cancellation is enabled for audio tracks.
     * @property {Array} [settings.audio.optional] The peer stream <code>navigator.getUserMedia()</code> API
     *   <code>audio: { optional [..] }</code> property.
     * @property {String} [settings.audio.deviceId] - The peer stream audio track source id of the device used.
     * @property {Boolean} settings.audio.exactConstraints - The flag if peer stream audio track is sending exact
     *   requested values of <code>settings.audio.deviceId</code> when provided.
     * @property {Boolean|JSON} settings.video - The peer stream video settings.
     *   When defined as <code>false</code>, it means there is no video being sent from peer.
     *   When defined as <code>true</code>, the <code>settings.video.screenshare</code> value is
     *   considered as <code>false</code>  and the <code>settings.video.exactConstraints</code>
     *   value is considered as <code>false</code>.
     * @property {JSON} [settings.video.resolution] - The peer stream video resolution.
     *   [Rel: {@link SkylinkConstants.VIDEO_RESOLUTION|VIDEO_RESOLUTION}]
     * @property {Number|JSON} settings.video.resolution.width - The peer stream video resolution width or
     *   video resolution width settings.
     *   When defined as a JSON Object, it is the user set resolution width settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Number|JSON} settings.video.resolution.height - The peer stream video resolution height or
     *   video resolution height settings.
     *   When defined as a JSON Object, it is the user set resolution height settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Number|JSON} [settings.video.frameRate] - The peer stream video
     *   <a href="https://en.wikipedia.org/wiki/Frame_rate">frameRate</a> per second (fps) or video frameRate settings.
     *   When defined as a JSON Object, it is the user set frameRate settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Boolean} settings.video.screenshare - The flag if peer stream is a screensharing stream.
     * @property {Array} [settings.video.optional] - The peer stream <code>navigator.getUserMedia()</code> API
     *   <code>video: { optional [..] }</code> property.
     * @property {String} [settings.video.deviceId] - The peer stream video track source id of the device used.
     * @property {Boolean} settings.video.exactConstraints The flag if peer stream video track is sending exact
     *   requested values of <code>settings.video.resolution</code>,
     *   <code>settings.video.frameRate</code> and <code>settings.video.deviceId</code>
     *   when provided.
     * @property {String|JSON} [settings.video.facingMode] - The peer stream video camera facing mode.
     *   When defined as a JSON Object, it is the user set facingMode settings with (<code>"min"</code> or
     *   <code>"max"</code> or <code>"ideal"</code> or <code>"exact"</code> etc configurations).
     * @property {Object} settings.bandwidth The maximum streaming bandwidth sent from peer.
     * @property {Number} [settings.bandwidth.audio] - The maximum audio streaming bandwidth sent from peer.
     * @property {Number} [settings.bandwidth.video] - The maximum video streaming bandwidth sent from peer.
     * @property {Number} [settings.bandwidth.data] - The maximum data streaming bandwidth sent from peer.
     * @property {Object} settings.googleXBandwidth
     *   Note that this feature might not work depending on the browser support and implementation,
     *   and its properties and values are only defined for user's end and cannot be viewed
     *   from peer's end (when <code>isSelf</code> value is <code>false</code>).
     *   The experimental google video streaming bandwidth sent to peers.
     * @property {Number} [settings.googleXBandwidth.min] - The minimum experimental google video streaming bandwidth sent to peers.
     * @property {Number} [settings.googleXBandwidth.max] - The maximum experimental google video streaming bandwidth sent to peers.
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
     *   "restart" case is to invoke {@link Skylink#joinRoom}again, or that it is
     *   not supported by the MCU.</blockquote>
     *   The flag if ICE connections should restart when refreshing peer connections.
     *   This is used when ICE connection state is <code>FAILED</code> or <code>DISCONNECTED</code>, which state
     *   can be retrieved with the {@link SkylinkEvents.event:iceConnectionState|iceConnectionStateEvent}
     * @param {JSON} [options] <blockquote class="info">
     *   Note that for MCU connections, the <code>bandwidth</code> or <code>googleXBandwidth</code>
     *   settings will override for all peers or the current room connection session settings.</blockquote>
     *   The custom peer configuration settings.
     * @param {JSON} [options.bandwidth] The configuration to set the maximum streaming bandwidth to send to peers.
     *   Object signature follows {@link Skylink#joinRoom}
     *   <code>options.bandwidth</code> settings.
     * @param {JSON} [options.googleXBandwidth] The configuration to set the experimental google
     *   video streaming bandwidth sent to peers.
     *   Object signature follows {@link Skylink#joinRoom}
     *   <code>options.googleXBandwidth</code> settings.
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
     * @param {Boolean} replaceUserMediaStream - The flag if screenshare replaces the <code>userMedia</code> stream.
     * @param {String} [streamId] - The stream id of the <code>userMedia</code> stream to replace. streamId must be provided if there is more than
     * one <code>userMedia</code> stream on the peer connection and replaceUserMediaStream is true.
     * @return {MediaStream|null} - The screen share stream.
     * @example
     * Example 1: Replace selected stream with screen share stream
     *
     * let shareScreenReplace = () => {
     *    // Retrieve all userMedia streams
     *    const streamList = skylink.retrieveStreams(roomName);
     *    skylink.shareScreen(roomName, true, Object.keys(streamList.userMedia)[0]).then((screenStream) => {
     *      window.attachMediaStream(localVideoElement, screenStream);
     *    });
     * }
     * @alias Skylink#shareScreen
     * @since 2.0.0
     */
    shareScreen(roomName, replaceUserMediaStream, streamId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        const screenSharing = new ScreenSharing(roomState);
        return screenSharing.start(replaceUserMediaStream, streamId);
      }

      return null;
    }

    /**
     * @description Method that returns the screenshare stream id of peers.
     * @param {String} roomName - The room name.
     * @return {Object.<String, MediaStream>|null} screenshareStream - The peer screen share stream keyed by peer id if there is one.
     * @alias Skylink#getPeersScreenshare
     * @since 2.0.0
     */
    getPeersScreenshare(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return PeerConnection.getPeerScreenshare(roomState);
      }

      return null;
    }

    /**
     * <blockquote class="info">
     *   For a better user experience, the functionality is throttled when invoked many times in less
     *   than the milliseconds interval configured in the {@link initOptions}.
     * </blockquote>
     * @description Method that retrieves camera stream.
     * @param {String|null} roomName - The room name.
     * - If no roomName is passed or <code>getUserMedia()</code> is called before {@link Skylink#joinRoom|joinRoom}, the returned stream will not be associated with a room. The stream must be maintained independently.
     * To stop the stream, call {@link Skylink#stopPrefetchedStream|stopPrefetchedStream} method.
     * @param {JSON} [options] - The camera stream configuration options.
     * - When not provided, the value is set to <code>{ audio: true, video: true }</code>.
     *   To fallback to retrieve audio track only when retrieving of audio and video tracks failed,
     *   enable the <code>audioFallback</code> flag in the {@link initOptions}.
     * @param {Boolean} [options.useExactConstraints=false] <blockquote class="info">
     *   Note that by enabling this flag, exact values will be requested when retrieving camera stream,
     *   but it does not prevent constraints related errors. By default when not enabled,
     *   expected mandatory maximum values (or optional values for source id) will requested to prevent constraints related
     *   errors, with an exception for <code>options.video.frameRate</code> option in Safari and IE (any plugin-enabled) browsers,
     *   where the expected maximum value will not be requested due to the lack of support.</blockquote>
     *   The flag if <code>getUserMedia()</code> should request for camera stream to match exact requested values of
     *   <code>options.audio.deviceId</code> and <code>options.video.deviceId</code>, <code>options.video.resolution</code>
     *   and <code>options.video.frameRate</code> when provided.
     * @param {Boolean|JSON} [options.audio=false] <blockquote class="info">
     *    Note that the current Edge browser implementation does not support the <code>options.audio.optional</code>,
     *    <code>options.audio.deviceId</code>, <code>options.audio.echoCancellation</code>.</blockquote>
     *    The audio configuration options.
     * @param {Boolean} [options.audio.stereo=false] <blockquote class="info"><b>Deprecation Warning!</b>
     *   This property has been deprecated. Configure this with the <code>options.codecParams.audio.opus.stereo</code> and
     *   the <code>options.codecParams.audio.opus["sprop-stereo"]</code>
     *   parameter in the {@link initOptions} instead. If the
     *   <code>options.codecParams.audio.opus.stereo</code> or <code>options.codecParams.audio.opus["sprop-stereo"]</code>
     *   is configured, this overrides the <code>options.audio.stereo</code> setting.</blockquote>
     *   The flag if OPUS audio codec stereo band should be configured for sending encoded audio data.
     *   When not provided, the default browser configuration is used.
     * @param {Boolean} [options.audio.usedtx] <blockquote class="info"><b>Deprecation Warning!</b>
     *   This property has been deprecated. Configure this with the <code>options.codecParams.audio.opus.stereo</code>
     *   parameter in the {@link initOptions} instead. If the
     *   <code>options.codecParams.audio.opus.stereo</code> is configured, this overrides the
     *   <code>options.audio.stereo</code> setting.  Note that this feature might
     *   not work depending on the browser support and implementation.</blockquote>
     *   The flag if OPUS audio codec should enable DTX (Discontinuous Transmission) for sending encoded audio data.
     *   This might help to reduce bandwidth as it reduces the bitrate during silence or background noise, and
     *   goes hand-in-hand with the <code>options.voiceActivityDetection</code> flag in <a href="#method_joinRoom">
     *   <code>joinRoom()</code> method</a>.
     *   When not provided, the default browser configuration is used.
     * @param {Boolean} [options.audio.useinbandfec] <blockquote class="info"><b>Deprecation Warning!</b>
     *   This property has been deprecated. Configure this with the <code>options.codecParams.audio.opus.useinbandfec</code>
     *   parameter in the {@link initOptions} instead. If the
     *   <code>options.codecParams.audio.opus.useinbandfec</code> is configured, this overrides the
     *   <code>options.audio.useinbandfec</code> setting. Note that this parameter should only be used
     *   for debugging purposes only.</blockquote>
     *   The flag if OPUS audio codec has the capability to take advantage of the in-band FEC
     *   (Forward Error Correction) when sending encoded audio data.
     *   This helps to reduce the harm of packet loss by encoding information about the previous packet loss.
     *   When not provided, the default browser configuration is used.
     * @param {Number} [options.audio.maxplaybackrate] <blockquote class="info"><b>Deprecation Warning!</b>
     *   This property has been deprecated. Configure this with the <code>options.codecParams.audio.opus.maxplaybackrate</code>
     *   parameter in the {@link initOptions} instead. If the
     *   <code>options.codecParams.audio.opus.maxplaybackrate</code> is configured, this overrides the
     *   <code>options.audio.maxplaybackrate</code> setting.  Note that this feature might
     *   not work depending on the browser support and implementation.
     *   Note that this parameter should only be used for debugging purposes only.</blockquote>
     *   The OPUS audio codec maximum output sampling rate in Hz (hertz) that is is capable of receiving
     *   decoded audio data, to adjust to the hardware limitations and ensure that any sending audio data
     *   would not encode at a higher sampling rate specified by this.
     *   This value must be between <code>8000</code> to <code>48000</code>.
     *   When not provided, the default browser configuration is used.
     * @param {Boolean} [options.audio.mute=false] The flag if audio tracks should be muted upon receiving them.
     *   Providing the value as <code>false</code> sets <code>peerInfo.mediaStatus.audioMuted</code> to <code>1</code>,
     *   but when provided as <code>true</code>, this sets the <code>peerInfo.mediaStatus.audioMuted</code> value to
     *   <code>0</code> and mutes any existing <a href="#method_shareScreen">
     *   <code>shareScreen()</code> stream</a> audio tracks as well.
     * @param {Array} [options.audio.optional] <blockquote class="info">
     *   This property has been deprecated. "optional" constraints has been moved from specs.<br>
     *   Note that this may result in constraints related error when <code>options.useExactConstraints</code> value is
     *   <code>true</code>. If you are looking to set the requested source id of the audio track,
     *   use <code>options.audio.deviceId</code> instead.</blockquote>
     *   The <code>navigator.getUserMedia()</code> API <code>audio: { optional [..] }</code> property.
     * @param {String} [options.audio.deviceId] <blockquote class="info">
     *   Note this is currently not supported in Firefox browsers.
     *   </blockquote> The audio track source id of the device to use.
     *   The list of available audio source id can be retrieved by the {@link https://developer.
     * mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices}.
     * @param {Boolean} [options.audio.echoCancellation=true] <blockquote class="info">
     *   For Chrome/Opera/IE/Safari/Bowser, the echo cancellation @description Methodality may not work and may produce a terrible
     *   feedback. It is recommended to use headphones or other microphone devices rather than the device
     *   in-built microphones.</blockquote> The flag to enable echo cancellation for audio track.
     * @param {Boolean|JSON} [options.video=false] <blockquote class="info">
     *    Note that the current Edge browser implementation does not support the <code>options.video.optional</code>,
     *    <code>options.video.deviceId</code>, <code>options.video.resolution</code> and
     *    <code>options.video.frameRate</code>, <code>options.video.facingMode</code>.</blockquote>
     *   The video configuration options.
     * @param {Boolean} [options.video.mute=false] The flag if video tracks should be muted upon receiving them.
     *   Providing the value as <code>false</code> sets the <code>peerInfo.mediaStatus.videoMuted</code> value to
     *   <code>1</code>, but when provided as <code>true</code>, this sets the <code>peerInfo.mediaStatus.videoMuted</code> value to
     *   <code>0</code> and mutes any existing <a href="#method_shareScreen">
     *   <code>shareScreen()</code> stream</a> video tracks as well.
     * @param {JSON} [options.video.resolution] The video resolution.
     *   By default, <a href="#attr_VIDEO_RESOLUTION"><code>VGA</code></a> resolution option
     *   is selected when not provided.
     *   [Rel: {@link SkylinkConstants.VIDEO_RESOLUTION|VIDEO_RESOLUTION}]
     * @param {Number|JSON} [options.video.resolution.width] The video resolution width.
     * - When provided as a number, it is the video resolution width.
     * - When provided as a JSON, it is the <code>navigator.mediaDevices.getUserMedia()</code> <code>.width</code> settings.
     *   Parameters are <code>"ideal"</code> for ideal resolution width, <code>"exact"</code> for exact video resolution width,
     *   <code>"min"</code> for min video resolution width and <code>"max"</code> for max video resolution width.
     *   Note that this may result in constraints related errors depending on the browser/hardware supports.
     * @param {Number|JSON} [options.video.resolution.height] The video resolution height.
     * - When provided as a number, it is the video resolution height.
     * - When provided as a JSON, it is the <code>navigator.mediaDevices.getUserMedia()</code> <code>.height</code> settings.
     *   Parameters are <code>"ideal"</code> for ideal video resolution height, <code>"exact"</code> for exact video resolution height,
     *   <code>"min"</code> for min video resolution height and <code>"max"</code> for max video resolution height.
     *   Note that this may result in constraints related errors depending on the browser/hardware supports.
     * @param {Number|JSON} [options.video.frameRate] The video {@link https://en.wikipedia.org/wiki/Frame_rate} per second (fps).
     * - When provided as a number, it is the video framerate.
     * - When provided as a JSON, it is the <code>navigator.mediaDevices.getUserMedia()</code> <code>.frameRate</code> settings.
     *   Parameters are <code>"ideal"</code> for ideal video framerate, <code>"exact"</code> for exact video framerate,
     *   <code>"min"</code> for min video framerate and <code>"max"</code> for max video framerate.
     *   Note that this may result in constraints related errors depending on the browser/hardware supports.
     * @param {Array} [options.video.optional] <blockquote class="info">
     *   This property has been deprecated. "optional" constraints has been moved from specs.<br>
     *   Note that this may result in constraints related error when <code>options.useExactConstraints</code> value is
     *   <code>true</code>. If you are looking to set the requested source id of the video track,
     *   use <code>options.video.deviceId</code> instead.</blockquote>
     *   The <code>navigator.getUserMedia()</code> API <code>video: { optional [..] }</code> property.
     * @param {String} [options.video.deviceId] <blockquote class="info">
     *   Note this is currently not supported in Firefox browsers.
     *   </blockquote> The video track source id of the device to use.
     *   The list of available video source id can be retrieved by the {@link https://developer.
     * mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices}.
     * @param {String|JSON} [options.video.facingMode] The video camera facing mode.
     *   The list of available video source id can be retrieved by the {@link https://developer.mozilla.org
     *   /en-US/docs/Web/API/MediaTrackConstraints/facingMode}.
     * @return {Promise<MediaStream>} MediaStream
     * @example
     * Example 1: Get both audio and video after joinRoom
     *
     * skylink.getUserMedia(roomName, {
     *     audio: true,
     *     video: true,
     * }).then((stream) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 2: Get only audio
     *
     * skylink.getUserMedia(roomName, {
     *     audio: true,
     *     video: false,
     * }).then((stream) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 3: Configure resolution for video
     *
     * skylink.getUserMedia(roomName, {
     *     audio: true,
     *     video: { resolution: skylinkConstants.VIDEO_RESOLUTION.HD },
     * }).then((stream) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 4: Configure stereo flag for OPUS codec audio (OPUS is always used by default)
     *
     * this.skylink.getUserMedia(roomName, {
     *     audio: {
     *         stereo: true,
     *     },
     *     video: true,
     * }).then((stream) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 5: Get both audio and video before joinRoom
     *
     * // Note: the prefetched stream must be maintained independently
     * skylink.getUserMedia({
     *     audio: true,
     *     video: true,
     * }).then((stream) => // do something)
     * .catch((error) => // handle error);
     * @example
     * Example 6: Get media sources before joinRoom - only available on Chrome browsers
     *
     * const audioInputDevices = [];
     * const videoInputDevices = [];
     *
     * navigator.mediaDevices.enumerateDevices().then((devices) => {
     *   devices.forEach((device) => {
     *     if (device.kind === "audioinput") {
     *       audioInputDevices.push(device);
     *     }
     *
     *     if (device.kind === "videoinput") {
     *       videoInputDevices.push(device);
     *     }
     *   })
     * }).catch((error) => // handle error);
     *
     * skylink.getUserMedia(roomName, {
     *   audio: {
     *     deviceId: audioInputDevices[0].deviceId,
     *   },
     *   video: {
     *     deviceId: videoInputDevices[0].deviceId,
     *   }
     * }).then((stream) => // do something)
     * .catch((error) => // handle error);
     * @fires <b>If retrieval of fallback audio stream is successful:</b> <br/> - {@link SkylinkEvents.event:mediaAccessSuccess|mediaAccessSuccessEvent} with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallback=false</code> if initial retrieval is successful.
     * @fires <b>If initial retrieval is unsuccessful:</b> <br/> Fallback to retrieve audio only stream is triggered (configured in {@link initOptions} <code>audioFallback</code>) <br/>&emsp; - {@link SkylinkEvents.event:mediaAccessFallback|mediaAccessFallbackEvent} with parameter payload <code>state=FALLBACKING</code>, <code>isScreensharing=false</code> and <code>isAudioFallback=true</code> and <code>options.video=true</code> and <code>options.audio=true</code>. <br/> No fallback to retrieve audio only stream <br/> - {@link SkylinkEvents.event:mediaAccessError|mediaAccessErrorEvent} with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallbackError=false</code>.
     * @fires <b>If retrieval of fallback audio stream is successful:</b> <br/> - {@link SkylinkEvents.event:mediaAccessSuccess|mediaAccessSuccessEvent} with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallback=true</code>.
     * @fires <b>If retrieval of fallback audio stream is unsuccessful:</b> <br/> - {@link SkylinkEvents.event:mediaAccessFallback|mediaAccessFallbackEvent} with parameter payload <code>state=ERROR</code>, <code>isScreensharing=false</code> and <code>isAudioFallback=true</code>. <br/> - {@link SkylinkEvents.event:mediaAccessError|mediaAccessErrorEvent} with parameter payload <code>isScreensharing=false</code> and <code>isAudioFallbackError=true</code>.
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
          return MediaStream.getUserMediaLayer(roomState, options);
        }
      } else if (isAObj(roomName)) {
        return statelessGetUserMedia(roomName);
      }
    }

    /**
     * @description Method that stops the {@link Skylink#getUserMedia} stream that is called without roomName param or before {@link Skylink#joinRoom|joinRoom} is called.
     * @param {MediaStream} stream - The prefetched stream.
     * @return {null}
     * @fires {@link SkylinkEvents.event:streamEnded|streamEndedEvent}
     * @alias Skylink#stopPrefetchedStream
     * @since 2.0
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
     * @fires {@link SkylinkEvents.event:mediaAccessStopped|mediaAccessStoppedEvent} with parameter payload <code>isScreensharing</code> value as <code>true</code> and <code>isAudioFallback</code> value as <code>false</code> if there is a screen stream
     * @fires {@link SkylinkEvents.event:streamEnded|streamEndedEvent} with parameter payload <code>isSelf</code> value as <code>true</code> and <code>isScreensharing</code> value as <code>true</code> if user is in the room
     * @fires {@link SkylinkEvents.event:peerUpdated|peerUpdatedEvent} with parameter payload <code>isSelf</code> value as <code>true</code>
     * @fires {@link SkylinkEvents.event:onIncomingStream|onIncomingStreamEvent} with parameter payload <code>isSelf</code> value as <code>true</code> and <code>stream</code> as {@link Skylink#getUserMedia} stream</a> if there is an existing <code>userMedia</code> stream
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
     * @return {null}
     * @example
     * skylink.stopStream(roomName);
     * @fires {@link SkylinkEvents.event:mediaAccessStopped|mediaAccessStoppedEvent} with parameter payload <code>isSelf=true</code> and <code>isScreensharing=false</code> if there is a <code>getUserMedia</code> stream.
     * @fires {@link SkylinkEvents.event:streamEnded|streamEndedEvent} with parameter payload <code>isSelf=true</code> and <code>isScreensharing=false</code> if there is a <code>getUserMedia</code> stream and user is in a room.
     * @fires {@link SkylinkEvents.event:peerUpdated|peerUpdatedEvent} with parameter payload <code>isSelf=true</code>.
     * @alias Skylink#stopStream
     * @since 0.5.6
     */
    stopStream(roomName, streamId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return MediaStream.stopStream(roomState, streamId);
      }

      return null;
    }

    /**
     * @description Method that stops the room session.
     * @param {String} roomName  - The room name to leave.
     * @return {Promise.<Boolean|error>}
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
     * @return {null}
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
     * @return {Promise<string>} recordingId - The recording session id.
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
     * @fires {@link SkylinkEvents.recordingState|recordingStateEvent} with payload <code>state=START</code> if recording has started successfully.
     * @fires {@link SkylinkEvents.recordingState|recordingStateEvent} with payload <code>error</code> if an error occurred during recording.
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
     * @return {Promise<string>} recordingId - The recording session id.
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
     * @fires {@link SkylinkEvents.recordingState|recordingStateEvent} with payload <code>state=STOP</code> if recording has stopped successfully.
     * @fires {@link SkylinkEvents.recordingState|recordingStateEvent} with payload <code>error</code> if an error occurred during recording.
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
     * @fires {@link SkylinkEvents.event:roomLock|roomLockEvent} with payload parameters <code>isLocked=true</code> when the room is successfully locked.
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
     * @fires {@link SkylinkEvents.event:roomLock|roomLockEvent} with payload parameters <code>isLocked=false</code> when the room is successfully locked.
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
     *   {@link SkylinkEvents.event:recordingState|recordingStateEvent} event.
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
     * @param {String} streamId - The id of the stream to mute.
     * @return {null}
     * @example
     * Example 1: Mute both audio and video tracks in all streams
     *
     * skylink.muteStream(roomName, {
     *    audioMuted: true,
     *    videoMuted: true
     * });
     * @example
     * Example 2: Mute only audio tracks in all streams
     *
     * skylink.muteStream(roomName, {
     *    audioMuted: true,
     *    videoMuted: false
     * });
     * @example
     * Example 3: Mute only video tracks in all streams
     *
     * skylink.muteStream(roomName, {
     *    audioMuted: false,
     *    videoMuted: true
     * });
     * @fires <b>On local peer:</b> {@link SkylinkEvents.event:localMediaMuted|localMediaMutedEvent}, {@link SkylinkEvents.event:streamMuted|streamMuted}, {@link SkylinkEvents.event:peerUpdated|peerUpdatedEvent} with payload parameters <code>isSelf=true</code> and <code>isAudio=true</code> if a local audio stream is muted or <code>isVideo</code> if local video stream is muted.
     * @fires <b>On remote peer:</b> {@link SkylinkEvents.event:streamMuted|streamMuted}, {@link SkylinkEvents.event:peerUpdated|peerUpdatedEvent} with with parameter payload <code>isSelf=false</code> and <code>isAudio=true</code> if a remote audio stream is muted or <code>isVideo</code> if remote video stream is muted.
     * @alias Skylink#muteStream
     * @since 0.5.7
     */
    muteStream(roomName, options = { audioMuted: true, videoMuted: true }, streamId) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return MediaStream.muteStream(roomState, options, streamId);
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
     * @return {Promise<string>} rtmpId - The RTMP session id.
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
     * @fires {@link SkylinkEvents.event:rtmpState|rtmpStateEvent} with parameter payload <code>state=START</code>.
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
     * @return {Promise<string>}
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
     * @fires {@link SkylinkEvents.event:rtmpState|rtmpStateEvent} with parameter payload <code>state=STOP</code>.
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
     */
    getStreamSources() {
      return MediaStream.getStreamSources();
    }

    /**
     * @description Method that sends a new <code>userMedia</code> stream to all connected peers in a room.
     * @param {String} roomName - The room name.
     * @param {JSON|MediaStream} options - The {@link Skylink#getUserMedia|getUserMedia} <code>options</code> parameter settings. The MediaStream to send to the remote peer.
     * - When provided as a <code>MediaStream</code> object, this configures the <code>options.audio</code> and
     *   <code>options.video</code> based on the tracks available in the <code>MediaStream</code> object.
     *   Object signature matches the <code>options</code> parameter in the
     *   <code>getUserMedia</code> method</a>.
     * @return {Promise.<MediaStream|Array<MediaStream>>}
     * @example
     * Example 1: Send new MediaStream with audio and video
     *
     * let sendStream = (roomName) => {
     * const options = { audio: true, video: true };
     *
     * // Add listener to incomingStream event
     * SkylinkEventManager.addEventListener(SkylinkConstants.EVENTS.INCOMING_STREAM, (evt) => {
     *   const { detail } = evt;
     *   window.attachMediaStream(localVideoEl, detail.stream);
     * })
     *
     * skylink.sendStream(roomName, options)
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
     * @fires {@link SkylinkEvents.event:mediaAccessSuccess} with parameter payload <code>isScreensharing=false</code> and
     * <code>isAudioFallback=false</code> if <code>userMedia</code> <code>options</code> is passed into
     * <code>sendStream</code> method.
     * @fires {@link SkylinkEvents.event:onIncomingStream} with parameter payload <code>isSelf=true</code> and
     * <code>stream</code> as <code>userMedia</code> stream.
     * @fires {@link SkylinkEvents.event:peerUpdated} with parameter payload <code>isSelf=true</code>.
     * @alias Skylink#sendStream
     * @since 0.5.6
     */
    sendStream(roomName, options, streamId) {
      const roomState = getRoomStateByName(roomName);

      return MediaStream.sendStream(roomState, options, streamId);
    }

    /**
     * @typedef {Object} screenSources - The list of screensharing media sources and screen sources.
     * @property {Array.<string>} mediaSource - The screensharing media source item.
     * @property {Array.<Object>} mediaSourceInput - The list of specific media source screen inputs.
     * @property {String} mediaSourceInput.sourceId - The screen input item id.
     * @property {Object} mediaSourceInput.label - The screen input item label name.
     * @property {Object} mediaSourceInput.mediaSource - The screen input item media source it belongs to.
     */
    /**
     * @description Method that returns the screensharing sources.
     * @return {Promise.<screenSources>}
     * @alias Skylink#getScreenSources
     * @since 2.0.0
     */
    getScreenSources() {
      return MediaStream.getScreenSources();
    }

    /**
     * @typedef {Object} streamList
     * @property {Object.<string, MediaStream>|null} userMedia - The getUserMedia streams keyed by stream id.
     * @property {MediaStream|null} screenshare - The screenshare stream.
     */
    /**
     * @description Method that returns all active streams including screenshare stream if present.
     * @param {String} roomName - The room name.
     * @return {streamList|null}
     * @alias Skylink#retrieveStreams
     * @since 2.0.0
     */
    retrieveStreams(roomName) {
      const roomState = getRoomStateByName(roomName);
      if (roomState) {
        return MediaStream.retrieveStreams(roomState);
      }

      return null;
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
   * @classdesc Class representing a SkylinkJS instance.
   * @example
   * import Skylink from 'skylink.esm.js';
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
     * @return {SkylinkState}
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

    /**
     * @description Method that retrives the value of initOptions.
     * @return {initOptions}
     * @private
     */
    static getInitOptions() {
      return initOptions;
    }

    /**
     * @description Method that sets the value initOptions.
     * @param {initOptions} options
     * @private
     */
    static setInitOptions(options) {
      initOptions = options;
    }

    static setUserInitOptions(options) {
      userInitOptions = options;
    }

    static getUserInitOptions() {
      return userInitOptions;
    }

    /**
     * @description Logs an error when Skylink state is not found for a roomKey.
     * @param {string} keyOrName - The id/key of the room or the room name.
     * @private
     */
    static logNoRoomState(keyOrName) {
      logger.log.ERROR(`${MESSAGES.ROOM_STATE.NOT_FOUND} - ${keyOrName}`);
    }
  }

  /**
   * This sets the imports that are required for bundling Skylink_RN
   */

  Skylink.SkylinkConstants = SkylinkConstants;
  Skylink.SkylinkEventManager = skylinkEventManager;
  Skylink.SkylinkLogger = logger;

  module.exports = { Skylink };

}(reactNativeWebrtc, AdapterJS, io));
