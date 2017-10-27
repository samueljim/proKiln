(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Socket'];

  function HomeController($scope, Socket) {
    var vm = this;
    vm.myInterval = 3000;
    vm.noWrapSlides = false;
    vm.activeSlide = 0;
    vm.demoAdd = demoAdd;

    function demoAdd() {
      var user = vm.authentication.user.username;
      var data = { title: 'Demo kiln ', username: user, content: user };
      Socket.emit('demokilnSetup', data);
      // console.log(vm.authentication.user.username);
    }

    // vm.slides = [
    //   {
    //     image: 'http://lorempixel.com/400/200/'
    //   },
    //   {
    //     image: 'http://lorempixel.com/400/200/food'
    //   },
    //   {
    //     image: 'http://lorempixel.com/400/200/technics'
    //   },
    //   {
    //     image: 'http://lorempixel.com/400/200/people'
    //   }
    // ];
  }
}());
