const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User.js");
const { SEND_MAIL_INFOR } = require("../utils/constants");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = [];
      errors.array().forEach((err) => errs.push(err.msg));
      return res.status(400).json({ errs: errs[0] });
    } else {
      const body = req.body;
      const existingUser = await UserModel.findOne({ email: body.Email });
      if (existingUser) {
        return res.status(400).json({ msg: "User existing!" });
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
        return res.status(201).json({ msg: "Created!" });
      }
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errs = [];
      errors.array().forEach((err) => errs.push(err.msg));
      return res.status(400).json({ errs: errs[0] });
    } else {
      const body = req.body;
      const existingUser = await UserModel.findOne({ email: body.Email });
      if (!existingUser) {
        return res.status(400).json({ msg: "Wrong email or password!" });
      } else {
        const correctPass = bcrypt.compareSync(
          body.Password,
          existingUser.pass
        );
        if (!correctPass) {
          return res.status(400).json({ msg: "Wrong email or password!" });
        } else {
          const token = jwt.sign(
            { email: existingUser.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );
          res.cookie("user", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
          });
          return res.status(400).json({ msg: "Created!" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("user");
    return res.status(200).json({ msg: "You are logged out!" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const checkLogin = (req, res) => {
  try {
    jwt.verify(req.cookies.user, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ msg: "have not been logged in yet" });
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ msg: "You are logged in" });
      }
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { register, login, logout, checkLogin };
