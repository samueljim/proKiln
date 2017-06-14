(function () {
  'use strict';

  angular
    .module('memes.admin')
    .controller('MemesAdminListController', MemesAdminListController);

  MemesAdminListController.$inject = ['MemesService'];

  function MemesAdminListController(MemesService) {
    var vm = this;

    vm.memes = MemesService.query();
  }
}());
