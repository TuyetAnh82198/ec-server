const { validationResult } = require("express-validator");

const handleValidateErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errs = errors.array().map((e) => e.msg);
    return res.status(400).json({ errs: errs[0] });
  }
};
module.exports = handleValidateErrors;
