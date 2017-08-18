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
    vm.up = up;
    vm.down = down;

    // vm.schedule.program = [{
    //   segment:"1"
    // }];

    //  Sortable.create(simpleList, { /* options */ });
    // Remove existing Schedule
    function remove(program) {
      // console.log("hey");
      vm.remove = function(program) {
        var index = vm.schedule.program.indexOf(program);
        vm.schedule.program.splice(index, 1);
      }
    }
    // change order up
    function up(program){
      var index = vm.schedule.program.indexOf(program);
      // var indexbefore - 1 = vm.schedule.program.indexOf(program);
      console.log("Up");

    }
    // change order down
    function down(program){

      console.log("Down");
    }


    // add a new line to the segment
    function addSegment() {
      // console.log("addSegment clicked");
      var program = {
        segment: vm.schedule.program.length + 1,
        rate: null,
        goal: null,
        hold: null
      };
      vm.schedule.program.push(program);
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
