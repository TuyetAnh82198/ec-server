const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParse = require("cookie-parser");
require("dotenv").config();

const { PATH_BASE } = require("./utils/constants");
const products = require("./routes/products");
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());

const corsOption = {
  origin: [process.env.CLIENT, process.env.ADMIN],
  credentials: true,
};
app.use(cors(corsOption));

app.use((req, res, next) => {
  const allowedOrigins = [process.env.CLIENT, process.env.ADMIN];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(PATH_BASE.PRODUCTS, products);
app.use(PATH_BASE.USER, users);
// app.use("/cart", cart);

app.use((req, res) => {
  return res.redirect(`${process.env.CLIENT_APP}/123`);
});

const mongoose_connect_string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xtkgj9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(mongoose_connect_string)
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
