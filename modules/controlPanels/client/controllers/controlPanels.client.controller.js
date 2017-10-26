(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsController', ControlPanelsController);

  ControlPanelsController.$inject = ['$scope', '$state', 'Authentication', 'controlPanelResolve', 'Socket', 'SchedulesService', 'Notification'];

  function ControlPanelsController($scope, $state, Authentication, controlPanel, Socket, SchedulesService, Notification) {
    var vm = this;


    vm.controlPanel = controlPanel;
    vm.temp = vm.controlPanel.runs.temp[vm.controlPanel.runs.temp.length - 1].y;
    vm.updateTime = vm.controlPanel.runs.temp[vm.controlPanel.runs.temp.length - 1].x;
    vm.Authentication = Authentication;
    // vm.controlPanel.temp.x = vm.controlPanel.temp.data;
    // vm.controlPanel.temp.y = vm.controlPanel.temp.time;
    vm.start = start;
    vm.stop = stop;
    vm.change = change;
    vm.changeRun = changeRun;

    vm.demoStart = demoStart;
    vm.demo;
    function demoStart() {
      $state.go('.', { controlPanelId: controlPanel._id, run: controlPanel.runNum });
      vm.controlPanel.online = true;
      
      var data = { id: vm.controlPanel._id, email: vm.Authentication.user.email, scheduleStatus: 'start' };
      if (vm.demo) {
        Socket.emit('demoStop', data);
        vm.demo;
        
      } else {
        Socket.emit('demoStart', data);
        vm.demo = 1;
      }
    
    }

    vm.schedules = SchedulesService.query();

    // vm.controlPanel.temp.data = vm.controlPanel.temp;
    // $scope.$on('$update', stateChangeSuccess);
    // vm.labels = ["January", "February", "March", "April", "May", "June", "July"];

    vm.datasetOverride = {
      backgroundColor: 'rgba(191,191,191,0.2)',
      borderColor: '#804d4d',
      borderWidth: 4,
      pointBorderColor: '#804d4d',
      pointBackgroundColor: '#804d4d',
      pointHoverBackgroundColor: '#804d4d',
      pointHoverBorderColor: '#804d4d',
      pointHitRadiusL: 0,
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBorderWidth: 10,
      pointRadius: 0,
      // lineTensionL: 0.4,
      fill: true
    };

    vm.options = {
      animation: false,
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            fontColor: 'black',
            labelString: 'Time in minutes'
          },
          type: 'linear',
          ticks: {
            // min: 0,
            fontColor: 'black',
            defaultFontSize: 13
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            fontColor: 'black',
            labelString: 'Temperature in °C'
          },
          type: 'linear',
          ticks: {
            min: 0,
            fontColor: 'black',
            defaultFontSize: 13
          }
        }]
      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      }
    };

    vm.optionsTemp = {
      animation: false,
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            fontColor: 'black',
            labelString: 'Time in minutes'
          },
          type: 'time',
          // distribution: 'series',
          ticks: {
            // min: 0,
            fontColor: 'black',
            defaultFontSize: 13
          },
          time: {
            unit: 'minute',
            // unitStepSize: 10,
            displayFormats: {
              // min: 0,
              // max: moment().startOf('year'),
              minute: 'm'
            }
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            fontColor: 'black',
            labelString: 'Temperature in °C'
          },
          type: 'linear',
          ticks: {
            // min: 0,
            fontColor: 'black',
            defaultFontSize: 13
          }
        }]
      },
      elements: {
        line: {
          tension: 0.2 // disables bezier curves
        }
      }
    };

    if (vm.controlPanel.isCurrentUserOwner) {
      console.log('you own this kiln 😀 everything is okay 👌👌');
    } else {
      console.log('👮👮 not the owner 🚓🚓🚓 please leave ASAP 🚨🚨🚨🚨🚨');
      // TODO put back in after debug
      $state.go('home');
    }
    init();


    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {

        Socket.connect();
      }
      // emit the id of the kiln
      Socket.emit('clientId', {
        id: vm.controlPanel._id,
        time: Date.now()
      });

      // Add an event listener to the 'tempServerUpdate' event
      Socket.removeListener('tempServerUpdate' + vm.controlPanel._id);
      Socket.on('tempServerUpdate' + vm.controlPanel._id, function (data) {
        vm.temp = data.y;
        vm.updateTime = data.x;

        $state.go('.', { controlPanelId: controlPanel._id, run: controlPanel.runNum });

        vm.controlPanel.scheduleProgress++;
        if (vm.controlPanel.scheduleProgress >= 100) {
          vm.controlPanel.scheduleStatus = 'starting';

          vm.controlPanel.scheduleProgress = 0;
        }
        if (vm.controlPanel.scheduleProgress >= 10) {
          vm.controlPanel.scheduleStatus = 'heating';
        }
        if (vm.controlPanel.scheduleProgress >= 50) {
          vm.controlPanel.scheduleStatus = 'running';
        }
        if (vm.controlPanel.scheduleProgress >= 90) {
          vm.controlPanel.scheduleStatus = 'stopping';
        }
        vm.controlPanel.online = true;

        vm.controlPanel.runs.temp.push({ x: data.x, y: data.y });

        // for (var i = 2; i < vm.controlPanel.runs.temp.length; i += 3) {
        //   vm.controlPanel.runs.temp.splice(i, 1);
        // }

        console.log('New Temp ' + data.y);
      });
      // Add an event listener to the 'kilnStatus' event
      Socket.removeListener('clientStatus' + vm.controlPanel._id);
      Socket.on('clientStatus' + vm.controlPanel._id, function (data) {
        vm.controlPanel.schedule = data.schedule;
        vm.controlPanel.scheduleProgress = data.scheduleProgress;
        vm.controlPanel.scheduleStatus = data.scheduleStatus;
        vm.controlPanel.online = data.online;
        if (data.scheduleProgress >= 100) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-thumps-up"></i> ' + vm.controlPanel.title + ' Has finished running  ' + data.schedule.title
          });
        } else if (data.scheduleStatus === 'error') {
          Notification.error({
            message: '<i class="glyphicon glyphicon-ban-circle"></i>  error with kiln ' + vm.controlPanel.title
          });
        } else {
          Notification.info({
            message: '<i class="glyphicon glyphicon-flash"></i> ' + data.scheduleStatus + 'title:  ' + vm.controlPanel.title
          });
        }
      });

      Socket.removeListener('connect_failed');
      Socket.on('connect_failed', function () {
        Notification.error({
          message: '<i class="glyphicon glyphicon-ban-circle"></i>  connection to proKiln failed'
        });
      });
      Socket.removeListener('disconnect');
      Socket.on('disconnect', function () {
        Notification.error({
          message: '<i class="glyphicon glyphicon-ban-circle"></i>  no connection to proKiln', delay: 50000000
        });
      });
      Socket.removeListener('connect');
      Socket.on('connect', function () {
        Notification.clearAll();
        Notification.primary({
          message: '<i class="glyphicon glyphicon-okay"></i>  Reconnected to proKiln'
        });
      });
      // Socket.on('connect_failed', function() {
      //   document.write("Sorry, there seems to be an issue with the connection!");
      //   console.log('connection issue');
      // });
      //
      // $scope.$on('$destroy', function () {
      //   Socket.removeListener('tempServerUpdate');
      // });
    }

    function start() {
      if (vm.controlPanel.online === true) {
        console.log('start');
        var data = {
          scheduleStatus: 'Starting',
          scheduleProgress: 0,
          schedule: vm.controlPanel.schedule,
          id: vm.controlPanel._id
        };
        Socket.emit('clientScheduleUpdate', data);
      } else {
        Notification.error({
          message: '<i class="glyphicon glyphicon-ban-circle"></i>  kiln offline', replaceMessage: true
        });
      }
    }

    function change(schedule) {
      vm.controlPanel.schedule = schedule;
    }

    function changeRun() {
      console.log(vm.runChanger.ind);
      $state.go('.', { controlPanelId: controlPanel._id, run: vm.runChanger.ind });
    }

    function stop() {
      if (vm.controlPanel.online === false) {
        Notification.error({
          message: '<i class="glyphicon glyphicon-ban-circle"></i>  kiln offline', replaceMessage: true
        });
      }
      vm.controlPanel.online = false;
      console.log('stop');
      var data = {
        scheduleStatus: 'Stopping',
        // schedule: vm.controlPanel.schedule,
        id: vm.controlPanel._id
      };
      Socket.emit('stop', data);
      // io.in(data.id).emit('kilnStop', {});
      // Socket.emit('clientScheduleUpdate', data);
    }
    //  method for sending temp
    // function sendtemp() {
    //   // console.log('sendtemp run');
    //   // Create a new temp object
    //   var data = {
    //     y: vm.tempText,
    //     id: vm.controlPanel._id
    //   };
    //   // Emit a 'tempKilnUpdate' temp event
    //   Socket.emit('tempKilnUpdate', data);
    //   console.log('Sent ' + data.temp);
     // }
// Samuel Henry 2017

}
}());
