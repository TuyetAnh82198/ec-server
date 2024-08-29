const jwt = require("jsonwebtoken");

const handleSetHeader = require("../utils/handleSetHeader");
const { RESPONSE_MESSAGES } = require("../utils/constants");

const isAuth = (req, res, next) => {
  const cookies = req.cookies.user;
  const token = req.body.token;
  if (!cookies || !token) {
    handleSetHeader();
    return res.status(200).json({ msg: RESPONSE_MESSAGES.LOGIN.NOT_LOGIN });
  } else {
    jwt.verify(cookies || token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        handleSetHeader();
        return res.status(400).json({
          msg: RESPONSE_MESSAGES.SESSION_EXPIRED,
        });
      } else {
        next();
      }
    });
  }
};

module.exports = isAuth;
