const ProductModel = require("../models/Product");

const addProduct = async (req, res) => {
  try {
    const body = req.body;
    const newProduct = new ProductModel({
      name: body.Name,
      desc: body.Description,
      price: Number(body.Price.replace(/[^\d]/g, "")),
      brand: body.Brand,
      imgs: req.files.map((file) => file.path),
    });
    await newProduct.save();
    return res.status(200).json({ message: "Added!" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const type = req.params.type;

    let products = [];
    let relatedProducts = [];
    switch (type) {
      case "top6":
        products = await ProductModel.find({ rank: { $lte: 6 } }).limit(6);
        break;
      default:
        products = await ProductModel.findOne({ _id: type });
        relatedProducts = await ProductModel.find({ brand: products.brand });
    }
    return res.status(200).json({ products, relatedProducts });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { addProduct, getProducts };
