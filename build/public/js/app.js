"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var socket = io();
var myFace = document.getElementById("myFace");
var muteBtn = document.getElementById("mute");
var cameraBtn = document.getElementById("camera");
var camerasSelect = document.getElementById("cameras");
var call = document.getElementById("call");
call.hidden = true;
var myStream;
var muted = false;
var cameraOff = false;
var roomName;
var myPeerConnection;
var myDataChannel;

function getCameras() {
  return _getCameras.apply(this, arguments);
}

function _getCameras() {
  _getCameras = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var devices, cameras, currentCamera;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return navigator.mediaDevices.enumerateDevices();

          case 3:
            devices = _context3.sent;
            console.log(devices);
            cameras = devices.filter(function (device) {
              return device.kind === "videoinput";
            });
            currentCamera = myStream.getVideoTracks()[0];
            cameras.forEach(function (camera) {
              var option = document.createElement("option");
              option.value = camera.deviceId;
              option.innerText = camera.label;

              if (currentCamera.label === camera.label) {
                option.selected = true;
              }

              camerasSelect.appendChild(option);
            });
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return _getCameras.apply(this, arguments);
}

function getMedia(_x) {
  return _getMedia.apply(this, arguments);
}

function _getMedia() {
  _getMedia = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(deviceId) {
    var initialConstrains, cameraConstraints;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            initialConstrains = {
              audio: true,
              video: {
                facingMode: "user"
              }
            };
            cameraConstraints = {
              audio: true,
              video: {
                deviceId: {
                  exact: deviceId
                }
              }
            };
            _context4.prev = 2;
            _context4.next = 5;
            return navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initialConstrains);

          case 5:
            myStream = _context4.sent;
            myFace.srcObject = myStream;

            if (deviceId) {
              _context4.next = 10;
              break;
            }

            _context4.next = 10;
            return getCameras();

          case 10:
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](2);
            console.log(_context4.t0);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 12]]);
  }));
  return _getMedia.apply(this, arguments);
}

function handleMuteClick() {
  myStream.getAudioTracks().forEach(function (track) {
    return track.enabled = !track.enabled;
  });

  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  myStream.getVideoTracks().forEach(function (track) {
    return track.enabled = !track.enabled;
  });

  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

function handleCameraChange() {
  return _handleCameraChange.apply(this, arguments);
}

function _handleCameraChange() {
  _handleCameraChange = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var videoTrack, videoSender;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getMedia(camerasSelect.value);

          case 2:
            // 위 코드 이후로는 내가 선택한 새 장치로 업데이트 된 video track을 받게 된다.
            if (myPeerConnection) {
              // PeerConnection이 존재한다면, (연결된 상대 브라우저 존재)
              videoTrack = myStream.getVideoTracks()[0]; // -> 바뀐 video track을 받아옴
              // 우리 peer 연결로 보내진 track을 보자.
              // myStream의 정보를 상대 Peer로 전달한다. 

              videoSender = myPeerConnection.getSenders().find(function (sender) {
                return sender.track.kind === "video";
              });
              console.log(videoSender);
              videoSender.replaceTrack(videoTrack);
            }

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _handleCameraChange.apply(this, arguments);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange); // Welcome Form (join a room)

var welcome = document.getElementById("welcome");
var welcomeForm = welcome.querySelector("form");

function initCall() {
  return _initCall.apply(this, arguments);
}

function _initCall() {
  _initCall = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            welcome.hidden = true;
            call.hidden = false;
            _context6.next = 4;
            return getMedia();

          case 4:
            makeConnection();

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _initCall.apply(this, arguments);
}

function handleWelcomeSubmit(_x2) {
  return _handleWelcomeSubmit.apply(this, arguments);
}

function _handleWelcomeSubmit() {
  _handleWelcomeSubmit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(event) {
    var input;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            event.preventDefault();
            input = welcomeForm.querySelector("input");
            _context7.next = 4;
            return initCall();

          case 4:
            socket.emit("join_room", input.value);
            roomName = input.value;
            input.value = "";

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _handleWelcomeSubmit.apply(this, arguments);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit); // Socket Code

socket.on("welcome", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var offer;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          myDataChannel = myPeerConnection.createDataChannel("chat");
          myDataChannel.addEventListener("message", console.log);
          console.log("made data channel");
          _context.next = 5;
          return myPeerConnection.createOffer();

        case 5:
          offer = _context.sent;
          myPeerConnection.setLocalDescription(offer);
          console.log("sent the offer");
          socket.emit("offer", offer, roomName);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
socket.on("offer", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(offer) {
    var answer;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            myPeerConnection.addEventListener("datachannel", function (event) {
              myDataChannel = event.channel;
              myDataChannel.addEventListener("message", console.log);
            });
            console.log("receive the offer");
            myPeerConnection.setRemoteDescription(offer);
            _context2.next = 5;
            return myPeerConnection.createAnswer();

          case 5:
            answer = _context2.sent;
            myPeerConnection.setLocalDescription(answer);
            socket.emit("answer", answer, roomName);
            console.log("send the answer");

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}());
socket.on("answer", function (answer) {
  console.log("receive the answer");
  myPeerConnection.setRemoteDescription(answer);
});
socket.on("ice", function (ice) {
  console.log("receive candidate");
  myPeerConnection.addIceCandidate(ice);
}); // RTC Code

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  console.log("got an stream from my peer");
  console.log("Peer's Stream : ", data.stream);
  console.log("My stream : ", myStream);
  var peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
}

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [{
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302", "stun:stun4.l.google.com:19302"]
    }]
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myStream.getTracks().forEach(function (track) {
    return myPeerConnection.addTrack(track, myStream);
  });
}