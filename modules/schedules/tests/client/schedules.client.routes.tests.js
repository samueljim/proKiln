(function () {
  'use strict';

  describe('Schedules Route Tests', function () {
    // Initialize global variables
    var $scope,
      SchedulesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SchedulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SchedulesService = _SchedulesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('schedules');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/schedules');
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
          liststate = $state.get('schedules.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/schedules/client/views/list-schedules.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SchedulesController,
          mockSchedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('schedules.view');
          $templateCache.put('/modules/schedules/client/views/view-schedule.client.view.html', '');

          // create mock schedule
          mockSchedule = new SchedulesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Schedule about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          SchedulesController = $controller('SchedulesController as vm', {
            $scope: $scope,
            scheduleResolve: mockSchedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:scheduleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.scheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            scheduleId: 1
          })).toEqual('/schedules/1');
        }));

        it('should attach an schedule to the controller scope', function () {
          expect($scope.vm.schedule._id).toBe(mockSchedule._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/schedules/client/views/view-schedule.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/schedules/client/views/list-schedules.client.view.html', '');

          $state.go('schedules.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('schedules/');
          $rootScope.$digest();

          expect($location.path()).toBe('/schedules');
          expect($state.current.templateUrl).toBe('/modules/schedules/client/views/list-schedules.client.view.html');
        }));
      });
    });
  });
}());
