app.controller('VolMainController', function($rootScope, $scope, $http) {
  $http.get('/api/structures/?user=' + $rootScope.user.id).success(function(data) {
    $scope.structures = data
  });
});
