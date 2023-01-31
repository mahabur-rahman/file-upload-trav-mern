const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" }); // bad request
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err); // internal server error
    }
  });

  return res
    .status(200)
    .json({ fileName: file.name, filePath: `/uploads/${file.name}` }); // success
});

// listen app
app.listen(5000, () => {
  console.log(`Server started...`);
});
