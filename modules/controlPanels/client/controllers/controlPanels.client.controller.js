(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsController', ControlPanelsController);

  ControlPanelsController.$inject = ['$scope', 'controlPanelResolve'];

  function ControlPanelsController($scope, controlPanel) {
    var vm = this;

    vm.controlPanel = controlPanel;
    if(vm.controlPanel.isCurrentUserOwner){
      console.log("you own this kiln 😀 everything is okay 👌👌");
    }else{
      console.log("👮👮 not the owner 🚓🚓🚓 please leave ASAP 🚨🚨🚨🚨🚨");
    }
  }


}());
