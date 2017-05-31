(function () {
  'use strict';

  describe('Admin Schedules List Controller Tests', function () {
    // Initialize global variables
    var SchedulesAdminListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      SchedulesService,
      mockSchedule;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _SchedulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      SchedulesService = _SchedulesService_;

      // Ignore parent template get on state transitions
      $httpBackend.whenGET('/modules/schedules/client/views/list-schedules.client.view.html').respond(200, '');
      $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

      // create mock schedule
      mockSchedule = new SchedulesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Schedule about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user', 'admin']
      };

      // Initialize the Schedules List controller.
      SchedulesAdminListController = $controller('SchedulesAdminListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockScheduleList;

      beforeEach(function () {
        mockScheduleList = [mockSchedule, mockSchedule];
      });

      it('should send a GET request and return all schedules', inject(function (SchedulesService) {
        // Set POST response
        $httpBackend.expectGET('/api/schedules').respond(mockScheduleList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.schedules.length).toEqual(2);
        expect($scope.vm.schedules[0]).toEqual(mockSchedule);
        expect($scope.vm.schedules[1]).toEqual(mockSchedule);

      }));
    });
  });
}());
