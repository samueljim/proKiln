(function () {
  'use strict';

  angular
    .module('schedules.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('schedules', {
        abstract: true,
        url: '/schedules',
        template: '<ui-view/>'
      })
      .state('schedules.list', {
        url: '',
        templateUrl: '/modules/schedules/client/views/list-schedules.client.view.html',
        controller: 'SchedulesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Schedules List'
        }
      })
      .state('schedules.view', {
        url: '/:scheduleId',
        templateUrl: '/modules/schedules/client/views/view-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },
        data: {
          pageTitle: 'Schedule {{ scheduleResolve.title }}'
        }
      });
  }

  getSchedule.$inject = ['$stateParams', 'SchedulesService'];

  function getSchedule($stateParams, SchedulesService) {
    return SchedulesService.get({
      scheduleId: $stateParams.scheduleId
    }).$promise;
  }
}());
