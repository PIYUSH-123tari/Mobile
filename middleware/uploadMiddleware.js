const multer = require("multer");
const { storage } = require("../config/cloudinary");

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(file.originalname.toLowerCase().split('.').pop());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error("Only PNG & JPEG allowed"));
};

module.exports = multer({
  storage,
  fileFilter
});
