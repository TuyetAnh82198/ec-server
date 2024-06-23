const multer = require("multer");

const handleUpload = () => {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "assets/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + file.originalname + "-" + Date.now());
    },
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  return multer({ storage: fileStorage, fileFilter: fileFilter });
};

module.exports = handleUpload;
