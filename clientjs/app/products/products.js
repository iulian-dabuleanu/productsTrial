'use strict';

angular.module('myApp.products', ['ngRoute','ngResource'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/products', {
		templateUrl: 'products/products.html',
		controller: 'ProductsCtrl'
	});
	$routeProvider.when('/products/:id', {
		templateUrl: 'products/comments.html',
		controller: 'CommentsCtrl'
	});
}])
.controller('ProductsCtrl', ['$scope', '$route', 'Products', function($scope, $route, Products) {
	$scope.products = Products.query();
	$scope.product = {
			name: "",
			model: "",
			price: 0,
			description: "",
			comments: []
	};
	$scope.addProduct=function() {
		$scope.errors = {};
		function success(result) {
			$route.reload();
		};
		function failure(result) {
			var i;
			for (i = 0; i < result.data.length; i++) {
				var err = result.data[i];
				$scope.errors[err.param] = err.msg;
				$scope.newform[err.param].$error.server = true;
			}
		};
		Products.save(angular.copy($scope.product), success, failure);
	};
}])
.controller('CommentsCtrl', ['$scope', '$route', '$routeParams', 'Products', function($scope, $route, $routeParams, Products) {
	$scope.product = Products.get({'id': $routeParams.id});
	$scope.comment = {
			name: "",
			message: ""
	};
	$scope.addComment=function() {
		$scope.product.comments.push(angular.copy($scope.comment));
		Products.update(angular.copy($scope.product), function() {
			$route.reload();
		});
	};
}])
.factory('Products', [ '$resource', function($resource) {
	return $resource(
			"http://localhost:3000/api/product/:id",{id:'@id'},{
				update: {
					method: 'PUT',
					params: {
						id: "@name"
					}
				}
			});
}])
;