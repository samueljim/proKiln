(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsListController', ControlPanelsListController);
    // .directive('socketAdd', socketAdder);

  ControlPanelsListController.$inject = ['$scope', '$filter', 'ControlPanelsService', 'Authentication', 'Socket'];

  function ControlPanelsListController($scope, $filter, ControlPanelsService, Authentication, Socket) {
    var vm = this;
    // vm.temp = vm.controlPanel.temp[vm.controlPanel.temp.length - 1].data;
    // vm.updateTime = vm.controlPanel.temp[vm.controlPanel.temp.length - 1].time;
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
      console.log(vm.pagedItems);

      for (let controlPanel of vm.pagedItems) {
        console.log("hey");
        console.log(controlPanel);
        vm.temp = controlPanel.temp[0].data;
        vm.updateTime = controlPanel.temp[0].time;
      }
    }
    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
    // socket adding fuction

  }

  // function socketAdder() {
  //   return {
  //      restrict: "E",
  //      scope: {
  //          pos: "@"
  //      },
  //      template: "<td>{{ formattedText }}</td>", // should I have this?
  //      link: function(scope, element, attrs){
  //          // all of this can easily be done with a filter, but i understand you just want to
  //          // know how it works
  //          scope.formattedText = scope.pos.Name + ' (' + scope.pos.Code + ')';
  //      }
  //    }
  // }

}());
