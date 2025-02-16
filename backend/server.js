const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fileRoutes = require("./src/routes/file.routes");
const connectDB = require("./src/config/db.conf");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);

connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
});
