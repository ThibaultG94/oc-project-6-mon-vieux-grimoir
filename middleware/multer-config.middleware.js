import multer from "multer";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  filename: (req, file, callback) => {
    const name = file.originalname
      .split(" ")
      .join("_")
      .replace(/\.[^/.]+$/, "");

    const extension = MIME_TYPES[file.mimetype];

    callback(null, `${name}-${Date.now()}.${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (!MIME_TYPES[file.mimetype]) {
    return callback(
      new Error("Format d'image non autorisé. Utilisez JPG, PNG ou WEBP.")
    );
  }

  callback(null, true);
};

export default multer({
  storage,
  fileFilter,
}).single("image");
