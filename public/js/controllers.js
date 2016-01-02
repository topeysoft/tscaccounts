var tscControllers = angular.module('tscControllers', [])
 .controller('AppCtrl', ['$scope', '$log', '$http', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $log, $http, $routeParams, AccessService, UserService, AccessWatcherService) {
         $scope.login_modal = {};
         $scope.loader_modal = {};
         $scope.openModal = function () {
             //$scope.login_modal.show();
             $scope.loader_modal.show();

         };
         $scope.left_menu_items = [
             { icon: "dashboard", text: "Dashboard", url: "#/" },
             { icon: "person", text: "Users", url: "#/users" },
             { icon: "group", text: "Groups", url: "#/list/groups" },
             { icon: "settings_applications", text: "Clients", url: "#/list/clients" },
             { icon: "security", text: "Roles", url: "#/list/roles" },
             { icon: "verified_user", text: "Permissions", url: "#/list/permissions" },
             { icon: "swap_vert", text: "Scopes", url: "#/list/scopes/" },
             { icon: "playlist_add", text: "Templates", url: "#/templates/" }
         ];

         $scope.templates = [
             {
                 users: {
                     email: { type: "email", required: true },
                     password: { type: "password", required: true },
                     first_name: { type: "text", required: false },
                     last_name: { type: "text", required: false },
                     role: { type: ["roles"], required: true }
                 },
                 roles: {
                     name: { type: "text", required: true },
                     description: { type: "text", required: false },
                     permissions: { type: ["permissions"], required: true }
                 },
                 permissions: {
                     name: { type: "text", required: true },
                     description: { type: "text", required: false },
                     permissions: { type: ["permissions"], required: true }
                 }
             }
         ]
         $scope.field_types = [{
             name: "String", type: "text"
         },
         {
             name: "Password", type: "password"
         },
            { name: "Number", type: "Number" },
            { name: "Date", type: "Date" },
             { name: "Boolean", type: "checkbox" },
             { name: "array", type: "select" },
             { name: "Object", type: "file" },
             { name: "users", type: {} },
              { name: "roles", type: {} },

               { name: "permissions", type: {} },

         ];

         //$scope.field_types.push($scope.templates);

         $scope.init_select = function () {
             $('select').material_select();
         }

         $scope.toggleLeftMenu = function () {
             angular.element("body").toggleClass("show-left-menu");
         }

         $scope.logOut = function () {
             AccessService.logOut();
             AccessService.checkLogin($scope);
         };
         $scope.$watch(function () {
             return UserService.getCurrentUser();
         }, function () {
             $scope.current_user = UserService.getCurrentUser();
         });
         //$scope.$watchCollection(function () {
         //    return $routeParams;
         //}, function () {
         //    angular.element("body").removeClass("show-left-menu");
         //});
         AccessService.checkLogin($scope);

         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'admin/info',//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {
                console.log(data);
                 $scope.app_info = data.extras;

             }
         });
         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'api/roles',//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {

                 $scope.roles = data.extras;
                 $scope.app_info.role = $scope.roles;
                 // $log.debug($scope.roles);

             }
         });

         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'api/permissions',//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {
               
                $scope.permissions = data.extras;
                console.log("LOADED PERMISSIONS",data.extras);
                 $scope.app_info.permissions = $scope.permissions;
                 // $log.debug($scope.roles);

             }
         });
         $scope.s_columns = { email: true }; // selected columns
         $scope.e_columns = { email: true };  // enforced columns
         $scope.r_columns = { id: true }  // restricted columns
         //$scope.showSelectColumnDialog = function () {
         //    $('#show_c_dialog').openModal();
         //}
         //$scope.show_cln = {};
         //$scope.log_this = function () {
         //    $log.debug($scope.show_c);
         //};

         //$scope.toggleColumn = function (key, show_c) {
         //    console.log(show_c);
         //    console.log(key);
         //    angular.forEach($scope.show_c, function (v, k) {

         //        console.log(v);
         //        if (v == key) return true;
         //    })
         //}
     }])
.controller('DashCtrl', ['$scope', '$log', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $log, AccessService, UserService, AccessWatcherService) {


     }])
.controller('Four04Ctrl', ['$scope', '$log', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $log, AccessService, UserService, AccessWatcherService) {


     }])
