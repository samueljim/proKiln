(function () {
  'use strict';

  angular
    .module('settingss.admin')
    .controller('SettingssAdminListController', SettingssAdminListController);

  SettingssAdminListController.$inject = ['SettingssService'];

  function SettingssAdminListController(SettingssService) {
    var vm = this;

    vm.settingss = SettingssService.query();
  }
}());
