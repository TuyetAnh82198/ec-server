const ProductModel = require("../models/Product");
const handleVerify = require("../utils/handleVerify");
const { USER_INFOR, LIMIT } = require("../utils/constants");
const handleSocket = require("../utils/handleSocket");
const handleErr = require("../utils/handleErr");

const addProduct = async (req, res) => {
  try {
    const { user } = handleVerify(req);
    if (user.role === USER_INFOR.ROLE.ADMIN) {
      const body = req.body;
      const newProduct = new ProductModel({
        name: body.Name,
        desc: body.Description,
        price: Number(body.Price.replace(/[^\d]/g, "")),
        brand: body.Brand,
        imgs: req.files.map((file) => file.path),
      });
      await newProduct.save();
      return res.status(200).json({ msg: "Added!" });
    }
    return res.status(200).json({ msg: "Only admin can add products!" });
  } catch (err) {
    handleErr(res, err);
  }
};

const getProducts = async (req, res) => {
  try {
    let type = req.params.type;
    const inc = req.params.inc;
    const name = req.params.name;
    const search = { isDelete: { $ne: true } };
    if (name) {
      search.name = new RegExp(name, "i");
    }
    let products = [];
    let relatedProducts = [];
    let totalPage = 0;
    const page = req.params.page || 1;

    const skip = (page - 1) * LIMIT;
    let size = 0;
    const handleTotalPage = async (search) => {
      size = await ProductModel.countDocuments(search);
      return (totalPage = Math.ceil(size / LIMIT));
    };
    switch (type) {
      case "top6":
        products = await ProductModel.find({
          rank: { $lte: 6 },
          isDelete: { $ne: true },
        }).limit(LIMIT);
        break;
      case "all":
        relatedProducts = await ProductModel.find(search)
          .sort({ price: inc === "inc" ? 1 : -1 })
          .skip(skip)
          .limit(LIMIT);
        await handleTotalPage(search);
        break;
      default:
        const brand = new RegExp(type, "i");
        const searchFindOne = { isDelete: { $ne: true } };
        if (type.length < 24) {
          searchFindOne.brand = brand;
        } else {
          searchFindOne._id = type;
        }
        products = await ProductModel.findOne(searchFindOne);
        search.brand = products.brand;
        relatedProducts = await ProductModel.find(search)
          .sort({ price: inc === "inc" ? 1 : -1 })
          .skip(skip)
          .limit(LIMIT);
        await handleTotalPage(search);
    }
    return res.status(200).json({ products, relatedProducts, totalPage });
  } catch (err) {
    handleErr(res, err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { user } = handleVerify(req);
    if (user.role === USER_INFOR.ROLE.ADMIN) {
      const body = req.body;
      const productId = body.productId;
      const skip = (body.page - 1) * LIMIT;
      await ProductModel.updateMany(
        { _id: { $in: productId } },
        { isDelete: true }
      );
      const products = await ProductModel.find({
        isDelete: { $ne: true },
      })
        .skip(skip)
        .limit(LIMIT);
      handleSocket.productEmit.delete(products);
      return res.status(200).json({ msg: "Deleted!" });
    }
    return res.status(200).json({ msg: "Only admin can delete products!" });
  } catch (err) {
    handleErr(res, err);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { user } = handleVerify(req);
    if (user.role === USER_INFOR.ROLE.ADMIN) {
      const body = req.body;
      const id = req.params.id;
      const updateObject = {
        name: body.Name,
        desc: body.Description,
        price: Number(body.Price.replace(/[^\d]/g, "")),
        brand: body.Brand,
      };
      if (req.files.length > 0) {
        updateObject.imgs = req.files.map((file) => file.path);
      }
      const conditions = { _id: id, isDelete: { $ne: true } };
      await ProductModel.findOneAndUpdate(conditions, updateObject);
      handleSocket.productEmit.delete(products);
      return res.status(200).json({ msg: "Updated!" });
    }
    return res.status(200).json({ msg: "Only admin can update products!" });
  } catch (err) {
    handleErr(res, err);
  }
};

module.exports = { addProduct, getProducts, deleteProduct, updateProduct };
