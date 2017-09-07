(function() {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesProgramController', SchedulesProgramController);


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
      backgroundColor: '#bf5a16',
      borderColor: '#80b6f4',
      borderWidth: 2,
      pointBorderColor: "#80b6f4",
      pointBackgroundColor: "#80b6f4",
      pointHoverBackgroundColor: "#80b6f4",
      pointHoverBorderColor: "#80b6f4",
      pointBorderWidth: 10,
      pointHoverRadius: 10,
      pointHoverBorderWidth: 1,
      pointRadius: 3,
      fill: true
    };

    vm.options = {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            fontColor: 'white',
            defaultFontSize: 13
          }
        }],
        yAxes: [{
          ticks: {
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

    $scope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams, options){
      if (changes)
      {
          var message = "Are you sure you want to navigate away from this page?\n\nYou have started writing or editing a post.\n\nPress OK to continue or Cancel to stay on the current page.";
          if (confirm(message)) return true;
          else event.preventDefault();;
      }
    })

    //  Sortable.create(simpleList, { /* options */ });
    // Remove existing Schedule
    function remove(program) {
      // console.log("hey");
      if(vm.schedule.program.length > 1){
      change();
      vm.remove = function(program) {
        var index = vm.schedule.program.indexOf(program);
        vm.schedule.program.splice(index, 1);
      }
      }else{
        console.log("Without any items there is no schedule");
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
        console.log("Up");
      } else {
        vm.schedule.program[index].segment = index + 1;
        vm.schedule.program[index + 1].segment = index;
        vm.schedule.program[index] = vm.schedule.program[index + 1];
        vm.schedule.program[index + 1] = itemToMove;
        console.log("Down");
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

    function graphifyData(){

      vm.schedule.values = [{x:0,y:vm.schedule.startTemp}];
      // for (let program of vm.schedule.program) {
        vm.schedule.program.forEach(function(program, index) {

        if (program.segment === 1) {
          program.timeToGoal = (program.goal - vm.schedule.values[0].y) / program.rate;
          program.firstCumulative = program.timeToGoal;
          program.secondCumulative = program.firstCumulative + program.hold;
        } else {
          program.timeToGoal = (program.goal - vm.schedule.program[vm.schedule.program.indexOf(program) - 1].goal) / program.rate;
          program.firstCumulative = vm.schedule.program[vm.schedule.program.indexOf(program) - 1].secondCumulative + program.timeToGoal;
          program.secondCumulative = program.firstCumulative + program.hold;
        }
        var data1 = {
          x: program.firstCumulative,
          y: program.goal
        }
        var data2 = {
          x: program.secondCumulative,
          y: program.goal
        }
        vm.schedule.values.push(data1);
        vm.schedule.values.push(data2);
        if (vm.schedule.program.indexOf(program) === vm.schedule.program.length - 1) {
          vm.schedule.totalTiming = program.secondCumulative;
        }
      });
      console.log(vm.schedule);
    }

    graphifyData();

    // function which sets changes to true
    function change(){
        changes = true;
        graphifyData();
    }

    // Save Schedule
    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
      //   return false;
      // }
      var correct = true;
      vm.schedule.program.forEach(function (segment, index) {
        if (segment.hold < 0) {
          Notification.error({
            message: 'Hold in Segment ' + segment.segment + ' must be more than zero.'
          });
          correct = false;
        }
        if (segment.rate === 0) {
          Notification.error({
            message: 'Rate in Segment ' + segment.segment + ' connot be zero.'
          })
          correct = false;
        }
        if ( index === 0 ) {
          if ( ( segment.rate < 0 && segment.goal > vm.schedule.startTemp ) || ( segment.rate > 0 && segment.goal < vm.schedule.startTemp ) ) {
            Notification.error({
              message: 'Rate will never reach Goal in Segment ' + segment.segment + ''
            })
            correct = false;
          }
        } else {
          if ( ( segment.rate < 0 && segment.goal > vm.schedule.program[index-1].goal ) || ( segment.rate > 0 && segment.goal < vm.schedule.program[index-1].goal ) ) {
            Notification.error({
              message: 'Rate will never reach Goal in Segment ' + segment.segment + ''
            })
            correct = false;
          }
        }
      });

      // Create a new schedule, or update the current instance
      if (correct) {
      vm.schedule.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);
      }

      function successCallback(res) {
        changes = false;
        $state.go('schedules.list');
        Notification.success({
          message: '<i class="glyphicon glyphicon-floppy-saved"></i> Schedule saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Schedule save error!'
        });
      }
    }

}
}());
