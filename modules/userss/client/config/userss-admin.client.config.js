(function () {
  'use strict';

  // Configuring the Userss Admin module
  angular
    .module('userss.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'userss', {
      title: 'Manage Userss',
      state: 'admin.userss.list'
    });
  }
}());
