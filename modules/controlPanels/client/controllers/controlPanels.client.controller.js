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
    vm.controlPanel.temp.data = vm.controlPanel.temp.data;
    // $scope.$on('$update', stateChangeSuccess);

    if (vm.controlPanel.isCurrentUserOwner) {
      console.log('you own this kiln 😀 everything is okay 👌👌');
    } else {
      console.log('👮👮 not the owner 🚓🚓🚓 please leave ASAP 🚨🚨🚨🚨🚨');
      // TODO this is a client solution and should be updated to sever side
      $state.go('home');

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

      Socket.emit('id', {
        id: vm.controlPanel._id,
        time: Date.now()
      });
      // console.log('the ID is ' + data.id);

      Socket.on('connection', function() {
        // Connected, let's sign-up for to receive messages for this room
      });

      // Add an event listener to the 'chattemp' event
      Socket.on('tempServerUpdate', function(data) {
        // vm.controlPanel.temp.unshift(temp);vm.tempText
        vm.controlPanel.temp.data = data.temp;
        console.log('New Temp ' + data.temp);    // vm.tempText = 10;

      });

      $scope.$on('$destroy', function () {
        Socket.removeListener('tempUpdate');
      });
    }
    Socket.on('connect_failed', function() {
      document.write("Sorry, there seems to be an issue with the connection!");
    })
    // Create a controller method for sending temp
    function sendtemp() {
      console.log('sendtemp run');
      // Create a new temp object
      var data = {
        temp: vm.tempText,
        id: vm.controlPanel._id
      };
      console.log('Sending ' + data.temp);
      // Emit a 'tempClientUpdate' temp event
      Socket.emit('tempKilnUpdate', data);
    }
  }
}());
