var console = process.console;
var DAL = function () {
    this.roles = new (require('../dal/roles'));
    this.permissions = new (require('../dal/permissions'));
    //this.clients = new (require('../dal/clients'));
    this.users = new (require('../dal/users'));
  //this.lineages=  new (require('../dal/lineage'));
  //this.families=  new (require('../dal/family'));
  //this.generations=  new (require('../dal/generation'));
  //this.links=  new (require('../dal/link'));
};

//DAL.prototype.SearchAll = function (query, callback) {
//    var me = this;
//    me.kins.Search(query, callback);
//}

//DAL.prototype.GetLinksForItem = function (id, callback) {
//    var me = this;
//    me.links.GetMany({ $or: [{ from_id: id }, {to_id:id}] }, callback);
//}
// Must be called last the his file
module.exports = DAL;
