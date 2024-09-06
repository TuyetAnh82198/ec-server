const { SOCKET } = require("./constants");
const io = require("../socket");

const handleSocket = {
  cartEmit: {
    add: (cart) => {
      return io.getIO().emit(SOCKET.CART.TITLE, {
        action: SOCKET.CART.ADD,
        cartNumber: cart.products.length,
      });
    },
    get: (cart) => {
      return io.getIO().emit(SOCKET.CART.TITLE, {
        action: SOCKET.CART.GET,
        cart,
      });
    },
  },
};

module.exports = handleSocket;
