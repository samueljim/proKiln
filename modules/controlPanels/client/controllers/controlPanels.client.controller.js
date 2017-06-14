(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsController', ControlPanelsController);

  ControlPanelsController.$inject = ['$scope', 'controlPanelResolve', 'Authentication'];

  function ControlPanelsController($scope, controlPanel, Authentication) {
    var vm = this;

    vm.controlPanel = controlPanel;
    vm.authentication = Authentication;

  }
}());
