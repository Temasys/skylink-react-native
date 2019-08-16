Skylink.prototype.joinRoom = function(room, options, callback) {
  var self = this;
  var selectedRoom = self._initOptions.defaultRoom;
  var previousRoom = self._selectedRoom;
  var mediaOptions = {};
  var timestamp = (new Date()).getTime() + Math.floor(Math.random() * 10000);
  self._joinRoomManager.timestamp = timestamp;

  if (room && typeof room === 'string') {
    selectedRoom = room;
  } else if (room && typeof room === 'object') {
    mediaOptions = room;
  } else if (typeof room === 'function') {
    callback = room;
  }

  if (options && typeof options === 'object') {
    mediaOptions = options;
  } else if (typeof options === 'function') {
    callback = options;
  }

  var resolveAsErrorFn = function (error, tryRoom, readyState) {
    log.error(error);

    if (typeof callback === 'function') {
      callback({
        room: tryRoom,
        errorCode: readyState || null,
        error: error instanceof Error ? error : new Error(JSON.stringify(error))
      });
    }
  };

  var resolveAsWarningFn = function(error, tryRoom) {
    log.warn(error + ' ' + 'room: ' + tryRoom);
  };

  var joinRoomFn = function () {
    // If room has been stopped but does not matches timestamp skip.
    if (self._joinRoomManager.timestamp !== timestamp) {
      resolveAsWarningFn('joinRoom() process did not complete', selectedRoom);
      return;
    }

    self._initSelectedRoom(selectedRoom, function(initError, initSuccess) {
      if (initError) {
        resolveAsErrorFn(initError.error, self._selectedRoom, self._readyState);
        return;
        // If details has been initialised but does not matches timestamp skip.
      } else if (self._joinRoomManager.timestamp !== timestamp) {
        resolveAsWarningFn('joinRoom() process did not complete', selectedRoom);
        return;
      }

      self._waitForOpenChannel(mediaOptions || {}, timestamp, function (error, success) {
        if (error) {
          resolveAsErrorFn(error, self._selectedRoom, self._readyState);
          return;
          // If socket and stream has been retrieved but socket connection does not matches timestamp skip.
        } else if (self._joinRoomManager.timestamp !== timestamp) {
          resolveAsWarningFn('joinRoom() process did not complete', selectedRoom);
          return;
        }

        if (AdapterJS.webrtcDetectedType === 'AppleWebKit') {
          var checkStream = self._streams.screenshare && self._streams.screenshare.stream ?
              self._streams.screenshare.stream : (self._streams.userMedia && self._streams.userMedia.stream ?
                  self._streams.userMedia.stream : null);

          if (checkStream ? checkStream.getTracks().length === 0 : true) {
            log.warn('Note that receiving audio and video streams may fail as safari 11 needs stream with audio and video tracks');
          } else if (checkStream.getAudioTracks().length === 0) {
            log.warn('Note that receiving audio streams may fail as safari 11 needs stream ' +
                'with audio and video tracks and not just with video tracks');
          } else if (checkStream.getVideoTracks().length === 0) {
            log.warn('Note that receiving video streams may fail as safari 11 needs stream ' +
                'with audio and video tracks and not just with audio tracks');
          }
        }

        if (typeof callback === 'function') {
          var peerOnJoin = function(peerId, peerInfo, isSelf) {
            self.off('systemAction', peerFailedJoin);
            self.off('channelClose', peerSocketFailedJoin);
            log.info([null, 'Room', selectedRoom, 'Connected to Room ->'], peerInfo);
            callback(null, {
              room: self._selectedRoom,
              peerId: peerId,
              peerInfo: peerInfo
            });
          };

          var peerFailedJoin = function (action, message) {
            self.off('peerJoined', peerOnJoin);
            self.off('channelClose', peerSocketFailedJoin);
            log.error([null, 'Room', selectedRoom, 'Failed connecting to Room ->'], message);
            resolveAsErrorFn(new Error(message), self._selectedRoom, self._readyState);
          };

          var peerSocketFailedJoin = function () {
            self.off('systemAction', peerFailedJoin);
            self.off('peerJoined', peerOnJoin);
            log.error([null, 'Room', selectedRoom, 'Failed connecting to Room due to abrupt disconnection.']);
            resolveAsErrorFn(new Error('Channel closed abruptly before session was established'), self._selectedRoom, self._readyState);
          };

          self.once('peerJoined', peerOnJoin, function(peerId, peerInfo, isSelf) {
            return peerInfo.room === selectedRoom && isSelf;
          });

          self.once('systemAction', peerFailedJoin, function (action) {
            return action === self.SYSTEM_ACTION.REJECT;
          });

          self.once('channelClose', peerSocketFailedJoin);
        }

        var joinRoomMsg = {
          type: self._SIG_MESSAGE_TYPE.JOIN_ROOM,
          uid: self._user.uid,
          cid: self._key,
          rid: self._room.id,
          userCred: self._user.token,
          timeStamp: self._user.timeStamp,
          apiOwner: self._appKeyOwner,
          roomCred: self._room.token,
          start: self._room.startDateTime,
          len: self._room.duration,
          isPrivileged: self._isPrivileged === true, // Default to false if undefined
          autoIntroduce: self._autoIntroduce !== false, // Default to true if undefined
          key: self._initOptions.appKey
        };

        self._sendChannelMessage(joinRoomMsg);
        self._handleSessionStats(joinRoomMsg);
      });
    });
  };

  if (room === null || ['number', 'boolean'].indexOf(typeof room) > -1) {
    resolveAsErrorFn('Invalid room name is provided', room);
    return;
  }

  if (options === null || ['number', 'boolean'].indexOf(typeof options) > -1) {
    resolveAsErrorFn('Invalid mediaOptions is provided', selectedRoom);
    return;
  }

  self._joinRoomManager.socketsFn.forEach(function (fnItem) {
    fnItem(timestamp);
  });

  self._joinRoomManager.socketsFn = [];

  var stopStream = mediaOptions.audio === false && mediaOptions.video === false;

  if (self._inRoom) {
    self.leaveRoom({
      userMedia: stopStream
    }, function (lRError, lRSuccess) {
      log.debug([null, 'Room', previousRoom, 'Leave Room callback result ->'], [lRError, lRSuccess]);
      joinRoomFn();
    });
  } else {
    if (stopStream) {
      self.stopStream();
    }

    joinRoomFn();
  }
};

