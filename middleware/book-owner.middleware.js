import mongoose from "mongoose";
import Book from "../models/Book.js";

export default async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: "Identifiant de livre invalide",
    });
  }

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Livre non trouvé",
      });
    }

    if (book.userId.toString() !== req.auth.userId) {
      return res.status(403).json({
        message: "Action non autorisée",
      });
    }

    req.book = book;

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
