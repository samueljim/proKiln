(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['$scope', '$filter', 'ControlPanelsService', 'Authentication', 'Socket'];

  function ControlPanelsListController($scope, $filter, ControlPanelsService, Authentication, Socket) {
    var vm = this;
    // vm.temp = vm.controlPanel.temp[vm.controlPanel.temp.length - 1].data;
    // vm.updateTime = vm.controlPanel.temp[vm.controlPanel.temp.length - 1].time;
    // vm.controlPanels = ControlPanelsService.query();

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.addSockets = addSockets;

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
      // Socket.on('tempServerUpdate' + vm.controlPanel._id, function(data) {
      //   if (data.id === controlPanel._id){
      //     vm.temp = data.temp;
      //     vm.updateTime = data.time;
      //     console.log('New Temp ' + data.temp);
      //   }
      // });
      vm.pagedItems = vm.filteredItems.slice(begin, end);
      console.log(vm.pagedItems);
    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    // socket adding fuction
    function addSockets(controlPanel) {
      vm.temp = controlPanel.temp[controlPanel.temp.length - 1].data;
      vm.updateTime = controlPanel.temp[controlPanel.temp.length - 1].time;
    }

  }
}());
