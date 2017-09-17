(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
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
        pageTitle: 'A new way to fire'
      }
    });

    menuService.addMenuItem('topbar', {
      title: 'Buy',
      state: 'buy',
      data: {
        pageTitle: 'Change the way you think about kilns'
      }
    });
  }
}());
