import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer-config.middleware.js";
import checkBookOwner from "../middleware/book-owner.middleware.js";
import optimizeImage from "../middleware/image-optimizer.middleware.js";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBestRatedBooks,
  getOneBook,
  updateBook,
  rateBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/bestrating", getBestRatedBooks);
router.get("/:id", getOneBook);

router.post("/", auth, upload, optimizeImage, createBook);
router.put("/:id", auth, checkBookOwner, upload, optimizeImage, updateBook);
router.delete("/:id", auth, checkBookOwner, deleteBook);

router.post("/:id/rating", auth, rateBook);

export default router;
