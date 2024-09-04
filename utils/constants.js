const PATH_BASE = {
  PRODUCTS: "/products",
  USER: "/user",
  CART: "/cart",
};

const PRODUCT_PATHS = {
  ADD: "/add",
  GET: "/get/:type/:page/:inc?/:name?",
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
  },
};

const USER_INFOR = {
  COOKIE_NAME: "user",
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
  },
};
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
};
