(function () {
  'use strict';

  angular
    .module('userss')
    .controller('UserssListController', UserssListController);

  UserssListController.$inject = ['UserssService'];

  function UserssListController(UserssService) {
    var vm = this;

    vm.userss = UserssService.query();
  }
}());
