const sharp = require("sharp");
const path = require("path");

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  const originalName = req.file.originalname
    .replace(/\s+/g, "_")
    .replace(/\.[^/.]+$/, "");

  const filename = `${Date.now()}-${originalName}.webp`;
  const outputPath = path.join("images", filename);

  await sharp(req.file.buffer).webp({ quality: 80 }).toFile(outputPath);

  req.file.filename = filename;

  next();
};
