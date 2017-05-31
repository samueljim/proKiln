(function () {
  'use strict';

  describe('Userss Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserssService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserssService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserssService = _UserssService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.userss');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userss');
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
          liststate = $state.get('admin.userss.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/userss/client/views/admin/list-userss.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserssAdminController,
          mockUsers;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.userss.create');
          $templateCache.put('/modules/userss/client/views/admin/form-users.client.view.html', '');

          // Create mock users
          mockUsers = new UserssService();

          // Initialize Controller
          UserssAdminController = $controller('UserssAdminController as vm', {
            $scope: $scope,
            usersResolve: mockUsers
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.usersResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/userss/create');
        }));

        it('should attach an users to the controller scope', function () {
          expect($scope.vm.users._id).toBe(mockUsers._id);
          expect($scope.vm.users._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/userss/client/views/admin/form-users.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserssAdminController,
          mockUsers;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.userss.edit');
          $templateCache.put('/modules/userss/client/views/admin/form-users.client.view.html', '');

          // Create mock users
          mockUsers = new UserssService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Users about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          UserssAdminController = $controller('UserssAdminController as vm', {
            $scope: $scope,
            usersResolve: mockUsers
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:usersId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.usersResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            usersId: 1
          })).toEqual('/admin/userss/1/edit');
        }));

        it('should attach an users to the controller scope', function () {
          expect($scope.vm.users._id).toBe(mockUsers._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/userss/client/views/admin/form-users.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
