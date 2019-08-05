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

import CryptoJS from "crypto-js";
import { Skylink } from "./skylink_react_complete";

const skylink = new Skylink();


const config = {
  appKey: "8e1a0925-191e-4db6-a8a7-35183535032a",
  defaultRoom: "test4",
  forceSSL: false,
  video : {
    facingMode:"user"
  }
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
        {this.state.localStreamURL && (
          <TouchableOpacity style={[styles.roundButton, styles.cameraChange]}
            onPress={
              this.toggleView
            }
          >
            <Text style={styles.cameraColor}>Toggle View</Text>
          </TouchableOpacity>
        )}
        <View style={styles.videoWidgetLocal}>
          {this.state.localStreamURL && (
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
  toggleView = () =>{
    console.log("toggle view clicked");
    let self = this;
    if (self.state.isFrontCamera) {
      self.setState({
        isFrontCamera: false
      });

    } else {
      self.setState({
        isFrontCamera: true
      });
    }
    let options =  {
      audio: true,
      video: {
        mandatory: {
          minWidth: 640, // Provide your own width, height and frame rate here
          minHeight: 480,
          minFrameRate: 30
        },
        facingMode: (self.state.isFrontCamera) ? "environment" : "user"
      }
    };

    window.getUserMedia(options)
      .then(stream => {
        skylink.sendStream(stream, function (error, success) {
          const url = stream.toURL();
          self.setState({
            localStreamURL: url
          });
        if (err) return;
        if (stream === success) {
          console.info("Same MediaStream has been sent");
        }
        console.log("Stream is now being sent to Peers");
      });
    });
  }
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
  roundButton: {
    paddingTop: 15,
    paddingBottom: 15,
    width: 55,
    height: 55,
    alignItems: "center",
    borderRadius: 50,
    position: "absolute",
    right: 5,
    top: 310,
    zIndex: 2
  },
  cameraChange: {
    backgroundColor: "rgba(52, 52, 52, 0.30)",
    textAlign: "center"
  },
  cameraColor: {
    color: "#fff",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center"
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
