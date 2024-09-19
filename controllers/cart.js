const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CartModel = require("../models/Cart");
const UserModel = require("../models/User");
const handleErr = require("../utils/handleErr");
const { CART_STATUS, RESPONSE_MESSAGES } = require("../utils/constants");
const handleSocket = require("../utils/handleSocket");

const handleFindCart = async (id, status, populateOption) => {
  const cart = await CartModel.findOne({
    user: id,
    status: status,
  }).populate("products.productId", populateOption);
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

    const populateOption = "imgs name price stock";
    let cart = await handleFindCart(
      userId,
      CART_STATUS.PICKING,
      populateOption
    );
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
    cart = await handleFindCart(userId, CART_STATUS.PICKING, populateOption);
    updateObject = {
      totalAmount: cart.products.reduce(
        (acc, p) => acc + p.productId.price * p.quan,
        0
      ),
    };
    await CartModel.updateOne({ _id: cart._id }, updateObject);
    cart.totalAmount = updateObject.totalAmount;
    handleSocket.cartEmit.add(cart);
    handleSocket.cartEmit.get(cart);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.CART.ADD });
  } catch (err) {
    handleErr(res, err);
  }
};

const getCart = async (req, res) => {
  try {
    const type = req.params.type;
    const body = req.body;
    const token = body.token;

    const cookieUser = req.cookies.user;
    const user = jwt.verify(cookieUser || token, process.env.JWT_SECRET);
    const userId = user._id;

    const populateOption = "imgs name price stock";
    const cart = await handleFindCart(
      userId,
      type ? "" : CART_STATUS.PICKING,
      populateOption
    );
    return res.status(200).json({ cart, user });
  } catch (err) {
    handleErr(res, err);
  }
};

const deleteCart = async (req, res) => {
  try {
    const body = req.body;
    const token = body.token;
    const productId = body.productId;
    const amount = body.amount;

    const cookieUser = req.cookies.user;
    const user = jwt.verify(cookieUser || token, process.env.JWT_SECRET);
    const userId = user._id;

    await CartModel.findOneAndUpdate(
      {
        user: userId,
        status: CART_STATUS.PICKING,
      },
      {
        $pull: { products: { productId: { $in: productId } } },
        $inc: { totalAmount: -amount },
      }
    );

    const populateOption = "imgs name price stock";
    const cart = await handleFindCart(
      userId,
      CART_STATUS.PICKING,
      populateOption
    );

    handleSocket.cartEmit.add(cart);
    handleSocket.cartEmit.get(cart);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.CART.DELETE });
  } catch (err) {
    handleErr(res, err);
  }
};

const checkout = async (req, res) => {
  try {
    const body = req.body;
    const inputs = req.body.inputs;
    const token = body.token;
    const method = req.params.method;

    const cookieUser = req.cookies.user;
    const user = jwt.verify(cookieUser || token, process.env.JWT_SECRET);
    const userId = user._id;

    await UserModel.updateOne(
      { _id: userId },
      {
        fullName: inputs.FullName,
        email: inputs.Email,
        address: inputs.Address,
        phone: inputs.Phone,
      }
    );

    const conditions = {
      user: userId,
      status: CART_STATUS.PICKING,
    };

    const updateObject = {
      status: CART_STATUS.UNPAID,
    };
    let sessionId;
    if (method === "creditcard") {
      const cart = await CartModel.findOne(conditions);
      const totalAmount =
        cart.totalAmount > 499000 ? cart.totalAmount : cart.totalAmount + 20000;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name: `Payment of invoice ${cart._id}`,
              },
              unit_amount: totalAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT}/payment-success`,
        cancel_url: `${process.env.CLIENT}/payment-fail`,
      });
      updateObject.stripeSessionId = session.id;
      sessionId = session.id;
    }

    await CartModel.updateOne(conditions, updateObject);
    handleSocket.cartEmit.checkout();
    const responseObject =
      method === "creditcard"
        ? { sessionId }
        : { msg: RESPONSE_MESSAGES.CART.CHECKOUT.UNPAID.WITHOUT_CARD };
    return res.status(200).json(responseObject);
  } catch (err) {
    handleErr(res, err);
  }
};

module.exports = { addToCart, getCart, deleteCart, checkout };
