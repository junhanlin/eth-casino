'use strict';
app.controller('HomeCtrl', ['$scope', 'web3Service', function ($scope, web3Service) {
 
  $scope.init = function () {
    console.log(web3Service.currentProvider);

  };
  $scope.init();


}]);