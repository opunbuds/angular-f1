(function () {
	'use strict';

	angular
	.module('F1App')
	.controller('driversController', driversController);

	driversController.$inject = [
		'$scope',
		'apiService',
		'flagService'
	];
	function driversController($scope,apiService,flagService) {
		$scope.nameFilter = null;
	    $scope.driversList = [];
	    $scope.searchFilter = function (driver) {
	        var re = new RegExp($scope.nameFilter, 'i');
	        return !$scope.nameFilter || re.test(driver.Driver.givenName) || re.test(driver.Driver.familyName);
	    };
		
		apiService.getDrivers().then(function (result) {
			var data = result.MRData.StandingsTable.StandingsLists[0].DriverStandings;
			angular.forEach(data, function(value,key) {
				flagService.getFlag(value.Driver.nationality).then(function (res) {
					var collection = angular.extend(value,{flag:res[0].flag});
									
					$scope.driversList.push(collection);
				});
			})
		});
	}
})();