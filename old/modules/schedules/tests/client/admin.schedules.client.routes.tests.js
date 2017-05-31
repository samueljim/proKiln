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
          mainstate = $state.get('admin.schedules');
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
          liststate = $state.get('admin.schedules.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/schedules/client/views/admin/list-schedules.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SchedulesAdminController,
          mockSchedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.schedules.create');
          $templateCache.put('/modules/schedules/client/views/admin/form-schedule.client.view.html', '');

          // Create mock schedule
          mockSchedule = new SchedulesService();

          // Initialize Controller
          SchedulesAdminController = $controller('SchedulesAdminController as vm', {
            $scope: $scope,
            scheduleResolve: mockSchedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.scheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/schedules/create');
        }));

        it('should attach an schedule to the controller scope', function () {
          expect($scope.vm.schedule._id).toBe(mockSchedule._id);
          expect($scope.vm.schedule._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/schedules/client/views/admin/form-schedule.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SchedulesAdminController,
          mockSchedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.schedules.edit');
          $templateCache.put('/modules/schedules/client/views/admin/form-schedule.client.view.html', '');

          // Create mock schedule
          mockSchedule = new SchedulesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Schedule about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          SchedulesAdminController = $controller('SchedulesAdminController as vm', {
            $scope: $scope,
            scheduleResolve: mockSchedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:scheduleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.scheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            scheduleId: 1
          })).toEqual('/admin/schedules/1/edit');
        }));

        it('should attach an schedule to the controller scope', function () {
          expect($scope.vm.schedule._id).toBe(mockSchedule._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/schedules/client/views/admin/form-schedule.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
