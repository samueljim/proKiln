(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsController', ControlPanelsController);

  ControlPanelsController.$inject = ['$scope', 'controlPanelResolve'];

  function ControlPanelsController($scope, controlPanel,) {
    var vm = this;

    vm.controlPanel = controlPanel;
  }

}());
