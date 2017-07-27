'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ControlPanel = mongoose.model('ControlPanel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Create the temp configuration
module.exports = function(io, socket) {
  // Emit the status event when a new socket client is connected
  // io.emit('tempUpdate', {
  //   type: 'status',
  //   text: "Waiting for temp change",
  //   created: Date.now(),
  //   username: socket.request.user.username
  // });
  // id for the room of the connection
  socket.on('id', function(data) {
    console.log('user connected to ' + data.id);
    data.username = socket.request.user.username;
    console.log('username is ' + data.username);
    socket.join(data.id);
  });

  // Send a temp updates to all connected sockets when a data is received
  socket.on('tempKilnUpdate', function(data) {
    data.type = 'temp';
    data.time = Date.now();
    // data.username = socket.request.user.username;
    // data.userID = socket.request.user._id;
    // var controlPanel = socket.request.;
    // data.id = socket.request.controlPanel._id;
    console.log('New temp of ' + data.id + ' is now ' + data.temp + ' at ' + data.time);
    updateDatabase(data);
    // Emit the 'chatMessage' event
    // if(data.userID == socket.reques  var room;
    // io.in(room).emit('tempServer', "error");
    // }else{
    io.in(data.id).emit('tempServerUpdate' + data.id, data);
    // }
  });

  // socket.on('kilnStatusChange')

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function() {
    Socket.removeListener('tempKilnUpdate');
  });

  // this fuction will update the database so that it has the latest temp
  function updateDatabase(data) {
    var id = data.id;
    ControlPanel.findByIdAndUpdate(id,
      { $push: { 'temp': {
        data: data.temp
      }
      }
      },
      function(err, raw) {
        if (err) {
          console.log('Error ' + err + ' The raw response from Mongo was ', raw);
          errorHandler(err);
        }
      });
  }
};
