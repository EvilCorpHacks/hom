app.controller('VolCreateStructureController', function($scope, $http, $state) {
  $scope.structure = {};
  $scope.submit = function() {
    console.log($scope.structure);
    var req = {
         method : 'POST',
         url : '/api/structures/',
         data: $scope.structure
        };
        $http(req).then(function(response) {
           $state.go('vol_main');
        }, function(response) {
            console.log(response);
       });
  };
});
