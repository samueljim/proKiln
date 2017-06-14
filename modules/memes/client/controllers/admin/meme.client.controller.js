(function () {
  'use strict';

  angular
    .module('memes.admin')
    .controller('MemesAdminController', MemesAdminController);

  MemesAdminController.$inject = ['$scope', '$state', '$window', 'memeResolve', 'Authentication', 'Notification'];

  function MemesAdminController($scope, $state, $window, meme, Authentication, Notification) {
    var vm = this;

    vm.meme = meme;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Meme
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.meme.$remove(function() {
          $state.go('admin.memes.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Meme deleted successfully!' });
        });
      }
    }

    // Save Meme
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.memeForm');
        return false;
      }

      // Create a new meme, or update the current instance
      vm.meme.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.memes.list'); // should we send the User to the list or the updated Meme's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Meme saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Meme save error!' });
      }
    }
  }
}());
