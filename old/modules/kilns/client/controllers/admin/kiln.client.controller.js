(function () {
  'use strict';

  angular
    .module('kilns.admin')
    .controller('KilnsAdminController', KilnsAdminController);

  KilnsAdminController.$inject = ['$scope', '$state', '$window', 'kilnResolve', 'Authentication', 'Notification'];

  function KilnsAdminController($scope, $state, $window, kiln, Authentication, Notification) {
    var vm = this;

    vm.kiln = kiln;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Kiln
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.kiln.$remove(function() {
          $state.go('admin.kilns.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Kiln deleted successfully!' });
        });
      }
    }

    // Save Kiln
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.kilnForm');
        return false;
      }

      // Create a new kiln, or update the current instance
      vm.kiln.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.kilns.list'); // should we send the User to the list or the updated Kiln's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Kiln saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Kiln save error!' });
      }
    }
  }
}());
