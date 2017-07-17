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
    // $scope.$on('$update', stateChangeSuccess);

    if(vm.controlPanel.isCurrentUserOwner){
      console.log("you own this kiln 😀 everything is okay 👌👌");
    }else{
      console.log("👮👮 not the owner 🚓🚓🚓 please leave ASAP 🚨🚨🚨🚨🚨");
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
      Socket.on('tempServerUpdate', function (temp) {
        // vm.controlPanel.temp.unshift(temp);vm.tempText
        vm.controlPanel.temp = temp.text;
        console.log("New Temp " + temp.text );    // vm.tempText = 10;

      });

      $scope.$on('$destroy', function () {unshift
        Socket.removeListener('tempUpdate');
      });
    }
    // Create a controller method for sending temp
    function sendtemp() {
      console.log("sendtemp run");
      // Create a new temp object
      var temp = {
        text: vm.tempText
      };

      console.log(" "+ temp.text);
      // Emit a 'chattemp' temp event
      Socket.emit('tempClientUpdate', temp);

    }
  }
}());
