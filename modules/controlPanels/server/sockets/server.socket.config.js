'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ControlPanel = mongoose.model('ControlPanel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  io.emit('tempUpdate', {
    type: 'status',
    text: "Waiting for temp change",
    created: Date.now(),
    username: socket.request.user.username
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('tempUpdate', function (message) {
    message.type = 'temp';
    message.time = Date.now();
    message.username = socket.request.user.username;

    // updateDatabase(temp.text);
    // Emit the 'chatMessage' event
    io.in(room).emit('tempUpdate', message);
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
    controlPanel.temp = temp;
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
