(function () {
  'use strict';

  angular
    .module('schedules.services')
    .factory('SchedulesService', SchedulesService);

  SchedulesService.$inject = ['$resource', '$log'];

  function SchedulesService($resource, $log) {
    var Schedule = $resource('/api/schedules/:scheduleId', {
      scheduleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Schedule.prototype, {
      createOrUpdate: function () {
        var schedule = this;
        return createOrUpdate(schedule);
      }
    });

    return Schedule;

    function createOrUpdate(schedule) {
      if (schedule._id) {
        return schedule.$update(onSuccess, onError);
      } else {
        return schedule.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(schedule) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
