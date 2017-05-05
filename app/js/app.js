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