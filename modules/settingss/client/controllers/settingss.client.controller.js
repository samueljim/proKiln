(function () {
  'use strict';

  angular
    .module('settingss')
    .controller('SettingssController', SettingssController);

  SettingssController.$inject = ['$scope', 'settingsResolve', 'Authentication'];

  function SettingssController($scope, settings, Authentication) {
    var vm = this;

    vm.settings = settings;
    vm.authentication = Authentication;

  }
}());
