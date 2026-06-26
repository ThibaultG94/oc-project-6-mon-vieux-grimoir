const express = require("express");
const bookController = require("../controllers/book.controller");

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/bestrating", bookController.getBestRatedBooks);
router.get("/:id", bookController.getOneBook);

module.exports = router;
