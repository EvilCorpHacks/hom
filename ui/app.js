let app = angular.module('app', [
  'ui.router',
  'restangular',
  'satellizer',
  'angular-websocket',
  'angular-loading-bar'
]);

app.config(function(
    $stateProvider, $urlRouterProvider,
    $compileProvider,
    RestangularProvider,
    $authProvider) {

  // Performance
  //$compileProvider.debugInfoEnabled(false);

  // REST APIs + Auth
  RestangularProvider.setBaseUrl('/api');
  RestangularProvider.setRequestSuffix('/');
  $authProvider.loginUrl = '/api-token-auth/';

  // URLs
  $urlRouterProvider
    .otherwise('landing');

  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: '/ui/admin.html',
      controller: 'AdminController'
    })

    .state('vol_main', {
      url: '/vol_main',
      templateUrl: '/ui/vol_main.html',
      controller: 'VolMainController'
    })

    .state('vol_create_structure', {
      url: '/vol_create_structure',
      templateUrl: '/ui/vol_create_structure.html',
      controller: 'VolCreateStructureController'
    })

    .state('all_view_map', {
      url: '/all_view_map',
      templateUrl: '/ui/all_view_map.html',
      controller: 'AllViewMapController'
    })

    .state('eva_main', {
      url: '/eva_main',
      templateUrl: '/ui/eva_main.html',
      controller: 'EvaMainController'
    })

    .state('eva_view_structure', {
      url: '/eva_view_structure',
      templateUrl: '/ui/eva_view_structure.html',
      controller: 'EvaViewStructureController'
    })

    .state('amm_main', {
      url: '/amm_main',
      templateUrl: '/ui/amm_main.html',
      controller: 'AmmMainController'
    })

    .state('amm_assign_1_structure', {
      url: '/amm_assign_1_structure',
      templateUrl: '/ui/amm_assign_1_structure.html',
      controller: 'AmmAssign1StructureController'
    })

    .state('amm_assign_2_evacuees', {
      url: '/amm_assign_2_evacuees',
      templateUrl: '/ui/amm_assign_2_evacuees.html',
      controller: 'AmmAssign2EvacueesController'
    })

    .state('landing', {
      url: '/landing',
      templateUrl: '/ui/landing.html',
      controller: 'LandingController'
    });
});


app.run(function($rootScope, $auth, $http, $state) {

  $('.parallax').parallax();
  $rootScope.$state = $state;
  $rootScope.auth = false;

  $rootScope.login = function() {
    let x = $auth.login({
      username: $('input[name=username]').val(),
      password: $('input[name=password]').val()
    });

    $http.get('/api/users?user=' + $('input[name=username]').val()).success(function (data) {
      console.log(data);
      $rootScope.user = data[0];
      $rootScope.group = data[0].groups[0].name;

      $rootScope.auth = true;
      if ($rootScope.user.groups[0].name == 'Amministrazione') {
        return $state.go('amm_main');
      } else if ($rootScope.user.groups[0].name == 'Sfollati') {
        return $state.go('eva_main');
      } else if ($rootScope.user.groups[0].name == 'Volontari') {
        return $state.go('vol_main');
      }
    });
  };

  $rootScope.logout = function() {
    $auth.logout();
    $rootScope.auth = false;
    $rootScope.user = null;
    $rootScope.group = null;
    $state.go('landing');
  };
});
