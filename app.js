const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API Mon Vieux Grimoire OK" });
});

module.exports = app;
