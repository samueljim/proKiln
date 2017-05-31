(function () {
  'use strict';

  // Configuring the Settingss Admin module
  angular
    .module('settingss.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'settingss', {
      title: 'Manage Settingss',
      state: 'admin.settingss.list'
    });
  }
}());
