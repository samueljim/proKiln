(function () {
  'use strict';

  angular
    .module('kilns.services')
    .factory('KilnsService', KilnsService);

  KilnsService.$inject = ['$resource', '$log'];

  function KilnsService($resource, $log) {
    var Kiln = $resource('/api/kilns/:kilnId', {
      kilnId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Kiln.prototype, {
      createOrUpdate: function () {
        var kiln = this;
        return createOrUpdate(kiln);
      }
    });

    return Kiln;

    function createOrUpdate(kiln) {
      if (kiln._id) {
        return kiln.$update(onSuccess, onError);
      } else {
        return kiln.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(kiln) {
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
