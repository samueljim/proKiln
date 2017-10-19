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

var onlineKilnSockets = ['Tapping'];
var onlineClientSockets = ['Parker'];
var onlineKilnId = ['Wynter'];
var onlineClientId = ['Henry'];

var random = 24;

// Create the temp configuration
module.exports = function (io, socket) {

  // add users to new room when they connect
  socket.on('connection', function (data) {
    console.log('connection ' + socket.id);
    // socket.join(data.id);
  });

  socket.on('disconnect', function (data) {

    if (onlineClientSockets.includes(socket.id)) {
      var client = onlineKilnSockets.indexOf(socket.id);

      // onlineClientId.splice(client, 1);

      for (var i = onlineClientId.length - 1; i >= 0; i--) {
        if (onlineClientSockets[i] === socket.id) {
          socket.leave(onlineClientId[i]);
          onlineClientId.splice(i, 1);
          onlineClientSockets.splice(i, 1);
        }
      }
    }

    if (onlineKilnSockets.includes(socket.id)) {
      var kiln = onlineKilnSockets.indexOf(socket.id);
      socket.leave(onlineKilnId[kiln]);
      kilnOnline(onlineKilnId[kiln], false);
      onlineKilnId.splice(kiln, 1);
      onlineKilnSockets.splice(kiln, 1);
    }

    // var info;
    // function findSocket(input) {
    //   return input.socket === socket.id;
    // }

    // var kiln = onlineSockets.indexOf(findSocket);
    // var client = onlineClients.indexOf(findSocket);
    // console.log(kiln);
    // console.log(client);
    // if (kiln != -1) {
    //   info = onlineSockets.find(findSocket);
    //   console.log(chalk.red('Kiln went offline ' + info.id));
    //   kilnOnline(info.id, false);
    //   onlineSockets.splice(kiln, 1);
    //   socket.leave(info.id);
    // }

    // if (client != -1) {
    //   info = onlineSockets.find(findSocket);
    //   console.log(chalk.red('User left sockets ' + info.id));
    //   onlineSockets.splice(client, 1);
    //   socket.leave(info.id);
    // }


    console.log('Clients ' + onlineClientId);
    console.log('Connection ' + onlineClientSockets);
    console.log('----------');
    console.log('Kilns ' + onlineKilnId);
    console.log('Connection ' + onlineKilnSockets);
  });

  // fuction gets called when client on the site connects
  socket.on('clientId', function (data) {

    if (onlineClientId.includes(data.id)) {
      var client = onlineClientId.indexOf(data.id);
      onlineClientId.splice(client, 1);
      onlineClientSockets.splice(client, 1);
      socket.leave(data.id);
    }

    onlineClientId.push(data.id);
    onlineClientSockets.push(socket.id);

    console.log(chalk.green('client connected to ' + data.id));
    console.log(onlineClientId);
    socket.join(data.id);
  });

  // fuction gets called when kiln connects
  socket.on('kilnId', function (data) {
    data = JSON.parse(data);

    if (onlineKilnSockets.includes(data.id)) {
      var kiln = onlineKilnSockets.indexOf(data.id);
      onlineKilnId.splice(kiln, 1);
      onlineKilnSockets.splice(kiln, 1);
      socket.leave(data.id);
    }

    data.online = true;

    console.log(chalk.cyan('kiln connected to ' + data.id));

    kilnOnline(data.id, true);

    onlineKilnId.push(data.id);
    onlineKilnSockets.push(socket.id);


    console.log(onlineKilnSockets);
    socket.join(data.id);
  });

  socket.on('kilnSetup', function (data) {
    data = JSON.parse(data);
    newKiln(data);
  });

  socket.on('kilnScheduleUpdate', function (data) {
    data = JSON.parse(data);
    console.log('Kiln ' + data.id + ' is ' + data.scheduleStatus + ' ' + data.schedule);
    data.online = true;
    kilnStatusUpdate(data.id, data);
  });

  socket.on('clientScheduleUpdate', function (data) {
    console.log('request to start ' + data.id);
    setInterval(randomTemp.bind(null, data.id), 1000);
    io.in(data.id).emit('clientScheduleUpdate ' + data.id, data);
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
    // io.in(data.id).emit('tempServerUpdate' + data.id, data);
  });

  socket.on('emailUpdate', function (data) {
    data = JSON.parse(data);
    emailAlerts(data.id, data.message);
  });

  socket.on('stop', function (data) {

    // var info = { username: 'samueljim', title: 'Test kiln' };
    // newKiln(info);

    io.in(data.id).emit('kilnStop', {});
  });

  // for demo
  function randomTemp(inputID) {
    var data = {
      id: inputID
    };
    // data.x = Date.now();
    // -1 or 1 with 30% probability
    random += Math.random() < 0.2 ? -Math.random() : +Math.random();

    if (random > 400) {
      random += Math.random() < 0.7 ? -Math.random() : +Math.random();
    }
    random = Math.round(random * 100) / 100;
    if (random < 1) {
      random = 1;
    }
    data.y = random;

    updateTempDatabase(data);
  }

  // this fuction will update the database so that it has the latest temp
  function updateTempDatabase(entries) {
    var id = entries.id;
    var data;
    // var data.data = data.temp;
    // console.log(chalk.red('run'));
    ControlPanel.findById(id, function (err, controlPanel) {
      if (err)
        console.log(err);
      // if (controlPanel.runNum === 0) {
      //   controlPanel.runNum = 1;
        // controlPanel.runs[controlPanel.runNum].startTime = Date.now();
      //   controlPanel.runs.push({
      //     scheduleTitle: 'First Run',
      //     startTime: Date.now(),
      //     temp: [
      //       {
      //         y: 0,
      //         x: 0
      //       }
      //     ]
      //   }
      // );
      // }
      var time = Date.now() - controlPanel.runs[controlPanel.runNum].startTime;
      // time = time.toUTCString();
      // console.log(time);
      data = {
        y: entries.y,
        x: time
      };
      // var array = 'runs.' + controlPanel.runNum + '.temp';
      // console.log('it works');
      controlPanel.runs[controlPanel.runNum].temp.push(data);

      // send to client the new temp and time of temp change
      io.in(id).emit('tempServerUpdate' + id, data);

      controlPanel.save(
    function (err, raw) {
      if (err) {
        console.log(chalk.red('Error ' + err + ' The raw response from Mongo was ', raw));
        // errorHandler(err);
      }
    });
    });

  }
  // working
  function kilnOnline(id, state) {
    var data = {
      online: state
    };
    ControlPanel.findByIdAndUpdate(id, data,
      function (err, raw) {
        if (err) {
          console.log(chalk.red('Error ' + err + ' The raw response from Mongo was ', raw));
          errorHandler(err);
        }
      });

    io.in(id).emit('clientStatus' + id, data);
  }
  // not tested
  function kilnStatusUpdate(id, data) {
    ControlPanel.findById(id, function (err, controlPanel) {
      if (err)
        console.log(chalk.red(err));
      if (data.scheduleStatus === 'start') {
        controlPanel.runNum = controlPanel.runNum + 1;
        controlPanel.runs.push({
          scheduleTitle: data.scheduleTitle,
          startTime: Date.now(),
          temp: [
            {
              y: 0,
              x: 0
            }
          ]
        }
      );
        controlPanel.scheduleStatus = 'Starting';
      }
      controlPanel.save(function (err) {
        if (err) {
          console.log('Kiln failed to be updated');
          console.log(chalk.red(err));
        } else {
          console.log(chalk.bgGreen('New update ' + controlPanel._id));
          io.in(data.id).emit('clientStatus' + data.id, data);
        }
      });
    });
  }
  // working but return is not
  function newKiln(info) {
    var controlPanel = new ControlPanel(info);
    controlPanel.runs = {
      scheduleTitle: 'No runs',
      temp: [
        {
          y: null,
          x: null
        }
      ]
    };
    User.findOne({ 'username': info.username }, function (err, User) {
      if (err) {
        console.log(chalk.red(err));
      } else {
        controlPanel.user = User._id;
        controlPanel.save(function (err) {
          if (err) {
            console.log('Kiln failed to be made');
            console.log(chalk.red(err));
            io.emit('newID', err);
          } else {
            console.log(chalk.bgGreen('New kiln ' + controlPanel.id));
            io.emit('newID', controlPanel);
          }
        });
      }
    });
  }


  // this is where the demo kilns are set

  // setInterval(randomTemp.bind(null, '59e07c27f069b80f3033e260'), 1000);

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

};
