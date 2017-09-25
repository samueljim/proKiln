(function () {
  'use strict';

  angular
    .module('controlPanels')
    .controller('ControlPanelsEditController', ControlPanelsEditController);

  ControlPanelsEditController.$inject = ['$scope', '$state', '$window', 'controlPanelResolve', 'Authentication', 'Notification'];

  function ControlPanelsEditController($scope, $state, $window, controlPanel, Authentication, Notification) {
    var vm = this;

    vm.controlPanel = controlPanel;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // vm.controlPanel.temp.data = vm.temp;

    // Remove existing ControlPanel
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.controlPanel.$remove(function () {
          $state.go('controlPanels.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> ControlPanel deleted successfully!' });
        });
      }
    }

    // Save ControlPanel
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.controlPanelForm');
        return false;
      }

      // Create a new controlPanel, or update the current instance
      vm.controlPanel.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('controlPanels.list'); // should we send the User to the list or the updated ControlPanel's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> ControlPanel saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ControlPanel save error!' });
      }
    }
  }
}());
