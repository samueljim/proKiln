(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['$scope', '$filter', 'ControlPanelsService', 'Authentication', 'Socket', 'Notification'];

  function ControlPanelsListController($scope, $filter, ControlPanelsService, Authentication, Socket, Notification) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

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
      }

    for (let controlPanel of vm.pagedItems) {
      Socket.emit('id', {
        id: controlPanel._id,
        time: Date.now()
      });
      controlPanel.liveTemp = controlPanel.temp[controlPanel.temp.length -1].data;
      controlPanel.updateTime = controlPanel.temp[controlPanel.temp.length -1].time;
          Socket.on('tempServerUpdate' + controlPanel._id, function(data) {
            if (data.id === controlPanel._id){
              controlPanel.liveTemp = data.temp;
              controlPanel.updateTime = data.time;
            }
          });
          Socket.on('kilnStatus' + controlPanel._id, function(data) {
            controlPanel.schedule = data.schedule;
            controlPanel.online = data.online;
            vm.controlPanel.scheduleProgress = data.scheduleProgress;
            vm.controlPanel.scheduleStatus = data.scheduleStatus;
            Notification.info ({
              message: '<i class="glyphicon glyphicon-flash"></i> ' + controlPanel.title + ' Has been updated to ' + data.scheduleStatus
            });
          });
    }
  }
  }
}());
