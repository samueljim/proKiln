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
  chalk = require('chalk'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var smtpTransport = nodemailer.createTransport(config.mailer.options);

var onlineSockets = [{ socket: 'Socket 1', id: 'Kiln 1' }];
var onlineClients = [{ socket: 'Socket 1', id: 'Client 1' }];

// Create the temp configuration
module.exports = function (io, socket) {
  // fuction to see if element is in an array
  function contains(arr, element) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === element) {
        return true;
      }
    }
    return false;
}

  // add users to new room when they connect
  socket.on('connection', function (data) {
    console.log('connection ' + socket.id);
 //   socket.join(data.id);
  });

  socket.on('disconnect', function (data) {
    var info;
    function findSocket(input) {
      return input.socket === socket.id;
    }

    var kiln = onlineSockets.indexOf(findSocket);
    var client = onlineClients.indexOf(findSocket);
    console.log(kiln);
    console.log(client);
    if (kiln != -1) {
      info = onlineSockets.find(findSocket);
      console.log(chalk.red('Kiln went offline ' + info.id));
      kilnOnline(info.id, false);
      onlineSockets.splice(kiln, 1);
      socket.leave(info.id);
    }

    if (client != -1) {
      info = onlineSockets.find(findSocket);
      console.log(chalk.red('User left sockets ' + info.id));
      onlineSockets.splice(client, 1);
      socket.leave(info.id);
    }

    console.log('Clients ' + onlineClients);
    console.log('Kilns ' + onlineSockets);

  });

  // fuction gets called when client on the site connects
  socket.on('clientId', function (data) {
    
    function findId(input) {
      return input.id === data.id;
    }

    var kiln = onlineSockets.indexOf(findId);
    socket.leave(data.id);
    onlineSockets.splice(kiln, 1);
    if (kiln != -1) {
    
    }
    onlineClients.push({ socket: socket.id, id: data.id });
    console.log(chalk.green('client connected to ' + data.id));

    console.log(onlineClients);
    socket.join(data.id);
  });

  // fuction gets called when kiln connects
  socket.on('kilnId', function (data) {
    data = JSON.parse(data);

    function findId(input) {
      return input.id === data.id;
    }

    socket.leave(data.id);
    data.online = true;
    onlineSockets.pop(findId);
    console.log(chalk.cyan('kiln connected to ' + data.id));

    kilnOnline(data.id, true);
    onlineSockets.push({ socket: socket.id, id: data.id });

    console.log(onlineSockets);
    socket.join(data.id);
  });

  socket.on('kilnSetup', function (data) {
    data = JSON.parse(data);
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
    data = JSON.parse(data);
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
    console.log(data);    
    data = JSON.parse(data);
    console.log(data);
    data.x = Date.now();
    console.log(chalk.blue('New temp of ' + data.id + ' is now ' + data.y + ' at ' + data.x));

    // var user = retrieveUser('samueljim');
    // console.log('' + user.email);;
    // // update the database before moving on
    updateTempDatabase(data);
    // send to client the new temp and time of temp change
    io.in(data.id).emit('tempServerUpdate' + data.id, data);
  });

  socket.on('emailUpdate', function (data) {
    data = JSON.parse(data);
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
      { $push: { 'runs.temp[runNum]': { $each: [
        { y: entries.y }],
        $slice: -40
      }
      }
      },
      function (err, raw) {
        if (err) {
          console.log(chalk.red('Error ' + err + ' The raw response from Mongo was ', raw));
          errorHandler(err);
        }
      });
  }
  // working
  function kilnOnline(id, state) {
    ControlPanel.findByIdAndUpdate(id, { 'online': state },
      function (err, raw) {
        if (err) {
          console.log(chalk.red('Error ' + err + ' The raw response from Mongo was ', raw));
          errorHandler(err);
        }
      });
  }
  // not tested
  function kilnStatusUpdate(id, data) {
    ControlPanel.findByIdAndUpdate(id, data,
      function (err, raw) {
        if (err) {
          console.log(chalk.red('Error ' + err + ' The raw response from Mongo was ', raw));
          errorHandler(err);
        }
      });
  }
  // working but return is not
  function newKiln(info) {
    var controlPanel = new ControlPanel(info);
    controlPanel.runs = {
      scheduleTitle: null,
      values: [
        {
          x: Date.now(),
          y: null
        }
      ],
      temp: [
        {
          y: null,
          x: null
       }
      ]
    };
    controlPanel.user = info.user;
    controlPanel.save(function (err) {
      if (err) {
        console.log('Kiln failed to be made');
        console.log(chalk.red(err));
        return 'failed';
      } else {
        console.log(chalk.bgGreen('New kiln ' + controlPanel.id));
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
        console.log(chalk.red(err));
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
    // find kiln
    ControlPanel.findById(id, function (err, ControlPanel) {
      if (err) {
        console.log(chalk.red(err));
      } else {
        // check if they want emails
        if (ControlPanel.emailAlerts === true) {
        // find user who owns kiln
          User.findOne({ 'username': ControlPanel.username }, function (err, User) {
            if (err) {
              console.log(err);
            } else {
              console.log(User.email);
              // send email to kiln if they want email
              var mailOptions = {
                to: User.email,
                from: config.mailer.from,
                subject: 'Kiln update ' + ControlPanel.kilnstatus + ' - proKiln',
                html: '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head><title></title></head><body><p>Dear ' + User.username + ',</p><p></p><p>' + ControlPanel.title + ' has ' + ControlPanel.kilnstatus + ' </p><br /><p>' + message + '</p><br /><br /><p>The proKiln Support Team</p></body></html>'
              };
              sendEmail(mailOptions);
            }
          });
        }
      }
    });
  }

  function sendEmail(mailOptions) {
    smtpTransport.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(chalk.red(error));
      }
      console.log(chalk.yellow('Email sent: ' + info.response));
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
