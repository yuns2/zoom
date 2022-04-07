"use strict";

// var _http = _interopRequireDefault(require("http"));

// var _socket = _interopRequireDefault(require("socket.io"));

// var _express = _interopRequireDefault(require("express"));

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

import _http from "http";
import _socket from "socket.io";
import _express from "express";


var app = (0, _express["default"])();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", _express["default"]["static"](__dirname + "/public"));
app.get("/", function (_, res) {
  return res.render("home");
});
app.get("/*", function (_, res) {
  return res.redirect("/");
});

var httpServer = _http["default"].createServer(app);

var wsServer = (0, _socket["default"])(httpServer);
wsServer.on("connection", function (socket) {
  socket.on("join_room", function (roomName) {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", function (offer, roomName) {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", function (answer, roomName) {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", function (ice, roomName) {
    socket.to(roomName).emit("ice", ice);
  });
});

var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:3000");
};

httpServer.listen(process.env.PORT || 3000, handleListen);