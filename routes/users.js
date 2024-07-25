const express = require("express");
const { body } = require("express-validator");

const { USER_PATHS } = require("../utils/constants");
const { register, login, logout, checkLogin } = require("../controllers/users");

const route = express.Router();

let loginValidate = [];
let registerValidate = [];
const handleGgLogin = () => {
  if (
    !body("Gmail").custom((value) => {
      return value;
    })
  ) {
    loginValidate = [
      body("Email").isEmail().withMessage("Please enter a valid email!"),
      body("Password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty!"),
    ];
    registerValidate = [
      ...loginValidate,
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
handleGgLogin();

route.post(USER_PATHS.REGISTER, registerValidate, register);
route.post(USER_PATHS.LOGIN, loginValidate, login);
route.get(USER_PATHS.LOGOUT, logout);
route.post(USER_PATHS.CHECK_LOGIN, checkLogin);

module.exports = route;
