(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsController', ControlPanelsController);

  ControlPanelsController.$inject = ['$scope', '$state', 'Authentication', 'controlPanelResolve', 'Socket'];

  function ControlPanelsController($scope, $state, Authentication, controlPanel, Socket) {
    var vm = this;

    vm.controlPanel = controlPanel;
    vm.sendtemp = sendtemp;
    vm.temp = vm.controlPanel.temp[vm.controlPanel.temp.length - 1].data;
    vm.updateTime = vm.controlPanel.temp[vm.controlPanel.temp.length - 1].time;

    // vm.controlPanel.temp.data = vm.controlPanel.temp;
    // $scope.$on('$update', stateChangeSuccess);

    if (vm.controlPanel.isCurrentUserOwner) {
      console.log('you own this kiln 😀 everything is okay 👌👌');
    } else {
      console.log('👮👮 not the owner 🚓🚓🚓 please leave ASAP 🚨🚨🚨🚨🚨');
      // TODO put back in after debug
      // $state.go('home');

    }

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }
      // emit the id of the kiln
      Socket.emit('id', {
        id: vm.controlPanel._id,
        time: Date.now()
      });

      // Add an event listener to the 'tempServerUpdate' event
      Socket.on('tempServerUpdate', function(data) {
        // vm.controlPanel.temp.unshift(temp);vm.tempText
        vm.temp = data.temp;
        vm.updateTime = data.time;
        console.log('New Temp ' + data.temp);    // vm.tempText = 10;

      });

      // Socket.on('connect_failed', function() {
      //   document.write("Sorry, there seems to be an issue with the connection!");
      //   console.log('connection issue');
      // });
      //
      // $scope.$on('$destroy', function () {
      //   Socket.removeListener('tempServerUpdate');
      // });
    }

    //  method for sending temp
    function sendtemp() {
      // console.log('sendtemp run');
      // Create a new temp object
      var data = {
        temp: vm.tempText,
        id: vm.controlPanel._id
      };
      // Emit a 'tempKilnUpdate' temp event
      Socket.emit('tempKilnUpdate', data);
      console.log('Sent ' + data.temp);
    }
  }
}());
