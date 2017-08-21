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
      changes = true;
      vm.remove = function(program) {
        var index = vm.schedule.program.indexOf(program);
        vm.schedule.program.splice(index, 1);
      }
    }
    // // change order up
    // function up(program) {
    //   var index = vm.schedule.program.indexOf(program);
    //   var aboveProgram = vm.schedule.program[index - 1];
    //   var rate1 = program.rate;
    //   var goal1 = program.goal;
    //   var hold1 = program.hold;
    //   program.rate = vm.schedule.program[index - 1].rate;
    //   program.goal = vm.schedule.program[index - 1].goal;
    //   program.hold = vm.schedule.program[index - 1].hold;
    //   vm.schedule.program[index - 1].rate = program.rate;
    //   vm.schedule.program[index - 1].goal = program.goal;
    //   vm.schedule.program[index - 1].hold = program.hold;
    //
    //   // var indexbefore - 1 = vm.schedule.program.indexOf(program);
    //   console.log("Up");
    //
    // }
    // // change order down
    // function down(program) {
    //
    //   console.log("Down");
    // }

    function move(index, direction) {
      changes = true;
      var itemToMove = vm.schedule.program[index];
      // console.log(vm.schedule.program[index]);
      // console.log(vm.schedule.program[index - 1]);
      // console.log(itemToMove);
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
      // if (!$scope.$$phase)
      //   $scope.$apply();
    }


    // add a new line to the segment
    function addSegment() {
      changes = true;
      // console.log("addSegment clicked");
      var program = {
        segment: vm.schedule.program.length + 1,
        rate: null,
        goal: null,
        hold: null
      };
      vm.schedule.program.push(program);
    }

    function change(){
        changes = true;
    }
    // Save Schedule
    function save() {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.programForm');
      //   return false;
      // }

      // Create a new schedule, or update the current instance
      vm.schedule.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

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
