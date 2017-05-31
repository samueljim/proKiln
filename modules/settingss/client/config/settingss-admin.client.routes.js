(function () {
  'use strict';

  angular
    .module('settingss.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.settingss', {
        abstract: true,
        url: '/settingss',
        template: '<ui-view/>'
      })
      .state('admin.settingss.list', {
        url: '',
        templateUrl: '/modules/settingss/client/views/admin/list-settingss.client.view.html',
        controller: 'SettingssAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.settingss.create', {
        url: '/create',
        templateUrl: '/modules/settingss/client/views/admin/form-settings.client.view.html',
        controller: 'SettingssAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          settingsResolve: newSettings
        }
      })
      .state('admin.settingss.edit', {
        url: '/:settingsId/edit',
        templateUrl: '/modules/settingss/client/views/admin/form-settings.client.view.html',
        controller: 'SettingssAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          settingsResolve: getSettings
        }
      });
  }

  getSettings.$inject = ['$stateParams', 'SettingssService'];

  function getSettings($stateParams, SettingssService) {
    return SettingssService.get({
      settingsId: $stateParams.settingsId
    }).$promise;
  }

  newSettings.$inject = ['SettingssService'];

  function newSettings(SettingssService) {
    return new SettingssService();
  }
}());
