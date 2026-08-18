// MULTER SETUP
const multer = require("multer");
const path = require("path");

// CONFIGURE WHERE AND HOW TO STORE UPLOADED FILES
const storage = multer.diskStorage({
  // SET DESTINATION FOLDER FOR UPLOADS
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // SET FILENAME FORMAT (TIMESTAMP + ORIGINAL NAME FOR UNIQUENESS)
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// CONFIGURE FILE FILTER TO ONLY ALLOW IMAGE FILES
const fileFilter = (req, file, cb) => {
  // ALLOWED IMAGE EXTENSIONS
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  // ALLOW ONLY VALID IMAGE FILES
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("ONLY IMAGE FILES ARE ALLOWED"));
  }
};

// CREATE MULTER INSTANCE WITH STORAGE, FILTER, AND FILE SIZE LIMITS
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // SET MAXIMUM FILE SIZE TO 2MB PER IMAGE
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = { upload };
