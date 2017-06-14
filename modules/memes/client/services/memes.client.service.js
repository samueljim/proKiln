(function () {
  'use strict';

  angular
    .module('memes.services')
    .factory('MemesService', MemesService);

  MemesService.$inject = ['$resource', '$log'];

  function MemesService($resource, $log) {
    var Meme = $resource('/api/memes/:memeId', {
      memeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Meme.prototype, {
      createOrUpdate: function () {
        var meme = this;
        return createOrUpdate(meme);
      }
    });

    return Meme;

    function createOrUpdate(meme) {
      if (meme._id) {
        return meme.$update(onSuccess, onError);
      } else {
        return meme.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(meme) {
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
