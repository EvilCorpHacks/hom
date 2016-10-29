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

  $stateProvider
    .state('main', {
      url: '',
      template: `
        <p>aaaa</p>
        <div id="map"></div>
      `,
      controller($http, $rootScope, $scope) {
        // points
        let point = [43.34, 12.89];

        // create the map (map container must be loaded in dom)
        var map = L.map('map').setView(point, 9);

        // just a marker
        var marker = L.marker(point).addTo(map);
        let popupContent = `
          <a href="http://google.com/">
            Hello man!
          </a>`;
        marker.bindPopup(popupContent).openPopup();

        var circle = L.circle(point, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.3,
          radius: 20000
        }).addTo(map);

        // return index of a marker in markers that match coordinates
        var getMarkerFromCoords = function(coords, markers) {
            return _.findIndex(markers, function(x) {
                return _.isEqual(x, coords);
            });

        }

        // add open street map layer to map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">' +
                         'OpenStreetMap</a> contributors'
        }).addTo(map);

        // get the supplier data and add to the map
        $http.get('/api/geo/supplier/').success(function(data) {
            suppliers = data._items;
            markers = [];

            suppliers.forEach(function(s) {
                c = s.coords.reverse();

                // this will move the point of a 
                // random offset if there is duplicate
                while(getMarkerFromCoords(c, markers) >= 0) {
                    r = Math.random;
                    c[0] += (r() - r()) / 1000.0;
                    c[1] += (r() - r()) / 1000.0;
                }

                // push into the markers array
                markers.push(c);

                // add to map
                L.marker(c).addTo(map)
                    .bindPopup("<b>" + s.name + "</b><br>" + s.address + "<br>" +
                               (s.webSite? '<a href="' + s.webSite + '">' +
                                s.webSite + '</a>': ''));
            });
        });

      } // end controller
    });
})


.run(function($rootScope, $auth, $state) {

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
