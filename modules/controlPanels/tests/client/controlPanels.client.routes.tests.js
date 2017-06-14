(function () {
  'use strict';

  describe('ControlPanels Route Tests', function () {
    // Initialize global variables
    var $scope,
      ControlPanelsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ControlPanelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ControlPanelsService = _ControlPanelsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('controlPanels');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/controlPanels');
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
          liststate = $state.get('controlPanels.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/controlPanels/client/views/list-controlPanels.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ControlPanelsController,
          mockControlPanel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('controlPanels.view');
          $templateCache.put('/modules/controlPanels/client/views/view-controlPanel.client.view.html', '');

          // create mock controlPanel
          mockControlPanel = new ControlPanelsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An ControlPanel about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ControlPanelsController = $controller('ControlPanelsController as vm', {
            $scope: $scope,
            controlPanelResolve: mockControlPanel
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:controlPanelId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.controlPanelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            controlPanelId: 1
          })).toEqual('/controlPanels/1');
        }));

        it('should attach an controlPanel to the controller scope', function () {
          expect($scope.vm.controlPanel._id).toBe(mockControlPanel._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/controlPanels/client/views/view-controlPanel.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/controlPanels/client/views/list-controlPanels.client.view.html', '');

          $state.go('controlPanels.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('controlPanels/');
          $rootScope.$digest();

          expect($location.path()).toBe('/controlPanels');
          expect($state.current.templateUrl).toBe('/modules/controlPanels/client/views/list-controlPanels.client.view.html');
        }));
      });
    });
  });
}());
