/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices
} from "react-native-webrtc";
import io from "socket.io-client";
import CryptoJS from "crypto-js";
import { Skylink } from "./skylink_react_complete";

const skylink = new Skylink();

const globals = {};
globals.io = window.io = io;

let navigator = {
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  platform: "MacIntel"
};

window.navigator = navigator;
window.RTCPeerConnection = RTCPeerConnection;
window.RTCIceCandidate = RTCIceCandidate;
window.RTCSessionDescription = RTCSessionDescription;
window.RTCView = RTCView;
window.MediaStream = MediaStream;
window.MediaStreamTrack = MediaStreamTrack;
window.navigator["getUserMedia"] = mediaDevices.getUserMedia;
window["getUserMedia"] = mediaDevices.getUserMedia;

window.skylink = skylink;

const config = {
  appKey: "8e1a0925-191e-4db6-a8a7-35183535032a",
  defaultRoom: "test3",
  forceSSL: false
};

const secret = "04ryfwlmoq88h"; // 'xxxxx' Use App Key secret
const duration = 2; // 2 hours. Default is 24 for CORS auth
const startDateTimeStamp = new Date().toISOString();
if (secret) {
  const genHashForCredentials = CryptoJS.HmacSHA1(
    `${config.defaultRoom}_${duration}_${startDateTimeStamp}`,
    secret
  );
  const credentials = encodeURIComponent(
    genHashForCredentials.toString(CryptoJS.enc.Base64)
  );

  config.credentials = {
    duration,
    startDateTime: startDateTimeStamp,
    credentials
  };
}
skylink.setLogLevel(4);
console.log("before init");

const dimensions = Dimensions.get("window");

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isFrontCamera: true,
      remoteStreamURL: null,
      localStreamURL: null
    };
  }

  componentDidMount() {
    const self = this;

    skylink.on(
      "incomingStream",
      (peerId, stream, isSelf, peerInfo, isScreensharing, streamId) => {
        if (isSelf) {
          return;
        }
        const url = stream.toURL();
        self.setState({
          remoteStreamURL: url
        });
      }
    );

    skylink.on("peerLeft", peerID => {
      this.setState({ remoteStreamURL: null });
      this.setState({ localStreamURL: null });
      console.log("this peer peerLeft");
    });

    skylink.on("peerJoined", (peerId, peerInfo, isSelf) => {
      console.log("new peer has joined,", peerId, peerInfo, isSelf);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              !this.state.localStreamURL ? styles.join : styles.leave
            ]}
            onPress={
              !this.state.localStreamURL ? this.joinRoom : this.leaveRoom
            }
          >
            <Text style={styles.joinText}>
              {!this.state.localStreamURL ? "Join Room" : "Leave Room"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.callerVideo}>
          <View style={styles.videoWidget}>
            {this.state.localStreamURL && this.state.isFrontCamera && (
              <RTCView
                streamURL={this.state.localStreamURL}
                style={styles.rtcView}
              />
            )}
          </View>
          <View style={styles.videoWidget}>
            {this.state.remoteStreamURL && (
              <RTCView
                streamURL={this.state.remoteStreamURL}
                style={styles.rtcView}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  joinRoom = () => {
    let self = this;
    skylink.init(config, (error, success) => {
      skylink.joinRoom({
        audio: true,
        video: true
      });
    });

    skylink.on("mediaAccessSuccess", stream => {
      console.log("mediaAccessSuccess");
      const url = stream.toURL();
      self.setState({
        localStreamURL: url
      });
    });
  };

  leaveRoom = () => {
    let self = this;
    skylink.leaveRoom();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  button: {
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    alignItems: "center"
  },
  join: {
    backgroundColor: "#03a8a1"
  },
  leave: {
    backgroundColor: "#eb2326"
  },
  joinText: {
    color: "white",
    fontWeight: "bold"
  },
  leaveText: {
    color: "#fff",
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  callerVideo: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    width: dimensions.width,
    justifyContent: "center",
    flexDirection: "column"
  },
  videoWidget: {
    position: "relative",
    flex: 1,
    width: dimensions.width
  },
  rtcView: {
    flex: 1,
    width: dimensions.width,
    backgroundColor: "#ccc",
    position: "relative"
  }
});
