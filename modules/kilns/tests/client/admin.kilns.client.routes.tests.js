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
          mainstate = $state.get('admin.kilns');
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
          liststate = $state.get('admin.kilns.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/kilns/client/views/admin/list-kilns.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          KilnsAdminController,
          mockKiln;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.kilns.create');
          $templateCache.put('/modules/kilns/client/views/admin/form-kiln.client.view.html', '');

          // Create mock kiln
          mockKiln = new KilnsService();

          // Initialize Controller
          KilnsAdminController = $controller('KilnsAdminController as vm', {
            $scope: $scope,
            kilnResolve: mockKiln
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.kilnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/kilns/create');
        }));

        it('should attach an kiln to the controller scope', function () {
          expect($scope.vm.kiln._id).toBe(mockKiln._id);
          expect($scope.vm.kiln._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/kilns/client/views/admin/form-kiln.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          KilnsAdminController,
          mockKiln;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.kilns.edit');
          $templateCache.put('/modules/kilns/client/views/admin/form-kiln.client.view.html', '');

          // Create mock kiln
          mockKiln = new KilnsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Kiln about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          KilnsAdminController = $controller('KilnsAdminController as vm', {
            $scope: $scope,
            kilnResolve: mockKiln
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:kilnId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.kilnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            kilnId: 1
          })).toEqual('/admin/kilns/1/edit');
        }));

        it('should attach an kiln to the controller scope', function () {
          expect($scope.vm.kiln._id).toBe(mockKiln._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/kilns/client/views/admin/form-kiln.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
