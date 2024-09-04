const handleErr = (res, err) => {
  return res.status(500).json({ msg: err.message });
};
module.exports = handleErr;