/**
 * <blockquote class="info">
 *   Note that this method will close any existing socket channel connection despite not being in the Room.
 * </blockquote>
 * Function that stops Room session.
 * @method leaveRoom
 * @param {Boolean|JSON} [stopMediaOptions=true] The flag if <code>leaveRoom()</code>
 *   should stop both <a href="#method_shareScreen"><code>shareScreen()</code> Stream</a>
 *   and <a href="#method_getUserMedia"><code>getUserMedia()</code> Stream</a>.
 * - When provided as a boolean, this sets both <code>stopMediaOptions.userMedia</code>
 *   and <code>stopMediaOptions.screenshare</code> to its boolean value.
 * @param {Boolean} [stopMediaOptions.userMedia=true] The flag if <code>leaveRoom()</code>
 *   should stop <a href="#method_getUserMedia"><code>getUserMedia()</code> Stream</a>.
 *   <small>This invokes <a href="#method_stopStream"><code>stopStream()</code> method</a>.</small>
 * @param {Boolean} [stopMediaOptions.screenshare=true] The flag if <code>leaveRoom()</code>
 *   should stop <a href="#method_shareScreen"><code>shareScreen()</code> Stream</a>.
 *   <small>This invokes <a href="#method_stopScreen"><code>stopScreen()</code> method</a>.</small>
 * @param {Function} [callback] The callback function fired when request has completed.
 *   <small>Function parameters signature is <code>function (error, success)</code></small>
 *   <small>Function request completion is determined by the <a href="#event_peerLeft">
 *   <code>peerLeft</code> event</a> triggering <code>isSelf</code> parameter payload value as <code>true</code>
 *   for request success.</small>
 * @param {Error|String} callback.error The error result in request.
 *   <small>Defined as <code>null</code> when there are no errors in request</small>
 *   <small>Object signature is the <code>leaveRoom()</code> error when stopping Room session.</small>
 * @param {JSON} callback.success The success result in request.
 *   <small>Defined as <code>null</code> when there are errors in request</small>
 * @param {String} callback.success.peerId The User's Room session Peer ID.
 * @param {String} callback.success.previousRoom The Room name.
 * @trigger <ol class="desc-seq">
 *   <li>If Socket connection is opened: <ol><li><a href="#event_channelClose"><code>channelClose</code> event</a> triggers.</li></ol></li>
 *   <li>Checks if User is in Room. <ol><li>If User is not in a Room: <ol><li><b>ABORT</b> and return error.</li>
 *   </ol></li><li>Else: <ol><li>If parameter <code>stopMediaOptions.userMedia</code> value is <code>true</code>: <ol>
 *   <li>Invoke <a href="#method_stopStream"><code>stopStream()</code> method</a>.
 *   <small>Regardless of request errors, <code>leaveRoom()</code> will still proceed.</small></li></ol></li>
 *   <li>If parameter <code>stopMediaOptions.screenshare</code> value is <code>true</code>: <ol>
 *   <li>Invoke <a href="#method_stopScreen"><code>stopScreen()</code> method</a>.
 *   <small>Regardless of request errors, <code>leaveRoom()</code> will still proceed.</small></li></ol></li>
 *   <li><a href="#event_peerLeft"><code>peerLeft</code> event</a> triggers for User and all connected Peers in Room.</li>
 *   <li>If MCU is enabled for the App Key provided in <a href="#method_init"><code>init()</code> method</a>
 *   and connected: <ol><li><a href="#event_serverPeerLeft"><code>serverPeerLeft</code> event</a>
 *   triggers parameter payload <code>serverPeerType</code> as <code>MCU</code>.</li></ol></li></ol></li></ol></li></ol>
 * @for Skylink
 * @since 0.5.5
 */
