const jwt = require("jsonwebtoken");

const CartModel = require("../models/Cart");
const handleErr = require("../utils/handleErr");
const { CART_STATUS, RESPONSE_MESSAGES } = require("../utils/constants");

const handleFindCart = async (id, status) => {
  const cart = await CartModel.findOne({
    user: id,
    status: status,
  }).populate("products.productId", "price");
  return cart;
};
const addToCart = async (req, res) => {
  try {
    const body = req.body;
    const token = body.token;
    const productId = body.productId;
    const quan = body.quan;

    const cookieUser = req.cookies.user;
    const user = jwt.verify(cookieUser || token, process.env.JWT_SECRET);
    const userId = user._id;

    let cart = await handleFindCart(userId, CART_STATUS.PICKING);
    let updateObject = {};
    let searchObject = { _id: cart?._id };
    if (!cart) {
      const newCart = new CartModel({
        user: userId,
        products: [
          {
            productId,
            quan,
          },
        ],
      });
      await newCart.save();
    } else {
      const existingProduct = cart.products.find(
        (p) => p.productId._id.valueOf() === productId
      );
      if (existingProduct) {
        searchObject["products.productId"] = productId;
        updateObject["$set"] = { "products.$.quan": quan };
      } else {
        updateObject["$push"] = {
          products: {
            productId,
            quan,
          },
        };
      }
      await CartModel.updateOne(searchObject, updateObject);
    }
    cart = await handleFindCart(userId, CART_STATUS.PICKING);
    updateObject = {
      totalAmount: cart.products.reduce(
        (acc, p) => acc + p.productId.price * p.quan,
        0
      ),
    };
    await CartModel.updateOne({ _id: cart._id }, updateObject);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.CART.ADD });
  } catch (err) {
    handleErr(res, err);
  }
};

module.exports = { addToCart };