.controller('UserCtrl', ['$scope', '$http', '$log', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, AccessService, UserService, AccessWatcherService) {
         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'users',//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {

                 $scope.users = data.extras;


             } else {

             }
             //store.set('user', scope.user);
         });

     }])
    .controller('PermissionCtrl', ['$scope', '$http', '$log', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, AccessService, UserService, AccessWatcherService) {
         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'users',//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {

                 $scope.users = data.extras;


             } else {

             }
             //store.set('user', scope.user);
         });

     }])
    .controller('RoleCtrl', ['$scope', '$http', '$log', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, AccessService, UserService, AccessWatcherService) {
         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'users',//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {

                 $scope.users = data.extras;


             } else {

             }
             //store.set('user', scope.user);
         });
         //$scope.$watchCollection('show_c',
         //    function () {
         //        $log.debug($scope.show_c);
         //    angular.forEach($scope.show_c, function (v, k) {
         //        $scope.show_this[k] = v;
         //    });
         //    $log.debug($scope.show_this);
         //})

     }])
.controller('UserDetailCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {
         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'users/' + $routeParams.id,//$scope.config.urls.resource_url +  'access/userinfo',
             //headers: {
             //    'Authorization': 'Bearer ' + service.getToken()
             //},
             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {

                 $scope.user = data.extras;
                 $scope.original_user = angular.copy($scope.user);
                 $scope.$watchCollection(function () {
                     return $scope.user;
                 }, function () {

                     if (!angular.equals($scope.user, $scope.original_user)) {
                         $scope.is_modified = true;
                     }
                 });

             } else {

             }
         });

         $scope.editable = true;
         $scope.saving_changes = false;
         $scope.is_modified = false;
         $scope.saveChanges = function () {
             $scope.saving_changes = true;
             var req = {
                 method: 'PUT',
                 url: main_config.urls.resource_url + 'users/' + $routeParams.id,//$scope.config.urls.resource_url +  'access/userinfo',
                 //headers: {
                 //    'Authorization': 'Bearer ' + service.getToken()
                 //},
                 data: { user: $scope.user }
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {
                     $scope.is_modified = false;
                     ToastSuccess();

                 } else {
                     ToastError();
                 }
                 $scope.saving_changes = false;
             },
             function () {
                 $scope.saving_changes = false;
             });
         }



     }])

    .controller('ItemDetailCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {
         $log.debug($routeParams);
         $scope.item_name = $routeParams.name;
         if ($routeParams.name && $routeParams.id) {
             var req = {
                 method: 'GET',
                 url: main_config.urls.resource_url + 'api/' + $routeParams.name
                     + '/' + $routeParams.id,//$scope.config.urls.resource_url +  'access/userinfo',
                 //headers: {
                 //    'Authorization': 'Bearer ' + service.getToken()
                 //},
                 data: {}
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {

                     $scope.item = data.extras;
                     if ($scope.item_name == 'roles' && (!$scope.item.permissions || $scope.item.permissions.length < 1)) {
                         $scope.item.permissions = [];
                         // $scope.item._permissions = $scope.$parent.permissions;
                         // $log.debug($scope.item);
                     }

                     $scope.original_item = angular.copy($scope.item);
                     $log.debug($scope.item);

                 }
             });
         }

         $scope.isCollection = function (value) {
             return angular.isObject(value);
         }
         $scope.editable = true;
         $scope.saving_changes = false;
         $scope.is_modified = false;
         $scope.saveChanges = function () {
             $scope.saving_changes = true;
             $log.debug($scope.item);
             var req = {
                 method: 'PUT',
                 url: main_config.urls.resource_url + 'api/' + $routeParams.name
                     + '/' + $routeParams.id,//$scope.config.urls.resource_url +  'access/userinfo',
                 //headers: {
                 //    'Authorization': 'Bearer ' + service.getToken()
                 //},
                 data: { item: $scope.item }
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {
                     $scope.is_modified = false;
                     ToastSuccess();

                 } else {
                     $log.debug(data);
                     ToastError();
                 }
                 $scope.saving_changes = false;
             },
             function (err) {
                 $log.debug(err);
                 $scope.saving_changes = false;
             });
         }

         $scope.$watchCollection(function () {
             return $scope.item;
         }, function () {

             if (!angular.equals($scope.item, $scope.original_item)) {
                 $scope.is_modified = true;
             }
         });
         $scope.is_new = false;



     }])

    .controller('ItemCreateCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {
         $log.debug($routeParams);
         $scope.item_name = $routeParams.name;



         if ($routeParams.name) {
             var req = {
                 method: 'GET',
                 url: main_config.urls.resource_url + 'admin/templates/' + $routeParams.name, //,$scope.config.urls.resource_url +  'access/userinfo',
                 //headers: {
                 //    'Authorization': 'Bearer ' + service.getToken()
                 //},
                 data: {}
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 $log.debug(data);
                 if (data.success) {
                     $scope.item = {};
                     $scope.item_template = data.extras.content;
                   
                     //if ($scope.item_name == 'roles' && (!$scope.item.permissions || $scope.item.permissions.length < 1)) {
                     //    $scope.item.permissions = [];
                     //    // $scope.item._permissions = $scope.$parent.permissions;
                     //    // $log.debug($scope.item);
                     //}

                     $scope.original_item = angular.copy($scope.item);
                     $log.debug($scope.item);

                 }
             }, function (err) {
                 $log.debug(err);
             });
         }

         $scope.isCollection = function (value) {
             return angular.isObject(value);
         }
         $scope.editable = true;
         $scope.saving_changes = false;
         $scope.is_modified = false;
         $scope.saveChanges = function () {
             $scope.saving_changes = true;
             $log.debug($scope.item);
             var req = {
                 method: 'POST',
                 url: main_config.urls.resource_url + 'api/' + $routeParams.name+"/create",//$scope.config.urls.resource_url +  'access/userinfo',
                
                 data: { item: $scope.item }
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {
                     $scope.is_modified = false;
                     ToastSuccess();

                 } else {
                     $log.debug(data);
                     ToastError();
                 }
                 $scope.saving_changes = false;
             },
             function (err) {
                 $log.debug(err);
                 $scope.saving_changes = false;
             });
         }

         $scope.$watchCollection(function () {
             return $scope.item;
         }, function () {

             if (!angular.equals($scope.item, $scope.original_item)) {
                 $scope.is_modified = true;
             }
         });
         $scope.is_new = false;
     }])

    .controller('ItemListCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {
         //$log.debug($routeParams);
         $scope.item_name = $routeParams.name;
         if ($routeParams.name) {
             var req = {
                 method: 'GET',
                 url: main_config.urls.resource_url + 'api/' + $scope.item_name,

                 data: {}
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {

                     $scope.items = data.extras;
                     //if ($scope.item_name == 'roles' && (!$scope.item.permissions || $scope.item.permissions.length < 1)) {
                     //    $scope.items.permissions = [];
                     //}

                     $log.debug($scope.items);

                 }
                 // $log.debug(data);
             },
             function (err) {

                 $log.debug(err);
             });
         }

         $scope.isCollection = function (value) {
             return angular.isObject(value);
         }
         $scope.s_columns = { name: true };
         $scope.e_columns = { content: true, name: true };
         $scope.r_columns = { selected: true, id: true };

         $scope.toggleSelectAll = function () {
             //$scope.select_all = !$scope.select_all;
             angular.forEach($scope.items,
                            function (v, k) {
                                v.selected = $scope.select_all;
                            });
         }


     }])

    .controller('TemplateDetailCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {



         $scope.item_name = $routeParams.name;
         if ($routeParams.name) {
             var req = {
                 method: 'GET',
                 url: main_config.urls.resource_url + 'admin/templates/' + $routeParams.name,//$scope.config.urls.resource_url +  'access/userinfo',

                 data: {}
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 $log.debug(data);
                 if (data.success) {

                     $scope.item = data.extras;
                     // $scope.item.content = [];
                     //if ($scope.item_name == 'roles' && (!$scope.item.permissions || $scope.item.permissions.length < 1)) {
                     //    $scope.item.permissions = [];
                     //    // $scope.item._permissions = $scope.$parent.permissions;
                     //    // $log.debug($scope.item);
                     //}

                     $scope.original_item = angular.copy($scope.item);
                     $log.debug($scope.item);

                 }
             },
             function (err) {
                 $log.debug(err);
             });
         }

         $scope.isCollection = function (value) {
             return angular.isObject(value);
         }
         $scope.editable = true;
         $scope.saving_changes = false;
         $scope.is_modified = false;
         $scope.saveChanges = function () {
             $scope.saving_changes = true;
             $log.debug($scope.item);
             var req = {
                 method: 'PUT',
                 url: main_config.urls.resource_url + 'admin/templates/' + $routeParams.name,//$scope.config.urls.resource_url +  'access/userinfo',
                 //headers: {
                 //    'Authorization': 'Bearer ' + service.getToken()
                 //},
                 data: { item: $scope.item }
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {
                     $scope.is_modified = false;
                     ToastSuccess();

                 } else {
                     $log.debug(data);
                     ToastError();
                 }
                 $scope.saving_changes = false;
             },
             function (err) {
                 $log.debug(err);
                 $scope.saving_changes = false;
             });
         }

         $scope.$watchCollection(function () {
             return $scope.item;
         }, function () {

             if (!angular.equals($scope.item, $scope.original_item)) {
                 $scope.is_modified = true;
             }
         });

         $scope.$watchCollection(function () {
             var c = '';
             try {
                 c = $scope.item.content
             } catch (e) {

             }
             return c;
         }, function () {

             if (!angular.equals($scope.item, $scope.original_item)) {
                 $scope.is_modified = true;
             }
         });

         $scope.is_new = false;




         $scope.addProperty = function () {
             $scope.item.content.push(angular.copy($scope.new_field));
             $scope.new_field = angular.copy($scope.new_field_template);
             $log.debug($scope.item.content);
         }

         //$scope.saveProperty = function () {
         //   $scope.new_field = {
         //        name: "",
         //        type: 1,
         //        required: false,
         //        default: ""
         //    }
         //    $log.debug($scope.item.content);
         //}

         $scope.new_field_template = {
             name: "",
             type: $scope.$parent.field_types[0],
             required: false,
             default: ""
         }
         $scope.new_field = angular.copy($scope.new_field_template);
     }])
     .controller('TemplateListCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {
         //$log.debug($routeParams);
         $scope.item_name = $routeParams.name;
         // if ($routeParams.name) {
         var req = {
             method: 'GET',
             url: main_config.urls.resource_url + 'admin/templates/',

             data: {}
         }
         $http(req).then(function (resp) {
             var data = resp.data;
             if (data.success) {

                 $scope.items = data.extras;
                 //if ($scope.item_name == 'roles' && (!$scope.item.permissions || $scope.item.permissions.length < 1)) {
                 //    $scope.items.permissions = [];
                 //}

                 $log.debug($scope.items);

             }
             $log.debug(data);
         },
         function (err) {

             $log.debug(err);
         });
         // }

         $scope.isCollection = function (value) {
             return angular.isObject(value);
         }
         $scope.s_columns = { name: true };
         $scope.e_columns = { content: true, name: true };
         $scope.r_columns = { selected: true, id: true };

         $scope.toggleSelectAll = function () {
             //$scope.select_all = !$scope.select_all;
             angular.forEach($scope.items,
                            function (v, k) {
                                v.selected = $scope.select_all;
                            });
         }


     }])