Skylink.prototype.leaveRoom = function(stopMediaOptions, callback) {
  var self = this;
  var stopUserMedia = true;
  var stopScreenshare = true;
  var previousRoom = self._selectedRoom;
  var previousUserPeerId = self._user ? self._user.sid : null;
  var peersThatLeft = [];
  var isNotInRoom = !self._inRoom;

  if (typeof stopMediaOptions === 'boolean') {
    if (stopMediaOptions === false) {
      stopUserMedia = false;
      stopScreenshare = false;
    }
  } else if (stopMediaOptions && typeof stopMediaOptions === 'object') {
    stopUserMedia = stopMediaOptions.userMedia !== false;
    stopScreenshare = stopMediaOptions.screenshare !== false;
  } else if (typeof stopMediaOptions === 'function') {
    callback = stopMediaOptions;
  }

  for (var infoPeerId in self._peerInformations) {
    if (self._peerInformations.hasOwnProperty(infoPeerId) && self._peerInformations[infoPeerId]) {
      peersThatLeft.push(infoPeerId);
      self._removePeer(infoPeerId);
    }
  }

  for (var connPeerId in self._peerConnections) {
    if (self._peerConnections.hasOwnProperty(connPeerId) && self._peerConnections[connPeerId]) {
      if (peersThatLeft.indexOf(connPeerId) === -1) {
        peersThatLeft.push(connPeerId);
        self._removePeer(connPeerId);
      }
    }
  }

  self._inRoom = false;
  self._closeChannel();

  if (isNotInRoom) {
    var notInRoomError = 'Unable to leave room as user is not in any room';
    log.error([null, 'Room', previousRoom, notInRoomError]);

    if (typeof callback === 'function') {
      callback(new Error(notInRoomError), null);
    }
    return;
  }

  self._stopStreams({
    userMedia: stopUserMedia,
    screenshare: stopScreenshare
  });

  self._wait(function () {
    log.log([null, 'Room', previousRoom, 'User left the room']);

    self._trigger('peerLeft', previousUserPeerId, self.getPeerInfo(), true);

    if (typeof callback === 'function') {
      callback(null, {
        peerId: previousUserPeerId,
        previousRoom: previousRoom
      });
    }
  }, function () {
    return !self._channelOpen;
  });
};

