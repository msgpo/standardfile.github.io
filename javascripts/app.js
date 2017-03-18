(function() {
  'use strict';
  angular
    .module('app', [])
    .controller('AppCtrl', AppCtrl)
    .config( function ($locationProvider, $provide){
      $locationProvider.html5Mode(true);
    });

  function AppCtrl($scope, $timeout) {
    var specVersion = window.location.href.indexOf("001") !== -1 ? "spec-001" : "spec";
    $scope.specPath = "doc/html/doc/" + specVersion + ".html";
    $timeout(function(){
      gumshoe.init();
    }, 100)
  }

})();
