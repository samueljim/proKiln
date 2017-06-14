(function () {
  'use strict';

  angular
    .module('controlPanels')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'ControlPanels',
      state: 'controlPanels.list',
      roles: ['user']
    });
    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'admin', {
    //   title: 'List ControlPanels',
    //   state: 'controlPanels.list',
    //   roles: ['admin']
    // });

  }
}());
