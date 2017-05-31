(function () {
  'use strict';

  angular
    .module('kilns')
    .controller('KilnsController', KilnsController);

  KilnsController.$inject = ['$scope', 'kilnResolve', 'Authentication'];

  function KilnsController($scope, kiln, Authentication) {
    var vm = this;

    vm.kiln = kiln;
    vm.authentication = Authentication;

  }
}());
