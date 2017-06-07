(function () {
  'use strict';

  angular
    .module('schedules.admin')
    .controller('SchedulesAdminListController', SchedulesAdminListController);

  SchedulesAdminListController.$inject = ['SchedulesService'];

  function SchedulesAdminListController(SchedulesService) {
    var vm = this;

    vm.schedules = SchedulesService.query();
  }
}());
