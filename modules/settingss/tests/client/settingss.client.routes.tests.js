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
          mainstate = $state.get('settingss');
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
          liststate = $state.get('settingss.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/settingss/client/views/list-settingss.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SettingssController,
          mockSettings;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('settingss.view');
          $templateCache.put('/modules/settingss/client/views/view-settings.client.view.html', '');

          // create mock settings
          mockSettings = new SettingssService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Settings about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          SettingssController = $controller('SettingssController as vm', {
            $scope: $scope,
            settingsResolve: mockSettings
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:settingsId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.settingsResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            settingsId: 1
          })).toEqual('/settingss/1');
        }));

        it('should attach an settings to the controller scope', function () {
          expect($scope.vm.settings._id).toBe(mockSettings._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/settingss/client/views/view-settings.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/settingss/client/views/list-settingss.client.view.html', '');

          $state.go('settingss.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('settingss/');
          $rootScope.$digest();

          expect($location.path()).toBe('/settingss');
          expect($state.current.templateUrl).toBe('/modules/settingss/client/views/list-settingss.client.view.html');
        }));
      });
    });
  });
}());
