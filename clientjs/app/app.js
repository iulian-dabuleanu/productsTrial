'use strict';

angular.module('myApp.products', []);
angular.module('myApp.version', []);

//Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [ 'ngRoute', 'ngResource',
		'myApp.products', 'myApp.version' ]);

myApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo : '/products'
	});
} ]);
