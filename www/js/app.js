// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var fbaseurl = "https://popping-torch-7991.firebaseio.com/";

var ref = new Firebase(fbaseurl);

angular.module('starter', ['ionic','firebase'])

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
		  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		  // for form inputs)
		  if(window.cordova && window.cordova.plugins.Keyboard) {
		    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  }
		  if(window.StatusBar) {
		    StatusBar.styleDefault();
		  }
		});
	})
	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider.state("login",{url:'/login', templateUrl:'templates/login-signup.html', controller:'LoginSignup'});
		$stateProvider.state("signup",{url:'/signup', templateUrl:'templates/signup.html', controller:'LoginSignup'});
		$urlRouterProvider.otherwise('/login');
	})
	.controller('LoginSignup',function($scope, $state, $ionicLoading){
		$scope.OpenRegistration = function(){
			$state.go('signup');
		}
		$scope.Login=function(user){
			$ionicLoading.show({template:'Please Wait..'});
			ref.authWithPassword({
				email    : user.email,
				password : user.passwd
			},function(err, authData){
				$ionicLoading.hide();
				if(err==null){
					alert("Login Successfull");
				}else{
					alert("Error while Login : "+err);
				}
			});
		};
	})
	.controller('Registration',function($scope, $state,$ionicLoading){
		$scope.register = function(user){
			
			$ionicLoading.show({template:'Please Wait..'});
			ref.createUser({					
					email    : user.email,
					password : user.passwd					
				},function(error) {
					if(error === null) {
						var key = user.email.replace(/@/g,'');
						key = key.replace(/\./g,'');
						ref.child("users").child(key).set({"fname":user.fname, "lname":user.lname, "phone":user.phone,"img":$scope.ImgData});
						$ionicLoading.hide();
						alert("Registration Successfull. Please login to continue.");	
						$state.go('login');					
					}else{
						alert("Error while Registration : "+error);
					}
				});
		}
		
		$scope.handleFileSelectAdd = function(evt) {
		  var f = evt.target.files[0];
		  var reader = new FileReader();
		  reader.onload = (function(theFile) {
		    return function(e) {
		      var filePayload = e.target.result;
		      $scope.ImgData = e.target.result; 
		      document.getElementById('pic').className = 'photo'; 
		      document.getElementById('pic').src = $scope.ImgData; 
		    };
		  })(f);
		  reader.readAsDataURL(f);
		};		
		document.getElementById('file-upload').addEventListener('change', $scope.handleFileSelectAdd, false);
	});



