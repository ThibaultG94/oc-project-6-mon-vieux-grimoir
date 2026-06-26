import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import Book from "../models/Book.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDirectory = path.join(__dirname, "..", "images");

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

export const createBook = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Image requise",
    });
  }

  let bookData;

  try {
    bookData = JSON.parse(req.body.book);
  } catch {
    return res.status(400).json({
      message: "Données de livre invalides",
    });
  }

  const { title, author, year, genre } = bookData;

  if (!title || !author || !year || !genre) {
    return res.status(400).json({
      message: "Tous les champs du livre sont requis",
    });
  }

  const book = new Book({
    userId: req.auth.userId,
    title,
    author,
    year,
    genre,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    ratings: [],
    averageRating: 0,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({
        message: "Livre enregistré !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

export const updateBook = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: "Identifiant de livre invalide",
    });
  }

  let bookData = req.body;

  if (typeof req.body.book === "string") {
    try {
      bookData = JSON.parse(req.body.book);
    } catch {
      return res.status(400).json({
        message: "Données de livre invalides",
      });
    }
  }

  const { title, author, year, genre } = bookData;

  if (!title || !author || !year || !genre) {
    return res.status(400).json({
      message: "Tous les champs du livre sont requis",
    });
  }

  const updatedBookData = {
    title,
    author,
    year,
    genre,
  };

  if (req.file) {
    updatedBookData.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }

  Book.findOneAndUpdate({ _id: req.params.id }, updatedBookData, {
    new: true,
    runValidators: true,
  })
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: "Livre non trouvé",
        });
      }

      res.status(200).json({
        message: "Livre modifié !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
};

export const deleteBook = async (req, res, next) => {
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

    const imagePathname = new URL(book.imageUrl).pathname;
    const imageFilename = path.basename(imagePathname);
    const imagePath = path.join(imagesDirectory, imageFilename);

    await Book.deleteOne({ _id: book._id });

    try {
      await fs.unlink(imagePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error(
          "Erreur lors de la suppression de l'image :",
          error.message
        );
      }
    }

    res.status(200).json({
      message: "Livre supprimé !",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