/**
 * <blockquote class="info">
 *   Note that broadcasted events from <a href="#method_muteStream"><code>muteStream()</code> method</a>,
 *   <a href="#method_stopStream"><code>stopStream()</code> method</a>,
 *   <a href="#method_stopScreen"><code>stopScreen()</code> method</a>,
 *   <a href="#method_sendMessage"><code>sendMessage()</code> method</a>,
 *   <a href="#method_unlockRoom"><code>unlockRoom()</code> method</a> and
 *   <a href="#method_lockRoom"><code>lockRoom()</code> method</a> may be queued when
 *   sent within less than an interval.
 * </blockquote>
 * Function that locks the current Room when in session to prevent other Peers from joining the Room.
 * @method lockRoom
 * @trigger <ol class="desc-seq">
 *   <li>Requests to Signaling server to lock Room <ol>
 *   <li><a href="#event_roomLock"><code>roomLock</code> event</a> triggers parameter payload
 *   <code>isLocked</code> value as <code>true</code>.</li></ol></li></ol>
 * @for Skylink
 * @since 0.5.0
 */
Skylink.prototype.lockRoom = function() {
  if (!(this._user && this._user.sid)) {
    return;
  }
  log.log('Update to isRoomLocked status ->', true);
  this._sendChannelMessage({
    type: this._SIG_MESSAGE_TYPE.ROOM_LOCK,
    mid: this._user.sid,
    rid: this._room.id,
    lock: true
  });
  this._roomLocked = true;
  this._trigger('roomLock', true, this._user.sid, this.getPeerInfo(), true);
};

/**
 * <blockquote class="info">
 *   Note that broadcasted events from <a href="#method_muteStream"><code>muteStream()</code> method</a>,
 *   <a href="#method_stopStream"><code>stopStream()</code> method</a>,
 *   <a href="#method_stopScreen"><code>stopScreen()</code> method</a>,
 *   <a href="#method_sendMessage"><code>sendMessage()</code> method</a>,
 *   <a href="#method_unlockRoom"><code>unlockRoom()</code> method</a> and
 *   <a href="#method_lockRoom"><code>lockRoom()</code> method</a> may be queued when
 *   sent within less than an interval.
 * </blockquote>
 * Function that unlocks the current Room when in session to allow other Peers to join the Room.
 * @method unlockRoom
 * @trigger <ol class="desc-seq">
 *   <li>Requests to Signaling server to unlock Room <ol>
 *   <li><a href="#event_roomLock"><code>roomLock</code> event</a> triggers parameter payload
 *   <code>isLocked</code> value as <code>false</code>.</li></ol></li></ol>
 * @for Skylink
 * @since 0.5.0
 */
Skylink.prototype.unlockRoom = function() {
  if (!(this._user && this._user.sid)) {
    return;
  }
  log.log('Update to isRoomLocked status ->', false);
  this._sendChannelMessage({
    type: this._SIG_MESSAGE_TYPE.ROOM_LOCK,
    mid: this._user.sid,
    rid: this._room.id,
    lock: false
  });
  this._roomLocked = false;
  this._trigger('roomLock', false, this._user.sid, this.getPeerInfo(), true);
};

/**
 * Function that waits for Socket connection to Signaling to be opened.
 * @method _waitForOpenChannel
 * @private
 * @for Skylink
 * @since 0.5.5
 */
