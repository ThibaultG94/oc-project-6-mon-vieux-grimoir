import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export default async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const sourcePath = req.file.path;
  const sourceName = path.parse(req.file.filename).name;
  const optimizedFilename = `${sourceName}-optimized.webp`;
  const optimizedPath = path.join(path.dirname(sourcePath), optimizedFilename);

  try {
    await sharp(sourcePath)
      .rotate()
      .resize({
        width: 800,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    await fs.unlink(sourcePath);

    req.file.filename = optimizedFilename;
    req.file.path = optimizedPath;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    await Promise.allSettled([fs.unlink(sourcePath), fs.unlink(optimizedPath)]);

    next(error);
  }
};
