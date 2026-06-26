import mongoose from "mongoose";
import Book from "../models/Book.js";

export const getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};

export const getOneBook = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: "Identifiant de livre invalide",
    });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: "Livre non trouvé",
        });
      }

      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};

export const getBestRatedBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};
