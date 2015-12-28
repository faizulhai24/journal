var app = angular.module('journal', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home',{
			url: '/home',
			templateUrl:'/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['postsFactory', function(postsFactory){
					//console.log('Coming here');
					return postsFactory.getAll();
				}]
			}
		})
		.state('posts',{
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostCtrl',
			resolve: {
				post: ['postsFactory', '$stateParams', function(postsFactory, $stateParams){
					return postsFactory.getPost($stateParams.id);
				}]
			}
		})
		.state('new',{
			url: '/new',
			templateUrl: '/newpost.html',
			controller: 'NewPostCtrl',
		});

	$urlRouterProvider.otherwise('/home');
}])

app.controller('MainCtrl', ['postsFactory', '$scope', function(postsFactory, $scope){
	$scope.newPost = {'title':'', 'body':''};
	$scope.posts = postsFactory.posts;

	$scope.deletePost = function(post){
		{
			var resp = confirm("Are you sure you want to delete the post titled\n" + post.title);
			if(resp){
				postsFactory.deletePost(post);
				$location.path('home');
			}
			else{
				return;				
			}
		}
	}
}])

app.controller('PostCtrl', ['postsFactory', '$scope', 'post', '$location' ,function(postsFactory, $scope, post, $location){
	$scope.post = post;
	$scope.editMode = false;

	$scope.deletePost = function(post){
		{
			postsFactory.deletePost(post);
			$location.path('home');
		}
	}
}])

app.controller('NewPostCtrl', ['postsFactory', '$scope', '$location' ,function(postsFactory, $scope,$location){
	$scope.post = {'title':'', 'body':''};
	$scope.editMode = true;

	$scope.addPost = function(){
		if($scope.post.title == '' || $scope.post.body =='')
		{
			$scope.error = 'Please fill both the fields.';
			return;
		}
		else{
			postsFactory.addPost({title: $scope.post.title, body: $scope.post.body});
			$scope.post.title = '';
			$scope.post.body = '';
			$location.path('home');
		}
	}

	$scope.goHome= function($event){
		$event.preventDefault();
		if($scope.post.title != '' || $scope.post.body != '')
		{
			var resp = confirm("You have unsaved changes. Are you sure you want to go back to the home page?");
			if(resp){
				$location.path('home');
			}
			else{
				return;				
			}
		}
		else{
			$location.path('home');
		}
	}
}])

app.factory('postsFactory', ['$http', function($http){
	var o = {
		posts:[]
	};

	o.getAll = function(){
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		})
	}

	o.getPost = function(id){
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		})
	}

	o.addPost = function(post){
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		})
	}

	o.savePost = function(id){
		return $http.post('/posts/' + post._id + '/save').then(function(res){
			return res.data;
		})
	}

	o.deletePost = function(post){
		return $http.post('/posts/' + post._id + '/delete').success(function(data){
			angular.copy(data, o.posts);
		})
	}

	return o;

}])