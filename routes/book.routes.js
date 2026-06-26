import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer-config.middleware.js";
import checkBookOwner from "../middleware/book-owner.middleware.js";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBestRatedBooks,
  getOneBook,
  updateBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/bestrating", getBestRatedBooks);
router.get("/:id", getOneBook);

router.post("/", auth, upload, createBook);
router.put("/:id", auth, checkBookOwner, upload, updateBook);
router.delete("/:id", auth, checkBookOwner, deleteBook);

export default router;
