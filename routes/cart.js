const express = require("express");

const { CART_PATHS } = require("../utils/constants");
const { addToCart, getCart } = require("../controllers/cart");
const isAuth = require("../middleware/isAuth");

const route = express.Router();

route.post(CART_PATHS.ADD, isAuth, addToCart);
route.post(CART_PATHS.GET, isAuth, getCart);

module.exports = route;
