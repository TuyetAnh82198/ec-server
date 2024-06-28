const PATH_BASE = {
  PRODUCTS: "/products",
  USER: "/user",
};

const PRODUCT_PATHS = {
  ADD: "/add",
};

const USER_PATHS = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  CHECK_LOGIN: "/check-login",
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
  },
  LOGOUT: {
    SUCCESS: "You are logged out!",
  },
};

const USER_INFOR = {
  COOKIE_NAME: "user",
};

module.exports = {
  PATH_BASE,
  PRODUCT_PATHS,
  USER_PATHS,
  SEND_MAIL_INFOR,
  RESPONSE_MESSAGES,
  USER_INFOR,
};
