const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = require("../models/User.js");
const { RESPONSE_MESSAGES, USER_INFOR } = require("../utils/constants");
const handleValidateErrors = require("../utils/handleValidateErrors");
const handleErr = require("../utils/handleErr");
const handleMailSending = require("../utils/handleMailSending");
const handleSetHeader = require("../utils/handleSetHeader");

const register = async (req, res) => {
  try {
    const errs = handleValidateErrors(req);
    if (errs) {
      return res.status(200).json({ errs: errs[0] });
    }
    const body = req.body;
    const email = body.Email;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: RESPONSE_MESSAGES.REGISTER.USER_EXISTING });
    } else {
      const newUser = new UserModel({
        email,
        pass: bcrypt.hashSync(body.Password, 8),
        fullName: body.Fullname,
        phone: body.Phone,
        role: body.role || "client",
      });
      await newUser.save();
      const subject = "Sign up successful";
      const html = `<h5>
      Congratulations! Your account registration was successful. You are
      now a member of our website. Enjoy a delightful shopping
      experience!
    </h5>`;
      handleMailSending(email, subject, html);
      return res.status(201).json({ msg: RESPONSE_MESSAGES.REGISTER.SUCCESS });
    }
  } catch (err) {
    handleErr(res, err);
  }
};

const login = async (req, res) => {
  try {
    const errs = handleValidateErrors(req);
    if (errs) {
      return res.status(400).json({ errs: errs[0] });
    }
    const handleLoginToken = (email) => {
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      let response = {
        msg:
          RESPONSE_MESSAGES.REGISTER.SUCCESS || RESPONSE_MESSAGES.LOGIN.SUCCESS,
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
      return res.status(200).json(response);
    };
    const body = req.body;
    const gmail = body.Gmail;
    const existingUser = await UserModel.findOne({
      email: body.Email || gmail,
    });
    if (!existingUser) {
      if (gmail) {
        const newUser = new UserModel({
          email: gmail,
          role: body.role || "client",
        });
        await newUser.save();
        await handleLoginToken(gmail);
      }
      return res.status(400).json({ msg: RESPONSE_MESSAGES.LOGIN.FAIL });
    } else {
      if (gmail) {
        await handleLoginToken(gmail);
      }
      const correctPass = bcrypt.compareSync(body.Password, existingUser.pass);
      if (!correctPass) {
        return res.status(400).json({ msg: RESPONSE_MESSAGES.LOGIN.FAIL });
      } else {
        await handleLoginToken(existingUser.email);
      }
    }
  } catch (err) {
    handleErr(res, err);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie(USER_INFOR.COOKIE_NAME);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.LOGOUT.SUCCESS });
  } catch (err) {
    handleErr(res, err);
  }
};

const checkLogin = (req, res) => {
  try {
    jwt.verify(
      req.cookies.user || req.body.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          handleSetHeader();
          res.status(200).json({ msg: RESPONSE_MESSAGES.LOGIN.NOT_LOGIN });
        } else {
          handleSetHeader();
          res.status(200).json({ msg: RESPONSE_MESSAGES.LOGIN.SUCCESS });
        }
      }
    );
  } catch (err) {
    handleErr(res, err);
  }
};

const forgotPass = async (req, res) => {
  const email = req.body.email;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const generateRandomString = (length) => {
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
    };
    const resetPassToken = generateRandomString(8);
    await UserModel.updateOne({ email }, { resetPassToken });
    const subject = "Reset your password";
    const html = `Click here to reset your password: ${process.env.CLIENT}/reset-pass/${resetPassToken}`;
    handleMailSending(email, subject, html);
    return res.status(200).json({ msg: RESPONSE_MESSAGES.FORGOT_PASS.SUCCESS });
  }
  return res.status(400).json({ msg: RESPONSE_MESSAGES.FORGOT_PASS.FAIL });
};

const resetPass = async (req, res) => {
  try {
    const errs = handleValidateErrors(req);
    if (errs) {
      return res.status(400).json({ errs: errs[0] });
    }
    const body = req.body;
    const token = body.Token;
    const existingUser = await UserModel.findOne({
      resetPassToken: token,
    });
    if (!existingUser) {
      return res.status(400).json({ msg: RESPONSE_MESSAGES.RESET_PASS.FAIL });
    }
    const newPass = bcrypt.hashSync(body.Pass, 8);
    await UserModel.updateOne(
      { resetPassToken: token },
      { pass: newPass, $unset: { resetPassToken: 1 } }
    );
    return res.status(200).json({ msg: RESPONSE_MESSAGES.RESET_PASS.SUCCESS });
  } catch (err) {
    handleErr(res, err);
  }
};

module.exports = { register, login, logout, checkLogin, forgotPass, resetPass };
