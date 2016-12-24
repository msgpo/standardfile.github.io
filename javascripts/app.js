(function() {
  'use strict';
  angular
    .module('app', [])
    .controller('AppCtrl', AppCtrl)
    .config( function ($locationProvider, $provide){
      // enable HTML5 Mode for SEO
      $locationProvider.html5Mode(true);
    });

  function AppCtrl($scope, $timeout) {
    $scope.apiData = apiData;
    $timeout(function(){
      gumshoe.init();
    }, 100)
  }

})();
