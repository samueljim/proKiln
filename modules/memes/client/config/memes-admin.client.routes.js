(function () {
  'use strict';

  angular
    .module('memes.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.memes', {
        abstract: true,
        url: '/memes',
        template: '<ui-view/>'
      })
      .state('admin.memes.list', {
        url: '',
        templateUrl: '/modules/memes/client/views/admin/list-memes.client.view.html',
        controller: 'MemesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.memes.create', {
        url: '/create',
        templateUrl: '/modules/memes/client/views/admin/form-meme.client.view.html',
        controller: 'MemesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          memeResolve: newMeme
        }
      })
      .state('admin.memes.edit', {
        url: '/:memeId/edit',
        templateUrl: '/modules/memes/client/views/admin/form-meme.client.view.html',
        controller: 'MemesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          memeResolve: getMeme
        }
      });
  }

  getMeme.$inject = ['$stateParams', 'MemesService'];

  function getMeme($stateParams, MemesService) {
    return MemesService.get({
      memeId: $stateParams.memeId
    }).$promise;
  }

  newMeme.$inject = ['MemesService'];

  function newMeme(MemesService) {
    return new MemesService();
  }
}());
