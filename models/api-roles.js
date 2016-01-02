var ApiRoles = function () { };
var uuid = require("node-uuid");
ApiRoles.REGISTERED_USER =  {
    "id": uuid.v4,
    "name": "Registered User"
};
ApiRoles.SUBSCRIBER = {
    "id": uuid.v4,
    "name": "Subscriber"
};
ApiRoles.MODERATOR = {
    "id": 3,
    "name": "Moderator"
};
ApiRoles.EDITOR = {
    "id": 4,
    "name": "Content Editor"
};
ApiRoles.CONTENT_MANAGER = {
    "id": 5,
    "name": "Content Manager"
};
ApiRoles.USER_MANAGER =  {
    "id": 6,
    "name": "User Manager"
};
ApiRoles.ROLE_MANAGER = {
    "id": 7,
    "name": "Role Manager"
};
ApiRoles.APPLICATION_MANAGER = {
    "id": 8,
    "name": "Application Manager"
};
ApiRoles.ADMINISTRATOR = {
    "id": 9,
    "value": "Administrator"
};
ApiRoles.API_SUPERVISOR = {
    "id": 10,
    "name": "API Supervisor"
};


module.exports = ApiRoles;