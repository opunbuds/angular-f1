(function () {
	'use strict';

	angular
	.module('F1App')
	.service('flagService', flagService);

	flagService.$inject = [
		'$http'
	];
	function flagService($http) {
		
		var service = {};
		
		service.getFlag = getFlag;
		service.getFlagByName = getFlagByName;
		
		return service;
		
		function getFlag(id) {
			return $http({
				method: 'GET',
				url: 'https://restcountries.eu/rest/v2/demonym/'+id
			}).then(handleSuccess, handleError('Error'));
		}
		
		function getFlagByName(id) {
			return $http({
				method: 'GET',
				url: 'https://restcountries.eu/rest/v2/name/'+id
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