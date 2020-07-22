var express = require("express");
var app = express();
var multer = require("multer");
var cors = require("cors");
app.use(cors());
var fs = require("fs");

app.use(express.static("src"));

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    var name = req.headers.path;
    console.log(req.headers.path);
    console.log(file.originalname);
    fs.mkdir(name, () => {
      cb(null, name);
    });
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, "_"));
  }
});

var upload = multer({ storage: storage }).array("file");

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
      // A Multer error occurred when uploading.
    } else if (err) {
      return res.status(500).json(err);
      // An unknown error occurred when uploading.
    }

    return res.status(200).send(req.file);
    // Everything went fine.
  });
});

app.listen(8000, function() {
  console.log("App running on port 8000: ");
});
