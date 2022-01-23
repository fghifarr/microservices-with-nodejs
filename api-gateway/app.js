const express = require("express"),
  cors = require('cors'),
  bodyParser = require("body-parser"),
  morgan = require("morgan");

const PORT = process.env.PORT || 1997;

// Configure env
require('dotenv').config({ debug: process.env.DOTENV_DEBUG == true });

// Initialize application-level middleware(s)
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Import routes
app.use(require('./src/api/api-gateway'));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Up and running the api gateway on http://localhost:${PORT}`);
});
