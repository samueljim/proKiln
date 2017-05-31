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
          mainstate = $state.get('userss');
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
          liststate = $state.get('userss.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/userss/client/views/list-userss.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserssController,
          mockUsers;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userss.view');
          $templateCache.put('/modules/userss/client/views/view-users.client.view.html', '');

          // create mock users
          mockUsers = new UserssService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Users about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          UserssController = $controller('UserssController as vm', {
            $scope: $scope,
            usersResolve: mockUsers
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:usersId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.usersResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            usersId: 1
          })).toEqual('/userss/1');
        }));

        it('should attach an users to the controller scope', function () {
          expect($scope.vm.users._id).toBe(mockUsers._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/userss/client/views/view-users.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/userss/client/views/list-userss.client.view.html', '');

          $state.go('userss.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('userss/');
          $rootScope.$digest();

          expect($location.path()).toBe('/userss');
          expect($state.current.templateUrl).toBe('/modules/userss/client/views/list-userss.client.view.html');
        }));
      });
    });
  });
}());
