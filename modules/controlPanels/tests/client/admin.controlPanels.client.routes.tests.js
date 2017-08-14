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
          mainstate = $state.get('admin.controlPanels');
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
          liststate = $state.get('admin.controlPanels.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/controlPanels/client/views/admin/list-controlPanels.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ControlPanelsAdminController,
          mockControlPanel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.controlPanels.create');
          $templateCache.put('/modules/controlPanels/client/views/admin/form-controlPanel.client.view.html', '');

          // Create mock controlPanel
          mockControlPanel = new ControlPanelsService();

          // Initialize Controller
          ControlPanelsAdminController = $controller('ControlPanelsAdminController as vm', {
            $scope: $scope,
            controlPanelResolve: mockControlPanel
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.controlPanelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/controlPanels/create');
        }));

        it('should attach an controlPanel to the controller scope', function () {
          expect($scope.vm.controlPanel._id).toBe(mockControlPanel._id);
          expect($scope.vm.controlPanel._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/controlPanels/client/views/admin/form-controlPanel.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ControlPanelsAdminController,
          mockControlPanel;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.controlPanels.edit');
          $templateCache.put('/modules/controlPanels/client/views/admin/form-controlPanel.client.view.html', '');

          // Create mock controlPanel
          mockControlPanel = new ControlPanelsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An ControlPanel about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ControlPanelsAdminController = $controller('ControlPanelsAdminController as vm', {
            $scope: $scope,
            controlPanelResolve: mockControlPanel
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:controlPanelId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.controlPanelResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            controlPanelId: 1
          })).toEqual('/admin/controlPanels/1/edit');
        }));

        it('should attach an controlPanel to the controller scope', function () {
          expect($scope.vm.controlPanel._id).toBe(mockControlPanel._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/controlPanels/client/views/admin/form-controlPanel.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
