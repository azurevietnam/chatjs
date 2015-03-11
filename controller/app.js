var app = angular.module('app',['ngRoute','appController']);

app.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl: 'view/home.html',
		controller: 'homeController'
	})
	.when('/login',{
		templateUrl: 'view/login.html',
		controller: 'loginController'
	})
	.when('/signup',{
		templateUrl: 'view/signup.html',
		controller: 'signupController'
	})
}]);