(function () {
  'use strict';

  describe('Kilns Route Tests', function () {
    // Initialize global variables
    var $scope,
      KilnsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _KilnsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      KilnsService = _KilnsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('kilns');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/kilns');
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
          liststate = $state.get('kilns.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/kilns/client/views/list-kilns.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          KilnsController,
          mockKiln;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('kilns.view');
          $templateCache.put('/modules/kilns/client/views/view-kiln.client.view.html', '');

          // create mock kiln
          mockKiln = new KilnsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Kiln about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          KilnsController = $controller('KilnsController as vm', {
            $scope: $scope,
            kilnResolve: mockKiln
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:kilnId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.kilnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            kilnId: 1
          })).toEqual('/kilns/1');
        }));

        it('should attach an kiln to the controller scope', function () {
          expect($scope.vm.kiln._id).toBe(mockKiln._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/kilns/client/views/view-kiln.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/kilns/client/views/list-kilns.client.view.html', '');

          $state.go('kilns.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('kilns/');
          $rootScope.$digest();

          expect($location.path()).toBe('/kilns');
          expect($state.current.templateUrl).toBe('/modules/kilns/client/views/list-kilns.client.view.html');
        }));
      });
    });
  });
}());
