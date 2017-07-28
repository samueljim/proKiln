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


    for (let controlPanel of vm.pagedItems) {
      // console.log(controlPanel);
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
              console.log('New Temp ' + data.temp);
            }
          });
      console.log(controlPanel.heat);
    }
  }
    // socket adding fuction

  }
//   function myDirective(){
// return {
//   restrict: "E",
//   // template: '<div>{{ myDirective }}</div>', // where myDirective binds to scope.myDirective
//   scope: {},
//   link: function(scope) {
//     scope.temp = 20;
//     // scope.temp = scope.myDirective.temp[scope.myDirective.temp.length -1].data
//     // console.log('Do action with data', myDirective);
//     // console.log('Hey' + scope.myDirective.title);
//     // console.log('' + element);
//     // Socket.on('tempServerUpdate' + vm.controlPanel._id, function(data) {
//     //   if (data.id === controlPanel._id){
//     //     vm.temp = data.temp;
//     //     vm.updateTime = data.time;
//     //     console.log('New Temp ' + data.temp);
//     //   }
//     // });
//     // scope.temp = scope.myDirective.temp[scope.myDirective.temp.length -1].data;
//     // scope.updateTime = scope.myDirective.temp[scope.myDirective.temp.length -1].time;
//   }
// };
// }

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
