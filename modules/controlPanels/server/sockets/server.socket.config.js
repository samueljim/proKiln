'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  ControlPanel = mongoose.model('ControlPanel'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var smtpTransport = nodemailer.createTransport(config.mailer.options);

var onlineSockets = [];
// Create the temp configuration
module.exports = function (io, socket) {
  // add users to new room when they connect
  socket.on('connection', function (data) {
    console.log('connection ' + socket.id);
 //   socket.join(data.id);
  });

  socket.on('disconnect', function (data) {
    // socket.removeListener('tempKilnUpdate');


    function findSocket(input) {
      return input.socket === socket.id;
    }

    var info = onlineSockets.find(findSocket);
    var index = onlineSockets.indexOf(findSocket);
    if (index > -1) {
      onlineSockets.splice(index, 1);
    }
    kilnOnline(info.id, false);
    console.log('User left sockets ' + info.id);
    socket.leave(data.id);
  });


  socket.on('clientId', function (data) {
    console.log('user connected to ' + data.id);
    data.username = socket.request.user.username;
    console.log('username is ' + data.username);
    onlineSockets.push({ socket: socket.id, id: data.id });
    console.log(onlineSockets);
    socket.join(data.id);
  });

  socket.on('kilnId', function (data) {
    console.log('kiln ' + data.id + ' online');
    data.online = true;
    onlineSockets.push({ socket: socket.id, id: data.id });
    socket.join(data.id);
    console.log(onlineSockets);
  });

  socket.on('kilnSetup', function (data) {
    newKiln(data);
  });


  //   passport.use(new LocalStrategy(
  //     function(data.username, data.password, done) {
  //       User.findOne({ username: data.username }, function(err, user) {
  //         if (err) {
  //           console.log("kilnSetup error");
  //          }
  //         if (!user) {
  //           console.log("no user - kilnSetup error");
  //         }
  //         if (!user.validPassword(password)) {
  //           console.log("wrong password - kilnSetup error");
  //         }
  //         console.log("kilnSetup " + user.username);
  //       });
  //     }
  //   ));
  //   var kiln = {
  //     title: data.title,
  //     user: user
  //   };
  //   var controlPanel = new ControlPanel(kiln);
  //   controlPanel.save(function (err) {
  //     if (err) {
  //       return res.status(422).send({
  //         message: errorHandler.getErrorMessage(err)
  //       });
  //     } else {
  //       res.json(controlPanel);
  //       console.log('kiln ' + controlPanel.id + ' added');
  //     }
  //   });
  // });

  socket.on('kilnScheduleUpdate', function (data) {
    console.log('Kiln ' + data.id + ' is ' + data.scheduleStatus + ' ' + data.schedule.title);
    data.online = true;
    kilnStatusUpdate(data.id, data);
    io.in(data.id).emit('clientScheduleUpdate' + data.id, data);
  });

  socket.on('clientScheduleUpdate', function (data) {
    console.log('request to start ' + data.id);
    io.in(data.id).emit('kilnScheduleUpdate' + data.id, data);
  });

  // Send a temp updates to all connected sockets when a data is received
  socket.on('tempKilnUpdate', function (data) {
    data.x = Date.now();
    console.log('New temp of ' + data.id + ' is now ' + data.y + ' at ' + data.x);
    data.title = "test";
    data.user = "59913fae88b87811a526cd54";
    // var user = retrieveUser('samueljim');
    // console.log('' + user.email);
    kilnOnline(data.id, true);
    var id = newKiln(data);
    console.log(id + ' test');
    // // update the database before moving on
    updateTempDatabase(data);
    // send to client the new temp and time of temp change
    io.in(data.id).emit('tempServerUpdate' + data.id, data);
  });

  socket.on('emailUpdate', function (data) {
    emailAlerts(data.id, data.message);
  });

  socket.on('stop', function (data) {
    io.in(data.id).emit('kilnStop', {});
  });
  // this fuction will update the database so that it has the latest temp
  function updateTempDatabase(entries) {
    var id = entries.id;
    // var data.data = data.temp;
    ControlPanel.findByIdAndUpdate(id,
      { $push: { 'temp': { $each: [
        { y: entries.y }],
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
  // working
  function kilnOnline(id, state) {
    ControlPanel.findByIdAndUpdate(id, { 'online': state },
      function (err, raw) {
        if (err) {
          console.log('Error ' + err + ' The raw response from Mongo was ', raw);
          errorHandler(err);
        }
      });
  }
  // not tested
  function kilnStatusUpdate(id, data) {
    ControlPanel.findByIdAndUpdate(id, data,
      function (err, raw) {
        if (err) {
          console.log('Error ' + err + ' The raw response from Mongo was ', raw);
          errorHandler(err);
        }
      });
  }
  // working but return is not 
  function newKiln(info) {
    var controlPanel = new ControlPanel(info);
    controlPanel.temp = [{ x: null, y: null }];
    controlPanel.user = info.user;
    controlPanel.save(function (err) {
      if (err) {
        console.log('Kiln failed to be made');
        return 'failed';
      } else {
        console.log('New kiln ' + controlPanel.id);
        return controlPanel.id;
      }
    });
  }

  // function retrieveKiln(id) {
  //   ControlPanel.findById(id, function (err, ControlPanel) {
  //     if (err) {
  //       console.log(err);
  //       return null;
  //     } else {
  //       return ControlPanel[0];
  //     }
  //   });
  // }

  // function retrieveEmail(kilnID) {
  //   User.findById(kilnID, function (err, User) {
  //     if (err) {
  //       console.log(err);
  //       return null;
  //     } else {
  //       return User;
  //     }
  //   });
  // }

  function retrieveUseriId(username) {
    User.findOne({ 'username': username }, '_id', function (err, User) {
      if (err) {
        console.log(err);
        return null;
      } else {
        return User._id;
      }
    });
  }

  function retrieveUser(username) {
    User.findOne({ 'username': username }, function (err, User) {
      if (err) {
        console.log(err);
        return null;
      } else {
        console.log(User.email);
        return User;
      }
    });
  }
  // TODO fix
  function emailAlerts(id, message) {
    var kiln = retrieveKiln(id);
    console.log(kiln);
    var user = retrieveEmail(id.user);
    if (true) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Kiln update ' + kiln.kilnstatus + ' - proKiln',
        html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head><title></title></head><body><p>Dear ' + user.username + ',</p><p></p><p>' + kiln.title + ' has ' + kiln.kilnstatus + ' </p><br /><p>' + message + '</p><br /><br /><p>The proKiln Support Team</p></body></html>'
      };
      sendEmail(mailOptions);
    }
  }

  function sendEmail(mailOptions) {
    smtpTransport.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
  }

  // function login() {
  //   console.log('login');
  //   var username = 'thesamueljim';
  //   var password = '1qaz2wsx3edc4rfv5tgb';
  //   passport.authenticate(new LocalStrategy(
  //   function (username, password, done) {
  //     User.findOne({ username: username }, function (err, user) {
  //       if (err) {
  //         console.log('kilnSetup error');
  //       }
  //       if (!user) {
  //         console.log('no user - kilnSetup error');
  //       }
  //       if (!user.validPassword(password)) {
  //         console.log('wrong password - kilnSetup error');
  //       }
  //       console.log('kilnSetup ' + username);
  //     });
  //   }
  //   ));
  // }

};
