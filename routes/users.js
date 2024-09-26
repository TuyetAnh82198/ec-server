const express = require("express");
const { body } = require("express-validator");

const { USER_PATHS } = require("../utils/constants");
const {
  register,
  login,
  logout,
  checkLogin,
  forgotPass,
  resetPass,
} = require("../controllers/users");

const route = express.Router();

const handleValidation = (type) => {
  const loginValidation = [
    body("Email").isEmail().withMessage("Please enter a valid email!"),
    body("Password").trim().notEmpty().withMessage("Password cannot be empty!"),
  ];
  if (type === "login") {
    return loginValidation;
  } else if (type === "register") {
    return [
      ...loginValidation,
      body("Password")
        .isLength({ min: 8 })
        .withMessage("Password must be more than 8 characters"),
      body("Fullname")
        .trim()
        .notEmpty()
        .withMessage("Full name cannot be empty!"),
      body("Phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number cannot be empty!"),
    ];
  }
};

const handleResetPass = () => {
  return [
    body("Pass")
      .isLength({ min: 8 })
      .withMessage("Password must be more than 8 characters"),
    body("ConfirmPass")
      .custom((value, { req }) => {
        return value === req.body.Pass;
      })
      .withMessage("Password and Confirm Password cannot be different"),
  ];
};

route.post(USER_PATHS.REGISTER, handleValidation("register"), register);
route.post(USER_PATHS.LOGIN, handleValidation("login"), login);
route.get(USER_PATHS.LOGOUT, logout);
route.post(USER_PATHS.CHECK_LOGIN, checkLogin);
route.post(USER_PATHS.FORGOT_PASS, forgotPass);
route.post(USER_PATHS.RESET_PASS, handleResetPass(), resetPass);

module.exports = route;
