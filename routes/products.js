const express = require("express");
const { body } = require("express-validator");

const handleUpload = require("../utils/multerFunction");
const { PRODUCT_PATHS } = require("../utils/constants");
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/products");
const isAuth = require("../middleware/isAuth");

const route = express.Router();

const upload = handleUpload();

route.post(PRODUCT_PATHS.ADD, upload.array("imgs", 3), isAuth, addProduct);
route.get(PRODUCT_PATHS.GET, getProducts);
route.post(PRODUCT_PATHS.DELETE, deleteProduct);
route.post(
  PRODUCT_PATHS.UPDATE,
  upload.array("imgs", 3),
  isAuth,
  updateProduct
);

module.exports = route;
