const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { PATH_BASE } = require("./utils/constants");
const products = require("./routes/products");
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use((req, res, next) => {
  const allowedOrigins = [process.env.CLIENT, process.env.ADMIN];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(PATH_BASE.PRODUCTS, products);
app.use(PATH_BASE.USER, users);
// app.use("/users", users);
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
