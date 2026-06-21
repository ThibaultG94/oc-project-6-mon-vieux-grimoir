require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

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
