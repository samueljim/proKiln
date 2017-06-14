(function () {
  'use strict';

  angular
    .module('memes')
    .controller('MemesListController', MemesListController);

  MemesListController.$inject = ['MemesService'];

  function MemesListController(MemesService) {
    var vm = this;

    vm.memes = MemesService.query();
  }
}());
