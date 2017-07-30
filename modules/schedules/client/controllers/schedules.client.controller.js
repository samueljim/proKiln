(function() {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesController', SchedulesController);

  SchedulesController.$inject = ['$scope', '$state', '$window', 'scheduleResolve', 'Notification'];

  function SchedulesController($scope, $state, $window, schedule, Notification) {
    var vm = this;

    vm.schedule = schedule;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Schedule
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.schedule.$remove(function() {
          $state.go('schedules.list');
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> Schedule deleted successfully!'
          });
        });
      }
    }

    // Save Schedule
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
        return false;
      }

      // Create a new schedule, or update the current instance
      vm.schedule.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('schedules.list'); // should we send the User to the list or the updated Schedule's view?
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
