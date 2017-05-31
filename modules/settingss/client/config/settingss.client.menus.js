(function () {
  'use strict';

  angular
    .module('settingss')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Settingss',
      state: 'settingss',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'settingss', {
      title: 'List Settingss',
      state: 'settingss.list',
      roles: ['*']
    });
  }
}());
