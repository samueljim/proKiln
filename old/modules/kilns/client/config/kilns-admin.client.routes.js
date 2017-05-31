(function () {
  'use strict';

  angular
    .module('kilns.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.kilns', {
        abstract: true,
        url: '/kilns',
        template: '<ui-view/>'
      })
      .state('admin.kilns.list', {
        url: '',
        templateUrl: '/modules/kilns/client/views/admin/list-kilns.client.view.html',
        controller: 'KilnsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.kilns.create', {
        url: '/create',
        templateUrl: '/modules/kilns/client/views/admin/form-kiln.client.view.html',
        controller: 'KilnsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          kilnResolve: newKiln
        }
      })
      .state('admin.kilns.edit', {
        url: '/:kilnId/edit',
        templateUrl: '/modules/kilns/client/views/admin/form-kiln.client.view.html',
        controller: 'KilnsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          kilnResolve: getKiln
        }
      });
  }

  getKiln.$inject = ['$stateParams', 'KilnsService'];

  function getKiln($stateParams, KilnsService) {
    return KilnsService.get({
      kilnId: $stateParams.kilnId
    }).$promise;
  }

  newKiln.$inject = ['KilnsService'];

  function newKiln(KilnsService) {
    return new KilnsService();
  }
}());
