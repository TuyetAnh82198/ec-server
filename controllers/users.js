const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
      console.log(body);
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
          // existingUser.pass = undefined;
          // req.session.user = existingUser;
          return res.status(400).json({ msg: "You are logged in!" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

module.exports = { register, login };
