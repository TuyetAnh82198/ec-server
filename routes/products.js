const express = require("express");

const handleUpload = require("../utils/multerFunction");
const { PRODUCT_PATHS } = require("../utils/constants");
const { addProduct, getProducts } = require("../controllers/products");

const route = express.Router();

const upload = handleUpload();

route.post(PRODUCT_PATHS.ADD, upload.array("imgs", 3), addProduct);
route.get(PRODUCT_PATHS.GET, getProducts);

module.exports = route;
