(function () {
  'use strict';

  angular
    .module('userss.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.userss', {
        abstract: true,
        url: '/userss',
        template: '<ui-view/>'
      })
      .state('admin.userss.list', {
        url: '',
        templateUrl: '/modules/userss/client/views/admin/list-userss.client.view.html',
        controller: 'UserssAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.userss.create', {
        url: '/create',
        templateUrl: '/modules/userss/client/views/admin/form-users.client.view.html',
        controller: 'UserssAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          usersResolve: newUsers
        }
      })
      .state('admin.userss.edit', {
        url: '/:usersId/edit',
        templateUrl: '/modules/userss/client/views/admin/form-users.client.view.html',
        controller: 'UserssAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          usersResolve: getUsers
        }
      });
  }

  getUsers.$inject = ['$stateParams', 'UserssService'];

  function getUsers($stateParams, UserssService) {
    return UserssService.get({
      usersId: $stateParams.usersId
    }).$promise;
  }

  newUsers.$inject = ['UserssService'];

  function newUsers(UserssService) {
    return new UserssService();
  }
}());
