(function () {
  'use strict';

  angular
    .module('kilns.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('kilns', {
        abstract: true,
        url: '/kilns',
        template: '<ui-view/>'
      })
      .state('kilns.list', {
        url: '',
        templateUrl: '/modules/kilns/client/views/list-kilns.client.view.html',
        controller: 'KilnsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Kilns List'
        }
      })
      .state('kilns.view', {
        url: '/:kilnId',
        templateUrl: '/modules/kilns/client/views/view-kiln.client.view.html',
        controller: 'KilnsController',
        controllerAs: 'vm',
        resolve: {
          kilnResolve: getKiln
        },
        data: {
          pageTitle: 'Kiln {{ kilnResolve.title }}'
        }
      });
  }

  getKiln.$inject = ['$stateParams', 'KilnsService'];

  function getKiln($stateParams, KilnsService) {
    return KilnsService.get({
      kilnId: $stateParams.kilnId
    }).$promise;
  }
}());
