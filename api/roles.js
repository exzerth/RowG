const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("gamer")
 .readOwn("users")
 .updateOwn("users")

ac.grant("admin")
 .extend("gamer")
 .readAny("users")
 .updateAny("users")
 .deleteAny("users")
 
return ac;
})();