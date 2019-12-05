/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import CryptoJS from "crypto-js";
import { Skylink } from "./skylink_rn.complete";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const config = {
  appKey: "c7ae7e8a-2e24-43a5-85c6-d4dafbdfecb6",
  defaultRoom: "test4",
  forceSSL: false,
  video: {
    facingMode: "user"
  }
};

const secret = "ugmhml9xv7"; // 'xxxxx' Use App Key secret
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
const skylink = new Skylink(config);
window.skylink = skylink;
const dimensions = Dimensions.get("window");

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const skylinkEventManager = Skylink.SkylinkEventManager;
const events = Skylink.SkylinkConstants.EVENTS;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.nextUrlId = 1;
    this.success = "";
    this.state = {
      isFrontCamera: true,
      localStreamURL: null,
      streamList: [],
      isChatOpen: null,
      messageList: [],
      text: "",
      isVideoChat: false,
      isRoomJoined: false,
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  componentDidMount() {
    const self = this;

    try {
      this.joinRoom();
      skylinkEventManager.addEventListener(events.INCOMING_STREAM, response => {
        console.log("WHEN INIT", response);

        if (response.detail.isSelf) {
          return;
        }
        const url = response.detail.stream.toURL();
        self.addUrl(url, response.detail.peerId);
      });

      skylinkEventManager.addEventListener(events.PEER_LEFT, function(
        response
      ) {
        if (self.state.localStreamURL) {
          let updatedStreamlist = self.state.streamList
            .map(item => {
              return item.peerID;
            })
            .indexOf(response.detail.peerID);
          console.log("PEERID", response.detail.peerID);
          self.state.streamList.splice(updatedStreamlist, 1);
          self.setState({ streamList: self.state.streamList });
        }
        console.log("this peer peerLeft");
      });

      skylinkEventManager.addEventListener(events.PEER_JOINED, response => {
        console.log(
          "new peer has joined,",
          response.detail.peerId,
          response.detail.peerInfo,
          response.detail.isSelf
        );
      });

      //User in the room (including us) sent a message
      skylinkEventManager.addEventListener(events.ON_INCOMING_MESSAGE, function(
        response
      ) {
        const Name =
          response.detail.peerInfo.userData +
          (response.detail.isSelf ? " (You)" : "");
        self.addMessage(Name, response.detail.message.content);
      });
    } catch (error) {
      console.log(error);
      this.setState({ hasError: true });
    }
  }

  addMessage(Name, message) {
    this.state.messageList.push(
      <Text style={styles.messageNode}>
        {message.trim() + " "}
        <Text style={styles.username}>{Name}</Text>
      </Text>
    );
    this.setState({ messageList: this.state.messageList });
  }

  addUrl(newStream, peerID) {
    const streamList = this.state.streamList;
    streamList.unshift({
      streamUrl: newStream,
      id: this.nextUrlId,
      peerID: peerID
    });
    this.nextUrlId++;
    this.setState({ streamList: streamList });
    console.log("new stream list updated");
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {!this.state.hasError && (
          <View style={styles.container}>
            <View style={styles.navBar}>
              <Image
                source={require("./images/temasys.png")}
                style={{ width: 98, height: 36 }}
              />
              <View style={styles.rightNav}>
                <TouchableOpacity
                  onPress={
                    this.state.isRoomJoined ? this.leaveRoom : this.joinRoom
                  }
                >
                  <Icon
                    style={styles.navItem}
                    name={this.state.isRoomJoined ? "account-off" : "account"}
                    size={22}
                    color={"white"}
                  />
                </TouchableOpacity>
                {this.state.isVideoChat && !this.state.isChatOpen && (
                  <TouchableOpacity>
                    <Icon
                      style={styles.navItem}
                      name="camera-party-mode"
                      size={22}
                      color={"white"}
                      onPress={this.toggleView}
                    />
                  </TouchableOpacity>
                )}
                {this.state.isRoomJoined && (
                  <TouchableOpacity
                    onPress={
                      !this.state.isChatOpen ? this.joinChat : this.leaveChat
                    }
                  >
                    <Icon
                      style={styles.navItem}
                      name={
                        !this.state.isChatOpen
                          ? "message-text"
                          : "message-outline"
                      }
                      size={22}
                      color={"white"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {this.state.isVideoChat && (
              <View style={styles.videoWidgetLocal}>
                {this.state.localStreamURL && !this.state.isChatOpen && (
                  <window.RTCView
                    streamURL={this.state.localStreamURL}
                    style={styles.rtcViewLocal}
                  />
                )}
              </View>
            )}

            {this.state.isVideoChat && (
              <View style={styles.videoWidgetRemote}>
                {this.state.streamList.map((stream, index) => {
                  return (
                    <window.RTCView
                      streamURL={stream.streamUrl}
                      style={styles.rtcViewRemote}
                      key={stream.id}
                      id={stream.id}
                    />
                  );
                })}
              </View>
            )}

            {/* CHAT WINDOW SCREEN */}
            {this.state.isChatOpen && (
              <ScrollView
                ref="scrollView"
                style={styles.chatWindow}
                keyboardShouldPersistTaps="handled"
                alwaysBounceVertical="true"
                onContentSizeChange={(width, height) =>
                  this.refs.scrollView.scrollTo({ y: height })
                }
                maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
                  autoscrollToTopThreshold: 2
                }}
              >
                <View style={styles.chatTextView}>
                  {this.state.messageList.map((item, index) => {
                    console.log(item);
                    return (
                      <Text
                        key={index + Math.random() * 111}
                        style={styles.messageNode}
                      >
                        {item}
                      </Text>
                    );
                  })}
                </View>
              </ScrollView>
            )}

            {this.state.isChatOpen && (
              <View style={styles.chatTextArea}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Type here to chat!"
                  onChangeText={text => this.setState({ text })}
                  value={this.state.text}
                />
                <TouchableOpacity
                  style={styles.enterBtn}
                  onPress={this.enterText}
                  disabled={!this.state.text}
                >
                  <Icon
                    style={!this.state.text ? styles.disabled : ""}
                    name="send"
                    size={30}
                    color={"#444"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {this.state.hasError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>
              Something is wrong please restart the application and try again.
              :)
            </Text>
          </View>
        )}
      </View>
    );
  }

  joinRoom = () => {
    let self = this;
    this.state.isVideoChat = true;
    self.success = config.defaultRoom;
    var displayName = "User_" + Math.floor(Math.random() * 1000 + 1);
    skylink
      .joinRoom({
        userData: displayName,
        audio: true,
        video: true
      })
      .then(res => {
        self.setState({ isRoomJoined: true });
      });

    skylinkEventManager.addEventListener(
      events.MEDIA_ACCESS_SUCCESS,
      response => {
        const url = response.detail.stream.toURL();
        self.setState({
          localStreamURL: url
        });
      }
    );
  };

  toggleView = () => {
    console.log("toggle view clicked");
    skylink.stopStream(config.defaultRoom);
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
    let options = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 640, // Provide your own width, height and frame rate here
          minHeight: 480,
          minFrameRate: 30
        },
        facingMode: self.state.isFrontCamera ? "environment" : "user"
      }
    };

    window.getUserMedia(options).then(stream => {
      skylink.sendStream(config.defaultRoom, stream).then(function(success) {
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
  };

  leaveRoom = () => {
    this.state.isVideoChat = false;
    this.setState({ streamList: [] });
    this.setState({ localStreamURL: null });
    this.setState({ isChatOpen: false });
    this.setState({ isRoomJoined: false });
    skylink.leaveRoom(config.defaultRoom);
  };

  joinChat = () => {
    this.setState({ isVideoChat: false });
    let self = this;
    this.setState({ messageList: [] });
    this.setState({ text: "" });
    console.log("Chat Joined");
    this.setState({ isChatOpen: true });
    self.state.messageList.push(
      <Text style={[styles.joinNode, styles.bold]}>
        {"Join Room " + self.success}
      </Text>
    );
    self.setState({ messageList: self.state.messageList });
  };

  leaveChat = () => {
    console.log("Chat Left");
    this.setState({ isVideoChat: true });
    this.setState({ isChatOpen: false });
    this.setState({ messageList: [] });
  };

  enterText = () => {
    if (!this.state.isRoomJoined) return;
    skylink.sendMessage(config.defaultRoom, this.state.text);
    this.setState({ text: "" });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
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
  },
  chatWindow: {
    flex: 1,
    backgroundColor: "white"
  },
  chatTextView: {
    flexDirection: "column"
  },
  chatTextArea: {
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    paddingHorizontal: 10,
    justifyContent: "space-between"
  },
  inputBox: {
    width: "90%",
    color: "#444"
  },
  messageNode: {
    maxWidth: "100%",
    color: "#444",
    textAlign: "left",
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  joinNode: {
    maxWidth: "50%",
    color: "#444",
    fontSize: 15,
    margin: "auto",
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  navBar: {
    height: 55,
    backgroundColor: "#444",
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rightNav: {
    flexDirection: "row"
  },
  navItem: {
    marginLeft: 25
  },
  disabled: {
    opacity: 0.5
  },
  bold: {
    fontWeight: "bold"
  },
  textCenter: {
    textAlign: "center"
  },
  smallTxt: {
    fontSize: 9
  },
  username: {
    fontSize: 10
  },
  errorContainer: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    height: dimensions.height,
    alignItems: "center"
  },
  errorMessage: {
    color: "white",
    fontSize: 20,
    marginTop: 150,
    textAlign: "center"
  }
});
