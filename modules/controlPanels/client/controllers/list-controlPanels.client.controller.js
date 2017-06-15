(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['ControlPanelsService', 'userResolve' 'Authentication'];

  function ControlPanelsListController(ControlPanelsService, Authentication, user) {
    var vm = this;

    vm.controlPanels = ControlPanelsService.query();
    function isOwnedByUser() {
      return vm.controlPanels.user === vm.authentication.user._id;
    }
  }
}());
