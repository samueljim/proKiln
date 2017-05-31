(function () {
  'use strict';

  angular
    .module('userss')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Userss',
      state: 'userss',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userss', {
      title: 'List Userss',
      state: 'userss.list',
      roles: ['*']
    });
  }
}());
