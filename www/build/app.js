angular.module('F1App',[
    'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/drivers", {
            templateUrl: "partials/drivers.html",
            controller: "driversController",
        })
        .when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "detailController"})
        .otherwise({redirectTo: '/drivers'});

}]);
// angular.module('F1App.controllers', []).
// 
//   controller('driversController', function($scope, driversFromService) {
//     $scope.nameFilter = null;
//     $scope.driversList = [];
//     $scope.searchFilter = function (driver) {
//         var re = new RegExp($scope.nameFilter, 'i');
//         return !$scope.nameFilter || re.test(driver.Driver.givenName) || re.test(driver.Driver.familyName);
//     };
// 
//       $scope.driversList = driversFromService.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
// 
//   }).
// 
//   /* Driver controller */
//   controller('driverController', function($scope, $routeParams, ergastAPIservice) {
//     $scope.id = $routeParams.id;
//     $scope.races = [];
//     $scope.driver = null;
// 
//     ergastAPIservice.getDriverDetails($scope.id).success(function (response) {
//         $scope.driver = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]; 
//     });
// 
//     ergastAPIservice.getDriverRaces($scope.id).success(function (response) {
//         $scope.races = response.MRData.RaceTable.Races; 
//     }); 
// });
// 
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2RyaXZlcnNDb250cm9sbGVyLmpzIiwic2VydmljZXMvYXBpU2VydmljZS5qcyIsInNlcnZpY2VzL2ZsYWdTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ0YxQXBwJyxbXG4gICAgJ25nUm91dGUnXG5dKS5cbmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAud2hlbihcIi9kcml2ZXJzXCIsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL2RyaXZlcnMuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJkcml2ZXJzQ29udHJvbGxlclwiLFxuICAgICAgICB9KVxuICAgICAgICAud2hlbihcIi9kcml2ZXJzLzppZFwiLCB7dGVtcGxhdGVVcmw6IFwicGFydGlhbHMvZHJpdmVyLmh0bWxcIiwgY29udHJvbGxlcjogXCJkZXRhaWxDb250cm9sbGVyXCJ9KVxuICAgICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiAnL2RyaXZlcnMnfSk7XG5cbn1dKTsiLCIvLyBhbmd1bGFyLm1vZHVsZSgnRjFBcHAuY29udHJvbGxlcnMnLCBbXSkuXG4vLyBcbi8vICAgY29udHJvbGxlcignZHJpdmVyc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsIGRyaXZlcnNGcm9tU2VydmljZSkge1xuLy8gICAgICRzY29wZS5uYW1lRmlsdGVyID0gbnVsbDtcbi8vICAgICAkc2NvcGUuZHJpdmVyc0xpc3QgPSBbXTtcbi8vICAgICAkc2NvcGUuc2VhcmNoRmlsdGVyID0gZnVuY3Rpb24gKGRyaXZlcikge1xuLy8gICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCRzY29wZS5uYW1lRmlsdGVyLCAnaScpO1xuLy8gICAgICAgICByZXR1cm4gISRzY29wZS5uYW1lRmlsdGVyIHx8IHJlLnRlc3QoZHJpdmVyLkRyaXZlci5naXZlbk5hbWUpIHx8IHJlLnRlc3QoZHJpdmVyLkRyaXZlci5mYW1pbHlOYW1lKTtcbi8vICAgICB9O1xuLy8gXG4vLyAgICAgICAkc2NvcGUuZHJpdmVyc0xpc3QgPSBkcml2ZXJzRnJvbVNlcnZpY2UuZGF0YS5NUkRhdGEuU3RhbmRpbmdzVGFibGUuU3RhbmRpbmdzTGlzdHNbMF0uRHJpdmVyU3RhbmRpbmdzO1xuLy8gXG4vLyAgIH0pLlxuLy8gXG4vLyAgIC8qIERyaXZlciBjb250cm9sbGVyICovXG4vLyAgIGNvbnRyb2xsZXIoJ2RyaXZlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcywgZXJnYXN0QVBJc2VydmljZSkge1xuLy8gICAgICRzY29wZS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbi8vICAgICAkc2NvcGUucmFjZXMgPSBbXTtcbi8vICAgICAkc2NvcGUuZHJpdmVyID0gbnVsbDtcbi8vIFxuLy8gICAgIGVyZ2FzdEFQSXNlcnZpY2UuZ2V0RHJpdmVyRGV0YWlscygkc2NvcGUuaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4vLyAgICAgICAgICRzY29wZS5kcml2ZXIgPSByZXNwb25zZS5NUkRhdGEuU3RhbmRpbmdzVGFibGUuU3RhbmRpbmdzTGlzdHNbMF0uRHJpdmVyU3RhbmRpbmdzWzBdOyBcbi8vICAgICB9KTtcbi8vIFxuLy8gICAgIGVyZ2FzdEFQSXNlcnZpY2UuZ2V0RHJpdmVyUmFjZXMoJHNjb3BlLmlkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuLy8gICAgICAgICAkc2NvcGUucmFjZXMgPSByZXNwb25zZS5NUkRhdGEuUmFjZVRhYmxlLlJhY2VzOyBcbi8vICAgICB9KTsgXG4vLyB9KTtcbi8vICIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdC5tb2R1bGUoJ0YxQXBwJylcblx0LmNvbnRyb2xsZXIoJ2RldGFpbENvbnRyb2xsZXInLCBkZXRhaWxDb250cm9sbGVyKTtcblxuXHRkZXRhaWxDb250cm9sbGVyLiRpbmplY3QgPSBbXG5cdFx0JyRzY29wZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsXG5cdFx0J2FwaVNlcnZpY2UnLFxuXHRcdCdmbGFnU2VydmljZSdcblx0XTtcblx0ZnVuY3Rpb24gZGV0YWlsQ29udHJvbGxlcigkc2NvcGUsJHJvdXRlUGFyYW1zLGFwaVNlcnZpY2UsZmxhZ1NlcnZpY2UpIHtcblx0XHQkc2NvcGUuaWQgPSAkcm91dGVQYXJhbXMuaWQ7XG5cdCAgICAkc2NvcGUucmFjZXMgPSBbXTtcblx0ICAgICRzY29wZS5kcml2ZXIgPSBudWxsO1xuXHRcblx0ICAgIGFwaVNlcnZpY2UuZ2V0RHJpdmVyRGV0YWlscygkc2NvcGUuaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdCAgICAgICAgJHNjb3BlLmRyaXZlciA9IHJlc3BvbnNlLk1SRGF0YS5TdGFuZGluZ3NUYWJsZS5TdGFuZGluZ3NMaXN0c1swXS5Ecml2ZXJTdGFuZGluZ3NbMF07IFxuXHQgICAgfSk7XG5cdFxuXHQgICAgYXBpU2VydmljZS5nZXREcml2ZXJSYWNlcygkc2NvcGUuaWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHR2YXIgZGF0YSA9IHJlc3BvbnNlLk1SRGF0YS5SYWNlVGFibGUuUmFjZXM7XG5cdFx0XHRhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24odmFsdWUsa2V5KSB7XG5cdFx0XHRcdGZsYWdTZXJ2aWNlLmdldEZsYWdCeU5hbWUodmFsdWUuQ2lyY3VpdC5Mb2NhdGlvbi5jb3VudHJ5KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHR2YXIgY29sbGVjdGlvbiA9IGFuZ3VsYXIuZXh0ZW5kKHZhbHVlLHtmbGFnOnJlc1swXS5mbGFnfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHQkc2NvcGUucmFjZXMucHVzaChjb2xsZWN0aW9uKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KVxuXHQgICAgfSk7IFxuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdC5tb2R1bGUoJ0YxQXBwJylcblx0LmNvbnRyb2xsZXIoJ2RyaXZlcnNDb250cm9sbGVyJywgZHJpdmVyc0NvbnRyb2xsZXIpO1xuXG5cdGRyaXZlcnNDb250cm9sbGVyLiRpbmplY3QgPSBbXG5cdFx0JyRzY29wZScsXG5cdFx0J2FwaVNlcnZpY2UnLFxuXHRcdCdmbGFnU2VydmljZSdcblx0XTtcblx0ZnVuY3Rpb24gZHJpdmVyc0NvbnRyb2xsZXIoJHNjb3BlLGFwaVNlcnZpY2UsZmxhZ1NlcnZpY2UpIHtcblx0XHQkc2NvcGUubmFtZUZpbHRlciA9IG51bGw7XG5cdCAgICAkc2NvcGUuZHJpdmVyc0xpc3QgPSBbXTtcblx0ICAgICRzY29wZS5zZWFyY2hGaWx0ZXIgPSBmdW5jdGlvbiAoZHJpdmVyKSB7XG5cdCAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cCgkc2NvcGUubmFtZUZpbHRlciwgJ2knKTtcblx0ICAgICAgICByZXR1cm4gISRzY29wZS5uYW1lRmlsdGVyIHx8IHJlLnRlc3QoZHJpdmVyLkRyaXZlci5naXZlbk5hbWUpIHx8IHJlLnRlc3QoZHJpdmVyLkRyaXZlci5mYW1pbHlOYW1lKTtcblx0ICAgIH07XG5cdFx0XG5cdFx0YXBpU2VydmljZS5nZXREcml2ZXJzKCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHR2YXIgZGF0YSA9IHJlc3VsdC5NUkRhdGEuU3RhbmRpbmdzVGFibGUuU3RhbmRpbmdzTGlzdHNbMF0uRHJpdmVyU3RhbmRpbmdzO1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHZhbHVlLGtleSkge1xuXHRcdFx0XHRmbGFnU2VydmljZS5nZXRGbGFnKHZhbHVlLkRyaXZlci5uYXRpb25hbGl0eSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb24gPSBhbmd1bGFyLmV4dGVuZCh2YWx1ZSx7ZmxhZzpyZXNbMF0uZmxhZ30pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0JHNjb3BlLmRyaXZlcnNMaXN0LnB1c2goY29sbGVjdGlvbik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHQubW9kdWxlKCdGMUFwcCcpXG5cdC5zZXJ2aWNlKCdhcGlTZXJ2aWNlJywgYXBpU2VydmljZSk7XG5cblx0YXBpU2VydmljZS4kaW5qZWN0ID0gW1xuXHRcdCckaHR0cCdcblx0XTtcblx0ZnVuY3Rpb24gYXBpU2VydmljZSgkaHR0cCkge1xuXHRcdFxuXHRcdHZhciBzZXJ2aWNlID0ge307XG5cdFx0XG5cdFx0c2VydmljZS5nZXREcml2ZXJzID0gZ2V0RHJpdmVycztcblx0XHRzZXJ2aWNlLmdldERyaXZlckRldGFpbHMgPSBnZXREcml2ZXJEZXRhaWxzO1xuXHRcdHNlcnZpY2UuZ2V0RHJpdmVyUmFjZXMgPSBnZXREcml2ZXJSYWNlcztcblx0XHRcblx0XHRyZXR1cm4gc2VydmljZTtcblx0XHRcblx0XHRmdW5jdGlvbiBnZXREcml2ZXJzKCkge1xuXHRcdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRcdFx0dXJsOiAnaHR0cDovL2VyZ2FzdC5jb20vYXBpL2YxLzIwMTYvZHJpdmVyU3RhbmRpbmdzLmpzb24nXG5cdFx0XHR9KS50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvcicpKTtcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24gZ2V0RHJpdmVyRGV0YWlscyhpZCkge1xuXHRcdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRcdFx0dXJsOiAnaHR0cDovL2VyZ2FzdC5jb20vYXBpL2YxLzIwMTYvZHJpdmVycy8nKyBpZCArJy9kcml2ZXJTdGFuZGluZ3MuanNvbidcblx0XHRcdH0pLnRoZW4oaGFuZGxlU3VjY2VzcywgaGFuZGxlRXJyb3IoJ0Vycm9yJykpO1xuXHRcdH1cblx0XHRcblx0XHRmdW5jdGlvbiBnZXREcml2ZXJSYWNlcyhpZCkge1xuXHRcdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRcdFx0dXJsOiAnaHR0cDovL2VyZ2FzdC5jb20vYXBpL2YxLzIwMTYvZHJpdmVycy8nKyBpZCArJy9yZXN1bHRzLmpzb24nXG5cdFx0XHR9KS50aGVuKGhhbmRsZVN1Y2Nlc3MsIGhhbmRsZUVycm9yKCdFcnJvcicpKTtcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24gaGFuZGxlU3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZUVycm9yKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnJvciB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXHR9XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdC5tb2R1bGUoJ0YxQXBwJylcblx0LnNlcnZpY2UoJ2ZsYWdTZXJ2aWNlJywgZmxhZ1NlcnZpY2UpO1xuXG5cdGZsYWdTZXJ2aWNlLiRpbmplY3QgPSBbXG5cdFx0JyRodHRwJ1xuXHRdO1xuXHRmdW5jdGlvbiBmbGFnU2VydmljZSgkaHR0cCkge1xuXHRcdFxuXHRcdHZhciBzZXJ2aWNlID0ge307XG5cdFx0XG5cdFx0c2VydmljZS5nZXRGbGFnID0gZ2V0RmxhZztcblx0XHRzZXJ2aWNlLmdldEZsYWdCeU5hbWUgPSBnZXRGbGFnQnlOYW1lO1xuXHRcdFxuXHRcdHJldHVybiBzZXJ2aWNlO1xuXHRcdFxuXHRcdGZ1bmN0aW9uIGdldEZsYWcoaWQpIHtcblx0XHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0XHRcdHVybDogJ2h0dHBzOi8vcmVzdGNvdW50cmllcy5ldS9yZXN0L3YyL2RlbW9ueW0vJytpZFxuXHRcdFx0fSkudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3InKSk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIGdldEZsYWdCeU5hbWUoaWQpIHtcblx0XHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0XHRcdHVybDogJ2h0dHBzOi8vcmVzdGNvdW50cmllcy5ldS9yZXN0L3YyL25hbWUvJytpZFxuXHRcdFx0fSkudGhlbihoYW5kbGVTdWNjZXNzLCBoYW5kbGVFcnJvcignRXJyb3InKSk7XG5cdFx0fVxuXHRcdFxuXHRcdGZ1bmN0aW9uIGhhbmRsZVN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgbWVzc2FnZTogZXJyb3IgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblx0fVxufSkoKTsiXX0=
