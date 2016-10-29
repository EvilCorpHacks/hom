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

    .state('main', {
      url: '/',
      template: `
        <p>aaaa</p>
        <div id="map"></div>
      `,
      controller($http, $rootScope, $scope) {
        // TODO
        let point = [43.296292, 13.574712];

        var myIcon = new L.Icon({
          iconUrl: '/ui/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        // create the map (map container must be loaded in dom)
        var map = L.map('map', {'minZoom': 9, 'maxZoom': 9}).setView(point, 9);

        function getRadius(magnitude) {
          if (magnitude >= 6.0) { return 160; }
          if (magnitude >= 5.0) { return 120; }
          if (magnitude >= 4.0) { return 80; }
          if (magnitude >= 3.0) { return 40; }
          return 40;
        }
        
        function getColor(magnitude) {
          if (magnitude >= 6.0) { return '#F00'; }
          if (magnitude >= 5.0) { return '#FF8000'; }
          if (magnitude >= 4.0) { return '#FF9933'; }
          if (magnitude >= 3.0) { return '#FFB266'; }
          return 'blue';
        }

        // return the center of the biggest earthquake
        function get() {
        }

        // add open street map layer to map
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">' +
                         'OpenStreetMap</a> contributors'
        }).addTo(map);

        $http.get('/ui/structures.json').success(function(data) {
          console.log(data);
          data.forEach(function(p) {
            let m = L.marker([p.address.latitude, p.address.longitude], {icon: myIcon}).addTo(map);
            let popupContent = `
              <a href="http://google.com/">
                ${p.name}
              </a>`;
            m.bindPopup(popupContent).openPopup();
          });
        });

        $http.get('/ui/google-places.json').success(function(data) {
          console.log(data);
          data.forEach(function(p) {
            L.marker(p).addTo(map);
          });
        });

        $http.get('/ui/earthquakes.json').success(function(data) {
          console.log(data);
          data.forEach(function(p) {
            L.circleMarker(p, {
              'radius': getRadius(p.magnitude),
              'color': getColor(p.magnitude),
              'opacity': 0.8,
              'fillOpacity': 0.1,
              'fillColor': ''
            }).addTo(map);
          });
        });

      } // end controller
    });
});


app.run(function($rootScope, $auth, $state) {

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

  return $state.go('admin');
});