Skylink.prototype._waitForOpenChannel = function(mediaOptions, joinRoomTimestamp, callback) {
  var self = this;
  // when reopening room, it should stay as 0
  self._socketCurrentReconnectionAttempt = 0;

  // wait for ready state before opening
  self._wait(function() {
    var onChannelOpen = function () {
      self.off('socketError', onChannelError);

      // Wait for self._channelOpen flag to be defined first
      setTimeout(function () {
        mediaOptions = mediaOptions || {};

        self._userData = mediaOptions.userData || self._userData || '';
        self._streamsBandwidthSettings = {
          googleX: {},
          bAS: {}
        };
        self._publishOnly = false;
        self._sdpSettings = {
          connection: {
            audio: true,
            video: true,
            data: true
          },
          direction: {
            audio: { send: true, receive: true },
            video: { send: true, receive: true }
          }
        };
        self._voiceActivityDetection = typeof mediaOptions.voiceActivityDetection === 'boolean' ?
            mediaOptions.voiceActivityDetection : true;
        self._peerConnectionConfig = {
          bundlePolicy: self.BUNDLE_POLICY.BALANCED,
          rtcpMuxPolicy: self.RTCP_MUX_POLICY.REQUIRE,
          iceCandidatePoolSize: 0,
          certificate: self.PEER_CERTIFICATE.AUTO,
          disableBundle: false
        };
        self._bandwidthAdjuster = null;

        if (mediaOptions.bandwidth) {
          if (typeof mediaOptions.bandwidth.audio === 'number') {
            self._streamsBandwidthSettings.bAS.audio = mediaOptions.bandwidth.audio;
          }

          if (typeof mediaOptions.bandwidth.video === 'number') {
            self._streamsBandwidthSettings.bAS.video = mediaOptions.bandwidth.video;
          }

          if (typeof mediaOptions.bandwidth.data === 'number') {
            self._streamsBandwidthSettings.bAS.data = mediaOptions.bandwidth.data;
          }
        }

        if (mediaOptions.googleXBandwidth) {
          if (typeof mediaOptions.googleXBandwidth.min === 'number') {
            self._streamsBandwidthSettings.googleX.min = mediaOptions.googleXBandwidth.min;
          }

          if (typeof mediaOptions.googleXBandwidth.max === 'number') {
            self._streamsBandwidthSettings.googleX.max = mediaOptions.googleXBandwidth.max;
          }
        }

        if (mediaOptions.sdpSettings) {
          if (mediaOptions.sdpSettings.direction) {
            if (mediaOptions.sdpSettings.direction.audio) {
              self._sdpSettings.direction.audio.receive = typeof mediaOptions.sdpSettings.direction.audio.receive === 'boolean' ?
                  mediaOptions.sdpSettings.direction.audio.receive : true;
              self._sdpSettings.direction.audio.send = typeof mediaOptions.sdpSettings.direction.audio.send === 'boolean' ?
                  mediaOptions.sdpSettings.direction.audio.send : true;
            }

            if (mediaOptions.sdpSettings.direction.video) {
              self._sdpSettings.direction.video.receive = typeof mediaOptions.sdpSettings.direction.video.receive === 'boolean' ?
                  mediaOptions.sdpSettings.direction.video.receive : true;
              self._sdpSettings.direction.video.send = typeof mediaOptions.sdpSettings.direction.video.send === 'boolean' ?
                  mediaOptions.sdpSettings.direction.video.send : true;
            }
          }
          if (mediaOptions.sdpSettings.connection) {
            self._sdpSettings.connection.audio = typeof mediaOptions.sdpSettings.connection.audio === 'boolean' ?
                mediaOptions.sdpSettings.connection.audio : true;
            self._sdpSettings.connection.video = typeof mediaOptions.sdpSettings.connection.video === 'boolean' ?
                mediaOptions.sdpSettings.connection.video : true;
            self._sdpSettings.connection.data = typeof mediaOptions.sdpSettings.connection.data === 'boolean' ?
                mediaOptions.sdpSettings.connection.data : true;
          }
        }

        if (mediaOptions.publishOnly) {
          self._sdpSettings.direction.audio.send = true;
          self._sdpSettings.direction.audio.receive = false;
          self._sdpSettings.direction.video.send = true;
          self._sdpSettings.direction.video.receive = false;
          self._publishOnly = true;

          if (typeof mediaOptions.publishOnly === 'object' && mediaOptions.publishOnly.parentId &&
              typeof mediaOptions.publishOnly.parentId === 'string') {
            self._parentId = mediaOptions.publishOnly.parentId;
          }
        }

        if (mediaOptions.parentId) {
          self._parentId = mediaOptions.parentId;
        }

        if (mediaOptions.peerConnection && typeof mediaOptions.peerConnection === 'object') {
          if (typeof mediaOptions.peerConnection.bundlePolicy === 'string') {
            for (var bpProp in self.BUNDLE_POLICY) {
              if (self.BUNDLE_POLICY.hasOwnProperty(bpProp) &&
                  self.BUNDLE_POLICY[bpProp] === mediaOptions.peerConnection.bundlePolicy) {
                self._peerConnectionConfig.bundlePolicy = mediaOptions.peerConnection.bundlePolicy;
              }
            }
          }
          if (typeof mediaOptions.peerConnection.rtcpMuxPolicy === 'string') {
            for (var rmpProp in self.RTCP_MUX_POLICY) {
              if (self.RTCP_MUX_POLICY.hasOwnProperty(rmpProp) &&
                  self.RTCP_MUX_POLICY[rmpProp] === mediaOptions.peerConnection.rtcpMuxPolicy) {
                self._peerConnectionConfig.rtcpMuxPolicy = mediaOptions.peerConnection.rtcpMuxPolicy;
              }
            }
          }
          if (typeof mediaOptions.peerConnection.iceCandidatePoolSize === 'number' &&
              mediaOptions.peerConnection.iceCandidatePoolSize > 0) {
            self._peerConnectionConfig.iceCandidatePoolSize = mediaOptions.peerConnection.iceCandidatePoolSize;
          }
          if (typeof mediaOptions.peerConnection.certificate === 'string') {
            for (var pcProp in self.PEER_CERTIFICATE) {
              if (self.PEER_CERTIFICATE.hasOwnProperty(pcProp) &&
                  self.PEER_CERTIFICATE[pcProp] === mediaOptions.peerConnection.certificate) {
                self._peerConnectionConfig.certificate = mediaOptions.peerConnection.certificate;
              }
            }
          }
          self._peerConnectionConfig.disableBundle = mediaOptions.peerConnection.disableBundle === true;
        }

        if (mediaOptions.autoBandwidthAdjustment) {
          self._bandwidthAdjuster = {
            interval: 10,
            limitAtPercentage: 100,
            useUploadBwOnly: false
          };

          if (typeof mediaOptions.autoBandwidthAdjustment === 'object') {
            if (typeof mediaOptions.autoBandwidthAdjustment.interval === 'number' &&
                mediaOptions.autoBandwidthAdjustment.interval >= 10) {
              self._bandwidthAdjuster.interval = mediaOptions.autoBandwidthAdjustment.interval;
            }
            if (typeof mediaOptions.autoBandwidthAdjustment.limitAtPercentage === 'number' &&
                (mediaOptions.autoBandwidthAdjustment.limitAtPercentage >= 0 &&
                    mediaOptions.autoBandwidthAdjustment.limitAtPercentage <= 100)) {
              self._bandwidthAdjuster.limitAtPercentage = mediaOptions.autoBandwidthAdjustment.limitAtPercentage;
            }
            if (typeof mediaOptions.autoBandwidthAdjustment.useUploadBwOnly === 'boolean') {
              self._bandwidthAdjuster.useUploadBwOnly = mediaOptions.autoBandwidthAdjustment.useUploadBwOnly;
            }
          }
        }
        if(!mediaOptions.video.facingMode || mediaOptions.video.facingMode == 'undefined'){
          mediaOptions.video.facingMode = 'user';
        }
        var getUserMediaOptions = {
          audio: mediaOptions.audio,
          video: mediaOptions.video
        };
        if (mediaOptions.audio || mediaOptions.video) {
          self.getUserMedia(getUserMediaOptions, function (error, success) {
            if (error) {
              callback(error, null);
            } else {
              callback(null, success);
            }
          });
          return;
        }
        callback(null, null);
      }, 1);
    };
    var onChannelError = function (errorState, error) {
      self.off('channelOpen', onChannelOpen);
      callback(error);
    };

    if (!self._channelOpen) {
      self.once('channelOpen', onChannelOpen);
      self.once('socketError', onChannelError, function (errorState) {
        return errorState === self.SOCKET_ERROR.RECONNECTION_ABORTED;
      });
      self._openChannel(joinRoomTimestamp);
    } else {
      onChannelOpen();
    }
  }, function() {
    return self._readyState === self.READY_STATE_CHANGE.COMPLETED;
  });
};