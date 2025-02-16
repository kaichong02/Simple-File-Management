const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

exports.uploadFile = async (req, res) => {
  try {
    const { description } = req.body;
    const newFile = new File({
      fileName: req.body.fileName || req.file.originalname,
      fileDescription: req.body.fileDescription,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: getFileExtension(req.file.mimetype),
    });

    await newFile.save();
    res.status(201).json({ message: "File uploaded!", file: newFile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.editFile = async (req, res) => {
  try {
    const { fileName, fileDescription } = req.body;
    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      { fileName, fileDescription },
      { new: true }
    );
    res.json(updatedFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!file.filePath) {
      return res.status(500).json({ error: "File path not found in database" });
    }

    const filePath = file.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    const filePath = path.resolve(file.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File does not exist on server" });
    }
    const downloadFile = `${file.fileName}.${file.fileType}`;
    res.download(filePath, downloadFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFileExtension = (mimeType) => {
  return mime.extension(mimeType) || "unknown";
};