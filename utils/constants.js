const PATH_BASE = {
  PRODUCTS: "/products",
  USER: "/user",
  CART: "/cart",
};

const PRODUCT_PATHS = {
  ADD: "/add",
  GET: "/get/:type/:page/:inc?/:name?",
  DELETE: "/delete",
  UPDATE: "/update/:id",
};

const USER_PATHS = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  CHECK_LOGIN: "/check-login",
  FORGOT_PASS: "/forgot-pass",
  RESET_PASS: "/reset-pass",
};

const CART_PATHS = {
  ADD: "/add",
  GET: "/get/:type?",
  DELETE: "/delete",
  CHECKOUT: "/checkout/:method?",
  CHECK_PAYMENT: "/check-payment",
  HISTORY: "/history",
  HISTORY_DETAIL: "/history-detail/:id",
};

const SEND_MAIL_INFOR = {
  SERVICE: "gmail",
  SENDER: "tailieu22072023@gmail.com",
  PASS: "jkal cjew kxwe kmdn",
};

const RESPONSE_MESSAGES = {
  REGISTER: {
    SUCCESS: "Created!",
    USER_EXISTING: "User existing!",
  },
  LOGIN: {
    SUCCESS: "You are logged in",
    FAIL: "Wrong email or password!",
    NOT_LOGIN: "have not been logged in yet",
    SESSION_EXPIRED: "Your login session has expired, please log in again",
  },
  LOGOUT: {
    SUCCESS: "You are logged out!",
  },
  FORGOT_PASS: {
    SUCCESS: "Please check your email to reset your password.",
    FAIL: "This user is not registered.",
  },
  RESET_PASS: {
    SUCCESS: "Password reset successful.",
    FAIL: "Reset pass fail.",
  },
  CART: {
    ADD: "Added!",
    DELETE: "Deleted!",
    CHECKOUT: {
      UNPAID: { WITHOUT_CARD: "Order successful!" },
    },
  },
};

const USER_INFOR = {
  COOKIE_NAME: "user",
  ROLE: {
    ADMIN: "admin",
    CLIENT: "client",
  },
};

const CART_STATUS = {
  PICKING: "Picking",
  UNPAID: "Unpaid",
  PAID: "Paid",
};

const SOCKET = {
  CONNECT: "connection",
  DISCONNECT: "disconnecting",
  CART: {
    TITLE: "cart",
    ADD: "add",
    GET: "get",
    CHECKOUT: "checkout",
  },
  PRODUCTS: {
    TITLE: "products",
    DELETE: "delete",
  },
  CHAT: {
    JOIN_ROOM: "joinRoom",
    //client SEND, server RECEIVE
    SEND: {
      CREATE_ROOM: "createRoom",
      END_CHAT: "end chat",
      EMIT: "frontend send messages",
    },
    RECEIVE: {
      ROOM_CREATED: "roomCreated",
      EMIT: {
        REPLY: "server send messages",
        END_CHAT: "server send roomId to end chat",
      },
    },
  },
};

const LIMIT = 6;

module.exports = {
  PATH_BASE,
  PRODUCT_PATHS,
  USER_PATHS,
  CART_PATHS,
  SEND_MAIL_INFOR,
  RESPONSE_MESSAGES,
  USER_INFOR,
  CART_STATUS,
  SOCKET,
  LIMIT,
};
