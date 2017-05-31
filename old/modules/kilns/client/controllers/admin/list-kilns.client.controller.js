(function () {
  'use strict';

  angular
    .module('kilns.admin')
    .controller('KilnsAdminListController', KilnsAdminListController);

  KilnsAdminListController.$inject = ['KilnsService'];

  function KilnsAdminListController(KilnsService) {
    var vm = this;

    vm.kilns = KilnsService.query();
  }
}());
