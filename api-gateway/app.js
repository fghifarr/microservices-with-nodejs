const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  morgan = require('morgan'),
  rateLimit = require('express-rate-limit'),
  { createProxyMiddleware } = require('http-proxy-middleware'),
  routes = require('./src/config/routes');

const PORT = process.env.PORT || 1997;

// Configure env
require('dotenv').config({ debug: process.env.DOTENV_DEBUG == true });

// Initialize application-level middleware(s)
const app = express();
app.use(cors());
app.use(morgan('combined'));
routes.forEach((route) => {
  if (route.auth) app.use(route.url, require('./src/auth/apiKey'));
  app.use(route.url, rateLimit(route.rateLimit));
  app.use(route.url, createProxyMiddleware(route.proxy));
});
app.use(bodyParser.json());

// Import routes
app.use(require('./src/api/api-gateway'));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Up and running the api gateway on http://localhost:${PORT}`);
});
