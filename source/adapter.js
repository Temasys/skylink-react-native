globals.io = window.io = io;

let navigator = {
    userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
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

var AdapterJS = AdapterJS || window.AdapterJS || {};
var document = {};
AdapterJS.WebRTCPlugin = {};
var rtcPeerConnection = window.rtcPeerConnection;


window.location = {
    protocol:"https:"
};
AdapterJS.parseWebrtcDetectedBrowser = function () {
    var hasMatch = null;

    // Detect Opera (8.0+)
    if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
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
    }  else if (!!window.StyleMedia || navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
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
