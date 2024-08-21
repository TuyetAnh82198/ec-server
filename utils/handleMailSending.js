const nodemailer = require("nodemailer");

const { SEND_MAIL_INFOR } = require("./constants");

const handleMailSending = async (email, subject, html) => {
  const transport = nodemailer.createTransport({
    service: SEND_MAIL_INFOR.SERVICE,
    auth: {
      user: SEND_MAIL_INFOR.SENDER,
      pass: SEND_MAIL_INFOR.PASS,
    },
  });
  await transport.sendMail({
    from: SEND_MAIL_INFOR.SENDER,
    to: email,
    subject,
    html,
  });
};

module.exports = handleMailSending;
