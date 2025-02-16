const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  fileName: String,
  fileDescription: String,
  filePath: String,
  fileSize: Number,
  fileType: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", FileSchema);

