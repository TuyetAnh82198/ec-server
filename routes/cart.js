const express = require("express");

const { CART_PATHS } = require("../utils/constants");
const {
  addToCart,
  getCart,
  deleteCart,
  checkout,
  checkPayment,
  getHistory,
} = require("../controllers/cart");
const isAuth = require("../middleware/isAuth");

const route = express.Router();

route.post(CART_PATHS.ADD, isAuth, addToCart);
route.post(CART_PATHS.GET, isAuth, getCart);
route.post(CART_PATHS.DELETE, isAuth, deleteCart);
route.post(CART_PATHS.CHECKOUT, isAuth, checkout);
route.post(CART_PATHS.CHECK_PAYMENT, isAuth, checkPayment);
route.post(CART_PATHS.HISTORY, isAuth, getHistory);

module.exports = route;
