const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define(
  "Task",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    workspaceId: { type: DataTypes.UUID, allowNull: false },
    leadId: { type: DataTypes.UUID, allowNull: true },
    createdById: { type: DataTypes.UUID, allowNull: false },
    assignedToId: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, defaultValue: "Call" },
    description: { type: DataTypes.TEXT, allowNull: true },
    dueAt: { type: DataTypes.DATE, allowNull: true },
    priority: { type: DataTypes.ENUM("Low", "Medium", "High"), defaultValue: "Medium" },
    status: { type: DataTypes.ENUM("Open", "Completed"), defaultValue: "Open" },
    reminderEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "tasks", timestamps: true }
);

module.exports = Task;
