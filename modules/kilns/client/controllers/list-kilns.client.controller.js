(function () {
  'use strict';

  angular
    .module('kilns')
    .controller('KilnsListController', KilnsListController);

  KilnsListController.$inject = ['KilnsService'];

  function KilnsListController(KilnsService) {
    var vm = this;

    vm.kilns = KilnsService.query();
  }
}());
