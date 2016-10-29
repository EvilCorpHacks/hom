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
  $compileProvider.debugInfoEnabled(false);

  // Load Materialize components
  $('.modal-trigger').leanModal();
  //$('a.brand-logo').tabs()
  $('ul.tabs').tabs();

  // REST APIs + Auth
  RestangularProvider.setBaseUrl('/api');
  RestangularProvider.setRequestSuffix('/');
  $authProvider.loginUrl = '/api-token-auth/';

  // URLs
  $urlRouterProvider
    .otherwise('admin');

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

    .state('main', {
      url: '/',
      template: '',
    });
});


app.run(function($rootScope, $auth, $state) {

  $rootScope.$state = $state;

  $rootScope.login = function() {
    $auth.login({
      username: $rootScope.username,
      password: $rootScope.password
    });

    if ($rootScope.isAuth()) {
      return $state.go('admin');
    } else {
      return $rootScope.msg = 'Error';
    }
  };

  $rootScope.logout = function() {
    $auth.logout();
    //if not $auth.isAuthenticated()
    if (!$rootScope.isAuth()) {
      return $state.go('admin');
    }
  };

  $rootScope.isAuth = function() {
    //$auth.isAuthenticated()
    if ($auth.getToken()) {
      return true;
    }
  };

  $rootScope.goHome = function() {
    $('ul.tabs').tabs('select_tab', 'tab4');
    return $state.go('admin');
  };

  // return $state.go('admin');
});
