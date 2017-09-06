(function () {
  'use strict';

  angular
    .module('schedules')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Schedules',
      state: 'schedules.list',
      // type: 'dropdown',
      roles: ['user']
    });

    menuService.addMenuItem('topbar', {
      title: 'Documentation',
      state: 'docs',
      data: {
        pageTitle: 'Documentation'
      }
    });
    
    menuService.addMenuItem('topbar', {
      title: 'About',
      state: 'about',
      data: {
        pageTitle: 'About'
      }
    });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'schedules', {
    //   title: 'List Schedules',
    //   state: 'schedules.list',
    //   roles: ['user']
    // });
  }
}());
