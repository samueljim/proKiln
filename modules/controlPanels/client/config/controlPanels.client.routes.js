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
          pageTitle: 'ControlPanels List'
        }
      })
      .state('controlPanels.view', {
        url: '/:controlPanelId',
        templateUrl: '/modules/controlPanels/client/views/view-controlPanel.client.view.html',
        controller: 'ControlPanelsController',
        controllerAs: 'vm',
        resolve: {
          controlPanelResolve: getControlPanel
        },
        data: {
          pageTitle: 'ControlPanel {{ controlPanelResolve.title }}'
        }
      });
  }

  getControlPanel.$inject = ['$stateParams', 'ControlPanelsService'];

  function getControlPanel($stateParams, ControlPanelsService) {
    return ControlPanelsService.get({
      controlPanelId: $stateParams.controlPanelId
    }).$promise;
  }
}());
