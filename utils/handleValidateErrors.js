const { validationResult } = require("express-validator");

const handleValidateErrors = (req) => {
  const errors = validationResult(req);
  let errs;
  if (!errors.isEmpty()) {
    errs = errors.array().map((e) => e.msg);
  }
  return errs;
};
module.exports = handleValidateErrors;
