(function () {
  'use strict';

  angular
    .module('settingss.services')
    .factory('SettingssService', SettingssService);

  SettingssService.$inject = ['$resource', '$log'];

  function SettingssService($resource, $log) {
    var Settings = $resource('/api/settingss/:settingsId', {
      settingsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Settings.prototype, {
      createOrUpdate: function () {
        var settings = this;
        return createOrUpdate(settings);
      }
    });

    return Settings;

    function createOrUpdate(settings) {
      if (settings._id) {
        return settings.$update(onSuccess, onError);
      } else {
        return settings.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(settings) {
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
