(function () {
	'use strict';

	angular
	.module('F1App')
	.service('apiService', apiService);

	apiService.$inject = [
		'$http'
	];
	function apiService($http) {
		
		var service = {};
		
		service.getDrivers = getDrivers;
		service.getDriverDetails = getDriverDetails;
		service.getDriverRaces = getDriverRaces;
		
		return service;
		
		function getDrivers() {
			return $http({
				method: 'GET',
				url: 'http://ergast.com/api/f1/2016/driverStandings.json'
			}).then(handleSuccess, handleError('Error'));
		}
		
		function getDriverDetails(id) {
			return $http({
				method: 'GET',
				url: 'http://ergast.com/api/f1/2016/drivers/'+ id +'/driverStandings.json'
			}).then(handleSuccess, handleError('Error'));
		}
		
		function getDriverRaces(id) {
			return $http({
				method: 'GET',
				url: 'http://ergast.com/api/f1/2016/drivers/'+ id +'/results.json'
			}).then(handleSuccess, handleError('Error'));
		}
		
		function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
	}
})();