(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['ControlPanelsService'];

  function ControlPanelsListController(ControlPanelsService) {
    var vm = this;

    vm.controlPanels = ControlPanelsService.query();
  }
}());
