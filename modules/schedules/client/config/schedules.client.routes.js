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
          pageTitle: 'Schedules'
        }
      })
      .state('schedules.create', {
        url: '/create',
        templateUrl: '/modules/schedules/client/views/form-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          scheduleResolve: newSchedule
        }
      })
      .state('schedules.edit', {
        url: '/:scheduleId/edit',
        templateUrl: '/modules/schedules/client/views/form-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          scheduleResolve: getSchedule
        }
      })
      .state('schedules.program', {
        url: '/:scheduleId/program',
        templateUrl: '/modules/schedules/client/views/program-schedule.client.view.html',
        controller: 'SchedulesProgramController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        },
        resolve: {
          scheduleResolve: getSchedule
        }
      });
  }

  getSchedule.$inject = ['$stateParams', 'SchedulesService'];

  function getSchedule($stateParams, SchedulesService) {
    return SchedulesService.get({
      scheduleId: $stateParams.scheduleId
    }).$promise;
  }
  newSchedule.$inject = ['SchedulesService'];

  function newSchedule(SchedulesService) {
    return new SchedulesService();
  }
}());
