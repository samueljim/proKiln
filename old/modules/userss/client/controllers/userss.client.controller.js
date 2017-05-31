(function () {
  'use strict';

  angular
    .module('userss')
    .controller('UserssController', UserssController);

  UserssController.$inject = ['$scope', 'usersResolve', 'Authentication'];

  function UserssController($scope, users, Authentication) {
    var vm = this;

    vm.users = users;
    vm.authentication = Authentication;

  }
}());
