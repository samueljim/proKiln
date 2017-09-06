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
  // add users to new room when they connect
  socket.on('id', function (data) {
    console.log('user connected to ' + data.id);
    data.username = socket.request.user.username;
    console.log('username is ' + data.username);
    socket.join(data.id);
  });

  socket.on('clientScheduleUpdate', function (data) {
    console.log('Kiln ' + data.id + ' is ' + data.scheduleStatus + ' ' + data.schedule.title);
    ControlPanel.findByIdAndUpdate(data.id,
      { schedule: data.schedule, scheduleStatus: data.scheduleStatus, scheduleProgress: data.scheduleProgress },
      function (err, raw) {
        if (err) {
          console.log('Error ' + err + ' The raw response from Mongo was ', raw);
          errorHandler(err);
        }
      });
      // TODO put this in the kiln's reply
    data.online = true;
    io.in(data.id).emit('clientStatus' + data.id, data);
  });
  // Send a temp updates to all connected sockets when a data is received
  socket.on('tempKilnUpdate', function (data) {
    data.type = 'temp';
    data.time = Date.now();
    console.log('New temp of ' + data.id + ' is now ' + data.temp + ' at ' + data.time);
    // // update the database before moving on
    updateDatabase(data);
    // // send to client the new temp and time of temp change
    // //TODO put this in the kilns reply
    io.in(data.id).emit('tempServerUpdate' + data.id, data);
  });

  socket.on('connect', function (data) {
    console.log('meme');
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function (data) {
    // socket.removeListener('tempKilnUpdate');
    console.log('User left sockets');
    socket.leave(data.id);
  });

  // this fuction will update the database so that it has the latest temp
  function updateDatabase(entries) {
    var id = entries.id;
    // var data.data = data.temp;
    ControlPanel.findByIdAndUpdate(id,
      { $push: { 'temp': { $each: [
        { data: entries.temp }],
        $slice: -4000
      }
      }
      },
      function (err, raw) {
        if (err) {
          console.log('Error ' + err + ' The raw response from Mongo was ', raw);
          errorHandler(err);
        }
      });
  }
};
