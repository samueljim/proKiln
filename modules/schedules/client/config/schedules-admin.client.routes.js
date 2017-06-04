(function () {
  'use strict';

  angular
    .module('schedules.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.schedules', {
        abstract: true,
        url: '/schedules',
        template: '<ui-view/>'
      })
      .state('admin.schedules.list', {
        url: '',
        templateUrl: '/modules/schedules/client/views/admin/list-schedules.client.view.html',
        controller: 'SchedulesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.schedules.create', {
        url: '/create',
        templateUrl: '/modules/schedules/client/views/admin/form-schedule.client.view.html',
        controller: 'SchedulesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          scheduleResolve: newSchedule
        }
      })
      .state('admin.schedules.edit', {
        url: '/:scheduleId/edit',
        templateUrl: '/modules/schedules/client/views/admin/form-schedule.client.view.html',
        controller: 'SchedulesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
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
