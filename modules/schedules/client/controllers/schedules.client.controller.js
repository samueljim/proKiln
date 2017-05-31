(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesController', SchedulesController);

  SchedulesController.$inject = ['$scope', 'scheduleResolve', 'Authentication'];

  function SchedulesController($scope, schedule, Authentication) {
    var vm = this;

    vm.schedule = schedule;
    vm.authentication = Authentication;

  }
}());
