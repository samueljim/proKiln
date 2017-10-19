(function () {
  'use strict';

  angular
    .module('controlPanels.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('controlPanels', {
        abstract: true,
        url: '/controlPanels',
        template: '<ui-view/>'
      })
      .state('controlPanels.list', {
        url: '',
        templateUrl: '/modules/controlPanels/client/views/list-controlPanels.client.view.html',
        controller: 'ControlPanelsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'ControlPanels List',
          roles: ['user']
        }
      })
      .state('controlPanels.view', {
        url: '/:controlPanelId/:run',
        templateUrl: '/modules/controlPanels/client/views/view-controlPanel.client.view.html',
        controller: 'ControlPanelsController',
        controllerAs: 'vm',
        resolve: {
          controlPanelResolve: getControlPanel
        },
        data: {
          pageTitle: '{{ controlPanelResolve.title }} ControlPanel',
          roles: ['user']
        }
      })
      .state('controlPanels.edit', {
        url: '/:controlPanelId/:run/edit',
        templateUrl: '/modules/controlPanels/client/views/edit-controlPanel.client.view.html',
        controller: 'ControlPanelsEditController',
        controllerAs: 'vm',
        resolve: {
          controlPanelResolve: getControlPanel
        },
        data: {
          pageTitle: 'Edit {{ controlPanelResolve.title }} ControlPanel',
          roles: ['user']
        }
      });
  }

  getControlPanel.$inject = ['$stateParams', 'ControlPanelsService'];

  function getControlPanel($stateParams, ControlPanelsService) {
    return ControlPanelsService.get({
      controlPanelId: $stateParams.controlPanelId,
      run: $stateParams.run
    }).$promise;
  }
}());
