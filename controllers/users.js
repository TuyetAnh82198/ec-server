const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User.js");
const {
  SEND_MAIL_INFOR,
  RESPONSE_MESSAGES,
  USER_INFOR,
} = require("../utils/constants");
const handleValidateErrors = require("../utils/handleValidateErrors");

const register = async (req, res) => {
  try {
    const errs = handleValidateErrors(req);
    if (errs) {
      return res.status(200).json({ errs: errs[0] });
    }
    const body = req.body;
    const existingUser = await UserModel.findOne({ email: body.Email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: RESPONSE_MESSAGES.REGISTER.USER_EXISTING });
    } else {
      const newUser = new UserModel({
        email: body.Email,
        pass: bcrypt.hashSync(body.Password, 8),
        fullName: body.Fullname,
        phone: body.Phone,
        role: body.role || "client",
      });
      await newUser.save();
      const transport = nodemailer.createTransport({
        service: SEND_MAIL_INFOR.SERVICE,
        auth: {
          user: SEND_MAIL_INFOR.SENDER,
          pass: SEND_MAIL_INFOR.PASS,
        },
      });
      await transport.sendMail({
        from: SEND_MAIL_INFOR.SENDER,
        to: body.Email,
        subject: "Sign up successful",
        html: `<h5>
                Congratulations! Your account registration was successful. You are
                now a member of our website. Enjoy a delightful shopping
                experience!
              </h5>`,
      });
      return res.status(201).json({ msg: RESPONSE_MESSAGES.REGISTER.SUCCESS });
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const login = async (req, res) => {
  try {
    const errs = handleValidateErrors(req);
    if (errs) {
      return res.status(400).json({ errs: errs[0] });
    }
    const body = req.body;
    const existingUser = await UserModel.findOne({ email: body.Email });
    if (!existingUser) {
      return res.status(400).json({ msg: RESPONSE_MESSAGES.LOGIN.FAIL });
    } else {
      const correctPass = bcrypt.compareSync(body.Password, existingUser.pass);
      if (!correctPass) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.LOGIN.FAIL });
      } else {
        const token = jwt.sign(
          { email: existingUser.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        let response = {
          msg:
            RESPONSE_MESSAGES.REGISTER.SUCCESS ||
            RESPONSE_MESSAGES.LOGIN.SUCCESS,
        };
        //deployed by a public suffix
        const isFirefox = req.headers["X-Browser"] === "Firefox";
        if (!isFirefox) {
          response = { ...response, noneFirefox: token };
        }
        //
        res.cookie(USER_INFOR.COOKIE_NAME, token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
        });
        return res.status(400).json(response);
      }
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie(USER_INFOR.COOKIE_NAME);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.LOGOUT.SUCCESS });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const checkLogin = (req, res) => {
  try {
    jwt.verify(
      req.cookies.user || req.body.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        const handleSetHeader = () => {
          return res.setHeader("Content-Type", "application/json");
        };
        if (err) {
          handleSetHeader();
          res.status(200).json({ msg: RESPONSE_MESSAGES.LOGIN.NOT_LOGIN });
        } else {
          handleSetHeader;
          res.status(200).json({ msg: RESPONSE_MESSAGES.LOGIN.SUCCESS });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { register, login, logout, checkLogin };
