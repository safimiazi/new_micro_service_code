import multer from "multer";
import path from "path";
import { v4 } from "uuid";

function getMulter({
  destination,
  regex = /jpeg|jpg|png/,
  images = "jpg, jpeg, png",
}) {
  const storageEngine = multer.diskStorage({
    destination: destination,
    filename: (_, file, cb) => {
      cb(
        null,
        `${v4()}-${file.originalname?.replace(/\s+/g, "-")}`.toLowerCase()
      );
    },
  });

  return multer({
    storage: storageEngine,
    limits: { fileSize: 10000000 * 5 },
    fileFilter: fileFilter(regex, images),
  });
}

function fileFilter(regex, images) {
  return function (_, file, cb) {
    const extName = regex.test(path.extname(file.originalname).toLowerCase());
    const mimeType = regex.test(file.mimetype);
    if (mimeType && extName) {
      return cb(null, true);
    }

    cb({ message: `You can only upload images ${images}.`, code: "multer" });
  };
}
export default getMulter;
