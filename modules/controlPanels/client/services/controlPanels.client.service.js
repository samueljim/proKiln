(function () {
  'use strict';

  angular
    .module('controlPanels.services')
    .factory('ControlPanelsService', ControlPanelsService);

  ControlPanelsService.$inject = ['$resource', '$log'];

  function ControlPanelsService($resource, $log) {
    var ControlPanel = $resource('/api/controlPanels/:controlPanelId', {
      controlPanelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(ControlPanel.prototype, {
      createOrUpdate: function () {
        var controlPanel = this;
        return createOrUpdate(controlPanel);
      }
    });

    return ControlPanel;

    function createOrUpdate(controlPanel) {
      if (controlPanel._id) {
        return controlPanel.$update(onSuccess, onError);
      } else {
        return controlPanel.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(controlPanel) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    
    // function changeRun(controlPanel) {
    //   if (controlPanel._id) {
    //     return controlPanel.$update(onSuccess, onError);
    //   } else {
    //     return controlPanel.$save(onSuccess, onError);
    //   }

    //   // Handle successful response
    //   function onSuccess(controlPanel) {
    //     // Any required internal processing from inside the service, goes here.
    //   }

    //   // Handle error response
    //   function onError(errorResponse) {
    //     var error = errorResponse.data;
    //     // Handle error internally
    //     handleError(error);
    //   }
    // }


    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
