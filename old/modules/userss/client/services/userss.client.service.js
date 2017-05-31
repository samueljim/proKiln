(function () {
  'use strict';

  angular
    .module('userss.services')
    .factory('UserssService', UserssService);

  UserssService.$inject = ['$resource', '$log'];

  function UserssService($resource, $log) {
    var Users = $resource('/api/userss/:usersId', {
      usersId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Users.prototype, {
      createOrUpdate: function () {
        var users = this;
        return createOrUpdate(users);
      }
    });

    return Users;

    function createOrUpdate(users) {
      if (users._id) {
        return users.$update(onSuccess, onError);
      } else {
        return users.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(users) {
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
