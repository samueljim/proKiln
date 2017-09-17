(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesProgramController', SchedulesProgramController)
    .directive('dlKeyCode', dlKeyCode);

    function dlKeyCode() {
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
          $element.bind("keypress", function(event) {
            var keyCode = event.which || event.keyCode;
  
            if (keyCode == $attrs.code) {
              $scope.$apply(function() {
                $scope.$eval($attrs.dlKeyCode, {$event: event});
              });
            }
          });
        }
      };
    }

  SchedulesProgramController.$inject = ['$scope', '$state', 'scheduleResolve', 'Notification'];

  function SchedulesProgramController($scope, $state, schedule, Notification) {
    var vm = this;

    vm.schedule = schedule;
    vm.form = {};
    vm.addSegment = addSegment;
    vm.remove = remove;
    vm.save = save;
    vm.move = move;
    vm.change = change;

    vm.datasetOverride = {
      backgroundColor: '#bf4040',
      borderColor: '#f0ad4e',
      borderWidth: 4,
      pointBorderColor: '#f0ad4e',
      pointBackgroundColor: '#f0ad4e',
      pointHoverBackgroundColor: '#f0ad4e',
      pointHoverBorderColor: '#f0ad4e',
      pointHitRadiusL: 120,
      pointBorderWidth: 10,
      pointHoverRadius: 10,
      pointHoverBorderWidth: 10,
      pointRadius: 1,
      lineTensionL: 0,
      fill: true
    };

    vm.options = {
      animation: false,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            fontColor: 'white',
            labelString: 'Time in minutes'
          },
          type: 'linear',
          ticks: {
            min: 0,
            fontColor: 'white',
            defaultFontSize: 13
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            fontColor: 'white',
            labelString: 'Temperature in °C'
          },
          type: 'linear',
          ticks: {
            min: 0,
            fontColor: 'white',
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

    var changes = false;
    var correct = true;
    // Remove existing Schedule
    function remove(program) {
      // console.log("hey");

      if (vm.schedule.program.length > 1) {
        var index = vm.schedule.program.indexOf(program);
        vm.schedule.program.splice(index, 1);
        changes = true;
        graphifyData();
      } else {
        console.log('Without any items there is no schedule');
      }
    }

    // Moves the items in the scope up and down to reorder them
    function move(index, direction) {
      change();
      var itemToMove = vm.schedule.program[index];

      if (direction === 1) {
        vm.schedule.program[index].segment = index - 1;
        vm.schedule.program[index - 1].segment = index;
        vm.schedule.program[index] = vm.schedule.program[index - 1];
        vm.schedule.program[index - 1] = itemToMove;
        console.log('Up');
      } else {
        vm.schedule.program[index].segment = index + 1;
        vm.schedule.program[index + 1].segment = index;
        vm.schedule.program[index] = vm.schedule.program[index + 1];
        vm.schedule.program[index + 1] = itemToMove;
        console.log('Down');
      }
    }

    // add a new line to the segment
    function addSegment() {
      change();
      var program = {
        segment: vm.schedule.program.length + 1,
        rate: vm.schedule.program[vm.schedule.program.length - 1].rate,
        goal: vm.schedule.program[vm.schedule.program.length - 1].goal,
        hold: 0
      };
      vm.schedule.program.push(program);
    }

    function graphifyData() {

      vm.schedule.values = [{ x: 0.01, y: vm.schedule.startTemp }];
      // for (let program of vm.schedule.program) {
      vm.schedule.program.forEach(function (program, index) {

        program.hold = Math.round(program.hold * 100) / 100;
        program.goal = Math.round(program.goal * 100) / 100;
        program.rate = Math.round(program.rate * 100) / 100;
        if (program.goal > 9999)
          program.goal = 9999;
        if (program.hold > 9999)
          program.hold = 9999;
        if (program.rate > 9999)
          program.rate = 9999;

        if (program.segment === 1) {
          if (program.goal >= vm.schedule.values[0].y) {
            program.timeToGoal = ((program.goal - vm.schedule.values[0].y) / program.rate) * 60;
          } else {
            program.timeToGoal = ((program.goal - vm.schedule.values[0].y) / (-1 * Math.abs(program.rate))) * 60;
          }
          program.firstCumulative = program.timeToGoal;
          program.secondCumulative = program.firstCumulative + program.hold;
        } else {
          if (program.goal >= vm.schedule.program[index - 1].goal) {
            program.timeToGoal = ((program.goal - vm.schedule.program[index - 1].goal) / program.rate ) * 60;
          } else {
            program.timeToGoal = ((program.goal - vm.schedule.program[index - 1].goal) / (-1 * Math.abs(program.rate))) * 60;
          }
          program.firstCumulative = vm.schedule.program[index - 1].secondCumulative + program.timeToGoal;
          program.secondCumulative = program.firstCumulative + program.hold;
        }
        var data1 = {
          x: program.firstCumulative,
          y: program.goal
        };
        var data2 = {
          x: program.secondCumulative,
          y: program.goal
        };
        vm.schedule.values.push(data1);
        vm.schedule.values.push(data2);
        if (index === vm.schedule.program.length - 1) {
          vm.schedule.totalTiming = Math.round(program.secondCumulative * 100) / 100;
        }
      });
    }

    graphifyData();

    // save every 5 seconds
    function autoCheck() {
      var autoCheck = setInterval(function () {
        check();
      }, 5000);
    }
    autoCheck();
    // function which sets changes to true
    function change() {
      changes = true;
      graphifyData();
        // save(true, 0);
    }


    function check() {
      vm.schedule.program.forEach(function (segment, index) {
        segment.error = false;
        if (segment.hold < 0) {
          segment.error = true;
          Notification.error({
            message: 'Hold in Segment ' + segment.segment + ' must be more or equal to than zero.', replaceMessage: true
          });
          segment.hold = Math.abs(segment.hold);
          change();
          correct = false;
        }
        if (segment.goal < 0) {
          segment.error = true;
          Notification.error({
            message: 'Goal in Segment ' + segment.segment + ' must be more or equal to than zero.', replaceMessage: true
          });
          segment.goal = Math.abs(segment.goal);
          change();
          correct = false;
        }
        if (segment.rate <= 0) {
          segment.error = true;
          Notification.error({
            message: 'Rate in Segment ' + segment.segment + ' must be more than zero.', replaceMessage: true
          });
          segment.rate = Math.abs(segment.rate);
          change();
          correct = false;
        }
      });
      graphifyData();
    }
    // Save Schedule
    function save(correct, leave) {

      check();

      // Create a new schedule, or update the current instance
      if (correct) {
        vm.schedule.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        changes = false;
        if (leave === 1) {
          $state.go('schedules.list');
          Notification.success({
            message: '<i class="glyphicon glyphicon-floppy-saved"></i> Schedule saved successfully!'
          });
        }
      }

      function errorCallback(res) {
        changes = true;
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Schedule server save error!', replaceMessage: true
        });
      }
    }

    // stop users from leaving if changes have not been saved
    $scope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams, options) {
      // stops auto save and saves before leaving
      save(true, 0);

      clearInterval(autoCheck);
      if (changes) {
        var message = 'Are you sure you want to navigate away from this page?\n\nThere are issues with the entered data so it will not be saved \n\nPress OK to continue or Cancel to stay on the current page.';
        if (confirm(message)) return true;
        else {
          event.preventDefault();
          autoCheck();
        }
      }
    });

  }
}());
