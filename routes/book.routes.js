import express from "express";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer-config.middleware.js";
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
router.put("/:id", auth, upload, updateBook);
router.delete("/:id", auth, deleteBook);

export default router;
