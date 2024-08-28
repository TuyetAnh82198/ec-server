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
    let type = req.params.type;
    const inc = req.params.inc;
    const name = req.params.name;
    const search = {};
    if (name) {
      search.name = new RegExp(name, "i");
    }
    let products = [];
    let relatedProducts = [];
    let totalPage = 0;
    const page = req.query.page || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    let size = 0;
    const handleTotalPage = async (search) => {
      size = await ProductModel.countDocuments(search);
      return (totalPage = Math.ceil(size / limit));
    };
    switch (type) {
      case "top6":
        products = await ProductModel.find({ rank: { $lte: 6 } }).limit(limit);
        break;
      case "all":
        relatedProducts = await ProductModel.find(search)
          .sort({ price: inc === "inc" ? 1 : -1 })
          .skip(skip)
          .limit(limit);
        await handleTotalPage(search);
        break;
      default:
        const brand = new RegExp(type, "i");
        const searchFindOne =
          type.length < 24 ? { brand: brand } : { _id: type };
        products = await ProductModel.findOne(searchFindOne);
        search.brand = products.brand;
        relatedProducts = await ProductModel.find(search)
          .sort({ price: inc === "inc" ? 1 : -1 })
          .skip(skip)
          .limit(limit);
        await handleTotalPage(search);
    }
    return res.status(200).json({ products, relatedProducts, totalPage });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { addProduct, getProducts };
