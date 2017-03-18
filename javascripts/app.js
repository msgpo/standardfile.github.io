(function() {
  'use strict';
  angular
    .module('app', [])
    .controller('AppCtrl', AppCtrl)
    .config( function ($locationProvider, $provide){
      $locationProvider.html5Mode(true);
    });

  function AppCtrl($scope, $timeout) {
    $timeout(function(){
      gumshoe.init();
    }, 100)
  }

})();
