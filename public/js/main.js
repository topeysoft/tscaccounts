// Import the module
var app = angular.module('MyApp',
    [
        "tscDirectives",
        'ngRoute',
        'tscServices',
        'tscControllers',
        'tscFilters'
    ]);

// Inject stBlurredDialog
app.config(['$routeProvider', '$httpProvider', '$locationProvider',
  function ($routeProvider, $httpProvider, $locationProvider) {

     // $locationProvider.hashPrefix('!');
      $routeProvider.

        when('/', {
            templateUrl: function (urlattr) {
                return '/templates/dashboard.html';
            },
            controller: 'DashCtrl',
            resolve: {
                "check": function ($location, AccessService) {

                }
            }
        })
      .when('/users', {
          templateUrl: function (urlattr) {
              return '/templates/user-list.html';
          },
          controller: 'UserCtrl',
          resolve: {
              "check": function ($location, AccessService) {

              }
          }
      })
           .when('/users/:id', {
               templateUrl: function (urlattr) {
                   return '/templates/user-detail.html';
               },
               controller: 'UserDetailCtrl',
               resolve: {
                   "check": function ($location, AccessService) {

                   }
               }
           })

          .when('/create/user', {
              templateUrl: function (urlattr) {
                  return '/templates/create-user.html';
              },
              controller: 'CreateUserCtrl',
              resolve: {
                  "check": function ($location, AccessService, AccessWatcherService) {
                      AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                  }
              }
          })

           .when('/permissions', {
               templateUrl: function (urlattr) {
                   return '/templates/permissions.html';
               },
               controller: 'PermissionCtrl',
               resolve: {
                   "check": function ($location, AccessService, AccessWatcherService) {
                       AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                   }
               }
           })

           .when('/list/:name', {
               templateUrl: function (urlattr) {
                   return '/templates/item-list.html';
               },
              controller: 'ItemListCtrl',
               resolve: {
                   "check": function ($location, AccessService, AccessWatcherService) {

                       AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                   }
               }
           })

          .when('/templates', {
              templateUrl: function (urlattr) {
                  return '/templates/template-list.html';
              },
              controller: 'TemplateListCtrl',
              resolve: {
                  "check": function ($location, AccessService, AccessWatcherService) {

                      AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                  }
              }
          })

           .when('/templates/:name', {
               templateUrl: function (urlattr) {
                   return '/templates/template-detail.html';
               },
               controller: 'TemplateDetailCtrl',
               resolve: {
                   "check": function ($location, AccessService, AccessWatcherService) {

                       AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                   }
               }
           })



      .when('/edit/:name/:id', {
          templateUrl: function (urlattr) {
              return '/templates/item-detail.html';
          },
          controller: 'ItemDetailCtrl',
          resolve: {
                "check":
                function ($routeParams, $location, AccessService, AccessWatcherService) {
                    //if ($routeParams.name == "templates" && $routeParams.id) {
                    //    $location.path("/templates/" + $routeParams.id)
                    //}
                    AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                }
            }
          
      })

          .when('/create/:name', {
              templateUrl: function (urlattr) {
                      return '/templates/create-item.html';
                  
              },
              controller: 'ItemCreateCtrl',
              resolve: {
                  "check": function ($routeParams, $location, AccessService, AccessWatcherService) {
                      if ($routeParams.name == "templates") {
                          $location.path("/templates/create")
                      }
                      AccessWatcherService.needs_login = !AccessService.isLoggedIn();
                  }
              }
          })

         

          //.when('/templates/create/:name', {
          //    templateUrl: function (urlattr) {
          //        return '/templates/create-template.html';

          //    },
          //    controller: 'TemplateDetailCtrl',
          //    resolve: {
          //        "check": function ($location, AccessService, AccessWatcherService) {
          //            AccessWatcherService.needs_login = !AccessService.isLoggedIn();
          //        }
          //    }
          //})

          .otherwise({
              templateUrl: '/templates/404.html',
              controller: 'Four04Ctrl',
              redirectTo: '/404'
          });

      // use the HTML5 History API
      if (window.history && window.history.pushState) {
          // $locationProvider.html5Mode(true);
      }

      $httpProvider.interceptors.push('APIInterceptor');
  }])
.service('APIInterceptor', function ($rootScope, UserService, AccessWatcherService, HttpWatcherService) {
    var service = this;

    service.request = function (config) {
        HttpWatcherService.is_active = true;
        var access_token = UserService.getToken();
        // access_token = currentUser ? currentUser.access_token : null;

        if (access_token) {
            config.headers.authorization = "Bearer " + access_token;
        }
        //  console.log(config.headers.authorization);
        return config;
    };
    service.response = function (response) {
        HttpWatcherService.is_active = false;

        return keysToLower(response);
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



var FuzzyDialog = function (options) {
    this.options = {
        fuzzyness: 7,
        element: {},
        selector:"body>div"
    };
    this.options = angular.extend(this.options, options);
    this.options.element = angular.element(this.options.element);
    this.vague = $(this.options.selector).Vague({
        intensity: this.options.fuzzyness,      // Blur Intensity
        forceSVGUrl: false,   // Force absolute path to the SVG filter,
        // default animation options
        animationOptions: {
            duration: 1,
            easing: 'linear' // here you can use also custom jQuery easing functions
        }
    });


    this.show = function () {
        this.options.element.show();
        this.vague.blur();
        // if (typeof ($scope.onShow) != "undefined") $scope.onShow();
    };
    this.hide = function () {
        this.options.element.hide();
        this.vague.unblur();

        //if (typeof ($scope.onHide) != "undefined") $scope.onHide();
    };
};
