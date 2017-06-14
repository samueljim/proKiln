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
          mainstate = $state.get('admin.memes');
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
          liststate = $state.get('admin.memes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/memes/client/views/admin/list-memes.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MemesAdminController,
          mockMeme;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.memes.create');
          $templateCache.put('/modules/memes/client/views/admin/form-meme.client.view.html', '');

          // Create mock meme
          mockMeme = new MemesService();

          // Initialize Controller
          MemesAdminController = $controller('MemesAdminController as vm', {
            $scope: $scope,
            memeResolve: mockMeme
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.memeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/memes/create');
        }));

        it('should attach an meme to the controller scope', function () {
          expect($scope.vm.meme._id).toBe(mockMeme._id);
          expect($scope.vm.meme._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/memes/client/views/admin/form-meme.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MemesAdminController,
          mockMeme;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.memes.edit');
          $templateCache.put('/modules/memes/client/views/admin/form-meme.client.view.html', '');

          // Create mock meme
          mockMeme = new MemesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Meme about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MemesAdminController = $controller('MemesAdminController as vm', {
            $scope: $scope,
            memeResolve: mockMeme
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:memeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.memeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            memeId: 1
          })).toEqual('/admin/memes/1/edit');
        }));

        it('should attach an meme to the controller scope', function () {
          expect($scope.vm.meme._id).toBe(mockMeme._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/memes/client/views/admin/form-meme.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
