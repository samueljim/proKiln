(function () {
  'use strict';

  // Configuring the Schedules Admin module
  angular
    .module('schedules.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'schedules', {
      title: 'Manage Schedules',
      state: 'admin.schedules.list'
    });
  }
}());
