import "dotenv/config";
import http from "node:http";
import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 4000;

app.set("port", port);

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    server.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error", error.message);
  });
