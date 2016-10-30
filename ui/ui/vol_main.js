app.controller('VolMainController', function($scope, $http) {
  $http.get('/api/structures/?user=1').success(function(data) {
    $scope.structures = data;
  });

  $scope.new_structure = function(){
    $
  }
});
