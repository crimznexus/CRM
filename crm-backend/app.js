const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const frontendDistPath = path.resolve(__dirname, "../crm-frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("/", (req, res) => {
    res.sendFile(frontendIndexPath);
  });

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(frontendIndexPath);
  });
}

module.exports = app;