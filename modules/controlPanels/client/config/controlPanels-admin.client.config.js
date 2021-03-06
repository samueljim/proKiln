﻿(function () {
  'use strict';

  // Configuring the ControlPanels Admin module
  angular
    .module('controlPanels.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage ControlPanels',
      state: 'admin.controlPanels.list'
    });
  }
}());
