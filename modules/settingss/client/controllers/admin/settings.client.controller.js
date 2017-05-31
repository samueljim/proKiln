(function () {
  'use strict';

  angular
    .module('settingss.admin')
    .controller('SettingssAdminController', SettingssAdminController);

  SettingssAdminController.$inject = ['$scope', '$state', '$window', 'settingsResolve', 'Authentication', 'Notification'];

  function SettingssAdminController($scope, $state, $window, settings, Authentication, Notification) {
    var vm = this;

    vm.settings = settings;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Settings
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.settings.$remove(function() {
          $state.go('admin.settingss.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Settings deleted successfully!' });
        });
      }
    }

    // Save Settings
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.settingsForm');
        return false;
      }

      // Create a new settings, or update the current instance
      vm.settings.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.settingss.list'); // should we send the User to the list or the updated Settings's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Settings saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Settings save error!' });
      }
    }
  }
}());
