(function () {
  'use strict';

  angular
    .module('kilns')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Kilns',
      state: 'kilns',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'kilns', {
      title: 'List Kilns',
      state: 'kilns.list',
      roles: ['user']
    });
  }
}());
