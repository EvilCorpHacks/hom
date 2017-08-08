app.controller('AmmAssign1StructureController', function($rootScope, $scope, $http, $state) {
  $http.get('/api/structures/').success(function(data) {
    $scope.structures = data;
  });
  $scope.assignStructure = function(structure) {
      $rootScope.structure = structure
      $state.go('amm_assign_2_evacuees')
  }
});
