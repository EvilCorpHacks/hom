

app.controller('AmmMainController', [ '$scope', '$http',
	function($scope, $http) {

		$scope.structuresData = [];
		$scope.evacueesData = [];

		$scope.evacuessDict = {};

		var processEvacuees = function (evacuees) {
			$scope.evacuessDict = {};
			for (var i = 0; i < evacuees.length; i++) {
			    evacuee = evacuees[i];
			    var cat = evacuee.category;
			    if ($scope.evacuessDict.hasOwnProperty(cat)) {
			    	$scope.evacuessDict[cat] = $scope.evacuessDict[cat] + 1;
			    } else {
			    	$scope.evacuessDict[cat] = 0;
			    }
			}
		}
		
		$scope.getStructures = function () {
			var req = {
				method : 'GET',
				url : "/api/structures"
			};
			$http(req).then(function(response) {
				console.log(response);
				$scope.structuresData = response.data;
			}, function(response) {
				console.error(response.data);
			});
		}

		$scope.getEvacuees = function () {
			var req = {
				method : 'GET',
				url : "/api/evacuees"
			};
			$http(req).then(function(response) {
				console.log(response);
				$scope.evacueesData = response.data;
			}, function(response) {
				console.error(response.data);
			});
		}

		$scope.getEvacuees();

		
	} ]);

