const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharpMiddleware = require("../middleware/sharp-config");
const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.post("/", auth, multer, sharpMiddleware, bookCtrl.createBook);
router.put("/:id", auth, multer, sharpMiddleware, bookCtrl.modifyBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", bookCtrl.getOneBook);

module.exports = router;
