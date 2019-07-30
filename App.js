/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  Dimensions,
  Platform, StyleSheet, Text, View
} from 'react-native';

import { Skylink } from './skylink_react_complete';

const skylink = new Skylink();
import CryptoJS from 'crypto-js';

//window.skylink = skylink;

const config = {
  appKey: "APP_KEY",
  defaultRoom: "test",
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
      localStreamURL: null,
      arrUrl: []
    };
  }

  export default class App extends Component<Props> {
    constructor(props) {
      super(props);
      this.nextUrlId = 1;
      this.state = {
        isFrontCamera: true,
        localStreamURL: null,
        streamList: []
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
          this.addUrl(url);
        }
      );

      skylink.on("peerLeft", peerID => {
        this.setState({ localStreamURL: null });
        this.setState({ streamList: [] });
        console.log("this peer peerLeft");
      });

      skylink.on("peerJoined", (peerId, peerInfo, isSelf) => {
        console.log("new peer has joined,", peerId, peerInfo, isSelf);
      });
    }

    addUrl(newStream) {
      const streamList = this.state.streamList;
      streamList.unshift({ streamUrl: newStream, id: this.nextUrlId });
      this.nextUrlId++;
      this.setState({ streamList: streamList });
      console.log("updated stream links", this.state.streamList);
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
          <View style={styles.videoWidgetLocal}>
            {this.state.localStreamURL && this.state.isFrontCamera && (
              <RTCView
                streamURL={this.state.localStreamURL}
                style={styles.rtcViewLocal}
              />
            )}
          </View>
          <View style={styles.videoWidgetRemote}>
            {this.state.streamList.map((stream, index) => {
              return (
                <RTCView
                  streamURL={stream.streamUrl}
                  style={styles.rtcViewRemote}
                  key={stream.id}
                  id={stream.id}
                />
              );
            })}
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
      backgroundColor: "#F5FCFF",
      flexDirection: "column"
    },
    buttonContainer: {
      flexDirection: "row"
    },
    button: {
      paddingTop: 15,
      paddingBottom: 15,
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
    videoWidgetLocal: {
      position: "relative",
      flex: 1,
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-start"
    },
    rtcViewLocal: {
      flex: 1,
      width: dimensions.width,
      backgroundColor: "#ccc",
      position: "relative"
    },
    videoWidgetRemote: {
      position: "relative",
      flex: 1,
      width: "100%",
      flexDirection: "row"
    },
    rtcViewRemote: {
      flex: 1,
      width: dimensions.width,
      backgroundColor: "#ccc",
      position: "relative",
      flexDirection: "row"
    }
  });