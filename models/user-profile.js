var UserProfileModel = function(cnf) {
    this.id = cnf.id,
    this.email = cnf.email,
    this.first_name = cnf.first_name,
    this.last_name = cnf.last_name
    this.role = cnf.role
};

module.exports = UserProfileModel;
