(function () {
  'use strict';

  angular
    .module('memes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Memes',
      state: 'memes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'memes', {
      title: 'List Memes',
      state: 'memes.list',
      roles: ['*']
    });
  }
}());
