(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesListController', SchedulesListController);

  SchedulesListController.$inject = ['SchedulesService'];

  function SchedulesListController(SchedulesService) {
    var vm = this;

    vm.schedules = SchedulesService.query();
  }
}());
