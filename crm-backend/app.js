const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const frontendDistPath = path.resolve(__dirname, "../crm-frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));
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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/leads", require("./routes/leadroute"));
app.use("/api/lead-discovery", require("./routes/Leaddiscoveryroutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/workspace", require("./routes/workspaceRoutes"));

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
