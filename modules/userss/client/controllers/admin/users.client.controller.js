(function () {
  'use strict';

  angular
    .module('userss.admin')
    .controller('UserssAdminController', UserssAdminController);

  UserssAdminController.$inject = ['$scope', '$state', '$window', 'usersResolve', 'Authentication', 'Notification'];

  function UserssAdminController($scope, $state, $window, users, Authentication, Notification) {
    var vm = this;

    vm.users = users;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Users
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.users.$remove(function() {
          $state.go('admin.userss.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Users deleted successfully!' });
        });
      }
    }

    // Save Users
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.usersForm');
        return false;
      }

      // Create a new users, or update the current instance
      vm.users.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.userss.list'); // should we send the User to the list or the updated Users's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Users saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Users save error!' });
      }
    }
  }
}());
