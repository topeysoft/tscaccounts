var tscServices = angular.module('tscServices', ['ngRoute', 'angular-storage']);


//.factory('UserInfo', ['$resource',
//function ($resource, store) {
//    var data = store.get("loginData");
//    var token = data.token;
//    return $resource('access/userinfo', {}, {
//        query: { method: 'POST', params: { access_token: token }, isArray: true }
//    });

//}])


tscServices
    .service('AccessWatcherService', function () {
        var service = this;
        service.needs_login = false;
        service.done_login = false;
        service.error_message = "";
       
    })

     .service('SiteWatcherService', function (store) {
         var service = this;

         service.page = {};
         service.layout = {};
         service.site = { layout: {} };

         service.setSite = function (site) {
             service.site = site
             store.set("site", site);
         }

         service.getSite = function () {
             service.site = store.get("site");

             return service.site;
         }

         service.getLayout = function () {
             service.layout = store.get("layout");

             return service.site;
         }

         service.setLayout = function (layout) {
             service.layout = layout;
             store.set("layout", layout);
         }
     })

    .service('HttpWatcherService', function () {
        var service = this;
        service.is_active = false;
    })


    .service('UserService', function (store, AccessWatcherService) {
        var service = this;
        var scope;
        service.setScope = function (s) {
            scope = s;
        };
        service.getUserUUID = function () {

            var user = service.getCurrentUser();
            return user.sub;
        }
        service.setCurrentUser = function (user) {
            AccessWatcherService.needs_login = false;
            store.set('user', scope.user);
        };

        service.getCurrentUser = function () {
            var currentUser = store.get('user');
            if (!currentUser) {
               // service.setCurrentUser();
                currentUser = store.get('user');
            }
            return currentUser;

        };

        service.clearCurrentUser = function () {
            store.remove('user');
            store.remove('loginData');
        }

        service.getToken = function () {
            var token = "";

            var data = store.get("loginData");
            try {
                token = data.access_token;
            } catch (e) {

            }


            return token;

        }
    })
    .service('AccessService', function (store, $location, $http, $compile, UserService, AccessWatcherService) {
        var service = this;
       
        service.closeLoginModal = function () {
            $('#loginModal').closeModal();
            $('.lean-overlay').remove();

            AccessWatcherService.needs_login = false;

        }

        service.getToken = function () {

            return UserService.getToken();

        }
        service.isLoggedIn = function () {
            var currtime = new Date().getTime();
            var data = store.get("loginData");

            if (data
                &&
                data.access_token
                &&
                data.access_token != ''
                &&
                data.exptime > currtime) {
            //alert("is logged in");
                return true;


        } else {
           // alert("is not logged in");
                return false;
            }

            
        };

        service.logOut = function () {
            //store.remove("loginTokenExpireIn");
            store.remove("loginData");
            store.remove("user");
            service.needs_login = true;
        };

        service.logIn = function (scope) {
            if (!scope.email
                || !scope.password
                || scope.email.length < 4
                || scope.password.length < 4
                ) {
                scope.login_error_message = "No tricks, Please.";
                return;
            }
            $http.post(main_config.urls.resource_url + 'access/authenticate', { "email": scope.email, "password": scope.password })
                .success(function (data) {
                //$scope.loginData = data;

                //futdate.setTime(expdate);

                //$cookies.put("loginToken", data.token);
                // window.localStorage.setItem("loginTokenExpireIn", futdate.getTime()); //$cookies.put("loginToken", data.token);
                // window.localStorage.setItem("persistLogin", $scope.persist_login); //$cookies.put("loginToken", data.token);
                scope.triedLogin = true;
                //$scope.login_success = data.success;
                console.log(data);
                if (data.success) {
                    var futdate = new Date();
                    var exptime = futdate.getTime();
                    exptime += data.extras.expires_in * 1000; //expires in 1 hour(milliseconds)
                    var loginData = data.extras;
                    loginData.exptime = exptime;
                    

                    store.set("loginData", loginData);
                   // var data = store.get("loginData");
                    //// Get user info
                    service.getUserInfo(scope);


                    ////service.redirectIfLoggedIn();
                } else {
                    var msg = "";
                    if (data.extras.msg == 0) {
                        msg ="Email not found";
                    } else {
                        msg = "Invalid credentials.";
                    }
                    ToastError(msg);
                    AccessWatcherService.error_message = msg;
                    scope.login_error_message = msg;
                }
            });


        };

        service.getUserInfo = function (scope) {
            var req = {
                method: 'GET',
                url: main_config.urls.resource_url + 'users/me',//$scope.config.urls.resource_url +  'access/userinfo',
                //headers: {
                //    'Authorization': 'Bearer ' + service.getToken()
                //},
                data: {}
            }
            $http(req).then(function (resp) {
                var data = resp.data;
                scope.login_success = data.success;
                if (data.success) {
                    
                    scope.user = data.extras;
                    UserService.setScope(scope);
                    UserService.setCurrentUser(scope.user);
                    AccessWatcherService.needs_login = false;


                    AccessWatcherService.done_login = true;

                   // window.location.reload(true);

                } else {
                    var msg = "Unable to fetch your info";
                    ToastError(msg);
                    AccessWatcherService.error_message = msg;
                    scope.login_error_message = msg;
                }
                //store.set('user', scope.user);
            });
        }

        service.refreshUser = function (scope) {
            if (service.isLoggedIn()) {
                service.getUserInfo(scope);
            }

        };

        service.checkLogin = function (scope) {
            
            if (service.isLoggedIn()) {
                //UserService.setScope(scope);
                scope.current_user = UserService.getCurrentUser();
            } else {
                AccessWatcherService.needs_login = true;
                //service.promptForLogin(scope);
                // service.loginModal
                //service.redirectIfNotLoggedIn();
            }

        };

        service.redirectIfNotLoggedIn = function (/* uri */) {
            var uri = arguments[0];
            if (!uri) uri = '/login';
            if (!service.isLoggedIn()) {
                service.loginModal
              //  $location.path(uri);
            }
        }
        service.redirectIfLoggedIn = function (/* uri */) {
            var uri = arguments[0];
            if (!uri) uri = '/dashboard';
            if (service.isLoggedIn()) {
                $location.path(uri);
            }
        }
        service.redirectTo = function (uri) {
            $location.path(uri);
        }
    })
   
.service('APIInterceptor', function ($rootScope, UserService, AccessWatcherService, HttpWatcherService) {
    var service = this;

    service.request = function (config) {
        HttpWatcherService.is_active = true;
        var access_token = UserService.getToken();
        // access_token = currentUser ? currentUser.access_token : null;

        if (access_token) {
            config.headers.authorization = "Bearer "+ access_token;
        }
        //  console.log(config.headers.authorization);
        return config;
    };
    service.response = function (response) {
        HttpWatcherService.is_active = false;

        return response; //keysToLower(response);
    };
    service.responseError = function (response) {
        HttpWatcherService.is_active = false;
        if (response.status === 401) {
            AccessWatcherService.needs_login = true;
            
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
});