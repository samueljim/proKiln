(function () {
  'use strict';

  angular
    .module('controlPanels.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.controlPanels', {
        abstract: true,
        url: '/controlPanels',
        template: '<ui-view/>'
      })
      .state('admin.controlPanels.list', {
        url: '',
        templateUrl: '/modules/controlPanels/client/views/admin/list-controlPanels.client.view.html',
        controller: 'ControlPanelsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.controlPanels.create', {
        url: '/create',
        templateUrl: '/modules/controlPanels/client/views/admin/form-controlPanel.client.view.html',
        controller: 'ControlPanelsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          controlPanelResolve: newControlPanel
        }
      })
      .state('admin.controlPanels.edit', {
        url: '/:controlPanelId/edit',
        templateUrl: '/modules/controlPanels/client/views/admin/form-controlPanel.client.view.html',
        controller: 'ControlPanelsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          controlPanelResolve: getControlPanel
        }
      });
  }

  getControlPanel.$inject = ['$stateParams', 'ControlPanelsService'];

  function getControlPanel($stateParams, ControlPanelsService) {
    return ControlPanelsService.get({
      controlPanelId: $stateParams.controlPanelId
    }).$promise;
  }

  newControlPanel.$inject = ['ControlPanelsService'];

  function newControlPanel(ControlPanelsService) {
    return new ControlPanelsService();
  }
}());
