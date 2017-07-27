(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);

  ControlPanelsListController.$inject = ['$scope', '$filter', 'ControlPanelsService'];

  function ControlPanelsListController($scope, $filter, ControlPanelsService) {
    var vm = this;

    // vm.controlPanels = ControlPanelsService.query();

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
      // Socket.on('tempServerUpdate' + vm.controlPanel._id, function(data) {
      //   if (data.id === controlPanel._id){
      //     vm.temp = data.temp;
      //     vm.updateTime = data.time;
      //     console.log('New Temp ' + data.temp);
      //   }
      // });
      vm.pagedItems = vm.filteredItems.slice(begin, end);

    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
