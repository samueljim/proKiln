(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['ControlPanelsService'];

  function ControlPanelsListController(ControlPanelsService) {
    var vm = this;

    vm.controlPanels = ControlPanelsService.query();
    // function isOwnedByUser() {
    //   return vm.controlPanels.user === vm.authentication.user._id;
    // }
  }
}());
