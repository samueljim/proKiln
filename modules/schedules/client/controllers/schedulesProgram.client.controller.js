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

    // function which sets changes to true
    function change(){
        changes = true;
    }

    // Save Schedule
    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
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
