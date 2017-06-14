(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsController', ControlPanelsController);

  ControlPanelsController.$inject = ['$scope', 'controlPanelResolve', 'userResolve' 'Authentication'];

  function ControlPanelsController($scope, controlPanel, user, Authentication) {
    var vm = this;

    vm.controlPanel = controlPanel;
    vm.authentication = Authentication;
    vm.user = user;

    function isOwnedByUser() {
      return vm.controlPanels.user === vm.authentication.user._id;
    }
  }
}());
