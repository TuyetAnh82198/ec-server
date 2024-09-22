const handleVerify = require("./handleVerify");
const { USER_INFOR } = require("./constants");

const handleIsAdmin = {
  isAdminPage: (req) => {
    return process.env.ADMIN === req.headers.origin;
  },
  isAdmin: (req) => {
    const { user } = handleVerify(req);
    return user.role === USER_INFOR.ROLE.ADMIN;
  },
};

module.exports = handleIsAdmin;
