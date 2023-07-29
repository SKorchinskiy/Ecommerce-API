const path = require("path");
const multer = require("multer");

function getAvatarFolderPath() {
  return path.join(__dirname, "..", "..", "static", "avatar");
}

function getDefaultAvatarPath() {
  return path.join(
    __dirname,
    "..",
    "..",
    "static",
    "avatar",
    "avatar-default.png"
  );
}

function isImageMimeType(mimetype) {
  const pattern = /^image\/.*/;
  return pattern.test(mimetype);
}

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, getAvatarFolderPath());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const slash = file.mimetype.indexOf("/");
    const extension = file.mimetype.slice(slash + 1);
    return cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: function (req, file, cb) {
    const { mimetype } = file;
    if (isImageMimeType(mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("The mimetype of provided file is not an image!"));
  },
  limits: {
    fileSize: 1000000,
    fields: 0,
  },
});

module.exports = { uploadAvatar, getDefaultAvatarPath };
