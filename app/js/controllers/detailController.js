(function () {
	'use strict';

	angular
	.module('F1App')
	.controller('detailController', detailController);

	detailController.$inject = [
		'$scope',
		'$routeParams',
		'apiService',
		'flagService'
	];
	function detailController($scope,$routeParams,apiService,flagService) {
		$scope.id = $routeParams.id;
	    $scope.races = [];
	    $scope.driver = null;
	
	    apiService.getDriverDetails($scope.id).then(function (response) {
	        $scope.driver = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]; 
	    });
	
	    apiService.getDriverRaces($scope.id).then(function (response) {
			var data = response.MRData.RaceTable.Races;
			angular.forEach(data, function(value,key) {
				flagService.getFlagByName(value.Circuit.Location.country).then(function (res) {
					var collection = angular.extend(value,{flag:res[0].flag});
									
					$scope.races.push(collection);
				});
			})
	    }); 
	}
})();