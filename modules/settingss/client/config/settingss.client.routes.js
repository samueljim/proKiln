(function () {
  'use strict';

  angular
    .module('settingss.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('settingss', {
        abstract: true,
        url: '/settingss',
        template: '<ui-view/>'
      })
      .state('settingss.list', {
        url: '',
        templateUrl: '/modules/settingss/client/views/list-settingss.client.view.html',
        controller: 'SettingssListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settingss List'
        }
      })
      .state('settingss.view', {
        url: '/:settingsId',
        templateUrl: '/modules/settingss/client/views/view-settings.client.view.html',
        controller: 'SettingssController',
        controllerAs: 'vm',
        resolve: {
          settingsResolve: getSettings
        },
        data: {
          pageTitle: 'Settings {{ settingsResolve.title }}'
        }
      });
  }

  getSettings.$inject = ['$stateParams', 'SettingssService'];

  function getSettings($stateParams, SettingssService) {
    return SettingssService.get({
      settingsId: $stateParams.settingsId
    }).$promise;
  }
}());
