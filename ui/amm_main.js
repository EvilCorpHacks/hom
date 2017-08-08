

app.controller('AmmMainController', [ '$scope', '$http',
	function($scope, $http) {

		$scope.structuresData = {
			"completamente assegnate" : 0,
			"parzialmente assegnate" : 0,
			"libere" : 0
		};

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
			}
		}

		var processStructure = function (structures) {
			$scope.structuresDict = {};

		}

		$scope.getStructures = function () {
			var req = {
				method : 'GET',
				url : "/api/structures"
			};
			$http(req).then(function(response) {
				console.log(response);
				for (var i = 0; i < response.data.length; i++) {
			    	var s = response.data[i];
			    	var diff = s.available_seats - s.total_seats;
			    	if (diff == 0) {
			    		$scope.structuresData["libere"] += 1;
			    	} else if (diff == -s.total_seats) {
			    		$scope.structuresData["completamente assegnate"] += 1;
			    	} else {
			    		$scope.structuresData["parzialmente assegnate"] += 1;
			    	}

				}
				xenia.pie.render("pie-chart",
					Object.keys($scope.structuresData),
					Object.values($scope.structuresData));
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
				processEvacuees(response.data);
			}, function(response) {
				console.error(response.data);
			});
		}

		$scope.getEvacuees();
		$scope.getStructures();


	} ]);

