const express = require("express");

const { CART_PATHS } = require("../utils/constants");
const { addToCart } = require("../controllers/cart");

const route = express.Router();

route.post(CART_PATHS.ADD, addToCart);

module.exports = route;
