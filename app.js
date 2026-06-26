import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API Mon Vieux Grimoire OK" });
});

export default app;
