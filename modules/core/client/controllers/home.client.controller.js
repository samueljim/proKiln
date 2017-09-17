(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope'];

  function HomeController($scope) {
    var vm = this;
    vm.myInterval = 3000;
    vm.noWrapSlides = false;
    vm.activeSlide = 0;
    vm.slides = [
      {
        image: 'http://lorempixel.com/400/200/'
      },
      {
        image: 'http://lorempixel.com/400/200/food'
      },
      {
        image: 'http://lorempixel.com/400/200/technics'
      },
      {
        image: 'http://lorempixel.com/400/200/people'
      }
    ];
  }
}());
