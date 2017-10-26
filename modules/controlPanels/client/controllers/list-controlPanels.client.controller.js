(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['$state', '$scope', '$filter', 'ControlPanelsService', 'Authentication', 'Socket', 'Notification'];

  function ControlPanelsListController($state, $scope, $filter, ControlPanelsService, Authentication, Socket, Notification) {
    var vm = this;

    vm.pageChanged = pageChanged;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.authentication = Authentication;
    
    vm.demoAdd = demoAdd;
    
    function demoAdd() {
      var user = vm.authentication.user.username;
      var data = { title: 'Demo kiln ' + (vm.controlPanels.length + 1), username: user, content: user };
      Socket.emit('demokilnSetup', data);
      // console.log(vm.authentication.user.username);
    }

    ControlPanelsService.query(function (data) {
      vm.controlPanels = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.controlPanels, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      //

      vm.pagedItems = vm.filteredItems.slice(begin, end);
      console.log(vm.pagedItems);

      init();

    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    // this function takes care of joining all sockets for the current user
    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
        console.log('Connection Socket');
      }

	// for (let controlPanel in vm.pagedItems) {
      vm.pagedItems.forEach(function (controlPanel, index) {
        Socket.emit('id', {
          id: controlPanel._id,
          time: Date.now()
        });
        controlPanel.liveTemp = controlPanel.runs[0].temp[0].y;
        controlPanel.updateTime = controlPanel.runs[0].temp[0].x;

        Socket.emit('clientId', { id: controlPanel._id });

        Socket.removeListener('tempServerUpdate' + controlPanel._id);

        Socket.on('tempServerUpdate' + controlPanel._id, function (data) {
          if (data.id === controlPanel._id) {
            controlPanel.liveTemp = data.y;
            controlPanel.updateTime = data.x;
            // Notification.info ({
            //   message: '<i class="glyphicon glyphicon-flash"></i> ' + controlPanel.title + ' Has been updated to ' + controlPanel.liveTemp
            // });
          }
        });

        Socket.removeListener('clientStatus' + controlPanel._id);

        Socket.on('clientStatus' + controlPanel._id, function (data) {
          controlPanel.schedule = data.schedule;
          controlPanel.online = data.online;
          vm.controlPanel.scheduleProgress = data.scheduleProgress;
          vm.controlPanel.scheduleStatus = data.scheduleStatus;
          Notification.info({
            message: '<i class="glyphicon glyphicon-flash"></i> ' + controlPanel.title + ' Has been updated to ' + data.scheduleStatus
          });
        });

        Socket.removeListener('disconnect');
        Socket.on('disconnect', function () {
          console.log('disconnect so connecting again');
          Socket.connect();
          // init();
        });
      }
    );
    }
  }
}()
);
