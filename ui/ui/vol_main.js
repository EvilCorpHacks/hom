app.controller('VolMainController', function($scope, $http) {
  $http.get('/api/ui/data/google-places.json').success(function(data) {
    // TODO
  });
});
