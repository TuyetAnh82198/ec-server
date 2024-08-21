const handleErr = (res, err) => {
  return res.status(500).json({ err: err.message });
};
module.exports = handleErr;
