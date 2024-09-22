const jwt = require("jsonwebtoken");

const handleVerify = (req) => {
  const token = req.body.token;
  const cookieUser = req.cookies.user;
  const user = jwt.verify(cookieUser || token, process.env.JWT_SECRET);
  const userId = user._id;
  return { user, userId };
};

module.exports = handleVerify;
