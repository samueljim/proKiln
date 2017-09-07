(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesListController', SchedulesListController);

  SchedulesListController.$inject = ['SchedulesService', '$scope', '$filter'];

  function SchedulesListController(SchedulesService, $scope, $filter) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    SchedulesService.query(function (data) {
      vm.schedules = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.schedules, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      //

      vm.pagedItems = vm.filteredItems.slice(begin, end);  
    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
