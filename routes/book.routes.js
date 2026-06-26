import express from "express";
import {
  getAllBooks,
  getOneBook,
  getBestRatedBooks,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/bestrating", getBestRatedBooks);
router.get("/:id", getOneBook);

export default router;
