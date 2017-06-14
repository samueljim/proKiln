(function () {
  'use strict';

  angular
    .module('controlPanels')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'ControlPanels',
      state: 'controlPanels',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'controlPanels', {
      title: 'List ControlPanels',
      state: 'controlPanels.list',
      roles: ['*']
    });
  }
}());
