const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  getAllFiles,
  downloadFile,
  editFile,
  deleteFile,
} = require("../controllers/file.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getAllFiles);
router.put("/:id", editFile);
router.delete("/:id", deleteFile);
router.get("/download/:id", downloadFile);

module.exports = router;
