const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { DataTypes } = require("sequelize");
const app = require("./app");
const sequelize = require("./config/db");
require("./models"); // loads User/Workspace and sets up associations
require("dotenv").config();

const PORT = process.env.PORT || 5000;

async function cleanupLegacyLeadsSchema() {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable("leads");

  if (tableDefinition.name) {
    try {
      await queryInterface.changeColumn("leads", "name", {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      });
      console.log("✅ Made legacy leads.name nullable.");
    } catch (err) {
      if (err.original && err.original.code === "ER_BAD_FIELD_ERROR") {
        console.warn("⚠️ Legacy leads.name column not found when migrating.");
      } else {
        throw err;
      }
    }
  }

  const { Lead } = require("./models");
  for (const [columnName, attribute] of Object.entries(Lead.rawAttributes)) {
    if (!tableDefinition[columnName]) {
      try {
        await queryInterface.addColumn("leads", columnName, attribute);
        console.log(`✅ Added missing leads.${columnName} column.`);
      } catch (err) {
        if (err.original && err.original.code === "ER_DUP_FIELDNAME") {
          console.warn(`⚠️ Column leads.${columnName} already exists, skipping.`);
          continue;
        }
        throw err;
      }
    }
  }
}

async function ensureTaskSchema() {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable("tasks");

  if (tableDefinition.status) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        "UPDATE tasks SET status = 'Open' WHERE status = 'pending'",
        { transaction }
      );
      await queryInterface.changeColumn(
        "tasks",
        "status",
        {
          type: DataTypes.ENUM("Open", "Completed"),
          defaultValue: "Open",
          allowNull: false,
        },
        { transaction }
      );
    });
    console.log("✅ Normalized legacy tasks.status values to Open/Completed.");
  }

  if (tableDefinition.dueAt && !tableDefinition.dueAt.allowNull) {
    await queryInterface.changeColumn("tasks", "dueAt", { type: DataTypes.DATE, allowNull: true });
    console.log("✅ Made tasks.dueAt nullable.");
  }

  if (tableDefinition.createdById) {
    await queryInterface.changeColumn("tasks", "createdById", {
      type: DataTypes.STRING(36),
      allowNull: true,
    });
    console.log("✅ Aligned tasks.createdById with users.id.");
  } else {
    await queryInterface.addColumn("tasks", "createdById", {
      type: DataTypes.STRING(36),
      allowNull: true,
    });
    console.log("✅ Added missing tasks.createdById.");
  }

  if (tableDefinition.assignedToId) {
    await queryInterface.changeColumn("tasks", "assignedToId", {
      type: DataTypes.STRING(36),
      allowNull: true,
    });
    console.log("✅ Aligned tasks.assignedToId with users.id.");
  } else {
    await queryInterface.addColumn("tasks", "assignedToId", {
      type: DataTypes.STRING(36),
      allowNull: true,
    });
    console.log("✅ Added missing tasks.assignedToId.");
  }

  const requiredTaskColumns = {
    category: { type: DataTypes.STRING, defaultValue: "Call", allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    priority: { type: DataTypes.ENUM("Low", "Medium", "High"), defaultValue: "Medium", allowNull: false },
    reminderEnabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  };

  for (const [columnName, definition] of Object.entries(requiredTaskColumns)) {
    if (!tableDefinition[columnName]) {
      await queryInterface.addColumn("tasks", columnName, definition);
      console.log(`✅ Added missing tasks.${columnName} column.`);
    }
  }

  const legacyColumnsToDrop = ["initials", "subtitle"];
  for (const legacyColumn of legacyColumnsToDrop) {
    if (tableDefinition[legacyColumn]) {
      await queryInterface.removeColumn("tasks", legacyColumn);
      console.log(`✅ Dropped legacy tasks.${legacyColumn} column.`);
    }
  }
}

async function seedDemoData() {
  const { Workspace, User, Lead, Task } = require("./models");

  const existingAdmin = await User.findOne({ where: { email: "mina@northstar.co" } });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);
  const workspace = await Workspace.create({ companyName: "Northstar Studio", timeZone: "UTC", currency: "USD" });
  const admin = await User.create({
    fullName: "Mina Ali",
    email: "mina@northstar.co",
    phoneNumber: "+92 300 0000000",
    passwordHash,
    role: "admin",
    workspaceId: workspace.id,
    isEmailVerified: true,
  });

  const leads = await Lead.bulkCreate([
    {
      workspaceId: workspace.id,
      businessName: "Northstar Dental Care",
      ownerName: "Dr. Ayesha Khan",
      category: "Dental Clinic",
      phone: "+92 51 111 2222",
      email: "care@northstardental.com",
      website: "https://northstardental.com",
      address: "Islamabad, Pakistan",
      group: "Dentists",
      assignedTo: "Mina Ali",
      status: "Hot",
      source: "Manual Entry",
      notes: "High-value lead with active follow-up interest.",
      rating: 4.8,
      reviewsCount: 126,
    },
    {
      workspaceId: workspace.id,
      businessName: "Metro Bistro",
      ownerName: "Hassan Malik",
      category: "Restaurant",
      phone: "+92 42 333 4444",
      email: "hello@metrobistro.com",
      website: "https://metrobistro.com",
      address: "Lahore, Pakistan",
      group: "Restaurants",
      assignedTo: "Mina Ali",
      status: "Warm",
      source: "Google Maps",
      notes: "Interested in a new loyalty campaign.",
      rating: 4.6,
      reviewsCount: 89,
    },
    {
      workspaceId: workspace.id,
      businessName: "Brightline Gym",
      ownerName: "Farah Noor",
      category: "Fitness",
      phone: "+92 21 555 6666",
      email: "farah@brightlinegym.com",
      website: "https://brightlinegym.com",
      address: "Karachi, Pakistan",
      group: "Real Estate",
      assignedTo: "Mina Ali",
      status: "New",
      source: "Manual Entry",
      notes: "Potential expansion lead for the next quarter.",
      rating: 4.4,
      reviewsCount: 73,
    },
  ]);

  await Task.bulkCreate([
    {
      workspaceId: workspace.id,
      createdById: admin.id,
      assignedToId: admin.id,
      leadId: leads[0].id,
      title: "Schedule property tour with Northstar Dental Care",
      category: "Call",
      description: "Follow up on the dental clinic lead and confirm the campaign detail.",
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
      priority: "High",
      reminderEnabled: true,
      status: "Open",
    },
    {
      workspaceId: workspace.id,
      createdById: admin.id,
      assignedToId: admin.id,
      leadId: leads[1].id,
      title: "Confirm restaurant partnership meeting",
      category: "Meeting",
      description: "Send the offer deck for the next loyalty campaign.",
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      priority: "Medium",
      reminderEnabled: true,
      status: "Open",
    },
  ]);

  console.log("✅ Demo workspace seeded with sample leads and tasks.");
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    await sequelize.sync();
    await cleanupLegacyLeadsSchema();
    await ensureTaskSchema();
    await seedDemoData();
    console.log("✅ Models synced.");
  } catch (err) {
    console.error("⚠️ Database connection failed:", err.message || err);
    if (err.errors) {
      err.errors.forEach((e) => console.error(`   -> ${e.message}`));
    }
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://<this-PC's-IP>:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠️ Port ${PORT} is already in use.`);
      return;
    }
    console.error("Server startup error:", err);
  });
}

start();