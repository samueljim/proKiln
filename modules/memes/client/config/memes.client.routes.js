(function () {
  'use strict';

  angular
    .module('memes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('memes', {
        abstract: true,
        url: '/memes',
        template: '<ui-view/>'
      })
      .state('memes.list', {
        url: '',
        templateUrl: '/modules/memes/client/views/list-memes.client.view.html',
        controller: 'MemesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Memes List'
        }
      })
      .state('memes.view', {
        url: '/:memeId',
        templateUrl: '/modules/memes/client/views/view-meme.client.view.html',
        controller: 'MemesController',
        controllerAs: 'vm',
        resolve: {
          memeResolve: getMeme
        },
        data: {
          pageTitle: 'Meme {{ memeResolve.title }}'
        }
      });
  }

  getMeme.$inject = ['$stateParams', 'MemesService'];

  function getMeme($stateParams, MemesService) {
    return MemesService.get({
      memeId: $stateParams.memeId
    }).$promise;
  }
}());
