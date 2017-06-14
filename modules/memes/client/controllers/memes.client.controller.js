(function () {
  'use strict';

  angular
    .module('memes')
    .controller('MemesController', MemesController);

  MemesController.$inject = ['$scope', 'memeResolve', 'Authentication'];

  function MemesController($scope, meme, Authentication) {
    var vm = this;

    vm.meme = meme;
    vm.authentication = Authentication;

  }
}());