.controller('CreateUserCtrl', ['$scope', '$http', '$log', '$routeParams', 'AccessService', 'UserService', 'AccessWatcherService',
     function ($scope, $http, $log, $routeParams, AccessService, UserService, AccessWatcherService) {


         $scope.user = { first_name: "", last_name: "", email: "", password: "", role: { id: 0, text: "Subscriber" } };
         $scope.original_user = angular.copy($scope.user);
         $scope.$watchCollection(function () {
             return $scope.user;
         }, function () {

             if (!angular.equals($scope.user, $scope.original_user)) {
                 $scope.is_modified = true;
             }
         });
         $scope.editable = '';
         $scope.saving_changes = false;
         $scope.is_modified = false;
         $scope.saveChanges = function () {
             $scope.saving_changes = true;
             var req = {
                 method: 'POST',
                 url: main_config.urls.resource_url + 'users/create',//$scope.config.urls.resource_url +  'access/userinfo',
                 //headers: {
                 //    'Authorization': 'Bearer ' + service.getToken()
                 //},
                 data: { user: $scope.user }
             }
             $http(req).then(function (resp) {
                 var data = resp.data;
                 if (data.success) {
                     $scope.is_modified = false;
                     ToastSuccess();

                 } else {
                     ToastError();
                 }
                 $scope.saving_changes = false;
             },
             function () {
                 $scope.saving_changes = false;
             });
         }



     }]);