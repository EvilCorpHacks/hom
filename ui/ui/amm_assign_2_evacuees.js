app.controller('AmmAssign2EvacueesController', function($rootScope, $state, $scope, $http) {
   $scope.assignEvacuee = function(ev) {
    $http.post('/api/assign', {'evacuee_id': ev.id, 'structure_id': $rootScope.structure.id})
      .success(function() {
         console.log('success');
         $state.go('amm_assign_1_structure');
      }).error(function() {
         console.log('failed');
         $state.go('amm_assign_1_structure');
      });
  };

  $http.get('/api/evacuees').success(function(data) {
    var evs;
    $scope.evacuees = evs = data;
    evs.forEach(function(ev) {
      ev.group_size = ev.group.length + 1;
    });
  });
});
