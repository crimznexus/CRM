const app = require("../app");
const sequelize = require("../config/db");
require("../models");

let databaseReady;

function initializeDatabase() {
  if (!databaseReady) {
    databaseReady = (async () => {
      if (process.env.VERCEL && sequelize.getDialect() === "sqlite") {
        throw new Error(
          "A persistent MySQL database is required on Vercel. Configure DB_DIALECT=mysql and the DB_* environment variables."
        );
      }

      await sequelize.authenticate();
      await sequelize.sync();
    })().catch((error) => {
      databaseReady = undefined;
      throw error;
    });
  }

  return databaseReady;
}

module.exports = async (req, res) => {
  try {
    await initializeDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database initialization failed:", error);
    return res.status(503).json({
      message: "The API could not connect to its database.",
    });
  }
};
