app.controller('EvaMainController', function($scope, $http) {
  $http.get('/api/evacuees/1').success(function(data) {
    $scope.evacuee = data
  });
});
