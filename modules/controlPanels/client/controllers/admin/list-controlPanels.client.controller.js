(function () {
  'use strict';

  angular
    .module('controlPanels.admin')
    .controller('ControlPanelsAdminListController', ControlPanelsAdminListController);

  ControlPanelsAdminListController.$inject = ['ControlPanelsService'];

  function ControlPanelsAdminListController(ControlPanelsService) {
    var vm = this;

    vm.controlPanels = ControlPanelsService.query();
  }
}());
