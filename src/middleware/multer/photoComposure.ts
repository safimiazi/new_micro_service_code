import sharp from "sharp";
import fs from "fs";
import { Blob } from "buffer";

const photoComposure = (
  path: string
): {
  single: any;
} => {
  const single = async (req, res, next) => {
    try {
      const { file } = req;

      if (!file) {
        return next();
      }

      const { filename, path } = file;

      const readFile = fs.readFileSync(path);

      await sharp(readFile)
        .webp({ quality: 100 })
        .toFile(path + ".webp");
      req.file.opt = filename + ".webp";

      // await sharp(readFile)
      //   .png({
      //     quality: 100,
      //   })
      //   .toFile(path + ".png");

      // req.file.opt = filename + ".png";

      await fs.unlinkSync(path);
      next();
    } catch (error) {
      console.log("🚀 ~ photoComposure ~ error:", error);
      next();
    }
  };
  return {
    single: single,
  };
};

export default photoComposure;
