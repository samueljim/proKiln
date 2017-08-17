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
    // vm.schedule.program = [{
    //   segment:"1"
    // }];
    // Remove existing Schedule
    function remove() {
        vm.schedule.program.$remove(function() {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> Schedule deleted successfully!'
          });
        });
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
    function save(isValid) {
      isValid = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
        return false;
      }

      // Create a new schedule, or update the current instance
      vm.schedule.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Schedule saved successfully!'
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
