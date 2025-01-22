const http = require("http");
const fs = require("fs").promises; // Use fs.promises
const path = require("path");
const mime = require("mime-types"); // To determine the file type based on extension

const port = 3005; // Choose a port
const rootDir = path.join(__dirname, "files"); // Folder where you store your files

const server = http.createServer(async (req, res) => {
  const filePath = path.join(rootDir, req.url === "/" ? "index.html" : req.url); // Serve index.html by default

  try {
    // Try to read the file
    const data = await fs.readFile(filePath);

    // Set the correct Content-Type based on the file's mime type
    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);

    res.statusCode = 200;
    res.end(data);
  } catch (err) {
    // Handle errors, such as file not found or server errors
    if (err.code === "ENOENT") {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("File Not Found");
    } else {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Internal Server Error");
    }
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
