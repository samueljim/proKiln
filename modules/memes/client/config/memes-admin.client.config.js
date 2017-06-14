(function () {
  'use strict';

  // Configuring the Memes Admin module
  angular
    .module('memes.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'memes', {
      title: 'Manage Memes',
      state: 'admin.memes.list'
    });
  }
}());
