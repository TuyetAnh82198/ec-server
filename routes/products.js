const express = require("express");

const handleUpload = require("../utils/multerFunction");
const { PRODUCT_PATHS } = require("../utils/constants");
const { addProduct } = require("../controllers/products");

const route = express.Router();

const upload = handleUpload();

route.post(PRODUCT_PATHS.ADD, upload.array("imgs", 3), addProduct);

module.exports = route;
