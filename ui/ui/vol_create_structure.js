app.controller('VolCreateStructureController', function($scope, $http) {
  $scope.submit = function(structure) {
    $http.post('/api/structures/', angular.copy(structure))
  }
});
