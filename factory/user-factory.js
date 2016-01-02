var UserFactory = function () {};

UserFactory.CreateFromUser = function (user) {
    var UserProfileModel = require('../models/user-profile.js');

    var userProfileModel = new UserProfileModel({
        id:user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
    });
    return userProfileModel;
}

UserFactory.CreateFromUserArray = function (userArray) {
    
    var userProfileArray = [];
    for (var i = 0, len = userArray.length; i < len; i++) {
        userProfileArray.push(UserFactory.CreateFromUser(userArray[i]));
    }

    return userProfileArray;
}

module.exports = UserFactory;