(function () {
  'use strict';

  angular
    .module('userss.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userss', {
        abstract: true,
        url: '/userss',
        template: '<ui-view/>'
      })
      .state('userss.list', {
        url: '',
        templateUrl: '/modules/userss/client/views/list-userss.client.view.html',
        controller: 'UserssListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Userss List'
        }
      })
      .state('userss.view', {
        url: '/:usersId',
        templateUrl: '/modules/userss/client/views/view-users.client.view.html',
        controller: 'UserssController',
        controllerAs: 'vm',
        resolve: {
          usersResolve: getUsers
        },
        data: {
          pageTitle: 'Users {{ usersResolve.title }}'
        }
      });
  }

  getUsers.$inject = ['$stateParams', 'UserssService'];

  function getUsers($stateParams, UserssService) {
    return UserssService.get({
      usersId: $stateParams.usersId
    }).$promise;
  }
}());
