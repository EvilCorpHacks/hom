let app = angular.module('app', [
  'ui.router',
  'restangular',
  'satellizer',
  'angular-websocket',
  'angular-loading-bar'
])
.config(function(
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
    .otherwise('main');
})


.run(function($rootScope, $auth, $state, WSData) {

  $rootScope.WSData = WSData;

  $rootScope.login = function() {
    $auth.login({
      username: $rootScope.username,
      password: $rootScope.password
    });

    if ($rootScope.isAuth()) {
      return $state.go('addtest');
    } else {
      return $rootScope.msg = 'Error';
    }
  };

  $rootScope.logout = function() {
    $auth.logout();
    //if not $auth.isAuthenticated()
    if (!$rootScope.isAuth()) {
      return $state.go('main');
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
    return $state.go('main');
  };

  return $state.go('main');
});
