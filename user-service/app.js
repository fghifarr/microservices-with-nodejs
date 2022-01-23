const express = require("express"),
  mongoose = require("mongoose"),
  cors = require('cors'),
  bodyParser = require("body-parser");

// Configure env
require("dotenv").config({ debug: process.env.DOTENV_DEBUG == true });

const PORT = process.env.PORT || 1998;
const DB_URI = process.env.DB_URI;

// Initialize application-level middleware(s)
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
app.use(require("./src/api/user"));

// Start db connection
mongoose.connect(DB_URI, () => {
  console.log("Connected to MongoDB!");
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Up and running the user service on http://localhost:${PORT}`);
});
