'use strict';

/**
 * Module dependencies
*/
var path = require('path'),
  mongoose = require('mongoose'),
  ControlPanel = mongoose.model('ControlPanel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Create the temp configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  // io.emit('tempUpdate', {
  //   type: 'status',
  //   text: "Waiting for temp change",
  //   created: Date.now(),
  //   username: socket.request.user.username
  // });
  var room;
  // id for the room of the connection
  socket.on('id', function (data) {
    console.log("user connected at " + data.id);
    data.username = socket.request.user.username;
    console.log("username is " + data.username);
    room = data.id;
    socket.join(data.id);
  });

  // Send a temp messages to all connected sockets when a data is received
  socket.on('tempClientUpdate', function (data) {
    data.type = 'temp';
    data.time = Date.now();
    // data.username = socket.request.user.username;
    // data.userID = socket.request.user._id;
    // var controlPanel = socket.request.;
    // data.id = socket.request.controlPanel._id;
    console.log("New temp of " + data.id + "is now " + data.text);
    // updateDatabase(data);
    // Emit the 'chatMessage' event
    // if(data.userID == socket.request.controlPanel.user._id){
      // io.in(room).emit('tempServer', "error");
    // }else{
      io.in(room).emit('tempServerUpdate', data);
    // }
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('tempUpdate', {
      type: 'status',
      text: 'disconnected',
      time: Date.now(),
    });
  });
  //TODO make this work
  function updateDatabase(temp){
    var controlPanel = socket.request.controlPanel;

    controlPanel.temp = temp.text;
    controlPanel.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(controlPanel);
      }
    });
  }
};
