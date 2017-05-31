(function () {
  'use strict';

  angular
    .module('settingss')
    .controller('SettingssListController', SettingssListController);

  SettingssListController.$inject = ['SettingssService'];

  function SettingssListController(SettingssService) {
    var vm = this;

    vm.settingss = SettingssService.query();
  }
}());
