(function () {
  'use strict';

  describe('Memes Route Tests', function () {
    // Initialize global variables
    var $scope,
      MemesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MemesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MemesService = _MemesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('memes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/memes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('memes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/memes/client/views/list-memes.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MemesController,
          mockMeme;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('memes.view');
          $templateCache.put('/modules/memes/client/views/view-meme.client.view.html', '');

          // create mock meme
          mockMeme = new MemesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Meme about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MemesController = $controller('MemesController as vm', {
            $scope: $scope,
            memeResolve: mockMeme
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:memeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.memeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            memeId: 1
          })).toEqual('/memes/1');
        }));

        it('should attach an meme to the controller scope', function () {
          expect($scope.vm.meme._id).toBe(mockMeme._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/memes/client/views/view-meme.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/memes/client/views/list-memes.client.view.html', '');

          $state.go('memes.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('memes/');
          $rootScope.$digest();

          expect($location.path()).toBe('/memes');
          expect($state.current.templateUrl).toBe('/modules/memes/client/views/list-memes.client.view.html');
        }));
      });
    });
  });
}());
