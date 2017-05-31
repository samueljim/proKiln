(function () {
  'use strict';

  angular
    .module('userss.admin')
    .controller('UserssAdminListController', UserssAdminListController);

  UserssAdminListController.$inject = ['UserssService'];

  function UserssAdminListController(UserssService) {
    var vm = this;

    vm.userss = UserssService.query();
  }
}());
