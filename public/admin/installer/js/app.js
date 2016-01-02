var app = angular.module("tsccmsinstaller",
    [
        //'ngRoute',
        //// 'ui.tinymce'
        // ,'tscServices'
        // , 'tscDirectives'
        //,"ngSanitize"
    ]
    );
//app.controller("AppCtrl", ["$scope", "$http", "$log", "AccessWatcherService","AccessService",
//    function ($scope, $http, $log, AccessWatcherService, AccessService) {
        
//    }])
app.controller("AppCtrl", ["$scope", "$http", "$log", "$location", 
    function ($scope, $http, $log, $location) {
        $scope.config = {};
        $scope.config = {
            mailer_config: {
                from: "Temitope Adeyeri <no-reply@topeysoft.com>",
                host: "smtp.gmail.com", // hostname 
                secureConnection: true, // use SSL 
                port: 465, // port for secure SMTP 
                transportMethod: "SMTP", // default is SMTP. Accepts anything that nodemailer accepts 
                auth: {
                    user: "topeysoft.apps@gmail.com",
                    pass: "tinbed123"
                }
            },
            jwt_options: {
                algorithm: "HS256",
                expiresIn: 3600,//expressed in seconds or an string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
                audience: "",
                subject: "TSC JWT",
                issuer: "TopeySoft Computers",
                noTimestamp: false,
                headers: {}
            },
            jwt_app_name: "tsc_cms",
            jwt_private_key: "tscd6F3Efeqtsc"
        };
        $scope.steps = steps;
        $scope.config.permissions = [
            { name: "VIEW_CONTENT", description: "A read-only permission that allows a user to view content", is_default: true },
            { name: "VIEW_USERS", description: "A read-only permission that allows a user to view a list of users" },
            { name: "CREATE_CONTENT", description: "Permission that allows a user to create content" },
            { name: "PUBLISH_CONTENT", description: "Permission that allows a user to publish" },
            { name: "DELETE_CONTENT", description: "Permission that allows a user to delete content" },
            { name: "UPLOAD_FILES", description: "Permission that allows a user to upload files" },
            { name: "DELETE_FILES", description: "Permission that allows a user to delete files" },
            { name: "MODIFY_CONTENT", description: "Permission that allows a user to view and modify application content" },
            { name: "MODIFY_LAYOUT", description: "Permission that allows a user to view and modify application layout" },
            { name: "CREATE_USERS", description: "Permission that allows a user to create users" },
            { name: "MODIFY_USERS", description: "Permission that allows a user to view and modify application users" },
            { name: "DELETE_USERS", description: "Permission that allows a user to delete registered users" },
            { name: "MANAGE_CONTENT", description: "Special permission that allows a user to manage content. This include create, modify and delete." },
            { name: "MANAGE_USERS", description: "Special permission that allows a user to manage users. This include create, modify and delete." },
            { name: "MANAGE_FILES", description: "Special permission that allows a user to manage files. This include create, modify and delete." },
            { name: "MANAGE_ROLES", description: "Special permission that allows a user to manage permissions. This include create, modify and delete." },
            { name: "MANAGE_PERMISSIONS", description: "Special permission that allows a user to manage permissions. This include create, modify and delete." },
            { name: "MANAGE_APPLICATION", description: "Super permission can override all other permisions. This should only be assigned to super user roles" }
        ];
        
        $scope.config.roles = [
            {
                name: "GUEST", description: "A read-only permission that allows a user to view content", is_default: true,
                permissions: {
                    
                }
            },
            {
                name: "SUBSCRIBER", description: "A read-only permission that allows a user to view a list of users",
                permissions: [$scope.config.permissions[0]]
            },
            {
                name: "CONTENT EDITOR", description: "Permission that allows a user to create content",
                permissions: [$scope.config.permissions[12]]
            },
            {
                name: "ADMINISTRATOR", description: "Permission that allows a user to publish",
                permissions: [$scope.config.permissions[12], $scope.config.permissions[13], 
                    $scope.config.permissions[14], $scope.config.permissions[15],
                    $scope.config.permissions[16]]
            },
            { name: "SUPER_USER", description: "Permission that allows a user to delete content",
                permissions: [$scope.config.permissions[17]]
            },
          ];
        $scope.site_types = [{
                text: "Blog", type: "blog"
            }, { text: "Website", type: "site" }]

        $scope.current_step = "welcome";
        $scope.$on("$locationChangeSuccess", function (event) {
            $scope.current_step = ($location.path()).replace("/", '') || "welcome";
            angular.forEach($scope.steps, function (v) {
                v.active = false;
            });
           // if ($scope.steps[$scope.current_step]) {
            try {
                $scope.steps[$scope.current_step].active = true;
            } catch (e) {

            }
           // }
            //$scope.step_template = '/admin/installer/partials' + $scope.current_step + '.html';
            $(".steps").hide();
            $(".steps#" + $scope.current_step).show();

            //alert($scope.current_step);
        });

        $scope.perfomInstall = function (){
            $http.post("", { setupData: $scope.config }).then(
                function Success (response){
                    console.log("SUCCESSFUL", response);
                },

                function Failure(err) {
                    console.log("FAILURE", err);
                })
        }
    }])
  //.config(['$routeProvider', '$httpProvider', '$locationProvider',
  //  function ($routeProvider, $httpProvider, $locationProvider) {
        
  //     // // $locationProvider.hashPrefix('!');
  //     // $routeProvider.

  //     // when('/step', {
  //     //     templateUrl: function (urlattr) {
  //     //         return '/partials/'+urlattr.step+'.html';
  //     //     },
  //     //     resolve: {
  //     //         "check": function ($location, AccessService) {

  //     //         }
  //     //     }
  //     // })
  //     //.otherwise({
  //     //     templateUrl: '/partials/welcome.html',
  //     //     //controller: 'Four04Ctrl',
  //     //     redirectTo: '/404'
  //     // });
        
  //     // // use the HTML5 History API
  //     // if (window.history && window.history.pushState) {
  //     //   // $locationProvider.html5Mode(true);
  //     // }
        
  //     // $httpProvider.interceptors.push('APIInterceptor');
  //  }])