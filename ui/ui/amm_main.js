

app.controller('AmmMainController', [ '$scope', '$http',
	function($scope, $http) {

		$scope.structuresData = [];
		$scope.evacueesData = [];

		$scope.evacuessDict = {};
		$scope.evacuessLabels = {};
		$scope.evacuessValues = {};

		var processEvacuees = function (evacuees) {
			$scope.evacuessDict = {};
			for (var i = 0; i < evacuees.length; i++) {
			    var evacuee = evacuees[i];
			    var cat = evacuee.category;
			    if ($scope.evacuessDict.hasOwnProperty(cat)) {
			    	$scope.evacuessDict[cat] = $scope.evacuessDict[cat] + 1;
			    } else {
			    	$scope.evacuessDict[cat] = 1;
			    }
			    if (evacuees[i].group != null) {
			    	for (var j = 0; j < evacuees[i].group.length; j++) {
					    var evacuee = evacuees[i].group[j];
					    var cat = evacuee.category;
					    if ($scope.evacuessDict.hasOwnProperty(cat)) {
					    	$scope.evacuessDict[cat] = $scope.evacuessDict[cat] + 1;
					    } else {
					    	$scope.evacuessDict[cat] = 1;
					    }
					}
			    }
			}
			$scope.evacuessLabels = Object.keys($scope.evacuessDict);
			$scope.evacuessValues = Object.values($scope.evacuessDict);

			if ($scope.evacuessLabels[0] != null && $scope.evacuessValues[0] != null) {
				xenia.bar.render("bar-chart", $scope.evacuessLabels, $scope.evacuessValues);
				//xenia.bar.render("pie-chart", $scope.evacuessLabels, [2, 22, 8, 2, 1, 6]);
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
				//$scope.evacueesData = response.data;
				processEvacuees(response.data);
			}, function(response) {
				console.error(response.data);
			});
		}

		$scope.getEvacuees();
		$scope.getStructures();

		
	} ]);

