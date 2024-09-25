const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParse = require("cookie-parser");
require("dotenv").config();
const path = require("path");

const { PATH_BASE } = require("./utils/constants");
const products = require("./routes/products");
const users = require("./routes/users");
const cart = require("./routes/cart");
const { SOCKET } = require("./utils/constants");

const app = express();

app.use(
  "/assets/uploads",
  express.static(path.join(__dirname, "assets/uploads"))
);
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
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(PATH_BASE.PRODUCTS, products);
app.use(PATH_BASE.USER, users);
app.use(PATH_BASE.CART, cart);

app.use((req, res) => {
  return res.redirect(`${process.env.CLIENT}/123`);
});

const mongoose_connect_string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.g5ktxjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const handleHttpServer = (server, port) => {
  return server.listen(port);
};
const handleChat = (io, socket) => {
  socket.on(SOCKET.CHAT.SEND.CREATE_ROOM, (roomId) => {
    socket.join(roomId);
    io.emit(SOCKET.CHAT.RECEIVE.ROOM_CREATED, roomId);
  });
  socket.on(SOCKET.CHAT.JOIN_ROOM, (roomId) => {
    socket.join(roomId);
  });
  socket.on(SOCKET.CHAT.SEND.EMIT, (data) => {
    io.to(data.roomId).emit(SOCKET.CHAT.RECEIVE.EMIT.REPLY, data);
  });
  socket.on(SOCKET.CHAT.SEND.END_CHAT, (roomId) => {
    io.to(roomId).emit(SOCKET.CHAT.RECEIVE.EMIT.END_CHAT, roomId);
  });
};
const handleDisconnect = (socket) => {
  socket.on(SOCKET.DISCONNECT, () => {});
};
mongoose
  .connect(mongoose_connect_string)
  .then((result) => {
    const io = require("./socket.js").init(
      handleHttpServer(app, process.env.PORT || 5000)
    );
    io.on(SOCKET.CONNECT, (socket) => {
      handleChat(io, socket);
      handleDisconnect(socket);
    });
  })
  .catch((err) => console.log(err));
