(function () {
  'use strict';

  // Configuring the Kilns Admin module
  angular
    .module('kilns.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'kilns', {
      title: 'Manage Kilns',
      state: 'admin.kilns.list'
    });
  }
}());
