(function () {
  'use strict';

  describe('Settingss Route Tests', function () {
    // Initialize global variables
    var $scope,
      SettingssService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SettingssService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SettingssService = _SettingssService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.settingss');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/settingss');
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
          liststate = $state.get('admin.settingss.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/settingss/client/views/admin/list-settingss.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SettingssAdminController,
          mockSettings;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.settingss.create');
          $templateCache.put('/modules/settingss/client/views/admin/form-settings.client.view.html', '');

          // Create mock settings
          mockSettings = new SettingssService();

          // Initialize Controller
          SettingssAdminController = $controller('SettingssAdminController as vm', {
            $scope: $scope,
            settingsResolve: mockSettings
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.settingsResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/settingss/create');
        }));

        it('should attach an settings to the controller scope', function () {
          expect($scope.vm.settings._id).toBe(mockSettings._id);
          expect($scope.vm.settings._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/settingss/client/views/admin/form-settings.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SettingssAdminController,
          mockSettings;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.settingss.edit');
          $templateCache.put('/modules/settingss/client/views/admin/form-settings.client.view.html', '');

          // Create mock settings
          mockSettings = new SettingssService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Settings about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          SettingssAdminController = $controller('SettingssAdminController as vm', {
            $scope: $scope,
            settingsResolve: mockSettings
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:settingsId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.settingsResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            settingsId: 1
          })).toEqual('/admin/settingss/1/edit');
        }));

        it('should attach an settings to the controller scope', function () {
          expect($scope.vm.settings._id).toBe(mockSettings._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/settingss/client/views/admin/form-settings.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
